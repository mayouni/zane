//! core.zig: the Zane verifier core, in Zig.
//!
//! Lexer, parser and checks for the Zane language (doc/language/ v1.5), the third evaluator of the law
//! (doc/design/BINARY.md, stage S1). It is PURE: it takes a source string and an allocator and returns the
//! diagnostics in source order. No file system, no clock, no network, no global state, so the same code
//! compiles to a native executable and to wasm32-freestanding.
//!
//! It is written against the 73 fixtures and the grammar, and proved against tools/zane/zane.js by byte
//! parity (tools/zane/parity.js). Its tables are written HERE, independently of conformance/media.json and
//! conformance/signal.json, and `zane conformance` (stage S2) will check them against that data: a third
//! evaluator that derived its tables from the data would agree with the data by construction.
//!
//! Domain of parity: well-formed UTF-8, which the caller makes of any bytes as Node does (wellFormed, below).
//! Node holds a source as UTF-16, so a character outside the Basic Multilingual Plane is two code units there and
//! two findings here, each subject a lone surrogate kept as WTF-8 for the writers to print as JavaScript does.

const std = @import("std");
const Allocator = std.mem.Allocator;

// ---- the language, from doc/language/GRAMMAR.md ----------------------------------------------------------

pub const intent_verbs = [_][]const u8{
    "DISCOVER", "UNDERSTAND", "LOCATE",
    "FOCUS",    "FILTER",     "COMPARE",
    "READ",     "SCAN",       "SCROLL",
    "ZOOM",     "SELECT",     "HIGHLIGHT",
    "PREVIEW",  "MARK",       "ACT",
    "CONFIRM",  "CANCEL",     "UNDO",
    "PAUSE",    "RESUME",     "RETRY",
    "EXIT",
};

pub const zane_kinds = [_][]const u8{
    "INTENT_FLOW", "FORM",        "WIZARD",      "SCREEN",   "COMPONENT",
    "NAV_GRAPH",   "WORLD_VIEW",  "INTERACTION", "FEEDBACK", "VIBE",
};

/// Recognised by the reference implementation, not defined by the language: reported as UNSPECIFIED_DECLARATION.
const unspecified_kinds = [_][]const u8{ "WIDGET", "USER" };

const ref_list_keys = [_][]const u8{
    "SATISFIES", "ALWAYS_REACHABLE", "VISIBLE_ENTITIES", "VISIBLE_STATE", "INTENT_FLOWS",
    "STEPS",     "REPORTS",          "SUPPRESSES",       "SIGNALS",
};
const kv_keys = [_][]const u8{ "INTENT_FLOW", "PERSPECTIVE", "TONE", "SURFACE_AS", "DENSITY", "MOTION", "ACTOR", "ROLE" };

const perspectives = [_][]const u8{ "top_down", "isometric", "first_person", "side_scroll" };
const tones = [_][]const u8{ "celebratory", "cautionary", "critical", "neutral", "informational" };
/// Rule 118's family one, closed at five. Not the TONE axis.
pub const signals = [_][]const u8{ "success", "warning", "danger", "info", "muted" };
const roles = [_][]const u8{ "inert", "navigate", "reversible", "irreversible", "proposal" };
const role_host = "INTERACTION";
const expression_keys = [_][]const u8{ "SIGNALS", "ROLE" };
const flow_kinds = [_][]const u8{ "INTENT_FLOW", "WIZARD" };

/// The medium a VIBE projects to, and the verbs it cannot carry at all. Only ABSENT raises a diagnostic.
pub const Medium = struct {
    name: []const u8,
    /// true: every verb is absent except `keep`. false: only `absent` is absent.
    default_absent: bool,
    keep: []const []const u8 = &.{},
    absent: []const []const u8 = &.{},
};
pub const media = [_]Medium{
    .{ .name = "visual", .default_absent = false },
    .{ .name = "auditory", .default_absent = false, .absent = &.{"ZOOM"} },
    .{ .name = "voice", .default_absent = false, .absent = &.{"ZOOM"} },
    .{ .name = "haptic", .default_absent = true, .keep = &.{ "CONFIRM", "RETRY" } },
    .{ .name = "print", .default_absent = true, .keep = &.{ "DISCOVER", "UNDERSTAND", "LOCATE", "READ", "SCAN", "COMPARE" } },
    .{ .name = "luminous", .default_absent = true, .keep = &.{ "DISCOVER", "UNDERSTAND" } },
    .{ .name = "signage", .default_absent = true, .keep = &.{ "LOCATE", "DISCOVER", "UNDERSTAND" } },
    .{ .name = "machine", .default_absent = false },
    .{ .name = "spatial", .default_absent = false },
    .{ .name = "terminal", .default_absent = false },
};

