//! facts.zig: `zane audit-facts [facts.json] [--rules 62,105]`, the screenshot audit's facts check (doc/design/BINARY.md,
//! S2). The same as doc/design/audit/check-facts.js, printing the same lines: the facts file against its schema (by a
//! validator for exactly the keywords that schema uses, with that script's own problem texts), the arithmetic the
//! schema cannot state, and the two decisions a screenshot can make, with the thresholds of decides.json.
//!
//! The schema, decides.json and the law are the ones this binary was built with; the facts file is read from disk,
//! and with no file named it is doc/design/audit/example.facts.json under the directory it is run in.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const core = @import("core.zig");
const contract_mod = @import("contract.zig");
const schema_mod = @import("schema.zig");
const js = @import("js.zig");

const facts_schema_json = @embedFile("facts.schema.json");
const decides_json = @embedFile("decides.json");

fn get(o: ?Value, k: []const u8) ?Value {
    const x = o orelse return null;
    if (x != .object) return null;
    return x.object.get(k);
}
fn strOf(v: ?Value) ?[]const u8 {
    const x = v orelse return null;
    return if (x == .string) x.string else null;
}
fn items(v: ?Value) []const Value {
    const x = v orelse return &.{};
    return if (x == .array) x.array.items else &.{};
}
fn lessThan(_: void, x: []const u8, y: []const u8) bool {
    return std.mem.lessThan(u8, x, y);
}

/// Math.round: the nearest integer, ties toward +infinity.
fn jsRound(x: f64) f64 {
    const r = @floor(x);
    return if (x - r >= 0.5) r + 1 else r;
}
fn round2(x: f64) f64 {
    return jsRound(x * 100) / 100;
}
fn rel(a: f64, b: f64) f64 {
    return jsRound(((@max(a, b) + 0.05) / (@min(a, b) + 0.05)) * 100) / 100;
}

/// typeOf: null, array, integer (Number.isInteger), or typeof's own word.
fn typeOf(v: Value) []const u8 {
    return switch (v) {
        .null => "null",
        .array => "array",
        .integer => "integer",
        .float => |f| if (@floor(f) == f and !std.math.isInf(f)) "integer" else "number",
        .number_string => "number",
        .string => "string",
        .bool => "boolean",
        .object => "object",
    };
}
fn isNumber(v: Value) bool {
    return v == .integer or v == .float or v == .number_string;
}
fn isType(v: Value, t: []const u8) bool {
    if (std.mem.eql(u8, t, "number")) return isNumber(v);
    return std.mem.eql(u8, typeOf(v), t);
}
/// JavaScript's ===, for two JSON values that are not objects or arrays.
fn strictEq(x: Value, y: Value) bool {
    if (isNumber(x) and isNumber(y)) return js.numOf(x).? == js.numOf(y).?;
    return switch (x) {
        .string => |s| y == .string and std.mem.eql(u8, s, y.string),
        .bool => |b| y == .bool and y.bool == b,
        .null => y == .null,
        else => false,
    };
}
/// `${v}` for a JSON value inside a template literal.
fn text(a: Allocator, v: Value) ![]const u8 {
    return switch (v) {
        .string => |s| s,
        .null => "null",
        .bool => |b| if (b) "true" else "false",
        .array => |arr| blk: {
            var parts: std.ArrayList([]const u8) = .empty;
            for (arr.items) |x| try parts.append(a, if (x == .null) "" else try text(a, x));
            break :blk std.mem.join(a, ",", parts.items);
        },
        .object => "[object Object]",
        else => js.num(a, js.numOf(v).?),
    };
}
/// JSON.stringify of a scalar.
fn stringify(a: Allocator, v: Value) ![]const u8 {
    return switch (v) {
        .string => |s| blk: {
            var buf: std.Io.Writer.Allocating = .init(a);
            try contract_mod.writeJsonString(&buf.writer, s);
            break :blk buf.toOwnedSlice();
        },
        else => text(a, v),
    };
}
/// String.prototype.length: UTF-16 code units.
fn jsLength(s: []const u8) usize {
    var n: usize = 0;
    for (s) |c| {
        if (c & 0xC0 != 0x80) n += 1;
        if (c >= 0xF0) n += 1;
    }
    return n;
}

