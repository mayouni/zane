//! pack.zig: `zane pack [--check]`, the protocol pack's manifest, written or verified (doc/design/BINARY.md, S2).
//!
//! The same as tools/zane/pack.js, printing the same lines: the twelve pinned files hashed with sha256 over their
//! content with CRLF normalised to LF, the versions read from the files themselves, the counts the pack's README
//! states checked against them, and protocol/MANIFEST.json written (as JSON.stringify(manifest, null, 2) writes
//! it) or compared. Unlike `conformance`, it reads the files on disk, from the directory it is run in: the point
//! of a pin is the bytes a participant HAS, not the ones this binary was built from.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const js = @import("js.zig");
const conformance = @import("conformance.zig");

const Group = struct { role: []const u8, files: []const []const u8 };
/// The pack, by role: only what a claim of conformance rests on.
const pack = [_]Group{
    .{ .role = "the law", .files = &.{"constitution/rules.json"} },
    .{ .role = "the language", .files = &.{ "doc/language/README.md", "doc/language/GRAMMAR.md", "doc/language/DECLARATIONS.md", "doc/language/VIOLATIONS.md" } },
    .{ .role = "the refusal contract", .files = &.{ "conformance/violations.json", "doc/diagnostic-contract.md", "doc/diagnostic-contract.schema.json" } },
    .{ .role = "the axes", .files = &.{ "conformance/media.json", "conformance/signal.json" } },
    .{ .role = "the proof", .files = &.{ "conformance/manifest.json", "conformance/cross-medium/spec.json" } },
};
const out_path = "protocol/MANIFEST.json";

const Entry = struct { file: []const u8, role: []const u8, bytes: usize, sha256: []const u8 };

fn readFile(a: Allocator, rel: []const u8) ![]const u8 {
    return std.fs.cwd().readFileAlloc(a, rel, 256 * 1024 * 1024);
}

/// Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'), 'utf8')
fn normalise(a: Allocator, raw: []const u8) ![]const u8 {
    const decoded = try core.wellFormed(a, raw);
    return std.mem.replaceOwned(u8, a, decoded, "\r\n", "\n");
}

fn hex(a: Allocator, digest: [32]u8) ![]const u8 {
    const h = std.fmt.bytesToHex(digest, .lower);
    return a.dupe(u8, &h);
}

fn get(o: Value, k: []const u8) ?Value {
    if (o != .object) return null;
    return o.object.get(k);
}
fn len(v: ?Value) usize {
    const x = v orelse return 0;
    return if (x == .array) x.array.items.len else 0;
}
fn parse(a: Allocator, rel: []const u8) !Value {
    return std.json.parseFromSliceLeaky(Value, a, try readFile(a, rel), contract_mod.js_parse);
}

const Versions = struct {
    constitution: Value,
    rules: usize,
    forbidden_patterns: usize,
    language: []const u8,
    refusal_contract: Value,
    diagnostics: usize,
    media: usize,
    signal_values: usize,
    fixtures: usize,
};

fn versions(a: Allocator) !Versions {
    const law = try parse(a, "constitution/rules.json");
    var rules: usize = 0;
    if (law == .object) {
        var it = law.object.iterator();
        while (it.next()) |e| {
            const k = e.key_ptr.*;
            if (k.len > 3 and std.mem.startsWith(u8, k, "set")) {
                var digits = true;
                for (k[3..]) |c| if (!std.ascii.isDigit(c)) {
                    digits = false;
                };
                if (digits) rules += len(get(e.value_ptr.*, "rules"));
            }
        }
    }
    const contract = try parse(a, "conformance/violations.json");
    return .{
        .constitution = get(get(law, "metadata") orelse .null, "version") orelse .null,
        .rules = rules,
        .forbidden_patterns = len(get(law, "forbidden")),
        .language = conformance.specVersion(try readFile(a, "doc/language/README.md")),
        .refusal_contract = get(get(contract, "metadata") orelse .null, "version") orelse .null,
        .diagnostics = len(get(contract, "diagnostics")),
        .media = len(get(try parse(a, "conformance/media.json"), "media")),
        .signal_values = len(get(try parse(a, "conformance/signal.json"), "values")),
        .fixtures = len(get(try parse(a, "conformance/manifest.json"), "fixtures")),
    };
}

/// String(v) for a JSON value as a template literal writes it.
fn text(a: Allocator, v: Value) ![]const u8 {
    return switch (v) {
        .string => |s| s,
        .null => "null",
        .bool => |b| if (b) "true" else "false",
        .integer => |n| std.fmt.allocPrint(a, "{d}", .{n}),
        else => if (js.numOf(v)) |f| js.num(a, f) else "[object Object]",
    };
}

/// The digits immediately before the first occurrence of `after` that has any: md.match(/(\d+)<after>/)[1].
fn digitsBefore(md: []const u8, after: []const u8, prefix: []const u8) ?[]const u8 {
    var from: usize = 0;
    while (std.mem.indexOfPos(u8, md, from, after)) |at| : (from = at + 1) {
        var s = at;
        while (s > 0 and std.ascii.isDigit(md[s - 1])) s -= 1;
        if (s == at) continue;
        if (prefix.len > 0 and !(s >= prefix.len and std.mem.eql(u8, md[s - prefix.len .. s], prefix))) continue;
        return md[s..at];
    }
    return null;
}