/// Which semantic values a medium renders as nothing at all. Only the two channels with a shipped renderer.
pub const SignalAbsence = struct { medium: []const u8, silent: []const []const u8 };
pub const signal_absence = [_]SignalAbsence{
    .{ .medium = "auditory", .silent = &.{"muted"} },
    .{ .medium = "voice", .silent = &.{"muted"} },
};

const KindFields = struct { kind: []const u8, fields: []const []const u8 };
/// Fields per kind (ruling D1, 2026-10-31), in the order the language lists the kinds.
pub const kind_fields = [_]KindFields{
    .{ .kind = "INTENT_FLOW", .fields = &.{} },
    .{ .kind = "FORM", .fields = &.{"INTENT_FLOW"} },
    .{ .kind = "WIZARD", .fields = &.{"STEPS"} },
    .{ .kind = "SCREEN", .fields = &.{} },
    .{ .kind = "COMPONENT", .fields = &.{} },
    .{ .kind = "NAV_GRAPH", .fields = &.{"VISIBLE_STATE"} },
    .{ .kind = "WORLD_VIEW", .fields = &.{ "PERSPECTIVE", "VISIBLE_ENTITIES" } },
    .{ .kind = "INTERACTION", .fields = &.{"ROLE"} },
    .{ .kind = "FEEDBACK", .fields = &.{ "TONE", "REPORTS", "MOTION" } },
    .{ .kind = "VIBE", .fields = &.{ "DENSITY", "SURFACE_AS", "MOTION", "REPORTS", "SUPPRESSES" } },
};
const universal_fields = [_][]const u8{ "SATISFIES", "ALWAYS_REACHABLE", "SIGNALS", "ACTOR" };
/// Read on any kind, so the silence that D1 forbids does not reach them.
const read_on_any_kind = [_][]const u8{ "STEPS", "INTENT_FLOW", "VISIBLE_STATE", "VISIBLE_ENTITIES" };

fn has(set: []const []const u8, s: []const u8) bool {
    for (set) |x| if (std.mem.eql(u8, x, s)) return true;
    return false;
}

// ---- the result ------------------------------------------------------------------------------------------

/// One finding. `subject` null is the one JavaScript `null` (an unterminated string), kept as null so the
/// JSON output can say so exactly as the JavaScript does.
pub const Diag = struct { id: []const u8, line: u32, subject: ?[]const u8 };

/// The level-3 symbol table: a field is present only when the file carried that key as an array.
pub const Symbols = struct {
    entities: ?[]const []const u8 = null,
    actors: ?[]const []const u8 = null,
    state: ?[]const []const u8 = null,
    elements: ?[]const []const u8 = null,
};

// ---- the lexer -------------------------------------------------------------------------------------------

const TokType = enum { ident, string, number, punct, eof };
const Token = struct { t: TokType, v: []const u8, line: u32 };

const replacement = "\xEF\xBF\xBD";

fn isIdentStart(c: u8) bool {
    return (c >= 'A' and c <= 'Z') or (c >= 'a' and c <= 'z') or c == '_';
}
fn isIdentPart(c: u8) bool {
    return isIdentStart(c) or (c >= '0' and c <= '9');
}
fn isDigit(c: u8) bool {
    return c >= '0' and c <= '9';
}

const Lexed = struct { tokens: []Token };

