//! siteshell.zig: `zane site shell [--write]`, the one definition of the site's navigation: tools/site-shell.js in Zig,
//! printing what it prints and writing what it writes (doc/design/BINARY.md, S5; doc/design/SITE-2.md and SITE-3.md).
//!
//! It checks that every page carries exactly the shell rendered here (the main menu and the band, the hidden trail,
//! the opening of the layout with its level-3 list, the footer, and the assets' addresses with the hash of their
//! content), and with --write renders it into every page. Beside that, the checks of site-shell.js, in its order:
//! no tooltip, the menu declared in site/menu.zane and read by the verifier (Rule 116 at v3.16), every page on a bar, every page naming its subject
//! (doc/design/WRITING.md), no line break placed by hand in a title, and no word "Zing" on the site.
//!
//! THE REGISTRY BELOW IS A SECOND COPY of the one in tools/site-shell.js (SECTIONS, FAMILIES, PAGES). Until the
//! JavaScript is retired, a page added to one is added to the other, in the same commit; tools/zane/parity.js fails on
//! any difference between the two runs, which is how a copy that drifts is caught. One branch of the script is not
//! carried, because no page of the registry reaches it: the footer's Reader link (`pending`).
//!
//! It reads and writes the tree it is run in: run it from the repository's root.

const std = @import("std");
const Allocator = std.mem.Allocator;
const core = @import("core.zig");
const re = @import("regex.zig");
const grid = @import("sitegrid.zig");
const js = @import("js.zig");

const readFile = grid.readFile;
const exists = grid.exists;
const esc = grid.esc;
const List = std.ArrayList([]const u8);

const fmt = js.fmt;

// ---- the structure (tools/site-shell.js) ----------------------------------------------------------------------

const Section = struct { id: []const u8, label: []const u8, head: []const u8 };
const sections = [_]Section{
    .{ .id = "approach", .label = "Approach", .head = "site/thinking.html" },
    .{ .id = "language", .label = "Language", .head = "site/how.html" },
    .{ .id = "law", .label = "Law", .head = "site/why.html" },
    // Adopt and Demo, not Use and Try (the Principal, 2026-11-10; ZANE-MENU-USETRY-01); the ids stay
    .{ .id = "use", .label = "Adopt", .head = "site/adopt.html" },
    .{ .id = "try", .label = "Demo", .head = "site/audit.html" },
};

const Outside = enum { none, reader, tool };
const Page = struct {
    file: []const u8,
    home: bool = false,
    section: ?[]const u8 = null,
    label: []const u8 = "",
    parent: ?[]const u8 = null,
    /// a family's head stands in the band under the family's name, and opens the family's list under its own label
    family: ?[]const u8 = null,
    rail: bool = false,
    outside: Outside = .none,
    term: []const u8,
};
fn fam(comptime f: []const u8, comptime label: []const u8, comptime term: []const u8) Page {
    return .{ .file = "site/gotchas/" ++ f ++ ".html", .section = "law", .label = label, .parent = "site/gotchas/index.html", .rail = true, .term = term };
}
const pages = [_]Page{
    .{ .file = "index.html", .home = true, .term = "Zane" },
    .{ .file = "site/thinking.html", .section = "approach", .label = "Reasoning", .rail = true, .term = "reason" },
    .{ .file = "site/grid.html", .section = "approach", .label = "The grid", .rail = true, .term = "grid" },
    .{ .file = "site/media.html", .section = "approach", .label = "Channels", .rail = true, .term = "channel" },
    .{ .file = "site/positioning.html", .section = "approach", .family = "Comparison", .label = "Overview", .rail = true, .term = "overview" },
    .{ .file = "site/practices.html", .section = "approach", .label = "Practices", .parent = "site/positioning.html", .rail = true, .term = "practice" },
    .{ .file = "site/frameworks.html", .section = "approach", .label = "Frameworks and languages", .parent = "site/positioning.html", .rail = true, .term = "framework" },
    .{ .file = "site/innovation.html", .section = "approach", .label = "Claims", .rail = true, .term = "claim" },
    .{ .file = "site/how.html", .section = "language", .label = "The basics", .rail = true, .term = "basic" },
    .{ .file = "site/refusal.html", .section = "language", .label = "What it refuses", .rail = true, .term = "refus" },
    .{ .file = "site/haro.html", .section = "language", .label = "Declared in Haro", .rail = true, .term = "Haro" },
    .{ .file = "site/conformance.html", .section = "language", .label = "Conformance", .rail = true, .term = "conform" },
    .{ .file = "site/why.html", .section = "law", .label = "The case", .rail = true, .term = "case" },
    .{ .file = "site/rules.html", .section = "law", .label = "The rules", .rail = true, .term = "rule" },
    .{ .file = "constitution/reader/index.html", .section = "law", .label = "The Reader", .rail = true, .outside = .reader, .term = "Reader" },
    .{ .file = "site/gotchas/index.html", .section = "law", .family = "What a violation feels like", .label = "All families", .rail = true, .term = "famil" },
    fam("stillness", "Stillness", "still"),
    fam("forms", "Forms", "form"),
    fam("state", "State", "state"),
    fam("widgets", "Widgets", "widget"),
    fam("reading", "Reading", "read"),
    fam("navigation", "Navigation", "navigat"),
    fam("intelligence", "Intelligence", "intelligen"),
    .{ .file = "site/vibes.html", .section = "law", .label = "Two cultures, one truth", .rail = true, .term = "culture" },
    .{ .file = "site/adopt.html", .section = "use", .label = "Ways in", .rail = true, .term = "ways in" },
    .{ .file = "site/web.html", .section = "use", .label = "Web apps", .rail = true, .term = "web" },
    .{ .file = "site/mobile.html", .section = "use", .label = "Mobile apps", .rail = true, .term = "mobile" },
    .{ .file = "site/beyond.html", .section = "use", .label = "Beyond screens", .rail = true, .term = "screen" },
    .{ .file = "site/stack.html", .section = "use", .family = "Your stack", .label = "Overview", .rail = true, .term = "overview" },
    .{ .file = "site/build.html", .section = "use", .label = "Build", .parent = "site/stack.html", .rail = true, .term = "build" },
    .{ .file = "site/generate.html", .section = "use", .label = "Generate", .parent = "site/stack.html", .rail = true, .term = "generat" },
    .{ .file = "site/softanza.html", .section = "use", .label = "Softanza", .parent = "site/stack.html", .rail = true, .term = "Softanza" },
    .{ .file = "site/ports.html", .section = "use", .label = "Other languages", .parent = "site/stack.html", .rail = true, .term = "other language" },
    .{ .file = "site/audit.html", .section = "try", .label = "Three ways", .rail = true, .term = "three way" },
    .{ .file = "site/tour.html", .section = "try", .label = "The tour", .rail = true, .term = "tour" },
    .{ .file = "tools/ui-audit.html", .section = "try", .label = "UI audit", .rail = true, .outside = .tool, .term = "audit" },
    .{ .file = "site/screenshots.html", .section = "try", .label = "Screenshots", .rail = true, .term = "screenshot" },
    .{ .file = "tools/zane/wasm-proof.html", .section = "try", .label = "Wasm proof", .rail = true, .outside = .tool, .term = "wasm" },
};

/// The four files every page shares, and the rest a page loads: their address carries the first 8 hex of the sha256 of
/// their content, read with LF line ends (the wasm on its bytes).
const assets = [_][]const u8{ "stz.css", "stz.js", "gotchas.css", "law-numbers.js", "tour.js", "zane-wasm.js", "try.js", "zane.wasm" };
const REPO = "https://github.com/mayouni/zane";
const GITHUB_MARK = "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";
/// an outline by default on every page of three or more sections (K18 NAV_TREE; ZANE-OUTLINE-01)
const SECTION_MIN = 3;

comptime {
    // Rules 27 and 120: a band holds five entries at most, its head page among them; site-shell.js throws when the registry breaks
    // it, here the build fails
    @setEvalBranchQuota(20000);
    for (sections) |s| {
        var k = 0;
        for (pages) |q| if (q.section != null and std.mem.eql(u8, q.section.?, s.id) and q.rail and q.parent == null) {
            k += 1;
        };
        if (k > 5) @compileError("Rule 27: the band of " ++ s.id ++ " has more than five entries");
    }
}

fn byFile(file: []const u8) ?*const Page {
    for (&pages) |*p| if (std.mem.eql(u8, p.file, file)) return p;
    return null;
}
fn sec(id: ?[]const u8) ?*const Section {
    const x = id orelse return null;
    for (&sections) |*s| if (std.mem.eql(u8, s.id, x)) return s;
    return null;
}
/// Every page declares its archetype on its <body> (doc/design/DESIGN-SYSTEM.md section 6.5, K21 ARCHETYPE): the front page; a
/// section's or a family's first page is a landing; the Reader, the rules and the conformance page are references; the tour is the deck;
/// a tool is a tool; every other page is an article. The same decision as archetypeOf in tools/site-shell.js.
const references = [_][]const u8{ "site/rules.html", "constitution/reader/index.html", "site/conformance.html" };
fn archetypeOf(p: *const Page) []const u8 {
    if (p.home) return "front";
    if (p.outside == .tool) return "tool";
    for (references) |r| if (std.mem.eql(u8, r, p.file)) return "reference";
    if (std.mem.eql(u8, p.file, "site/tour.html")) return "deck";
    if (isHeadFile(p.file) or p.family != null) return "landing";
    return "article";
}

