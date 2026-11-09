//! sitefacts.zig: `zane site facts [--write] [--unchecked]`, every figure on the site has a file, or it is not on the
//! page: tools/site-facts.js in Zig, printing what it prints (doc/design/BINARY.md, S5; doc/design/SITE.md section 4).
//!
//! It derives every figure from the tree and fails when site/facts.json differs from it, when a span's fallback differs
//! from the derived value, when a typed number stands outside any span, when a declaration and the terminal that
//! checked it no longer match a real run of the verifier, when an excerpt is not a passage of its file, when a terminal
//! that names its command is not what that command prints, when a table of the Approach pages drifts from its data,
//! when a status word is not one of three, and when a primary button sits in a reading page's head or scrolls within
//! its own page.
//!
//! Where the script spawns a process, this calls the code: a page's verifier run (`$ zane check NAME.zane`, since S6) goes to
//! the core (report.zig) with the contract and the law read from the tree, as tools/zane/cli.js reads them; a terminal's
//! `data-run="zane COMMAND ..."` goes to the binary's own command through main.dispatch (check, conformance, pack,
//! cross-medium, audit-facts), where the script runs that command's JavaScript reference, which tools/zane/parity.js proves
//! prints the same; the coverage counts and the grid check are sitegrid.zig. One difference follows, named rather than
//! hidden: `zane conformance`, `cross-medium` and `audit-facts` check the data they were BUILT with, where the references
//! read the tree, so a terminal of theirs equals the tree's run only while the binary is current (rebuild after changing the
//! suite). Until S6 a terminal named `node tools/zane/NAME.js`, and one naming a script the binary does not carry was a
//! second difference; the five commands are now the only ones either side accepts.
//! The figure `kinds` is the core's own table of declaration kinds, where the script reads zane.js's: the binary's
//! verifier is the one this binary runs.
//!
//! It reads the tree it is run in, like `zane pack`: run it from the repository's root.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const report = @import("report.zig");
const js = @import("js.zig");
const re = @import("regex.zig");
const grid = @import("sitegrid.zig");
const main_mod = @import("main.zig");

const readFile = grid.readFile;
const exists = grid.exists;
const parse = grid.parse;
const List = std.ArrayList([]const u8);

const fmt = js.fmt;

// ---- the figures ----------------------------------------------------------------------------------------------

const Fact = struct { key: []const u8, value: ?Value, src: []const u8 };
const Facts = struct {
    a: Allocator,
    list: std.ArrayList(Fact) = .empty,

    fn put(self: *Facts, k: []const u8, v: ?Value, from: []const u8) !void {
        for (self.list.items) |*f| if (std.mem.eql(u8, f.key, k)) {
            f.value = v;
            f.src = from;
            return;
        };
        try self.list.append(self.a, .{ .key = k, .value = v, .src = from });
    }
    fn int(self: *Facts, k: []const u8, x: i64, from: []const u8) !void {
        return self.put(k, .{ .integer = x }, from);
    }
    fn get(self: *const Facts, k: []const u8) ?Value {
        for (self.list.items) |f| if (std.mem.eql(u8, f.key, k)) return f.value;
        return null;
    }
};

fn n(x: usize) i64 {
    return @intCast(x);
}

/// Object.keys(v).length for an object, .length for an array.
fn size(v: ?Value) usize {
    const x = v orelse return 0;
    return switch (x) {
        .object => |o| o.count(),
        .array => |arr| arr.items.len,
        else => 0,
    };
}

fn isSetKey(k: []const u8) bool {
    if (!std.mem.startsWith(u8, k, "set") or k.len < 4) return false;
    for (k[3..]) |c| if (!std.ascii.isDigit(c)) return false;
    return true;
}

fn isNum(v: ?Value, want: f64) bool {
    return if (js.numOf(v)) |x| x == want else false;
}

