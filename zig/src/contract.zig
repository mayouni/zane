//! contract.zig: the diagnostic contract and the law, loaded as data, and the family envelope.
//!
//! The severity, level and rule bindings of every diagnostic are LOADED from conformance/violations.json (embedded
//! at build, or read from `--contract FILE`); they are not hardcoded in core.zig. The law (constitution/rules.json)
//! gives every cited rule its title and every article its numeral. This is the same discipline as tools/zane/cli.js.

const std = @import("std");
const Allocator = std.mem.Allocator;
const core = @import("core.zig");

pub const violations_json = @embedFile("violations.json"); // conformance/violations.json, named in build.zig
pub const rules_json = @embedFile("rules.json"); // constitution/rules.json

/// JSON.parse keeps the last value of a repeated key; std.json refuses the document unless told to do the same.
pub const js_parse: std.json.ParseOptions = .{ .duplicate_field_behavior = .use_last };

pub const Meta = struct {
    severity: []const u8 = "error",
    level: i64 = 1,
    summary: ?[]const u8 = null,
    rules: []const []const u8 = &.{},
    articles: []const []const u8 = &.{},
    rights: []const []const u8 = &.{},
    forbidden_patterns: []const []const u8 = &.{},
};

pub const Contract = struct {
    by_id: std.StringHashMap(Meta),
    /// the ids in the catalogue's own order
    ids: []const []const u8,
    version: ?[]const u8,
    constitution: ?[]const u8,

    /// The catalogue entry for an id, or the structural stub a run without a contract falls back to.
    pub fn meta(self: Contract, id: []const u8) Meta {
        if (self.by_id.get(id)) |m| return m;
        return .{ .severity = "error", .level = 1 };
    }
};

pub const Article = struct { numeral: []const u8, title: []const u8 };
pub const Law = struct {
    rule_titles: std.StringHashMap([]const u8),
    articles: std.StringHashMap(Article),
};

fn str(v: ?std.json.Value) ?[]const u8 {
    const x = v orelse return null;
    return switch (x) {
        .string => |s| s,
        else => null,
    };
}

/// The text a JavaScript `String(x)` would give a JSON number or string (rule numbers are either).
fn asText(a: Allocator, v: std.json.Value) !?[]const u8 {
    return switch (v) {
        .string => |s| s,
        .integer => |n| try std.fmt.allocPrint(a, "{d}", .{n}),
        .number_string => |s| s,
        .float => |f| try std.fmt.allocPrint(a, "{d}", .{f}),
        else => null,
    };
}

fn textList(a: Allocator, v: ?std.json.Value) ![]const []const u8 {
    const x = v orelse return &.{};
    if (x != .array) return &.{};
    var out: std.ArrayList([]const u8) = .empty;
    for (x.array.items) |it| if (try asText(a, it)) |t| try out.append(a, t);
    return out.toOwnedSlice(a);
}

pub fn loadContract(a: Allocator, data: []const u8) !Contract {
    const root = try std.json.parseFromSliceLeaky(std.json.Value, a, data, js_parse);
    var by_id = std.StringHashMap(Meta).init(a);
    var ids: std.ArrayList([]const u8) = .empty;
    if (root == .object) {
        if (root.object.get("diagnostics")) |dv| if (dv == .array) for (dv.array.items) |d| {
            if (d != .object) continue;
            const id = str(d.object.get("id")) orelse continue;
            var m: Meta = .{};
            if (str(d.object.get("severity"))) |s| m.severity = s;
            if (d.object.get("level")) |l| switch (l) {
                .integer => |n| m.level = n,
                else => {},
            };
            m.summary = str(d.object.get("summary"));
            m.rules = try textList(a, d.object.get("rules"));
            m.articles = try textList(a, d.object.get("articles"));
            m.rights = try textList(a, d.object.get("rights"));
            m.forbidden_patterns = try textList(a, d.object.get("forbidden_patterns"));
            try by_id.put(id, m);
            try ids.append(a, id);
        };
    }
    var version: ?[]const u8 = null;
    var constitution: ?[]const u8 = null;
    if (root == .object) if (root.object.get("metadata")) |md| if (md == .object) {
        version = str(md.object.get("version"));
        constitution = str(md.object.get("constitution"));
    };
    return .{ .by_id = by_id, .ids = try ids.toOwnedSlice(a), .version = version, .constitution = constitution };
}

fn isSetKey(k: []const u8) bool {
    if (!std.mem.startsWith(u8, k, "set") or k.len < 4) return false;
    for (k[3..]) |c| if (c < '0' or c > '9') return false;
    return true;
}

pub fn loadLaw(a: Allocator, data: []const u8) !Law {
    const root = try std.json.parseFromSliceLeaky(std.json.Value, a, data, js_parse);
    var titles = std.StringHashMap([]const u8).init(a);
    var arts = std.StringHashMap(Article).init(a);
    if (root == .object) {
        var it = root.object.iterator();
        while (it.next()) |e| {
            if (!isSetKey(e.key_ptr.*) or e.value_ptr.* != .object) continue;
            const rules = e.value_ptr.object.get("rules") orelse continue;
            if (rules != .array) continue;
            for (rules.array.items) |r| {
                if (r != .object) continue;
                const num = if (r.object.get("number")) |n| try asText(a, n) else null;
                const title = str(r.object.get("title"));
                if (num != null and title != null) try titles.put(num.?, title.?);
            }
        }
        if (root.object.get("articles")) |av| if (av == .object) {
            var ai = av.object.iterator();
            while (ai.next()) |e| {
                if (e.value_ptr.* != .object) continue;
                const numeral = str(e.value_ptr.object.get("numeral")) orelse continue;
                const title = str(e.value_ptr.object.get("title")) orelse "";
                try arts.put(e.key_ptr.*, .{ .numeral = numeral, .title = title });
            }
        };
    }
    return .{ .rule_titles = titles, .articles = arts };
}

