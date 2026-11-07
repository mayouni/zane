//! SHA256SUMS for `zig build release` (Central's ZANE-RELEASE-01, 2026-11-07): built for this machine and run by build.zig,
//! so the release step needs no other program.
//!
//!   sums OUT NAME FILE [NAME FILE ...]
//!
//! Writes OUT in sha256sum's format, one line per file: the hash in lowercase hex, two spaces, the NAME it is published
//! under; LF line endings; sorted by name, byte by byte. `sha256sum -c SHA256SUMS` reads it back.

const std = @import("std");

pub fn main() !void {
    var arena_state = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena_state.deinit();
    const a = arena_state.allocator();
    const argv = try std.process.argsAlloc(a);
    if (argv.len < 2 or (argv.len - 2) % 2 != 0) return error.Usage;

    const Entry = struct { name: []const u8, hex: [64]u8 };
    var entries: std.ArrayList(Entry) = .empty;
    var i: usize = 2;
    while (i < argv.len) : (i += 2) {
        const data = try std.fs.cwd().readFileAlloc(a, argv[i + 1], 1 << 30);
        var digest: [32]u8 = undefined;
        std.crypto.hash.sha2.Sha256.hash(data, &digest, .{});
        try entries.append(a, .{ .name = argv[i], .hex = std.fmt.bytesToHex(digest, .lower) });
    }
    std.mem.sort(Entry, entries.items, {}, struct {
        fn lt(_: void, x: Entry, y: Entry) bool {
            return std.mem.lessThan(u8, x.name, y.name);
        }
    }.lt);
    var out: std.ArrayList(u8) = .empty;
    for (entries.items) |e| try out.print(a, "{s}  {s}\n", .{ &e.hex, e.name });
    try std.fs.cwd().writeFile(.{ .sub_path = argv[1], .data = out.items });
}