fn isHeadFile(file: []const u8) bool {
    for (sections) |s| if (std.mem.eql(u8, s.head, file)) return true;
    return false;
}
fn eqlOpt(x: ?[]const u8, y: ?[]const u8) bool {
    if (x == null or y == null) return x == null and y == null;
    return std.mem.eql(u8, x.?, y.?);
}

// ---- paths, as path.posix gives them --------------------------------------------------------------------------

fn dirname(p: []const u8) []const u8 {
    const i = std.mem.lastIndexOfScalar(u8, p, '/') orelse return ".";
    return p[0..i];
}
fn basename(p: []const u8) []const u8 {
    const i = std.mem.lastIndexOfScalar(u8, p, '/') orelse return p;
    return p[i + 1 ..];
}
fn parts(a: Allocator, p: []const u8) !List {
    var out: List = .empty;
    var it = std.mem.splitScalar(u8, p, '/');
    while (it.next()) |s| {
        if (s.len == 0 or std.mem.eql(u8, s, ".")) continue;
        if (std.mem.eql(u8, s, "..") and out.items.len > 0 and !std.mem.eql(u8, out.items[out.items.len - 1], "..")) {
            _ = out.pop();
            continue;
        }
        try out.append(a, s);
    }
    return out;
}
/// path.posix.relative(from, to) for two paths relative to the same root
fn relative(a: Allocator, from: []const u8, to: []const u8) ![]const u8 {
    const f = try parts(a, from);
    const t = try parts(a, to);
    var i: usize = 0;
    while (i < f.items.len and i < t.items.len and std.mem.eql(u8, f.items[i], t.items[i])) i += 1;
    var out: List = .empty;
    for (f.items[i..]) |_| try out.append(a, "..");
    try out.appendSlice(a, t.items[i..]);
    return std.mem.join(a, "/", out.items);
}
fn rel(a: Allocator, from: []const u8, to: []const u8) ![]const u8 {
    const r = try relative(a, dirname(from), to);
    return if (r.len == 0) basename(to) else r;
}
fn href(a: Allocator, from: []const u8, to: []const u8) ![]const u8 {
    if (std.mem.eql(u8, to, "site/gotchas/index.html")) {
        const r = try re.sub(a, try rel(a, from, to), "index.html$", "", "");
        return if (r.len == 0) "./" else r;
    }
    return rel(a, from, to);
}
/// path.posix.normalize(h), then a leading "./" dropped
fn normalize(a: Allocator, h: []const u8) ![]const u8 {
    const p = try parts(a, h);
    const lead = std.mem.startsWith(u8, h, "/");
    const j = try std.mem.join(a, "/", p.items);
    if (lead) return fmt(a, "/{s}", .{j});
    return if (j.len == 0) "." else j;
}

// ---- the renderers ----------------------------------------------------------------------------------------------

fn menu(a: Allocator, p: *const Page) ![]const u8 {
    const reader = p.outside == .reader;
    var links: List = .empty;
    for (sections) |s| {
        const on = eqlOpt(s.id, p.section);
        try links.append(a, try fmt(a, "    <a{s} href=\"{s}\">{s}</a>", .{ if (on) " class=\"here\" aria-current=\"true\"" else "", try href(a, p.file, s.head), s.label }));
    }
    // The Reader carries the same bar as every page, in the same markup (ZANE-READER-MENUPOS-01, K23 BAR_ALIGN); its tools hold GitHub
    // alone, since the Reader's theme is its own light and dark, switched in its footer bar.
    const picker = if (reader) "" else try fmt(a, "\n      {s}", .{stylePicker});
    const tools = try fmt(a,
        \\    <div class="tools">
        \\      <a class="github" href="{s}">GitHub <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="{s}"/></svg></a>{s}
        \\    </div>
        \\
    , .{ REPO, GITHUB_MARK, picker });
    const bar = try fmt(a, "<nav class=\"site\" aria-label=\"Main menu\">\n  <div class=\"wrap\">\n    <div class=\"menu\">\n        <a class=\"brand\" href=\"{s}\">Zane</a>\n{s}\n    </div>\n{s}  </div>\n</nav>", .{
        try href(a, p.file, "index.html"),
        try std.mem.join(a, "\n", links.items),
        tools,
    });
    const b = try band(a, p);
    return fmt(a, "<div class=\"bars\">\n{s}{s}{s}\n</div>", .{ bar, if (b.len > 0) "\n" else "", b });
}
const stylePicker =
    \\<div class="vibe-picker">
    \\        <label for="vibe-select">Theme</label>
    \\        <select id="vibe-select">
    \\          <option value="curator">Modern</option>
    \\          <option value="guardian">Retro</option>
    \\        </select>
    \\      </div>
;

fn trail(a: Allocator, p: *const Page) ![]const u8 {
    if (p.home) return "";
    const s = sec(p.section).?;
    const Step = struct { label: []const u8, to: []const u8 };
    var steps: std.ArrayList(Step) = .empty;
    // Zane, the section under its own name (where the main menu links), the family under its name, then the page under its own
    try steps.append(a, .{ .label = "Zane", .to = "index.html" });
    try steps.append(a, .{ .label = s.label, .to = s.head });
    const up: ?*const Page = if (p.parent) |pf| byFile(pf).? else if (p.family != null) p else null;
    if (up) |u| try steps.append(a, .{ .label = u.family.?, .to = u.file });
    var links: List = .empty;
    for (steps.items) |x| try links.append(a, try fmt(a, "<a href=\"{s}\">{s}</a>", .{ try href(a, p.file, x.to), try esc(a, x.label) }));
    return fmt(a, "<nav class=\"crumbs trail-hidden\" aria-label=\"Breadcrumb\">{s}<span class=\"sep\">›</span><span class=\"here-crumb\" aria-current=\"page\">{s}</span></nav>", .{ try std.mem.join(a, "<span class=\"sep\">›</span>", links.items), try esc(a, p.label) });
}

/// Level 2: the pages of a section, the head page first, the section's landing under its own label (Rule 116 at v3.16); five at
/// most (Rules 27, 120); none is null. A family's head stands here under the family's name.
fn bandOf(a: Allocator, section: ?[]const u8) !?[]const *const Page {
    var top: std.ArrayList(*const Page) = .empty;
    for (&pages) |*q| if (eqlOpt(q.section, section) and q.rail and q.parent == null and isHeadFile(q.file)) try top.append(a, q);
    for (&pages) |*q| if (eqlOpt(q.section, section) and q.rail and q.parent == null and !isHeadFile(q.file)) try top.append(a, q);
    return if (top.items.len >= 1) top.items else null;
}
fn bandLabel(q: *const Page) []const u8 {
    return q.family orelse q.label;
}
fn band(a: Allocator, p: *const Page) ![]const u8 {
    if (p.home or p.section == null) return "";
    const top = (try bandOf(a, p.section)) orelse return "";
    var items: List = .empty;
    for (top) |q| {
        const on = q == p or (p.parent != null and byFile(p.parent.?) == q);
        const cur = if (on) (if (q == p) " aria-current=\"page\"" else " aria-current=\"true\"") else "";
        try items.append(a, try fmt(a, "    <li><a{s} href=\"{s}\">{s}</a></li>", .{ cur, try href(a, p.file, q.file), try esc(a, bandLabel(q)) }));
    }
    return fmt(a, "<nav class=\"band\" aria-label=\"Pages of the section\">\n  <ul>\n{s}\n  </ul>\n</nav>", .{try std.mem.join(a, "\n", items.items)});
}

/// a family's list opens on its head page, under the page's own label, then its pages (Rule 116 at v3.16)
const Family = struct { head: *const Page, kids: []const *const Page, list: []const *const Page };
fn familyOf(a: Allocator, p: *const Page) !?Family {
    const head = if (p.parent) |pf| byFile(pf).? else p;
    var list: std.ArrayList(*const Page) = .empty;
    try list.append(a, head);
    for (&pages) |*q| if (q.parent != null and std.mem.eql(u8, q.parent.?, head.file)) try list.append(a, q);
    return if (list.items.len > 1) .{ .head = head, .kids = list.items[1..], .list = list.items } else null;
}

const Taken = std.StringHashMap(void);
fn slug(a: Allocator, text: []const u8, taken: *Taken) ![]const u8 {
    var base = try re.lower(a, text);
    base = try re.sub(a, base, "&[a-z#0-9]+;", "g", " ");
    base = try re.sub(a, base, "[^a-z0-9]+", "g", "-");
    base = try re.sub(a, base, "^-+|-+$", "g", "");
    base = base[0..@min(40, base.len)];
    base = try re.sub(a, base, "-+$", "", "");
    if (base.len == 0) base = "section";
    var id = base;
    var k: usize = 2;
    while (taken.contains(id)) : (k += 1) id = try fmt(a, "{s}-{d}", .{ base, k });
    try taken.put(id, {});
    return id;
}

/// plain in site-shell.js: tags removed, &amp; then &lt; and &gt;, white space collapsed, trimmed
fn plain(a: Allocator, h: []const u8) ![]const u8 {
    var t = try re.sub(a, h, "<[^>]+>", "g", "");
    t = try std.mem.replaceOwned(u8, a, t, "&amp;", "&");
    t = try std.mem.replaceOwned(u8, a, t, "&lt;", "<");
    t = try std.mem.replaceOwned(u8, a, t, "&gt;", ">");
    return re.trim(try re.sub(a, t, "\\s+", "g", " "));
}

const Sec = struct { id: []const u8, label: []const u8 };
const Sections = struct { text: []const u8, list: []const Sec };