/// md.match(/conforms to Zane v(\S+?) at level/)[1]
fn lawClaim(md: []const u8) ?[]const u8 {
    const head = "conforms to Zane v";
    var from: usize = 0;
    while (std.mem.indexOfPos(u8, md, from, head)) |at| : (from = at + 1) {
        const s = at + head.len;
        var e = s;
        while (e < md.len and !std.ascii.isWhitespace(md[e])) e += 1;
        if (e == s) continue;
        if (std.mem.startsWith(u8, md[e..], " at level")) return md[s..e];
    }
    return null;
}

fn readmeClaims(a: Allocator, v: Versions, pinned: usize) !std.ArrayList([]const u8) {
    var bad: std.ArrayList([]const u8) = .empty;
    const md = readFile(a, "protocol/README.md") catch {
        try bad.append(a, "protocol/README.md is missing");
        return bad;
    };
    const Claim = struct { label: []const u8, after: []const u8, prefix: []const u8, expect: []const u8 };
    const claims = [_]Claim{
        .{ .label = "the rule count", .after = " rules, 7 articles", .prefix = "", .expect = try std.fmt.allocPrint(a, "{d}", .{v.rules}) },
        .{ .label = "the forbidden count", .after = " forbidden patterns", .prefix = "", .expect = try std.fmt.allocPrint(a, "{d}", .{v.forbidden_patterns}) },
        .{ .label = "the diagnostic count", .after = " diagnostics with severities", .prefix = "", .expect = try std.fmt.allocPrint(a, "{d}", .{v.diagnostics}) },
        .{ .label = "the fixture count", .after = " fixtures with known verdicts", .prefix = "", .expect = try std.fmt.allocPrint(a, "{d}", .{v.fixtures}) },
        .{ .label = "the pinned-file count", .after = " files, no runtime", .prefix = "**", .expect = try std.fmt.allocPrint(a, "{d}", .{pinned}) },
    };
    for (claims) |c| {
        const m = digitsBefore(md, c.after, c.prefix) orelse {
            try bad.append(a, try std.fmt.allocPrint(a, "README states no {s}", .{c.label}));
            continue;
        };
        if (!std.mem.eql(u8, m, c.expect)) try bad.append(a, try std.fmt.allocPrint(a, "README says {s} is {s}, manifest says {s}", .{ c.label, m, c.expect }));
    }
    const law_expect = try text(a, v.constitution);
    if (lawClaim(md)) |m| {
        if (!std.mem.eql(u8, m, law_expect)) try bad.append(a, try std.fmt.allocPrint(a, "README says the law version is {s}, manifest says {s}", .{ m, law_expect }));
    } else try bad.append(a, "README states no the law version");
    return bad;
}