fn derive(a: Allocator, verifier_runs: usize) !Facts {
    var f: Facts = .{ .a = a };

    const law = try parse(a, "constitution/rules.json");
    var rules: std.ArrayList(Value) = .empty;
    var sets: usize = 0;
    if (law == .object) {
        var it = law.object.iterator();
        while (it.next()) |e| if (isSetKey(e.key_ptr.*)) {
            sets += 1;
            for (js.items(js.get(e.value_ptr.*, "rules"))) |r| try rules.append(a, r);
        };
    }
    try f.int("law.rules", n(rules.items.len), "constitution/rules.json");
    try f.put("law.version", js.get(js.get(law, "metadata"), "version"), "constitution/rules.json metadata.version");
    try f.int("law.articles", n(size(js.get(law, "articles"))), "constitution/rules.json articles");
    try f.int("law.retired", n(size(js.get(law, "retired"))), "constitution/rules.json retired");
    try f.int("law.burned", n(size(js.get(law, "burned"))), "constitution/rules.json burned");
    try f.int("law.rights", n(size(js.get(law, "rights"))), "constitution/rules.json rights");
    try f.int("law.forbidden", n(js.items(js.get(law, "forbidden")).len), "constitution/rules.json forbidden");
    try f.int("law.sets", n(sets), "constitution/rules.json set*");
    for ([_][]const u8{ "machine", "tool", "machine-later", "judgment" }) |t| {
        var c: usize = 0;
        for (rules.items) |r| if (std.mem.eql(u8, js.text(js.get(r, "enforcement")) orelse "", t)) {
            c += 1;
        };
        try f.int(try fmt(a, "law.tier.{s}", .{t}), n(c), "constitution/rules.json enforcement");
    }
    var verbs: usize = 0;
    if (js.get(js.get(law, "intents"), "families")) |fams| if (fams == .object) {
        var it = fams.object.iterator();
        while (it.next()) |e| verbs += js.items(js.get(e.value_ptr.*, "verbs")).len;
    };
    try f.int("verbs", n(verbs), "constitution/rules.json intents.families");
    try f.int("kinds", n(core.zane_kinds.len), "tools/zane/zane.js ZANE_KINDS");

    const v = try parse(a, "conformance/violations.json");
    const diags = js.items(js.get(v, "diagnostics"));
    try f.int("diag.total", n(diags.len), "conformance/violations.json diagnostics");
    var errors: usize = 0;
    var warnings: usize = 0;
    var citing: usize = 0;
    var article_only: usize = 0;
    var cite_nothing: usize = 0;
    for (diags) |d| {
        const sev = js.text(js.get(d, "severity")) orelse "";
        if (std.mem.eql(u8, sev, "error")) errors += 1;
        if (std.mem.eql(u8, sev, "warning")) warnings += 1;
        const r = js.items(js.get(d, "rules")).len;
        const ar = js.items(js.get(d, "articles")).len;
        if (r > 0) citing += 1;
        if (r == 0 and ar > 0) article_only += 1;
        if (r == 0 and ar == 0 and js.items(js.get(d, "rights")).len == 0 and js.items(js.get(d, "forbidden_patterns")).len == 0) cite_nothing += 1;
    }
    try f.int("diag.errors", n(errors), "conformance/violations.json severity");
    try f.int("diag.warnings", n(warnings), "conformance/violations.json severity");
    try f.put("diag.contract", js.get(js.get(v, "metadata"), "version"), "conformance/violations.json metadata.version");
    try f.int("diag.levels", n(size(js.get(v, "levels"))), "conformance/violations.json levels");
    try f.int("diag.citingRules", n(citing), "conformance/violations.json rules");
    try f.int("diag.articleOnly", n(article_only), "conformance/violations.json articles with no rule");
    try f.int("diag.citeNothing", n(cite_nothing), "conformance/violations.json bindings empty");
    for (1..5) |l| {
        var c: usize = 0;
        for (diags) |d| if (isNum(js.get(d, "level"), @floatFromInt(l))) {
            c += 1;
        };
        try f.int(try fmt(a, "diag.level{d}", .{l}), n(c), "conformance/violations.json level");
    }

    const m = try parse(a, "conformance/manifest.json");
    const fixtures = js.items(js.get(m, "fixtures"));
    var twins: usize = 0;
    var refused: usize = 0;
    for (fixtures) |x| {
        if (std.mem.endsWith(u8, try js.string(a, js.get(x, "file")), "-lawful.zane")) twins += 1;
        if (js.items(js.get(x, "expect_ids")).len > 0) refused += 1;
    }
    try f.int("fixtures.total", n(fixtures.len), "conformance/manifest.json fixtures");
    try f.int("fixtures.refused", n(refused), "conformance/manifest.json expect_ids");
    try f.int("fixtures.twins", n(twins), "conformance/manifest.json (files named -lawful)");
    try f.int("fixtures.clean", n(fixtures.len) - n(refused) - n(twins), "conformance/manifest.json");
    for (1..5) |l| {
        var c: usize = 0;
        for (fixtures) |x| if (isNum(js.get(x, "level"), @floatFromInt(l))) {
            c += 1;
        };
        try f.int(try fmt(a, "fixtures.level{d}", .{l}), n(c), "conformance/manifest.json level");
    }
    try f.int("fixtures.unfixtured", n(js.items(js.get(m, "unfixtured")).len), "conformance/manifest.json unfixtured");

    const media = js.items(js.get(try parse(a, "conformance/media.json"), "media"));
    try f.int("media.count", n(media.len), "conformance/media.json media");
    // how a medium carries a verb: absent / degraded / native, by the same reading the verifier makes of media.json
    var act_absent: usize = 0;
    for (media) |mm| {
        const c = js.get(mm, "carries");
        const absent = js.includes(js.get(c, "absent"), "ACT") or
            (!js.includes(js.get(c, "degraded"), "ACT") and !js.includes(js.get(c, "native"), "ACT") and
                std.mem.eql(u8, js.text(js.get(c, "default")) orelse "", "absent"));
        if (absent) act_absent += 1;
    }
    try f.int("media.actAbsent", n(act_absent), "conformance/media.json media carriage of ACT");
    try f.int("pack.files", n(js.items(js.get(try parse(a, "protocol/MANIFEST.json"), "pinned")).len), "protocol/MANIFEST.json pinned");
    try f.int("signals.count", n(js.items(js.get(try parse(a, "conformance/signal.json"), "values")).len), "conformance/signal.json values");

    const stzu = try core.wellFormed(a, try readFile(a, "haro/zane.stzu"));
    try f.int("haro.constraints", n(re.count(&try re.compile(a, "^DEFINE CONSTRAINT ", "gm"), stzu)), "haro/zane.stzu (DEFINE CONSTRAINT)");
    const csv_text = try core.wellFormed(a, try readFile(a, "haro/twin-expected.csv"));
    var csv: List = .empty;
    for (try re.split(a, &try re.compile(a, "\\r?\\n", ""), csv_text)) |l| {
        if (re.trim(l).len == 0 or std.mem.startsWith(u8, l, "#") or std.mem.startsWith(u8, l, "fixture,")) continue;
        try csv.append(a, l);
    }
    try f.int("twin.differences", n(csv.items.len), "haro/twin-expected.csv rows");
    try f.int("twin.agree", n(fixtures.len) - n(csv.items.len), "conformance/manifest.json fixtures minus haro/twin-expected.csv rows");
    var seams: std.ArrayList(?[]const u8) = .empty;
    for (csv.items) |l| {
        const s = field(l, 3);
        var seen = false;
        for (seams.items) |x| if ((x == null and s == null) or (x != null and s != null and std.mem.eql(u8, x.?, s.?))) {
            seen = true;
        };
        if (!seen) try seams.append(a, s);
    }
    try f.int("twin.seams", n(seams.items.len), "haro/twin-expected.csv seam column");
    for ([_][2][]const u8{ .{ "other-code", "otherCode" }, .{ "not-refused", "notRefused" }, .{ "court-only", "courtOnly" } }) |kn| {
        var c: usize = 0;
        for (csv.items) |l| if (field(l, 4)) |x| if (std.mem.eql(u8, x, kn[0])) {
            c += 1;
        };
        try f.int(try fmt(a, "twin.{s}", .{kn[1]}), n(c), "haro/twin-expected.csv class column");
    }
    const gbnf_bytes: u64 = if (std.fs.cwd().statFile("haro/zane.gbnf")) |st| st.size else |_| 0;
    try f.int("haro.gbnfBytes", @intCast(gbnf_bytes), "haro/zane.gbnf");
    const gb = try core.wellFormed(a, try readFile(a, "haro/zane.gbnf"));
    try f.int("gbnf.kinds", n(re.count(&try re.compile(a, "^decl_[A-Z_]+ ::=", "gm"), gb)), "haro/zane.gbnf (decl_* productions)");

    const g = try grid.coverage(a);
    const cc = "doc/design/coverage-count.js";
    try f.int("grid.activities", grid.activities.len, cc);
    try f.int("grid.media", n(g.cols.len - 1), cc);
    try f.int("grid.closed", n(g.closed_cells), cc);
    try f.int("grid.cellsLive", n(g.open_cells + grid.activities.len), "doc/design/coverage-count.js open + medium-free cells");
    try f.int("grid.cellsWithRule", n(g.open_with_rule + g.any_with_rule), cc);
    try f.int("grid.cellsNone", n(g.open_with_none), cc);
    try f.int("grid.rulesScreenOnly", n(g.visual_only), cc);
    try f.int("grid.rulesMediumFree", n(g.medium_free), cc);
    try f.int("grid.rulesNamedOther", n(g.other_media), cc);
    try f.int("grid.rulesOffGrid", n(g.on_no_cell), cc);
    try f.int("grid.rulesOnVisual", n(g.on_visual_column), cc);
    try f.int("grid.channelsNoRule", n(g.media_with_no_rule), "doc/design/coverage-count.js media_with_no_rule_written_for_them");
    try f.int("grid.rulesPlaced", n(g.placed), cc);
    // the two blind reads: as measured when each was made, from the outputs saved beside them
    const both = try re.compile(a, "BOTH exact and same: (\\d+) of (\\d+)", "");
    for ([_][2][]const u8{ .{ "read1", "compare-output.txt" }, .{ "read2", "compare2-output.txt" } }) |kf| {
        const path = try fmt(a, "doc/design/placement-review/{s}", .{kf[1]});
        const o = try core.wellFormed(a, try readFile(a, path));
        if (re.exec(&both, o, 0)) |mm| {
            try f.put(try fmt(a, "grid.{s}.both", .{kf[0]}), try digits(mm.get(o, 1).?), path);
            try f.put(try fmt(a, "grid.{s}.of", .{kf[0]}), try digits(mm.get(o, 2).?), path);
        }
    }

    const d = try parse(a, "doc/design/audit/decides.json");
    const th = js.get(d, "thresholds");
    try f.int("audit.decides", n(js.items(js.get(d, "rules")).len), "doc/design/audit/decides.json");
    try f.put("audit.contrastFloor", js.get(th, "contrast_floor"), "doc/design/audit/decides.json thresholds");
    try f.put("audit.sizeFloorPt", js.get(th, "size_floor_pt"), "doc/design/audit/decides.json thresholds");
    try f.put("audit.minOcrScore", js.get(th, "min_ocr_score"), "doc/design/audit/decides.json thresholds");
    try f.put("audit.spreadLimit", js.get(th, "spread_limit"), "doc/design/audit/decides.json thresholds");

    try f.int("site.verifierRuns", n(verifier_runs), "the declaration and terminal pairs on the site pages (re-run by this script)");
    const tour = try core.wellFormed(a, try readFile(a, "site/tour.html"));
    try f.int("tour.scenes", n(std.mem.count(u8, tour, "class=\"scene-card\"")), "site/tour.html scene cards");
    return f;
}