const SecCtx = struct {
    a: Allocator,
    taken: *Taken,
    list: *std.ArrayList(Sec),
    last: ?[]const u8 = null,
    id_re: re.Regex,
    outline_re: re.Regex,

    fn each(self: *SecCtx, m: re.Match, t: []const u8) ![]const u8 {
        const whole = t[m.start..m.end];
        if (m.get(t, 1)) |attrs| {
            self.last = if (re.exec(&self.id_re, attrs, 0)) |i| i.get(attrs, 1).? else null;
            return whole;
        }
        const attrs = m.get(t, 2).?;
        const inner = m.get(t, 3).?;
        var id: ?[]const u8 = if (re.exec(&self.id_re, attrs, 0)) |i| i.get(attrs, 1).? else self.last;
        var out = whole;
        if (id == null) {
            id = try slug(self.a, try plain(self.a, inner), self.taken);
            out = try fmt(self.a, "<h2{s} id=\"{s}\">{s}</h2>", .{ attrs, id.?, inner });
        }
        // the outline shows the section's short label (data-outline on its h2)
        const label = if (re.exec(&self.outline_re, attrs, 0)) |s| blk: {
            const x = try std.mem.replaceOwned(u8, self.a, s.get(attrs, 1).?, "&amp;", "&");
            break :blk try std.mem.replaceOwned(u8, self.a, x, "&quot;", "\"");
        } else try plain(self.a, inner);
        try self.list.append(self.a, .{ .id = id.?, .label = label });
        self.last = null;
        return out;
    }
};

/// the h2 of a page's main, each with the id it is reached by: the id of its own section where that has one, else its own
fn sectionsOf(a: Allocator, t: []const u8) !Sections {
    const ai = std.mem.indexOf(u8, t, "<main id=\"main\">") orelse return .{ .text = t, .list = &.{} };
    const bi = std.mem.indexOf(u8, t, "</main>") orelse return .{ .text = t, .list = &.{} };
    const body = if (bi > ai) t[ai..bi] else "";
    var taken = Taken.init(a);
    const ids = try re.compile(a, "\\sid=\"([^\"]+)\"", "g");
    var it = re.iterate(&ids, t);
    while (it.next()) |m| try taken.put(m.get(t, 1).?, {});
    var list: std.ArrayList(Sec) = .empty;
    var ctx: SecCtx = .{ .a = a, .taken = &taken, .list = &list, .id_re = try re.compile(a, "\\sid=\"([^\"]+)\"", ""), .outline_re = try re.compile(a, "\\sdata-outline=\"([^\"]*)\"", "") };
    const r = try re.compile(a, "<section\\b([^>]*)>|<h2\\b([^>]*)>([\\s\\S]*?)<\\/h2>", "g");
    const done = try re.replaceFn(a, &r, body, &ctx, SecCtx.each);
    return .{ .text = try std.mem.concat(a, u8, &.{ t[0..ai], done, t[bi..] }), .list = list.items };
}

fn list3(a: Allocator, p: *const Page, secs: []const Sec) ![]const u8 {
    if (p.home or p.outside != .none) return "";
    const f = try familyOf(a, p);
    const own: ?[]const Sec = if (secs.len >= SECTION_MIN) secs else null;
    var subs: []const u8 = "";
    if (own) |o| {
        var li: List = .empty;
        for (o) |x| try li.append(a, try fmt(a, "        <li><a href=\"#{s}\">{s}</a></li>", .{ x.id, try esc(a, x.label) }));
        subs = try fmt(a, "\n      <ul class=\"sub\">\n{s}\n      </ul>\n    ", .{try std.mem.join(a, "\n", li.items)});
    }
    if (f) |family| {
        // the same list on every page of the family, its head's included, the page's outline nested under its own entry
        var li: List = .empty;
        for (family.list) |q| try li.append(a, try fmt(a, "    <li><a{s} href=\"{s}\">{s}</a>{s}</li>", .{ if (q == p) " aria-current=\"page\"" else "", try href(a, p.file, q.file), try esc(a, q.label), if (q == p) subs else "" }));
        return fmt(a, "<nav class=\"list3\" aria-label=\"Pages of the family\">\n  <ul>\n{s}\n  </ul>\n</nav>", .{try std.mem.join(a, "\n", li.items)});
    }
    const o = own orelse return "";
    var li: List = .empty;
    for (o) |x| try li.append(a, try fmt(a, "    <li><a href=\"#{s}\">{s}</a></li>", .{ x.id, try esc(a, x.label) }));
    return fmt(a, "<nav class=\"list3 sections\" aria-label=\"Sections of this page\">\n  <p class=\"outline-title\">On this page</p>\n  <ul>\n{s}\n  </ul>\n</nav>", .{try std.mem.join(a, "\n", li.items)});
}

fn footer(a: Allocator, p: *const Page) ![]const u8 {
    return fmt(a,
        \\<footer class="site">
        \\  <div class="narrow">
        \\    <div class="bar">
        \\      <div class="row">
        \\        <a href="{s}">LICENSE</a>
        \\      </div>
        \\    </div>
        \\    <p class="fine">Zane is a <a href="https://mayouni.github.io/stzsite/index.html">Softanza</a> project.</p>
        \\    <p class="fine">© 2026 Mansour Ayouni · MIT licence</p>
        \\  </div>
        \\</footer>
    , .{try href(a, p.file, "LICENSE")});
}

// ---- applying the shell to a page's text --------------------------------------------------------------------------

fn fence(a: Allocator, name: []const u8, inner: []const u8) ![]const u8 {
    return fmt(a, "<!-- shell:{s} -->\n{s}\n<!-- /shell:{s} -->", .{ name, inner, name });
}
fn fenceRe(a: Allocator, name: []const u8) !re.Regex {
    return re.compile(a, try fmt(a, "<!-- shell:{s} -->[\\s\\S]*?<!-- \\/shell:{s} -->", .{ name, name }), "");
}
fn hasFence(a: Allocator, t: []const u8, name: []const u8) !bool {
    const r = try fenceRe(a, name);
    return re.testIn(&r, t);
}
/// t.replace(re, () => with): the first match, the replacement taken as it is
fn replaceFirst(a: Allocator, t: []const u8, r: *const re.Regex, with: []const u8) ![]const u8 {
    const m = re.exec(r, t, 0) orelse return t;
    return std.mem.concat(a, u8, &.{ t[0..m.start], with, t[m.end..] });
}
fn fill(a: Allocator, t: []const u8, name: []const u8, inner: []const u8) ![]const u8 {
    const r = try fenceRe(a, name);
    return replaceFirst(a, t, &r, try fence(a, name, inner));
}

const AssetCtx = struct {
    a: Allocator,
    fn each(self: *const AssetCtx, m: re.Match, t: []const u8) ![]const u8 {
        return fmt(self.a, "{s}{s}?v={s}\"", .{ m.get(t, 1).?, m.get(t, 2).?, try assetHash(self.a, m.get(t, 3).?) });
    }
};
fn assetHash(a: Allocator, name: []const u8) ![]const u8 {
    const path = try fmt(a, "site/{s}", .{name});
    const raw = try readFile(a, path);
    const data = if (std.mem.endsWith(u8, name, ".wasm")) raw else try std.mem.replaceOwned(u8, a, try core.wellFormed(a, raw), "\r\n", "\n");
    var digest: [32]u8 = undefined;
    std.crypto.hash.sha2.Sha256.hash(data, &digest, .{});
    const h = std.fmt.bytesToHex(digest, .lower);
    return a.dupe(u8, h[0..8]);
}

fn lowerTrim(a: Allocator, s: []const u8) ![]const u8 {
    return re.lower(a, re.trim(s));
}

