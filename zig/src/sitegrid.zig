//! sitegrid.zig: `zane site grid [--write]`, the two tables of the Approach pages drawn from their data, as
//! tools/site-grid.js draws them, and the coverage counts of doc/design/coverage-count.js that the grid and
//! `zane site facts` read (doc/design/BINARY.md, S5).
//!
//!   site/grid.html   <!-- grid:table -->      the coverage grid: a row per channel, a column per activity
//!   site/media.html  <!-- channels:table -->  the ten channels and their properties, from conformance/media.json
//!
//! Like `zane pack`, it reads the tree it is run in (the repository's root): the placement file, the law, media.json,
//! violations.json, the manifest and the fixtures, never the copies built into the binary. The counts are those of
//! coverage-count.js --json, by the same reading; its text report (--grid, --cells) is not carried here and stays a
//! JavaScript tool.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const js = @import("js.zig");
const re = @import("regex.zig");

pub fn readFile(a: Allocator, rel: []const u8) ![]const u8 {
    return std.fs.cwd().readFileAlloc(a, rel, 256 * 1024 * 1024);
}
pub fn exists(rel: []const u8) bool {
    std.fs.cwd().access(rel, .{}) catch return false;
    return true;
}
pub fn parse(a: Allocator, rel: []const u8) !Value {
    return std.json.parseFromSliceLeaky(Value, a, try readFile(a, rel), contract_mod.js_parse);
}

// ---- the coverage counts (doc/design/coverage-count.js) -------------------------------------------------------

pub const activities = [_][]const u8{ "perceive", "understand", "decide", "act", "recover", "trust" };
fn letter(c: u8) ?usize {
    return switch (c) {
        'P' => 0,
        'U' => 1,
        'D' => 2,
        'A' => 3,
        'R' => 4,
        'T' => 5,
        else => null,
    };
}
/// The intent verbs a user uses in each activity; perceive and trust own none (coverage-count.js VERBS).
const verbs_of = [6][]const []const u8{
    &.{},
    &.{ "DISCOVER", "UNDERSTAND", "LOCATE", "READ", "SCAN", "SCROLL", "ZOOM", "COMPARE" },
    &.{ "FOCUS", "FILTER", "SELECT", "HIGHLIGHT", "PREVIEW", "MARK" },
    &.{ "ACT", "CONFIRM" },
    &.{ "CANCEL", "UNDO", "PAUSE", "RESUME", "RETRY", "EXIT" },
    &.{},
};

pub const Coverage = struct {
    /// "any" first, then the media of media.json
    cols: []const []const u8,
    /// by activity * cols.len + column
    closed: []bool,
    rules: []usize,
    fixtures: []usize,
    closed_cells: usize = 0,
    open_cells: usize = 0,
    open_with_rule: usize = 0,
    open_with_none: usize = 0,
    any_with_rule: usize = 0,
    placed: usize = 0,
    on_no_cell: usize = 0,
    visual_only: usize = 0,
    medium_free: usize = 0,
    other_media: usize = 0,
    on_visual_column: usize = 0,
    media_with_no_rule: usize = 0,

    pub fn at(c: Coverage, act: usize, col: usize) usize {
        return act * c.cols.len + col;
    }
};

fn colOf(cols: []const []const u8, m: []const u8) ?usize {
    for (cols, 0..) |c, i| if (std.mem.eql(u8, c, m)) return i;
    return null;
}
fn contains(list: []const []const u8, s: []const u8) bool {
    for (list) |x| if (std.mem.eql(u8, x, s)) return true;
    return false;
}

