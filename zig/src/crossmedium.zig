//! crossmedium.zig: `zane cross-medium [spec.json] [--verbose]`, one declaration, two renderings, one law
//! (doc/design/BINARY.md, S2). The same as tools/zane/cross-medium.js, printing the same lines: each case's
//! declaration projected into two channels by appending a VIBE, and every difference between the projections
//! judged against media.json and signal.json: predicted, undecided (the data is silent), or drift (the data is
//! contradicted). Only drift and silence fail.
//!
//! media.json, signal.json, the default spec and the declarations it names are the ones this binary was built
//! with; a spec named on the command line is read from disk, and its cases from the embedded folder, as the
//! JavaScript reads them from conformance/cross-medium/ whatever spec it was given.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const folder = @import("crossmedium").files;

const media_json = @embedFile("media.json");
const signal_json = @embedFile("signal.json");

fn get(o: ?Value, k: []const u8) ?Value {
    const x = o orelse return null;
    if (x != .object) return null;
    return x.object.get(k);
}
fn strOf(v: ?Value) ?[]const u8 {
    const x = v orelse return null;
    return if (x == .string) x.string else null;
}
fn has(list: ?Value, s: []const u8) bool {
    const x = list orelse return false;
    if (x != .array) return false;
    for (x.array.items) |it| if (it == .string and std.mem.eql(u8, it.string, s)) return true;
    return false;
}
fn lessThan(_: void, x: []const u8, y: []const u8) bool {
    return std.mem.lessThan(u8, x, y);
}

const Data = struct { media: Value, signal: Value };

/// media.json states carriage both ways round: a native default lists what a channel loses, an absent one what it keeps.
fn carriageOf(d: Data, medium: []const u8, verb: []const u8) []const u8 {
    var m: ?Value = null;
    if (get(d.media, "media")) |list| if (list == .array) for (list.array.items) |x| {
        if (strOf(get(x, "id"))) |id| if (std.mem.eql(u8, id, medium)) {
            m = x; // a repeated id: the later entry wins, as new Map(...) keeps it
        };
    };
    const entry = m orelse return "unknown";
    const c = get(entry, "carries");
    if (has(get(c, "absent"), verb)) return "absent";
    if (has(get(c, "degraded"), verb)) return "degraded";
    if (has(get(c, "native"), verb)) return "native";
    const def = strOf(get(c, "default"));
    if (def) |s| if (std.mem.eql(u8, s, "absent")) return "absent";
    return if (def) |s| (if (s.len > 0) s else "unknown") else "unknown";
}

/// signal.json records renderings only for channels with a shipped renderer; a channel with none is undecided.
fn signalRendering(d: Data, medium: []const u8, value: []const u8) []const u8 {
    const r = get(get(d.signal, "renderings"), medium) orelse return "undecided";
    if (r != .object or r.object.get("rendersAsAbsence") == null) return "undecided";
    return if (has(r.object.get("rendersAsAbsence"), value)) "absence" else "rendered";
}

const Pair = struct { key: []const u8, val: []const u8 };
const Projection = struct { medium: []const u8, intents: []const Pair, signals: []const Pair, diagnostics: []const []const u8 };

fn lookup(ps: []const Pair, k: []const u8) ?[]const u8 {
    for (ps) |p| if (std.mem.eql(u8, p.key, k)) return p.val;
    return null;
}

/// The words of `KEY [ ... ]` on one line: line.match(/KEY\s*\[([^\]]*)\]/)[1].split(',').map(trim).filter(Boolean)
fn listOn(a: Allocator, line: []const u8, key: []const u8, into: *std.ArrayList([]const u8)) !void {
    var from: usize = 0;
    while (std.mem.indexOfPos(u8, line, from, key)) |at| : (from = at + 1) {
        var i = at + key.len;
        while (i < line.len and isJsSpace(line, i)) i += spaceLen(line, i);
        if (i >= line.len or line[i] != '[') continue;
        const close = std.mem.indexOfScalarPos(u8, line, i + 1, ']') orelse continue;
        var parts = std.mem.splitScalar(u8, line[i + 1 .. close], ',');
        while (parts.next()) |p| {
            const t = trimJs(p);
            if (t.len == 0) continue;
            var dup = false;
            for (into.items) |x| if (std.mem.eql(u8, x, t)) {
                dup = true;
            };
            if (!dup) try into.append(a, t);
        }
        return;
    }
}