/// +"123": a run of digits as a number
fn digits(s: []const u8) !Value {
    if (std.fmt.parseInt(i64, s, 10)) |x| return .{ .integer = x } else |_| return .{ .float = try std.fmt.parseFloat(f64, s) };
}

/// line.split(',')[i], or undefined
fn field(line: []const u8, i: usize) ?[]const u8 {
    var it = std.mem.splitScalar(u8, line, ',');
    var k: usize = 0;
    while (it.next()) |x| : (k += 1) if (k == i) return x;
    return null;
}

/// JSON.stringify({_about, facts (sorted, an undefined value left out), sources}, null, 2) + '\n'
fn factsText(a: Allocator, f: *const Facts) ![]const u8 {
    const sorted = try a.dupe(Fact, f.list.items);
    std.mem.sort(Fact, sorted, {}, struct {
        fn lt(_: void, x: Fact, y: Fact) bool {
            return std.mem.lessThan(u8, x.key, y.key);
        }
    }.lt);
    var facts = std.json.ObjectMap.init(a);
    var sources = std.json.ObjectMap.init(a);
    for (sorted) |x| {
        if (x.value) |val| try facts.put(x.key, val);
        try sources.put(x.key, .{ .string = x.src });
    }
    var root = std.json.ObjectMap.init(a);
    try root.put("_about", .{ .string = "Generated by tools/site-facts.js from the tree; do not edit. node tools/site-facts.js --write rewrites it, and the check fails when it is stale." });
    try root.put("facts", .{ .object = facts });
    try root.put("sources", .{ .object = sources });
    var buf: std.Io.Writer.Allocating = .init(a);
    try js.stringifyPretty(a, &buf.writer, .{ .object = root }, 0);
    try buf.writer.writeByte('\n');
    return buf.written();
}