/// The grid, counted from the tree as coverage-count.js counts it.
pub fn coverage(a: Allocator) !Coverage {
    const place = try parse(a, "doc/design/coverage-placement.json");
    const media = try parse(a, "conformance/media.json");
    const viol = try parse(a, "conformance/violations.json");
    const man = try parse(a, "conformance/manifest.json");

    var cols: std.ArrayList([]const u8) = .empty;
    try cols.append(a, "any");
    const media_list = js.items(js.get(media, "media"));
    for (media_list) |m| try cols.append(a, try js.string(a, js.get(m, "id")));
    const nc = cols.items.len;

    // a verb is absent from a medium the way zane.js derives it: default "absent" keeps only native and degraded
    var absent_in = try a.alloc([]const []const u8, media_list.len);
    for (media_list, 0..) |m, i| {
        const c = js.get(m, "carries");
        var list: std.ArrayList([]const u8) = .empty;
        if (std.mem.eql(u8, js.text(js.get(c, "default")) orelse "", "absent")) {
            for (core.intent_verbs) |v| if (!js.includes(js.get(c, "native"), v) and !js.includes(js.get(c, "degraded"), v)) try list.append(a, v);
        } else for (js.items(js.get(c, "absent"))) |v| if (v == .string) try list.append(a, v.string);
        absent_in[i] = list.items;
    }

    var cov: Coverage = .{
        .cols = cols.items,
        .closed = try a.alloc(bool, 6 * nc),
        .rules = try a.alloc(usize, 6 * nc),
        .fixtures = try a.alloc(usize, 6 * nc),
    };
    @memset(cov.rules, 0);
    @memset(cov.fixtures, 0);
    for (0..6) |act| for (0..nc) |col| {
        var shut = col > 0 and verbs_of[act].len > 0;
        if (shut) for (verbs_of[act]) |v| if (!contains(absent_in[col - 1], v)) {
            shut = false;
        };
        cov.closed[cov.at(act, col)] = shut;
    };

    // the rules, on the cells they are written for
    const placed = js.get(place, "rules");
    if (placed) |p| if (p == .object) {
        var it = p.object.iterator();
        while (it.next()) |e| {
            const r = e.value_ptr.*;
            const m = js.get(r, "media");
            const any = if (m) |x| x == .string and std.mem.eql(u8, x.string, "any") else false;
            const acts = js.text(js.get(r, "activities")) orelse "";
            for (acts) |L| {
                const act = letter(L) orelse continue;
                if (any) {
                    cov.rules[cov.at(act, 0)] += 1;
                } else for (js.items(m)) |x| if (x == .string) if (colOf(cols.items, x.string)) |col| {
                    cov.rules[cov.at(act, col)] += 1;
                };
            }
            cov.placed += 1;
            const list = js.items(m);
            if (any) cov.medium_free += 1 else {
                if (list.len == 1 and list[0] == .string and std.mem.eql(u8, list[0].string, "visual")) cov.visual_only += 1 else cov.other_media += 1;
                if (js.includes(m, "visual")) cov.on_visual_column += 1;
            }
        }
    };
    if (js.get(place, "off")) |o| if (o == .object) {
        cov.on_no_cell = o.object.count();
    };

    // the fixtures, on the cells of the rules their diagnostics cite
    var rules_of = std.StringHashMap([]const []const u8).init(a);
    for (js.items(js.get(viol, "diagnostics"))) |d| {
        var list: std.ArrayList([]const u8) = .empty;
        for (js.items(js.get(d, "rules"))) |x| try list.append(a, try js.string(a, x));
        try rules_of.put(try js.string(a, js.get(d, "id")), list.items);
    }
    const fixtures = js.items(js.get(man, "fixtures"));
    const stemOf = struct {
        fn f(file: []const u8) []const u8 {
            return if (std.mem.endsWith(u8, file, ".zane")) file[0 .. file.len - 5] else file;
        }
    }.f;
    const comment = try re.compile(a, "\\/\\/.*$", "gm");
    const surface = try re.compile(a, "SURFACE_AS\\s+([a-z_]+)", "");
    for (fixtures) |f| {
        const file = js.text(js.get(f, "file")) orelse "";
        var ids = js.items(js.get(f, "expect_ids"));
        const stem = stemOf(file);
        if (ids.len == 0 and std.mem.endsWith(u8, stem, "-lawful")) {
            const base = stem[0 .. stem.len - "-lawful".len];
            var twin: ?Value = null;
            // fxByStem.get(base): the last fixture of that stem
            for (fixtures) |t| if (std.mem.eql(u8, stemOf(js.text(js.get(t, "file")) orelse ""), base)) {
                twin = t;
            };
            if (twin == null) for (fixtures) |t| {
                const ts = stemOf(js.text(js.get(t, "file")) orelse "");
                if (js.items(js.get(t, "expect_ids")).len > 0 and std.mem.startsWith(u8, ts, base)) {
                    twin = t;
                    break;
                }
            };
            if (twin) |t| ids = js.items(js.get(t, "expect_ids"));
        }
        const path = try js.fmt(a, "conformance/fixtures/{s}", .{file});
        const src = try re.replace(a, &comment, try core.wellFormed(a, try readFile(a, path)), "");
        const medium = if (re.exec(&surface, src, 0)) |m| m.get(src, 1).? else "any";
        const col = colOf(cols.items, medium) orelse 0;
        var rs: std.ArrayList([]const u8) = .empty;
        for (ids) |id| for (rules_of.get(try js.string(a, id)) orelse &.{}) |n| {
            if (!contains(rs.items, n) and js.get(placed, n) != null) try rs.append(a, n);
        };
        var acts = [_]bool{false} ** 6;
        for (rs.items) |n| for (js.text(js.get(js.get(placed, n), "activities")) orelse "") |L| {
            if (letter(L)) |act| acts[act] = true;
        };
        for (acts, 0..) |on, act| if (on) {
            cov.fixtures[cov.at(act, col)] += 1;
        };
    }

    for (0..6) |act| {
        for (1..nc) |col| {
            const i = cov.at(act, col);
            if (cov.closed[i]) {
                cov.closed_cells += 1;
                continue;
            }
            cov.open_cells += 1;
            if (cov.rules[i] > 0) cov.open_with_rule += 1 else cov.open_with_none += 1;
        }
        if (cov.rules[cov.at(act, 0)] > 0) cov.any_with_rule += 1;
    }
    for (1..nc) |col| {
        var some = false;
        for (0..6) |act| if (cov.rules[cov.at(act, col)] > 0) {
            some = true;
        };
        if (!some) cov.media_with_no_rule += 1;
    }
    return cov;
}

