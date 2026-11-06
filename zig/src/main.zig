//! zane: the Zane verifier as one executable (doc/design/BINARY.md).
//!
//!   zane check <file.zane> [file.zane ...] [options]     the verifier, text or --json (the C2 envelope)
//!   zane conformance [--level N] [--verbose]            the suite and its cross-checks, in one process
//!   zane pack [--check]                                the protocol pack's manifest, written or verified
//!   zane cross-medium [spec.json] [--verbose]          one declaration, two renderings, one law
//!   zane audit-facts [facts.json] [--rules 62,105]     the screenshot audit's facts and its decisions
//!   zane version                                       the law, the language, the contract, the build
//!
//! Stage S1 carries `check` and `version`; stage S2 adds `conformance`, `pack`, `cross-medium` and `audit-facts`. Each
//! prints byte for byte what its JavaScript prints (tools/zane/cli.js, conformance.js, pack.js, cross-medium.js and
//! doc/design/audit/check-facts.js), which tools/zane/parity.js proves. Exit codes: 0 clean
//! or conforming, 1 violations or mismatches found, 2 usage or read error. The usage text is cli.js's, so that
//! the two stay byte for byte the same; it names check only.

const std = @import("std");
const builtin = @import("builtin");
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const conformance = @import("conformance.zig");
const pack = @import("pack.zig");
const crossmedium = @import("crossmedium.zig");
const facts = @import("facts.zig");

const language_version = "1.5";

const usage =
    \\zane — the Zane verifier
    \\
    \\  zane check <file.zane> [file.zane …] [options]
    \\
    \\  --level N        conformance level, 1-4 (default 2)
    \\  --symbols FILE   JSON symbol table for Level 3 checks
    \\  --contract FILE  path to violations.json
    \\  --json           machine-readable output
    \\  --quiet          findings only
    \\  -h, --help       this text
    \\
    \\Level 2 is the honest default: everything decidable from one declaration.
    \\Level 3 checks are SKIPPED unless --symbols supplies what they need --
    \\undecidable is silence, never a pass.
    \\
    \\Specification: doc/language/ · Conformance: conformance/
;

/// JavaScript's parseInt(s, 10): optional space, optional sign, then the leading digits; NaN when there are none.
fn parseJsInt(s: ?[]const u8) ?i64 {
    const t = std.mem.trimLeft(u8, s orelse return null, " \t\r\n");
    var i: usize = 0;
    var neg = false;
    if (i < t.len and (t[i] == '+' or t[i] == '-')) {
        neg = t[i] == '-';
        i += 1;
    }
    const start = i;
    var n: i64 = 0;
    while (i < t.len and t[i] >= '0' and t[i] <= '9') : (i += 1) {
        n = n *| 10 +| (t[i] - '0');
    }
    if (i == start) return null;
    return if (neg) -n else n;
}

const Options = struct {
    files: std.ArrayList([]const u8) = .empty,
    level: ?i64 = 2, // null is NaN
    symbols: ?[]const u8 = null,
    contract: ?[]const u8 = null,
    json: bool = false,
    quiet: bool = false,
    help: bool = false,
    unknown: ?[]const u8 = null,
    command: ?[]const u8 = null,
};

fn parseArgs(a: std.mem.Allocator, argv: []const []const u8) !Options {
    var o: Options = .{};
    var i: usize = 0;
    while (i < argv.len) : (i += 1) {
        const arg = argv[i];
        if (std.mem.eql(u8, arg, "-h") or std.mem.eql(u8, arg, "--help")) {
            o.help = true;
        } else if (std.mem.eql(u8, arg, "--json")) {
            o.json = true;
        } else if (std.mem.eql(u8, arg, "--quiet")) {
            o.quiet = true;
        } else if (std.mem.eql(u8, arg, "--level")) {
            i += 1;
            o.level = parseJsInt(if (i < argv.len) argv[i] else null);
        } else if (std.mem.eql(u8, arg, "--symbols")) {
            i += 1;
            o.symbols = if (i < argv.len) argv[i] else null;
        } else if (std.mem.eql(u8, arg, "--contract")) {
            i += 1;
            o.contract = if (i < argv.len) argv[i] else null;
        } else if (std.mem.startsWith(u8, arg, "-")) {
            o.unknown = arg;
        } else if (o.command == null) {
            o.command = arg;
        } else {
            try o.files.append(a, arg);
        }
    }
    return o;
}