pub fn run(a: Allocator, out: *std.Io.Writer, err: *std.Io.Writer, check: bool) !u8 {
    var entries: std.ArrayList(Entry) = .empty;
    var missing: usize = 0;
    for (pack) |g| for (g.files) |rel| {
        const raw = readFile(a, rel) catch {
            try err.print("  MISSING  {s}\n", .{rel});
            missing += 1;
            continue;
        };
        const n = try normalise(a, raw);
        var digest: [32]u8 = undefined;
        std.crypto.hash.sha2.Sha256.hash(n, &digest, .{});
        try entries.append(a, .{ .file = rel, .role = g.role, .bytes = n.len, .sha256 = try hex(a, digest) });
    };
    if (missing > 0) {
        try err.print("\npack: {d} pinned file(s) missing\n", .{missing});
        return 1;
    }

    const v = try versions(a);
    try out.writeAll("\nThe Zane protocol pack\n");
    try out.print("  law          v{s} — {d} rules, {d} forbidden patterns\n", .{ try text(a, v.constitution), v.rules, v.forbidden_patterns });
    try out.print("  language     v{s} — {d} diagnostics\n", .{ v.language, v.diagnostics });
    try out.print("  axes         {d} media, {d} semantic values\n", .{ v.media, v.signal_values });
    try out.print("  proof        {d} fixtures + the cross-medium spec\n", .{v.fixtures});
    try out.print("  pinned       {d} files, sha256 over LF-normalised content\n", .{entries.items.len});

    const claims = try readmeClaims(a, v, entries.items.len);
    if (claims.items.len > 0) {
        try out.print("  README       {d} claim(s) disagree with the manifest\n", .{claims.items.len});
        try out.writeAll("\n");
        for (claims.items) |c| try out.print("    {s}\n", .{c});
        try out.writeAll("\n  The pack's own prose must not drift from the pack.\n");
        return 1;
    }
    try out.writeAll("  README       every count on the page matches the manifest\n");

    if (check) {
        const have_raw = readFile(a, out_path) catch {
            try err.writeAll("\n  no manifest at protocol/MANIFEST.json — run without --check\n");
            return 1;
        };
        const have = try std.json.parseFromSliceLeaky(Value, a, have_raw, contract_mod.js_parse);
        // a Map keyed by file, in the manifest's order
        var files: std.ArrayList([]const u8) = .empty;
        var hashes: std.ArrayList(?[]const u8) = .empty;
        if (get(have, "pinned")) |p| if (p == .array) for (p.array.items) |it| {
            const f = if (get(it, "file")) |x| (if (x == .string) x.string else null) else null;
            const key = f orelse "undefined";
            const h = if (get(it, "sha256")) |x| (if (x == .string) x.string else null) else null;
            var found = false;
            for (files.items, 0..) |k, i| if (std.mem.eql(u8, k, key)) {
                hashes.items[i] = h; // a repeated file: the later entry replaces the earlier, as Map.set does
                found = true;
            };
            if (!found) {
                try files.append(a, key);
                try hashes.append(a, h);
            }
        };
        var gone = try a.alloc(bool, files.items.len);
        @memset(gone, false);
        var drift: std.ArrayList([]const u8) = .empty;
        for (entries.items) |e| {
            var idx: ?usize = null;
            for (files.items, 0..) |k, i| if (!gone[i] and std.mem.eql(u8, k, e.file)) {
                idx = i;
            };
            const i = idx orelse {
                try drift.append(a, try std.fmt.allocPrint(a, "{s}: not in the manifest", .{e.file}));
                continue;
            };
            const was = hashes.items[i];
            if (was == null or !std.mem.eql(u8, was.?, e.sha256)) try drift.append(a, try std.fmt.allocPrint(a, "{s}: content changed since the manifest was written", .{e.file}));
            gone[i] = true;
        }
        for (files.items, 0..) |k, i| if (!gone[i]) try drift.append(a, try std.fmt.allocPrint(a, "{s}: in the manifest and no longer in the pack", .{k}));
        if (drift.items.len > 0) {
            try out.print("\n  {d} drift(s) between the tree and protocol/MANIFEST.json:\n", .{drift.items.len});
            for (drift.items) |d| try out.print("    {s}\n", .{d});
            try out.writeAll("\n  Regenerate deliberately -- a manifest that follows the tree automatically\n");
            try out.writeAll("  pins nothing. Decide the version moved, then run without --check.\n");
            return 1;
        }
        try out.writeAll("\n  verified — every pinned file matches the manifest\n");
        return 0;
    }

    // the manifest, as JSON.stringify(manifest, null, 2) + '\n'
    var metadata = std.json.ObjectMap.init(a);
    try metadata.put("title", .{ .string = "The Zane Protocol Pack" });
    try metadata.put("version", .{ .string = "1.0" });
    try metadata.put("generated", .{ .string = "by tools/zane/pack.js -- never hand-edited" });
    try metadata.put("note", .{ .string = "Every file a participant pins, with a hash. Pinning means recording this manifest: a version number says which edition you MEANT, and a hash says the bytes you HAVE are that edition. Hashes are over content with CRLF normalised to LF, so a pin does not differ by platform." });
    try metadata.put("hash", .{ .string = "sha256 over LF-normalised content" });
    var vs = std.json.ObjectMap.init(a);
    try vs.put("constitution", v.constitution);
    try vs.put("rules", .{ .integer = @intCast(v.rules) });
    try vs.put("forbiddenPatterns", .{ .integer = @intCast(v.forbidden_patterns) });
    try vs.put("language", .{ .string = v.language });
    try vs.put("refusalContract", v.refusal_contract);
    try vs.put("diagnostics", .{ .integer = @intCast(v.diagnostics) });
    try vs.put("media", .{ .integer = @intCast(v.media) });
    try vs.put("signalValues", .{ .integer = @intCast(v.signal_values) });
    try vs.put("fixtures", .{ .integer = @intCast(v.fixtures) });
    var pinned = std.json.Array.init(a);
    for (entries.items) |e| {
        var o = std.json.ObjectMap.init(a);
        try o.put("file", .{ .string = e.file });
        try o.put("role", .{ .string = e.role });
        try o.put("bytes", .{ .integer = @intCast(e.bytes) });
        try o.put("sha256", .{ .string = e.sha256 });
        try pinned.append(.{ .object = o });
    }
    var root = std.json.ObjectMap.init(a);
    try root.put("metadata", .{ .object = metadata });
    try root.put("versions", .{ .object = vs });
    try root.put("pinned", .{ .array = pinned });
    var buf: std.Io.Writer.Allocating = .init(a);
    try js.stringifyPretty(a, &buf.writer, .{ .object = root }, 0);
    try buf.writer.writeByte('\n');
    try std.fs.cwd().makePath("protocol");
    try std.fs.cwd().writeFile(.{ .sub_path = out_path, .data = buf.written() });
    try out.writeAll("\n  written — protocol/MANIFEST.json\n");
    return 0;
}
