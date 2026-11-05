//! conformance.zig: `zane conformance`, the suite in one process (doc/design/BINARY.md, stage S2).
//!
//! The same run as tools/zane/conformance.js, printing the same lines: every fixture of the manifest through
//! the core, the SET of ids compared (never lines, wording or order), a fixture above the claimed level skipped
//! and not failed; and the cross-checks that keep two sources from drifting: the core's own media and signal
//! tables against conformance/media.json and signal.json, the contract against doc/language/VIOLATIONS.md, and
//! every diagnostic and every report against the family envelope (schema.zig).
//!
//! The suite is embedded at build (build.zig): the manifest, the fixtures, the data and the two documents read.
//! So a binary checks the suite it was built from, and needs no tree to run.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const schema = @import("schema.zig");
const fixtures = @import("fixtures").files;

const manifest_json = @embedFile("manifest.json");
const media_json = @embedFile("media.json");
const signal_json = @embedFile("signal.json");
const schema_json = @embedFile("schema.json");
const violations_md = @embedFile("VIOLATIONS.md");
const spec_md = @embedFile("spec.md");

fn get(o: Value, k: []const u8) ?Value {
    if (o != .object) return null;
    return o.object.get(k);
}
fn strOf(v: ?Value) ?[]const u8 {
    const x = v orelse return null;
    return if (x == .string) x.string else null;
}
fn strings(a: Allocator, v: ?Value) ![]const []const u8 {
    var out: std.ArrayList([]const u8) = .empty;
    if (v) |x| if (x == .array) for (x.array.items) |it| if (it == .string) try out.append(a, it.string);
    return out.toOwnedSlice(a);
}
fn lessThan(_: void, x: []const u8, y: []const u8) bool {
    return std.mem.lessThan(u8, x, y);
}
/// [...xs].sort().join(',')
fn sortedJoin(a: Allocator, xs: []const []const u8) ![]const u8 {
    const c = try a.dupe([]const u8, xs);
    std.mem.sort([]const u8, c, {}, lessThan);
    return std.mem.join(a, ",", c);
}
fn contains(xs: []const []const u8, s: []const u8) bool {
    for (xs) |x| if (std.mem.eql(u8, x, s)) return true;
    return false;
}
/// Insert-once, keeping first-seen order: a JavaScript Set of strings.
fn addOnce(a: Allocator, list: *std.ArrayList([]const u8), s: []const u8) !void {
    if (!contains(list.items, s)) try list.append(a, s);
}

/// The specification's version, read from its heading as conformance.js reads it.
fn specVersion(md: []const u8) []const u8 {
    var lines = std.mem.splitScalar(u8, md, '\n');
    while (lines.next()) |line| {
        var r = line;
        if (r.len == 0 or r[0] != '#') continue;
        r = r[1..];
        // /^#\s+The Zane Language\s+—\s+Specification\s+v(\S+)/m
        const parts = [_][]const u8{ "The Zane Language", "—", "Specification" };
        var ok = true;
        for (parts) |p| {
            const t = std.mem.trimLeft(u8, r, " \t\r");
            if (t.len == r.len) {
                ok = false;
                break;
            }
            if (!std.mem.startsWith(u8, t, p)) {
                ok = false;
                break;
            }
            r = t[p.len..];
        }
        if (!ok) continue;
        const t = std.mem.trimLeft(u8, r, " \t\r");
        if (t.len == r.len or t.len < 2 or t[0] != 'v') continue;
        var end: usize = 1;
        while (end < t.len and !std.ascii.isWhitespace(t[end])) end += 1;
        if (end == 1) continue;
        return t[1..end];
    }
    return "(unreadable)";
}