// ---- the pages -------------------------------------------------------------------------------------------------

/// index.html, then every .html under site/, each folder's entries in name order (the order NTFS gives Node's readdir
/// on this tree, whose names are lower-case ASCII; a byte sort is the same order on every system).
pub fn pages(a: Allocator) !List {
    var out: List = .empty;
    try out.append(a, "index.html");
    try walk(a, "site", &out);
    return out;
}
fn walk(a: Allocator, d: []const u8, out: *List) !void {
    var dir = try std.fs.cwd().openDir(d, .{ .iterate = true });
    defer dir.close();
    const E = struct { name: []const u8, is_dir: bool };
    var entries: std.ArrayList(E) = .empty;
    var it = dir.iterate();
    while (try it.next()) |e| try entries.append(a, .{ .name = try a.dupe(u8, e.name), .is_dir = e.kind == .directory });
    std.mem.sort(E, entries.items, {}, struct {
        fn lt(_: void, x: E, y: E) bool {
            return std.mem.lessThan(u8, x.name, y.name);
        }
    }.lt);
    for (entries.items) |e| {
        const p = try fmt(a, "{s}/{s}", .{ d, e.name });
        if (e.is_dir) try walk(a, p, out) else if (std.mem.endsWith(u8, e.name, ".html")) try out.append(a, p);
    }
}

fn readPage(a: Allocator, p: []const u8) ![]const u8 {
    return core.wellFormed(a, try readFile(a, p));
}
fn lf(a: Allocator, s: []const u8) ![]const u8 {
    return std.mem.replaceOwned(u8, a, s, "\r\n", "\n");
}

/// decode in site-facts.js: tags removed, then the five entities, &amp; last
pub fn decode(a: Allocator, s: []const u8) ![]const u8 {
    var t = try re.sub(a, s, "<[^>]+>", "g", "");
    t = try std.mem.replaceOwned(u8, a, t, "&lt;", "<");
    t = try std.mem.replaceOwned(u8, a, t, "&gt;", ">");
    t = try std.mem.replaceOwned(u8, a, t, "&quot;", "\"");
    t = try std.mem.replaceOwned(u8, a, t, "&#39;", "'");
    return std.mem.replaceOwned(u8, a, t, "&amp;", "&");
}

/// norm in site-facts.js: LF, every line's trailing white space dropped, the trailing newlines dropped
fn norm(a: Allocator, t: []const u8) ![]const u8 {
    var out: std.ArrayList(u8) = .empty;
    var it = std.mem.splitScalar(u8, try lf(a, t), '\n');
    var first = true;
    while (it.next()) |l| {
        if (!first) try out.append(a, '\n');
        first = false;
        try out.appendSlice(a, re.trimEnd(l));
    }
    var s = out.items;
    while (s.len > 0 and s[s.len - 1] == '\n') s = s[0 .. s.len - 1];
    return s;
}

