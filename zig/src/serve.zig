//! `zayn serve`: the site, the Reader and the UI audit from one executable, with no Node (doc/design/BINARY.md, stage S4).
//!
//!   zayn serve [--port N] [--host ADDR]                  this repository's site, what its pages reach, embedded at its build
//!   zayn serve --root DIR [--port N] [--host ADDR]       the same site, read from the folder DIR instead
//!   zayn serve --app DIR [--port N] [--host ADDR]        another site, read only, with the UI audit beside it at
//!                                                        /__zayn/ui-audit.html, so the audit can measure it on one origin
//!
//! The hygiene of BINARY.md section 7, written before the code: it binds 127.0.0.1 unless --host says otherwise; it answers
//! GET and HEAD only (405 otherwise); it lists no folder (a folder without index.html is 404); a path with a `..` segment,
//! written plainly or percent-encoded, or holding a backslash or a NUL, is 404, and so is a file whose real path resolves
//! outside the root; it writes nothing, anywhere, and makes no request of its own. One connection at a time, closed after
//! each answer. The embedded text files are stored as gzip (build.zig, sitepack.zig): a request that accepts gzip gets the
//! stored stream with Content-Encoding: gzip, any other gets the file inflated by std (gzip.zig), and both carry Vary:
//! Accept-Encoding; a folder's files (--root, --app) are sent as they are. The socket is read and written by `recvSome` and `sendAll` below, with Winsock's own recv and send on Windows:
//! there, Zig 0.15's `Stream.read` calls ReadFile, which refuses an accepted socket (error 87), and `std.posix.send` needs
//! libc (both found on the first runs). They are kept in this file alone, so a change of std.net touches nothing else
//! (BINARY.md section 9).

const std = @import("std");
const builtin = @import("builtin");
const gzip = @import("gzip.zig");
/// The site, embedded at build (build.zig, siteModule): every file the pages reach, by its path from the repository's root.
const site = @import("site");

/// The UI audit, embedded, for --app: the binary serves it beside a site that is not this repository.
const ui_audit = @embedFile("ui-audit.html");
const audit_path = "/__zayn/ui-audit.html";

const Options = struct {
    root: ?[]const u8 = null,
    app: ?[]const u8 = null,
    port: u16 = 8770,
    host: []const u8 = "127.0.0.1",
};

pub fn run(a: std.mem.Allocator, out: *std.Io.Writer, err: *std.Io.Writer, argv: []const []const u8) !u8 {
    var o: Options = .{};
    var i: usize = 0;
    while (i < argv.len) : (i += 1) {
        const x = argv[i];
        const val = if (i + 1 < argv.len) argv[i + 1] else null;
        if (std.mem.eql(u8, x, "--root") or std.mem.eql(u8, x, "--app") or std.mem.eql(u8, x, "--port") or std.mem.eql(u8, x, "--host")) {
            const v = val orelse {
                try err.print("zayn serve: {s} needs a value\n", .{x});
                return 2;
            };
            i += 1;
            if (std.mem.eql(u8, x, "--root")) o.root = v else if (std.mem.eql(u8, x, "--app")) o.app = v else if (std.mem.eql(u8, x, "--host")) o.host = v else {
                o.port = std.fmt.parseInt(u16, v, 10) catch {
                    try err.print("zayn serve: --port must be a number from 1 to 65535\n", .{});
                    return 2;
                };
            }
        } else {
            try err.print("zayn serve: unknown argument {s}\n\nzayn serve [--root DIR] [--port N] [--host ADDR]\nzayn serve --app DIR [--port N] [--host ADDR]\n", .{x});
            return 2;
        }
    }
    // the files come from the binary itself, or from a folder the person named (--root for this site, --app for another)
    var source: Source = .embedded;
    if (o.app orelse o.root) |folder| {
        const real = std.fs.cwd().realpathAlloc(a, folder) catch {
            try err.print("zayn serve: cannot open the folder {s}\n", .{folder});
            return 2;
        };
        const dir = std.fs.cwd().openDir(real, .{}) catch {
            try err.print("zayn serve: cannot open the folder {s}\n", .{folder});
            return 2;
        };
        source = .{ .disk = .{ .dir = dir, .real = real } };
    }
    defer if (source == .disk) source.disk.dir.close();
    const where: []const u8 = switch (source) {
        .disk => |d| d.real,
        .embedded => try std.fmt.allocPrint(a, "the site embedded in this binary ({d} files, {d} bytes stored in {d}, {d} of them as gzip)", .{ site.files.len, site.raw_bytes, site.stored_bytes, site.gzip_files }),
    };

    const address = std.net.Address.parseIp(o.host, o.port) catch {
        try err.print("zayn serve: {s} is not an IP address\n", .{o.host});
        return 2;
    };
    var server = address.listen(.{ .reuse_address = true }) catch |e| {
        try err.print("zayn serve: cannot listen on {s}:{d}: {s}\n", .{ o.host, o.port, @errorName(e) });
        return 2;
    };
    defer server.deinit();

    if (o.app != null) {
        try out.print("zayn serve: {s}, read only, at http://{s}:{d}/ with the UI audit at http://{s}:{d}{s}\n", .{ where, o.host, o.port, o.host, o.port, audit_path });
    } else {
        try out.print("zayn serve: {s}, read only, at http://{s}:{d}/ (the site /index.html, the Reader /constitution/reader/, the audit /tools/ui-audit.html)\n", .{ where, o.host, o.port });
    }
    try out.flush();

    while (true) {
        const conn = server.accept() catch continue;
        defer conn.stream.close();
        var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
        defer arena.deinit();
        handle(arena.allocator(), conn.stream, source, o.app != null) catch {};
    }
}