const Problems = std.ArrayList([]const u8);

fn validate(a: Allocator, v: Value, s: Value, at: []const u8, problems: *Problems) !void {
    if (get(s, "const")) |c| if (!strictEq(v, c)) try problems.append(a, try std.fmt.allocPrint(a, "{s}: must be {s}", .{ at, try stringify(a, c) }));
    if (get(s, "enum")) |e| {
        var found = false;
        for (items(e)) |x| if (strictEq(v, x)) {
            found = true;
        };
        if (!found) {
            var parts: std.ArrayList([]const u8) = .empty;
            for (items(e)) |x| try parts.append(a, try text(a, x));
            try problems.append(a, try std.fmt.allocPrint(a, "{s}: must be one of {s}", .{ at, try std.mem.join(a, ", ", parts.items) }));
        }
    }
    if (get(s, "type")) |t| {
        var ts: std.ArrayList([]const u8) = .empty;
        if (t == .string) try ts.append(a, t.string) else for (items(t)) |x| if (x == .string) try ts.append(a, x.string);
        var ok = false;
        for (ts.items) |x| if (isType(v, x)) {
            ok = true;
        };
        if (!ok) return problems.append(a, try std.fmt.allocPrint(a, "{s}: must be {s}, is {s}", .{ at, try std.mem.join(a, " or ", ts.items), typeOf(v) }));
    }
    if (js.numOf(v)) |n| if (isNumber(v)) {
        if (js.numOf(get(s, "minimum"))) |m| if (n < m) try problems.append(a, try std.fmt.allocPrint(a, "{s}: below {s}", .{ at, try js.num(a, m) }));
        if (js.numOf(get(s, "maximum"))) |m| if (n > m) try problems.append(a, try std.fmt.allocPrint(a, "{s}: above {s}", .{ at, try js.num(a, m) }));
        if (js.numOf(get(s, "exclusiveMinimum"))) |m| if (n <= m) try problems.append(a, try std.fmt.allocPrint(a, "{s}: must exceed {s}", .{ at, try js.num(a, m) }));
    };
    if (v == .string) {
        if (js.numOf(get(s, "minLength"))) |m| if (@as(f64, @floatFromInt(jsLength(v.string))) < m) try problems.append(a, try std.fmt.allocPrint(a, "{s}: empty", .{at}));
        if (strOf(get(s, "pattern"))) |p| {
            const ok = schema_mod.regexTest(a, p, v.string) catch |e| switch (e) {
                error.UnsupportedPattern => false,
                else => return e,
            };
            if (!ok) try problems.append(a, try std.fmt.allocPrint(a, "{s}: does not match {s}", .{ at, p }));
        }
    }
    if (v == .array) {
        const n = v.array.items.len;
        if (js.numOf(get(s, "minItems"))) |m| if (@as(f64, @floatFromInt(n)) < m) try problems.append(a, try std.fmt.allocPrint(a, "{s}: fewer than {s} items", .{ at, try js.num(a, m) }));
        if (js.numOf(get(s, "maxItems"))) |m| if (@as(f64, @floatFromInt(n)) > m) try problems.append(a, try std.fmt.allocPrint(a, "{s}: more than {s} items", .{ at, try js.num(a, m) }));
        if (get(s, "items")) |is| for (v.array.items, 0..) |x, i| try validate(a, x, is, try std.fmt.allocPrint(a, "{s}[{d}]", .{ at, i }), problems);
    }
    if (v == .object) {
        for (items(get(s, "required"))) |k| if (k == .string and v.object.get(k.string) == null) {
            try problems.append(a, try std.fmt.allocPrint(a, "{s}: missing {s}", .{ at, k.string }));
        };
        const props = get(s, "properties");
        const closed = if (get(s, "additionalProperties")) |ap| ap == .bool and !ap.bool else false;
        var it = v.object.iterator();
        while (it.next()) |e| {
            const k = e.key_ptr.*;
            if (get(props, k)) |sub| {
                try validate(a, e.value_ptr.*, sub, try std.fmt.allocPrint(a, "{s}.{s}", .{ at, k }), problems);
            } else if (closed) try problems.append(a, try std.fmt.allocPrint(a, "{s}: unknown field {s}", .{ at, k }));
        }
    }
}