/// JavaScript's \s and String.prototype.trim(): ASCII spaces and the Unicode ones a source could hold.
fn spaceLen(s: []const u8, i: usize) usize {
    const c = s[i];
    if (c == ' ' or c == '\t' or c == '\n' or c == '\r' or c == 0x0B or c == 0x0C) return 1;
    if (c == 0xC2 and i + 1 < s.len and s[i + 1] == 0xA0) return 2;
    if (i + 2 < s.len) {
        const b = s[i + 1];
        const d = s[i + 2];
        if ((c == 0xE1 and b == 0x9A and d == 0x80) or
            (c == 0xE2 and b == 0x80 and ((d >= 0x80 and d <= 0x8A) or d == 0xA8 or d == 0xA9 or d == 0xAF)) or
            (c == 0xE2 and b == 0x81 and d == 0x9F) or (c == 0xE3 and b == 0x80 and d == 0x80) or
            (c == 0xEF and b == 0xBB and d == 0xBF)) return 3;
    }
    return 0;
}
fn isJsSpace(s: []const u8, i: usize) bool {
    return spaceLen(s, i) > 0;
}
fn trimJs(s: []const u8) []const u8 {
    var a: usize = 0;
    while (a < s.len and isJsSpace(s, a)) a += spaceLen(s, a);
    var r = contract_mod.trimJsEnd(s[a..]);
    _ = &r;
    return r;
}

fn project(a: Allocator, d: Data, source: []const u8, medium: []const u8, vibe: []const u8) !Projection {
    // the medium is declared on a VIBE, so the projection IS appending one; the declaration is never edited
    const projected = try std.fmt.allocPrint(a, "{s}\nDEFINE VIBE {s} (\n  SURFACE_AS {s}\n)\n", .{ source, vibe, medium });
    const findings = try core.verify(a, projected, null);

    var verbs: std.ArrayList([]const u8) = .empty;
    var sigs: std.ArrayList([]const u8) = .empty;
    var lines = std.mem.splitScalar(u8, source, '\n');
    while (lines.next()) |line| {
        try listOn(a, line, "SATISFIES", &verbs);
        try listOn(a, line, "SIGNALS", &sigs);
    }
    std.mem.sort([]const u8, verbs.items, {}, lessThan);
    std.mem.sort([]const u8, sigs.items, {}, lessThan);
    var intents: std.ArrayList(Pair) = .empty;
    for (verbs.items) |v| try intents.append(a, .{ .key = v, .val = carriageOf(d, medium, v) });
    var signals: std.ArrayList(Pair) = .empty;
    for (sigs.items) |v| try signals.append(a, .{ .key = v, .val = signalRendering(d, medium, v) });
    var ids: std.ArrayList([]const u8) = .empty;
    for (findings) |f| try ids.append(a, f.id);
    std.mem.sort([]const u8, ids.items, {}, lessThan);
    return .{ .medium = medium, .intents = intents.items, .signals = signals.items, .diagnostics = ids.items };
}

const Verdict = enum { predicted, undecided, drift };
const Diff = struct { kind: []const u8, subject: []const u8, a_val: []const u8, b_val: []const u8, verdict: Verdict, because: []const u8 };

fn unionKeys(a: Allocator, x: []const Pair, y: []const Pair) ![]const []const u8 {
    var out: std.ArrayList([]const u8) = .empty;
    for ([_][]const Pair{ x, y }) |list| for (list) |p| {
        var seen = false;
        for (out.items) |k| if (std.mem.eql(u8, k, p.key)) {
            seen = true;
        };
        if (!seen) try out.append(a, p.key);
    };
    return out.items;
}
fn contains(xs: []const []const u8, s: []const u8) bool {
    for (xs) |x| if (std.mem.eql(u8, x, s)) return true;
    return false;
}
fn show(v: ?[]const u8) []const u8 {
    return v orelse "undefined";
}

