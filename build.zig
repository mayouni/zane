//! The StzZui binary (doc/design/BINARY.md). One executable, `zane`, built from zig/src.
//!
//!   zig build -j2                              a debug build, which is never a measurement
//!   zig build -j2 -Doptimize=ReleaseSmall      the build the size budget is read from
//!   zig build -j2 test                         the unit tests
//!   zig build -j2 run -- check x.zane          run it
//!   zig build -j2 wasm -Doptimize=ReleaseSmall the browser build, zane.wasm (stage S3), copied to site/zane.wasm by hand
//!   zig build -j2 release                      every published file at ReleaseSmall, in zig-out/release, with SHA256SUMS
//!
//! The data it embeds (conformance/, constitution/) is read from this repository at build time. The version is
//! build.zig.zon's, and `zane --version` prints it.

const std = @import("std");
const version: []const u8 = @import("build.zig.zon").version;

/// What `zig build release` publishes (Central's ZANE-RELEASE-01, 2026-11-07): one executable per target, named by version,
/// architecture and system. Linux is musl and static; macOS is built here and never run here (BINARY.md section 11.7).
const release_targets = [_]struct { name: []const u8, query: std.Target.Query }{
    .{ .name = "x86_64-windows", .query = .{ .cpu_arch = .x86_64, .os_tag = .windows } },
    .{ .name = "x86_64-linux", .query = .{ .cpu_arch = .x86_64, .os_tag = .linux, .abi = .musl } },
    .{ .name = "aarch64-linux", .query = .{ .cpu_arch = .aarch64, .os_tag = .linux, .abi = .musl } },
    .{ .name = "x86_64-macos", .query = .{ .cpu_arch = .x86_64, .os_tag = .macos } },
    .{ .name = "aarch64-macos", .query = .{ .cpu_arch = .aarch64, .os_tag = .macos } },
};

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const options = b.addOptions();
    options.addOption([]const u8, "version", version);
    const site = siteModule(b);
    const exe = zaneExe(b, target, optimize, site, options);
    b.installArtifact(exe);

    const run = b.addRunArtifact(exe);
    if (b.args) |args| run.addArgs(args);
    b.step("run", "Run zane").dependOn(&run.step);

    const test_root = b.createModule(.{
        .root_source_file = b.path("zig/src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    embedData(b, test_root);
    test_root.addImport("site", site);
    test_root.addOptions("build_options", options);
    const tests = b.addTest(.{ .root_module = test_root });
    const test_run = b.addRunArtifact(tests);
    b.step("test", "Run the unit tests").dependOn(&test_run.step);

    // the browser build: the same core for wasm32-freestanding, behind the export surface of wasm.zig and nothing else
    const wasm = zaneWasm(b, optimize);
    b.step("wasm", "Build zane.wasm").dependOn(&b.addInstallArtifact(wasm, .{}).step);

    // the release: every target at ReleaseSmall whatever -Doptimize says, and SHA256SUMS written by zig/src/sums.zig, built for
    // this machine, so the step runs no other program. Two clean builds in two fresh clones give the same SHA256SUMS: that is
    // its gate, and doc/releases/ records each release's figures.
    const release = b.step("release", "Build every published file at ReleaseSmall into zig-out/release, with SHA256SUMS");
    const sums_tool = b.addExecutable(.{ .name = "sums", .root_module = b.createModule(.{
        .root_source_file = b.path("zig/src/sums.zig"),
        .target = b.graph.host,
        .optimize = .ReleaseFast,
    }) });
    const sums = b.addRunArtifact(sums_tool);
    const sums_file = sums.addOutputFileArg("SHA256SUMS");
    const dest: std.Build.InstallDir = .{ .custom = "release" };
    for (release_targets) |t| {
        const rt = b.resolveTargetQuery(t.query);
        const r = zaneExe(b, rt, .ReleaseSmall, site, options);
        const name = b.fmt("zane-{s}-{s}{s}", .{ version, t.name, rt.result.exeFileExt() });
        release.dependOn(&b.addInstallArtifact(r, .{
            .dest_dir = .{ .override = dest },
            .dest_sub_path = name,
            .pdb_dir = .disabled,
            .h_dir = .disabled,
            .implib_dir = .disabled,
        }).step);
        sums.addArg(name);
        sums.addFileArg(r.getEmittedBin());
    }
    const rw = zaneWasm(b, .ReleaseSmall);
    const wasm_name = b.fmt("zane-{s}.wasm", .{version});
    release.dependOn(&b.addInstallFileWithDir(rw.getEmittedBin(), dest, wasm_name).step);
    sums.addArg(wasm_name);
    sums.addFileArg(rw.getEmittedBin());
    release.dependOn(&b.addInstallFileWithDir(sums_file, dest, "SHA256SUMS").step);
}

/// The executable for one target: main.zig, the data it embeds, the site it serves, and the version.
fn zaneExe(b: *std.Build, target: std.Build.ResolvedTarget, optimize: std.builtin.OptimizeMode, site: *std.Build.Module, options: *std.Build.Step.Options) *std.Build.Step.Compile {
    const root = b.createModule(.{
        .root_source_file = b.path("zig/src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    embedData(b, root);
    root.addImport("site", site);
    root.addOptions("build_options", options);
    return b.addExecutable(.{ .name = "zane", .root_module = root });
}

/// zane.wasm: the core for wasm32-freestanding, with the contract and the law it checks against.
fn zaneWasm(b: *std.Build, optimize: std.builtin.OptimizeMode) *std.Build.Step.Compile {
    const wasm_root = b.createModule(.{
        .root_source_file = b.path("zig/src/wasm.zig"),
        .target = b.resolveTargetQuery(.{ .cpu_arch = .wasm32, .os_tag = .freestanding }),
        .optimize = optimize,
    });
    wasm_root.addAnonymousImport("violations.json", .{ .root_source_file = b.path("conformance/violations.json") });
    wasm_root.addAnonymousImport("rules.json", .{ .root_source_file = b.path("constitution/rules.json") });
    const wasm = b.addExecutable(.{ .name = "zane", .root_module = wasm_root });
    wasm.entry = .disabled;
    wasm.rdynamic = true;
    return wasm;
}

/// The contract, the law, the suite and the audit's facts schema live outside zig/src, which @embedFile cannot reach by
/// path; they are handed in by name. `zane conformance`, `cross-medium` and `audit-facts` check the data they were built
/// from, so they need no tree to run; `zane pack` reads the tree it is run in, because a pin is about the bytes you have.
fn embedData(b: *std.Build, m: *std.Build.Module) void {
    m.addAnonymousImport("violations.json", .{ .root_source_file = b.path("conformance/violations.json") });
    m.addAnonymousImport("rules.json", .{ .root_source_file = b.path("constitution/rules.json") });
    m.addAnonymousImport("manifest.json", .{ .root_source_file = b.path("conformance/manifest.json") });
    m.addAnonymousImport("media.json", .{ .root_source_file = b.path("conformance/media.json") });
    m.addAnonymousImport("signal.json", .{ .root_source_file = b.path("conformance/signal.json") });
    m.addAnonymousImport("schema.json", .{ .root_source_file = b.path("doc/diagnostic-contract.schema.json") });
    m.addAnonymousImport("VIOLATIONS.md", .{ .root_source_file = b.path("doc/language/VIOLATIONS.md") });
    m.addAnonymousImport("spec.md", .{ .root_source_file = b.path("doc/language/README.md") });
    m.addAnonymousImport("facts.schema.json", .{ .root_source_file = b.path("doc/design/audit/facts.schema.json") });
    m.addAnonymousImport("decides.json", .{ .root_source_file = b.path("doc/design/audit/decides.json") });
    m.addAnonymousImport("ui-audit.html", .{ .root_source_file = b.path("tools/ui-audit.html") });
    m.addImport("fixtures", folder(b, "conformance/fixtures"));
    m.addImport("crossmedium", folder(b, "conformance/cross-medium"));
}

/// The site `zane serve` answers from inside the binary: what the pages reach, and nothing more (the author, 2026-11-07: "embed only
/// what the pages reach"), by path from the repository's root, as a generated module `site` of `files` (path, data). It used to be
/// the root's pages and eight folders whole, which put the repository's own build scripts and design documents in the binary as
/// text (BINARY.md section 7). The crawl starts at index.html and every page under site/, and follows:
///   - from a page: the addresses in href, src, srcset, data-src, data-wasm and poster, every CSS url(), and every path to a .json
///     or .wasm file written in the page or in a script the page loads, read against the page, then against the site's root
///     (site/law-numbers.js makes ../conformance/violations.json out of the page's data-src="../constitution/rules.json");
///   - from a stylesheet: its url()s.
/// A Markdown, JSON or source file is served as text and its own links are not followed; a link to a folder is its index.html;
/// a hidden file or folder is never reached. tools/zane/serve-test.js crawls the served site over HTTP, more broadly, and fails
/// when a page reaches a file the folder serves and the binary does not. The text is stored as gzip (sitepack.zig). BINARY.md
/// section 7 budgets the binary at 4 MB.
fn siteModule(b: *std.Build) *std.Build.Module {
    const a = b.allocator;
    var reached = std.StringArrayHashMap(void).init(a);
    var queue: std.ArrayList([]const u8) = .empty;
    reach(&reached, &queue, "index.html");
    var pages: std.ArrayList([]const u8) = .empty;
    htmlUnder(b, "site", &pages);
    for (pages.items) |p| reach(&reached, &queue, p);
    var i: usize = 0;
    while (i < queue.items.len) : (i += 1) {
        const f = queue.items[i];
        const html = std.mem.endsWith(u8, f, ".html");
        if (!html and !std.mem.endsWith(u8, f, ".css")) continue;
        const text = std.fs.cwd().readFileAlloc(a, b.pathFromRoot(f), 64 * 1024 * 1024) catch @panic("cannot read a page the site embeds");
        const base = if (std.mem.lastIndexOfScalar(u8, f, '/')) |k| f[0..k] else "";
        var refs: std.ArrayList([]const u8) = .empty;
        urls(text, &refs);
        for (refs.items) |r| if (resolve(b, base, r)) |x| reach(&reached, &queue, x);
        if (!html) continue;
        refs.clearRetainingCapacity();
        attributes(text, &refs);
        for (refs.items) |r| if (resolve(b, base, r)) |x| {
            reach(&reached, &queue, x);
            if (std.mem.endsWith(u8, x, ".js")) {
                const js = std.fs.cwd().readFileAlloc(a, b.pathFromRoot(x), 64 * 1024 * 1024) catch @panic("cannot read a script the site embeds");
                literals(b, base, js, &reached, &queue);
            }
        };
        literals(b, base, text, &reached, &queue);
    }
    const paths = a.dupe([]const u8, reached.keys()) catch @panic("out of memory");
    std.mem.sort([]const u8, paths, {}, struct {
        fn lt(_: void, x: []const u8, y: []const u8) bool {
            return std.mem.lessThan(u8, x, y);
        }
    }.lt);
    // the files are packed by zig/src/sitepack.zig, built for this machine and run as a cached step: the text stored as gzip
    // (piece 2 of Central's 10:49, 2026-11-07), every stream read back by std's inflate before it is kept
    const packer = b.addExecutable(.{ .name = "sitepack", .root_module = b.createModule(.{
        .root_source_file = b.path("zig/src/sitepack.zig"),
        .target = b.graph.host,
        .optimize = .ReleaseFast,
    }) });
    const pack = b.addRunArtifact(packer);
    const out = pack.addOutputDirectoryArg("site");
    for (paths) |rel| {
        pack.addArg(rel);
        pack.addFileArg(b.path(rel));
    }
    return b.createModule(.{ .root_source_file = out.path(b, "site.zig") });
}

fn reach(reached: *std.StringArrayHashMap(void), queue: *std.ArrayList([]const u8), rel: []const u8) void {
    const e = reached.getOrPut(rel) catch @panic("out of memory");
    if (!e.found_existing) queue.append(reached.allocator, rel) catch @panic("out of memory");
}

fn htmlUnder(b: *std.Build, top: []const u8, out: *std.ArrayList([]const u8)) void {
    var dir = std.fs.cwd().openDir(b.pathFromRoot(top), .{ .iterate = true }) catch return;
    defer dir.close();
    var walker = dir.walk(b.allocator) catch @panic("out of memory");
    defer walker.deinit();
    while (walker.next() catch @panic("cannot walk the site's pages")) |e| {
        if (e.kind != .file or !std.mem.endsWith(u8, e.path, ".html")) continue;
        const rel = b.fmt("{s}/{s}", .{ top, e.path });
        std.mem.replaceScalar(u8, rel, '\\', '/');
        out.append(b.allocator, rel) catch @panic("out of memory");
    }
}

fn kindOf(b: *std.Build, rel: []const u8) ?std.fs.File.Kind {
    const st = std.fs.cwd().statFile(b.pathFromRoot(if (rel.len == 0) "." else rel)) catch return null;
    return st.kind;
}

/// An address read against the folder `base`, as a browser reads it: null for another site, a fragment of the page itself, a
/// step above the root, a hidden file, or a file that does not exist.
fn resolve(b: *std.Build, base: []const u8, ref0: []const u8) ?[]const u8 {
    var ref = ref0;
    if (ref.len == 0 or ref[0] == '#' or std.mem.startsWith(u8, ref, "//")) return null;
    if (std.mem.indexOfScalar(u8, ref, ':')) |c| {
        const slash = std.mem.indexOfScalar(u8, ref, '/') orelse ref.len;
        if (c < slash) return null; // a scheme: http:, mailto:, data:, javascript:
    }
    if (std.mem.indexOfAny(u8, ref, "?#")) |k| ref = ref[0..k];
    if (ref.len == 0) return null;
    var parts: std.ArrayList([]const u8) = .empty;
    if (ref[0] != '/') {
        var it = std.mem.splitScalar(u8, base, '/');
        while (it.next()) |s| if (s.len > 0) parts.append(b.allocator, s) catch @panic("out of memory");
    }
    var it = std.mem.splitScalar(u8, ref, '/');
    while (it.next()) |s| {
        if (s.len == 0 or std.mem.eql(u8, s, ".")) continue;
        if (std.mem.eql(u8, s, "..")) {
            if (parts.items.len == 0) return null;
            _ = parts.pop();
            continue;
        }
        if (s[0] == '.') return null;
        parts.append(b.allocator, s) catch @panic("out of memory");
    }
    var rel: []const u8 = std.mem.join(b.allocator, "/", parts.items) catch @panic("out of memory");
    if (ref[ref.len - 1] == '/' or kindOf(b, rel) == .directory) rel = if (rel.len == 0) "index.html" else b.fmt("{s}/index.html", .{rel});
    return if (kindOf(b, rel) == .file) rel else null;
}

/// The values of href, src, srcset (each candidate), data-src, data-wasm and poster, each name preceded by white space.
fn attributes(t: []const u8, out: *std.ArrayList([]const u8)) void {
    const gpa = std.heap.page_allocator;
    for ([_][]const u8{ "href", "src", "srcset", "data-src", "data-wasm", "poster" }) |name| {
        var from: usize = 0;
        while (std.mem.indexOfPos(u8, t, from, name)) |at| : (from = at + 1) {
            if (at == 0 or !std.ascii.isWhitespace(t[at - 1])) continue;
            var k = at + name.len;
            while (k < t.len and t[k] == ' ') k += 1;
            if (k >= t.len or t[k] != '=') continue;
            k += 1;
            while (k < t.len and t[k] == ' ') k += 1;
            if (k >= t.len or t[k] != '"') continue;
            const end = std.mem.indexOfScalarPos(u8, t, k + 1, '"') orelse continue;
            const v = t[k + 1 .. end];
            if (std.mem.eql(u8, name, "srcset")) {
                var cands = std.mem.splitScalar(u8, v, ',');
                while (cands.next()) |c| {
                    var words = std.mem.tokenizeAny(u8, c, " \t\r\n");
                    if (words.next()) |w| out.append(gpa, w) catch @panic("out of memory");
                }
            } else out.append(gpa, v) catch @panic("out of memory");
        }
    }
}

/// Every CSS url(...), quoted or not.
fn urls(t: []const u8, out: *std.ArrayList([]const u8)) void {
    var from: usize = 0;
    while (std.mem.indexOfPos(u8, t, from, "url(")) |at| : (from = at + 1) {
        var k = at + 4;
        while (k < t.len and t[k] == ' ') k += 1;
        if (k < t.len and (t[k] == '"' or t[k] == '\'')) k += 1;
        const s = k;
        while (k < t.len and t[k] != '"' and t[k] != '\'' and t[k] != ')') k += 1;
        out.append(std.heap.page_allocator, std.mem.trim(u8, t[s..k], " ")) catch @panic("out of memory");
    }
}

/// Every quoted path to a .json or .wasm file in a page or a script it loads, read against the page, then against the root.
fn literals(b: *std.Build, base: []const u8, t: []const u8, reached: *std.StringArrayHashMap(void), queue: *std.ArrayList([]const u8)) void {
    for ([_][]const u8{ ".json", ".wasm" }) |ext| {
        var from: usize = 0;
        while (std.mem.indexOfPos(u8, t, from, ext)) |at| : (from = at + 1) {
            const close = at + ext.len;
            if (close >= t.len or (t[close] != '"' and t[close] != '\'' and t[close] != '`')) continue;
            var s = at;
            while (s > 0 and t[s - 1] != t[close] and !std.ascii.isWhitespace(t[s - 1])) s -= 1;
            if (s == 0 or t[s - 1] != t[close]) continue;
            const v = t[s..close];
            if (resolve(b, base, v) orelse resolve(b, "", v)) |x| reach(reached, queue, x);
        }
    }
}
/// Every file of one folder (conformance/fixtures, conformance/cross-medium) as a generated module: `files`, by name,
/// each embedded.
fn folder(b: *std.Build, rel: []const u8) *std.Build.Module {
    const wf = b.addWriteFiles();
    _ = wf.addCopyDirectory(b.path(rel), "files", .{});
    var names: std.ArrayList([]const u8) = .empty;
    var dir = std.fs.cwd().openDir(b.pathFromRoot(rel), .{ .iterate = true }) catch @panic("cannot read a folder the binary embeds");
    defer dir.close();
    var it = dir.iterate();
    while (it.next() catch @panic("cannot list a folder the binary embeds")) |e| {
        if (e.kind == .file) names.append(b.allocator, b.dupe(e.name)) catch @panic("out of memory");
    }
    std.mem.sort([]const u8, names.items, {}, struct {
        fn lt(_: void, x: []const u8, y: []const u8) bool {
            return std.mem.lessThan(u8, x, y);
        }
    }.lt);
    var src: std.ArrayList(u8) = .empty;
    src.appendSlice(b.allocator, b.fmt("// generated by build.zig from {s}\npub const File = struct {{ name: []const u8, src: []const u8 }};\npub const files = [_]File{{\n", .{rel})) catch @panic("out of memory");
    for (names.items) |n| src.appendSlice(b.allocator, b.fmt("    .{{ .name = \"{s}\", .src = @embedFile(\"files/{s}\") }},\n", .{ n, n })) catch @panic("out of memory");
    src.appendSlice(b.allocator, "};\n") catch @panic("out of memory");
    return b.createModule(.{ .root_source_file = wf.add("folder.zig", src.items) });
}