// ---- the two tables (tools/site-grid.js) ----------------------------------------------------------------------

/// esc in site-grid.js and site-shell.js: & and < only.
pub fn esc(a: Allocator, s: []const u8) ![]const u8 {
    const x = try std.mem.replaceOwned(u8, a, s, "&", "&amp;");
    return std.mem.replaceOwned(u8, a, x, "<", "&lt;");
}

fn gridTable(a: Allocator) anyerror![]const u8 {
    const g = try coverage(a);
    var w: std.Io.Writer.Allocating = .init(a);
    const o = &w.writer;
    try o.writeAll("<div class=\"scroll\">\n<table class=\"gridmap\">\n  <caption>The coverage grid: each channel, and what a user does there. A cell reads <b>rules written for it · fixtures on it</b>.</caption>\n  <thead><tr><th scope=\"col\">Channel</th>");
    for (activities) |act| try o.writeAll(try js.fmt(a, "<th scope=\"col\">{s}</th>", .{try esc(a, act)}));
    try o.writeAll("</tr></thead>\n  <tbody>\n");
    for (g.cols, 0..) |c, col| {
        if (col > 0) try o.writeByte('\n');
        try o.writeAll(try js.fmt(a, "    <tr><th scope=\"row\">{s}</th>", .{if (col == 0) "any channel" else try esc(a, c)}));
        for (0..6) |act| {
            const i = g.at(act, col);
            if (g.closed[i]) {
                try o.writeAll("<td class=\"g-closed\">closed</td>");
            } else if (g.rules[i] > 0) {
                try o.writeAll(try js.fmt(a, "<td class=\"g-has\"><b>{d}</b> · {d}</td>", .{ g.rules[i], g.fixtures[i] }));
            } else if (g.fixtures[i] > 0) {
                try o.writeAll(try js.fmt(a, "<td class=\"g-none\">none · {d}</td>", .{g.fixtures[i]}));
            } else try o.writeAll("<td class=\"g-none\">none</td>");
        }
        try o.writeAll("</tr>");
    }
    try o.writeAll("\n  </tbody>\n</table>\n</div>");
    return w.written();
}

const channel_verbs = [_][]const u8{ "DISCOVER", "UNDERSTAND", "LOCATE", "FOCUS", "FILTER", "COMPARE", "READ", "SCAN", "SCROLL", "ZOOM", "SELECT", "HIGHLIGHT", "PREVIEW", "MARK", "ACT", "CONFIRM", "CANCEL", "UNDO", "PAUSE", "RESUME", "RETRY", "EXIT" };

