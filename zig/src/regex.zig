//! regex.zig: the part of JavaScript's RegExp, and of its String methods, that this site's own build tools use
//! (tools/site-facts.js, tools/site-shell.js, tools/site-grid.js and doc/design/coverage-count.js), so that `zayn site
//! facts` and `zayn site shell` read a page with the same patterns those scripts read it with, written once, instead
//! of some eighty hand-made scanners that would each have to be proved equal to a pattern (doc/design/BINARY.md, S5).
//!
//! What it carries: alternation, groups (capturing, `(?:`, `(?=`, `(?!`, and `(?<=` `(?<!` over ONE character), the
//! quantifiers * + ? {n} {n,} {n,m}, greedy and lazy, classes with ranges and the escapes \d \w \s and their
//! negations, ^ $ \b \B, back-references \1 to \9, `.`, \n \r \t \f \v \0 \uXXXX \xHH, and the flags g, i and m.
//! Anything else in a pattern is refused (error.BadPattern), never read as something near it.
//!
//! How it differs from JavaScript, by design and named here:
//!   - the text is UTF-8 and a character is a code point, where JavaScript's is a UTF-16 code unit; the two differ only
//!     for a character outside the Basic Multilingual Plane met by `.` or a negated class, which these tools never
//!     split, and `length` below counts as JavaScript counts;
//!   - the i flag folds ASCII letters only; JavaScript also folds Latin-1 letters, which no pattern of the tools
//!     contains (every one is ASCII), and a non-ASCII character never folds to an ASCII one in either;
//!   - a lookbehind holds one character, which is all the tools use; a longer one is refused.
//! \s is JavaScript's set exactly: the ASCII spaces and line ends, U+00A0, U+1680, U+2000-U+200A, U+2028, U+2029,
//! U+202F, U+205F, U+3000 and U+FEFF.

const std = @import("std");
const Allocator = std.mem.Allocator;

pub const Error = error{ BadPattern, OutOfMemory };

const Range = struct { lo: u21, hi: u21 };
const Class = struct {
    neg: bool = false,
    ranges: []const Range = &.{},
    d: bool = false,
    w: bool = false,
    s: bool = false,
    nd: bool = false,
    nw: bool = false,
    ns: bool = false,
};
const Group = struct { alts: []const []const Node, cap: u8 };
const Look = struct { alts: []const []const Node, ahead: bool, neg: bool, caps: bool = false };
const Repeat = struct { node: *const Node, min: u32, max: u32, greedy: bool };
const inf = std.math.maxInt(u32);

const Node = union(enum) {
    class: Class,
    lit: u21,
    any,
    bol,
    eol,
    wordb,
    nwordb,
    group: Group,
    look: Look,
    backref: u8,
    repeat: Repeat,
};

pub const max_groups = 15;

pub const Regex = struct {
    alts: []const []const Node,
    groups: u8,
    global: bool,
    icase: bool,
    multiline: bool,
    /// the bytes a match can begin with (ASCII, or the lead byte of a longer character), so the scan skips the others;
    /// null when the pattern can begin anywhere
    first: ?[256]bool,
    /// a lookahead holds a capture: its captures may outlive a failed attempt, so they are cleared before each one
    look_caps: bool = false,
};

pub const Span = struct { s: usize, e: usize };
pub const Match = struct {
    start: usize,
    end: usize,
    caps: [max_groups + 1]?Span,
    /// the text of group i (0 is the whole match); null when the group took no part, as JavaScript's undefined
    pub fn get(m: Match, text: []const u8, i: usize) ?[]const u8 {
        if (i == 0) return text[m.start..m.end];
        const c = m.caps[i] orelse return null;
        return text[c.s..c.e];
    }
};

// ---- characters ---------------------------------------------------------------------------------------------

const Cp = struct { cp: u21, len: usize };

/// One code point at `pos`; a byte that does not begin a well-formed sequence is one character on its own.
pub fn decode(t: []const u8, pos: usize) Cp {
    const b = t[pos];
    if (b < 0x80) return .{ .cp = b, .len = 1 };
    const n: usize = if (b >= 0xC2 and b <= 0xDF) 2 else if (b >= 0xE0 and b <= 0xEF) 3 else if (b >= 0xF0 and b <= 0xF4) 4 else 0;
    if (n == 0 or pos + n > t.len) return .{ .cp = 0xFFFD, .len = 1 };
    const cp = std.unicode.utf8Decode(t[pos .. pos + n]) catch {
        // a surrogate kept as WTF-8 is still one character of its own width
        if (n == 3 and b == 0xED and t[pos + 1] >= 0xA0 and t[pos + 1] <= 0xBF and t[pos + 2] >= 0x80 and t[pos + 2] <= 0xBF)
            return .{ .cp = (@as(u21, b & 0x0F) << 12) | (@as(u21, t[pos + 1] & 0x3F) << 6) | (t[pos + 2] & 0x3F), .len = 3 };
        return .{ .cp = 0xFFFD, .len = 1 };
    };
    return .{ .cp = cp, .len = n };
}

