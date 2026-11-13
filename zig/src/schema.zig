//! schema.zig: the subset of JSON Schema the family envelope (C2, doc/diagnostic-contract.schema.json) uses,
//! interpreted rather than restated, as tools/zayn/envelope.js interprets it: $ref "#", not.type, enum, type
//! (object, array, string, integer), required, properties, additionalProperties (false, or a subschema),
//! items, minLength, minimum and pattern; and the full-depth scan for the scalars that do not survive the
//! family's JSON encoder (CENTRAL-JSONSCALAR-01). The problem texts are envelope.js's, word for word.
//!
//! A pattern is matched by a small backtracking matcher for what the schema's patterns use: ^ $ ( | ) [ ] with
//! ranges, * + ?, escapes, and literal characters. Anything else in a pattern is reported, never ignored.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const contract = @import("contract.zig");

// ---- the pattern matcher -----------------------------------------------------------------------------------

const Node = union(enum) {
    lit: u8,
    any,
    class: Class,
    group: []const []const Piece,
    bol,
    eol,
};
const Class = struct { ranges: []const [2]u8, negated: bool };
const Piece = struct { node: Node, min: u32 = 1, max: u32 = 1 };
const inf = std.math.maxInt(u32);

const PatternError = error{ UnsupportedPattern, OutOfMemory };

const PatternParser = struct {
    a: Allocator,
    p: []const u8,
    i: usize = 0,

    fn alternatives(self: *PatternParser) PatternError![]const []const Piece {
        var alts: std.ArrayList([]const Piece) = .empty;
        while (true) {
            try alts.append(self.a, try self.sequence());
            if (self.i < self.p.len and self.p[self.i] == '|') {
                self.i += 1;
                continue;
            }
            return alts.toOwnedSlice(self.a);
        }
    }

    fn sequence(self: *PatternParser) PatternError![]const Piece {
        var seq: std.ArrayList(Piece) = .empty;
        while (self.i < self.p.len and self.p[self.i] != '|' and self.p[self.i] != ')') {
            const c = self.p[self.i];
            self.i += 1;
            const node: Node = switch (c) {
                '^' => .bol,
                '$' => .eol,
                '.' => .any,
                '(' => blk: {
                    const g = try self.alternatives();
                    if (self.i >= self.p.len or self.p[self.i] != ')') return error.UnsupportedPattern;
                    self.i += 1;
                    break :blk .{ .group = g };
                },
                '[' => .{ .class = try self.class() },
                '\\' => blk: {
                    if (self.i >= self.p.len) return error.UnsupportedPattern;
                    const e = self.p[self.i];
                    self.i += 1;
                    if (std.ascii.isAlphanumeric(e)) return error.UnsupportedPattern; // \d, \w, \s ... are not used by the schema
                    break :blk .{ .lit = e };
                },
                '{', '}', ']', '*', '+', '?' => return error.UnsupportedPattern,
                else => .{ .lit = c },
            };
            var piece: Piece = .{ .node = node };
            if (self.i < self.p.len) switch (self.p[self.i]) {
                '*' => {
                    piece.min = 0;
                    piece.max = inf;
                    self.i += 1;
                },
                '+' => {
                    piece.max = inf;
                    self.i += 1;
                },
                '?' => {
                    piece.min = 0;
                    self.i += 1;
                },
                '{' => {
                    // {n}, {n,} or {n,m}
                    self.i += 1;
                    const lo = try self.number();
                    var hi = lo;
                    if (self.i < self.p.len and self.p[self.i] == ',') {
                        self.i += 1;
                        hi = if (self.i < self.p.len and self.p[self.i] == '}') inf else try self.number();
                    }
                    if (self.i >= self.p.len or self.p[self.i] != '}' or hi < lo) return error.UnsupportedPattern;
                    self.i += 1;
                    piece.min = lo;
                    piece.max = hi;
                },
                else => {},
            };
            if ((node == .bol or node == .eol) and (piece.min != 1 or piece.max != 1)) return error.UnsupportedPattern;
            try seq.append(self.a, piece);
        }
        return seq.toOwnedSlice(self.a);
    }

    fn number(self: *PatternParser) PatternError!u32 {
        const start = self.i;
        while (self.i < self.p.len and std.ascii.isDigit(self.p[self.i])) self.i += 1;
        if (self.i == start) return error.UnsupportedPattern;
        return std.fmt.parseInt(u32, self.p[start..self.i], 10) catch error.UnsupportedPattern;
    }

    fn class(self: *PatternParser) PatternError!Class {
        var ranges: std.ArrayList([2]u8) = .empty;
        var negated = false;
        if (self.i < self.p.len and self.p[self.i] == '^') {
            negated = true;
            self.i += 1;
        }
        var first = true;
        while (self.i < self.p.len and (self.p[self.i] != ']' or first)) {
            first = false;
            var lo = self.p[self.i];
            self.i += 1;
            if (lo == '\\') {
                if (self.i >= self.p.len) return error.UnsupportedPattern;
                lo = self.p[self.i];
                if (std.ascii.isAlphanumeric(lo)) return error.UnsupportedPattern;
                self.i += 1;
            }
            var hi = lo;
            if (self.i + 1 < self.p.len and self.p[self.i] == '-' and self.p[self.i + 1] != ']') {
                hi = self.p[self.i + 1];
                self.i += 2;
            }
            try ranges.append(self.a, .{ lo, hi });
        }
        if (self.i >= self.p.len) return error.UnsupportedPattern;
        self.i += 1; // ]
        return .{ .ranges = try ranges.toOwnedSlice(self.a), .negated = negated };
    }
};