fn channelsTable(a: Allocator) anyerror![]const u8 {
    const m = try parse(a, "conformance/media.json");
    var w: std.Io.Writer.Allocating = .init(a);
    const o = &w.writer;
    try o.writeAll("<div class=\"scroll\">\n<table class=\"gridmap channels\">\n  <caption>The ten channels, by what each is made of, from <code>conformance/media.json</code>.</caption>\n  <thead><tr><th scope=\"col\">Channel</th><th scope=\"col\">What it is</th><th scope=\"col\">Rendering stays</th><th scope=\"col\">Order</th><th scope=\"col\">Attention</th><th scope=\"col\">Per glance</th><th scope=\"col\">Can be withdrawn</th><th scope=\"col\">Alone is a whole interface</th><th scope=\"col\">Verbs it cannot carry</th></tr></thead>\n  <tbody>\n");
    for (js.items(js.get(m, "media")), 0..) |c, i| {
        if (i > 0) try o.writeByte('\n');
        const p = js.get(c, "properties");
        const car = js.get(c, "carries");
        var absent: usize = 0;
        if (std.mem.eql(u8, js.text(js.get(car, "default")) orelse "", "absent")) {
            for (channel_verbs) |v| if (!js.includes(js.get(car, "native"), v) and !js.includes(js.get(car, "degraded"), v)) {
                absent += 1;
            };
        } else absent = js.items(js.get(car, "absent")).len;
        const sole = if (js.get(c, "soleCarrier")) |x| switch (x) {
            .null => false,
            .bool => |b| b,
            .integer => |n| n != 0,
            .float => |f| f != 0 and !std.math.isNan(f),
            .string => |s| s.len > 0,
            else => true,
        } else false;
        try o.writeAll(try js.fmt(a, "    <tr><th scope=\"row\">{s}</th><td>{s}</td><td>{s}</td><td>{s}</td><td>{s}</td><td>{s}</td><td>{s}</td><td>{s}</td><td>{d} of {d}</td></tr>", .{
            try esc(a, try js.string(a, js.get(c, "id"))),
            try esc(a, try js.string(a, js.get(c, "title"))),
            try esc(a, try js.string(a, js.get(p, "persistence"))),
            try esc(a, try js.string(a, js.get(p, "seriality"))),
            try esc(a, try js.string(a, js.get(p, "election"))),
            try esc(a, try js.string(a, js.get(p, "bandwidth"))),
            try esc(a, try js.string(a, js.get(p, "retractability"))),
            if (sole) "yes" else "no",
            absent,
            channel_verbs.len,
        }));
    }
    try o.writeAll("\n  </tbody>\n</table>\n</div>");
    return w.written();
}

const Block = struct { file: []const u8, name: []const u8, make: *const fn (Allocator) anyerror![]const u8 };
const blocks = [_]Block{
    .{ .file = "site/grid.html", .name = "grid:table", .make = &gridTable },
    .{ .file = "site/media.html", .name = "channels:table", .make = &channelsTable },
};

/// The problems of the check (each line without its "PROBLEM " prefix), or, with `write`, the tables drawn.
pub fn check(a: Allocator, out: ?*std.Io.Writer, write: bool, problems: *std.ArrayList([]const u8)) !void {
    for (blocks) |b| {
        if (!exists(b.file)) {
            try problems.append(a, try js.fmt(a, "{s}: missing", .{b.file}));
            continue;
        }
        const raw = try readFile(a, b.file);
        const crlf = std.mem.indexOf(u8, raw, "\r\n") != null;
        const text = try std.mem.replaceOwned(u8, a, raw, "\r\n", "\n");
        const fence = try re.compile(a, try js.fmt(a, "<!-- {s} -->[\\s\\S]*?<!-- \\/{s} -->", .{ b.name, b.name }), "");
        const m = re.exec(&fence, text, 0) orelse {
            try problems.append(a, try js.fmt(a, "{s}: no <!-- {s} --> fence", .{ b.file, b.name }));
            continue;
        };
        const drawn = try js.fmt(a, "{s}<!-- {s} -->\n{s}\n<!-- /{s} -->{s}", .{ text[0..m.start], b.name, try b.make(a), b.name, text[m.end..] });
        if (std.mem.eql(u8, drawn, text)) continue;
        if (write) {
            const data = if (crlf) try std.mem.replaceOwned(u8, a, drawn, "\n", "\r\n") else drawn;
            try std.fs.cwd().writeFile(.{ .sub_path = b.file, .data = data });
            if (out) |o| try o.writeAll(try js.fmt(a, "wrote  {s}\n", .{b.file}));
        } else try problems.append(a, try js.fmt(a, "{s}: the {s} differs from the data it is drawn from (run tools/site-grid.js --write)", .{ b.file, b.name }));
    }
}

/// `zane site grid [--write]`: what node tools/site-grid.js [--write] prints, and its exit code.
pub fn run(a: Allocator, out: *std.Io.Writer, argv: []const []const u8) !u8 {
    var write = false;
    for (argv) |x| if (std.mem.eql(u8, x, "--write")) {
        write = true;
    };
    var problems: std.ArrayList([]const u8) = .empty;
    try check(a, out, write, &problems);
    if (problems.items.len > 0) {
        for (problems.items) |p| try out.writeAll(try js.fmt(a, "PROBLEM {s}\n", .{p}));
        return 1;
    }
    if (write) try out.writeAll("grid written\n") else try out.writeAll(try js.fmt(a, "grid ok: {d} tables match their data\n", .{blocks.len}));
    return 0;
}