/// The start of the character that ends at `pos`, read the way `decode` reads forward.
pub fn prevStart(t: []const u8, pos: usize) usize {
    var back: usize = 2;
    while (back <= 4 and back <= pos) : (back += 1) {
        const q = pos - back;
        if (t[q] >= 0xC2 and decode(t, q).len == back) return q;
    }
    return pos - 1;
}

pub fn isSpace(cp: u21) bool {
    return switch (cp) {
        0x09...0x0D, 0x20, 0xA0, 0x1680, 0x2000...0x200A, 0x2028, 0x2029, 0x202F, 0x205F, 0x3000, 0xFEFF => true,
        else => false,
    };
}
fn isWord(cp: u21) bool {
    return (cp >= 'a' and cp <= 'z') or (cp >= 'A' and cp <= 'Z') or (cp >= '0' and cp <= '9') or cp == '_';
}
fn isDigit(cp: u21) bool {
    return cp >= '0' and cp <= '9';
}
fn isLineEnd(cp: u21) bool {
    return cp == '\n' or cp == '\r' or cp == 0x2028 or cp == 0x2029;
}
fn swapCase(cp: u21) u21 {
    if (cp >= 'a' and cp <= 'z') return cp - 32;
    if (cp >= 'A' and cp <= 'Z') return cp + 32;
    return cp;
}

fn has(c: Class, cp: u21) bool {
    for (c.ranges) |r| if (cp >= r.lo and cp <= r.hi) return true;
    return (c.d and isDigit(cp)) or (c.w and isWord(cp)) or (c.s and isSpace(cp)) or
        (c.nd and !isDigit(cp)) or (c.nw and !isWord(cp)) or (c.ns and !isSpace(cp));
}

// ---- the parser ---------------------------------------------------------------------------------------------