const Applied = struct { text: []const u8, problems: List };
fn apply(a: Allocator, p: *const Page, text: []const u8) !Applied {
    var t: []const u8 = try std.mem.replaceOwned(u8, a, text, "\r\n", "\n");
    var problems: List = .empty;

    // ---- migration from the old markup, once ----
    if (!try hasFence(a, t, "menu")) {
        const r = try re.compile(a, if (p.outside == .reader) "<nav class=\"topnav\"[\\s\\S]*?<\\/nav>" else "<nav class=\"site\"[\\s\\S]*?<\\/nav>", "");
        if (!re.testIn(&r, t)) try problems.append(a, "no top bar to replace") else t = try replaceFirst(a, t, &r, try fence(a, "menu", ""));
    }
    if (!p.home and !try hasFence(a, t, "trail")) {
        const r = try re.compile(a, "<nav class=\"crumbs\"[\\s\\S]*?<\\/nav>", "");
        if (re.testIn(&r, t)) t = try replaceFirst(a, t, &r, try fence(a, "trail", "")) else try problems.append(a, "no trail to replace");
    }
    if (p.outside == .none and !try hasFence(a, t, "footer")) {
        const r = try re.compile(a, "<footer class=\"site\">[\\s\\S]*?<\\/footer>", "");
        if (re.exec(&r, t, 0)) |m| {
            const whole = t[m.start..m.end];
            t = try std.mem.concat(a, u8, &.{ t[0..m.start], try fence(a, "footer", whole), t[m.end..] });
        } else try problems.append(a, "no footer to replace");
    }
    t = try std.mem.replaceOwned(u8, a, t, "<!-- shell:rail -->", "<!-- shell:layout -->");
    t = try std.mem.replaceOwned(u8, a, t, "<!-- /shell:rail -->", "<!-- /shell:layout -->");
    // main, and the fenced opening of the layout, once
    if (p.outside == .none and std.mem.indexOf(u8, t, "<main id=\"main\">") == null) {
        const ai = std.mem.indexOf(u8, t, "</header>");
        const bi = std.mem.indexOf(u8, t, "<!-- shell:footer -->");
        if (ai == null or bi == null) try problems.append(a, "no header or footer to wrap") else {
            const from = ai.? + "</header>".len;
            const body = if (bi.? > from) t[from..bi.?] else "";
            t = try std.mem.concat(a, u8, &.{ t[0..from], "\n\n", try fence(a, "layout", ""), "\n<main id=\"main\">", re.trimEnd(body), "\n</main>\n</div>\n\n", t[bi.?..] });
        }
    }
    // the layout the fence opens is closed after main, before the footer
    if (try hasFence(a, t, "layout")) {
        const r = try re.compile(a, "<\\/main>\\s*(?:<\\/div>\\s*)?(?=<!-- shell:footer -->)", "");
        t = try replaceFirst(a, t, &r, "</main>\n</div>\n\n");
    }

    // ---- the sections of a page get ids, and the list is made from them ----
    var secs: []const Sec = &.{};
    if (!p.home and p.outside == .none) {
        const r = try sectionsOf(a, t);
        t = r.text;
        secs = r.list;
    }
    const outlined = secs.len >= SECTION_MIN;
    // every entry of a page's outline fits one line in both cultures: 20 characters at most
    if (outlined) for (secs) |x| {
        const n = re.length(x.label);
        if (n > 20) try problems.append(a, try fmt(a, "the outline entry \"{s}\" is {d} characters: give its h2 a data-outline of 20 at most", .{ x.label, n }));
    };
    // an outline entry never repeats a label above it: its page's, or its section's in the main menu
    if (outlined) for (secs) |x| {
        const ups = [_]?[]const u8{ p.label, if (sec(p.section)) |s| s.label else null, p.family, if (p.parent) |pf| byFile(pf).?.family else null };
        for (ups) |up_opt| {
            const up = up_opt orelse continue;
            if (up.len == 0) continue;
            if (std.mem.eql(u8, try lowerTrim(a, x.label), try lowerTrim(a, up))) try problems.append(a, try fmt(a, "the outline entry \"{s}\" repeats the label \"{s}\" above it", .{ x.label, up }));
        }
    };
    // no label twice among the navigation one page shows: the main menu, the band, the family list and the outline
    if (!p.home and p.section != null) {
        const Shown = struct { where: []const u8, label: []const u8 };
        var shown: std.ArrayList(Shown) = .empty;
        for (sections) |s| try shown.append(a, .{ .where = "the main menu", .label = s.label });
        if (try bandOf(a, p.section)) |top| for (top) |q| try shown.append(a, .{ .where = "the band", .label = bandLabel(q) });
        if (try familyOf(a, p)) |f| if (p.outside == .none) for (f.list) |q| try shown.append(a, .{ .where = "the family list", .label = q.label });
        if (outlined) for (secs) |x| try shown.append(a, .{ .where = "the outline", .label = x.label });
        const the = try re.compile(a, "^the\\s+", "");
        var keys = try a.alloc([]const u8, shown.items.len);
        for (shown.items, 0..) |s, i| keys[i] = try re.replace(a, &the, try lowerTrim(a, s.label), "");
        for (shown.items, 0..) |x, i| for (shown.items[i + 1 ..], i + 1..) |y, j| {
            if (std.mem.eql(u8, keys[i], keys[j])) try problems.append(a, try fmt(a, "\"{s}\" in {s} and \"{s}\" in {s} name the same thing on one page", .{ x.label, x.where, y.label, y.where }));
        };
    }

    // ---- render ----
    if (try hasFence(a, t, "menu")) t = try fill(a, t, "menu", try menu(a, p));
    if (!p.home and try hasFence(a, t, "trail")) t = try fill(a, t, "trail", try trail(a, p));
    if (try hasFence(a, t, "layout")) {
        const r = try list3(a, p, secs);
        t = try fill(a, t, "layout", try fmt(a, "<div class=\"layout{s}\">{s}{s}", .{ if (r.len > 0) " has-list" else "", if (r.len > 0) "\n" else "", r }));
    }
    if (try hasFence(a, t, "footer")) t = try fill(a, t, "footer", try footer(a, p));
    // ---- the page declares its archetype on its body (K21) ----
    const body_re = try re.compile(a, "<body\\b([^>]*)>", "");
    if (re.exec(&body_re, t, 0)) |bm| {
        const attrs = try re.sub(a, bm.get(t, 1).?, "\\s+data-archetype=\"[^\"]*\"", "", "");
        t = try std.mem.concat(a, u8, &.{ t[0..bm.start], try fmt(a, "<body{s} data-archetype=\"{s}\">", .{ attrs, archetypeOf(p) }), t[bm.end..] });
    } else try problems.append(a, "no <body> to carry the archetype");
    // ---- the assets carry the hash of their own content ----
    var alts: List = .empty;
    for (assets) |x| try alts.append(a, try std.mem.replaceOwned(u8, a, x, ".", "\\."));
    const asset_re = try re.compile(a, try fmt(a, "((?:href|src|data-wasm)=\")([^\"?]*?({s}))(?:\\?v=[0-9a-f]{8})?\"", .{try std.mem.join(a, "|", alts.items)}), "g");
    const ctx: AssetCtx = .{ .a = a };
    t = try re.replaceFn(a, &asset_re, t, &ctx, AssetCtx.each);
    return .{ .text = t, .problems = problems };
}

// ---- every page is on a bar (SITE-3.md 3.4) -----------------------------------------------------------------------

fn walk(a: Allocator, dir: []const u8, out: *List, skip_assets: bool) !void {
    var d = try std.fs.cwd().openDir(dir, .{ .iterate = true });
    defer d.close();
    const E = struct { name: []const u8, is_dir: bool };
    var entries: std.ArrayList(E) = .empty;
    var it = d.iterate();
    while (try it.next()) |e| try entries.append(a, .{ .name = try a.dupe(u8, e.name), .is_dir = e.kind == .directory });
    std.mem.sort(E, entries.items, {}, struct {
        fn lt(_: void, x: E, y: E) bool {
            return std.mem.lessThan(u8, x.name, y.name);
        }
    }.lt);
    for (entries.items) |e| {
        const q = try fmt(a, "{s}/{s}", .{ dir, e.name });
        if (e.is_dir) {
            if (!skip_assets or !(std.mem.eql(u8, e.name, "assets") or std.mem.eql(u8, e.name, "node_modules"))) try walk(a, q, out, skip_assets);
        } else try out.append(a, q);
    }
}
fn htmlUnder(a: Allocator, dir: []const u8, out: *List) !void {
    var all: List = .empty;
    try walk(a, dir, &all, true);
    for (all.items) |f| if (std.mem.endsWith(u8, f, ".html")) try out.append(a, f);
}

fn barsOfPage(a: Allocator, p: *const Page) !usize {
    var on: usize = 0;
    if (p.home) on += 1;
    if (isHeadFile(p.file)) on += 1;
    if (p.rail and p.parent == null and (try bandOf(a, p.section)) != null) on += 1;
    if (p.parent != null) on += 1;
    return on;
}

fn checkBars(a: Allocator, problems: *List) !void {
    var served: List = .empty;
    try served.append(a, "index.html");
    try htmlUnder(a, "site", &served);
    try htmlUnder(a, "tools", &served);
    try htmlUnder(a, "constitution/reader", &served);
    for (served.items) |f| if (byFile(f) == null) try problems.append(a, try fmt(a, "{s}: a page the site serves that the registry does not list, so no bar names it", .{f}));
    for (&pages) |*p| if (try barsOfPage(a, p) == 0) try problems.append(a, try fmt(a, "{s}: on no bar", .{p.file}));
    const home = byFile("index.html").?;
    const foot = try footer(a, home);
    const links = try re.compile(a, "href=\"([^\"]+)\"", "g");
    var it = re.iterate(&links, foot);
    while (it.next()) |m| {
        const h = m.get(foot, 1).?;
        if (try re.matches(a, h, "^https?:", "")) continue;
        const target = try re.sub(a, try normalize(a, h), "^\\.\\/", "", "");
        if (byFile(target)) |q| {
            if (try barsOfPage(a, q) == 0) try problems.append(a, try fmt(a, "footer links {s}, which no bar names", .{target}));
        } else if (std.mem.endsWith(u8, target, ".html")) {
            try problems.append(a, try fmt(a, "footer links {s}, a page the registry does not list", .{target}));
        } else if (!exists(target)) try problems.append(a, try fmt(a, "footer links {s}, which does not exist", .{target}));
    }
}

// ---- the register: each page names its subject (doc/design/WRITING.md) --------------------------------------------