const Decision = struct { verdict: []const u8, because: []const u8 };
const Thresholds = struct { min_score: f64, spread_limit: f64, contrast_floor: f64, size_floor_pt: f64 };

fn present(v: ?Value) bool {
    const x = v orelse return false;
    return x != .null;
}

fn contrastOf(a: Allocator, l: Value, t: Thresholds) !Decision {
    const score = js.numOf(get(l, "score")) orelse std.math.nan(f64);
    if (score < t.min_score) return .{ .verdict = "not_decided", .because = try std.fmt.allocPrint(a, "OCR score {s} is below {s}", .{ try js.num(a, score), try js.num(a, t.min_score) }) };
    const cr_v = get(l, "contrast_ratio");
    if (cr_v != null and cr_v.? == .null) return .{ .verdict = "not_decided", .because = "luminance was not measured" };
    const cr = js.numOf(cr_v) orelse std.math.nan(f64);
    const spread_v = get(l, "bg_spread");
    const spread_known = present(spread_v);
    const spread = js.numOf(spread_v) orelse 0;
    if (spread_known and spread > t.spread_limit) return .{ .verdict = "not_decided", .because = try std.fmt.allocPrint(a, "background spread {s} is above {s}: text over a gradient or an image", .{ try js.num(a, spread), try js.num(a, t.spread_limit) }) };
    if (cr < t.contrast_floor) return .{ .verdict = "fail", .because = try std.fmt.allocPrint(a, "{s}:1 is below {s}:1{s}", .{ try js.num(a, cr), try js.num(a, t.contrast_floor), if (!spread_known) " (an estimate: background spread not measured)" else "" }) };
    if (!spread_known) return .{ .verdict = "pass", .because = try std.fmt.allocPrint(a, "{s}:1 is at least {s}:1 (an estimate: background spread not measured, so the worst end of the background is unknown)", .{ try js.num(a, cr), try js.num(a, t.contrast_floor) }) };
    if (spread == 0) return .{ .verdict = "pass", .because = try std.fmt.allocPrint(a, "{s}:1 is at least {s}:1, background uniform", .{ try js.num(a, cr), try js.num(a, t.contrast_floor) }) };
    // the WORST END of the background: bg_luminance moved by bg_spread toward the text colour
    const fg = js.numOf(get(l, "fg_luminance")) orelse std.math.nan(f64);
    const bg = js.numOf(get(l, "bg_luminance")) orelse std.math.nan(f64);
    const worst_bg = if (fg > bg) @min(1, bg + spread) else @max(0, bg - spread);
    const ratio = rel(fg, worst_bg);
    if (ratio >= t.contrast_floor) return .{ .verdict = "pass", .because = try std.fmt.allocPrint(a, "{s}:1, and {s}:1 at the worst end of the background: at least {s}:1 at both", .{ try js.num(a, cr), try js.num(a, ratio), try js.num(a, t.contrast_floor) }) };
    return .{ .verdict = "not_decided", .because = try std.fmt.allocPrint(a, "{s}:1 at the typical background but {s}:1 at the worst end (background {s} moved {s} toward the text colour): never a pass", .{ try js.num(a, cr), try js.num(a, ratio), try js.num(a, bg), try js.num(a, spread) }) };
}

fn sizeOf(a: Allocator, l: Value, kind: ?[]const u8, t: Thresholds) !Decision {
    const score = js.numOf(get(l, "score")) orelse std.math.nan(f64);
    if (score < t.min_score) return .{ .verdict = "not_decided", .because = try std.fmt.allocPrint(a, "OCR score {s} is below {s}", .{ try js.num(a, score), try js.num(a, t.min_score) }) };
    if (kind == null or !std.mem.eql(u8, kind.?, "line")) return .{ .verdict = "not_decided", .because = "boxes are ink boxes: they can be half an em tall, so they bound nothing" };
    const pt = js.numOf(get(l, "line_height_pt")) orelse std.math.nan(f64);
    if (pt < t.size_floor_pt) return .{ .verdict = "fail", .because = try std.fmt.allocPrint(a, "the line box is {s} pt, so the font is at most that: below the {s} pt (16 CSS px) floor", .{ try js.num(a, pt), try js.num(a, t.size_floor_pt) }) };
    return .{ .verdict = "not_decided", .because = try std.fmt.allocPrint(a, "a {s} pt line box does not show the font is large: line height can be generous around small text", .{try js.num(a, pt)}) };
}