const Span = struct { kind: []const u8, key: []const u8, text: []const u8 };
fn spansOf(a: Allocator, html: []const u8) ![]const Span {
    const r = try re.compile(a, "<([a-z0-9]+)\\b[^>]*?\\sdata-(law-share|law|fact)=\"([^\"]*)\"[^>]*>([^<]*)<\\/\\1>", "g");
    var out: std.ArrayList(Span) = .empty;
    var it = re.iterate(&r, html);
    while (it.next()) |m| try out.append(a, .{ .kind = m.get(html, 2).?, .key = m.get(html, 3).?, .text = re.trim(m.get(html, 4).?) });
    return out.items;
}
/// a data-law key names a figure of the law or the contract; map it to a fact
fn lawKey(a: Allocator, k: []const u8) ![]const u8 {
    if (std.mem.eql(u8, k, "diagnostics")) return "diag.total";
    if (std.mem.startsWith(u8, k, "tier:")) return fmt(a, "law.tier.{s}", .{k[5..]});
    return fmt(a, "law.{s}", .{k});
}

/// t.slice(max(0, at - units), ...) and t.slice(..., end + units), in UTF-16 code units
fn back(t: []const u8, at: usize, units: usize) usize {
    var p = at;
    var u: usize = 0;
    while (p > 0 and u < units) {
        const q = re.prevStart(t, p);
        u += if (re.decode(t, q).cp > 0xFFFF) 2 else 1;
        p = q;
    }
    return p;
}
fn ahead(t: []const u8, at: usize, units: usize) usize {
    var p = at;
    var u: usize = 0;
    while (p < t.len and u < units) {
        const d = re.decode(t, p);
        u += if (d.cp > 0xFFFF) 2 else 1;
        p += d.len;
    }
    return p;
}

/// The typed numbers outside any span (SITE-3 piece E), as unchecked() in site-facts.js finds them.
fn unchecked(a: Allocator, html0: []const u8) !List {
    var html = try re.sub(a, html0, "<a [^>]*#rule-\\d+[^>]*>\\d+<\\/a>", "g", " ");
    // a table drawn from its data by tools/site-grid.js is checked there, against the files that hold its figures
    html = try re.sub(a, html, "<!-- (grid|channels):table -->[\\s\\S]*?<!-- \\/\\1:table -->", "g", " ");
    // a figure inside a mock interface is a specimen, not a claim; it says so
    html = try re.sub(a, html, "<([a-z0-9]+)\\b[^>]*\\sdata-specimen\\b[^>]*>[^<]*<\\/\\1>", "g", " ");
    var t = try lf(a, html);
    t = try re.sub(a, t, "<(script|style|pre|code)\\b[\\s\\S]*?<\\/\\1>", "g", " ");
    t = try re.sub(a, t, "<([a-z0-9]+)\\b[^>]*?\\sdata-(law-share|law|fact)=\"[^\"]*\"[^>]*>[^<]*<\\/\\1>", "g", " ");
    t = try re.sub(a, t, "<[^>]+>", "g", " ");
    t = try re.sub(a, t, "&[a-z#0-9]+;", "g", " ");
    // a rule number is a name, not a measured figure; so is a version of another body's document
    t = try re.sub(a, t, "Rules?\\s+\\d+(?:\\s*(?:,|and|to|through|-|\\u2013)\\s*\\d+)*", "g", " ");
    t = try re.sub(a, t, "\\b(?:WCAG|UIML|XForms|VoiceXML|ISO(?:\\/IEC)?)\\s+[\\d.]+(?:\\s+(?:to|and)\\s+[\\d.]+)?", "g", " ");
    var found: List = .empty;
    const num = try re.compile(a, "(?<![\\w.#/-])(\\d{2,}|\\d+\\.\\d+)(?![\\w.:/-])", "g");
    const named = try re.compile(a, "Rule[s]?\\s*$|rules?\\s+\\d|20\\d\\d|^\\d{4}$|px|rem|ms|\\bv\\d", "i");
    const counted = try re.compile(a, "(violations|fixtures|diagnostics|rules|verbs|media|declaration|checks)", "i");
    var it = re.iterate(&num, t);
    while (it.next()) |m| {
        const around = t[back(t, m.start, 12)..ahead(t, m.end, 12)];
        if (re.testIn(&named, around) and !re.testIn(&counted, around)) continue;
        try found.append(a, t[m.start..m.end]);
    }
    return found;
}

// ---- every declaration and terminal pair on a page against a real run -----------------------------------------

const Pair = struct { page: []const u8, file: []const u8, declaration: []const u8, output: []const u8 };
fn pairs(a: Allocator, all: []const []const u8) ![]const Pair {
    var out: std.ArrayList(Pair) = .empty;
    const r = try re.compile(a, "<pre class=\"shot\">([\\s\\S]*?)<\\/pre>\\s*<pre class=\"term\">([\\s\\S]*?)<\\/pre>", "g");
    const cmd = try re.compile(a, "^\\$\\s*zane check (\\S+\\.zane)\\s*$", "");
    for (all) |p| {
        const html = try lf(a, try readPage(a, p));
        var it = re.iterate(&r, html);
        while (it.next()) |m| {
            const term = try decode(a, m.get(html, 2).?);
            const nl = std.mem.indexOfScalar(u8, term, '\n');
            const first = if (nl) |i| term[0..i] else term;
            const c = re.exec(&cmd, first, 0) orelse continue; // a terminal that is not a verifier run is not claimed to be one
            const decl = re.trimEnd(try decode(a, m.get(html, 1).?));
            try out.append(a, .{
                .page = p,
                .file = c.get(first, 1).?,
                .declaration = try fmt(a, "{s}\n", .{decl}),
                .output = if (nl) |i| term[i + 1 ..] else "",
            });
        }
    }
    return out.items;
}