fn one(node: Node, c: u8) bool {
    return switch (node) {
        .lit => |l| l == c,
        .any => c != '\n' and c != '\r',
        .class => |k| blk: {
            var in = false;
            for (k.ranges) |r| if (c >= r[0] and c <= r[1]) {
                in = true;
            };
            break :blk in != k.negated;
        },
        else => false,
    };
}

fn concat(a: Allocator, parts: []const []const Piece) ![]const Piece {
    var out: std.ArrayList(Piece) = .empty;
    for (parts) |p| try out.appendSlice(a, p);
    return out.toOwnedSlice(a);
}

/// Does the sequence match s from pos onward (the rest of s need not be consumed)?
fn matchHere(a: Allocator, pieces: []const Piece, s: []const u8, pos: usize) Allocator.Error!bool {
    if (pieces.len == 0) return true;
    const p = pieces[0];
    const rest = pieces[1..];
    switch (p.node) {
        .bol => return pos == 0 and try matchHere(a, rest, s, pos),
        .eol => return pos == s.len and try matchHere(a, rest, s, pos),
        else => {},
    }
    if (p.max > 0) {
        const next: Piece = .{ .node = p.node, .min = if (p.min > 0) p.min - 1 else 0, .max = if (p.max == inf) inf else p.max - 1 };
        const again: []const Piece = if (next.max == 0) rest else try concat(a, &.{ &.{next}, rest });
        switch (p.node) {
            .group => |alts| for (alts) |alt| {
                if (alt.len == 0) continue; // an empty alternative cannot advance a repetition
                if (try matchHere(a, try concat(a, &.{ alt, again }), s, pos)) return true;
            },
            else => if (pos < s.len and one(p.node, s[pos]) and try matchHere(a, again, s, pos + 1)) return true,
        }
    }
    if (p.min == 0) return matchHere(a, rest, s, pos);
    return false;
}

/// JavaScript's new RegExp(pattern).test(s), for the patterns this matcher reads.
pub fn regexTest(a: Allocator, pattern: []const u8, s: []const u8) PatternError!bool {
    var pp: PatternParser = .{ .a = a, .p = pattern };
    const alts = try pp.alternatives();
    if (pp.i != pattern.len) return error.UnsupportedPattern;
    const top = [_]Piece{.{ .node = .{ .group = alts } }};
    var start: usize = 0;
    while (start <= s.len) : (start += 1) if (try matchHere(a, &top, s, start)) return true;
    return false;
}