const Head = struct { h1: ?[]const u8, first: ?[]const u8 };
fn firstSentence(a: Allocator, s: []const u8) ![]const u8 {
    if (try re.find(a, s, "^([\\s\\S]*?[.!?])(?=\\s|$)", "")) |m| return m.get(s, 1).?;
    return s;
}
fn nonEmpty(s: ?[]const u8) ?[]const u8 {
    const x = s orelse return null;
    return if (x.len == 0) null else x;
}
fn headOf(a: Allocator, text: []const u8) !Head {
    if (std.mem.indexOf(u8, text, "<header class=\"hero\"") != null) {
        const sec_m = try re.find(a, text, "<main\\b[^>]*>[\\s\\S]*?<section\\b[^>]*>([\\s\\S]*?)<\\/section>", "");
        var h1: ?[]const u8 = null;
        var first: ?[]const u8 = null;
        if (sec_m) |sm| {
            const body = sm.get(text, 1).?;
            if (try re.find(a, body, "<(h1|h2)\\b[^>]*>([\\s\\S]*?)<\\/\\1>", "")) |t| h1 = try plain(a, t.get(body, 2).?);
            if (try re.find(a, body, "<p\\b[^>]*>([\\s\\S]*?)<\\/p>", "")) |pm| first = try firstSentence(a, try plain(a, pm.get(body, 1).?));
        }
        return .{ .h1 = nonEmpty(h1), .first = nonEmpty(first) };
    }
    const h1 = try re.find(a, text, "<h1\\b[^>]*>([\\s\\S]*?)<\\/h1>", "");
    var first: ?[]const u8 = null;
    if (try re.find(a, text, "<header\\b[^>]*>[\\s\\S]*?<\\/header>", "")) |hm| {
        const head = text[hm.start..hm.end];
        const lead = (try re.find(a, head, "<(p|span) class=\"sub\">([\\s\\S]*?)<\\/\\1>", "")) orelse (try re.find(a, head, "<div class=\"panel\">[\\s\\S]*?<()p>([\\s\\S]*?)<\\/p>", ""));
        if (lead) |l| first = try firstSentence(a, try plain(a, l.get(head, 2).?));
    }
    return .{ .h1 = nonEmpty(if (h1) |m| try plain(a, m.get(text, 1).?) else null), .first = nonEmpty(first) };
}

fn checkWriting(a: Allocator, problems: *List) !void {
    for (pages) |p| {
        if (!exists(p.file)) continue;
        const h = try headOf(a, try core.wellFormed(a, try readFile(a, p.file)));
        const term = try re.lower(a, p.term);
        // the term begins a word, so "use" is not found inside "because"; a term is letters and spaces only
        if (!try re.matches(a, term, "^[a-z ]+$", "")) try problems.append(a, try fmt(a, "{s}: the subject term \"{s}\" is not letters and spaces", .{ p.file, p.term }));
        const named = try re.compile(a, try fmt(a, "(^|[^a-z0-9]){s}", .{try re.escapeLiteral(a, term)}), "i");
        if (h.h1) |x| {
            if (!re.testIn(&named, x)) try problems.append(a, try fmt(a, "{s}: the h1 does not name the page's subject (\"{s}\"): \"{s}\"", .{ p.file, p.term, x }));
        } else try problems.append(a, try fmt(a, "{s}: no h1", .{p.file}));
        if (h.first) |x| {
            if (!re.testIn(&named, x)) try problems.append(a, try fmt(a, "{s}: the lead's first sentence does not name the page's subject (\"{s}\"): \"{s}\"", .{ p.file, p.term, x }));
        } else try problems.append(a, try fmt(a, "{s}: no lead", .{p.file}));
    }
}

// ---- a title's line breaks belong to the browser (doc/design/WRITING.md) -------------------------------------------

const Rule = struct { selectors: []const []const u8, body: []const u8 };
fn cssRules(a: Allocator) ![]const Rule {
    var css: []const u8 = try std.mem.replaceOwned(u8, a, try core.wellFormed(a, try readFile(a, "site/stz.css")), "\r\n", "\n");
    css = try re.sub(a, css, "\\/\\*[\\s\\S]*?\\*\\/", "g", " ");
    var rules: std.ArrayList(Rule) = .empty;
    const r = try re.compile(a, "([^{}]+)\\{([^{}]*)\\}", "g");
    var it = re.iterate(&r, css);
    while (it.next()) |m| {
        var sels: List = .empty;
        var parts_it = std.mem.splitScalar(u8, m.get(css, 1).?, ',');
        while (parts_it.next()) |s| try sels.append(a, re.trim(s));
        try rules.append(a, .{ .selectors = sels.items, .body = m.get(css, 2).? });
    }
    return rules.items;
}

fn checkBreaks(a: Allocator, problems: *List) !void {
    const rules = try cssRules(a);
    const Blocking = struct { heading: []const u8, child: []const u8, selector: []const u8 };
    var blocking: std.ArrayList(Blocking) = .empty;
    const display = try re.compile(a, "(^|;)\\s*display\\s*:\\s*(block|flex|grid|table|list-item)\\b", "");
    const sel_re = try re.compile(a, "(?:^|[\\s>])(h1|h2|h3|\\.scene-title)\\s*>?\\s*([a-z][a-z0-9]*|\\.[\\w-]+)$", "i");
    for (rules) |r| {
        if (!re.testIn(&display, r.body)) continue;
        for (r.selectors) |s| if (re.exec(&sel_re, s, 0)) |m| try blocking.append(a, .{ .heading = m.get(s, 1).?, .child = m.get(s, 2).?, .selector = s });
    }
    for ([_][]const u8{ "h1", "h2", "h3" }) |h| if (!try declares(a, rules, h, "balance")) try problems.append(a, try fmt(a, "site/stz.css: no rule declares text-wrap: balance on {s}", .{h}));
    if (!try declares(a, rules, "p", "pretty")) try problems.append(a, "site/stz.css: no rule declares text-wrap: pretty on p");
    // a title is never set in capitals
    const upper = try re.compile(a, "(^|;)\\s*text-transform\\s*:\\s*uppercase\\b", "");
    const title_sel = try re.compile(a, "(^|[\\s>])(h1|h2|h3|\\.scene-title)$", "");
    for (rules) |r| if (re.testIn(&upper, r.body)) for (r.selectors) |s| if (re.testIn(&title_sel, s)) try problems.append(a, try fmt(a, "site/stz.css: \"{s}\" sets a title in capitals", .{s}));

    const heading_re = try re.compile(a, "<(h1|h2|h3)\\b[^>]*>([\\s\\S]*?)<\\/\\1>|<(\\w+)\\b[^>]*class=\"[^\"]*\\bscene-title\\b[^\"]*\"[^>]*>([\\s\\S]*?)<\\/\\3>", "g");
    const block_tags = try re.compile(a, "<(div|p|ul|ol|li|section|article|aside|table|blockquote|pre|figure|header|footer|nav|h[1-6])\\b", "i");
    const br = try re.compile(a, "<br\\b", "i");
    for (pages) |p| {
        if (!exists(p.file)) continue;
        const text = try re.sub(a, try core.wellFormed(a, try readFile(a, p.file)), "<(script|style)\\b[\\s\\S]*?<\\/\\1>", "g", " ");
        // a drawing scales to its column and never scrolls sideways
        if (try re.matches(a, text, "<svg\\b[^>]*style=\"[^\"]*min-width", "")) try problems.append(a, try fmt(a, "{s}: an svg holds a fixed min-width, so its column scrolls sideways", .{p.file}));
        if (try re.matches(a, text, "<div class=\"scroll\">\\s*<svg\\b", "")) try problems.append(a, try fmt(a, "{s}: an svg sits in a scrolling wrapper: a drawing scales to its column", .{p.file}));
        var it = re.iterate(&heading_re, text);
        while (it.next()) |m| {
            const h_tag = m.get(text, 1);
            const tag = h_tag orelse "scene-title";
            const inner = if (h_tag != null) m.get(text, 2).? else m.get(text, 4).?;
            const name = try fmt(a, "\"{s}\"", .{try re.head(a, try plain(a, inner), 70)});
            if (re.testIn(&br, inner)) try problems.append(a, try fmt(a, "{s}: the {s} {s} holds a <br>: a line break placed by hand", .{ p.file, tag, name }));
            if (re.exec(&block_tags, inner, 0)) |b| try problems.append(a, try fmt(a, "{s}: the {s} {s} holds a <{s}>, a block: a line break placed by hand", .{ p.file, tag, name, b.get(inner, 1).? }));
            for (blocking.items) |k| {
                if (!std.mem.eql(u8, k.heading, tag) and !(std.mem.eql(u8, k.heading, ".scene-title") and std.mem.eql(u8, tag, "scene-title"))) continue;
                const child_re = if (std.mem.startsWith(u8, k.child, "."))
                    try re.compile(a, try fmt(a, "<\\w+\\b[^>]*class=\"[^\"]*\\b{s}\\b", .{k.child[1..]}), "")
                else
                    try re.compile(a, try fmt(a, "<{s}\\b", .{k.child}), "i");
                if (re.testIn(&child_re, inner)) try problems.append(a, try fmt(a, "{s}: the {s} {s} holds a {s} that stz.css makes a block (\"{s}\"): a line break placed by hand", .{ p.file, tag, name, k.child, k.selector }));
            }
        }
    }
}
fn declares(a: Allocator, rules: []const Rule, sel: []const u8, prop: []const u8) !bool {
    const r = try re.compile(a, try fmt(a, "(^|;)\\s*text-wrap\\s*:\\s*{s}\\b", .{prop}), "");
    for (rules) |x| {
        var has = false;
        for (x.selectors) |s| if (std.mem.eql(u8, s, sel)) {
            has = true;
        };
        if (has and re.testIn(&r, x.body)) return true;
    }
    return false;
}

// ---- the site does not name Zing (the Principal, 2026-11-06) --------------------------------------------------------

fn addOnce(a: Allocator, list: *List, f: []const u8) !void {
    for (list.items) |x| if (std.mem.eql(u8, x, f)) return;
    try list.append(a, f);
}
fn checkNames(a: Allocator, problems: *List) !void {
    var files: List = .empty;
    try addOnce(a, &files, "index.html");
    try addOnce(a, &files, "README.md");
    for (pages) |p| try addOnce(a, &files, p.file);
    var all: List = .empty;
    try walk(a, "site", &all, false);
    const ext = try re.compile(a, "\\.(html|css|js|json|md|txt|svg)$", "");
    for (all.items) |f| if (re.testIn(&ext, basename(f))) try addOnce(a, &files, f);
    const zing = try re.compile(a, "\\bzing\\b", "i");
    for (files.items) |f| {
        if (!exists(f)) continue;
        var it = std.mem.splitScalar(u8, try core.wellFormed(a, try readFile(a, f)), '\n');
        var i: usize = 0;
        while (it.next()) |line| : (i += 1) if (re.testIn(&zing, line)) try problems.append(a, try fmt(a, "{s}:{d} names Zing: the Zane site does not name Zing", .{ f, i + 1 }));
    }
}