fn lex(a: Allocator, src_all: []const u8, diags: *std.ArrayList(Diag)) !Lexed {
    var tokens: std.ArrayList(Token) = .empty;
    var i: usize = 0;
    var line: u32 = 1;
    // a UTF-8 byte-order mark is not content
    if (src_all.len >= 3 and src_all[0] == 0xEF and src_all[1] == 0xBB and src_all[2] == 0xBF) i = 3;
    const src = src_all;

    while (i < src.len) {
        const c = src[i];
        if (c == '\n') {
            line += 1;
            i += 1;
            continue;
        }
        if (c == ' ' or c == '\t' or c == '\r') {
            i += 1;
            continue;
        }
        // comments run to the end of the line; there is no block comment
        if (c == '/' and i + 1 < src.len and src[i + 1] == '/') {
            while (i < src.len and src[i] != '\n') i += 1;
            continue;
        }
        if (c == '(' or c == ')' or c == '[' or c == ']' or c == ',') {
            try tokens.append(a, .{ .t = .punct, .v = src[i .. i + 1], .line = line });
            i += 1;
            continue;
        }
        if (c == '"') {
            const start = i;
            const start_line = line;
            i += 1;
            while (i < src.len and src[i] != '"') {
                if (src[i] == '\n') line += 1;
                i += 1;
            }
            if (i >= src.len) {
                try diags.append(a, .{ .id = "UNTERMINATED_STRING", .line = start_line, .subject = null });
                break;
            }
            try tokens.append(a, .{ .t = .string, .v = src[start + 1 .. i], .line = start_line });
            i += 1;
            continue;
        }
        if (isDigit(c) or (c == '-' and i + 1 < src.len and isDigit(src[i + 1]))) {
            const start = i;
            if (c == '-') i += 1;
            while (i < src.len and (isDigit(src[i]) or src[i] == '.')) i += 1;
            try tokens.append(a, .{ .t = .number, .v = src[start..i], .line = line });
            continue;
        }
        if (isIdentStart(c)) {
            const start = i;
            while (i < src.len and isIdentPart(src[i])) i += 1;
            try tokens.append(a, .{ .t = .ident, .v = src[start..i], .line = line });
            continue;
        }
        // anything else is one character the language does not have; a multi-byte one is still one character
        if (c < 0x80) {
            try diags.append(a, .{ .id = "UNEXPECTED_CHARACTER", .line = line, .subject = src[i .. i + 1] });
            i += 1;
            continue;
        }
        var n: usize = 1;
        if (c >= 0xC2 and c <= 0xDF) n = 2 else if (c >= 0xE0 and c <= 0xEF) n = 3 else if (c >= 0xF0 and c <= 0xF7) n = 4;
        var ok = n > 1 and i + n <= src.len;
        if (ok) {
            var k: usize = 1;
            while (k < n) : (k += 1) if ((src[i + k] & 0xC0) != 0x80) {
                ok = false;
                break;
            };
        }
        if (!ok) {
            try diags.append(a, .{ .id = "UNEXPECTED_CHARACTER", .line = line, .subject = replacement });
            i += 1;
        } else if (n == 4) {
            // outside the BMP: two UTF-16 units in the JavaScript, each its own finding with a lone surrogate as its
            // subject. Each is kept as WTF-8 (three bytes, ED A0..BF xx); the writers print it as JavaScript does
            const cp: u21 = (@as(u21, c & 0x07) << 18) | (@as(u21, src[i + 1] & 0x3F) << 12) | (@as(u21, src[i + 2] & 0x3F) << 6) | (src[i + 3] & 0x3F);
            const units = [2]u16{ @intCast(0xD800 + ((cp - 0x10000) >> 10)), @intCast(0xDC00 + ((cp - 0x10000) & 0x3FF)) };
            for (units) |u| {
                const b = try a.alloc(u8, 3);
                b[0] = @intCast(0xE0 | (u >> 12));
                b[1] = @intCast(0x80 | ((u >> 6) & 0x3F));
                b[2] = @intCast(0x80 | (u & 0x3F));
                try diags.append(a, .{ .id = "UNEXPECTED_CHARACTER", .line = line, .subject = b });
            }
            i += n;
        } else {
            try diags.append(a, .{ .id = "UNEXPECTED_CHARACTER", .line = line, .subject = src[i .. i + n] });
            i += n;
        }
    }
    try tokens.append(a, .{ .t = .eof, .v = "", .line = line });
    return .{ .tokens = try tokens.toOwnedSlice(a) };
}

// ---- the parser ------------------------------------------------------------------------------------------

const Item = struct { v: []const u8, line: u32 };
const FieldKind = enum { list, value };
const Field = struct {
    key: []const u8,
    kind: FieldKind,
    items: []const Item = &.{},
    value: ?[]const u8 = null,
    line: u32,
};
const Decl = struct {
    kind: []const u8,
    name: ?[]const u8,
    line: u32,
    fields: []const Field,

    /// The first field of a key: a duplicate is reported and never replaces the first.
    fn index(self: Decl, key: []const u8) ?Field {
        for (self.fields) |f| if (std.mem.eql(u8, f.key, key)) return f;
        return null;
    }
    fn hasField(self: Decl, key: []const u8) bool {
        return self.index(key) != null;
    }
    /// The items of a list field, or null when it is absent or not a list.
    fn listOf(self: Decl, key: []const u8) ?[]const Item {
        const f = self.index(key) orelse return null;
        return if (f.kind == .list) f.items else null;
    }
    fn valueOf(self: Decl, key: []const u8) ?[]const u8 {
        const f = self.index(key) orelse return null;
        return if (f.kind == .value) f.value else null;
    }
};