// ---- the validator ---------------------------------------------------------------------------------------

/// JSON.stringify of a value, for the texts of the problems (strings are escaped as contract.zig does).
fn stringify(a: Allocator, v: Value) ![]const u8 {
    var buf: std.Io.Writer.Allocating = .init(a);
    try writeValue(&buf.writer, v);
    return buf.toOwnedSlice();
}
fn writeValue(w: *std.Io.Writer, v: Value) !void {
    switch (v) {
        .null => try w.writeAll("null"),
        .bool => |b| try w.writeAll(if (b) "true" else "false"),
        .integer => |n| try w.print("{d}", .{n}),
        .float => |f| try w.print("{d}", .{f}),
        .number_string => |s| try w.writeAll(s),
        .string => |s| try contract.writeJsonString(w, s),
        .array => |arr| {
            try w.writeByte('[');
            for (arr.items, 0..) |x, i| {
                if (i > 0) try w.writeByte(',');
                try writeValue(w, x);
            }
            try w.writeByte(']');
        },
        .object => |o| {
            try w.writeByte('{');
            var it = o.iterator();
            var i: usize = 0;
            while (it.next()) |e| : (i += 1) {
                if (i > 0) try w.writeByte(',');
                try contract.writeJsonString(w, e.key_ptr.*);
                try w.writeByte(':');
                try writeValue(w, e.value_ptr.*);
            }
            try w.writeByte('}');
        },
    }
}

/// JSON's own type names: null is a type, an array is not an object, an integer is a whole number.
fn jsonTypeOf(v: Value) []const u8 {
    return switch (v) {
        .null => "null",
        .bool => "boolean",
        .integer => "integer",
        .float => |f| if (@floor(f) == f) "integer" else "number",
        .number_string => "number",
        .string => "string",
        .array => "array",
        .object => "object",
    };
}

fn typeNames(a: Allocator, t: Value) ![]const []const u8 {
    var out: std.ArrayList([]const u8) = .empty;
    switch (t) {
        .string => |s| try out.append(a, s),
        .array => |arr| for (arr.items) |x| if (x == .string) try out.append(a, x.string),
        else => {},
    }
    return out.toOwnedSlice(a);
}

fn isOfType(a: Allocator, v: Value, t: Value) !bool {
    const got = jsonTypeOf(v);
    for (try typeNames(a, t)) |want| {
        if (std.mem.eql(u8, want, got)) return true;
        if (std.mem.eql(u8, want, "number") and std.mem.eql(u8, got, "integer")) return true;
    }
    return false;
}

/// JavaScript's string length: UTF-16 code units of well-formed UTF-8.
fn jsLength(s: []const u8) usize {
    var n: usize = 0;
    for (s) |c| {
        if (c & 0xC0 != 0x80) n += 1;
        if (c >= 0xF0) n += 1;
    }
    return n;
}

fn get(o: Value, k: []const u8) ?Value {
    if (o != .object) return null;
    return o.object.get(k);
}

pub const Problems = std.ArrayList([]const u8);