/// "Rule 51 · The Cognitive Tunnel · Rule 53 · ... · Article II · the right to leave", without the brackets.
pub fn citation(a: Allocator, m: Meta, law: ?Law) ![]const u8 {
    var bits: std.ArrayList([]const u8) = .empty;
    if (m.rules.len > 0) {
        var parts: std.ArrayList([]const u8) = .empty;
        for (m.rules) |r| {
            const t: ?[]const u8 = if (law) |l| l.rule_titles.get(r) else null;
            try parts.append(a, if (t) |title| try std.fmt.allocPrint(a, "Rule {s} · {s}", .{ r, title }) else try std.fmt.allocPrint(a, "Rule {s}", .{r}));
        }
        try bits.append(a, try std.mem.join(a, " · ", parts.items));
    }
    if (m.articles.len > 0) {
        var parts: std.ArrayList([]const u8) = .empty;
        for (m.articles) |ar| {
            const art: ?Article = if (law) |l| l.articles.get(ar) else null;
            try parts.append(a, if (art) |x| try std.fmt.allocPrint(a, "Article {s}", .{x.numeral}) else try std.fmt.allocPrint(a, "Article {s}", .{ar}));
        }
        try bits.append(a, try std.mem.join(a, ", ", parts.items));
    }
    if (m.rights.len > 0) {
        var parts: std.ArrayList([]const u8) = .empty;
        for (m.rights) |r| try parts.append(a, try std.fmt.allocPrint(a, "the right to {s}", .{r}));
        try bits.append(a, try std.mem.join(a, ", ", parts.items));
    }
    return std.mem.join(a, " · ", bits.items);
}

// ---- JSON output, as JSON.stringify(value, null, 2) writes it -----------------------------------------------

pub fn writeJsonString(w: *std.Io.Writer, s: []const u8) !void {
    try w.writeByte('"');
    var i: usize = 0;
    while (i < s.len) : (i += 1) switch (s[i]) {
        // a lone surrogate (WTF-8, from a character outside the BMP) is escaped, as JSON.stringify escapes it
        0xED => if (i + 2 < s.len and s[i + 1] >= 0xA0) {
            const u: u16 = (@as(u16, s[i] & 0x0F) << 12) | (@as(u16, s[i + 1] & 0x3F) << 6) | (s[i + 2] & 0x3F);
            try w.print("\\u{x:0>4}", .{u});
            i += 2;
        } else try w.writeByte(s[i]),
        '"' => try w.writeAll("\\\""),
        '\\' => try w.writeAll("\\\\"),
        0x08 => try w.writeAll("\\b"),
        0x0C => try w.writeAll("\\f"),
        '\n' => try w.writeAll("\\n"),
        '\r' => try w.writeAll("\\r"),
        '\t' => try w.writeAll("\\t"),
        0x00...0x07, 0x0B, 0x0E...0x1F => try w.print("\\u{x:0>4}", .{s[i]}),
        else => try w.writeByte(s[i]),
    };
    try w.writeByte('"');
}

/// Characters JavaScript's `\s` matches, for the trailing-space trim of a finding's header line.
pub fn trimJsEnd(s: []const u8) []const u8 {
    var end = s.len;
    while (end > 0) {
        const c = s[end - 1];
        if (c == ' ' or c == '\t' or c == '\n' or c == '\r' or c == 0x0B or c == 0x0C) {
            end -= 1;
            continue;
        }
        // multi-byte spaces: U+00A0, U+1680, U+2000-U+200A, U+2028, U+2029, U+202F, U+205F, U+3000, U+FEFF
        if (end >= 2 and s[end - 2] == 0xC2 and s[end - 1] == 0xA0) {
            end -= 2;
            continue;
        }
        if (end >= 3) {
            const a = s[end - 3];
            const b = s[end - 2];
            const d = s[end - 1];
            const space3 = (a == 0xE1 and b == 0x9A and d == 0x80) or
                (a == 0xE2 and b == 0x80 and ((d >= 0x80 and d <= 0x8A) or d == 0xA8 or d == 0xA9 or d == 0xAF)) or
                (a == 0xE2 and b == 0x81 and d == 0x9F) or
                (a == 0xE3 and b == 0x80 and d == 0x80) or
                (a == 0xEF and b == 0xBB and d == 0xBF);
            if (space3) {
                end -= 3;
                continue;
            }
        }
        break;
    }
    return s[0..end];
}

test "trimJsEnd trims what JavaScript trims" {
    try std.testing.expectEqualStrings("a", trimJsEnd("a  \t"));
    try std.testing.expectEqualStrings("a", trimJsEnd("a\xC2\xA0"));
    try std.testing.expectEqualStrings("a\xC3\xA9", trimJsEnd("a\xC3\xA9 "));
}