/// A lone surrogate (WTF-8, ED A0..BF xx) printed as console.log prints it: U+FFFD.
fn asText(a: std.mem.Allocator, s: []const u8) ![]const u8 {
    if (std.mem.indexOfScalar(u8, s, 0xED) == null) return s;
    var out: std.ArrayList(u8) = .empty;
    var i: usize = 0;
    while (i < s.len) {
        if (s[i] == 0xED and i + 2 < s.len and s[i + 1] >= 0xA0) {
            try out.appendSlice(a, "\xEF\xBF\xBD");
            i += 3;
        } else {
            try out.append(a, s[i]);
            i += 1;
        }
    }
    return out.toOwnedSlice(a);
}

fn loadSymbols(a: std.mem.Allocator, path: []const u8) !core.Symbols {
    const data = try std.fs.cwd().readFileAlloc(a, path, 64 * 1024 * 1024);
    const root = try std.json.parseFromSliceLeaky(std.json.Value, a, data, contract_mod.js_parse);
    var s: core.Symbols = .{};
    if (root != .object) return s;
    const keys = [_][]const u8{ "entities", "actors", "state", "elements" };
    inline for (keys) |k| {
        if (root.object.get(k)) |v| if (v == .array) {
            var list: std.ArrayList([]const u8) = .empty;
            for (v.array.items) |it| if (it == .string) try list.append(a, it.string);
            @field(s, k) = try list.toOwnedSlice(a);
        };
    }
    return s;
}

const Finding = struct {
    file: []const u8,
    diag: core.Diag,
    meta: contract_mod.Meta,
};

pub fn main() !void {
    var arena_state = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena_state.deinit();
    const a = arena_state.allocator();

    var out_buf: [16384]u8 = undefined;
    var out_w = std.fs.File.stdout().writer(&out_buf);
    const out = &out_w.interface;
    var err_buf: [4096]u8 = undefined;
    var err_w = std.fs.File.stderr().writer(&err_buf);
    const err = &err_w.interface;

    const code = run(a, out, err) catch |e| blk: {
        err.print("zane: {s}\n", .{@errorName(e)}) catch {};
        break :blk @as(u8, 2);
    };
    out.flush() catch {};
    err.flush() catch {};
    std.process.exit(code);
}