/// Where the files come from: a folder on disk (its real path, for the check that a file stays inside it), or the binary itself.
const Source = union(enum) {
    disk: struct { dir: std.fs.Dir, real: []const u8 },
    embedded,
};

const Answer = struct { status: []const u8, type: []const u8 = "text/plain; charset=utf-8", body: []const u8, extra: []const u8 = "" };

fn handle(a: std.mem.Allocator, stream: std.net.Stream, source: Source, app: bool) !void {
    // the request head, up to the blank line; a head over 16 KB is refused
    var buf: [16384]u8 = undefined;
    var n: usize = 0;
    while (std.mem.indexOf(u8, buf[0..n], "\r\n\r\n") == null) {
        if (n == buf.len) return send(stream, .{ .status = "431 Request Header Fields Too Large", .body = "request head too large\n" }, false);
        const got = try recvSome(stream, buf[n..]);
        if (got == 0) return;
        n += got;
    }
    const line_end = std.mem.indexOf(u8, buf[0..n], "\r\n").?;
    var parts = std.mem.splitScalar(u8, buf[0..line_end], ' ');
    const method = parts.next() orelse "";
    const target = parts.next() orelse "";
    const head = std.mem.eql(u8, method, "HEAD");
    if (!head and !std.mem.eql(u8, method, "GET")) return send(stream, .{ .status = "405 Method Not Allowed", .body = "GET and HEAD only\n", .extra = "Allow: GET, HEAD\r\n" }, false);
    return send(stream, try answer(a, target, source, app, acceptsGzip(buf[line_end..n])), head);
}

/// Whether the request's Accept-Encoding takes gzip: a coding gzip, x-gzip or *, without q=0 (RFC 9110 12.5.3). No header,
/// or none of these, is a client that gets the file inflated.
fn acceptsGzip(head: []const u8) bool {
    var ok = false;
    var lines = std.mem.splitSequence(u8, head, "\r\n");
    while (lines.next()) |line| {
        const colon = std.mem.indexOfScalar(u8, line, ':') orelse continue;
        if (!std.ascii.eqlIgnoreCase(std.mem.trim(u8, line[0..colon], " \t"), "accept-encoding")) continue;
        var codings = std.mem.splitScalar(u8, line[colon + 1 ..], ',');
        while (codings.next()) |c| {
            var params = std.mem.splitScalar(u8, c, ';');
            const name = std.mem.trim(u8, params.first(), " \t");
            if (!(std.ascii.eqlIgnoreCase(name, "gzip") or std.ascii.eqlIgnoreCase(name, "x-gzip") or std.mem.eql(u8, name, "*"))) continue;
            var refused = false;
            while (params.next()) |q| {
                const v = std.mem.trim(u8, q, " \t");
                if (v.len >= 2 and (v[0] == 'q' or v[0] == 'Q') and v[1] == '=') {
                    refused = std.mem.trim(u8, v[2..], "0.").len == 0;
                }
            }
            if (!refused) ok = true;
        }
    }
    return ok;
}