// ---- the site names the one file, never node (doc/design/BINARY.md, S6) ----------------------------------------------------------

/// A line of a page that documents the JavaScript reference and may name Node, with the reason: site-shell.js's NODE_ALLOWED.
const NodeAllowed = struct { file: []const u8, words: []const u8, reason: []const u8 };
const node_allowed = [_]NodeAllowed{
    .{ .file = "tools/zane/wasm-proof.html", .words = "node tools/zane/parity.js --write-wasm-proof", .reason = "parity.js holds the binary to its JavaScript reference, so it runs on Node by design; the proof page says what writes its record" },
};

fn newlinesOnly(a: Allocator, m: re.Match, t: []const u8) ![]const u8 {
    const n = std.mem.count(u8, t[m.start..m.end], "\n");
    const out = try a.alloc(u8, n);
    @memset(out, '\n');
    return out;
}

/// No page of the registry, and not README.md, tells the reader to run Node: a command (node PATH.js) or the runtime by name.
fn checkNode(a: Allocator, problems: *List) !void {
    var used = [_]bool{false} ** node_allowed.len;
    var files: List = .empty;
    try addOnce(a, &files, "index.html");
    try addOnce(a, &files, "README.md");
    for (pages) |p| try addOnce(a, &files, p.file);
    const node_re = try re.compile(a, "\\bnode\\s+[\\w./-]+\\.[cm]?js\\b|\\bNode(?:\\.js)?\\b", "");
    const blocks = try re.compile(a, "<(script|style)\\b[\\s\\S]*?<\\/\\1>", "g");
    for (files.items) |f| {
        if (!exists(f)) continue;
        const text = try re.replaceFn(a, &blocks, try core.wellFormed(a, try readFile(a, f)), a, newlinesOnly);
        var it = std.mem.splitScalar(u8, text, '\n');
        var i: usize = 0;
        while (it.next()) |line| : (i += 1) {
            const m = re.exec(&node_re, line, 0) orelse continue;
            var allowed = false;
            for (node_allowed, 0..) |x, k| if (std.mem.eql(u8, x.file, f) and std.mem.indexOf(u8, line, x.words) != null) {
                used[k] = true;
                allowed = true;
                break;
            };
            if (!allowed) try problems.append(a, try fmt(a, "{s}:{d} tells the reader to run Node (\"{s}\"): the verifier is one file, zane (doc/design/BINARY.md, S6)", .{ f, i + 1, line[m.start..m.end] }));
        }
    }
    for (node_allowed, 0..) |x, k| if (!used[k]) try problems.append(a, try fmt(a, "NODE_ALLOWED: {s} \"{s}\" matches no line: the entry has outlived what it excused", .{ x.file, x.words }));
}

// ---- a release the site offers has its notes in this repository (Central's ZANE-RELEASE-01, 2026-11-07) --------------------------

/// A page of the registry, index.html or README.md that links a release, its page or one of its files, names a version for which
/// doc/releases/v<version>.md exists.
fn checkReleases(a: Allocator, problems: *List) !void {
    var files: List = .empty;
    try addOnce(a, &files, "index.html");
    try addOnce(a, &files, "README.md");
    for (pages) |p| try addOnce(a, &files, p.file);
    const release_re = try re.compile(a, "\\/releases\\/(?:tag|download)\\/v([0-9][0-9A-Za-z.-]*)", "g");
    for (files.items) |f| {
        if (!exists(f)) continue;
        var it = std.mem.splitScalar(u8, try core.wellFormed(a, try readFile(a, f)), '\n');
        var i: usize = 0;
        while (it.next()) |line| : (i += 1) {
            var ms = re.iterate(&release_re, line);
            while (ms.next()) |m| {
                const v = m.get(line, 1) orelse continue;
                const notes = try fmt(a, "doc/releases/v{s}.md", .{v});
                if (!exists(notes)) try problems.append(a, try fmt(a, "{s}:{d} links the release v{s} and {s} does not exist: a release the site offers has its notes in this repository", .{ f, i + 1, v, notes }));
            }
        }
    }
}

// ---- a page states what Zane is and does (Central's ZANE-AFFIRM-01, 2026-11-08; doc/design/WRITING.md section 4) -------
// No page of the registry, index.html or README.md lists what the project lacks. Scripts, styles, comments and code samples are not
// read; each block of a line is judged on its own, so "Limit:" and "Not shown:" are refused where a block opens on them.

const AffirmAllowed = struct { file: []const u8, words: []const u8, reason: []const u8 };
const affirm_allowed = [_]AffirmAllowed{
    .{ .file = "site/haro.html", .words = "two checks the condition language cannot yet express", .reason = "a technical table of the forged court: the seam column names what Haro's condition language expresses, a fact about Haro and not a lack of Zane (Central, 2026-11-09)" },
    .{ .file = "site/gotchas/reading.html", .words = "not yet been articulated by your teams", .reason = "the violation this page demonstrates: marketing copy written badly on purpose, inside the red frame the reader is meant to feel" },
};
fn checkAffirm(a: Allocator, problems: *List) !void {
    var used = [_]bool{false} ** affirm_allowed.len;
    var files: List = .empty;
    try addOnce(a, &files, "index.html");
    try addOnce(a, &files, "README.md");
    for (pages) |p| try addOnce(a, &files, p.file);
    const phrase = try re.compile(a, "\\b(not yet|nobody has|no one has|never been|has not been|no person has|not run yet|not built|unverified|unproven|unproved|not proved|no study|no user|not shown|cannot yet|not verified|nobody looked|not written|never(?:\\W+\\w+){0,3}?\\W+run)\\b", "i");
    const lead = try re.compile(a, "(?:^|[.!?]\\s)(Limit:)", "");
    const meta = try re.compile(a, "<meta\\b[^>]*\\b(?:name=\"description\"|property=\"og:description\")[^>]*>", "g");
    const content = try re.compile(a, "\\bcontent=\"([^\"]*)\"", "");
    const block = try re.compile(a, "<(?:p|li|div|h[1-6]|td|th|dd|dt|br|tr|figcaption|blockquote|section|header)\\b[^>]*>", "gi");
    const tag = try re.compile(a, "<[^>]*>", "g");
    const comments = try re.compile(a, "<!--[\\s\\S]*?-->", "g");
    const html_code = try re.compile(a, "<(script|style|code)\\b[\\s\\S]*?<\\/\\1>", "g");
    const html_pre = try re.compile(a, "<pre\\b(?![^>]*\\bterm\\b)[^>]*>[\\s\\S]*?<\\/pre>", "g");
    const md_fence = try re.compile(a, "```[\\s\\S]*?```", "g");
    const md_tick = try re.compile(a, "`[^`\\n]*`", "g");
    for (files.items) |f| {
        if (!exists(f)) continue;
        var text = try core.wellFormed(a, try readFile(a, f));
        if (std.mem.endsWith(u8, f, ".md")) {
            text = try re.replaceFn(a, &md_fence, text, a, newlinesOnly);
            text = try re.replaceFn(a, &md_tick, text, a, newlinesOnly);
            text = try re.replaceFn(a, &comments, text, a, newlinesOnly);
        } else {
            text = try re.replaceFn(a, &comments, text, a, newlinesOnly);
            text = try re.replaceFn(a, &html_code, text, a, newlinesOnly);
            text = try re.replaceFn(a, &html_pre, text, a, newlinesOnly);
        }
        var it = std.mem.splitScalar(u8, text, '\n');
        var i: usize = 0;
        while (it.next()) |line| : (i += 1) {
            var said: List = .empty;
            var metas = re.iterate(&meta, line);
            while (metas.next()) |mm| {
                const tagtext = line[mm.start..mm.end];
                const c = re.exec(&content, tagtext, 0) orelse continue;
                const seg = try plain(a, c.get(tagtext, 1).?);
                if (re.exec(&phrase, seg, 0)) |m| try said.append(a, m.get(seg, 1).?);
                if (re.exec(&lead, seg, 0)) |m| try said.append(a, m.get(seg, 1).?);
            }
            var from: usize = 0;
            var ms = re.iterate(&block, line);
            var done = false;
            while (!done) {
                var end = line.len;
                var next_from = line.len;
                if (ms.next()) |m| {
                    end = m.start;
                    next_from = m.end;
                } else done = true;
                const seg = try plain(a, try re.replace(a, &tag, line[from..end], " "));
                if (re.exec(&phrase, seg, 0)) |m| try said.append(a, m.get(seg, 1).?);
                if (re.exec(&lead, seg, 0)) |m| try said.append(a, m.get(seg, 1).?);
                from = next_from;
            }
            if (said.items.len == 0) continue;
            var allowed = false;
            for (affirm_allowed, 0..) |x, k| if (std.mem.eql(u8, x.file, f) and std.mem.indexOf(u8, line, x.words) != null) {
                used[k] = true;
                allowed = true;
                break;
            };
            if (!allowed) try problems.append(a, try fmt(a, "{s}:{d} says what the project lacks (\"{s}\"): a page states what Zane is and does (doc/design/WRITING.md section 4)", .{ f, i + 1, try std.mem.join(a, "\", \"", said.items) }));
        }
    }
    for (affirm_allowed, 0..) |x, k| if (!used[k]) try problems.append(a, try fmt(a, "AFFIRM_ALLOWED: {s} \"{s}\" matches no line: the entry has outlived what it excused", .{ x.file, x.words }));
}