fn run(a: std.mem.Allocator, out: *std.Io.Writer, err: *std.Io.Writer) !u8 {
    const raw = try std.process.argsAlloc(a);
    const argv: []const []const u8 = if (raw.len > 0) raw[1..] else raw;
    // conformance.js reads its own arguments: --level N, --verbose or -v, and ignores the rest
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "conformance")) {
        var level: ?i64 = 4;
        var verbose = false;
        var i: usize = 1;
        while (i < argv.len) : (i += 1) {
            if (std.mem.eql(u8, argv[i], "--level")) {
                i += 1;
                level = parseJsInt(if (i < argv.len) argv[i] else null);
            } else if (std.mem.eql(u8, argv[i], "--verbose") or std.mem.eql(u8, argv[i], "-v")) verbose = true;
        }
        if (level == null or level.? < 1 or level.? > 4) {
            try err.print("--level must be 1..4\n", .{});
            return 2;
        }
        return conformance.run(a, out, level.?, verbose);
    }
    // the other S2 commands, each reading its arguments as its script does
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "pack")) {
        var check = false;
        for (argv[1..]) |x| if (std.mem.eql(u8, x, "--check")) {
            check = true;
        };
        return pack.run(a, out, err, check);
    }
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "cross-medium")) {
        var verbose = false;
        var spec: ?[]const u8 = null;
        for (argv[1..]) |x| {
            if (std.mem.eql(u8, x, "--verbose")) verbose = true;
            if (spec == null and !std.mem.startsWith(u8, x, "--")) spec = x;
        }
        return crossmedium.run(a, out, err, spec, verbose);
    }
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "audit-facts")) return facts.run(a, out, argv[1..]);
    const o = try parseArgs(a, argv);

    if (o.command != null and std.mem.eql(u8, o.command.?, "version") and !o.help) return version(out);

    if (o.help or o.command == null) {
        try out.print("{s}\n", .{usage});
        return if (o.help) 0 else 2;
    }
    if (o.unknown) |u| {
        try err.print("zane: unknown option {s}\n\n{s}\n", .{ u, usage });
        return 2;
    }
    if (!std.mem.eql(u8, o.command.?, "check")) {
        try err.print("zane: unknown command \"{s}\"\n\n{s}\n", .{ o.command.?, usage });
        return 2;
    }
    if (o.files.items.len == 0) {
        try err.print("zane: no files given\n\n{s}\n", .{usage});
        return 2;
    }
    const level_opt = o.level;
    if (level_opt == null or level_opt.? < 1 or level_opt.? > 4) {
        try err.print("zane: --level must be 1, 2, 3 or 4\n", .{});
        return 2;
    }
    const level = level_opt.?;

    // the contract: embedded, or the one the person names
    var contract_data: []const u8 = contract_mod.violations_json;
    if (o.contract) |p| {
        contract_data = std.fs.cwd().readFileAlloc(a, p, 64 * 1024 * 1024) catch |e| {
            try err.print("zane: cannot read {s}: {s}\n", .{ p, @errorName(e) });
            return 2;
        };
    }
    const contract = try contract_mod.loadContract(a, contract_data);
    const law = try contract_mod.loadLaw(a, contract_mod.rules_json);

    var symbols: ?core.Symbols = null;
    if (o.symbols) |p| {
        symbols = loadSymbols(a, p) catch |e| {
            try err.print("zane: cannot read symbols file {s}: {s}\n", .{ p, @errorName(e) });
            return 2;
        };
    }

    var findings: std.ArrayList(Finding) = .empty;
    for (o.files.items) |file| {
        const raw_src = std.fs.cwd().readFileAlloc(a, file, 256 * 1024 * 1024) catch |e| {
            try err.print("zane: cannot read {s}: {s}\n", .{ file, @errorName(e) });
            return 2;
        };
        const diags = try core.verify(a, try core.wellFormed(a, raw_src), symbols);
        for (diags) |d| {
            const m = contract.meta(d.id);
            const m_level: i64 = if (m.level == 0) 1 else m.level;
            if (m_level > level) continue; // above the claimed level
            try findings.append(a, .{ .file = file, .diag = d, .meta = m });
        }
    }

    var errors: usize = 0;
    for (findings.items) |f| if (std.mem.eql(u8, f.meta.severity, "error")) {
        errors += 1;
    };
    const warnings = findings.items.len - errors;

    if (o.json) {
        try writeJsonReport(a, out, o, contract, level, findings.items, errors, warnings);
        return if (errors > 0) 1 else 0;
    }

    for (findings.items) |f| {
        const where = if (f.diag.line != 0) try std.fmt.allocPrint(a, "{s}:{d}", .{ f.file, f.diag.line }) else f.file;
        const header = try std.fmt.allocPrint(a, "{s}  {s}  {s}  {s}", .{ where, f.meta.severity, f.diag.id, f.diag.subject orelse "" });
        try out.print("{s}\n", .{try asText(a, contract_mod.trimJsEnd(header))});
        if (f.meta.summary) |s| if (s.len > 0) try out.print("    {s}\n", .{s});
        const cite = try contract_mod.citation(a, f.meta, law);
        if (cite.len > 0) try out.print("    {s}\n", .{cite});
    }

    if (!o.quiet) {
        if (findings.items.len == 0) {
            if (contract.constitution) |c| {
                try out.print("clean — {d} file(s), 0 violations at level {d} against Zane v{s}\n", .{ o.files.items.len, level, c });
            } else {
                try out.print("clean — {d} file(s), 0 violations at level {d}\n", .{ o.files.items.len, level });
            }
        } else {
            try out.print("\n{d} error(s), {d} warning(s) across {d} file(s) at level {d}\n", .{ errors, warnings, o.files.items.len, level });
        }
    }
    return if (errors > 0) 1 else 0;
}