fn walk(a: Allocator, v: Value, s: Value, at: []const u8, out: *Problems, root: Value) !void {
    if (get(s, "$ref")) |r| if (r == .string and std.mem.eql(u8, r.string, "#")) {
        return walk(a, v, root, at, out, root);
    };
    if (get(s, "not")) |n| if (get(n, "type")) |t| {
        if (try isOfType(a, v, t)) {
            const names = try std.mem.join(a, " or ", try typeNames(a, t));
            try out.append(a, try std.fmt.allocPrint(a, "{s}: {s} is {s}, which the contract forbids here -- the family's JSON encoder returns true, false and null as strings on a round trip", .{ at, try stringify(a, v), names }));
        }
        return;
    };
    if (get(s, "enum")) |e| {
        var found = false;
        if (e == .array) for (e.array.items) |x| {
            if (x == .string and v == .string and std.mem.eql(u8, x.string, v.string)) found = true;
            if (x == .integer and v == .integer and x.integer == v.integer) found = true;
        };
        if (!found) try out.append(a, try std.fmt.allocPrint(a, "{s}: {s} is not one of {s}", .{ at, try stringify(a, v), try stringify(a, e) }));
        return;
    }
    const t = get(s, "type") orelse return;
    if (t != .string) return;
    const ty = t.string;
    if (std.mem.eql(u8, ty, "object")) {
        if (v != .object) return out.append(a, try std.fmt.allocPrint(a, "{s}: expected an object", .{at}));
        if (get(s, "required")) |req| if (req == .array) for (req.array.items) |k| if (k == .string and v.object.get(k.string) == null) {
            try out.append(a, try std.fmt.allocPrint(a, "{s}: missing required field \"{s}\"", .{ at, k.string }));
        };
        const props = get(s, "properties");
        if (props) |ps| if (ps == .object) {
            var it = ps.object.iterator();
            while (it.next()) |e| if (v.object.get(e.key_ptr.*)) |sub| {
                try walk(a, sub, e.value_ptr.*, try std.fmt.allocPrint(a, "{s}.{s}", .{ at, e.key_ptr.* }), out, root);
            };
        };
        const named = struct {
            fn has(p: ?Value, k: []const u8) bool {
                const x = p orelse return false;
                return x == .object and x.object.get(k) != null;
            }
        };
        if (get(s, "additionalProperties")) |ap| {
            if (ap == .bool and !ap.bool) {
                var it = v.object.iterator();
                while (it.next()) |e| if (!named.has(props, e.key_ptr.*)) {
                    try out.append(a, try std.fmt.allocPrint(a, "{s}: unexpected field \"{s}\"", .{ at, e.key_ptr.* }));
                };
            } else if (ap == .object) {
                var it = v.object.iterator();
                while (it.next()) |e| if (!named.has(props, e.key_ptr.*)) {
                    try walk(a, e.value_ptr.*, ap, try std.fmt.allocPrint(a, "{s}.{s}", .{ at, e.key_ptr.* }), out, root);
                };
            }
        }
    } else if (std.mem.eql(u8, ty, "array")) {
        if (v != .array) return out.append(a, try std.fmt.allocPrint(a, "{s}: expected an array", .{at}));
        if (get(s, "items")) |items| for (v.array.items, 0..) |x, i| {
            try walk(a, x, items, try std.fmt.allocPrint(a, "{s}[{d}]", .{ at, i }), out, root);
        };
    } else if (std.mem.eql(u8, ty, "string")) {
        if (v != .string) return out.append(a, try std.fmt.allocPrint(a, "{s}: expected a string", .{at}));
        if (get(s, "minLength")) |ml| if (ml == .integer and ml.integer != 0 and jsLength(v.string) < ml.integer) {
            try out.append(a, try std.fmt.allocPrint(a, "{s}: shorter than minLength {d}", .{ at, ml.integer }));
        };
        if (get(s, "pattern")) |pat| if (pat == .string) {
            const ok = regexTest(a, pat.string, v.string) catch |e| switch (e) {
                error.UnsupportedPattern => {
                    try out.append(a, try std.fmt.allocPrint(a, "{s}: the pattern {s} uses syntax this validator does not read", .{ at, pat.string }));
                    return;
                },
                else => return e,
            };
            if (!ok) try out.append(a, try std.fmt.allocPrint(a, "{s}: \"{s}\" does not match {s}", .{ at, v.string, pat.string }));
        };
    } else if (std.mem.eql(u8, ty, "integer")) {
        const whole = v == .integer or (v == .float and @floor(v.float) == v.float);
        if (!whole) return out.append(a, try std.fmt.allocPrint(a, "{s}: expected an integer", .{at}));
        if (get(s, "minimum")) |mn| if (mn == .integer and v == .integer and v.integer < mn.integer) {
            try out.append(a, try std.fmt.allocPrint(a, "{s}: {d} is below minimum {d}", .{ at, v.integer, mn.integer }));
        };
    }
}