// ---- the menu tells the truth about the tree (Rule 116 at v3.16; the Principal, 2026-11-08) -------------------------
// The site's menu, written as a Zane declaration (site/menu.zane, NAV_GRAPHs with LABEL, TARGET and ENTRIES), compared with
// what the registry renders and read by the verifier itself (core.verify): MENU_LABEL_REPEATS_PARENT, MENU_LANDING_NOT_FIRST,
// MENU_LABEL_DUPLICATE. --write writes it. The same text as menuDecl in tools/site-shell.js.

const MENU_FILE = "site/menu.zane";
/// a page's surface name: the path without .html, /index, and its first folder (site, tools/zane, tools, constitution), / and - as _
fn surf(a: Allocator, file: []const u8) ![]const u8 {
    var s = file;
    if (std.mem.endsWith(u8, s, ".html")) s = s[0 .. s.len - 5];
    if (std.mem.endsWith(u8, s, "/index")) s = s[0 .. s.len - 6];
    for ([_][]const u8{ "site/", "tools/zane/", "tools/", "constitution/" }) |pre| if (std.mem.startsWith(u8, s, pre)) {
        s = s[pre.len..];
        break;
    };
    const out = try a.dupe(u8, s);
    for (out) |*c| if (c.* == '/' or c.* == '-') {
        c.* = '_';
    };
    return out;
}
fn menuDecl(a: Allocator) ![]const u8 {
    var out: List = .empty;
    try out.appendSlice(a, &.{
        "// site/menu.zane: the Zane site's own menu, declared in Zane (language 1.6; Rule 116 at v3.16).",
        "// Written by `zane site shell --write` from the registry of tools/site-shell.js. `zane site shell` fails when this file differs",
        "// from the registry, and refuses in it what `zane check` refuses: MENU_LABEL_REPEATS_PARENT, MENU_LANDING_NOT_FIRST and",
        "// MENU_LABEL_DUPLICATE. The main menu names each section; the band under a section opens on its landing page.",
        "",
        "DEFINE NAV_GRAPH main_menu (",
        "  SATISFIES [LOCATE],",
    });
    var ids: List = .empty;
    for (sections) |s| try ids.append(a, s.id);
    try out.append(a, try fmt(a, "  ENTRIES [{s}]", .{try std.mem.join(a, ", ", ids.items)}));
    try out.append(a, ")");
    for (sections) |s| {
        const band_pages = (try bandOf(a, s.id)) orelse &[_]*const Page{};
        var kids: List = .empty;
        for (band_pages) |q| try kids.append(a, if (q.family != null) try fmt(a, "{s}_family", .{try surf(a, q.file)}) else try surf(a, q.file));
        try menuNode(a, &out, s.id, s.label, s.head, kids.items);
        for (band_pages) |q| {
            const fy = try familyOf(a, q);
            if (q.family != null and fy != null) {
                var fk: List = .empty;
                for (fy.?.list) |x| try fk.append(a, try surf(a, x.file));
                try menuNode(a, &out, try fmt(a, "{s}_family", .{try surf(a, q.file)}), q.family.?, q.file, fk.items);
                for (fy.?.list) |x| try out.append(a, try menuLeaf(a, x));
                try out.append(a, "");
            } else try out.append(a, try menuLeaf(a, q));
        }
    }
    // the lines joined, a run of blank lines kept as one, and one newline at the end
    var text: std.ArrayList(u8) = .empty;
    var blank = false;
    for (out.items, 0..) |line, i| {
        if (line.len == 0) {
            if (blank) continue;
            blank = true;
        } else blank = false;
        if (i > 0) try text.append(a, '\n');
        try text.appendSlice(a, line);
    }
    var body = text.items;
    while (body.len > 0 and body[body.len - 1] == '\n') body = body[0 .. body.len - 1];
    return fmt(a, "{s}\n", .{body});
}
fn menuNode(a: Allocator, out: *List, name: []const u8, label: []const u8, to: []const u8, kids: []const []const u8) !void {
    try out.appendSlice(a, &.{
        "",
        try fmt(a, "DEFINE NAV_GRAPH {s} (", .{name}),
        try fmt(a, "  LABEL \"{s}\",", .{label}),
        try fmt(a, "  TARGET {s},", .{try surf(a, to)}),
        try fmt(a, "  ENTRIES [{s}]", .{try std.mem.join(a, ", ", kids)}),
        ")",
    });
}
fn menuLeaf(a: Allocator, q: *const Page) ![]const u8 {
    const s = try surf(a, q.file);
    return fmt(a, "DEFINE NAV_GRAPH {s} (LABEL \"{s}\", TARGET {s})", .{ s, q.label, s });
}
/// a subject as Node prints it: a lone surrogate (kept as WTF-8 by core) becomes U+FFFD
fn printable(a: Allocator, s: []const u8) ![]const u8 {
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
    return out.items;
}
fn checkMenu(a: Allocator, out: *std.Io.Writer, problems: *List, write: bool) !void {
    const want = try menuDecl(a);
    const have: ?[]const u8 = if (exists(MENU_FILE)) try core.wellFormed(a, try readFile(a, MENU_FILE)) else null;
    if (have == null or !std.mem.eql(u8, have.?, want)) {
        if (write) {
            try std.fs.cwd().writeFile(.{ .sub_path = MENU_FILE, .data = want });
            try out.writeAll("wrote  " ++ MENU_FILE ++ "\n");
        } else try problems.append(a, if (have == null) MENU_FILE ++ ": missing (run with --write)" else MENU_FILE ++ ": differs from the menu this file renders (run with --write)");
    }
    const text = if (write or have == null) want else have.?;
    for (try core.verify(a, text, null)) |d| {
        if (d.subject) |s| try problems.append(a, try fmt(a, "{s}:{d}: {s} {s}", .{ MENU_FILE, d.line, d.id, try printable(a, s) })) else try problems.append(a, try fmt(a, "{s}:{d}: {s}", .{ MENU_FILE, d.line, d.id }));
    }
}

// ---- no tooltips (the author, 2026-11-06) ----------------------------------------------------------------------------

fn checkTooltips(a: Allocator, problems: *List) !void {
    var files: List = .empty;
    try addOnce(a, &files, "index.html");
    for (pages) |p| try addOnce(a, &files, p.file);
    const attr = try re.compile(a, "<[a-zA-Z][^<>]*\\stitle=[\"'$]", "");
    const title = try re.compile(a, "<title\\b", "g");
    for (files.items) |f| {
        if (!exists(f)) continue;
        var titles: usize = 0;
        var it = std.mem.splitScalar(u8, try core.wellFormed(a, try readFile(a, f)), '\n');
        var i: usize = 0;
        while (it.next()) |line| : (i += 1) {
            if (re.testIn(&attr, line)) try problems.append(a, try fmt(a, "{s}:{d} carries a title attribute, a tooltip: say it in the label instead", .{ f, i + 1 }));
            titles += re.count(&title, line);
        }
        if (titles > 1) try problems.append(a, try fmt(a, "{s} holds {d} <title> elements: an SVG names itself with <desc>, which shows nothing on hover", .{ f, titles }));
    }
}

// ---- the system's tokens, read in the stylesheets (doc/design/DESIGN-SYSTEM.md section 6.2; K01, K09, K15) ---------------
// Every size and every colour of site/stz.css and site/gotchas.css comes from a token; a rule between the comments offense:start and
// offense:end dresses an offending demo and is not read; no rule makes a :hover reach another element. The same as checkSheets in
// tools/site-shell.js, finding for finding.