/// JSON.stringify({level, contract, files, counts, diagnostics}, null, 2), written by hand.
fn writeJsonReport(
    a: std.mem.Allocator,
    w: *std.Io.Writer,
    o: Options,
    contract: contract_mod.Contract,
    level: i64,
    findings: []const Finding,
    errors: usize,
    warnings: usize,
) !void {
    const j = contract_mod.writeJsonString;
    try w.print("{{\n  \"level\": {d},\n", .{level});
    try w.writeAll("  \"contract\": {");
    var first = true;
    if (contract.version) |v| {
        try w.writeAll("\n    \"version\": ");
        try j(w, v);
        first = false;
    }
    if (contract.constitution) |c| {
        try w.writeAll(if (first) "\n    \"constitution\": " else ",\n    \"constitution\": ");
        try j(w, c);
        first = false;
    }
    try w.writeAll(if (first) "},\n" else "\n  },\n");
    try w.writeAll("  \"files\": [");
    for (o.files.items, 0..) |f, i| {
        try w.writeAll(if (i == 0) "\n    " else ",\n    ");
        try j(w, f);
    }
    try w.writeAll(if (o.files.items.len == 0) "],\n" else "\n  ],\n");
    try w.print("  \"counts\": {{\n    \"errors\": {d},\n    \"warnings\": {d}\n  }},\n", .{ errors, warnings });
    try w.writeAll("  \"diagnostics\": [");
    for (findings, 0..) |f, i| {
        try w.writeAll(if (i == 0) "\n    {\n" else ",\n    {\n");
        try w.writeAll("      \"code\": ");
        try j(w, f.diag.id);
        try w.writeAll(",\n      \"severity\": ");
        try j(w, f.meta.severity);
        try w.writeAll(",\n      \"message\": ");
        const message: []const u8 = blk: {
            if (f.meta.summary) |s| if (s.len > 0) break :blk s;
            if (f.diag.subject) |s| if (s.len > 0) break :blk try std.fmt.allocPrint(a, "{s}: {s}", .{ f.diag.id, s });
            break :blk f.diag.id;
        };
        try j(w, message);
        try w.writeAll(",\n      \"span\": {\n        \"file\": ");
        try j(w, f.file);
        try w.print(",\n        \"line\": {d}\n      }},\n", .{f.diag.line});
        // cites: rule:, article:, right:, pattern:
        var cites: std.ArrayList([]const u8) = .empty;
        for (f.meta.rules) |r| try cites.append(a, try std.fmt.allocPrint(a, "rule:{s}", .{r}));
        for (f.meta.articles) |x| try cites.append(a, try std.fmt.allocPrint(a, "article:{s}", .{x}));
        for (f.meta.rights) |x| try cites.append(a, try std.fmt.allocPrint(a, "right:{s}", .{x}));
        for (f.meta.forbidden_patterns) |x| try cites.append(a, try std.fmt.allocPrint(a, "pattern:{s}", .{x}));
        try w.writeAll("      \"cites\": [");
        for (cites.items, 0..) |c, k| {
            try w.writeAll(if (k == 0) "\n        " else ",\n        ");
            try j(w, c);
        }
        try w.writeAll(if (cites.items.len == 0) "],\n" else "\n      ],\n");
        try w.writeAll("      \"language\": \"zane\",\n");
        const lvl: i64 = if (f.meta.level == 0) 1 else f.meta.level;
        try w.print("      \"level\": {d},\n      \"subject\": ", .{lvl});
        if (f.diag.subject) |s| try j(w, s) else try w.writeAll("null");
        try w.writeAll("\n    }");
    }
    try w.writeAll(if (findings.len == 0) "]\n}\n" else "\n  ]\n}\n");
}

fn version(out: *std.Io.Writer) !u8 {
    const contract = contract_mod.loadContract(std.heap.page_allocator, contract_mod.violations_json) catch return 2;
    try out.print("zane (stage S2: check, conformance, pack, cross-medium, audit-facts) · law v{s} · language {s} · contract v{s} · {s} · {s}-{s}\n", .{
        contract.constitution orelse "?",
        language_version,
        contract.version orelse "?",
        @tagName(builtin.mode),
        @tagName(builtin.cpu.arch),
        @tagName(builtin.os.tag),
    });
    return 0;
}

test {
    _ = contract_mod;
    _ = @import("schema.zig");
    _ = @import("js.zig");
}