const Parser = struct {
    a: Allocator,
    tokens: []const Token,
    p: usize = 0,
    diags: *std.ArrayList(Diag),

    fn peek(self: *Parser) Token {
        return self.tokens[@min(self.p, self.tokens.len - 1)];
    }
    fn isPunct(tok: Token, v: u8) bool {
        return tok.t == .punct and tok.v[0] == v;
    }
    fn fmt(self: *Parser, comptime f: []const u8, args: anytype) ![]const u8 {
        return std.fmt.allocPrint(self.a, f, args);
    }
    fn diag(self: *Parser, id: []const u8, line: u32, subject: ?[]const u8) !void {
        try self.diags.append(self.a, .{ .id = id, .line = line, .subject = subject });
    }

    /// A declaration of another pillar: skip its body without judging it.
    fn skipBalanced(self: *Parser) void {
        var depth: i32 = 0;
        while (self.peek().t != .eof) {
            const tok = self.peek();
            if (isPunct(tok, '(')) {
                depth += 1;
            } else if (isPunct(tok, ')')) {
                depth -= 1;
                self.p += 1;
                if (depth == 0) return;
                continue;
            }
            self.p += 1;
        }
    }

    fn run(self: *Parser) ![]Decl {
        var decls: std.ArrayList(Decl) = .empty;
        while (self.peek().t != .eof) {
            const tok = self.peek();
            if (tok.t == .ident and std.mem.eql(u8, tok.v, "DEFINE")) {
                const def_line = tok.line;
                self.p += 1;
                const kind_tok = self.peek();
                if (kind_tok.t != .ident) {
                    try self.diag("SYNTAX_ERROR", kind_tok.line, "expected a declaration kind after DEFINE");
                    self.p += 1;
                    continue;
                }
                const kind = kind_tok.v;
                self.p += 1;

                const name_tok = self.peek();
                const name: ?[]const u8 = if (name_tok.t == .ident) name_tok.v else null;
                if (name == null) {
                    try self.diag("SYNTAX_ERROR", name_tok.line, try self.fmt("expected a name after DEFINE {s}", .{kind}));
                } else {
                    self.p += 1;
                }

                // not ours, and not a near-miss we owe a warning for: skip it whole
                if (!has(&zane_kinds, kind) and !has(&unspecified_kinds, kind)) {
                    if (isPunct(self.peek(), '(')) self.skipBalanced();
                    continue;
                }

                var fields: std.ArrayList(Field) = .empty;
                if (!isPunct(self.peek(), '(')) {
                    const tail = if (name) |n| try self.fmt("{s} {s}", .{ kind, n }) else try self.fmt("{s} ", .{kind});
                    try self.diag("SYNTAX_ERROR", self.peek().line, try self.fmt("expected ( after {s}", .{std.mem.trim(u8, tail, " \t\r\n")}));
                    try decls.append(self.a, .{ .kind = kind, .name = name, .line = def_line, .fields = &.{} });
                    continue;
                }
                self.p += 1; // consume (

                while (self.peek().t != .eof and !isPunct(self.peek(), ')')) {
                    const key_tok = self.peek();
                    if (key_tok.t != .ident) {
                        try self.diag("SYNTAX_ERROR", key_tok.line, "expected a field name");
                        self.p += 1;
                        continue;
                    }
                    const key = key_tok.v;
                    self.p += 1;

                    var field: Field = undefined;
                    if (isPunct(self.peek(), '[')) {
                        self.p += 1;
                        var items: std.ArrayList(Item) = .empty;
                        while (self.peek().t != .eof and !isPunct(self.peek(), ']')) {
                            const item_tok = self.peek();
                            if (item_tok.t == .ident) {
                                try items.append(self.a, .{ .v = item_tok.v, .line = item_tok.line });
                            } else if (!isPunct(item_tok, ',')) {
                                try self.diag("SYNTAX_ERROR", item_tok.line, try self.fmt("unexpected value in {s} list", .{key}));
                            }
                            self.p += 1;
                        }
                        if (isPunct(self.peek(), ']')) self.p += 1;
                        field = .{ .key = key, .kind = .list, .items = try items.toOwnedSlice(self.a), .line = key_tok.line };
                        if (!has(&ref_list_keys, key)) try self.diag("UNKNOWN_FIELD", key_tok.line, key);
                    } else {
                        const val_tok = self.peek();
                        var value: ?[]const u8 = null;
                        if (val_tok.t == .ident or val_tok.t == .string or val_tok.t == .number) {
                            value = val_tok.v;
                            self.p += 1;
                        } else {
                            try self.diag("SYNTAX_ERROR", val_tok.line, try self.fmt("expected a value for {s}", .{key}));
                        }
                        field = .{ .key = key, .kind = .value, .value = value, .line = key_tok.line };
                        if (!has(&kv_keys, key)) try self.diag("UNKNOWN_FIELD", key_tok.line, key);
                    }

                    var seen = false;
                    for (fields.items) |f| if (std.mem.eql(u8, f.key, key)) {
                        seen = true;
                        break;
                    };
                    try fields.append(self.a, field);
                    if (seen) {
                        const tail = if (name) |n| try self.fmt("{s} in {s} {s}", .{ key, kind, n }) else try self.fmt("{s} in {s} ", .{ key, kind });
                        try self.diag("DUPLICATE_FIELD", key_tok.line, std.mem.trim(u8, tail, " \t\r\n"));
                    }

                    if (isPunct(self.peek(), ',')) self.p += 1; // a trailing comma is legal
                }

                if (isPunct(self.peek(), ')')) {
                    self.p += 1;
                } else {
                    const tail = if (name) |n| try self.fmt("{s} {s}", .{ kind, n }) else try self.fmt("{s} ", .{kind});
                    try self.diag("SYNTAX_ERROR", self.peek().line, try self.fmt("unclosed declaration {s}", .{std.mem.trim(u8, tail, " \t\r\n")}));
                }
                try decls.append(self.a, .{ .kind = kind, .name = name, .line = def_line, .fields = try fields.toOwnedSlice(self.a) });
                continue;
            }
            // anything outside a declaration is noise we cannot interpret
            try self.diag("SYNTAX_ERROR", tok.line, try self.fmt("unexpected {s}", .{tok.v}));
            self.p += 1;
        }
        return decls.toOwnedSlice(self.a);
    }
};

