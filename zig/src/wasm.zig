//! The wasm export surface of the verifier (doc/design/BINARY.md section 6): the core and nothing else, built for
//! wasm32-freestanding with no imports. A browser runs `zane check NAME --json --level N [--symbols]` on one source and
//! reads back the envelope the executable prints for the same arguments, byte for byte (the proof page shows it).
//!
//!   zane_alloc(len) -> ptr                                  memory for the loader to write a string into
//!   zane_free(ptr, len)                                     gives it back
//!   zane_check(name, name_len, src, src_len, sym, sym_len, level) -> ptr
//!       ptr is a block: a 4-byte little-endian length, then the envelope as UTF-8 JSON; free it as (ptr, 4 + length).
//!       sym_len 0 means no symbol table. 0 is returned for a level outside 1..4 or when memory runs out.
//!
//! Each call owns an arena and frees it before returning: no global state, so a page can call it as often as it likes.

const std = @import("std");
const contract_mod = @import("contract.zig");
const report = @import("report.zig");

const gpa = std.heap.wasm_allocator;

export fn zane_alloc(len: usize) usize {
    const s = gpa.alloc(u8, len) catch return 0;
    return @intFromPtr(s.ptr);
}

export fn zane_free(ptr: usize, len: usize) void {
    if (ptr == 0) return;
    gpa.free(@as([*]u8, @ptrFromInt(ptr))[0..len]);
}

export fn zane_check(name: usize, name_len: usize, src: usize, src_len: usize, sym: usize, sym_len: usize, level: i32) usize {
    if (level < 1 or level > 4) return 0;
    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const out = check(arena.allocator(), bytes(name, name_len), bytes(src, src_len), if (sym_len == 0) null else bytes(sym, sym_len), level) catch return 0;
    const block = gpa.alloc(u8, 4 + out.len) catch return 0;
    std.mem.writeInt(u32, block[0..4], @intCast(out.len), .little);
    @memcpy(block[4..], out);
    return @intFromPtr(block.ptr);
}

fn bytes(ptr: usize, len: usize) []const u8 {
    if (len == 0) return "";
    return @as([*]const u8, @ptrFromInt(ptr))[0..len];
}

fn check(a: std.mem.Allocator, name: []const u8, src: []const u8, sym: ?[]const u8, level: i64) ![]const u8 {
    const contract = try contract_mod.loadContract(a, contract_mod.violations_json);
    const symbols = if (sym) |s| try report.symbolsOf(a, s) else null;
    var findings: std.ArrayList(report.Finding) = .empty;
    try report.collect(a, contract, name, src, symbols, level, &findings);
    var w: std.Io.Writer.Allocating = .init(a);
    try report.writeJson(a, &w.writer, &.{name}, contract, level, findings.items);
    return w.written();
}