fn verifyRuns(a: Allocator, ps: []const Pair, problems: *List) !usize {
    const contract = try contract_mod.loadContract(a, try readFile(a, "conformance/violations.json"));
    const law = contract_mod.loadLaw(a, try readFile(a, "constitution/rules.json")) catch null;
    var how = false;
    for (ps) |q| {
        var findings: std.ArrayList(report.Finding) = .empty;
        try report.collect(a, contract, q.file, q.declaration, null, 2, &findings);
        var w: std.Io.Writer.Allocating = .init(a);
        try report.writeText(a, &w.writer, &.{q.file}, contract, law, 2, false, findings.items);
        const got = try norm(a, w.written());
        const want = try norm(a, q.output);
        if (std.mem.eql(u8, q.page, "site/how.html")) how = true;
        if (!std.mem.eql(u8, got, want)) try problems.append(a, try fmt(a, "{s}: the terminal for {s} is not what a real run prints.\n--- the page\n{s}\n--- a real run\n{s}", .{ q.page, q.file, want, got }));
    }
    if (!how) try problems.append(a, "site/how.html: its pair has no declaration and terminal to verify");
    return ps.len;
}

// ---- an excerpt shown on a page is a passage of the file it names ----------------------------------------------

fn squash(a: Allocator, t: []const u8) ![]const u8 {
    return re.trim(try re.sub(a, t, "\\s+", "g", " "));
}

fn verifyExcerpts(a: Allocator, all: []const []const u8, problems: *List) !usize {
    var count: usize = 0;
    const r = try re.compile(a, "<pre class=\"excerpt\" data-excerpt=\"([^\"]+)\">([\\s\\S]*?)<\\/pre>", "g");
    const elided = try re.compile(a, "^\\s*(\\.\\.\\.|\u{2026})\\s*$", "");
    for (all) |p| {
        const html = try lf(a, try readPage(a, p));
        var it = re.iterate(&r, html);
        while (it.next()) |m| {
            count += 1;
            const name = m.get(html, 1).?;
            if (!exists(name)) {
                try problems.append(a, try fmt(a, "{s}: excerpt of {s}, which does not exist", .{ p, name }));
                continue;
            }
            const file = try squash(a, try core.wellFormed(a, try readFile(a, name)));
            var lines = std.mem.splitScalar(u8, try decode(a, m.get(html, 2).?), '\n');
            while (lines.next()) |l| {
                if (re.testIn(&elided, l)) continue;
                const line = try squash(a, l);
                if (line.len == 0) continue;
                if (std.mem.indexOf(u8, file, line) == null) {
                    try problems.append(a, try fmt(a, "{s}: the excerpt of {s} shows a line the file does not contain: \"{s}\"", .{ p, name, try re.head(a, line, 80) }));
                    break;
                }
            }
        }
    }
    return count;
}

// ---- a terminal that names its command is a real run of it ------------------------------------------------------

/// The commands of the pack a terminal may name: the binary's, run here through main.dispatch; site-facts.js runs their
/// JavaScript references (cli.js, conformance.js, pack.js, cross-medium.js, check-facts.js).
const pack_commands = [_][]const u8{ "check", "conformance", "pack", "cross-medium", "audit-facts" };

/// sameRun in site-facts.js: a line holding only "…" stands for lines cut; every other line appears in the real output, in order and,
/// between two cuts, on consecutive lines. With no "…" the page is the whole output.
fn sameRun(a: Allocator, want: []const u8, got: []const u8) !bool {
    const ell = "\xE2\x80\xA6";
    var w: List = .empty;
    var wi = std.mem.splitScalar(u8, want, '\n');
    var cut = false;
    while (wi.next()) |l| {
        try w.append(a, l);
        if (std.mem.eql(u8, re.trim(l), ell)) cut = true;
    }
    if (!cut) return std.mem.eql(u8, want, got);
    var g: List = .empty;
    var gi = std.mem.splitScalar(u8, got, '\n');
    while (gi.next()) |l| try g.append(a, l);
    var at: usize = 0;
    var start: usize = 0;
    var k: usize = 0;
    while (k <= w.items.len) : (k += 1) {
        if (k < w.items.len and !std.mem.eql(u8, re.trim(w.items[k]), ell)) continue;
        const c = w.items[start..k];
        start = k + 1;
        if (c.len == 0) continue;
        var found: ?usize = null;
        var i = at;
        while (i + c.len <= g.items.len) : (i += 1) {
            var all_eq = true;
            for (c, 0..) |l, off| if (!std.mem.eql(u8, g.items[i + off], l)) {
                all_eq = false;
                break;
            };
            if (all_eq) {
                found = i;
                break;
            }
        }
        const f = found orelse return false;
        at = f + c.len;
    }
    return true;
}

