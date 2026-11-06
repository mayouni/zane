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
        .{ 2.85, "2.85" },    .{ 12.63, "12.63" }, .{ 0.1753, "0.1753" }, .{ 9, "9" },           .{ 18, "18" },
        .{ 4.5, "4.5" },      .{ 0.25, "0.25" },   .{ 0.5, "0.5" },       .{ -3, "-3" },         .{ 1.0 / 3.0, "0.3333333333333333" },
        .{ 1e21, "1e+21" },   .{ 1.5e-7, "1.5e-7" }, .{ 0.000001, "0.000001" }, .{ 123456789012, "123456789012" },
        .{ 1e-7, "1e-7" },    .{ 120, "120" },     .{ 0.05, "0.05" },
    };
    for (cases) |c| try std.testing.expectEqualStrings(c[1], try num(a, c[0]));
    // a sum taken at run time, as JavaScript takes it (at compile time Zig would add exactly and get 0.3)
    var tenth: f64 = 0.1;
    _ = &tenth;
    try std.testing.expectEqualStrings("0.30000000000000004", try num(a, tenth + 0.2));
}