const Parser = struct {
    a: Allocator,
    p: []const u8,
    i: usize = 0,
    groups: u8 = 0,
    look_caps: bool = false,

    fn peek(self: *Parser) ?u8 {
        return if (self.i < self.p.len) self.p[self.i] else null;
    }

    fn alternatives(self: *Parser) Error![]const []const Node {
        var list: std.ArrayList([]const Node) = .empty;
        while (true) {
            try list.append(self.a, try self.sequence());
            if (self.peek() == '|') {
                self.i += 1;
                continue;
            }
            return list.toOwnedSlice(self.a);
        }
    }

    fn sequence(self: *Parser) Error![]const Node {
        var list: std.ArrayList(Node) = .empty;
        while (self.peek()) |c| {
            if (c == '|' or c == ')') break;
            var node = try self.atom();
            if (try self.quantifier()) |q| {
                switch (node) {
                    .bol, .eol, .wordb, .nwordb, .look => return error.BadPattern,
                    else => {},
                }
                const boxed = try self.a.create(Node);
                boxed.* = node;
                node = .{ .repeat = .{ .node = boxed, .min = q.min, .max = q.max, .greedy = q.greedy } };
            }
            try list.append(self.a, node);
        }
        return list.toOwnedSlice(self.a);
    }

    const Q = struct { min: u32, max: u32, greedy: bool };
    fn number(self: *Parser) ?u32 {
        const s = self.i;
        while (self.i < self.p.len and std.ascii.isDigit(self.p[self.i])) self.i += 1;
        if (self.i == s) return null;
        return std.fmt.parseInt(u32, self.p[s..self.i], 10) catch null;
    }
    fn quantifier(self: *Parser) Error!?Q {
        const c = self.peek() orelse return null;
        var q: Q = .{ .min = 0, .max = inf, .greedy = true };
        switch (c) {
            '*' => self.i += 1,
            '+' => {
                q.min = 1;
                self.i += 1;
            },
            '?' => {
                q.max = 1;
                self.i += 1;
            },
            '{' => {
                const save = self.i;
                self.i += 1;
                const lo = self.number() orelse {
                    self.i = save;
                    return null; // a brace that is not a quantifier is a literal, as JavaScript reads it
                };
                q.min = lo;
                q.max = lo;
                if (self.peek() == ',') {
                    self.i += 1;
                    q.max = self.number() orelse inf;
                }
                if (self.peek() != '}') {
                    self.i = save;
                    return null;
                }
                self.i += 1;
                if (q.max < q.min) return error.BadPattern;
            },
            else => return null,
        }
        if (self.peek() == '?') {
            q.greedy = false;
            self.i += 1;
        }
        return q;
    }

    fn atom(self: *Parser) Error!Node {
        const c = self.p[self.i];
        switch (c) {
            '^' => {
                self.i += 1;
                return .bol;
            },
            '$' => {
                self.i += 1;
                return .eol;
            },
            '.' => {
                self.i += 1;
                return .any;
            },
            '(' => {
                self.i += 1;
                const rest = self.p[self.i..];
                var cap: u8 = 0;
                var look: ?Look = null;
                const groups_before = self.groups;
                if (std.mem.startsWith(u8, rest, "?:")) {
                    self.i += 2;
                } else if (std.mem.startsWith(u8, rest, "?=") or std.mem.startsWith(u8, rest, "?!")) {
                    look = .{ .alts = &.{}, .ahead = true, .neg = rest[1] == '!' };
                    self.i += 2;
                } else if (std.mem.startsWith(u8, rest, "?<=") or std.mem.startsWith(u8, rest, "?<!")) {
                    look = .{ .alts = &.{}, .ahead = false, .neg = rest[2] == '!' };
                    self.i += 3;
                } else if (std.mem.startsWith(u8, rest, "?")) {
                    return error.BadPattern; // a named group or a modifier: not carried
                } else {
                    if (self.groups == max_groups) return error.BadPattern;
                    self.groups += 1;
                    cap = self.groups;
                }
                const inner = try self.alternatives();
                if (self.peek() != ')') return error.BadPattern;
                self.i += 1;
                if (look) |l| {
                    var lk = l;
                    lk.alts = inner;
                    lk.caps = self.groups > groups_before;
                    if (lk.caps) self.look_caps = true;
                    if (!lk.ahead) {
                        // one character behind, and no more
                        if (inner.len != 1 or inner[0].len != 1) return error.BadPattern;
                        switch (inner[0][0]) {
                            .class, .lit, .any => {},
                            else => return error.BadPattern,
                        }
                    }
                    return .{ .look = lk };
                }
                return .{ .group = .{ .alts = inner, .cap = cap } };
            },
            '[' => return self.class(),
            '\\' => {
                self.i += 1;
                if (self.i >= self.p.len) return error.BadPattern;
                const e = self.p[self.i];
                switch (e) {
                    'b' => {
                        self.i += 1;
                        return .wordb;
                    },
                    'B' => {
                        self.i += 1;
                        return .nwordb;
                    },
                    '1'...'9' => {
                        self.i += 1;
                        return .{ .backref = e - '0' };
                    },
                    else => {},
                }
                self.i -= 1;
                const x = try self.escape(false);
                return x;
            },
            ')', '*', '+', '?' => return error.BadPattern,
            else => {
                const d = decode(self.p, self.i);
                self.i += d.len;
                return .{ .lit = d.cp };
            },
        }
    }

    /// An escape at `\`, outside a class or inside one: a class escape, or one literal character.
    fn escape(self: *Parser, in_class: bool) Error!Node {
        self.i += 1; // the backslash
        if (self.i >= self.p.len) return error.BadPattern;
        const e = self.p[self.i];
        self.i += 1;
        return switch (e) {
            'd' => .{ .class = .{ .d = true } },
            'D' => .{ .class = .{ .nd = true } },
            'w' => .{ .class = .{ .w = true } },
            'W' => .{ .class = .{ .nw = true } },
            's' => .{ .class = .{ .s = true } },
            'S' => .{ .class = .{ .ns = true } },
            'n' => .{ .lit = '\n' },
            'r' => .{ .lit = '\r' },
            't' => .{ .lit = '\t' },
            'f' => .{ .lit = 0x0C },
            'v' => .{ .lit = 0x0B },
            '0' => .{ .lit = 0 },
            'b' => if (in_class) .{ .lit = 0x08 } else error.BadPattern,
            'u', 'x' => blk: {
                const n: usize = if (e == 'u') 4 else 2;
                if (self.i + n > self.p.len) break :blk error.BadPattern;
                const v = std.fmt.parseInt(u21, self.p[self.i .. self.i + n], 16) catch break :blk error.BadPattern;
                self.i += n;
                break :blk .{ .lit = v };
            },
            'c', 'k', 'p', 'P' => error.BadPattern,
            else => if (std.ascii.isAlphanumeric(e)) error.BadPattern else .{ .lit = e },
        };
    }

    fn class(self: *Parser) Error!Node {
        self.i += 1; // [
        var c: Class = .{};
        if (self.peek() == '^') {
            c.neg = true;
            self.i += 1;
        }
        var ranges: std.ArrayList(Range) = .empty;
        while (true) {
            const ch = self.peek() orelse return error.BadPattern;
            if (ch == ']') {
                self.i += 1;
                break;
            }
            const lo = try self.classAtom();
            switch (lo) {
                .class => |k| {
                    c.d = c.d or k.d;
                    c.w = c.w or k.w;
                    c.s = c.s or k.s;
                    c.nd = c.nd or k.nd;
                    c.nw = c.nw or k.nw;
                    c.ns = c.ns or k.ns;
                    continue;
                },
                .lit => |l| {
                    if (self.peek() == '-' and self.i + 1 < self.p.len and self.p[self.i + 1] != ']') {
                        self.i += 1;
                        const hi = try self.classAtom();
                        if (hi != .lit or hi.lit < l) return error.BadPattern;
                        try ranges.append(self.a, .{ .lo = l, .hi = hi.lit });
                    } else try ranges.append(self.a, .{ .lo = l, .hi = l });
                },
                else => unreachable,
            }
        }
        c.ranges = try ranges.toOwnedSlice(self.a);
        return .{ .class = c };
    }
    fn classAtom(self: *Parser) Error!Node {
        if (self.p[self.i] == '\\') return self.escape(true);
        const d = decode(self.p, self.i);
        self.i += d.len;
        return .{ .lit = d.cp };
    }
};

