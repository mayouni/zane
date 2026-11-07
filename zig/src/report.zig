//! The check's findings and its JSON report (the C2 envelope), shared by the executable (main.zig) and the wasm export
//! surface (wasm.zig), so the two targets print one report from one code (doc/design/BINARY.md section 3). Pure: no file
//! system, no clock; the caller hands in the bytes.

const std = @import("std");
const core = @import("core.zig");
const contract_mod = @import("contract.zig");

pub const Finding = struct {
    file: []const u8,
    diag: core.Diag,
    meta: contract_mod.Meta,
};

/// A symbol table read from its JSON text: entities, actors, state and elements, each a list of strings; anything else
/// is ignored, as cli.js ignores it.
pub fn symbolsOf(a: std.mem.Allocator, data: []const u8) !core.Symbols {
    const root = try std.json.parseFromSliceLeaky(std.json.Value, a, data, contract_mod.js_parse);
    var s: core.Symbols = .{};
    if (root != .object) return s;
    const keys = [_][]const u8{ "entities", "actors", "state", "elements" };
    inline for (keys) |k| {
        if (root.object.get(k)) |v| if (v == .array) {
            var list: std.ArrayList([]const u8) = .empty;
            for (v.array.items) |it| if (it == .string) try list.append(a, it.string);
            @field(s, k) = try list.toOwnedSlice(a);
        };
    }
    return s;
}

/// The findings of one source at the claimed level, appended in the verifier's order; a finding above the level is
/// dropped.
pub fn collect(
    a: std.mem.Allocator,
    contract: contract_mod.Contract,
    file: []const u8,
    raw_src: []const u8,
    symbols: ?core.Symbols,
    level: i64,
    findings: *std.ArrayList(Finding),
) !void {
    const diags = try core.verify(a, try core.wellFormed(a, raw_src), symbols);
    for (diags) |d| {
        const m = contract.meta(d.id);
        const m_level: i64 = if (m.level == 0) 1 else m.level;
        if (m_level > level) continue; // above the claimed level
        try findings.append(a, .{ .file = file, .diag = d, .meta = m });
    }
}

/// The number of findings whose severity is error.
pub fn errorCount(findings: []const Finding) usize {
    var errors: usize = 0;
    for (findings) |f| if (std.mem.eql(u8, f.meta.severity, "error")) {
        errors += 1;
    };
    return errors;
}

/// A lone surrogate (WTF-8, ED A0..BF xx) printed as console.log prints it: U+FFFD.
pub fn asText(a: std.mem.Allocator, s: []const u8) ![]const u8 {
    if (std.mem.indexOfScalar(u8, s, 0xED) == null) return s;
    var out: std.ArrayList(u8) = .empty;
    var i: usize = 0;
    while (i < s.len) {
        if (s[i] == 0xED and i + 2 < s.len and s[i + 1] >= 0xA0) {
            try out.appendSlice(a, "\xEF\xBF\xBD");
            i += 3;
        } else {
            try out.append(a, s[i]);
            i += 1;
        }
    }
    return out.toOwnedSlice(a);
}

/// The text report cli.js prints: one line per finding, its summary and its citation beneath, then the closing line
/// unless `quiet`. Shared by `zane check` and `zane site facts`, which re-runs the verifier on the site's declarations.
pub fn writeText(
    a: std.mem.Allocator,
    out: *std.Io.Writer,
    files: []const []const u8,
    contract: contract_mod.Contract,
    law: ?contract_mod.Law,
    level: i64,
    quiet: bool,
    findings: []const Finding,
) !void {
    const errors = errorCount(findings);
    const warnings = findings.len - errors;
    for (findings) |f| {
        const where = if (f.diag.line != 0) try std.fmt.allocPrint(a, "{s}:{d}", .{ f.file, f.diag.line }) else f.file;
        const header = try std.fmt.allocPrint(a, "{s}  {s}  {s}  {s}", .{ where, f.meta.severity, f.diag.id, f.diag.subject orelse "" });
        try out.print("{s}\n", .{try asText(a, contract_mod.trimJsEnd(header))});
        if (f.meta.summary) |s| if (s.len > 0) try out.print("    {s}\n", .{s});
        const cite = try contract_mod.citation(a, f.meta, law);
        if (cite.len > 0) try out.print("    {s}\n", .{cite});
    }
    if (quiet) return;
    if (findings.len == 0) {
        if (contract.constitution) |c| {
            try out.print("clean — {d} file(s), 0 violations at level {d} against Zane v{s}\n", .{ files.len, level, c });
        } else {
            try out.print("clean — {d} file(s), 0 violations at level {d}\n", .{ files.len, level });
        }
    } else {
        try out.print("\n{d} error(s), {d} warning(s) across {d} file(s) at level {d}\n", .{ errors, warnings, files.len, level });
    }
}

