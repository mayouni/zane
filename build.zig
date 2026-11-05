//! The StzZui binary (doc/design/BINARY.md). One executable, `zui`, built from zig/src.
//!
//!   zig build -j2                              a debug build, which is never a measurement
//!   zig build -j2 -Doptimize=ReleaseSmall      the build the size budget is read from
//!   zig build -j2 test                         the unit tests
//!   zig build -j2 run -- check x.zui           run it
//!
//! The data it embeds (conformance/, constitution/) is read from this repository at build time.

const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const root = b.createModule(.{
        .root_source_file = b.path("zig/src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    embedData(b, root);
    const exe = b.addExecutable(.{ .name = "zui", .root_module = root });
    b.installArtifact(exe);

    const run = b.addRunArtifact(exe);
    if (b.args) |args| run.addArgs(args);
    b.step("run", "Run zui").dependOn(&run.step);

    const test_root = b.createModule(.{
        .root_source_file = b.path("zig/src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    embedData(b, test_root);
    const tests = b.addTest(.{ .root_module = test_root });
    const test_run = b.addRunArtifact(tests);
    b.step("test", "Run the unit tests").dependOn(&test_run.step);
}

/// The contract and the law live outside zig/src, which @embedFile cannot reach by path; they are handed in by name.
fn embedData(b: *std.Build, m: *std.Build.Module) void {
    m.addAnonymousImport("violations.json", .{ .root_source_file = b.path("conformance/violations.json") });
    m.addAnonymousImport("rules.json", .{ .root_source_file = b.path("constitution/rules.json") });
}