/// Compile `pattern` with JavaScript's flags ("g", "i", "m", in any order).
pub fn compile(a: Allocator, pattern: []const u8, flags: []const u8) Error!Regex {
    var p: Parser = .{ .a = a, .p = pattern };
    const alts = try p.alternatives();
    if (p.i != pattern.len) return error.BadPattern;
    var re: Regex = .{ .alts = alts, .groups = p.groups, .global = false, .icase = false, .multiline = false, .first = null, .look_caps = p.look_caps };
    for (flags) |f| switch (f) {
        'g' => re.global = true,
        'i' => re.icase = true,
        'm' => re.multiline = true,
        else => return error.BadPattern,
    };
    var set = [_]bool{false} ** 256;
    if (firstOf(alts, re.icase, &set)) re.first = set;
    return re;
}

/// Adds to `set` every byte a match of `alts` can begin with; false when that cannot be told (a match that may be
/// empty, or begin with an assertion, `.`, a negated class or \s).
fn firstOf(alts: []const []const Node, icase: bool, set: *[256]bool) bool {
    for (alts) |alt| {
        if (alt.len == 0 or !firstOfNode(alt[0], icase, set)) return false;
    }
    return true;
}
fn firstOfNode(n: Node, icase: bool, set: *[256]bool) bool {
    switch (n) {
        .lit => |l| {
            var buf: [4]u8 = undefined;
            _ = std.unicode.utf8Encode(l, &buf) catch return false;
            set[buf[0]] = true;
            if (icase and l < 0x80) set[@intCast(swapCase(l))] = true;
            return true;
        },
        .class => |c| {
            if (c.neg or c.s or c.nd or c.nw or c.ns) return false;
            for (c.ranges) |r| {
                if (r.hi >= 0x80) return false;
                var x = r.lo;
                while (x <= r.hi) : (x += 1) {
                    set[@intCast(x)] = true;
                    if (icase) set[@intCast(swapCase(x))] = true;
                }
            }
            if (c.d or c.w) for (0..128) |b| if ((c.d and isDigit(@intCast(b))) or (c.w and isWord(@intCast(b)))) {
                set[b] = true;
            };
            return true;
        },
        .group => |g| return firstOf(g.alts, icase, set),
        .repeat => |r| return r.min > 0 and firstOfNode(r.node.*, icase, set),
        else => return false,
    }
}