/// JSON.stringify({level, contract, files, counts, diagnostics}, null, 2), written by hand.
pub fn writeJson(
    a: std.mem.Allocator,
    w: *std.Io.Writer,
    files: []const []const u8,
    contract: contract_mod.Contract,
    level: i64,
    findings: []const Finding,
) !void {
    const j = contract_mod.writeJsonString;
    const errors = errorCount(findings);
    const warnings = findings.len - errors;
    try w.print("{{\n  \"level\": {d},\n", .{level});
    try w.writeAll("  \"contract\": {");
    var first = true;
    if (contract.version) |v| {
        try w.writeAll("\n    \"version\": ");
        try j(w, v);
        first = false;
    }
    if (contract.constitution) |c| {
        try w.writeAll(if (first) "\n    \"constitution\": " else ",\n    \"constitution\": ");
        try j(w, c);
        first = false;
    }
    try w.writeAll(if (first) "},\n" else "\n  },\n");
    try w.writeAll("  \"files\": [");
    for (files, 0..) |f, i| {
        try w.writeAll(if (i == 0) "\n    " else ",\n    ");
        try j(w, f);
    }
    try w.writeAll(if (files.len == 0) "],\n" else "\n  ],\n");
    try w.print("  \"counts\": {{\n    \"errors\": {d},\n    \"warnings\": {d}\n  }},\n", .{ errors, warnings });
    try w.writeAll("  \"diagnostics\": [");
    for (findings, 0..) |f, i| {
        try w.writeAll(if (i == 0) "\n    {\n" else ",\n    {\n");
        try w.writeAll("      \"code\": ");
        try j(w, f.diag.id);
        try w.writeAll(",\n      \"severity\": ");
        try j(w, f.meta.severity);
        try w.writeAll(",\n      \"message\": ");
        const message: []const u8 = blk: {
            if (f.meta.summary) |s| if (s.len > 0) break :blk s;
            if (f.diag.subject) |s| if (s.len > 0) break :blk try std.fmt.allocPrint(a, "{s}: {s}", .{ f.diag.id, s });
            break :blk f.diag.id;
        };
        try j(w, message);
        try w.writeAll(",\n      \"span\": {\n        \"file\": ");
        try j(w, f.file);
        try w.print(",\n        \"line\": {d}\n      }},\n", .{f.diag.line});
        // cites: rule:, article:, right:, pattern:
        var cites: std.ArrayList([]const u8) = .empty;
        for (f.meta.rules) |r| try cites.append(a, try std.fmt.allocPrint(a, "rule:{s}", .{r}));
        for (f.meta.articles) |x| try cites.append(a, try std.fmt.allocPrint(a, "article:{s}", .{x}));
        for (f.meta.rights) |x| try cites.append(a, try std.fmt.allocPrint(a, "right:{s}", .{x}));
        for (f.meta.forbidden_patterns) |x| try cites.append(a, try std.fmt.allocPrint(a, "pattern:{s}", .{x}));
        try w.writeAll("      \"cites\": [");
        for (cites.items, 0..) |c, k| {
            try w.writeAll(if (k == 0) "\n        " else ",\n        ");
            try j(w, c);
        }
        try w.writeAll(if (cites.items.len == 0) "],\n" else "\n      ],\n");
        try w.writeAll("      \"language\": \"zane\",\n");
        const lvl: i64 = if (f.meta.level == 0) 1 else f.meta.level;
        try w.print("      \"level\": {d},\n      \"subject\": ", .{lvl});
        if (f.diag.subject) |s| try j(w, s) else try w.writeAll("null");
        try w.writeAll("\n    }");
    }
    try w.writeAll(if (findings.len == 0) "]\n}\n" else "\n  ]\n}\n");
}