const not_found: Answer = .{ .status = "404 Not Found", .body = "not found\n" };

/// What a GET of `target` answers: a file of the source, the embedded audit for --app, or 404.
fn answer(a: std.mem.Allocator, target: []const u8, source: Source, app: bool, takes_gzip: bool) !Answer {
    const raw = target[0 .. std.mem.indexOfAny(u8, target, "?#") orelse target.len];
    if (raw.len == 0 or raw[0] != '/') return not_found;
    for (raw) |c| if (c < 0x21 or c == 0x7f) return not_found; // a control byte in the address, never echoed into a header
    const path = decode(a, raw) catch return not_found;
    if (app and std.mem.eql(u8, path, audit_path)) return .{ .status = "200 OK", .type = "text/html; charset=utf-8", .body = ui_audit };
    if (std.mem.indexOfAny(u8, path, "\\\x00:") != null) return not_found;
    // the path's segments, with no `..`: a step out of the root is never resolved, it is refused
    var segs: std.ArrayList([]const u8) = .empty;
    var it = std.mem.splitScalar(u8, path, '/');
    while (it.next()) |s| {
        if (s.len == 0 or std.mem.eql(u8, s, ".")) continue;
        if (std.mem.eql(u8, s, "..")) return not_found;
        try segs.append(a, s);
    }
    var rel: []const u8 = try std.mem.join(a, "/", segs.items);
    if (rel.len == 0 or path[path.len - 1] == '/') rel = if (rel.len == 0) "index.html" else try std.fmt.allocPrint(a, "{s}/index.html", .{rel});
    // a folder is answered by its index.html, and never listed; asked for without its slash, it is sent to the address with
    // one, so that the page's relative links resolve against the folder, as a static server does
    const is_dir = switch (source) {
        .disk => |d| blk: {
            var sub = d.dir.openDir(rel, .{}) catch break :blk false;
            sub.close();
            break :blk true;
        },
        .embedded => embeddedFolder(rel),
    };
    if (is_dir) {
        if (path[path.len - 1] != '/') return .{ .status = "301 Moved Permanently", .body = "moved\n", .extra = try std.fmt.allocPrint(a, "Location: {s}/\r\n", .{raw}) };
        rel = try std.fmt.allocPrint(a, "{s}/index.html", .{rel});
    }
    switch (source) {
        .disk => |d| {
            // the real path, links followed, must still be inside the root
            const real = d.dir.realpathAlloc(a, rel) catch return not_found;
            if (!(real.len > d.real.len and std.mem.startsWith(u8, real, d.real) and (real[d.real.len] == '/' or real[d.real.len] == '\\'))) return not_found;
            return .{ .status = "200 OK", .type = typeOf(rel), .body = d.dir.readFileAlloc(a, rel, 256 * 1024 * 1024) catch return not_found };
        },
        // the embedded files are known by name: nothing outside them exists to be reached
        .embedded => {
            const f = embeddedFile(rel) orelse return not_found;
            if (!f.gzip) return .{ .status = "200 OK", .type = typeOf(rel), .body = f.data };
            if (takes_gzip) return .{ .status = "200 OK", .type = typeOf(rel), .body = f.data, .extra = "Content-Encoding: gzip\r\nVary: Accept-Encoding\r\n" };
            return .{ .status = "200 OK", .type = typeOf(rel), .body = try gzip.inflate(a, f.data), .extra = "Vary: Accept-Encoding\r\n" };
        },
    }
}

fn embeddedFile(rel: []const u8) ?site.File {
    for (site.files) |f| if (std.mem.eql(u8, f.path, rel)) return f;
    return null;
}

/// An embedded folder is a path some embedded file sits under.
fn embeddedFolder(rel: []const u8) bool {
    for (site.files) |f| if (f.path.len > rel.len and std.mem.startsWith(u8, f.path, rel) and f.path[rel.len] == '/') return true;
    return false;
}