/// A pattern built at run time from a constant part and a literal one: the literal's special characters escaped.
pub fn escapeLiteral(a: Allocator, s: []const u8) ![]const u8 {
    var out: std.ArrayList(u8) = .empty;
    for (s) |c| {
        if (std.mem.indexOfScalar(u8, "\\^$.|?*+()[]{}/-", c) != null) try out.append(a, '\\');
        try out.append(a, c);
    }
    return out.toOwnedSlice(a);
}

// ---- the matcher --------------------------------------------------------------------------------------------

const Cont = struct {
    tag: enum { seq, close, rep },
    seq: []const Node = &.{},
    i: usize = 0,
    cap: u8 = 0,
    start: usize = 0,
    rep: ?*const Repeat = null,
    count: u32 = 0,
    next: ?*const Cont,
};

const Matcher = struct {
    re: *const Regex,
    t: []const u8,
    caps: [max_groups + 1]?Span = @splat(null),
    end: usize = 0,

    fn one(m: *Matcher, n: Node, pos: usize) ?usize {
        if (pos >= m.t.len) return null;
        const d = decode(m.t, pos);
        const ok = switch (n) {
            .lit => |l| d.cp == l or (m.re.icase and swapCase(d.cp) == l),
            .any => !isLineEnd(d.cp),
            .class => |c| (has(c, d.cp) or (m.re.icase and has(c, swapCase(d.cp)))) != c.neg,
            else => unreachable,
        };
        return if (ok) d.len else null;
    }

    fn wordAt(m: *Matcher, pos: usize) bool {
        return pos < m.t.len and isWord(m.t[pos]);
    }
    fn wordBefore(m: *Matcher, pos: usize) bool {
        return pos > 0 and isWord(m.t[pos - 1]);
    }

    fn seq(m: *Matcher, s: []const Node, from: usize, pos0: usize, k: ?*const Cont) bool {
        var i = from;
        var pos = pos0;
        while (i < s.len) : (i += 1) {
            switch (s[i]) {
                .lit, .class, .any => pos += m.one(s[i], pos) orelse return false,
                .bol => if (!(pos == 0 or (m.re.multiline and isLineEnd(decode(m.t, prevStart(m.t, pos)).cp)))) return false,
                .eol => if (!(pos == m.t.len or (m.re.multiline and isLineEnd(decode(m.t, pos).cp)))) return false,
                .wordb => if (m.wordAt(pos) == m.wordBefore(pos)) return false,
                .nwordb => if (m.wordAt(pos) != m.wordBefore(pos)) return false,
                .backref => |n| {
                    if (m.caps[n]) |c| {
                        const want = m.t[c.s..c.e];
                        if (pos + want.len > m.t.len) return false;
                        const got = m.t[pos .. pos + want.len];
                        const same = if (m.re.icase) std.ascii.eqlIgnoreCase(got, want) else std.mem.eql(u8, got, want);
                        if (!same) return false;
                        pos += want.len;
                    }
                },
                .group => |g| {
                    // no snapshot of the captures: a capture is set by its close continuation, which puts the old value
                    // back when what follows fails, so a failed alternative leaves them as it found them
                    const c: Cont = .{ .tag = .seq, .seq = s, .i = i + 1, .next = k };
                    for (g.alts) |alt| {
                        if (g.cap != 0) {
                            const cc: Cont = .{ .tag = .close, .cap = g.cap, .start = pos, .next = &c };
                            if (m.seq(alt, 0, pos, &cc)) return true;
                        } else if (m.seq(alt, 0, pos, &c)) return true;
                    }
                    return false;
                },
                .look => |l| {
                    var found = false;
                    if (l.ahead) {
                        // a lookahead that matched is not backtracked into, so the captures it set stay unless it is negative
                        const saved = if (l.caps) m.caps else undefined;
                        const saved_end = m.end;
                        for (l.alts) |alt| if (m.seq(alt, 0, pos, null)) {
                            found = true;
                            break;
                        };
                        m.end = saved_end;
                        if (l.caps and (!found or l.neg)) m.caps = saved;
                    } else if (pos > 0) {
                        found = m.one(l.alts[0][0], prevStart(m.t, pos)) != null;
                    }
                    if (found == l.neg) return false;
                },
                .repeat => |*r| {
                    const c: Cont = .{ .tag = .seq, .seq = s, .i = i + 1, .next = k };
                    return m.repeat(r, pos, &c);
                },
            }
        }
        return m.cont(k, pos);
    }

    fn cont(m: *Matcher, k: ?*const Cont, pos: usize) bool {
        const c = k orelse {
            m.end = pos;
            return true;
        };
        switch (c.tag) {
            .seq => return m.seq(c.seq, c.i, pos, c.next),
            .close => {
                const old = m.caps[c.cap];
                m.caps[c.cap] = .{ .s = c.start, .e = pos };
                if (m.cont(c.next, pos)) return true;
                m.caps[c.cap] = old;
                return false;
            },
            .rep => {
                const r = c.rep.?;
                if (pos == c.start and c.count > r.min) return false; // an empty turn ends the loop, as JavaScript ends it
                return m.repeatFrom(r, c.count, pos, c.next.?);
            },
        }
    }

    fn single(n: Node) bool {
        return switch (n) {
            .lit, .class, .any => true,
            else => false,
        };
    }

    fn repeat(m: *Matcher, r: *const Repeat, pos: usize, k: *const Cont) bool {
        if (!single(r.node.*)) return m.repeatFrom(r, 0, pos, k);
        // one character at a time, in a loop: no recursion per character
        if (r.greedy) {
            var p = pos;
            var n: u32 = 0;
            while (n < r.max) {
                const l = m.one(r.node.*, p) orelse break;
                p += l;
                n += 1;
            }
            while (true) {
                if (n >= r.min and m.cont(k, p)) return true;
                if (n <= r.min) return false;
                p = prevStart(m.t, p);
                n -= 1;
            }
        }
        var p = pos;
        var n: u32 = 0;
        while (true) {
            if (n >= r.min and m.cont(k, p)) return true;
            if (n == r.max) return false;
            p += m.one(r.node.*, p) orelse return false;
            n += 1;
        }
    }

    fn repeatFrom(m: *Matcher, r: *const Repeat, turns: u32, pos: usize, k: *const Cont) bool {
        const more = turns < r.max;
        const done = turns >= r.min;
        if (r.greedy) {
            if (more and m.turn(r, turns, pos, k)) return true;
            return done and m.cont(k, pos);
        }
        if (done and m.cont(k, pos)) return true;
        return more and m.turn(r, turns, pos, k);
    }
    fn turn(m: *Matcher, r: *const Repeat, turns: u32, pos: usize, k: *const Cont) bool {
        const c: Cont = .{ .tag = .rep, .rep = r, .count = turns + 1, .start = pos, .next = k };
        return m.seq(r.node[0..1], 0, pos, &c);
    }
};