// ---- the checks ------------------------------------------------------------------------------------------

const Checker = struct {
    a: Allocator,
    out: *std.ArrayList(Diag),

    fn add(self: *Checker, id: []const u8, line: u32, subject: []const u8) !void {
        try self.out.append(self.a, .{ .id = id, .line = line, .subject = subject });
    }
    fn fmt(self: *Checker, comptime f: []const u8, args: anytype) ![]const u8 {
        return std.fmt.allocPrint(self.a, f, args);
    }
};

fn itemsHave(items: ?[]const Item, v: []const u8) bool {
    const list = items orelse return false;
    for (list) |x| if (std.mem.eql(u8, x.v, v)) return true;
    return false;
}

fn symHas(list: []const []const u8, v: []const u8) bool {
    for (list) |x| if (std.mem.eql(u8, x, v)) return true;
    return false;
}

fn mediumNotCarried(m: Medium, v: []const u8) bool {
    if (m.default_absent) return !has(m.keep, v);
    return has(m.absent, v);
}

fn findMedium(name: []const u8) ?Medium {
    for (media) |m| if (std.mem.eql(u8, m.name, name)) return m;
    return null;
}

fn check(a: Allocator, decls: []const Decl, symbols: ?Symbols, out: *std.ArrayList(Diag)) !void {
    var c = Checker{ .a = a, .out = out };
    var seen_names: std.ArrayList([]const u8) = .empty;

    // every ALWAYS_REACHABLE promise made anywhere in the file
    var guaranteed: std.ArrayList([]const u8) = .empty;
    for (decls) |d| if (d.listOf("ALWAYS_REACHABLE")) |l| for (l) |it| try guaranteed.append(a, it.v);

    // every medium a VIBE in this file projects to, collected file-wide, duplicates kept
    var declared_media: std.ArrayList([]const u8) = .empty;
    for (decls) |d| {
        if (!std.mem.eql(u8, d.kind, "VIBE")) continue;
        if (d.valueOf("SURFACE_AS")) |m| if (findMedium(m) != null) try declared_media.append(a, m);
    }
    var declared_flows: std.ArrayList([]const u8) = .empty;
    for (decls) |d| if (std.mem.eql(u8, d.kind, "INTENT_FLOW")) if (d.name) |n| try declared_flows.append(a, n);

    for (decls) |decl| {
        const kind = decl.kind;
        const line = decl.line;
        const label: []const u8 = decl.name orelse "(unnamed)";

        // -- level 1 --
        if (has(&unspecified_kinds, kind)) {
            try c.add("UNSPECIFIED_DECLARATION", line, try c.fmt("{s} {s}", .{ kind, label }));
            continue; // not ours to check further
        }

        if (decl.name) |n| {
            const name_key = try c.fmt("{s} {s}", .{ kind, n });
            if (symHas(seen_names.items, name_key)) {
                try c.add("DUPLICATE_DECLARATION", line, name_key);
            } else {
                try seen_names.append(a, name_key);
            }
        }

        for ([_][]const u8{ "SATISFIES", "ALWAYS_REACHABLE", "SUPPRESSES" }) |key| {
            const f = decl.index(key) orelse continue;
            if (f.kind != .list) continue;
            for (f.items) |item| {
                if (!has(&intent_verbs, item.v)) try c.add("UNKNOWN_INTENT", item.line, try c.fmt("{s} in {s} of {s}", .{ item.v, key, label }));
            }
        }

        // the SIGNAL vocabulary is closed the way the verbs and the media are
        if (decl.index("SIGNALS")) |f| {
            if (f.kind == .list) {
                for (f.items) |item| {
                    if (!has(&signals, item.v)) try c.add("UNKNOWN_SIGNAL", item.line, try c.fmt("{s} in SIGNALS of {s}", .{ item.v, label }));
                }
            }
        }

        // -- level 2 --
        const satisfies_list = decl.listOf("SATISFIES");
        const reachable_list = decl.listOf("ALWAYS_REACHABLE");
        const satisfies_n: usize = if (satisfies_list) |l| l.len else 0;
        const acts = itemsHave(satisfies_list, "ACT");
        const reach = struct {
            fn has(l: ?[]const Item, v: []const u8) bool {
                return itemsHave(l, v);
            }
        };

        if (std.mem.eql(u8, kind, "INTENT_FLOW") and !decl.hasField("SATISFIES")) {
            try c.add("INTENT_FLOW_NO_SATISFIES", line, label);
        }

        // expression is intent's refinement, never a second language beside it
        for (expression_keys) |key| {
            const f = decl.index(key) orelse continue;
            const non_empty = f.kind != .list or f.items.len > 0;
            if (non_empty and satisfies_n == 0) {
                try c.add("EXPRESSION_ORPHAN", f.line, try c.fmt("{s} on {s} traces to no intent", .{ key, label }));
            }
        }

        if (itemsHave(satisfies_list, "SELECT") and acts and !itemsHave(satisfies_list, "CONFIRM")) {
            try c.add("SELECT_ACT_COLLAPSE", line, label);
        }
        if (itemsHave(satisfies_list, "READ") and acts) try c.add("READ_ACT_COLLAPSE", line, label);

        // Rule 79: every act has a reachable undo, or declares why it cannot (ROLE irreversible)
        const role_val = decl.valueOf("ROLE");
        const role_irreversible = role_val != null and std.mem.eql(u8, role_val.?, "irreversible");
        if (acts and !reach.has(reachable_list, "UNDO") and !role_irreversible) try c.add("MISSING_UNDO", line, label);
        if (has(&flow_kinds, kind) and acts and !reach.has(reachable_list, "CANCEL")) try c.add("MISSING_CANCEL", line, label);

        const multi_step = std.mem.eql(u8, kind, "WIZARD") or decl.hasField("STEPS");
        if (multi_step and !reach.has(reachable_list, "EXIT")) try c.add("TRAPPED_FLOW", line, label);

        // a field on a kind that does not declare it is ignored where it sits; ROLE is left to ROLE_MISPLACED
        for (decl.fields) |f| {
            const known = if (f.kind == .list) has(&ref_list_keys, f.key) else has(&kv_keys, f.key);
            if (!known) continue; // UNKNOWN_FIELD owns it
            var legal: []const []const u8 = &.{};
            var kind_known = false;
            for (kind_fields) |kf| if (std.mem.eql(u8, kf.kind, kind)) {
                legal = kf.fields;
                kind_known = true;
            };
            if (!kind_known) continue;
            if (has(&universal_fields, f.key) or has(legal, f.key) or has(&read_on_any_kind, f.key)) continue;
            if (std.mem.eql(u8, f.key, "ROLE")) continue; // owned by ROLE_MISPLACED
            var homes: std.ArrayList(u8) = .empty;
            var n_homes: usize = 0;
            for (kind_fields) |kf| if (has(kf.fields, f.key)) {
                if (n_homes > 0) try homes.appendSlice(a, ", ");
                try homes.appendSlice(a, kf.kind);
                n_homes += 1;
            };
            const tail = if (n_homes > 0) try c.fmt("it belongs to {s}", .{homes.items}) else "no kind declares it";
            try c.add("FIELD_MISPLACED", f.line, try c.fmt("{s} on {s} {s}; {s}", .{ f.key, kind, label, tail }));
        }

        if (std.mem.eql(u8, kind, "WORLD_VIEW")) {
            if (decl.valueOf("PERSPECTIVE")) |persp| {
                if (!has(&perspectives, persp)) try c.add("INVALID_PERSPECTIVE", line, try c.fmt("{s} on {s}", .{ persp, label }));
            }
        }

        // -- ROLE: the promise a control makes --
        if (role_val) |role| {
            const role_line = if (decl.index("ROLE")) |f| f.line else line;
            if (!has(&roles, role)) {
                try c.add("UNKNOWN_ROLE", role_line, try c.fmt("{s} on {s}", .{ role, label }));
            } else if (!std.mem.eql(u8, kind, role_host)) {
                try c.add("ROLE_MISPLACED", role_line, try c.fmt("ROLE on {s} {s}; a role belongs to an {s}", .{ kind, label, role_host }));
            } else {
                if ((std.mem.eql(u8, role, "inert") or std.mem.eql(u8, role, "navigate")) and acts) {
                    try c.add("ROLE_ACTS_WITHOUT_CONSEQUENCE", role_line, try c.fmt("{s} {s} satisfies ACT", .{ role, label }));
                }
                if (std.mem.eql(u8, role, "reversible") and !reach.has(reachable_list, "UNDO") and !acts) {
                    try c.add("ROLE_PROMISE_BROKEN", role_line, try c.fmt("reversible {s} keeps no reachable UNDO", .{label}));
                }
                if (std.mem.eql(u8, role, "irreversible") and (reach.has(reachable_list, "UNDO") or itemsHave(satisfies_list, "UNDO"))) {
                    try c.add("IRREVERSIBLE_CLAIMS_UNDO", role_line, try c.fmt("irreversible {s} declares UNDO", .{label}));
                }
                if (std.mem.eql(u8, role, "proposal") and acts and decl.valueOf("ACTOR") == null) {
                    try c.add("PROPOSAL_COMMITS", role_line, try c.fmt("proposal {s} acts and names no ACTOR", .{label}));
                }
            }
        }

        if (std.mem.eql(u8, kind, "FEEDBACK")) {
            const tone = decl.valueOf("TONE");
            if (tone) |t| if (!has(&tones, t)) try c.add("INVALID_TONE", line, try c.fmt("{s} on {s}", .{ t, label }));
            const reports = decl.listOf("REPORTS");
            const says_something = tone != null or decl.valueOf("MOTION") != null;
            if (says_something and (reports == null or reports.?.len == 0)) try c.add("DECORATIVE_ANIMATION", line, label);
        }

        if (std.mem.eql(u8, kind, "VIBE")) {
            const motion = decl.valueOf("MOTION");
            const reports = decl.listOf("REPORTS");
            // MOTION none is lawful and common; motion that moves must report
            if (motion != null and !std.mem.eql(u8, motion.?, "none") and (reports == null or reports.?.len == 0)) {
                try c.add("DECORATIVE_ANIMATION", line, label);
            }
            if (decl.listOf("SUPPRESSES")) |sup| for (sup) |it| {
                if (symHas(guaranteed.items, it.v)) try c.add("VIBE_STRIPS_RIGHT", line, try c.fmt("{s} suppressed by {s}", .{ it.v, label }));
            };
            if (decl.valueOf("SURFACE_AS")) |surface| {
                if (findMedium(surface) == null) try c.add("UNKNOWN_MEDIUM", line, try c.fmt("{s} on {s}", .{ surface, label }));
            }
        }

        if (decl.valueOf("INTENT_FLOW")) |flow_ref| {
            if (!symHas(declared_flows.items, flow_ref)) try c.add("UNRESOLVED_INTENT_FLOW", line, try c.fmt("{s} referenced by {s}", .{ flow_ref, label }));
        }

        // -- level 3: only when the symbol table supplies what the check needs; absent input is silence --
        if (symbols) |s| {
            if (s.actors != null and acts and decl.valueOf("ACTOR") == null) try c.add("HIDDEN_AUTHORITY", line, label);
            if (s.entities) |ents| {
                if (decl.index("VISIBLE_ENTITIES")) |f| for (f.items) |item| {
                    if (!symHas(ents, item.v)) try c.add("UNRESOLVED_ENTITY", item.line, try c.fmt("{s} in {s}", .{ item.v, label }));
                };
            }
        }
    }

    // -- level 2, file-wide: the medium axis --
    for (declared_media.items) |mname| {
        const m = findMedium(mname).?;
        for (decls) |decl| {
            const label: []const u8 = decl.name orelse "(unnamed)";
            for ([_][]const u8{ "SATISFIES", "ALWAYS_REACHABLE" }) |key| {
                if (decl.listOf(key)) |l| for (l) |it| {
                    if (mediumNotCarried(m, it.v)) try c.add("VERB_NOT_CARRIED", decl.line, try c.fmt("{s} in {s} on {s}", .{ it.v, label, mname }));
                };
            }
        }
    }

    // Rule 82 meeting the medium axis: every declared value renders as absence in the declared medium
    for (declared_media.items) |mname| {
        var silent: []const []const u8 = &.{};
        for (signal_absence) |sa| if (std.mem.eql(u8, sa.medium, mname)) {
            silent = sa.silent;
        };
        if (silent.len == 0) continue;
        for (decls) |decl| {
            const f = decl.index("SIGNALS") orelse continue;
            if (f.kind != .list or f.items.len == 0) continue;
            var declared: std.ArrayList(u8) = .empty;
            var n_declared: usize = 0;
            var all_silent = true;
            for (f.items) |it| {
                if (!has(&signals, it.v)) continue; // UNKNOWN_SIGNAL owns that
                if (n_declared > 0) try declared.appendSlice(a, ", ");
                try declared.appendSlice(a, it.v);
                n_declared += 1;
                if (!has(silent, it.v)) all_silent = false;
            }
            if (n_declared == 0) continue;
            if (all_silent) {
                const label: []const u8 = decl.name orelse "(unnamed)";
                try c.add("SIGNAL_UNPERCEIVABLE", f.line, try c.fmt("{s} in {s} on {s}", .{ declared.items, label, mname }));
            }
        }
    }

    // -- level 2, file-wide: the counter-check, advisory and never a refusal --
    {
        var interactions: usize = 0;
        var roled = false;
        for (decls) |d| if (std.mem.eql(u8, d.kind, role_host)) {
            interactions += 1;
            if (d.hasField("ROLE")) roled = true;
        };
        if (interactions > 0 and !roled) {
            try c.add("ROLE_UNDECLARED", 0, try c.fmt("{d} INTERACTION{s}, no ROLE", .{ interactions, if (interactions == 1) "" else "s" }));
        }
    }

    // -- level 3, file-wide --
    if (symbols) |s| {
        if (s.elements) |els| {
            var traced: std.ArrayList([]const u8) = .empty;
            for (decls) |d| if (d.listOf("SATISFIES")) |l| if (l.len > 0) if (d.name) |n| try traced.append(a, n);
            for (els) |el| if (!symHas(traced.items, el)) try c.add("INTENT_ORPHAN", 0, el);
        }
        if (s.state) |st| {
            var shown: std.ArrayList([]const u8) = .empty;
            for (decls) |d| if (d.listOf("VISIBLE_STATE")) |l| for (l) |it| try shown.append(a, it.v);
            for (st) |x| if (!symHas(shown.items, x)) try c.add("INVISIBLE_STATE", 0, x);
        }
    }
}