fn padEnd(a: Allocator, s: []const u8, width: usize) ![]const u8 {
    const n = jsLength(s);
    if (n >= width) return s;
    const out = try a.alloc(u8, s.len + width - n);
    @memcpy(out[0..s.len], s);
    @memset(out[s.len..], ' ');
    return out;
}

pub fn run(a: Allocator, out: *std.Io.Writer, argv: []const []const u8) !u8 {
    // the file: the first argument that is not an option and does not follow --rules
    var file_arg: ?[]const u8 = null;
    for (argv, 0..) |x, i| {
        if (std.mem.startsWith(u8, x, "--")) continue;
        if (i > 0 and std.mem.eql(u8, argv[i - 1], "--rules")) continue;
        file_arg = x;
        break;
    }
    const cwd = try std.fs.cwd().realpathAlloc(a, ".");
    const example = try std.fs.path.join(a, &.{ cwd, "doc", "design", "audit", "example.facts.json" });
    const file = file_arg orelse example;

    const schema = try std.json.parseFromSliceLeaky(Value, a, facts_schema_json, contract_mod.js_parse);
    const facts_raw = std.fs.cwd().readFileAlloc(a, file, 64 * 1024 * 1024) catch |e| {
        try out.print("zane: cannot read {s}: {s}\n", .{ file, @errorName(e) });
        return 2;
    };
    const facts = try std.json.parseFromSliceLeaky(Value, a, try core.wellFormed(a, facts_raw), contract_mod.js_parse);
    var problems: Problems = .empty;

    // what the audit may decide, and by what thresholds: decides.json is the one place
    const decides = try std.json.parseFromSliceLeaky(Value, a, decides_json, contract_mod.js_parse);
    var decide_rules: std.ArrayList([]const u8) = .empty;
    for (items(get(decides, "rules"))) |r| try decide_rules.append(a, try text(a, r));
    {
        const law = try std.json.parseFromSliceLeaky(Value, a, contract_mod.rules_json, contract_mod.js_parse);
        var numbers: std.ArrayList([]const u8) = .empty; // the law's rule numbers that are strings, as the Set compares them
        if (law == .object) {
            var it = law.object.iterator();
            while (it.next()) |e| {
                const k = e.key_ptr.*;
                if (k.len <= 3 or !std.mem.startsWith(u8, k, "set")) continue;
                var digits = true;
                for (k[3..]) |c| if (!std.ascii.isDigit(c)) {
                    digits = false;
                };
                if (!digits) continue;
                for (items(get(e.value_ptr.*, "rules"))) |r| if (strOf(get(r, "number"))) |n| try numbers.append(a, n);
            }
        }
        var named: std.ArrayList([]const u8) = .empty;
        for (items(get(decides, "decisions"))) |d| for (items(get(d, "rules"))) |r| {
            const t = try text(a, r);
            var seen = false;
            for (named.items) |x| if (std.mem.eql(u8, x, t)) {
                seen = true;
            };
            if (!seen) try named.append(a, t);
        };
        std.mem.sort([]const u8, named.items, {}, lessThan);
        const sorted_rules = try a.dupe([]const u8, decide_rules.items);
        std.mem.sort([]const u8, sorted_rules, {}, lessThan);
        const named_join = try std.mem.join(a, ",", named.items);
        if (!std.mem.eql(u8, named_join, try std.mem.join(a, ",", sorted_rules)))
            try problems.append(a, try std.fmt.allocPrint(a, "decides.json: \"rules\" ({s}) is not the union of its decisions ({s})", .{ try std.mem.join(a, ",", decide_rules.items), named_join }));
        for (decide_rules.items) |r| {
            var in_law = false;
            for (numbers.items) |n| if (std.mem.eql(u8, n, r)) {
                in_law = true;
            };
            if (!in_law) try problems.append(a, try std.fmt.allocPrint(a, "decides.json: rule {s} is not in the law", .{r}));
        }
        for (argv, 0..) |x, i| if (std.mem.eql(u8, x, "--rules")) {
            const list = if (i + 1 < argv.len) argv[i + 1] else "";
            var parts = std.mem.splitScalar(u8, list, ',');
            while (parts.next()) |r| {
                if (r.len == 0) continue;
                var ok = false;
                for (decide_rules.items) |d| if (std.mem.eql(u8, d, r)) {
                    ok = true;
                };
                if (!ok) try problems.append(a, try std.fmt.allocPrint(a, "rule {s} is not decidable from these facts: decides.json names only {s}", .{ r, try std.mem.join(a, ", ", decide_rules.items) }));
            }
            break;
        };
    }
    const th = get(decides, "thresholds");
    const t: Thresholds = .{
        .min_score = js.numOf(get(th, "min_ocr_score")) orelse std.math.nan(f64),
        .spread_limit = js.numOf(get(th, "spread_limit")) orelse std.math.nan(f64),
        .contrast_floor = js.numOf(get(th, "contrast_floor")) orelse std.math.nan(f64),
        .size_floor_pt = js.numOf(get(th, "size_floor_pt")) orelse std.math.nan(f64),
    };
    const labelOf = struct {
        fn f(al: Allocator, d: Value, id: []const u8) ![]const u8 {
            for (items(get(d, "decisions"))) |x| if (strOf(get(x, "id"))) |xid| if (std.mem.eql(u8, xid, id)) {
                var rs: std.ArrayList([]const u8) = .empty;
                for (items(get(x, "rules"))) |r| try rs.append(al, try text(al, r));
                return std.fmt.allocPrint(al, "{s}{s}", .{ if (rs.items.len == 1) "rule " else "rules ", try std.mem.join(al, ", ", rs.items) });
            };
            return "rules ";
        }
    }.f;

    try validate(a, facts, schema, "$", &problems);
    // 1.1 renamed the format from zui-audit-facts to zane-audit-facts and changed nothing else; a 1.0 file is read as it was
    if (strOf(get(facts, "format"))) |fmt| {
        const want: ?[]const u8 = if (std.mem.eql(u8, fmt, "zane-audit-facts")) "1.1" else if (std.mem.eql(u8, fmt, "zui-audit-facts")) "1.0" else null;
        if (want) |w| {
            const ver = get(facts, "version");
            if (ver == null or ver.? != .string or !std.mem.eql(u8, ver.?.string, w)) try problems.append(a, try std.fmt.allocPrint(a, "$.version: {s} is version {s}", .{ fmt, w }));
        }
    }

    // the arithmetic the schema cannot state
    const lines = items(get(facts, "lines"));
    if (problems.items.len == 0) {
        const cap = get(facts, "capture");
        const W = js.numOf(get(cap, "width_px")).?;
        const H = js.numOf(get(cap, "height_px")).?;
        const scale = js.numOf(get(cap, "scale")).?;
        var seen: std.ArrayList([]const u8) = .empty;
        for (lines) |l| {
            const id = strOf(get(l, "id")) orelse "undefined";
            for (seen.items) |x| if (std.mem.eql(u8, x, id)) try problems.append(a, try std.fmt.allocPrint(a, "{s}: id repeated", .{id}));
            try seen.append(a, id);
            const box = items(get(l, "box"));
            const x0 = js.numOf(box[0]).?;
            const y0 = js.numOf(box[1]).?;
            const x1 = js.numOf(box[2]).?;
            const y1 = js.numOf(box[3]).?;
            if (!(x1 > x0 and y1 > y0)) try problems.append(a, try std.fmt.allocPrint(a, "{s}: box is empty or reversed", .{id}));
            if (x1 > W or y1 > H) try problems.append(a, try std.fmt.allocPrint(a, "{s}: box leaves the {s}x{s} image", .{ id, try js.num(a, W), try js.num(a, H) }));
            const lh = js.numOf(get(l, "line_height_px")).?;
            if (lh != y1 - y0) try problems.append(a, try std.fmt.allocPrint(a, "{s}: line_height_px {s} is not y1 - y0 = {s}", .{ id, try js.num(a, lh), try js.num(a, y1 - y0) }));
            const pt = round2(lh * 72 / (96 * scale));
            const lpt = js.numOf(get(l, "line_height_pt")).?;
            if (@abs(pt - lpt) > 0.01) try problems.append(a, try std.fmt.allocPrint(a, "{s}: line_height_pt {s} is not {s} at scale {s}", .{ id, try js.num(a, lpt), try js.num(a, pt), try js.num(a, scale) }));
            const fgv = get(l, "fg_luminance");
            const bgv = get(l, "bg_luminance");
            const crv = get(l, "contrast_ratio");
            const lum_null = (fgv != null and fgv.? == .null) or (bgv != null and bgv.? == .null);
            const cr_null = crv != null and crv.? == .null;
            if (lum_null != cr_null) {
                try problems.append(a, try std.fmt.allocPrint(a, "{s}: contrast_ratio must be null exactly when a luminance is", .{id}));
            } else if (!cr_null) {
                const want = rel(js.numOf(fgv).?, js.numOf(bgv).?);
                const cr = js.numOf(crv).?;
                if (@abs(want - cr) > 0.01) try problems.append(a, try std.fmt.allocPrint(a, "{s}: contrast_ratio {s} is not {s}", .{ id, try js.num(a, cr), try js.num(a, want) }));
            }
        }
    }

    // the two decisions: fail, pass, not_decided; a size is never a pass
    if (problems.items.len == 0) {
        try out.print("{d} line{s} found; text the OCR did not find is not audited\n\n", .{ lines.len, if (lines.len == 1) "" else "s" });
        const kind = strOf(get(get(facts, "capture"), "box_kind"));
        const Row = struct { id: []const u8, contrast: []const u8, size: []const u8 };
        var rows: std.ArrayList(Row) = .empty;
        for (lines) |l| {
            const c = try contrastOf(a, l, t);
            const s = try sizeOf(a, l, kind, t);
            const id = strOf(get(l, "id")) orelse "undefined";
            try rows.append(a, .{ .id = id, .contrast = c.verdict, .size = s.verdict });
            const cl = try padEnd(a, try std.fmt.allocPrint(a, "contrast ({s})", .{try labelOf(a, decides, "contrast")}), 26);
            const sl = try padEnd(a, try std.fmt.allocPrint(a, "size floor ({s})", .{try labelOf(a, decides, "size")}), 26);
            try out.print("{s} \"{s}\"\n  {s}{s} {s}\n  {s}{s} {s}\n", .{ id, strOf(get(l, "text")) orelse "undefined", cl, try padEnd(a, c.verdict, 11), c.because, sl, try padEnd(a, s.verdict, 11), s.because });
        }
        try out.print("\nNOT AUDITED: every rule other than {s} (rule 105 only for its contrast half). A screenshot does not decide them, and \"not audited\" is not \"passed\".\n", .{try std.mem.join(a, ", ", decide_rules.items)});
        try out.writeAll("PROJECTED, NOT VERIFIED BY A PERSON (CENTRAL-PERCEPTGATE-01): nobody looked at the screenshot these facts describe.\n");
        // the example's verdicts are the ones the document states
        const resolved = try std.fs.path.resolve(a, &.{ cwd, file });
        if (std.mem.eql(u8, resolved, example)) {
            const Want = struct { id: []const u8, c: []const u8, s: []const u8 };
            const wants = [_]Want{ .{ .id = "L1", .c = "fail", .s = "fail" }, .{ .id = "L2", .c = "pass", .s = "not_decided" }, .{ .id = "L3", .c = "not_decided", .s = "not_decided" } };
            for (rows.items) |r| for (wants) |w| if (std.mem.eql(u8, w.id, r.id)) {
                if (!std.mem.eql(u8, w.c, r.contrast) or !std.mem.eql(u8, w.s, r.size))
                    try problems.append(a, try std.fmt.allocPrint(a, "{s}: the document states {s},{s}, the decision gave {s},{s}", .{ r.id, w.c, w.s, r.contrast, r.size }));
            };
        }
    }
    if (problems.items.len > 0) {
        try out.writeAll("\nPROBLEMS\n");
        for (problems.items) |p| try out.print("  {s}\n", .{p});
        return 1;
    }
    try out.print("\n{s}: valid; {d} line(s)\n", .{ file, lines.len });
    return 0;
}
