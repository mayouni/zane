//! js.zig: what JavaScript does to a value when it prints one, so the binary's output can equal the JavaScript's byte
//! for byte: a number as Number.prototype.toString writes it, and a JSON value as JSON.stringify(v, null, 2) writes it.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Value = std.json.Value;
const contract = @import("contract.zig");

/// A JSON number as a double, as JSON.parse reads every number; null for anything that is not a number.
pub fn numOf(v: ?Value) ?f64 {
    const x = v orelse return null;
    return switch (x) {
        .integer => |n| @floatFromInt(n),
        .float => |f| f,
        .number_string => |s| std.fmt.parseFloat(f64, s) catch null,
        else => null,
    };
}

/// A message put together at run time: each {s} or {d} in `f` takes the next of `args`, in order, and every other
/// character is kept, braces included. One function serves every message of the site commands, where std.fmt would
/// compile one formatter per format string; S5 measured that cost at most of its 175 KB against a 4 MB budget with
/// 197 KB left (doc/design/BINARY.md section 7).
pub fn say(a: Allocator, f: []const u8, args: []const []const u8) Allocator.Error![]const u8 {
    var out: std.ArrayList(u8) = .empty;
    var i: usize = 0;
    var k: usize = 0;
    while (i < f.len) {
        if (i + 2 < f.len and f[i] == '{' and (f[i + 1] == 's' or f[i + 1] == 'd') and f[i + 2] == '}' and k < args.len) {
            try out.appendSlice(a, args[k]);
            k += 1;
            i += 3;
        } else {
            try out.append(a, f[i]);
            i += 1;
        }
    }
    return out.toOwnedSlice(a);
}

/// A whole number in decimal.
pub fn dec(a: Allocator, n: i64) Allocator.Error![]const u8 {
    return std.fmt.allocPrint(a, "{d}", .{n});
}

/// fmt(a, "…{s}…{d}…", .{ text, count }): the arguments as strings (an integer in decimal), then `say`. The code made
/// for each shape of arguments is the array of them and nothing more; the format string is not a comptime parameter,
/// so two messages with the same shape share it.
pub fn fmt(a: Allocator, f: []const u8, args: anytype) Allocator.Error![]const u8 {
    const fields = @typeInfo(@TypeOf(args)).@"struct".fields;
    var parts: [fields.len][]const u8 = undefined;
    inline for (fields, 0..) |fld, i| {
        const v = @field(args, fld.name);
        const T = @TypeOf(v);
        parts[i] = if (comptime (@typeInfo(T) == .int or @typeInfo(T) == .comptime_int)) try dec(a, @intCast(v)) else v;
    }
    return say(a, f, &parts);
}

/// o[k] for a JSON object; null (JavaScript's undefined) for anything else or a key it lacks.
pub fn get(v: ?Value, k: []const u8) ?Value {
    const x = v orelse return null;
    if (x != .object) return null;
    return x.object.get(k);
}

/// The items of a JSON array; none for anything else, as `(x || [])` gives for a missing list.
pub fn items(v: ?Value) []const Value {
    const x = v orelse return &.{};
    return if (x == .array) x.array.items else &.{};
}

/// The text of a JSON string; null for anything else.
pub fn text(v: ?Value) ?[]const u8 {
    const x = v orelse return null;
    return if (x == .string) x.string else null;
}

/// Whether a JSON array holds the string s: arr.includes(s).
pub fn includes(v: ?Value, s: []const u8) bool {
    for (items(v)) |x| if (x == .string and std.mem.eql(u8, x.string, s)) return true;
    return false;
}

/// String(v), as a template literal writes a value: null for JavaScript's undefined writes "undefined".
pub fn string(a: Allocator, v: ?Value) Allocator.Error![]const u8 {
    const x = v orelse return "undefined";
    return switch (x) {
        .null => "null",
        .bool => |b| if (b) "true" else "false",
        .string => |s| s,
        .integer => |n| std.fmt.allocPrint(a, "{d}", .{n}),
        .float, .number_string => num(a, numOf(x).?),
        .array => |arr| blk: {
            var out: std.ArrayList(u8) = .empty;
            for (arr.items, 0..) |e, i| {
                if (i > 0) try out.append(a, ',');
                if (e != .null) try out.appendSlice(a, try string(a, e));
            }
            break :blk out.toOwnedSlice(a);
        },
        .object => "[object Object]",
    };
}

