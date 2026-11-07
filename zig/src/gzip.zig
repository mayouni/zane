//! gzip.zig: gzip (RFC 1952) around deflate (RFC 1951), written here because Zig 0.15.2's std cannot deflate: the
//! tokenizer of std.compress.flate.Compress is `@panic("TODO")`, and its Token and BlockWriter are private. Inflating is
//! std's (std.compress.flate.Decompress, complete in 0.15.2), so every stream this file writes is read back by code it
//! does not share, and the build stops if a single byte differs (sitepack.zig).
//!
//! The encoder: LZ77 over a 32 KB window with hash chains of three bytes and one step of lazy matching, then one deflate
//! block with the FIXED Huffman codes of RFC 1951 section 3.2.6. Dynamic Huffman codes would save some more; the fixed
//! codes keep this short enough to read in one sitting.
//!
//! Used at build time, to store the site's text files compressed in the binary (BINARY.md section 7), and at run time by
//! `zane serve`, which inflates a stored file for a client that does not accept gzip.

const std = @import("std");
const Allocator = std.mem.Allocator;

const window = 32768;
const min_match = 3;
const max_match = 258;
const max_chain = 128;
const hash_bits = 15;

const BitWriter = struct {
    a: Allocator,
    out: *std.ArrayList(u8),
    acc: u64 = 0,
    n: u8 = 0,

    fn bits(w: *BitWriter, value: u32, count: u8) Allocator.Error!void {
        w.acc |= @as(u64, value) << @intCast(w.n);
        w.n += count;
        while (w.n >= 8) {
            try w.out.append(w.a, @truncate(w.acc));
            w.acc >>= 8;
            w.n -= 8;
        }
    }
    /// A Huffman code goes out from its most significant bit (RFC 1951 3.1.1).
    fn code(w: *BitWriter, c: u16, len: u8) Allocator.Error!void {
        try w.bits(@as(u32, @bitReverse(c)) >> @intCast(16 - len), len);
    }
    fn flush(w: *BitWriter) Allocator.Error!void {
        if (w.n > 0) try w.out.append(w.a, @truncate(w.acc));
        w.acc = 0;
        w.n = 0;
    }
};

/// The fixed literal/length code of a symbol, 0 to 287 (RFC 1951 3.2.6).
fn literal(w: *BitWriter, sym: u16) Allocator.Error!void {
    if (sym <= 143) return w.code(0x30 + sym, 8);
    if (sym <= 255) return w.code(0x190 + (sym - 144), 9);
    if (sym <= 279) return w.code(sym - 256, 7);
    return w.code(0xC0 + (sym - 280), 8);
}

const len_base = [29]u16{ 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258 };
const len_extra = [29]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 };
const dist_base = [30]u16{ 1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577 };
const dist_extra = [30]u8{ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 };

fn match(w: *BitWriter, len: usize, dist: usize) Allocator.Error!void {
    var i: usize = len_base.len - 1;
    while (len_base[i] > len) i -= 1;
    try literal(w, @intCast(257 + i));
    try w.bits(@intCast(len - len_base[i]), len_extra[i]);
    var j: usize = dist_base.len - 1;
    while (dist_base[j] > dist) j -= 1;
    try w.code(@intCast(j), 5);
    try w.bits(@intCast(dist - dist_base[j]), dist_extra[j]);
}

const Matcher = struct {
    d: []const u8,
    head: []i32,
    prev: []i32,

    fn hash(m: *const Matcher, i: usize) usize {
        const v = @as(u32, m.d[i]) | @as(u32, m.d[i + 1]) << 8 | @as(u32, m.d[i + 2]) << 16;
        return (v *% 2654435761) >> (32 - hash_bits);
    }
    fn insert(m: *Matcher, i: usize) void {
        if (i + min_match > m.d.len) return;
        const h = m.hash(i);
        m.prev[i] = m.head[h];
        m.head[h] = @intCast(i);
    }
    const Found = struct { len: usize = 0, dist: usize = 0 };
    /// The longest earlier match at i, among the positions already inserted.
    fn find(m: *const Matcher, i: usize) Found {
        var best: Found = .{};
        if (i + min_match > m.d.len) return best;
        const most = @min(max_match, m.d.len - i);
        var cand = m.head[m.hash(i)];
        var chain: usize = 0;
        while (cand >= 0 and chain < max_chain) : (chain += 1) {
            const c: usize = @intCast(cand);
            if (i - c > window) break;
            var l: usize = 0;
            while (l < most and m.d[c + l] == m.d[i + l]) l += 1;
            if (l > best.len) {
                best = .{ .len = l, .dist = i - c };
                if (l == most) break;
            }
            cand = m.prev[c];
        }
        return if (best.len >= min_match) best else .{};
    }
};