/// Silence is checked BEFORE equality: two silences compare equal and would otherwise vanish from the report.
fn compare(a: Allocator, pa: Projection, pb: Projection) ![]const Diff {
    var diffs: std.ArrayList(Diff) = .empty;
    const same_medium = std.mem.eql(u8, pa.medium, pb.medium);
    const Kind = struct { kind: []const u8, silent: []const u8, file: []const u8, what: []const u8, xs: []const Pair, ys: []const Pair };
    const kinds = [_]Kind{
        .{ .kind = "intent", .silent = "unknown", .file = "media.json", .what = "verb", .xs = pa.intents, .ys = pb.intents },
        .{ .kind = "signal", .silent = "undecided", .file = "signal.json", .what = "value", .xs = pa.signals, .ys = pb.signals },
    };
    for (kinds) |k| for (try unionKeys(a, k.xs, k.ys)) |key| {
        const av = lookup(k.xs, key);
        const bv = lookup(k.ys, key);
        var silent: std.ArrayList([]const u8) = .empty;
        if (av != null and std.mem.eql(u8, av.?, k.silent)) try silent.append(a, pa.medium);
        if (bv != null and std.mem.eql(u8, bv.?, k.silent)) try silent.append(a, pb.medium);
        // an object keyed by medium: the same medium on both sides holds the later value twice
        const shown_a = if (same_medium) show(bv) else show(av);
        if (silent.items.len > 0) {
            const sides = try std.mem.join(a, " or ", silent.items);
            const because = if (std.mem.eql(u8, k.kind, "intent"))
                try std.fmt.allocPrint(a, "media.json does not enumerate {s}, so this verb's carriage is unproved", .{sides})
            else
                try std.fmt.allocPrint(a, "signal.json records no rendering for {s}, so this value is unproved rather than wrong", .{sides});
            try diffs.append(a, .{ .kind = k.kind, .subject = key, .a_val = shown_a, .b_val = show(bv), .verdict = .undecided, .because = because });
            continue;
        }
        if (av != null and bv != null and std.mem.eql(u8, av.?, bv.?)) continue;
        if (av == null and bv == null) continue;
        try diffs.append(a, .{ .kind = k.kind, .subject = key, .a_val = shown_a, .b_val = show(bv), .verdict = .predicted, .because = try std.fmt.allocPrint(a, "{s} records this {s} as {s} on {s} and {s} on {s}", .{ k.file, k.what, show(av), pa.medium, show(bv), pb.medium }) });
    };
    // refusals
    var all: std.ArrayList([]const u8) = .empty;
    for ([_][]const []const u8{ pa.diagnostics, pb.diagnostics }) |list| for (list) |id| if (!contains(all.items, id)) try all.append(a, id);
    for (all.items) |id| {
        const in_a = contains(pa.diagnostics, id);
        const in_b = contains(pb.diagnostics, id);
        if (in_a == in_b) continue;
        const only = if (in_a) pa.medium else pb.medium;
        const medium_diag = std.mem.eql(u8, id, "VERB_NOT_CARRIED") or std.mem.eql(u8, id, "SIGNAL_UNPERCEIVABLE");
        const av: []const u8 = if (in_a) "raised" else "-";
        const bv: []const u8 = if (in_b) "raised" else "-";
        try diffs.append(a, .{
            .kind = "refusal",
            .subject = id,
            .a_val = if (same_medium) bv else av,
            .b_val = bv,
            .verdict = if (medium_diag) .predicted else .drift,
            .because = if (medium_diag)
                try std.fmt.allocPrint(a, "{s} is a medium diagnostic; raising it on {s} alone is the axis working", .{ id, only })
            else
                try std.fmt.allocPrint(a, "{s} is not a medium diagnostic, so one declaration was judged differently for a reason the data does not explain", .{id}),
        });
    }
    return diffs.items;
}

fn caseSource(name: []const u8) ?[]const u8 {
    for (folder) |f| if (std.mem.eql(u8, f.name, name)) return f.src;
    return null;
}