// ---- the public surface ----------------------------------------------------------------------------------

/// Verify one Zane source. Every allocation is made in `a`; pass an arena and free it once.
/// Any bytes as well-formed UTF-8, the way Node's readFileSync(file, 'utf8') reads them: the WHATWG decoder, where
/// each maximal ill-formed subpart becomes one U+FFFD and the byte that ended it is read again.
pub fn wellFormed(a: Allocator, s: []const u8) ![]const u8 {
    if (std.unicode.utf8ValidateSlice(s)) return s;
    var out: std.ArrayList(u8) = .empty;
    var i: usize = 0;
    while (i < s.len) {
        const b = s[i];
        var need: usize = 0;
        var lower: u8 = 0x80;
        var upper: u8 = 0xBF;
        switch (b) {
            0x00...0x7F => {
                try out.append(a, b);
                i += 1;
                continue;
            },
            0xC2...0xDF => need = 1,
            0xE0...0xEF => {
                need = 2;
                if (b == 0xE0) lower = 0xA0;
                if (b == 0xED) upper = 0x9F;
            },
            0xF0...0xF4 => {
                need = 3;
                if (b == 0xF0) lower = 0x90;
                if (b == 0xF4) upper = 0x8F;
            },
            else => {
                try out.appendSlice(a, "\xEF\xBF\xBD");
                i += 1;
                continue;
            },
        }
        var j = i + 1;
        var k: usize = 0;
        while (k < need and j < s.len and s[j] >= lower and s[j] <= upper) : ({
            j += 1;
            k += 1;
        }) {
            lower = 0x80;
            upper = 0xBF;
        }
        if (k == need) try out.appendSlice(a, s[i..j]) else try out.appendSlice(a, "\xEF\xBF\xBD");
        i = j;
    }
    return out.toOwnedSlice(a);
}

/// Returns the diagnostics in source order: the lexer's and parser's first, then the checks'.
pub fn verify(a: Allocator, source: []const u8, symbols: ?Symbols) ![]const Diag {
    var diags: std.ArrayList(Diag) = .empty;
    const lexed = try lex(a, source, &diags);
    var parser = Parser{ .a = a, .tokens = lexed.tokens, .diags = &diags };
    const decls = try parser.run();
    try check(a, decls, symbols, &diags);
    return diags.toOwnedSlice(a);
}