const sheets = [_][]const u8{ "site/stz.css", "site/gotchas.css" };
fn lineAt(s: []const u8, i: usize) usize {
    return std.mem.count(u8, s[0..i], "\n") + 1;
}
fn checkSheets(a: Allocator, problems: *List) !void {
    const offense = try re.compile(a, "\\/\\*\\s*offense:start\\s*\\*\\/[\\s\\S]*?\\/\\*\\s*offense:end\\s*\\*\\/", "g");
    const comment = try re.compile(a, "\\/\\*[\\s\\S]*?\\*\\/", "g");
    const rule = try re.compile(a, "([^{}]*)\\{([^{}]*)\\}", "g");
    const decl = try re.compile(a, "(^|;)\\s*([\\w-]+)\\s*:\\s*([^;]*)", "g");
    const token_sel = try re.compile(a, "^(:root|\\[data-vibe(=\"[\\w-]+\")?\\]|html\\[data-vibe(=\"[\\w-]+\")?\\])$", "");
    const size_ok = try re.compile(a, "^(var\\(--size-[\\w-]+\\)|inherit|1em)$", "");
    const line_height = try re.compile(a, "\\/\\s*[\\d.]+", "");
    const has_len = try re.compile(a, "\\d(px|rem|em|pt|%)", "");
    const size_var = try re.compile(a, "var\\(--size-", "");
    const colour = try re.compile(a, "#[0-9a-f]{3,8}\\b|\\b(rgba?|hsla?)\\(", "i");
    const colour_word = try re.compile(a, "#[0-9a-f]{3,8}\\b|\\b(rgba?|hsla?)\\([^)]*\\)", "i");
    const hover = try re.compile(a, ":hover\\s*[>+~ ]\\s*\\S", "");
    for (sheets) |f| {
        if (!exists(f)) continue;
        var css: []const u8 = try std.mem.replaceOwned(u8, a, try core.wellFormed(a, try readFile(a, f)), "\r\n", "\n");
        css = try re.replaceFn(a, &offense, css, a, newlinesOnly);
        css = try re.replaceFn(a, &comment, css, a, newlinesOnly);
        var rules = re.iterate(&rule, css);
        while (rules.next()) |m| {
            const raw_sel = m.get(css, 1).?;
            const body = m.get(css, 2).?;
            const sel = re.trim(try re.sub(a, raw_sel, "\\s+", "g", " "));
            if (std.mem.startsWith(u8, sel, "@")) continue;
            const at = m.start + raw_sel.len + 1;
            var token_rule = true;
            var sel_parts = std.mem.splitScalar(u8, sel, ',');
            while (sel_parts.next()) |s| if (re.exec(&token_sel, re.trim(s), 0) == null) {
                token_rule = false;
            };
            var ds = re.iterate(&decl, body);
            while (ds.next()) |d| {
                const lead = d.get(body, 1).?;
                const prop = d.get(body, 2).?;
                const val = re.trim(d.get(body, 3).?);
                const whole = body[d.start..d.end];
                const line = lineAt(css, at + d.start + (std.mem.indexOfPos(u8, whole, lead.len, prop) orelse lead.len));
                if (std.mem.startsWith(u8, prop, "--")) continue;
                if (std.mem.eql(u8, prop, "font-size") and re.exec(&size_ok, val, 0) == null)
                    try problems.append(a, try fmt(a, "{s}:{d} \"{s}\" sets font-size {s}, not a size token (K01 TYPE_SCALE)", .{ f, line, sel, val }));
                if (std.mem.eql(u8, prop, "font") and re.exec(&has_len, try re.replace(a, &line_height, val, ""), 0) != null and re.exec(&size_var, val, 0) == null)
                    try problems.append(a, try fmt(a, "{s}:{d} \"{s}\" sets a font size in its font shorthand, not a size token (K01 TYPE_SCALE)", .{ f, line, sel }));
                if (!token_rule and re.exec(&colour, val, 0) != null) {
                    const w = re.exec(&colour_word, val, 0).?;
                    try problems.append(a, try fmt(a, "{s}:{d} \"{s}\" writes the colour {s} in {s}, not a colour token (K09 PALETTE)", .{ f, line, sel, val[w.start..w.end], prop }));
                }
            }
            var hs = std.mem.splitScalar(u8, sel, ',');
            while (hs.next()) |s0| {
                const s = re.trim(s0);
                if (re.exec(&hover, s, 0) != null) {
                    const whole = css[m.start..m.end];
                    const off = std.mem.indexOf(u8, whole, s) orelse 0;
                    try problems.append(a, try fmt(a, "{s}:{d} \"{s}\" makes a :hover reach another element, which exists only under a pointer (K15 NO_HOVER_ONLY)", .{ f, lineAt(css, m.start + off), s }));
                }
            }
        }
    }
}

// ---- what the pages owe milestone 3 (K19, K20), counted and named on every run (checkOwed in tools/site-shell.js) ---------

fn readable(a: Allocator, f: []const u8, text0: []const u8) ![]const u8 {
    var text = text0;
    if (std.mem.endsWith(u8, f, ".md")) {
        const md_fence = try re.compile(a, "```[\\s\\S]*?```", "g");
        const md_tick = try re.compile(a, "`[^`\\n]*`", "g");
        const comments = try re.compile(a, "<!--[\\s\\S]*?-->", "g");
        text = try re.replaceFn(a, &md_fence, text, a, newlinesOnly);
        text = try re.replaceFn(a, &md_tick, text, a, newlinesOnly);
        return re.replaceFn(a, &comments, text, a, newlinesOnly);
    }
    const comments = try re.compile(a, "<!--[\\s\\S]*?-->", "g");
    const html_code = try re.compile(a, "<(script|style|code)\\b[\\s\\S]*?<\\/\\1>", "g");
    const html_pre = try re.compile(a, "<pre\\b(?![^>]*\\bterm\\b)[^>]*>[\\s\\S]*?<\\/pre>", "g");
    text = try re.replaceFn(a, &comments, text, a, newlinesOnly);
    text = try re.replaceFn(a, &html_code, text, a, newlinesOnly);
    return re.replaceFn(a, &html_pre, text, a, newlinesOnly);
}
fn checkOwed(a: Allocator, notes: *List) !void {
    var words: List = .empty;
    var samples: List = .empty;
    var words_n: usize = 0;
    var samples_n: usize = 0;
    const para = try re.compile(a, "<p\\b[^>]*>([\\s\\S]*?)<\\/p>", "g");
    const main_re = try re.compile(a, "<main\\b[^>]*>([\\s\\S]*)<\\/main>", "");
    const section_re = try re.compile(a, "<section\\b", "g");
    const sample_re = try re.compile(a, "<figure\\b[^>]*class=\"[^\"]*\\bsample\\b", "");
    for (&pages) |*p| {
        if (!exists(p.file)) continue;
        const text = try readable(a, p.file, try core.wellFormed(a, try readFile(a, p.file)));
        var long: usize = 0;
        var ps = re.iterate(&para, text);
        while (ps.next()) |m| {
            const pl = try plain(a, m.get(text, 1).?);
            var n: usize = 0;
            var it = std.mem.tokenizeAny(u8, pl, " \t\r\n");
            while (it.next()) |_| n += 1;
            if (n > 70) long += 1;
        }
        if (long > 0) {
            try words.append(a, try fmt(a, "{s} {d}", .{ p.file, long }));
            words_n += long;
        }
        if (std.mem.eql(u8, archetypeOf(p), "article")) {
            const main = if (re.exec(&main_re, text, 0)) |m| m.get(text, 1).? else "";
            var without: usize = 0;
            var starts: std.ArrayList(usize) = .empty;
            var ss = re.iterate(&section_re, main);
            while (ss.next()) |m| try starts.append(a, m.end);
            for (starts.items, 0..) |s, i| {
                const end = if (i + 1 < starts.items.len) starts.items[i + 1] - "<section".len else main.len;
                if (re.exec(&sample_re, main[s..end], 0) == null) without += 1;
            }
            if (without > 0) {
                try samples.append(a, try fmt(a, "{s} {d}", .{ p.file, without }));
                samples_n += without;
            }
        }
    }
    try notes.append(a, try fmt(a, "NOTE K19 REGISTER, owed by milestone 3: {d} paragraph(s) over 70 words on {d} page(s){s}{s}", .{ words_n, words.items.len, if (words.items.len > 0) ": " else "", try std.mem.join(a, ", ", words.items) }));
    try notes.append(a, try fmt(a, "NOTE K20 SAMPLE, owed by milestone 3: {d} section(s) of article pages without a sample frame on {d} page(s){s}{s}", .{ samples_n, samples.items.len, if (samples.items.len > 0) ": " else "", try std.mem.join(a, ", ", samples.items) }));
    try notes.append(a, "NOTE K21 ARCHETYPE reads each page's declaration; the order of an archetype's regions is read from milestone 3");
}

// ---- the run ------------------------------------------------------------------------------------------------------

pub fn run(a: Allocator, out: *std.Io.Writer, argv: []const []const u8) !u8 {
    var write = false;
    for (argv) |x| if (std.mem.eql(u8, x, "--write")) {
        write = true;
    };
    var problems: List = .empty;
    try checkTooltips(a, &problems);
    try checkMenu(a, out, &problems, write);
    try checkBars(a, &problems);
    try checkWriting(a, &problems);
    try checkBreaks(a, &problems);
    try checkNames(a, &problems);
    try checkNode(a, &problems);
    try checkReleases(a, &problems);
    try checkAffirm(a, &problems);
    try checkSheets(a, &problems);
    var notes: List = .empty;
    try checkOwed(a, &notes);
    var changed: usize = 0;
    for (&pages) |*p| {
        if (!exists(p.file)) {
            try problems.append(a, try fmt(a, "{s}: missing", .{p.file}));
            continue;
        }
        const text = try core.wellFormed(a, try readFile(a, p.file));
        const crlf = std.mem.indexOf(u8, text, "\r\n") != null;
        const bom = std.mem.startsWith(u8, text, "\xEF\xBB\xBF");
        const r = try apply(a, p, if (bom) text[3..] else text);
        for (r.problems.items) |m| try problems.append(a, try fmt(a, "{s}: {s}", .{ p.file, m }));
        const body = if (crlf) try std.mem.replaceOwned(u8, a, r.text, "\n", "\r\n") else r.text;
        const result = if (bom) try std.mem.concat(a, u8, &.{ "\xEF\xBB\xBF", body }) else body;
        if (!std.mem.eql(u8, result, text)) {
            if (write) {
                try std.fs.cwd().writeFile(.{ .sub_path = p.file, .data = result });
                changed += 1;
                try out.writeAll(try fmt(a, "wrote  {s}\n", .{p.file}));
            } else try problems.append(a, try fmt(a, "{s}: differs from the shell this file renders (run with --write)", .{p.file}));
        }
    }
    for (notes.items) |m| try out.writeAll(try fmt(a, "{s}\n", .{m}));
    if (problems.items.len > 0) {
        for (problems.items) |m| try out.writeAll(try fmt(a, "PROBLEM {s}\n", .{m}));
        return 1;
    }
    if (write) try out.writeAll(try fmt(a, "shell written: {d} page(s) changed\n", .{changed})) else try out.writeAll(try fmt(a, "shell ok: {d} pages carry exactly the shell site-shell.js renders\n", .{pages.len}));
    return 0;
}