pub fn run(a: Allocator, out: *std.Io.Writer, err: *std.Io.Writer, spec_path: ?[]const u8, verbose: bool) !u8 {
    const d: Data = .{
        .media = try std.json.parseFromSliceLeaky(Value, a, media_json, contract_mod.js_parse),
        .signal = try std.json.parseFromSliceLeaky(Value, a, signal_json, contract_mod.js_parse),
    };
    const spec_text: []const u8 = if (spec_path) |p| std.fs.cwd().readFileAlloc(a, p, 64 * 1024 * 1024) catch |e| {
        try err.print("cross-medium: cannot read the spec: {s}\n", .{@errorName(e)});
        return 2;
    } else caseSource("spec.json") orelse {
        try err.writeAll("cross-medium: cannot read the spec: not among the files this binary was built with\n");
        return 2;
    };
    const spec = std.json.parseFromSliceLeaky(Value, a, try core.wellFormed(a, spec_text), contract_mod.js_parse) catch |e| {
        try err.print("cross-medium: cannot read the spec: {s}\n", .{@errorName(e)});
        return 2;
    };
    const cases = if (get(spec, "cases")) |c| (if (c == .array) c.array.items else &[_]Value{}) else &[_]Value{};
    const media_list = get(d.media, "media");
    const values = get(d.signal, "values");
    try out.print("\nCross-medium conformance — {d} case(s)\n", .{cases.len});
    try out.print("  media        {d} enumerated, matrix v{s}\n", .{ if (media_list) |m| (if (m == .array) m.array.items.len else 0) else 0, strOf(get(get(d.media, "metadata"), "version")) orelse "undefined" });
    try out.print("  signals      {d} values, vocabulary v{s}\n", .{ if (values) |m| (if (m == .array) m.array.items.len else 0) else 0, strOf(get(get(d.signal, "metadata"), "version")) orelse "undefined" });

    var drifted: usize = 0;
    var undecided: usize = 0;
    for (cases) |c| {
        const file = strOf(get(c, "file")) orelse "undefined";
        const src = caseSource(file) orelse {
            try err.print("  {s}: cannot read — not among the files this binary was built with\n", .{file});
            return 2;
        };
        const media = get(c, "media");
        const m0 = if (media) |m| (if (m == .array and m.array.items.len > 0) strOf(m.array.items[0]) orelse "undefined" else "undefined") else "undefined";
        const m1 = if (media) |m| (if (m == .array and m.array.items.len > 1) strOf(m.array.items[1]) orelse "undefined" else "undefined") else "undefined";
        const source = try core.wellFormed(a, src);
        const pa = try project(a, d, source, m0, "projection_a");
        const pb = try project(a, d, source, m1, "projection_b");
        const diffs = try compare(a, pa, pb);

        var bad: usize = 0;
        var gaps: usize = 0;
        for (diffs) |x| switch (x.verdict) {
            .drift => bad += 1,
            .undecided => gaps += 1,
            else => {},
        };
        var kept: usize = 0;
        for (pa.intents) |p| {
            if (std.mem.eql(u8, p.val, "absent")) continue;
            const b = lookup(pb.intents, p.key);
            if (b != null and std.mem.eql(u8, b.?, "absent")) continue;
            kept += 1;
        }
        try out.print("\n  {s}  —  {s} vs {s}\n", .{ file, m0, m1 });
        try out.print("    intents      {d} declared · {d} carried by both\n", .{ pa.intents.len, kept });
        try out.print("    signals      {d} declared\n", .{pa.signals.len});
        try out.print("    differences  {d} total · {d} predicted · {d} undecided · {d} drift\n", .{ diffs.len, diffs.len - bad - gaps, gaps, bad });
        if (verbose) for (diffs) |x| {
            const tag = switch (x.verdict) {
                .predicted => "ok   ",
                .undecided => "gap  ",
                .drift => "DRIFT",
            };
            try out.print("      {s} {s} {s}: {s}={s} {s}={s}\n", .{ tag, x.kind, x.subject, m0, x.a_val, m1, x.b_val });
            try out.print("             {s}\n", .{x.because});
        };
        if (gaps > 0) {
            undecided += gaps;
            try out.writeAll("\n    UNDECIDED — nothing is contradicted; the data is silent, so this pair is not proved:\n");
            for (diffs) |x| if (x.verdict == .undecided) try out.print("      {s} {s}: {s}\n", .{ x.kind, x.subject, x.because });
        }
        if (bad > 0) {
            drifted += bad;
            try out.writeAll("\n    DRIFT — one declaration judged two ways, unexplained:\n");
            for (diffs) |x| if (x.verdict == .drift) try out.print("      {s} {s}: {s}\n", .{ x.kind, x.subject, x.because });
        }
    }
    try out.writeAll("\n");
    if (drifted > 0) {
        try out.print("  {d} drift(s) — one declaration produced two renderings that diverge\n", .{drifted});
        try out.writeAll("  for a reason media.json and signal.json do not explain. This is the failure.\n");
        return 1;
    }
    if (undecided > 0) {
        try out.print("  no drift, and {d} difference(s) the data cannot yet speak to.\n", .{undecided});
        try out.writeAll("  Nothing here is wrong. The central claim is NOT PROVED for these pairs,\n");
        try out.writeAll("  and it will not be until the silent channel records what it renders.\n");
        return 1;
    }
    try out.writeAll("  every difference predicted — one declaration, two renderings, nothing lost\n");
    try out.writeAll("  that the law protects and the data did not already account for.\n");
    return 0;
}