/// Percent-decoding of a path: %XX becomes its byte; a malformed escape is an error.
fn decode(a: std.mem.Allocator, s: []const u8) ![]const u8 {
    var out: std.ArrayList(u8) = .empty;
    var i: usize = 0;
    while (i < s.len) : (i += 1) {
        if (s[i] != '%') {
            try out.append(a, s[i]);
            continue;
        }
        if (i + 2 >= s.len) return error.BadEscape;
        try out.append(a, std.fmt.parseInt(u8, s[i + 1 .. i + 3], 16) catch return error.BadEscape);
        i += 2;
    }
    return out.toOwnedSlice(a);
}

const types = [_]struct { []const u8, []const u8 }{
    .{ ".html", "text/html; charset=utf-8" },     .{ ".css", "text/css; charset=utf-8" },
    .{ ".js", "text/javascript; charset=utf-8" }, .{ ".json", "application/json; charset=utf-8" },
    .{ ".wasm", "application/wasm" },             .{ ".svg", "image/svg+xml" },
    .{ ".png", "image/png" },                     .{ ".jpg", "image/jpeg" },
    .{ ".webp", "image/webp" },                   .{ ".woff2", "font/woff2" },
};

fn typeOf(name: []const u8) []const u8 {
    for (types) |t| if (std.ascii.endsWithIgnoreCase(name, t[0])) return t[1];
    return "text/plain; charset=utf-8"; // .md, .zayn, .csv, .txt and the rest are read as text, never run
}

fn send(stream: std.net.Stream, ans: Answer, head: bool) !void {
    var hbuf: [512]u8 = undefined;
    const h = try std.fmt.bufPrint(&hbuf, "HTTP/1.1 {s}\r\nContent-Type: {s}\r\nContent-Length: {d}\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\n{s}Connection: close\r\n\r\n", .{ ans.status, ans.type, ans.body.len, ans.extra });
    try sendAll(stream, h);
    if (!head) try sendAll(stream, ans.body);
}

const ws2 = std.os.windows.ws2_32;

fn recvSome(stream: std.net.Stream, buf: []u8) !usize {
    if (builtin.os.tag != .windows) return std.posix.recv(stream.handle, buf, 0);
    const rc = ws2.recv(stream.handle, buf.ptr, @intCast(@min(buf.len, std.math.maxInt(i32))), 0);
    if (rc == ws2.SOCKET_ERROR) return error.ReceiveFailed;
    return @intCast(rc);
}

fn sendAll(stream: std.net.Stream, bytes: []const u8) !void {
    var i: usize = 0;
    while (i < bytes.len) {
        if (builtin.os.tag != .windows) {
            i += try std.posix.send(stream.handle, bytes[i..], 0);
            continue;
        }
        const rc = ws2.send(stream.handle, bytes[i..].ptr, @intCast(@min(bytes.len - i, 1 << 20)), 0);
        if (rc == ws2.SOCKET_ERROR) return error.SendFailed;
        i += @intCast(rc);
    }
}

test "Accept-Encoding: gzip, x-gzip or *, unless q=0" {
    const yes = [_][]const u8{ "\r\nAccept-Encoding: gzip", "\r\naccept-encoding: br, gzip;q=0.5", "\r\nAccept-Encoding: *", "\r\nAccept-Encoding: x-gzip", "\r\nAccept-Encoding: gzip, deflate, br, zstd" };
    const no = [_][]const u8{ "", "\r\nAccept-Encoding: br, deflate", "\r\nAccept-Encoding: gzip;q=0", "\r\nAccept-Encoding: gzip; q=0.000", "\r\nAccept-Encoding: identity", "\r\nX-Accept-Encoding: gzip" };
    for (yes) |h| try std.testing.expect(acceptsGzip(h));
    for (no) |h| try std.testing.expect(!acceptsGzip(h));
}

test "decode refuses a malformed escape and decodes the rest" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    try std.testing.expectEqualStrings("/a/../b c", try decode(arena.allocator(), "/a/%2e%2E/b%20c"));
    try std.testing.expectError(error.BadEscape, decode(arena.allocator(), "/a%2"));
    try std.testing.expectError(error.BadEscape, decode(arena.allocator(), "/a%zz"));
}