/// CENTRAL-JSONSCALAR-01, at full depth: true, false and null do not survive the family's encoder.
fn scalarsThatDoNotSurvive(a: Allocator, v: Value, at: []const u8, out: *Problems) !void {
    switch (v) {
        .null, .bool => {
            const text = try stringify(a, v);
            try out.append(a, try std.fmt.allocPrint(a, "{s}: {s} does not survive a round trip through the family's JSON encoder -- it returns as the string \"{s}\". Contract v1.2.0 §2.8", .{ at, text, text }));
        },
        .array => |arr| for (arr.items, 0..) |x, i| try scalarsThatDoNotSurvive(a, x, try std.fmt.allocPrint(a, "{s}[{d}]", .{ at, i }), out),
        .object => |o| {
            var it = o.iterator();
            while (it.next()) |e| try scalarsThatDoNotSurvive(a, e.value_ptr.*, try std.fmt.allocPrint(a, "{s}.{s}", .{ at, e.key_ptr.* }), out);
        },
        else => {},
    }
}

/// envelope.js validate(): one diagnostic against the shape.
pub fn validate(a: Allocator, envelope: Value, shape: Value, where: []const u8, out: *Problems) !void {
    try walk(a, envelope, shape, where, out, shape);
    try scalarsThatDoNotSurvive(a, envelope, where, out);
}

/// envelope.js validateReport(): the object that carries a run's diagnostics, against definitions.report.
pub fn validateReport(a: Allocator, report: Value, shape: Value, where: []const u8, out: *Problems) !void {
    const def = if (get(shape, "definitions")) |d| get(d, "report") else null;
    if (def == null) return out.append(a, "report shape: the pinned contract predates v1.1 and specifies no outer shape");
    try walk(a, report, def.?, where, out, shape);
    try scalarsThatDoNotSurvive(a, report, where, out);
}

test "the schema's own patterns" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const a = arena.allocator();
    const code = "^[A-Z][A-Z0-9]*([_-][A-Z0-9]+)*$";
    try std.testing.expect(try regexTest(a, code, "MISSING_UNDO"));
    try std.testing.expect(try regexTest(a, code, "ZUI-W001"));
    try std.testing.expect(!try regexTest(a, code, "missing_undo"));
    try std.testing.expect(!try regexTest(a, code, "A__B"));
    try std.testing.expect(!try regexTest(a, code, "A_"));
    const cite = "^(rule|article|right|pattern):[A-Za-z0-9_.-]+$";
    try std.testing.expect(try regexTest(a, cite, "rule:51"));
    try std.testing.expect(try regexTest(a, cite, "right:leave"));
    try std.testing.expect(!try regexTest(a, cite, "rules:51"));
    try std.testing.expect(!try regexTest(a, cite, "rule:"));
    try std.testing.expect(!try regexTest(a, cite, "rule:a b"));
    const lang = "^[a-z][a-z0-9_]*$";
    try std.testing.expect(try regexTest(a, lang, "zayn"));
    try std.testing.expect(!try regexTest(a, lang, "Zayn"));
    try std.testing.expect(try regexTest(a, "b", "abc"));
    try std.testing.expectError(error.UnsupportedPattern, regexTest(a, "\\d+", "1"));
    // the facts schema's patterns
    const sha = "^[0-9a-f]{64}$";
    try std.testing.expect(try regexTest(a, sha, "bbf131a966299b3adb1900625d7957118556e7575e22de748970cf55208c9780"));
    try std.testing.expect(!try regexTest(a, sha, "bbf131a966299b3adb1900625d7957118556e7575e22de748970cf55208c978"));
    try std.testing.expect(!try regexTest(a, sha, "Bbf131a966299b3adb1900625d7957118556e7575e22de748970cf55208c9780"));
    try std.testing.expect(try regexTest(a, "^L[0-9]+$", "L12"));
    try std.testing.expect(!try regexTest(a, "^L[0-9]+$", "L"));
    try std.testing.expect(try regexTest(a, "^a{2,}$", "aaaa"));
    try std.testing.expect(!try regexTest(a, "^a{2,3}$", "aaaa"));
}