/// The first match at or after `from`, as RegExp.prototype.exec finds it with lastIndex = from.
pub fn exec(re: *const Regex, t: []const u8, from: usize) ?Match {
    // the captures start empty once: a failed attempt leaves them as it found them
    var m: Matcher = .{ .re = re, .t = t };
    var start = from;
    while (start <= t.len) {
        if (re.first) |*set| {
            while (start < t.len and !set[t[start]]) start += 1;
            if (start == t.len) return null;
        }
        for (re.alts) |alt| {
            if (re.look_caps) m.caps = @splat(null);
            if (m.seq(alt, 0, start, null)) return .{ .start = start, .end = m.end, .caps = m.caps };
        }
        if (start == t.len) break;
        start += decode(t, start).len;
    }
    return null;
}

pub fn testIn(re: *const Regex, t: []const u8) bool {
    return exec(re, t, 0) != null;
}

/// Every match, as String.prototype.matchAll or a global exec loop gives them: an empty match moves on one character.
pub const Iterator = struct {
    re: *const Regex,
    t: []const u8,
    at: usize = 0,
    done: bool = false,
    pub fn next(it: *Iterator) ?Match {
        if (it.done or it.at > it.t.len) return null;
        const m = exec(it.re, it.t, it.at) orelse {
            it.done = true;
            return null;
        };
        it.at = if (m.end == m.start) (if (m.end < it.t.len) m.end + decode(it.t, m.end).len else it.t.len + 1) else m.end;
        if (!it.re.global) it.done = true;
        return m;
    }
};
pub fn iterate(re: *const Regex, t: []const u8) Iterator {
    return .{ .re = re, .t = t };
}

/// The number of matches a global pattern finds: (s.match(re) || []).length.
pub fn count(re: *const Regex, t: []const u8) usize {
    var g = re.*;
    g.global = true;
    var it = iterate(&g, t);
    var n: usize = 0;
    while (it.next()) |_| n += 1;
    return n;
}