fn verifyCommands(a: Allocator, all: []const []const u8, problems: *List) !usize {
    var count: usize = 0;
    const r = try re.compile(a, "<pre class=\"term\" data-run=\"([^\"]+)\">([\\s\\S]*?)<\\/pre>", "g");
    const ws = try re.compile(a, "\\s+", "");
    const prompt = try re.compile(a, "^\\$\\s*", "");
    for (all) |p| {
        const html = try lf(a, try readPage(a, p));
        var it = re.iterate(&r, html);
        while (it.next()) |m| {
            const named = m.get(html, 1).?;
            const cmd = try re.split(a, &ws, try decode(a, named));
            var known = false;
            if (cmd.len > 1) for (pack_commands) |c| if (std.mem.eql(u8, c, cmd[1])) {
                known = true;
            };
            if (!std.mem.eql(u8, cmd[0], "zane") or !known) {
                try problems.append(a, try fmt(a, "{s}: data-run \"{s}\" is not a pack command (zane check, conformance, pack, cross-medium or audit-facts)", .{ p, named }));
                continue;
            }
            count += 1;
            const joined = try std.mem.join(a, " ", cmd);
            const term = try decode(a, m.get(html, 2).?);
            const nl = std.mem.indexOfScalar(u8, term, '\n');
            const first = if (nl) |i| term[0..i] else term;
            if (!std.mem.eql(u8, re.trim(try re.replace(a, &prompt, first, "")), joined))
                try problems.append(a, try fmt(a, "{s}: the first line of the terminal for \"{s}\" is not that command", .{ p, joined }));
            var o: std.Io.Writer.Allocating = .init(a);
            var e: std.Io.Writer.Allocating = .init(a);
            _ = main_mod.dispatch(a, cmd[1..], &o.writer, &e.writer) catch {};
            const got = try norm(a, o.written());
            const want = try norm(a, if (nl) |i| term[i + 1 ..] else "");
            if (!try sameRun(a, want, got)) try problems.append(a, try fmt(a, "{s}: the terminal for \"{s}\" is not what a real run prints.\n--- the page\n{s}\n--- a real run\n{s}", .{ p, joined, want, got }));
        }
    }
    return count;
}
// ---- the head of a reading page has no button --------------------------------------------------------------------

fn verifyCtas(a: Allocator, all: []const []const u8, problems: *List) !usize {
    var count: usize = 0;
    const head = try re.compile(a, "<header class=\"page\">[\\s\\S]*?<\\/header>", "");
    const primary = try re.compile(a, "\\bbtn\\b[^\"]*\\bprimary\\b", "");
    const link = try re.compile(a, "<a\\b[^>]*class=\"[^\"]*\\bbtn\\b[^\"]*\\bprimary\\b[^\"]*\"[^>]*href=\"([^\"]*)\"|<a\\b[^>]*href=\"([^\"]*)\"[^>]*class=\"[^\"]*\\bbtn\\b[^\"]*\\bprimary\\b[^\"]*\"", "g");
    for (all) |p| {
        const html = try lf(a, try readPage(a, p));
        if (re.exec(&head, html, 0)) |h| if (re.testIn(&primary, html[h.start..h.end]))
            try problems.append(a, try fmt(a, "{s}: the head of a reading page carries a primary button; only the front page does", .{p}));
        var it = re.iterate(&link, html);
        while (it.next()) |m| {
            count += 1;
            const href = m.get(html, 1) orelse m.get(html, 2).?;
            if (std.mem.startsWith(u8, href, "#")) try problems.append(a, try fmt(a, "{s}: the primary button \"{s}\" scrolls within its own page; a call to action leaves it", .{ p, href }));
        }
    }
    return count;
}

// ---- a status word is one of three -------------------------------------------------------------------------------

fn verifyStatuses(a: Allocator, all: []const []const u8, problems: *List) !usize {
    var count: usize = 0;
    const r = try re.compile(a, "<(\\w+)\\b[^>]*\\bclass=\"status([^\"]*)\"[^>]*>([^<]*)<\\/\\1>", "g");
    for (all) |p| {
        const html = try lf(a, try readPage(a, p));
        var it = re.iterate(&r, html);
        while (it.next()) |m| {
            count += 1;
            const cls = re.trim(m.get(html, 2).?);
            const word = re.trim(m.get(html, 3).?);
            const known = std.mem.eql(u8, word, "exists") or std.mem.eql(u8, word, "designed") or std.mem.eql(u8, word, "held");
            if (!known) {
                try problems.append(a, try fmt(a, "{s}: the status word \"{s}\" is not one of exists, designed, held", .{ p, word }));
            } else if (!std.mem.eql(u8, cls, word)) try problems.append(a, try fmt(a, "{s}: the status \"{s}\" carries the class \"{s}\", so its mark would be wrong", .{ p, word, cls }));
        }
    }
    return count;
}

// ---- the run ----------------------------------------------------------------------------------------------------

/// Math.round(x)
fn round(x: f64) f64 {
    const r = @floor(x);
    return if (x - r >= 0.5) r + 1 else r;
}