/// `data` as a gzip stream: one fixed-Huffman deflate block, the CRC-32 and the size.
pub fn compress(a: Allocator, data: []const u8) ![]u8 {
    var out: std.ArrayList(u8) = .empty;
    errdefer out.deinit(a);
    // the gzip header: no name, no time, so the same bytes give the same stream on every build
    try out.appendSlice(a, &.{ 0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff });
    var w: BitWriter = .{ .a = a, .out = &out };
    try w.bits(1, 1); // the last block
    try w.bits(1, 2); // fixed Huffman codes
    const head = try a.alloc(i32, 1 << hash_bits);
    defer a.free(head);
    @memset(head, -1);
    const prev = try a.alloc(i32, data.len);
    defer a.free(prev);
    var m: Matcher = .{ .d = data, .head = head, .prev = prev };
    var i: usize = 0;
    while (i < data.len) {
        const here = m.find(i);
        m.insert(i);
        if (here.len >= min_match and here.len < max_match and i + 1 < data.len) {
            // one step of lazy matching: a longer match one byte on wins, and this byte goes out as a literal
            if (m.find(i + 1).len > here.len) {
                try literal(&w, data[i]);
                i += 1;
                continue;
            }
        }
        if (here.len >= min_match) {
            try match(&w, here.len, here.dist);
            for (i + 1..i + here.len) |p| m.insert(p);
            i += here.len;
        } else {
            try literal(&w, data[i]);
            i += 1;
        }
    }
    try literal(&w, 256); // the end of the block
    try w.flush();
    var tail: [8]u8 = undefined;
    std.mem.writeInt(u32, tail[0..4], std.hash.Crc32.hash(data), .little);
    std.mem.writeInt(u32, tail[4..8], @truncate(data.len), .little);
    try out.appendSlice(a, &tail);
    return out.toOwnedSlice(a);
}

/// A gzip stream inflated by std.compress.flate.Decompress, which checks its CRC-32 and its size.
pub fn inflate(a: Allocator, gz: []const u8) ![]u8 {
    var in: std.Io.Reader = .fixed(gz);
    var aw: std.Io.Writer.Allocating = .init(a);
    errdefer aw.deinit();
    var d: std.compress.flate.Decompress = .init(&in, .gzip, &.{});
    _ = try d.reader.streamRemaining(&aw.writer);
    return aw.toOwnedSlice();
}

fn roundTrip(data: []const u8) !usize {
    const a = std.testing.allocator;
    const gz = try compress(a, data);
    defer a.free(gz);
    const back = try inflate(a, gz);
    defer a.free(back);
    try std.testing.expectEqualSlices(u8, data, back);
    return gz.len;
}

test "every stream reads back through std's inflate, byte for byte" {
    _ = try roundTrip("");
    _ = try roundTrip("a");
    _ = try roundTrip("abcabcabcabcabcabcabcabcabc");
    var all: [256]u8 = undefined;
    for (&all, 0..) |*b, k| b.* = @intCast(k);
    _ = try roundTrip(&all);
    // a run longer than one match, and repeats at every distance code
    const a = std.testing.allocator;
    const long = try a.alloc(u8, 200_000);
    defer a.free(long);
    var x: u32 = 12345;
    for (long, 0..) |*b, k| {
        x = x *% 1103515245 +% 12345;
        b.* = if (k % 997 < 600) 'z' else if (k % 3 == 0) @truncate(x >> 16) else "<div class=\"a\">"[k % 15];
    }
    _ = try roundTrip(long);
}

test "text shrinks" {
    const page = "<p class=\"sub\">The verifier checks a declaration.</p>\n" ** 40;
    try std.testing.expect(try roundTrip(page) < page.len / 10);
}