/// String.prototype.replace(re, f): every match when the pattern is global, else the first; `f` returns what replaces
/// it. `ctx` is handed to f with the match and the text.
pub fn replaceFn(a: Allocator, re: *const Regex, t: []const u8, ctx: anytype, comptime f: anytype) ![]const u8 {
    var out: std.ArrayList(u8) = .empty;
    var it = iterate(re, t);
    var last: usize = 0;
    var any = false;
    while (it.next()) |m| {
        any = true;
        try out.appendSlice(a, t[last..m.start]);
        try out.appendSlice(a, try f(ctx, m, t));
        last = m.end;
    }
    if (!any) return t;
    try out.appendSlice(a, t[last..]);
    return out.toOwnedSlice(a);
}

/// String.prototype.replace(re, s) with an `s` that holds no `$` pattern (none of the tools' replacements does).
pub fn replace(a: Allocator, re: *const Regex, t: []const u8, with: []const u8) ![]const u8 {
    const W = struct {
        fn f(s: []const u8, _: Match, _: []const u8) ![]const u8 {
            return s;
        }
    };
    return replaceFn(a, re, t, with, W.f);
}

/// Compile and replace in one call, for a pattern used once.
pub fn sub(a: Allocator, t: []const u8, pattern: []const u8, flags: []const u8, with: []const u8) ![]const u8 {
    const re = try compile(a, pattern, flags);
    return replace(a, &re, t, with);
}

/// Compile and test in one call.
pub fn matches(a: Allocator, t: []const u8, pattern: []const u8, flags: []const u8) !bool {
    const re = try compile(a, pattern, flags);
    return testIn(&re, t);
}

/// Compile and exec in one call.
pub fn find(a: Allocator, t: []const u8, pattern: []const u8, flags: []const u8) !?Match {
    const re = try compile(a, pattern, flags);
    return exec(&re, t, 0);
}

/// String.prototype.split(re), for a pattern that never matches empty.
pub fn split(a: Allocator, re: *const Regex, t: []const u8) ![]const []const u8 {
    var out: std.ArrayList([]const u8) = .empty;
    var g = re.*;
    g.global = true;
    var it = iterate(&g, t);
    var last: usize = 0;
    while (it.next()) |m| {
        if (m.end == m.start) continue;
        try out.append(a, t[last..m.start]);
        last = m.end;
    }
    try out.append(a, t[last..]);
    return out.toOwnedSlice(a);
}

// ---- JavaScript's string methods over UTF-8 -------------------------------------------------------------------

/// String.prototype.trim(): JavaScript's white space and line ends at both ends.
pub fn trim(s: []const u8) []const u8 {
    return trimEnd(trimStart(s));
}
pub fn trimStart(s: []const u8) []const u8 {
    var i: usize = 0;
    while (i < s.len) {
        const d = decode(s, i);
        if (!isSpace(d.cp)) break;
        i += d.len;
    }
    return s[i..];
}
pub fn trimEnd(s: []const u8) []const u8 {
    var e = s.len;
    while (e > 0) {
        const p = prevStart(s, e);
        if (!isSpace(decode(s, p).cp)) break;
        e = p;
    }
    return s[0..e];
}

/// String.prototype.length: UTF-16 code units.
pub fn length(s: []const u8) usize {
    var n: usize = 0;
    var i: usize = 0;
    while (i < s.len) {
        const d = decode(s, i);
        n += if (d.cp > 0xFFFF) 2 else 1;
        i += d.len;
    }
    return n;
}

/// s.slice(0, n) in UTF-16 code units. A cut through the middle of a pair leaves half of it, which console.log prints
/// as U+FFFD; so does this.
pub fn head(a: Allocator, s: []const u8, n: usize) ![]const u8 {
    var units: usize = 0;
    var i: usize = 0;
    while (i < s.len) {
        const d = decode(s, i);
        const w: usize = if (d.cp > 0xFFFF) 2 else 1;
        if (units + w > n) {
            if (units < n) return std.mem.concat(a, u8, &.{ s[0..i], "\xEF\xBF\xBD" });
            break;
        }
        units += w;
        i += d.len;
    }
    return s[0..i];
}

/// String.prototype.toLowerCase(), for ASCII letters; a character outside ASCII is kept. The tools lower-case labels
/// and terms, which are ASCII, and a title on its way to a slug, where any non-ASCII character becomes a hyphen
/// whatever its case.
pub fn lower(a: Allocator, s: []const u8) ![]const u8 {
    const out = try a.dupe(u8, s);
    for (out) |*c| c.* = std.ascii.toLower(c.*);
    return out;
}

// ---- tests --------------------------------------------------------------------------------------------------