/// Number.prototype.toString(): integers without a point, the shortest digits that read back to the same double,
/// and exponent form below 1e-6 and from 1e21.
pub fn num(a: Allocator, x: f64) ![]const u8 {
    if (std.math.isNan(x)) return "NaN";
    if (std.math.isInf(x)) return if (x > 0) "Infinity" else "-Infinity";
    if (x == 0) return "0";
    // the shortest digits that read back to x, from Zig's scientific form: d.ddde±N
    const sci = try std.fmt.allocPrint(a, "{e}", .{@abs(x)});
    const e_at = std.mem.indexOfScalar(u8, sci, 'e') orelse return sci;
    var digits: std.ArrayList(u8) = .empty;
    for (sci[0..e_at]) |c| if (c != '.') try digits.append(a, c);
    while (digits.items.len > 1 and digits.items[digits.items.len - 1] == '0') _ = digits.pop();
    const k: i64 = @intCast(digits.items.len);
    const n: i64 = (std.fmt.parseInt(i64, sci[e_at + 1 ..], 10) catch return sci) + 1;
    const d = digits.items;
    var out: std.ArrayList(u8) = .empty;
    if (x < 0) try out.append(a, '-');
    // Number::toString, ECMA-262 section 6.1.6.1.20
    if (k <= n and n <= 21) {
        try out.appendSlice(a, d);
        try out.appendNTimes(a, '0', @intCast(n - k));
    } else if (0 < n and n <= 21) {
        try out.appendSlice(a, d[0..@intCast(n)]);
        try out.append(a, '.');
        try out.appendSlice(a, d[@intCast(n)..]);
    } else if (-6 < n and n <= 0) {
        try out.appendSlice(a, "0.");
        try out.appendNTimes(a, '0', @intCast(-n));
        try out.appendSlice(a, d);
    } else {
        try out.append(a, d[0]);
        if (k > 1) {
            try out.append(a, '.');
            try out.appendSlice(a, d[1..]);
        }
        try out.print(a, "e{s}{d}", .{ if (n - 1 >= 0) "+" else "-", @abs(n - 1) });
    }
    return out.items;
}

/// JSON.stringify(v, null, 2): two spaces a level, "key": value, empty containers as {} and [].
pub fn stringifyPretty(a: Allocator, w: *std.Io.Writer, v: Value, depth: usize) !void {
    switch (v) {
        .null => try w.writeAll("null"),
        .bool => |b| try w.writeAll(if (b) "true" else "false"),
        .integer => |n| try w.print("{d}", .{n}),
        .float => |f| try w.writeAll(try num(a, f)),
        .number_string => |s| try w.writeAll(try num(a, std.fmt.parseFloat(f64, s) catch 0)),
        .string => |s| try contract.writeJsonString(w, s),
        .array => |arr| {
            if (arr.items.len == 0) return w.writeAll("[]");
            try w.writeAll("[\n");
            for (arr.items, 0..) |x, i| {
                try w.splatByteAll(' ', 2 * (depth + 1));
                try stringifyPretty(a, w, x, depth + 1);
                try w.writeAll(if (i + 1 < arr.items.len) ",\n" else "\n");
            }
            try w.splatByteAll(' ', 2 * depth);
            try w.writeByte(']');
        },
        .object => |o| {
            if (o.count() == 0) return w.writeAll("{}");
            try w.writeAll("{\n");
            var it = o.iterator();
            var i: usize = 0;
            while (it.next()) |e| : (i += 1) {
                try w.splatByteAll(' ', 2 * (depth + 1));
                try contract.writeJsonString(w, e.key_ptr.*);
                try w.writeAll(": ");
                try stringifyPretty(a, w, e.value_ptr.*, depth + 1);
                try w.writeAll(if (i + 1 < o.count()) ",\n" else "\n");
            }
            try w.splatByteAll(' ', 2 * depth);
            try w.writeByte('}');
        },
    }
}

test "numbers as JavaScript prints them" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const a = arena.allocator();
    const cases = [_]struct { f64, []const u8 }{
        .{ 2.85, "2.85" },  .{ 12.63, "12.63" },   .{ 0.1753, "0.1753" },     .{ 9, "9" },                       .{ 18, "18" },
        .{ 4.5, "4.5" },    .{ 0.25, "0.25" },     .{ 0.5, "0.5" },           .{ -3, "-3" },                     .{ 1.0 / 3.0, "0.3333333333333333" },
        .{ 1e21, "1e+21" }, .{ 1.5e-7, "1.5e-7" }, .{ 0.000001, "0.000001" }, .{ 123456789012, "123456789012" }, .{ 1e-7, "1e-7" },
        .{ 120, "120" },    .{ 0.05, "0.05" },
    };
    for (cases) |c| try std.testing.expectEqualStrings(c[1], try num(a, c[0]));
    // a sum taken at run time, as JavaScript takes it (at compile time Zig would add exactly and get 0.3)
    var tenth: f64 = 0.1;
    _ = &tenth;
    try std.testing.expectEqualStrings("0.30000000000000004", try num(a, tenth + 0.2));
}