fn isIdStart(c: u8) bool {
    return c >= 'A' and c <= 'Z';
}
fn isIdPart(c: u8) bool {
    return (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9') or c == '_';
}
/// An id of [A-Z][A-Z0-9_]+ followed by a backtick, at the start of s: its length, or null.
fn idThenTick(s: []const u8) ?usize {
    if (s.len < 3 or !isIdStart(s[0])) return null;
    var n: usize = 1;
    while (n < s.len and isIdPart(s[n])) n += 1;
    if (n < 2 or n >= s.len or s[n] != '`') return null;
    return n;
}

/// The diagnostics VIOLATIONS.md documents: a table row's first cell, then each bolded heading, in that order.
fn documented(a: Allocator, md: []const u8) !std.ArrayList([]const u8) {
    var out: std.ArrayList([]const u8) = .empty;
    var lines = std.mem.splitScalar(u8, md, '\n');
    while (lines.next()) |line| {
        if (line.len == 0 or line[0] != '|') continue;
        const t = std.mem.trimLeft(u8, line[1..], " \t\r\x0B\x0C");
        if (t.len == 0 or t[0] != '`') continue;
        const n = idThenTick(t[1..]) orelse continue;
        const after = std.mem.trimLeft(u8, t[n + 2 ..], " \t\r\x0B\x0C");
        if (after.len == 0 or after[0] != '|') continue;
        try addOnce(a, &out, t[1 .. 1 + n]);
    }
    lines = std.mem.splitScalar(u8, md, '\n');
    while (lines.next()) |line| {
        if (!std.mem.startsWith(u8, line, "**`")) continue;
        const n = idThenTick(line[3..]) orelse continue;
        try addOnce(a, &out, line[3 .. 3 + n]);
    }
    return out;
}

fn symbolsOf(a: Allocator, v: ?Value) !?core.Symbols {
    const x = v orelse return null;
    if (x != .object) return null;
    // a key is present only when the table carries it as an array, as `check --symbols` reads a file
    var s: core.Symbols = .{};
    const keys = [_][]const u8{ "entities", "actors", "state", "elements" };
    inline for (keys) |k| {
        if (x.object.get(k)) |list| if (list == .array) {
            @field(s, k) = try strings(a, list);
        };
    }
    return s;
}

fn fixtureSource(name: []const u8) ?[]const u8 {
    for (fixtures) |f| if (std.mem.eql(u8, f.name, name)) return f.src;
    return null;
}

/// envelope.js toEnvelope(), as a JSON value, with the language this court speaks.
fn envelope(a: Allocator, d: core.Diag, file: []const u8, m: ?contract_mod.Meta) !Value {
    const meta = m orelse contract_mod.Meta{ .level = 0 };
    var o = std.json.ObjectMap.init(a);
    try o.put("code", .{ .string = d.id });
    try o.put("severity", .{ .string = if (m != null) meta.severity else "error" });
    const message: []const u8 = blk: {
        if (meta.summary) |s| if (s.len > 0) break :blk s;
        if (d.subject) |s| if (s.len > 0) break :blk try std.fmt.allocPrint(a, "{s}: {s}", .{ d.id, s });
        break :blk d.id;
    };
    try o.put("message", .{ .string = message });
    var span = std.json.ObjectMap.init(a);
    try span.put("file", .{ .string = file });
    try span.put("line", .{ .integer = d.line });
    try o.put("span", .{ .object = span });
    var cites = std.json.Array.init(a);
    for (meta.rules) |r| try cites.append(.{ .string = try std.fmt.allocPrint(a, "rule:{s}", .{r}) });
    for (meta.articles) |x| try cites.append(.{ .string = try std.fmt.allocPrint(a, "article:{s}", .{x}) });
    for (meta.rights) |x| try cites.append(.{ .string = try std.fmt.allocPrint(a, "right:{s}", .{x}) });
    for (meta.forbidden_patterns) |x| try cites.append(.{ .string = try std.fmt.allocPrint(a, "pattern:{s}", .{x}) });
    try o.put("cites", .{ .array = cites });
    try o.put("language", .{ .string = "zane" });
    try o.put("level", .{ .integer = if (meta.level != 0) meta.level else 1 });
    try o.put("subject", if (d.subject) |s| .{ .string = s } else .null);
    return .{ .object = o };
}

const Failure = struct {
    file: []const u8,
    reason: ?[]const u8 = null,
    expected: []const []const u8,
    actual: []const []const u8,
    missing: []const []const u8,
    extra: []const []const u8,
};

pub fn run(a: Allocator, out: *std.Io.Writer, level: i64, verbose: bool) !u8 {
    const manifest = try std.json.parseFromSliceLeaky(Value, a, manifest_json, contract_mod.js_parse);
    const contract = try contract_mod.loadContract(a, contract_mod.violations_json);
    const shape = try std.json.parseFromSliceLeaky(Value, a, schema_json, contract_mod.js_parse);

    // ---- the core's media table against media.json
    var media_problems: std.ArrayList([]const u8) = .empty;
    {
        const spec = try std.json.parseFromSliceLeaky(Value, a, media_json, contract_mod.js_parse);
        const spec_media = if (get(spec, "media")) |m| (if (m == .array) m.array.items else &[_]Value{}) else &[_]Value{};
        var spec_ids: std.ArrayList([]const u8) = .empty;
        for (spec_media) |m| try spec_ids.append(a, strOf(get(m, "id")) orelse "undefined");
        var impl_ids: std.ArrayList([]const u8) = .empty;
        for (core.media) |m| try impl_ids.append(a, m.name);
        const sj = try sortedJoin(a, spec_ids.items);
        const ij = try sortedJoin(a, impl_ids.items);
        if (!std.mem.eql(u8, sj, ij)) try media_problems.append(a, try std.fmt.allocPrint(a, "enumeration differs — media.json {{{s}}} vs verifier {{{s}}}", .{ sj, ij }));
        for (spec_media) |m| {
            const id = strOf(get(m, "id")) orelse continue;
            var impl: ?core.Medium = null;
            for (core.media) |x| if (std.mem.eql(u8, x.name, id)) {
                impl = x;
            };
            const im = impl orelse continue;
            const carries = get(m, "carries");
            const sd = strOf(if (carries) |c| get(c, "default") else null) orelse "undefined";
            const id_: []const u8 = if (im.default_absent) "absent" else "native";
            if (!std.mem.eql(u8, sd, id_)) try media_problems.append(a, try std.fmt.allocPrint(a, "{s}: default carriage — media.json \"{s}\" vs verifier \"{s}\"", .{ id, sd, id_ }));
            if (std.mem.eql(u8, sd, "absent")) {
                var keep: std.ArrayList([]const u8) = .empty;
                try keep.appendSlice(a, try strings(a, if (carries) |c| get(c, "native") else null));
                try keep.appendSlice(a, try strings(a, if (carries) |c| get(c, "degraded") else null));
                const sk = try sortedJoin(a, keep.items);
                const ik = try sortedJoin(a, im.keep);
                if (!std.mem.eql(u8, sk, ik)) try media_problems.append(a, try std.fmt.allocPrint(a, "{s}: carried set — media.json {{{s}}} vs verifier {{{s}}}", .{ id, sk, ik }));
            } else {
                const sa = try sortedJoin(a, try strings(a, if (carries) |c| get(c, "absent") else null));
                const ia = try sortedJoin(a, im.absent);
                if (!std.mem.eql(u8, sa, ia)) try media_problems.append(a, try std.fmt.allocPrint(a, "{s}: absent set — media.json {{{s}}} vs verifier {{{s}}}", .{ id, sa, ia }));
            }
        }
    }

    // ---- the core's signal vocabulary and absence table against signal.json
    {
        const sig = try std.json.parseFromSliceLeaky(Value, a, signal_json, contract_mod.js_parse);
        var spec_vals: std.ArrayList([]const u8) = .empty;
        if (get(sig, "values")) |vs| if (vs == .array) for (vs.array.items) |v| try spec_vals.append(a, strOf(get(v, "id")) orelse "undefined");
        const sv = try sortedJoin(a, spec_vals.items);
        const iv = try sortedJoin(a, &core.signals);
        if (!std.mem.eql(u8, sv, iv)) try media_problems.append(a, try std.fmt.allocPrint(a, "SIGNAL vocabulary differs — signal.json {{{s}}} vs verifier {{{s}}}", .{ sv, iv }));
        const renderings = get(sig, "renderings");
        if (renderings) |rs| if (rs == .object) {
            var it = rs.object.iterator();
            while (it.next()) |e| {
                const r = e.value_ptr.*;
                if (r != .object or r.object.get("rendersAsAbsence") == null) continue;
                const s = try sortedJoin(a, try strings(a, r.object.get("rendersAsAbsence")));
                var silent: []const []const u8 = &.{};
                for (core.signal_absence) |x| if (std.mem.eql(u8, x.medium, e.key_ptr.*)) {
                    silent = x.silent;
                };
                const i = try sortedJoin(a, silent);
                if (!std.mem.eql(u8, s, i)) try media_problems.append(a, try std.fmt.allocPrint(a, "{s}: absence set — signal.json {{{s}}} vs verifier {{{s}}}", .{ e.key_ptr.*, s, i }));
            }
        };
        for (core.signal_absence) |x| {
            const r = if (renderings) |rs| get(rs, x.medium) else null;
            const recorded = if (r) |rv| rv == .object and rv.object.get("rendersAsAbsence") != null else false;
            if (!recorded) try media_problems.append(a, try std.fmt.allocPrint(a, "{s}: verifier declares an absence set and signal.json records none", .{x.medium}));
        }
    }

    // ---- the contract against VIOLATIONS.md
    const version = specVersion(spec_md);
    var spec_problems: std.ArrayList([]const u8) = .empty;
    {
        const doc = try documented(a, violations_md);
        for (contract.ids) |id| if (!contains(doc.items, id)) {
            try spec_problems.append(a, try std.fmt.allocPrint(a, "{s} is in the contract and not in VIOLATIONS.md", .{id}));
        };
        for (doc.items) |id| if (contract.by_id.get(id) == null) {
            try spec_problems.append(a, try std.fmt.allocPrint(a, "{s} is in VIOLATIONS.md and not in the contract", .{id}));
        };
    }

    // ---- the fixtures
    var pass: usize = 0;
    var fail: usize = 0;
    var skip: usize = 0;
    var failures: std.ArrayList(Failure) = .empty;
    var envelopes: usize = 0;
    var reports: usize = 0;
    var envelope_problems: schema.Problems = .empty;
    const fxs = if (get(manifest, "fixtures")) |f| (if (f == .array) f.array.items else &[_]Value{}) else &[_]Value{};
    for (fxs) |fx| {
        const fl: i64 = if (get(fx, "level")) |l| (if (l == .integer) l.integer else 0) else 0;
        if (fl > level) {
            skip += 1;
            continue;
        }
        const file = strOf(get(fx, "file")) orelse "undefined";
        const src = fixtureSource(file) orelse {
            // embedded at build from conformance/fixtures; a manifest entry with no file there cannot be read
            try failures.append(a, .{ .file = file, .reason = "unreadable: not among the fixtures this binary was built with", .expected = &.{}, .actual = &.{}, .missing = &.{}, .extra = &.{} });
            fail += 1;
            continue;
        };
        const raw = try core.verify(a, try core.wellFormed(a, src), try symbolsOf(a, get(fx, "symbols")));

        var per_fixture = std.json.Array.init(a);
        for (raw) |d| {
            envelopes += 1;
            const env = try envelope(a, d, file, contract.by_id.get(d.id));
            try per_fixture.append(env);
            try schema.validate(a, env, shape, try std.fmt.allocPrint(a, "{s} · {s}", .{ file, d.id }), &envelope_problems);
        }
        reports += 1;
        {
            var report = std.json.ObjectMap.init(a);
            try report.put("level", .{ .integer = level });
            var c = std.json.ObjectMap.init(a);
            if (contract.version) |v| try c.put("version", .{ .string = v });
            try report.put("contract", .{ .object = c });
            var files = std.json.Array.init(a);
            try files.append(.{ .string = file });
            try report.put("files", .{ .array = files });
            try report.put("counts", .{ .object = std.json.ObjectMap.init(a) });
            try report.put("diagnostics", .{ .array = per_fixture });
            try schema.validateReport(a, .{ .object = report }, shape, try std.fmt.allocPrint(a, "{s} · report", .{file}), &envelope_problems);
        }

        // what this level can see; unknown ids are structural and always count
        var actual: std.ArrayList([]const u8) = .empty;
        for (raw) |d| {
            const lv = if (contract.by_id.get(d.id)) |m| (if (m.level != 0) m.level else 1) else 1;
            if (lv <= level) try addOnce(a, &actual, d.id);
        }
        var expected: std.ArrayList([]const u8) = .empty;
        for (try strings(a, get(fx, "expect_ids"))) |id| try addOnce(a, &expected, id);
        var missing: std.ArrayList([]const u8) = .empty;
        for (expected.items) |x| if (!contains(actual.items, x)) try missing.append(a, x);
        var extra: std.ArrayList([]const u8) = .empty;
        for (actual.items) |x| if (!contains(expected.items, x)) try extra.append(a, x);

        if (missing.items.len == 0 and extra.items.len == 0) {
            pass += 1;
            if (verbose) {
                const joined = try std.mem.join(a, ", ", actual.items);
                try out.print("  pass  {s}  {s}\n", .{ file, if (joined.len > 0) joined else "(clean)" });
            }
        } else {
            fail += 1;
            try failures.append(a, .{ .file = file, .expected = expected.items, .actual = actual.items, .missing = missing.items, .extra = extra.items });
        }
    }

    const shape_version = strOf(get(shape, "version")) orelse "undefined";
    try out.print("\nZane conformance — level {d}\n", .{level});
    try out.print("  spec         doc/language/ v{s}\n", .{version});
    try out.print("  contract     violations.json v{s} (constitution v{s})\n", .{ contract.version orelse "undefined", contract.constitution orelse "undefined" });
    if (envelope_problems.items.len > 0) {
        try out.print("  envelope     diagnostic-contract v{s} — {d} diagnostics and {d} reports, {d} nonconforming\n", .{ shape_version, envelopes, reports, envelope_problems.items.len });
    } else {
        try out.print("  envelope     diagnostic-contract v{s} — {d} diagnostics and {d} reports, all conform\n", .{ shape_version, envelopes, reports });
    }
    if (media_problems.items.len > 0) {
        try out.print("  media        {d} media — {d} disagreements with media.json\n", .{ core.media.len, media_problems.items.len });
    } else {
        try out.print("  media        {d} media — verifier agrees with media.json\n", .{core.media.len});
    }
    if (spec_problems.items.len > 0) {
        try out.print("  catalogue    {d} diagnostics — {d} disagreements with VIOLATIONS.md\n", .{ contract.ids.len, spec_problems.items.len });
    } else {
        try out.print("  catalogue    {d} diagnostics — contract agrees with VIOLATIONS.md\n", .{contract.ids.len});
    }
    try out.print("  fixtures     {d} total\n", .{fxs.len});
    try out.print("  pass {d} · fail {d} · skipped {d} (above level {d})\n", .{ pass, fail, skip, level });

    if (media_problems.items.len > 0) {
        try out.writeAll("\nMedium enumeration disagreements (conformance/media.json vs the verifier):\n");
        for (media_problems.items) |p| try out.print("  {s}\n", .{p});
        return 1;
    }
    if (spec_problems.items.len > 0) {
        try out.writeAll("\nCatalogue disagreements (conformance/violations.json vs doc/language/VIOLATIONS.md):\n");
        for (spec_problems.items) |p| try out.print("  {s}\n", .{p});
        return 1;
    }
    if (envelope_problems.items.len > 0) {
        try out.writeAll("\nEnvelope violations (doc/diagnostic-contract.schema.json):\n");
        for (envelope_problems.items) |p| try out.print("  {s}\n", .{p});
        return 1;
    }
    if (failures.items.len > 0) {
        try out.writeAll("\nMismatches:\n");
        for (failures.items) |f| {
            if (f.reason) |r| {
                try out.print("  {s}: {s}\n", .{ f.file, r });
                continue;
            }
            try out.print("  {s}\n", .{f.file});
            try out.print("    expected  {{{s}}}\n", .{try std.mem.join(a, ", ", f.expected)});
            try out.print("    got       {{{s}}}\n", .{try std.mem.join(a, ", ", f.actual)});
            if (f.missing.len > 0) try out.print("    missing   {s}\n", .{try std.mem.join(a, ", ", f.missing)});
            if (f.extra.len > 0) try out.print("    extra     {s}\n", .{try std.mem.join(a, ", ", f.extra)});
        }
        return 1;
    }
    if (skip > 0) {
        try out.print("\n  conforms at level {d}; {d} fixture(s) above it were skipped.\n", .{ level, skip });
    } else {
        try out.print("\n  conforms at level {d} — every fixture in the suite.\n", .{level});
    }
    return 0;
}
