//! zane: the Zane verifier as one executable (doc/design/BINARY.md).
//!
//!   zane check <file.zane> [file.zane ...] [options]     the verifier, text or --json (the C2 envelope)
//!   zane conformance [--level N] [--verbose]            the suite and its cross-checks, in one process
//!   zane pack [--check]                                the protocol pack's manifest, written or verified
//!   zane cross-medium [spec.json] [--verbose]          one declaration, two renderings, one law
//!   zane audit-facts [facts.json] [--rules 62,105]     the screenshot audit's facts and its decisions
//!   zane serve [--root DIR | --app DIR] [--port N]     the site, the Reader and the audit, or another site beside the audit
//!   zane site facts|shell|grid [--write]               this site's own build checks, run from the repository's root
//!   zane version                                       the law, the language, the contract, the build
//!   zane --version                                     the release's version: zane 0.1.0
//!
//! Stage S1 carries `check` and `version`; stage S2 adds `conformance`, `pack`, `cross-medium` and `audit-facts`; stage S3
//! builds the same core for a browser (wasm.zig, the report in report.zig); stage S4 adds serve; stage S5 adds site,
//! this site's build checks (sitefacts.zig, siteshell.zig, sitegrid.zig, over the patterns of regex.zig). Each
//! prints byte for byte what its JavaScript prints (tools/zane/cli.js, conformance.js, pack.js, cross-medium.js,
//! doc/design/audit/check-facts.js, tools/site-facts.js, site-shell.js and site-grid.js), which tools/zane/parity.js proves. Exit codes: 0 clean
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
const report = @import("report.zig");
const serve = @import("serve.zig");
const sitefacts = @import("sitefacts.zig");
const siteshell = @import("siteshell.zig");
const sitegrid = @import("sitegrid.zig");
const build_options = @import("build_options");

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

fn loadSymbols(a: std.mem.Allocator, path: []const u8) !core.Symbols {
    return report.symbolsOf(a, try std.fs.cwd().readFileAlloc(a, path, 64 * 1024 * 1024));
}

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
    return dispatch(a, if (raw.len > 0) raw[1..] else raw, out, err);
}

/// One command line, without the program's name, to its command. `zane site facts` calls it to re-run the commands a
/// page's terminal names, in this process, as tools/site-facts.js re-runs them with node.
pub fn dispatch(a: std.mem.Allocator, argv: []const []const u8, out: *std.Io.Writer, err: *std.Io.Writer) anyerror!u8 {
    // the release's version alone (Central's ZANE-RELEASE-01): build.zig.zon's, and no commit, since a release is built from
    // its tag and a build from a source archive has no git to ask
    if (argv.len == 1 and std.mem.eql(u8, argv[0], "--version")) {
        try out.print("zane {s}\n", .{build_options.version});
        return 0;
    }
    // this site's own build tools (stage S5): site facts, site shell, site grid
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "site")) return site(a, argv[1..], out, err);
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
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "serve")) return serve.run(a, out, err, argv[1..]);
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

    var findings: std.ArrayList(report.Finding) = .empty;
    for (o.files.items) |file| {
        const raw_src = std.fs.cwd().readFileAlloc(a, file, 256 * 1024 * 1024) catch |e| {
            try err.print("zane: cannot read {s}: {s}\n", .{ file, @errorName(e) });
            return 2;
        };
        try report.collect(a, contract, file, raw_src, symbols, level, &findings);
    }

    const errors = report.errorCount(findings.items);

    if (o.json) {
        try report.writeJson(a, out, o.files.items, contract, level, findings.items);
        return if (errors > 0) 1 else 0;
    }

    try report.writeText(a, out, o.files.items, contract, law, level, o.quiet, findings.items);
    return if (errors > 0) 1 else 0;
}

const site_usage =
    \\zane site — this site's own build checks (stage S5)
    \\
    \\  zane site facts [--write] [--unchecked]   every figure on the site has a file (tools/site-facts.js)
    \\  zane site shell [--write]                 the one definition of the site's navigation (tools/site-shell.js)
    \\  zane site grid [--write]                  the two tables drawn from their data (tools/site-grid.js)
    \\
    \\Run from the repository's root: like zane pack, they read the tree they are run in.
;

fn site(a: std.mem.Allocator, argv: []const []const u8, out: *std.Io.Writer, err: *std.Io.Writer) !u8 {
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "facts")) return sitefacts.run(a, out, argv[1..]);
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "shell")) return siteshell.run(a, out, argv[1..]);
    if (argv.len > 0 and std.mem.eql(u8, argv[0], "grid")) return sitegrid.run(a, out, argv[1..]);
    if (argv.len > 0 and (std.mem.eql(u8, argv[0], "-h") or std.mem.eql(u8, argv[0], "--help"))) {
        try out.print("{s}\n", .{site_usage});
        return 0;
    }
    if (argv.len > 0) try err.print("zane: unknown site command \"{s}\"\n\n", .{argv[0]});
    try err.print("{s}\n", .{site_usage});
    return 2;
}

fn version(out: *std.Io.Writer) !u8 {
    const contract = contract_mod.loadContract(std.heap.page_allocator, contract_mod.violations_json) catch return 2;
    try out.print("zane {s} (stage S5: check, conformance, pack, cross-medium, audit-facts, serve, site; the same core as zane.wasm) · law v{s} · language {s} · contract v{s} · {s} · {s}-{s}\n", .{
        build_options.version,
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
    _ = @import("regex.zig");
    _ = @import("gzip.zig");
    _ = report;
    _ = serve;
}