fn tm(pattern: []const u8, flags: []const u8, text: []const u8) !?[]const u8 {
    const a = std.testing.allocator;
    var arena = std.heap.ArenaAllocator.init(a);
    defer arena.deinit();
    const re = try compile(arena.allocator(), pattern, flags);
    const m = exec(&re, text, 0) orelse return null;
    return text[m.start..m.end];
}

test "the patterns of the site tools, against what JavaScript finds" {
    const eq = std.testing.expectEqualStrings;
    try eq("<b data-fact=\"x\">12</b>", (try tm("<([a-z0-9]+)\\b[^>]*?\\sdata-(law-share|law|fact)=\"([^\"]*)\"[^>]*>([^<]*)<\\/\\1>", "g", "a <b data-fact=\"x\">12</b> c")).?);
    try eq("<pre>a\nb</pre>", (try tm("<(script|style|pre|code)\\b[\\s\\S]*?<\\/\\1>", "g", "x<pre>a\nb</pre></pre>")).?);
    try eq("12", (try tm("(?<![\\w.#/-])(\\d{2,}|\\d+\\.\\d+)(?![\\w.:/-])", "g", "a1 x12 12")).?);
    try eq("1.5", (try tm("(?<![\\w.#/-])(\\d{2,}|\\d+\\.\\d+)(?![\\w.:/-])", "g", "#12 v1.5 a 1.5 b")).?);
    try std.testing.expect((try tm("(?<![\\w.#/-])(\\d{2,}|\\d+\\.\\d+)(?![\\w.:/-])", "g", "#12 a/34 5")) == null);
    try eq("Rules 79, 26 and 51", (try tm("Rules?\\s+\\d+(?:\\s*(?:,|and|to|through|-|\\u2013)\\s*\\d+)*", "g", "see Rules 79, 26 and 51.")).?);
    try eq("DEFINE CONSTRAINT ", (try tm("^DEFINE CONSTRAINT ", "gm", "x\nDEFINE CONSTRAINT a")).?);
    try std.testing.expect((try tm("^DEFINE CONSTRAINT ", "g", "x\nDEFINE CONSTRAINT a")) == null);
    try std.testing.expect((try tm("(^|[^a-z0-9])use", "i", "becaUSE")) == null);
    try eq(" USE", (try tm("(^|[^a-z0-9])use", "i", "to USE it")).?);
    try std.testing.expect((try tm("\\bzing\\b", "i", "box-sizing")) == null);
    try eq("Zing", (try tm("\\bzing\\b", "i", "a Zing b")).?);
    try std.testing.expect((try tm("^([\\s\\S]*?[.!?])(?=\\s|$)", "", "ab")) == null);
    try eq("a.b.", (try tm("^([\\s\\S]*?[.!?])(?=\\s|$)", "", "a.b. c. d")).?);
    try eq("One. ", (try tm("^([\\s\\S]*?[.!?])(?=\\s|$)\\s", "", "One. Two.")).?);
    try eq("{a:b}", (try tm("([^{}]+)?\\{([^{}]*)\\}", "g", "{a:b}")).?);
    try eq("\xC2\xA0x", (try tm("\\sx", "", "a\xC2\xA0x")).?);
}

test "replace, split, trim and length, as JavaScript does them" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const a = arena.allocator();
    const eq = std.testing.expectEqualStrings;
    try eq("a b c", try sub(a, "a  \n b\tc", "\\s+", "g", " "));
    try eq("x-y", try sub(a, "x y", "[^a-z0-9]+", "g", "-"));
    try eq("aXb2", try sub(a, "a1b2", "\\d", "", "X"));
    const re = try compile(a, "\\r?\\n", "");
    const parts = try split(a, &re, "a\r\nb\nc");
    try std.testing.expectEqual(@as(usize, 3), parts.len);
    try eq("c", parts[2]);
    try eq("a", trim("\xC2\xA0 a\xEF\xBB\xBF "));
    try std.testing.expectEqual(@as(usize, 3), length("a\xF0\x9F\x98\x80"));
    try eq("a\xEF\xBF\xBD", try head(a, "a\xF0\x9F\x98\x80b", 2));
    const g = try compile(a, "class=\"scene-card\"", "g");
    try std.testing.expectEqual(@as(usize, 2), count(&g, "class=\"scene-card\" class=\"scene-card\""));
    try std.testing.expectError(error.BadPattern, compile(a, "(?<x>a)", ""));
    try std.testing.expectError(error.BadPattern, compile(a, "(?<=ab)", ""));
}