pub fn run(a: Allocator, out: *std.Io.Writer, argv: []const []const u8) !u8 {
    var write = false;
    var list_unchecked = false;
    for (argv) |x| {
        if (std.mem.eql(u8, x, "--write")) write = true;
        if (std.mem.eql(u8, x, "--unchecked")) list_unchecked = true;
    }
    const FILE = "site/facts.json";
    const all = (try pages(a)).items;
    const ps = try pairs(a, all);
    const now = try derive(a, ps.len);
    var problems: List = .empty;
    const text = try factsText(a, &now);
    if (write) {
        try std.fs.cwd().writeFile(.{ .sub_path = FILE, .data = text });
        try out.writeAll(try fmt(a, "wrote site/facts.json: {d} figures\n", .{now.list.items.len}));
    } else if (!exists(FILE)) {
        try problems.append(a, "site/facts.json is missing: run with --write");
    } else {
        const have = try lf(a, try core.wellFormed(a, try readFile(a, FILE)));
        if (!std.mem.eql(u8, have, text)) {
            const parsed = try std.json.parseFromSliceLeaky(Value, a, have, contract_mod.js_parse);
            const old = js.get(parsed, "facts");
            var diff: List = .empty;
            const sorted = try a.dupe(Fact, now.list.items);
            std.mem.sort(Fact, sorted, {}, struct {
                fn lt(_: void, x: Fact, y: Fact) bool {
                    return std.mem.lessThan(u8, x.key, y.key);
                }
            }.lt);
            for (sorted) |x| {
                const was = try js.string(a, js.get(old, x.key));
                const is = try js.string(a, x.value);
                if (!std.mem.eql(u8, was, is)) try diff.append(a, try fmt(a, "{s}: {s} -> {s}", .{ x.key, was, is }));
            }
            try problems.append(a, try fmt(a, "site/facts.json is stale: {s} (run with --write)", .{if (diff.items.len > 0) try std.mem.join(a, "; ", diff.items) else "its text differs"}));
        }
    }

    var spans: usize = 0;
    var bad: usize = 0;
    var total: usize = 0;
    var per: List = .empty;
    for (all) |p| {
        const html = try readPage(a, p);
        for (try spansOf(a, html)) |sp| {
            spans += 1;
            var want: ?[]const u8 = null;
            if (std.mem.eql(u8, sp.kind, "law-share")) {
                if (js.numOf(now.get(try fmt(a, "law.tier.{s}", .{sp.key})))) |t| {
                    const rules = js.numOf(now.get("law.rules")) orelse std.math.nan(f64);
                    want = try fmt(a, "{s}%", .{try js.num(a, round(t / rules * 100))});
                } else if (now.get(try fmt(a, "law.tier.{s}", .{sp.key}))) |t| {
                    want = try fmt(a, "{s}%", .{if (t == .null) "0" else "NaN"});
                }
            } else {
                const key = if (std.mem.eql(u8, sp.kind, "fact")) sp.key else try lawKey(a, sp.key);
                if (now.get(key)) |val| want = try js.string(a, val);
            }
            if (want) |w| {
                if (!std.mem.eql(u8, sp.text, w)) {
                    try problems.append(a, try fmt(a, "{s}: {s} \"{s}\" reads \"{s}\" and the tree says \"{s}\"", .{ p, sp.kind, sp.key, sp.text, w }));
                    bad += 1;
                }
            } else {
                try problems.append(a, try fmt(a, "{s}: {s} \"{s}\" names a figure this script does not derive", .{ p, sp.kind, sp.key }));
                bad += 1;
            }
        }
        const u = try unchecked(a, html);
        total += u.items.len;
        if (u.items.len > 0) {
            var uniq: List = .empty;
            for (u.items) |x| {
                var seen = false;
                for (uniq.items) |y| if (std.mem.eql(u8, x, y)) {
                    seen = true;
                };
                if (!seen) try uniq.append(a, x);
            }
            try per.append(a, try fmt(a, "{s}: {d} ({s})", .{ p, u.items.len, try std.mem.join(a, ", ", uniq.items[0..@min(8, uniq.items.len)]) }));
        }
    }
    const ninety = try verifyRuns(a, ps, &problems);
    const excerpts = try verifyExcerpts(a, all, &problems);
    const commands = try verifyCommands(a, all, &problems);
    {
        var g: List = .empty;
        try grid.check(a, null, false, &g);
        try problems.appendSlice(a, g.items);
    }
    const statuses = try verifyStatuses(a, all, &problems);
    const ctas = try verifyCtas(a, all, &problems);
    try out.writeAll(try fmt(a, "spans checked: {d}; wrong: {d}; verifier runs re-run: {d}; commands re-run: {d}; status words checked: {d}; buttons checked: {d}; excerpts checked against their files: {d}\n", .{ spans, bad, ninety, commands, statuses, ctas, excerpts }));
    try out.writeAll(try fmt(a, "typed numbers outside a span, not checked: {d} across {d} page(s){s}\n", .{ total, per.items.len, if (list_unchecked) "" else " (--unchecked lists them)" }));
    if (list_unchecked or total > 0) for (per.items) |l| try out.writeAll(try fmt(a, "  {s}\n", .{l}));
    if (total > 0) try problems.append(a, try fmt(a, "{d} typed number(s) outside a span: give each a data-fact or data-law span, a link to its rule, or, inside a mock interface, data-specimen", .{total}));
    if (problems.items.len > 0) {
        for (problems.items) |m| try out.writeAll(try fmt(a, "PROBLEM {s}\n", .{m}));
        return 1;
    }
    try out.writeAll(if (write) "ok (facts.json written; nothing else to check against itself)\n" else "site facts ok\n");
    return 0;
}
