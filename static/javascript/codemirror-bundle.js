let Ps = [], ph = [];
(() => {
  let n = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e) => e ? parseInt(e, 36) : 1);
  for (let e = 0, t = 0; e < n.length; e++)
    (e % 2 ? ph : Ps).push(t = t + n[e]);
})();
function id(n) {
  if (n < 768) return !1;
  for (let e = 0, t = Ps.length; ; ) {
    let i = e + t >> 1;
    if (n < Ps[i]) t = i;
    else if (n >= ph[i]) e = i + 1;
    else return !0;
    if (e == t) return !1;
  }
}
function Al(n) {
  return n >= 127462 && n <= 127487;
}
const Ml = 8205;
function nd(n, e, t = !0, i = !0) {
  return (t ? gh : rd)(n, e, i);
}
function gh(n, e, t) {
  if (e == n.length) return e;
  e && mh(n.charCodeAt(e)) && yh(n.charCodeAt(e - 1)) && e--;
  let i = as(n, e);
  for (e += Dl(i); e < n.length; ) {
    let r = as(n, e);
    if (i == Ml || r == Ml || t && id(r))
      e += Dl(r), i = r;
    else if (Al(r)) {
      let s = 0, o = e - 2;
      for (; o >= 0 && Al(as(n, o)); )
        s++, o -= 2;
      if (s % 2 == 0) break;
      e += 2;
    } else
      break;
  }
  return e;
}
function rd(n, e, t) {
  for (; e > 0; ) {
    let i = gh(n, e - 2, t);
    if (i < e) return i;
    e--;
  }
  return 0;
}
function as(n, e) {
  let t = n.charCodeAt(e);
  if (!yh(t) || e + 1 == n.length) return t;
  let i = n.charCodeAt(e + 1);
  return mh(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function mh(n) {
  return n >= 56320 && n < 57344;
}
function yh(n) {
  return n >= 55296 && n < 56320;
}
function Dl(n) {
  return n < 65536 ? 1 : 2;
}
class J {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = Ti(this, e, t);
    let r = [];
    return this.decompose(
      0,
      e,
      r,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      r,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      r,
      1
      /* Open.From */
    ), bt.from(r, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Ti(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), bt.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), r = new nn(this), s = new nn(e);
    for (let o = t, l = t; ; ) {
      if (r.next(o), s.next(o), o = 0, r.lineBreak != s.lineBreak || r.done != s.done || r.value != s.value)
        return !1;
      if (l += r.value.length, r.done || l >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new nn(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new bh(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let r = this.line(e).from;
      i = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new xh(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? J.empty : e.length <= 32 ? new pe(e) : bt.from(pe.split(e, []));
  }
}
class pe extends J {
  constructor(e, t = sd(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let o = this.text[s], l = r + o.length;
      if ((t ? i : l) >= e)
        return new od(r, l, i, o);
      r = l + 1, i++;
    }
  }
  decompose(e, t, i, r) {
    let s = e <= 0 && t >= this.length ? this : new pe(Ol(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (r & 1) {
      let o = i.pop(), l = or(s.text, o.text.slice(), 0, s.length);
      if (l.length <= 32)
        i.push(new pe(l, o.length + s.length));
      else {
        let a = l.length >> 1;
        i.push(new pe(l.slice(0, a)), new pe(l.slice(a)));
      }
    } else
      i.push(s);
  }
  replace(e, t, i) {
    if (!(i instanceof pe))
      return super.replace(e, t, i);
    [e, t] = Ti(this, e, t);
    let r = or(this.text, or(i.text, Ol(this.text, 0, e)), t), s = this.length + i.length - (t - e);
    return r.length <= 32 ? new pe(r, s) : bt.from(pe.split(r, []), s);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Ti(this, e, t);
    let r = "";
    for (let s = 0, o = 0; s <= t && o < this.text.length; o++) {
      let l = this.text[o], a = s + l.length;
      s > e && o && (r += i), e < a && t > s && (r += l.slice(Math.max(0, e - s), t - s)), s = a + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], r = -1;
    for (let s of e)
      i.push(s), r += s.length + 1, i.length == 32 && (t.push(new pe(i, r)), i = [], r = -1);
    return r > -1 && t.push(new pe(i, r)), t;
  }
}
class bt extends J {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let o = this.children[s], l = r + o.length, a = i + o.lines - 1;
      if ((t ? a : l) >= e)
        return o.lineInner(e, t, i, r);
      r = l + 1, i = a + 1;
    }
  }
  decompose(e, t, i, r) {
    for (let s = 0, o = 0; o <= t && s < this.children.length; s++) {
      let l = this.children[s], a = o + l.length;
      if (e <= a && t >= o) {
        let h = r & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
        o >= e && a <= t && !h ? i.push(l) : l.decompose(e - o, t - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = Ti(this, e, t), i.lines < this.lines)
      for (let r = 0, s = 0; r < this.children.length; r++) {
        let o = this.children[r], l = s + o.length;
        if (e >= s && t <= l) {
          let a = o.replace(e - s, t - s, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 4 && a.lines > h >> 6) {
            let c = this.children.slice();
            return c[r] = a, new bt(c, this.length - (t - e) + i.length);
          }
          return super.replace(s, l, a);
        }
        s = l + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Ti(this, e, t);
    let r = "";
    for (let s = 0, o = 0; s < this.children.length && o <= t; s++) {
      let l = this.children[s], a = o + l.length;
      o > e && s && (r += i), e < a && t > o && (r += l.sliceString(e - o, t - o, i)), o = a + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof bt))
      return 0;
    let i = 0, [r, s, o, l] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; r += t, s += t) {
      if (r == o || s == l)
        return i;
      let a = this.children[r], h = e.children[s];
      if (a != h)
        return i + a.scanIdentical(h, t);
      i += a.length + 1;
    }
  }
  static from(e, t = e.reduce((i, r) => i + r.length + 1, -1)) {
    let i = 0;
    for (let g of e)
      i += g.lines;
    if (i < 32) {
      let g = [];
      for (let y of e)
        y.flatten(g);
      return new pe(g, t);
    }
    let r = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), s = r << 1, o = r >> 1, l = [], a = 0, h = -1, c = [];
    function f(g) {
      let y;
      if (g.lines > s && g instanceof bt)
        for (let b of g.children)
          f(b);
      else g.lines > o && (a > o || !a) ? (d(), l.push(g)) : g instanceof pe && a && (y = c[c.length - 1]) instanceof pe && g.lines + y.lines <= 32 ? (a += g.lines, h += g.length + 1, c[c.length - 1] = new pe(y.text.concat(g.text), y.length + 1 + g.length)) : (a + g.lines > r && d(), a += g.lines, h += g.length + 1, c.push(g));
    }
    function d() {
      a != 0 && (l.push(c.length == 1 ? c[0] : bt.from(c, h)), h = -1, a = c.length = 0);
    }
    for (let g of e)
      f(g);
    return d(), l.length == 1 ? l[0] : new bt(l, t);
  }
}
J.empty = /* @__PURE__ */ new pe([""], 0);
function sd(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function or(n, e, t = 0, i = 1e9) {
  for (let r = 0, s = 0, o = !0; s < n.length && r <= i; s++) {
    let l = n[s], a = r + l.length;
    a >= t && (a > i && (l = l.slice(0, i - r)), r < t && (l = l.slice(t - r)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), r = a + 1;
  }
  return e;
}
function Ol(n, e, t) {
  return or(n, [""], e, t);
}
class nn {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof pe ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, r = this.nodes[i], s = this.offsets[i], o = s >> 1, l = r instanceof pe ? r.text.length : r.children.length;
      if (o == (t > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((s & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (r instanceof pe) {
        let a = r.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = r.children[o + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof pe ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class bh {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new nn(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: r } = this.cursor.next(e);
    return this.pos += (r.length + e) * t, this.value = r.length <= i ? r : t < 0 ? r.slice(r.length - i) : r.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class xh {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: r } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = r, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (J.prototype[Symbol.iterator] = function() {
  return this.iter();
}, nn.prototype[Symbol.iterator] = bh.prototype[Symbol.iterator] = xh.prototype[Symbol.iterator] = function() {
  return this;
});
class od {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.number = i, this.text = r;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Ti(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
function Ee(n, e, t = !0, i = !0) {
  return nd(n, e, t, i);
}
function ld(n) {
  return n >= 56320 && n < 57344;
}
function ad(n) {
  return n >= 55296 && n < 56320;
}
function $e(n, e) {
  let t = n.charCodeAt(e);
  if (!ad(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return ld(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function Eo(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function xt(n) {
  return n < 65536 ? 1 : 2;
}
const Rs = /\r\n?|\n/;
var He = /* @__PURE__ */ function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
}(He || (He = {}));
class Ct {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, r = 0; t < this.sections.length; ) {
      let s = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(i, r, s), r += s) : r += o, i += s;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    Fs(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      r < 0 ? e.push(i, r) : e.push(r, i);
    }
    return new Ct(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : vh(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : Ns(this, e, t);
  }
  mapPos(e, t = -1, i = He.Simple) {
    let r = 0, s = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = r + l;
      if (a < 0) {
        if (h > e)
          return s + (e - r);
        s += l;
      } else {
        if (i != He.Simple && h >= e && (i == He.TrackDel && r < e && h > e || i == He.TrackBefore && r < e || i == He.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !l)
          return e == r || t < 0 ? s : s + a;
        s += a;
      }
      r = h;
    }
    if (e > r)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);
    return s;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, r = 0; i < this.sections.length && r <= t; ) {
      let s = this.sections[i++], o = this.sections[i++], l = r + s;
      if (o >= 0 && r <= t && l >= e)
        return r < e && l > t ? "cover" : !0;
      r = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      e += (e ? " " : "") + i + (r >= 0 ? ":" + r : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new Ct(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new Ct(e);
  }
}
class we extends Ct {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return Fs(this, (t, i, r, s, o) => e = e.replace(r, r + (i - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return Ns(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let r = 0, s = 0; r < t.length; r += 2) {
      let o = t[r], l = t[r + 1];
      if (l >= 0) {
        t[r] = l, t[r + 1] = o;
        let a = r >> 1;
        for (; i.length < a; )
          i.push(J.empty);
        i.push(o ? e.slice(s, s + o) : J.empty);
      }
      s += o;
    }
    return new we(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : vh(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : Ns(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    Fs(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return Ct.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], r = [], s = new hn(this);
    e: for (let o = 0, l = 0; ; ) {
      let a = o == e.length ? 1e9 : e[o++];
      for (; l < a || l == a && s.len == 0; ) {
        if (s.done)
          break e;
        let c = Math.min(s.len, a - l);
        Le(r, c, -1);
        let f = s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0;
        Le(t, c, f), f > 0 && Wt(i, t, s.text), s.forward(c), l += c;
      }
      let h = e[o++];
      for (; l < h; ) {
        if (s.done)
          break e;
        let c = Math.min(s.len, h - l);
        Le(t, c, -1), Le(r, c, s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0), s.forward(c), l += c;
      }
    }
    return {
      changes: new we(t, i),
      filtered: Ct.create(r)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], r = this.sections[t + 1];
      r < 0 ? e.push(i) : r == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let r = [], s = [], o = 0, l = null;
    function a(c = !1) {
      if (!c && !r.length)
        return;
      o < t && Le(r, t - o, -1);
      let f = new we(r, s);
      l = l ? l.compose(f.map(l)) : f, r = [], s = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof we) {
        if (c.length != t)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${t})`);
        a(), l = l ? l.compose(c.map(l)) : c;
      } else {
        let { from: f, to: d = f, insert: g } = c;
        if (f > d || f < 0 || d > t)
          throw new RangeError(`Invalid change range ${f} to ${d} (in doc of length ${t})`);
        let y = g ? typeof g == "string" ? J.of(g.split(i || Rs)) : g : J.empty, b = y.length;
        if (f == d && b == 0)
          return;
        f < o && a(), f > o && Le(r, f - o, -1), Le(r, d - f, b), Wt(s, r, y), o = d;
      }
    }
    return h(e), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new we(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (typeof s == "number")
        t.push(s, -1);
      else {
        if (!Array.isArray(s) || typeof s[0] != "number" || s.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (s.length == 1)
          t.push(s[0], 0);
        else {
          for (; i.length < r; )
            i.push(J.empty);
          i[r] = J.of(s.slice(1)), t.push(s[0], i[r].length);
        }
      }
    }
    return new we(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new we(e, t);
  }
}
function Le(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let r = n.length - 2;
  r >= 0 && t <= 0 && t == n[r + 1] ? n[r] += e : r >= 0 && e == 0 && n[r] == 0 ? n[r + 1] += t : i ? (n[r] += e, n[r + 1] += t) : n.push(e, t);
}
function Wt(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(J.empty);
    n.push(t);
  }
}
function Fs(n, e, t) {
  let i = n.inserted;
  for (let r = 0, s = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      r += l, s += l;
    else {
      let h = r, c = s, f = J.empty;
      for (; h += l, c += a, a && i && (f = f.append(i[o - 2 >> 1])), !(t || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      e(r, h, s, c, f), r = h, s = c;
    }
  }
}
function Ns(n, e, t, i = !1) {
  let r = [], s = i ? [] : null, o = new hn(n), l = new hn(e);
  for (let a = -1; ; ) {
    if (o.done && l.len || l.done && o.len)
      throw new Error("Mismatched change set lengths");
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      Le(r, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !t))) {
      let h = l.len;
      for (Le(r, l.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= c && (Le(r, 0, o.ins), s && Wt(s, r, o.text), a = o.i), o.forward(c), h -= c;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, c = o.len;
      for (; c; )
        if (l.ins == -1) {
          let f = Math.min(c, l.len);
          h += f, c -= f, l.forward(f);
        } else if (l.ins == 0 && l.len < c)
          c -= l.len, l.next();
        else
          break;
      Le(r, h, a < o.i ? o.ins : 0), s && a < o.i && Wt(s, r, o.text), a = o.i, o.forward(o.len - c);
    } else {
      if (o.done && l.done)
        return s ? we.createSet(r, s) : Ct.create(r);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function vh(n, e, t = !1) {
  let i = [], r = t ? [] : null, s = new hn(n), o = new hn(e);
  for (let l = !1; ; ) {
    if (s.done && o.done)
      return r ? we.createSet(i, r) : Ct.create(i);
    if (s.ins == 0)
      Le(i, s.len, 0, l), s.next();
    else if (o.len == 0 && !o.done)
      Le(i, 0, o.ins, l), r && Wt(r, i, o.text), o.next();
    else {
      if (s.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(s.len2, o.len), h = i.length;
        if (s.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          Le(i, a, c, l), r && c && Wt(r, i, o.text);
        } else o.ins == -1 ? (Le(i, s.off ? 0 : s.len, a, l), r && Wt(r, i, s.textBit(a))) : (Le(i, s.off ? 0 : s.len, o.off ? 0 : o.ins, l), r && !o.off && Wt(r, i, o.text));
        l = (s.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), s.forward2(a), o.forward(a);
      }
    }
  }
}
class hn {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? J.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? J.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class ni {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let e = this.flags >> 6;
    return e == 16777215 ? void 0 : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, r;
    return this.empty ? i = r = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), r = e.mapPos(this.to, -1)), i == this.from && r == this.to ? this : new ni(i, r, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e) {
    if (e <= this.anchor && t >= this.anchor)
      return M.range(e, t);
    let i = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return M.range(this.anchor, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return M.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new ni(e, t, i);
  }
}
class M {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : M.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new M([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return M.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, M.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new M(e.ranges.map((t) => ni.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new M([M.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, r = 0; r < e.length; r++) {
      let s = e[r];
      if (s.empty ? s.from <= i : s.from < i)
        return M.normalized(e.slice(), t);
      i = s.to;
    }
    return new M(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, r) {
    return ni.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)) | (r ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, r) {
    let s = (i ?? 16777215) << 6 | (r == null ? 7 : Math.min(6, r));
    return t < e ? ni.create(t, e, 48 | s) : ni.create(e, t, (t > e ? 8 : 0) | s);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((r, s) => r.from - s.from), t = e.indexOf(i);
    for (let r = 1; r < e.length; r++) {
      let s = e[r], o = e[r - 1];
      if (s.empty ? s.from <= o.to : s.from < o.to) {
        let l = o.from, a = Math.max(s.to, o.to);
        r <= t && t--, e.splice(--r, 2, s.anchor > s.head ? M.range(a, l) : M.range(l, a));
      }
    }
    return new M(e, t);
  }
}
function wh(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let Bo = 0;
class F {
  constructor(e, t, i, r, s) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = r, this.id = Bo++, this.default = e([]), this.extensions = typeof s == "function" ? s(this) : s;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new F(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : Lo), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new lr([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new lr(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new lr(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function Lo(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class lr {
  constructor(e, t, i, r) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = r, this.id = Bo++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, r = this.facet.compareInput, s = this.id, o = e[s] >> 1, l = this.type == 2, a = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? a = !0 : f == "selection" ? h = !0 : (((t = e[f.id]) !== null && t !== void 0 ? t : 1) & 1) == 0 && c.push(e[f.id]);
    return {
      create(f) {
        return f.values[o] = i(f), 1;
      },
      update(f, d) {
        if (a && d.docChanged || h && (d.docChanged || d.selection) || Is(f, c)) {
          let g = i(f);
          if (l ? !Tl(g, f.values[o], r) : !r(g, f.values[o]))
            return f.values[o] = g, 1;
        }
        return 0;
      },
      reconfigure: (f, d) => {
        let g, y = d.config.address[s];
        if (y != null) {
          let b = br(d, y);
          if (this.dependencies.every((x) => x instanceof F ? d.facet(x) === f.facet(x) : x instanceof Se ? d.field(x, !1) == f.field(x, !1) : !0) || (l ? Tl(g = i(f), b, r) : r(g = i(f), b)))
            return f.values[o] = b, 0;
        } else
          g = i(f);
        return f.values[o] = g, 1;
      }
    };
  }
}
function Tl(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function Is(n, e) {
  let t = !1;
  for (let i of e)
    rn(n, i) & 1 && (t = !0);
  return t;
}
function hd(n, e, t) {
  let i = t.map((a) => n[a.id]), r = t.map((a) => a.type), s = i.filter((a) => !(a & 1)), o = n[e.id] >> 1;
  function l(a) {
    let h = [];
    for (let c = 0; c < i.length; c++) {
      let f = br(a, i[c]);
      if (r[c] == 2)
        for (let d of f)
          h.push(d);
      else
        h.push(f);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        rn(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!Is(a, s))
        return 0;
      let c = l(a);
      return e.compare(c, a.values[o]) ? 0 : (a.values[o] = c, 1);
    },
    reconfigure(a, h) {
      let c = Is(a, i), f = h.config.facets[e.id], d = h.facet(e);
      if (f && !c && Lo(t, f))
        return a.values[o] = d, 0;
      let g = l(a);
      return e.compare(g, d) ? (a.values[o] = d, 0) : (a.values[o] = g, 1);
    }
  };
}
const In = /* @__PURE__ */ F.define({ static: !0 });
class Se {
  constructor(e, t, i, r, s) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = r, this.spec = s, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new Se(Bo++, e.create, e.update, e.compare || ((i, r) => i === r), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(In).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, r) => {
        let s = i.values[t], o = this.updateF(s, r);
        return this.compareF(s, o) ? 0 : (i.values[t] = o, 1);
      },
      reconfigure: (i, r) => {
        let s = i.facet(In), o = r.facet(In), l;
        return (l = s.find((a) => a.field == this)) && l != o.find((a) => a.field == this) ? (i.values[t] = l.create(i), 1) : r.config.address[this.id] != null ? (i.values[t] = r.field(this), 0) : (i.values[t] = this.create(i), 1);
      }
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, In.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const ti = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function $i(n) {
  return (e) => new kh(e, n);
}
const di = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ $i(ti.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ $i(ti.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ $i(ti.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ $i(ti.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ $i(ti.lowest)
};
class kh {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
}
class pi {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new Hs(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return pi.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class Hs {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
}
class yr {
  constructor(e, t, i, r, s, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = r, this.staticValues = s, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let r = [], s = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let d of cd(e, t, o))
      d instanceof Se ? r.push(d) : (s[d.facet.id] || (s[d.facet.id] = [])).push(d);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let d of r)
      l[d.id] = h.length << 1, h.push((g) => d.slot(g));
    let c = i == null ? void 0 : i.config.facets;
    for (let d in s) {
      let g = s[d], y = g[0].facet, b = c && c[d] || [];
      if (g.every(
        (x) => x.type == 0
        /* Provider.Static */
      ))
        if (l[y.id] = a.length << 1 | 1, Lo(b, g))
          a.push(i.facet(y));
        else {
          let x = y.combine(g.map((k) => k.value));
          a.push(i && y.compare(x, i.facet(y)) ? i.facet(y) : x);
        }
      else {
        for (let x of g)
          x.type == 0 ? (l[x.id] = a.length << 1 | 1, a.push(x.value)) : (l[x.id] = h.length << 1, h.push((k) => x.dynamicSlot(k)));
        l[y.id] = h.length << 1, h.push((x) => hd(x, y, g));
      }
    }
    let f = h.map((d) => d(l));
    return new yr(e, o, f, l, a, s);
  }
}
function cd(n, e, t) {
  let i = [[], [], [], [], []], r = /* @__PURE__ */ new Map();
  function s(o, l) {
    let a = r.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof Hs && t.delete(o.compartment);
    }
    if (r.set(o, l), Array.isArray(o))
      for (let h of o)
        s(h, l);
    else if (o instanceof Hs) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), s(h, l);
    } else if (o instanceof kh)
      s(o.inner, o.prec);
    else if (o instanceof Se)
      i[l].push(o), o.provides && s(o.provides, l);
    else if (o instanceof lr)
      i[l].push(o), o.facet.extensions && s(o.facet.extensions, ti.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      s(h, l);
    }
  }
  return s(n, ti.default), i.reduce((o, l) => o.concat(l));
}
function rn(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let r = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | r;
}
function br(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const Sh = /* @__PURE__ */ F.define(), Vs = /* @__PURE__ */ F.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), Ch = /* @__PURE__ */ F.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), Ah = /* @__PURE__ */ F.define(), Mh = /* @__PURE__ */ F.define(), Dh = /* @__PURE__ */ F.define(), Oh = /* @__PURE__ */ F.define({
  combine: (n) => n.length ? n[0] : !1
});
class Rt {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new fd();
  }
}
class fd {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new Rt(this, e);
  }
}
class ud {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new z(this, e);
  }
}
class z {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new z(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new ud(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let r of e) {
      let s = r.map(t);
      s && i.push(s);
    }
    return i;
  }
}
z.reconfigure = /* @__PURE__ */ z.define();
z.appendConfig = /* @__PURE__ */ z.define();
class ke {
  constructor(e, t, i, r, s, o) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = r, this.annotations = s, this.scrollIntoView = o, this._doc = null, this._state = null, i && wh(i, t.newLength), s.some((l) => l.type == ke.time) || (this.annotations = s.concat(ke.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, r, s, o) {
    return new ke(e, t, i, r, s, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(ke.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
ke.time = /* @__PURE__ */ Rt.define();
ke.userEvent = /* @__PURE__ */ Rt.define();
ke.addToHistory = /* @__PURE__ */ Rt.define();
ke.remote = /* @__PURE__ */ Rt.define();
function dd(n, e) {
  let t = [];
  for (let i = 0, r = 0; ; ) {
    let s, o;
    if (i < n.length && (r == e.length || e[r] >= n[i]))
      s = n[i++], o = n[i++];
    else if (r < e.length)
      s = e[r++], o = e[r++];
    else
      return t;
    !t.length || t[t.length - 1] < s ? t.push(s, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function Th(n, e, t) {
  var i;
  let r, s, o;
  return t ? (r = e.changes, s = we.empty(e.changes.length), o = n.changes.compose(e.changes)) : (r = e.changes.map(n.changes), s = n.changes.mapDesc(e.changes, !0), o = n.changes.compose(r)), {
    changes: o,
    selection: e.selection ? e.selection.map(s) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(r),
    effects: z.mapEffects(n.effects, r).concat(z.mapEffects(e.effects, s)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function Ws(n, e, t) {
  let i = e.selection, r = Ci(e.annotations);
  return e.userEvent && (r = r.concat(ke.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof we ? e.changes : we.of(e.changes || [], t, n.facet(Ch)),
    selection: i && (i instanceof M ? i : M.single(i.anchor, i.head)),
    effects: Ci(e.effects),
    annotations: r,
    scrollIntoView: !!e.scrollIntoView
  };
}
function Eh(n, e, t) {
  let i = Ws(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let s = 1; s < e.length; s++) {
    e[s].filter === !1 && (t = !1);
    let o = !!e[s].sequential;
    i = Th(i, Ws(n, e[s], o ? i.changes.newLength : n.doc.length), o);
  }
  let r = ke.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return gd(t ? pd(r) : r);
}
function pd(n) {
  let e = n.startState, t = !0;
  for (let r of e.facet(Ah)) {
    let s = r(n);
    if (s === !1) {
      t = !1;
      break;
    }
    Array.isArray(s) && (t = t === !0 ? s : dd(t, s));
  }
  if (t !== !0) {
    let r, s;
    if (t === !1)
      s = n.changes.invertedDesc, r = we.empty(e.doc.length);
    else {
      let o = n.changes.filter(t);
      r = o.changes, s = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = ke.create(e, r, n.selection && n.selection.map(s), z.mapEffects(n.effects, s), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(Mh);
  for (let r = i.length - 1; r >= 0; r--) {
    let s = i[r](n);
    s instanceof ke ? n = s : Array.isArray(s) && s.length == 1 && s[0] instanceof ke ? n = s[0] : n = Eh(e, Ci(s), !1);
  }
  return n;
}
function gd(n) {
  let e = n.startState, t = e.facet(Dh), i = n;
  for (let r = t.length - 1; r >= 0; r--) {
    let s = t[r](n);
    s && Object.keys(s).length && (i = Th(i, Ws(e, s, n.changes.newLength), !0));
  }
  return i == n ? n : ke.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const md = [];
function Ci(n) {
  return n == null ? md : Array.isArray(n) ? n : [n];
}
var ae = /* @__PURE__ */ function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
}(ae || (ae = {}));
const yd = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let zs;
try {
  zs = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function bd(n) {
  if (zs)
    return zs.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || yd.test(t)))
      return !0;
  }
  return !1;
}
function xd(n) {
  return (e) => {
    if (!/\S/.test(e))
      return ae.Space;
    if (bd(e))
      return ae.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return ae.Word;
    return ae.Other;
  };
}
class X {
  constructor(e, t, i, r, s, o) {
    this.config = e, this.doc = t, this.selection = i, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = s, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      rn(this, l << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return rn(this, i), br(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return Eh(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: r } = t;
    for (let l of e.effects)
      l.is(pi.reconfigure) ? (t && (r = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => r.set(h, a)), t = null), r.set(l.value.compartment, l.value.extension)) : l.is(z.reconfigure) ? (t = null, i = l.value) : l.is(z.appendConfig) && (t = null, i = Ci(i).concat(l.value));
    let s;
    t ? s = e.startState.values.slice() : (t = yr.resolve(i, r, this), s = new X(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = e.startState.facet(Vs) ? e.newSelection : e.newSelection.asSingle();
    new X(t, e.newDoc, o, s, (l, a) => a.update(l, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: M.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), r = this.changes(i.changes), s = [i.range], o = Ci(i.effects);
    for (let l = 1; l < t.ranges.length; l++) {
      let a = e(t.ranges[l]), h = this.changes(a.changes), c = h.map(r);
      for (let d = 0; d < l; d++)
        s[d] = s[d].map(c);
      let f = r.mapDesc(h, !0);
      s.push(a.range.map(f)), r = r.compose(c), o = z.mapEffects(o, c).concat(z.mapEffects(Ci(a.effects), f));
    }
    return {
      changes: r,
      selection: M.create(s, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof we ? e : we.of(e, this.doc.length, this.facet(X.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return J.of(e.split(this.facet(X.lineSeparator) || Rs));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (rn(this, t), br(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let r = e[i];
        r instanceof Se && this.config.address[r.id] != null && (t[i] = r.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let r = [];
    if (i) {
      for (let s in i)
        if (Object.prototype.hasOwnProperty.call(e, s)) {
          let o = i[s], l = e[s];
          r.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return X.create({
      doc: e.doc,
      selection: M.fromJSON(e.selection),
      extensions: t.extensions ? r.concat([t.extensions]) : r
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = yr.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof J ? e.doc : J.of((e.doc || "").split(t.staticFacet(X.lineSeparator) || Rs)), r = e.selection ? e.selection instanceof M ? e.selection : M.single(e.selection.anchor, e.selection.head) : M.single(0);
    return wh(r, i.length), t.staticFacet(Vs) || (r = r.asSingle()), new X(t, i, r, t.dynamicSlots.map(() => null), (s, o) => o.create(s), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(X.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(X.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(Oh);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(X.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, r) => {
      if (r == "$")
        return "$";
      let s = +(r || 1);
      return !s || s > t.length ? i : t[s - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let r = [];
    for (let s of this.facet(Sh))
      for (let o of s(this, t, i))
        Object.prototype.hasOwnProperty.call(o, e) && r.push(o[e]);
    return r;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    return xd(this.languageDataAt("wordChars", e).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: r } = this.doc.lineAt(e), s = this.charCategorizer(e), o = e - i, l = e - i;
    for (; o > 0; ) {
      let a = Ee(t, o, !1);
      if (s(t.slice(a, o)) != ae.Word)
        break;
      o = a;
    }
    for (; l < r; ) {
      let a = Ee(t, l);
      if (s(t.slice(l, a)) != ae.Word)
        break;
      l = a;
    }
    return o == l ? null : M.range(o + i, l + i);
  }
}
X.allowMultipleSelections = Vs;
X.tabSize = /* @__PURE__ */ F.define({
  combine: (n) => n.length ? n[0] : 4
});
X.lineSeparator = Ch;
X.readOnly = Oh;
X.phrases = /* @__PURE__ */ F.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((r) => n[r] == e[r]);
  }
});
X.languageData = Sh;
X.changeFilter = Ah;
X.transactionFilter = Mh;
X.transactionExtender = Dh;
pi.reconfigure = /* @__PURE__ */ z.define();
function ct(n, e, t = {}) {
  let i = {};
  for (let r of n)
    for (let s of Object.keys(r)) {
      let o = r[s], l = i[s];
      if (l === void 0)
        i[s] = o;
      else if (!(l === o || o === void 0)) if (Object.hasOwnProperty.call(t, s))
        i[s] = t[s](l, o);
      else
        throw new Error("Config merge conflict for field " + s);
    }
  for (let r in e)
    i[r] === void 0 && (i[r] = e[r]);
  return i;
}
class li {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return qs.create(e, t, this);
  }
}
li.prototype.startSide = li.prototype.endSide = 0;
li.prototype.point = !1;
li.prototype.mapMode = He.TrackDel;
let qs = class Bh {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Bh(e, t, i);
  }
};
function Ks(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class Po {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = r;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, r = 0) {
    let s = i ? this.to : this.from;
    for (let o = r, l = s.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = s[a] - e || (i ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(e, t, i, r) {
    for (let s = this.findIndex(t, -1e9, !0), o = this.findIndex(i, 1e9, !1, s); s < o; s++)
      if (r(this.from[s] + e, this.to[s] + e, this.value[s]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], r = [], s = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], c = this.from[a] + e, f = this.to[a] + e, d, g;
      if (c == f) {
        let y = t.mapPos(c, h.startSide, h.mapMode);
        if (y == null || (d = g = y, h.startSide != h.endSide && (g = t.mapPos(c, h.endSide), g < d)))
          continue;
      } else if (d = t.mapPos(c, h.startSide), g = t.mapPos(f, h.endSide), d > g || d == g && h.startSide > 0 && h.endSide <= 0)
        continue;
      (g - d || h.endSide - h.startSide) < 0 || (o < 0 && (o = d), h.point && (l = Math.max(l, g - d)), i.push(h), r.push(d - o), s.push(g - o));
    }
    return { mapped: i.length ? new Po(r, s, i, l) : null, pos: o };
  }
}
class j {
  constructor(e, t, i, r) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = r;
  }
  /**
  @internal
  */
  static create(e, t, i, r) {
    return new j(e, t, i, r);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: r = 0, filterTo: s = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (i && (t = t.slice().sort(Ks)), this.isEmpty)
      return t.length ? j.of(t) : this;
    let l = new Lh(this, null, -1).goto(0), a = 0, h = [], c = new Lt();
    for (; l.value || a < t.length; )
      if (a < t.length && (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0) {
        let f = t[a++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) && (!o || r > this.chunkEnd(l.chunkIndex) || s < this.chunkPos[l.chunkIndex]) && c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || r > l.to || s < l.from || o(l.from, l.to, l.value)) && (c.addInner(l.from, l.to, l.value) || h.push(qs.create(l.from, l.to, l.value))), l.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? j.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: r, filterTo: s }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], r = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = e.touchesRange(l, l + a.length);
      if (h === !1)
        r = Math.max(r, a.maxPoint), t.push(a), i.push(e.mapPos(l));
      else if (h === !0) {
        let { mapped: c, pos: f } = a.map(l, e);
        c && (r = Math.max(r, c.maxPoint), t.push(c), i.push(f));
      }
    }
    let s = this.nextLayer.map(e);
    return t.length == 0 ? s : new j(i, t, s || j.empty, r);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let r = 0; r < this.chunk.length; r++) {
        let s = this.chunkPos[r], o = this.chunk[r];
        if (t >= s && e <= s + o.length && o.between(s, e - s, t - s, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return cn.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return cn.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, r, s = -1) {
    let o = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= s), l = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= s), a = El(o, l, i), h = new ji(o, a, s), c = new ji(l, a, s);
    i.iterGaps((f, d, g) => Bl(h, f, c, d, g, r)), i.empty && i.length == 0 && Bl(h, 0, c, 0, 0, r);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, r) {
    r == null && (r = 999999999);
    let s = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0), o = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0);
    if (s.length != o.length)
      return !1;
    if (!s.length)
      return !0;
    let l = El(s, o), a = new ji(s, l, 0).goto(i), h = new ji(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !$s(a.active, h.active) || a.point && (!h.point || !a.point.eq(h.point)))
        return !1;
      if (a.to > r)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, r, s = -1) {
    let o = new ji(e, null, s).goto(t), l = t, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < t ? c.length + 1 : o.point.startSide < 0 ? c.length : Math.min(c.length, a);
        r.point(l, h, o.point, c, f, o.pointRank), a = Math.min(o.openEnd(h), c.length);
      } else h > l && (r.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > i)
        return a + (o.point && o.to > i ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new Lt();
    for (let r of e instanceof qs ? [e] : t ? vd(e) : e)
      i.add(r.from, r.to, r.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return j.empty;
    let t = e[e.length - 1];
    for (let i = e.length - 2; i >= 0; i--)
      for (let r = e[i]; r != j.empty; r = r.nextLayer)
        t = new j(r.chunkPos, r.chunk, t, Math.max(r.maxPoint, t.maxPoint));
    return t;
  }
}
j.empty = /* @__PURE__ */ new j([], [], null, -1);
function vd(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (Ks(e, i) > 0)
        return n.slice().sort(Ks);
      e = i;
    }
  return n;
}
j.empty.nextLayer = j.empty;
class Lt {
  finishChunk(e) {
    this.chunks.push(new Po(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new Lt())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let r = e - this.lastTo || i.startSide - this.last.endSide;
    if (r <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return r < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(j.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = j.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function El(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let s of n)
    for (let o = 0; o < s.chunk.length; o++)
      s.chunk[o].maxPoint <= 0 && i.set(s.chunk[o], s.chunkPos[o]);
  let r = /* @__PURE__ */ new Set();
  for (let s of e)
    for (let o = 0; o < s.chunk.length; o++) {
      let l = i.get(s.chunk[o]);
      l != null && (t ? t.mapPos(l) : l) == s.chunkPos[o] && !(t != null && t.touchesRange(l, l + s.chunk[o].length)) && r.add(s.chunk[o]);
    }
  return r;
}
class Lh {
  constructor(e, t, i, r = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = r;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let r = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(r) || this.layer.chunkEnd(this.chunkIndex) < e || r.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let r = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < r) && this.setRangeIndex(r);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class cn {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let r = [];
    for (let s = 0; s < e.length; s++)
      for (let o = e[s]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && r.push(new Lh(o, t, i, s));
    return r.length == 1 ? r[0] : new cn(r);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      hs(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      hs(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), hs(this.heap, 0);
    }
  }
}
function hs(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let r = n[i];
    if (i + 1 < n.length && r.compare(n[i + 1]) >= 0 && (r = n[i + 1], i++), t.compare(r) < 0)
      break;
    n[i] = t, n[e] = r, e = i;
  }
}
class ji {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = cn.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    Hn(this.active, e), Hn(this.activeTo, e), Hn(this.activeRank, e), this.minActive = Ll(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: r, rank: s } = this.cursor;
    for (; t < this.activeRank.length && (s - this.activeRank[t] || r - this.activeTo[t]) > 0; )
      t++;
    Vn(this.active, t, i), Vn(this.activeTo, t, r), Vn(this.activeRank, t, s), e && Vn(e, t, this.cursor.from), this.minActive = Ll(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let r = this.minActive;
      if (r > -1 && (this.activeTo[r] - this.cursor.from || this.active[r].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[r] > e) {
          this.to = this.activeTo[r], this.endSide = this.active[r].endSide;
          break;
        }
        this.removeActive(r), i && Hn(i, r);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let s = this.cursor.value;
          if (!s.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = s, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = s.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let r = i.length - 1; r >= 0 && i[r] < e; r--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function Bl(n, e, t, i, r, s) {
  n.goto(e), t.goto(i);
  let o = i + r, l = i, a = i - e;
  for (; ; ) {
    let h = n.to + a - t.to, c = h || n.endSide - t.endSide, f = c < 0 ? n.to + a : t.to, d = Math.min(f, o);
    if (n.point || t.point ? n.point && t.point && (n.point == t.point || n.point.eq(t.point)) && $s(n.activeForPoint(n.to), t.activeForPoint(t.to)) || s.comparePoint(l, d, n.point, t.point) : d > l && !$s(n.active, t.active) && s.compareRange(l, d, n.active, t.active), f > o)
      break;
    (h || n.openEnd != t.openEnd) && s.boundChange && s.boundChange(f), l = f, c <= 0 && n.next(), c >= 0 && t.next();
  }
}
function $s(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !n[t].eq(e[t]))
      return !1;
  return !0;
}
function Hn(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function Vn(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function Ll(n, e) {
  let t = -1, i = 1e9;
  for (let r = 0; r < e.length; r++)
    (e[r] - i || n[r].endSide - n[t].endSide) < 0 && (t = r, i = e[r]);
  return t;
}
function Hi(n, e, t = n.length) {
  let i = 0;
  for (let r = 0; r < t && r < n.length; )
    n.charCodeAt(r) == 9 ? (i += e - i % e, r++) : (i++, r = Ee(n, r));
  return i;
}
function js(n, e, t, i) {
  for (let r = 0, s = 0; ; ) {
    if (s >= e)
      return r;
    if (r == n.length)
      break;
    s += n.charCodeAt(r) == 9 ? t - s % t : 1, r = Ee(n, r);
  }
  return i === !0 ? -1 : n.length;
}
const Us = "ͼ", Pl = typeof Symbol > "u" ? "__" + Us : Symbol.for(Us), Gs = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), Rl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class jt {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function r(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function s(o, l, a, h) {
      let c = [], f = /^@(\w+)\b/.exec(o[0]), d = f && f[1] == "keyframes";
      if (f && l == null) return a.push(o[0] + ";");
      for (let g in l) {
        let y = l[g];
        if (/&/.test(g))
          s(
            g.split(/,\s*/).map((b) => o.map((x) => b.replace(/&/, x))).reduce((b, x) => b.concat(x)),
            y,
            a
          );
        else if (y && typeof y == "object") {
          if (!f) throw new RangeError("The value of a property (" + g + ") should be a primitive value.");
          s(r(g), y, c, d);
        } else y != null && c.push(g.replace(/_.*/, "").replace(/[A-Z]/g, (b) => "-" + b.toLowerCase()) + ": " + y + ";");
      }
      (c.length || d) && a.push((i && !f && !h ? o.map(i) : o).join(", ") + " {" + c.join(" ") + "}");
    }
    for (let o in e) s(r(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = Rl[Pl] || 1;
    return Rl[Pl] = e + 1, Us + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let r = e[Gs], s = i && i.nonce;
    r ? s && r.setNonce(s) : r = new wd(e, s), r.mount(Array.isArray(t) ? t : [t], e);
  }
}
let Fl = /* @__PURE__ */ new Map();
class wd {
  constructor(e, t) {
    let i = e.ownerDocument || e, r = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
      let s = Fl.get(i);
      if (s) return e[Gs] = s;
      this.sheet = new r.CSSStyleSheet(), Fl.set(i, this);
    } else
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
    this.modules = [], e[Gs] = this;
  }
  mount(e, t) {
    let i = this.sheet, r = 0, s = 0;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = this.modules.indexOf(l);
      if (a < s && a > -1 && (this.modules.splice(a, 1), s--, a = -1), a == -1) {
        if (this.modules.splice(s++, 0, l), i) for (let h = 0; h < l.rules.length; h++)
          i.insertRule(l.rules[h], r++);
      } else {
        for (; s < a; ) r += this.modules[s++].rules.length;
        r += l.rules.length, s++;
      }
    }
    if (i)
      t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
    else {
      let o = "";
      for (let a = 0; a < this.modules.length; a++)
        o += this.modules[a].getRules() + `
`;
      this.styleTag.textContent = o;
      let l = t.head || t;
      this.styleTag.parentNode != l && l.insertBefore(this.styleTag, l.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var Ut = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, fn = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, kd = typeof navigator < "u" && /Mac/.test(navigator.platform), Sd = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Oe = 0; Oe < 10; Oe++) Ut[48 + Oe] = Ut[96 + Oe] = String(Oe);
for (var Oe = 1; Oe <= 24; Oe++) Ut[Oe + 111] = "F" + Oe;
for (var Oe = 65; Oe <= 90; Oe++)
  Ut[Oe] = String.fromCharCode(Oe + 32), fn[Oe] = String.fromCharCode(Oe);
for (var cs in Ut) fn.hasOwnProperty(cs) || (fn[cs] = Ut[cs]);
function Cd(n) {
  var e = kd && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Sd && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? fn : Ut)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function un(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function Ys(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function ar(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return Ys(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function dn(n) {
  return n.nodeType == 3 ? hi(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function sn(n, e, t, i) {
  return t ? Nl(n, e, t, i, -1) || Nl(n, e, t, i, 1) : !1;
}
function ai(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function xr(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
function Nl(n, e, t, i, r) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (r < 0 ? 0 : At(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let s = n.parentNode;
      if (!s || s.nodeType != 1)
        return !1;
      e = ai(n) + (r < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (r < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = r < 0 ? At(n) : 0;
    } else
      return !1;
  }
}
function At(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Hr(n, e) {
  let t = e ? n.left : n.right;
  return { left: t, right: t, top: n.top, bottom: n.bottom };
}
function Ad(n) {
  let e = n.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function Ph(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function Md(n, e, t, i, r, s, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let c = n, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let d, g = c == a.body, y = 1, b = 1;
      if (g)
        d = Ad(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let D = c.getBoundingClientRect();
        ({ scaleX: y, scaleY: b } = Ph(c, D)), d = {
          left: D.left,
          right: D.left + c.clientWidth * y,
          top: D.top,
          bottom: D.top + c.clientHeight * b
        };
      }
      let x = 0, k = 0;
      if (r == "nearest")
        e.top < d.top ? (k = e.top - (d.top + o), t > 0 && e.bottom > d.bottom + k && (k = e.bottom - d.bottom + o)) : e.bottom > d.bottom && (k = e.bottom - d.bottom + o, t < 0 && e.top - k < d.top && (k = e.top - (d.top + o)));
      else {
        let D = e.bottom - e.top, T = d.bottom - d.top;
        k = (r == "center" && D <= T ? e.top + D / 2 - T / 2 : r == "start" || r == "center" && t < 0 ? e.top - o : e.bottom - T + o) - d.top;
      }
      if (i == "nearest" ? e.left < d.left ? (x = e.left - (d.left + s), t > 0 && e.right > d.right + x && (x = e.right - d.right + s)) : e.right > d.right && (x = e.right - d.right + s, t < 0 && e.left < d.left + x && (x = e.left - (d.left + s))) : x = (i == "center" ? e.left + (e.right - e.left) / 2 - (d.right - d.left) / 2 : i == "start" == l ? e.left - s : e.right - (d.right - d.left) + s) - d.left, x || k)
        if (g)
          h.scrollBy(x, k);
        else {
          let D = 0, T = 0;
          if (k) {
            let E = c.scrollTop;
            c.scrollTop += k / b, T = (c.scrollTop - E) * b;
          }
          if (x) {
            let E = c.scrollLeft;
            c.scrollLeft += x / y, D = (c.scrollLeft - E) * y;
          }
          e = {
            left: e.left - D,
            top: e.top - T,
            right: e.right - D,
            bottom: e.bottom - T
          }, D && Math.abs(D - x) < 1 && (i = "nearest"), T && Math.abs(T - k) < 1 && (r = "nearest");
        }
      if (g)
        break;
      (e.top < d.top || e.bottom > d.bottom || e.left < d.left || e.right > d.right) && (e = {
        left: Math.max(e.left, d.left),
        right: Math.min(e.right, d.right),
        top: Math.max(e.top, d.top),
        bottom: Math.min(e.bottom, d.bottom)
      }), c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function Dd(n) {
  let e = n.ownerDocument, t, i;
  for (let r = n.parentNode; r && !(r == e.body || t && i); )
    if (r.nodeType == 1)
      !i && r.scrollHeight > r.clientHeight && (i = r), !t && r.scrollWidth > r.clientWidth && (t = r), r = r.assignedSlot || r.parentNode;
    else if (r.nodeType == 11)
      r = r.host;
    else
      break;
  return { x: t, y: i };
}
class Od {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? At(t) : 0), i, Math.min(e.focusOffset, i ? At(i) : 0));
  }
  set(e, t, i, r) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = r;
  }
}
let bi = null;
function Rh(n) {
  if (n.setActive)
    return n.setActive();
  if (bi)
    return n.focus(bi);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(bi == null ? {
    get preventScroll() {
      return bi = { preventScroll: !0 }, !0;
    }
  } : void 0), !bi) {
    bi = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], r = e[t++], s = e[t++];
      i.scrollTop != r && (i.scrollTop = r), i.scrollLeft != s && (i.scrollLeft = s);
    }
  }
}
let Il;
function hi(n, e, t = e) {
  let i = Il || (Il = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function Ai(n, e, t, i) {
  let r = { key: e, code: e, keyCode: t, which: t, cancelable: !0 };
  i && ({ altKey: r.altKey, ctrlKey: r.ctrlKey, shiftKey: r.shiftKey, metaKey: r.metaKey } = i);
  let s = new KeyboardEvent("keydown", r);
  s.synthetic = !0, n.dispatchEvent(s);
  let o = new KeyboardEvent("keyup", r);
  return o.synthetic = !0, n.dispatchEvent(o), s.defaultPrevented || o.defaultPrevented;
}
function Td(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function Fh(n) {
  for (; n.attributes.length; )
    n.removeAttributeNode(n.attributes[0]);
}
function Ed(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, At(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let r = t.childNodes[i - 1];
      r.contentEditable == "false" ? i-- : (t = r, i = At(t));
    } else {
      if (t == n)
        return !0;
      i = ai(t), t = t.parentNode;
    }
}
function Nh(n) {
  return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
function Ih(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i > 0)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i - 1], i = At(t);
    } else if (t.parentNode && !xr(t))
      i = ai(t), t = t.parentNode;
    else
      return null;
  }
}
function Hh(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i < t.nodeValue.length)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i], i = 0;
    } else if (t.parentNode && !xr(t))
      i = ai(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
class Pe {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new Pe(e.parentNode, ai(e), t);
  }
  static after(e, t) {
    return new Pe(e.parentNode, ai(e) + 1, t);
  }
}
const Ro = [];
class ne {
  constructor() {
    this.parent = null, this.dom = null, this.flags = 2;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e) {
    let t = this.posAtStart;
    for (let i of this.children) {
      if (i == e)
        return t;
      t += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  sync(e, t) {
    if (this.flags & 2) {
      let i = this.dom, r = null, s;
      for (let o of this.children) {
        if (o.flags & 7) {
          if (!o.dom && (s = r ? r.nextSibling : i.firstChild)) {
            let l = ne.get(s);
            (!l || !l.parent && l.canReuseDOM(o)) && o.reuseDOM(s);
          }
          o.sync(e, t), o.flags &= -8;
        }
        if (s = r ? r.nextSibling : i.firstChild, t && !t.written && t.node == i && s != o.dom && (t.written = !0), o.dom.parentNode == i)
          for (; s && s != o.dom; )
            s = Hl(s);
        else
          i.insertBefore(o.dom, s);
        r = o.dom;
      }
      for (s = r ? r.nextSibling : i.firstChild, s && t && t.node == i && (t.written = !0); s; )
        s = Hl(s);
    } else if (this.flags & 1)
      for (let i of this.children)
        i.flags & 7 && (i.sync(e, t), i.flags &= -8);
  }
  reuseDOM(e) {
  }
  localPosFromDOM(e, t) {
    let i;
    if (e == this.dom)
      i = this.dom.childNodes[t];
    else {
      let r = At(e) == 0 ? 0 : t == 0 ? -1 : 1;
      for (; ; ) {
        let s = e.parentNode;
        if (s == this.dom)
          break;
        r == 0 && s.firstChild != s.lastChild && (e == s.firstChild ? r = -1 : r = 1), e = s;
      }
      r < 0 ? i = e : i = e.nextSibling;
    }
    if (i == this.dom.firstChild)
      return 0;
    for (; i && !ne.get(i); )
      i = i.nextSibling;
    if (!i)
      return this.length;
    for (let r = 0, s = 0; ; r++) {
      let o = this.children[r];
      if (o.dom == i)
        return s;
      s += o.length + o.breakAfter;
    }
  }
  domBoundsAround(e, t, i = 0) {
    let r = -1, s = -1, o = -1, l = -1;
    for (let a = 0, h = i, c = i; a < this.children.length; a++) {
      let f = this.children[a], d = h + f.length;
      if (h < e && d > t)
        return f.domBoundsAround(e, t, h);
      if (d >= e && r == -1 && (r = a, s = h), h > t && f.dom.parentNode == this.dom) {
        o = a, l = c;
        break;
      }
      c = d, h = d + f.breakAfter;
    }
    return {
      from: s,
      to: l < 0 ? i + this.length : l,
      startDOM: (r ? this.children[r - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: o < this.children.length && o >= 0 ? this.children[o].dom : null
    };
  }
  markDirty(e = !1) {
    this.flags |= 2, this.markParentsDirty(e);
  }
  markParentsDirty(e) {
    for (let t = this.parent; t; t = t.parent) {
      if (e && (t.flags |= 2), t.flags & 1)
        return;
      t.flags |= 1, e = !1;
    }
  }
  setParent(e) {
    this.parent != e && (this.parent = e, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(e) {
    this.dom != e && (this.dom && (this.dom.cmView = null), this.dom = e, e.cmView = this);
  }
  get rootView() {
    for (let e = this; ; ) {
      let t = e.parent;
      if (!t)
        return e;
      e = t;
    }
  }
  replaceChildren(e, t, i = Ro) {
    this.markDirty();
    for (let r = e; r < t; r++) {
      let s = this.children[r];
      s.parent == this && i.indexOf(s) < 0 && s.destroy();
    }
    i.length < 250 ? this.children.splice(e, t - e, ...i) : this.children = [].concat(this.children.slice(0, e), i, this.children.slice(t));
    for (let r = 0; r < i.length; r++)
      i[r].setParent(this);
  }
  ignoreMutation(e) {
    return !1;
  }
  ignoreEvent(e) {
    return !1;
  }
  childCursor(e = this.length) {
    return new Vh(this.children, e, this.children.length);
  }
  childPos(e, t = 1) {
    return this.childCursor().findPos(e, t);
  }
  toString() {
    let e = this.constructor.name.replace("View", "");
    return e + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (e == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(e) {
    return e.cmView;
  }
  get isEditable() {
    return !0;
  }
  get isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  merge(e, t, i, r, s, o) {
    return !1;
  }
  become(e) {
    return !1;
  }
  canReuseDOM(e) {
    return e.constructor == this.constructor && !((this.flags | e.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    for (let e of this.children)
      e.parent == this && e.destroy();
    this.parent = null;
  }
}
ne.prototype.breakAfter = 0;
function Hl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Vh {
  constructor(e, t, i) {
    this.children = e, this.pos = t, this.i = i, this.off = 0;
  }
  findPos(e, t = 1) {
    for (; ; ) {
      if (e > this.pos || e == this.pos && (t > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = e - this.pos, this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function Wh(n, e, t, i, r, s, o, l, a) {
  let { children: h } = n, c = h.length ? h[e] : null, f = s.length ? s[s.length - 1] : null, d = f ? f.breakAfter : o;
  if (!(e == i && c && !o && !d && s.length < 2 && c.merge(t, r, s.length ? f : null, t == 0, l, a))) {
    if (i < h.length) {
      let g = h[i];
      g && (r < g.length || g.breakAfter && (f != null && f.breakAfter)) ? (e == i && (g = g.split(r), r = 0), !d && f && g.merge(0, r, f, !0, 0, a) ? s[s.length - 1] = g : ((r || g.children.length && !g.children[0].length) && g.merge(0, r, null, !1, 0, a), s.push(g))) : g != null && g.breakAfter && (f ? f.breakAfter = 1 : o = 1), i++;
    }
    for (c && (c.breakAfter = o, t > 0 && (!o && s.length && c.merge(t, c.length, s[0], !1, l, 0) ? c.breakAfter = s.shift().breakAfter : (t < c.length || c.children.length && c.children[c.children.length - 1].length == 0) && c.merge(t, c.length, null, !1, l, 0), e++)); e < i && s.length; )
      if (h[i - 1].become(s[s.length - 1]))
        i--, s.pop(), a = s.length ? 0 : l;
      else if (h[e].become(s[0]))
        e++, s.shift(), l = s.length ? 0 : a;
      else
        break;
    !s.length && e && i < h.length && !h[e - 1].breakAfter && h[i].merge(0, 0, h[e - 1], !1, l, a) && e--, (e < i || s.length) && n.replaceChildren(e, i, s);
  }
}
function zh(n, e, t, i, r, s) {
  let o = n.childCursor(), { i: l, off: a } = o.findPos(t, 1), { i: h, off: c } = o.findPos(e, -1), f = e - t;
  for (let d of i)
    f += d.length;
  n.length += f, Wh(n, h, c, l, a, i, 0, r, s);
}
let je = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Js = typeof document < "u" ? document : { documentElement: { style: {} } };
const Xs = /* @__PURE__ */ /Edge\/(\d+)/.exec(je.userAgent), qh = /* @__PURE__ */ /MSIE \d/.test(je.userAgent), _s = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(je.userAgent), Vr = !!(qh || _s || Xs), Vl = !Vr && /* @__PURE__ */ /gecko\/(\d+)/i.test(je.userAgent), fs = !Vr && /* @__PURE__ */ /Chrome\/(\d+)/.exec(je.userAgent), Bd = "webkitFontSmoothing" in Js.documentElement.style, Kh = !Vr && /* @__PURE__ */ /Apple Computer/.test(je.vendor), Wl = Kh && (/* @__PURE__ */ /Mobile\/\w+/.test(je.userAgent) || je.maxTouchPoints > 2);
var I = {
  mac: Wl || /* @__PURE__ */ /Mac/.test(je.platform),
  windows: /* @__PURE__ */ /Win/.test(je.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(je.platform),
  ie: Vr,
  ie_version: qh ? Js.documentMode || 6 : _s ? +_s[1] : Xs ? +Xs[1] : 0,
  gecko: Vl,
  gecko_version: Vl ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(je.userAgent) || [0, 0])[1] : 0,
  chrome: !!fs,
  chrome_version: fs ? +fs[1] : 0,
  ios: Wl,
  android: /* @__PURE__ */ /Android\b/.test(je.userAgent),
  safari: Kh,
  webkit_version: Bd ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(je.userAgent) || [0, 0])[1] : 0,
  tabSize: Js.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const Ld = 256;
class at extends ne {
  constructor(e) {
    super(), this.text = e;
  }
  get length() {
    return this.text.length;
  }
  createDOM(e) {
    this.setDOM(e || document.createTextNode(this.text));
  }
  sync(e, t) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(e) {
    e.nodeType == 3 && this.createDOM(e);
  }
  merge(e, t, i) {
    return this.flags & 8 || i && (!(i instanceof at) || this.length - (t - e) + i.length > Ld || i.flags & 8) ? !1 : (this.text = this.text.slice(0, e) + (i ? i.text : "") + this.text.slice(t), this.markDirty(), !0);
  }
  split(e) {
    let t = new at(this.text.slice(e));
    return this.text = this.text.slice(0, e), this.markDirty(), t.flags |= this.flags & 8, t;
  }
  localPosFromDOM(e, t) {
    return e == this.dom ? t : t ? this.text.length : 0;
  }
  domAtPos(e) {
    return new Pe(this.dom, e);
  }
  domBoundsAround(e, t, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(e, t) {
    return Pd(this.dom, e, t);
  }
}
class Pt extends ne {
  constructor(e, t = [], i = 0) {
    super(), this.mark = e, this.children = t, this.length = i;
    for (let r of t)
      r.setParent(this);
  }
  setAttrs(e) {
    if (Fh(e), this.mark.class && (e.className = this.mark.class), this.mark.attrs)
      for (let t in this.mark.attrs)
        e.setAttribute(t, this.mark.attrs[t]);
    return e;
  }
  canReuseDOM(e) {
    return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
  }
  reuseDOM(e) {
    e.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(e, t);
  }
  merge(e, t, i, r, s, o) {
    return i && (!(i instanceof Pt && i.mark.eq(this.mark)) || e && s <= 0 || t < this.length && o <= 0) ? !1 : (zh(this, e, t, i ? i.children.slice() : [], s - 1, o - 1), this.markDirty(), !0);
  }
  split(e) {
    let t = [], i = 0, r = -1, s = 0;
    for (let l of this.children) {
      let a = i + l.length;
      a > e && t.push(i < e ? l.split(e - i) : l), r < 0 && i >= e && (r = s), i = a, s++;
    }
    let o = this.length - e;
    return this.length = e, r > -1 && (this.children.length = r, this.markDirty()), new Pt(this.mark, t, o);
  }
  domAtPos(e) {
    return $h(this, e);
  }
  coordsAt(e, t) {
    return Uh(this, e, t);
  }
}
function Pd(n, e, t) {
  let i = n.nodeValue.length;
  e > i && (e = i);
  let r = e, s = e, o = 0;
  e == 0 && t < 0 || e == i && t >= 0 ? I.chrome || I.gecko || (e ? (r--, o = 1) : s < i && (s++, o = -1)) : t < 0 ? r-- : s < i && s++;
  let l = hi(n, r, s).getClientRects();
  if (!l.length)
    return null;
  let a = l[(o ? o < 0 : t >= 0) ? 0 : l.length - 1];
  return I.safari && !o && a.width == 0 && (a = Array.prototype.find.call(l, (h) => h.width) || a), o ? Hr(a, o < 0) : a || null;
}
class zt extends ne {
  static create(e, t, i) {
    return new zt(e, t, i);
  }
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.side = i, this.prevWidget = null;
  }
  split(e) {
    let t = zt.create(this.widget, this.length - e, this.side);
    return this.length -= e, t;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  getSide() {
    return this.side;
  }
  merge(e, t, i, r, s, o) {
    return i && (!(i instanceof zt) || !this.widget.compare(i.widget) || e > 0 && s <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  become(e) {
    return e instanceof zt && e.side == this.side && this.widget.constructor == e.widget.constructor ? (this.widget.compare(e.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return J.empty;
    let e = this;
    for (; e.parent; )
      e = e.parent;
    let { view: t } = e, i = t && t.state.doc, r = this.posAtStart;
    return i ? i.slice(r, r + this.length) : J.empty;
  }
  domAtPos(e) {
    return (this.length ? e == 0 : this.side > 0) ? Pe.before(this.dom) : Pe.after(this.dom, e == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e, t) {
    let i = this.widget.coordsAt(this.dom, e, t);
    if (i)
      return i;
    let r = this.dom.getClientRects(), s = null;
    if (!r.length)
      return null;
    let o = this.side ? this.side < 0 : e > 0;
    for (let l = o ? r.length - 1 : 0; s = r[l], !(e > 0 ? l == 0 : l == r.length - 1 || s.top < s.bottom); l += o ? -1 : 1)
      ;
    return Hr(s, !o);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class Ei extends ne {
  constructor(e) {
    super(), this.side = e;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(e) {
    return e instanceof Ei && e.side == this.side;
  }
  split() {
    return new Ei(this.side);
  }
  sync() {
    if (!this.dom) {
      let e = document.createElement("img");
      e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), this.setDOM(e);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(e) {
    return this.side > 0 ? Pe.before(this.dom) : Pe.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return J.empty;
  }
  get isHidden() {
    return !0;
  }
}
at.prototype.children = zt.prototype.children = Ei.prototype.children = Ro;
function $h(n, e) {
  let t = n.dom, { children: i } = n, r = 0;
  for (let s = 0; r < i.length; r++) {
    let o = i[r], l = s + o.length;
    if (!(l == s && o.getSide() <= 0)) {
      if (e > s && e < l && o.dom.parentNode == t)
        return o.domAtPos(e - s);
      if (e <= s)
        break;
      s = l;
    }
  }
  for (let s = r; s > 0; s--) {
    let o = i[s - 1];
    if (o.dom.parentNode == t)
      return o.domAtPos(o.length);
  }
  for (let s = r; s < i.length; s++) {
    let o = i[s];
    if (o.dom.parentNode == t)
      return o.domAtPos(0);
  }
  return new Pe(t, 0);
}
function jh(n, e, t) {
  let i, { children: r } = n;
  t > 0 && e instanceof Pt && r.length && (i = r[r.length - 1]) instanceof Pt && i.mark.eq(e.mark) ? jh(i, e.children[0], t - 1) : (r.push(e), e.setParent(n)), n.length += e.length;
}
function Uh(n, e, t) {
  let i = null, r = -1, s = null, o = -1;
  function l(h, c) {
    for (let f = 0, d = 0; f < h.children.length && d <= c; f++) {
      let g = h.children[f], y = d + g.length;
      y >= c && (g.children.length ? l(g, c - d) : (!s || s.isHidden && (t > 0 || Fd(s, g))) && (y > c || d == y && g.getSide() > 0) ? (s = g, o = c - d) : (d < c || d == y && g.getSide() < 0 && !g.isHidden) && (i = g, r = c - d)), d = y;
    }
  }
  l(n, e);
  let a = (t < 0 ? i : s) || i || s;
  return a ? a.coordsAt(Math.max(0, a == i ? r : o), t) : Rd(n);
}
function Rd(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = dn(e);
  return t[t.length - 1] || null;
}
function Fd(n, e) {
  let t = n.coordsAt(0, 1), i = e.coordsAt(0, 1);
  return t && i && i.top < t.bottom;
}
function Qs(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const zl = /* @__PURE__ */ Object.create(null);
function vr(n, e, t) {
  if (n == e)
    return !0;
  n || (n = zl), e || (e = zl);
  let i = Object.keys(n), r = Object.keys(e);
  if (i.length - (t && i.indexOf(t) > -1 ? 1 : 0) != r.length - (t && r.indexOf(t) > -1 ? 1 : 0))
    return !1;
  for (let s of i)
    if (s != t && (r.indexOf(s) == -1 || n[s] !== e[s]))
      return !1;
  return !0;
}
function Zs(n, e, t) {
  let i = !1;
  if (e)
    for (let r in e)
      t && r in t || (i = !0, r == "style" ? n.style.cssText = "" : n.removeAttribute(r));
  if (t)
    for (let r in t)
      e && e[r] == t[r] || (i = !0, r == "style" ? n.style.cssText = t[r] : n.setAttribute(r, t[r]));
  return i;
}
function Nd(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class Xt {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var We = /* @__PURE__ */ function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
}(We || (We = {}));
class W extends li {
  constructor(e, t, i, r) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = r;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new An(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new Gt(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, r;
    if (e.isBlockGap)
      i = -5e8, r = 4e8;
    else {
      let { start: s, end: o } = Gh(e, t);
      i = (s ? t ? -3e8 : -1 : 5e8) - 1, r = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new Gt(e, i, r, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new Mn(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return j.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
W.none = j.empty;
class An extends W {
  constructor(e) {
    let { start: t, end: i } = Gh(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.class = e.class || "", this.attrs = e.attributes || null;
  }
  eq(e) {
    var t, i;
    return this == e || e instanceof An && this.tagName == e.tagName && (this.class || ((t = this.attrs) === null || t === void 0 ? void 0 : t.class)) == (e.class || ((i = e.attrs) === null || i === void 0 ? void 0 : i.class)) && vr(this.attrs, e.attrs, "class");
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
An.prototype.point = !1;
class Mn extends W {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof Mn && this.spec.class == e.spec.class && vr(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
Mn.prototype.mapMode = He.TrackBefore;
Mn.prototype.point = !0;
class Gt extends W {
  constructor(e, t, i, r, s, o) {
    super(t, i, s, e), this.block = r, this.isReplace = o, this.mapMode = r ? t <= 0 ? He.TrackBefore : He.TrackAfter : He.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? We.WidgetRange : this.startSide <= 0 ? We.WidgetBefore : We.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof Gt && Id(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
Gt.prototype.point = !0;
function Gh(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function Id(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function hr(n, e, t, i = 0) {
  let r = t.length - 1;
  r >= 0 && t[r] + i >= n ? t[r] = Math.max(t[r], e) : t.push(n, e);
}
class ye extends ne {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(e, t, i, r, s, o) {
    if (i) {
      if (!(i instanceof ye))
        return !1;
      this.dom || i.transferDOM(this);
    }
    return r && this.setDeco(i ? i.attrs : null), zh(this, e, t, i ? i.children.slice() : [], s, o), !0;
  }
  split(e) {
    let t = new ye();
    if (t.breakAfter = this.breakAfter, this.length == 0)
      return t;
    let { i, off: r } = this.childPos(e);
    r && (t.append(this.children[i].split(r), 0), this.children[i].merge(r, this.children[i].length, null, !1, 0, 0), i++);
    for (let s = i; s < this.children.length; s++)
      t.append(this.children[s], 0);
    for (; i > 0 && this.children[i - 1].length == 0; )
      this.children[--i].destroy();
    return this.children.length = i, this.markDirty(), this.length = e, t;
  }
  transferDOM(e) {
    this.dom && (this.markDirty(), e.setDOM(this.dom), e.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(e) {
    vr(this.attrs, e) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = e);
  }
  append(e, t) {
    jh(this, e, t);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(e) {
    let t = e.spec.attributes, i = e.spec.class;
    t && (this.attrs = Qs(t, this.attrs || {})), i && (this.attrs = Qs({ class: i }, this.attrs || {}));
  }
  domAtPos(e) {
    return $h(this, e);
  }
  reuseDOM(e) {
    e.nodeName == "DIV" && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    var i;
    this.dom ? this.flags & 4 && (Fh(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && (Zs(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(e, t);
    let r = this.dom.lastChild;
    for (; r && ne.get(r) instanceof Pt; )
      r = r.lastChild;
    if (!r || !this.length || r.nodeName != "BR" && ((i = ne.get(r)) === null || i === void 0 ? void 0 : i.isEditable) == !1 && (!I.ios || !this.children.some((s) => s instanceof at))) {
      let s = document.createElement("BR");
      s.cmIgnore = !0, this.dom.appendChild(s);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let e = 0, t;
    for (let i of this.children) {
      if (!(i instanceof at) || /[^ -~]/.test(i.text))
        return null;
      let r = dn(i.dom);
      if (r.length != 1)
        return null;
      e += r[0].width, t = r[0].height;
    }
    return e ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: e / this.length,
      textHeight: t
    } : null;
  }
  coordsAt(e, t) {
    let i = Uh(this, e, t);
    if (!this.children.length && i && this.parent) {
      let { heightOracle: r } = this.parent.view.viewState, s = i.bottom - i.top;
      if (Math.abs(s - r.lineHeight) < 2 && r.textHeight < s) {
        let o = (s - r.textHeight) / 2;
        return { top: i.top + o, bottom: i.bottom - o, left: i.left, right: i.left };
      }
    }
    return i;
  }
  become(e) {
    return e instanceof ye && this.children.length == 0 && e.children.length == 0 && vr(this.attrs, e.attrs) && this.breakAfter == e.breakAfter;
  }
  covers() {
    return !0;
  }
  static find(e, t) {
    for (let i = 0, r = 0; i < e.children.length; i++) {
      let s = e.children[i], o = r + s.length;
      if (o >= t) {
        if (s instanceof ye)
          return s;
        if (o > t)
          break;
      }
      r = o + s.breakAfter;
    }
    return null;
  }
}
class Bt extends ne {
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.deco = i, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(e, t, i, r, s, o) {
    return i && (!(i instanceof Bt) || !this.widget.compare(i.widget) || e > 0 && s <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  domAtPos(e) {
    return e == 0 ? Pe.before(this.dom) : Pe.after(this.dom, e == this.length);
  }
  split(e) {
    let t = this.length - e;
    this.length = e;
    let i = new Bt(this.widget, t, this.deco);
    return i.breakAfter = this.breakAfter, i;
  }
  get children() {
    return Ro;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : J.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(e) {
    return e instanceof Bt && e.widget.constructor == this.widget.constructor ? (e.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, this.deco = e.deco, this.breakAfter = e.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(e, t) {
    let i = this.widget.coordsAt(this.dom, e, t);
    return i || (this.widget instanceof eo ? null : Hr(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0));
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
  covers(e) {
    let { startSide: t, endSide: i } = this.deco;
    return t == i ? !1 : e < 0 ? t < 0 : i > 0;
  }
}
class eo extends Xt {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
class on {
  constructor(e, t, i, r) {
    this.doc = e, this.pos = t, this.end = i, this.disallowBlockEffectsFor = r, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = e.iter(), this.skip = t;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let e = this.content[this.content.length - 1];
    return !(e.breakAfter || e instanceof Bt && e.deco.endSide < 0);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new ye()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(e = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(Wn(new Ei(-1), e), e.length), this.pendingBuffer = 0);
  }
  addBlockWidget(e) {
    this.flushBuffer(), this.curLine = null, this.content.push(e);
  }
  finish(e) {
    this.pendingBuffer && e <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, !this.posCovered() && !(e && this.content.length && this.content[this.content.length - 1] instanceof Bt) && this.getLine();
  }
  buildText(e, t, i) {
    for (; e > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: s, lineBreak: o, done: l } = this.cursor.next(this.skip);
        if (this.skip = 0, l)
          throw new Error("Ran out of text content when drawing inline views");
        if (o) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, e--;
          continue;
        } else
          this.text = s, this.textOff = 0;
      }
      let r = Math.min(
        this.text.length - this.textOff,
        e,
        512
        /* T.Chunk */
      );
      this.flushBuffer(t.slice(t.length - i)), this.getLine().append(Wn(new at(this.text.slice(this.textOff, this.textOff + r)), t), i), this.atCursorPos = !0, this.textOff += r, e -= r, i = 0;
    }
  }
  span(e, t, i, r) {
    this.buildText(t - e, i, r), this.pos = t, this.openStart < 0 && (this.openStart = r);
  }
  point(e, t, i, r, s, o) {
    if (this.disallowBlockEffectsFor[o] && i instanceof Gt) {
      if (i.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (t > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let l = t - e;
    if (i instanceof Gt)
      if (i.block)
        i.startSide > 0 && !this.posCovered() && this.getLine(), this.addBlockWidget(new Bt(i.widget || Bi.block, l, i));
      else {
        let a = zt.create(i.widget || Bi.inline, l, l ? 0 : i.startSide), h = this.atCursorPos && !a.isEditable && s <= r.length && (e < t || i.startSide > 0), c = !a.isEditable && (e < t || s > r.length || i.startSide <= 0), f = this.getLine();
        this.pendingBuffer == 2 && !h && !a.isEditable && (this.pendingBuffer = 0), this.flushBuffer(r), h && (f.append(Wn(new Ei(1), r), s), s = r.length + Math.max(0, s - r.length)), f.append(Wn(a, r), s), this.atCursorPos = c, this.pendingBuffer = c ? e < t || s > r.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = r.slice());
      }
    else this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    l && (this.textOff + l <= this.text.length ? this.textOff += l : (this.skip += l - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = t), this.openStart < 0 && (this.openStart = s);
  }
  static build(e, t, i, r, s) {
    let o = new on(e, t, i, s);
    return o.openEnd = j.spans(r, t, i, o), o.openStart < 0 && (o.openStart = o.openEnd), o.finish(o.openEnd), o;
  }
}
function Wn(n, e) {
  for (let t of e)
    n = new Pt(t, [n], n.length);
  return n;
}
class Bi extends Xt {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
Bi.inline = /* @__PURE__ */ new Bi("span");
Bi.block = /* @__PURE__ */ new Bi("div");
var oe = /* @__PURE__ */ function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
}(oe || (oe = {}));
const ci = oe.LTR, Fo = oe.RTL;
function Yh(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const Hd = /* @__PURE__ */ Yh("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), Vd = /* @__PURE__ */ Yh("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), to = /* @__PURE__ */ Object.create(null), pt = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  to[e] = t, to[t] = -e;
}
function Jh(n) {
  return n <= 247 ? Hd[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? Vd[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const Wd = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class qt {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Fo : ci;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, r) {
    let s = -1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if (l.from <= t && l.to >= t) {
        if (l.level == i)
          return o;
        (s < 0 || (r != 0 ? r < 0 ? l.from < t : l.to > t : e[s].level > l.level)) && (s = o);
      }
    }
    if (s < 0)
      throw new RangeError("Index out of range");
    return s;
  }
}
function Xh(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], r = e[t];
    if (i.from != r.from || i.to != r.to || i.direction != r.direction || !Xh(i.inner, r.inner))
      return !1;
  }
  return !0;
}
const ie = [];
function zd(n, e, t, i, r) {
  for (let s = 0; s <= i.length; s++) {
    let o = s ? i[s - 1].to : e, l = s < i.length ? i[s].from : t, a = s ? 256 : r;
    for (let h = o, c = a, f = a; h < l; h++) {
      let d = Jh(n.charCodeAt(h));
      d == 512 ? d = c : d == 8 && f == 4 && (d = 16), ie[h] = d == 4 ? 2 : d, d & 7 && (f = d), c = d;
    }
    for (let h = o, c = a, f = a; h < l; h++) {
      let d = ie[h];
      if (d == 128)
        h < l - 1 && c == ie[h + 1] && c & 24 ? d = ie[h] = c : ie[h] = 256;
      else if (d == 64) {
        let g = h + 1;
        for (; g < l && ie[g] == 64; )
          g++;
        let y = h && c == 8 || g < t && ie[g] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let b = h; b < g; b++)
          ie[b] = y;
        h = g - 1;
      } else d == 8 && f == 1 && (ie[h] = 1);
      c = d, d & 7 && (f = d);
    }
  }
}
function qd(n, e, t, i, r) {
  let s = r == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : e, c = o < i.length ? i[o].from : t;
    for (let f = h, d, g, y; f < c; f++)
      if (g = to[d = n.charCodeAt(f)])
        if (g < 0) {
          for (let b = l - 3; b >= 0; b -= 3)
            if (pt[b + 1] == -g) {
              let x = pt[b + 2], k = x & 2 ? r : x & 4 ? x & 1 ? s : r : 0;
              k && (ie[f] = ie[pt[b]] = k), l = b;
              break;
            }
        } else {
          if (pt.length == 189)
            break;
          pt[l++] = f, pt[l++] = d, pt[l++] = a;
        }
      else if ((y = ie[f]) == 2 || y == 1) {
        let b = y == r;
        a = b ? 0 : 1;
        for (let x = l - 3; x >= 0; x -= 3) {
          let k = pt[x + 2];
          if (k & 2)
            break;
          if (b)
            pt[x + 2] |= 2;
          else {
            if (k & 4)
              break;
            pt[x + 2] |= 4;
          }
        }
      }
  }
}
function Kd(n, e, t, i) {
  for (let r = 0, s = i; r <= t.length; r++) {
    let o = r ? t[r - 1].to : n, l = r < t.length ? t[r].from : e;
    for (let a = o; a < l; ) {
      let h = ie[a];
      if (h == 256) {
        let c = a + 1;
        for (; ; )
          if (c == l) {
            if (r == t.length)
              break;
            c = t[r++].to, l = r < t.length ? t[r].from : e;
          } else if (ie[c] == 256)
            c++;
          else
            break;
        let f = s == 1, d = (c < e ? ie[c] : i) == 1, g = f == d ? f ? 1 : 2 : i;
        for (let y = c, b = r, x = b ? t[b - 1].to : n; y > a; )
          y == x && (y = t[--b].from, x = b ? t[b - 1].to : n), ie[--y] = g;
        a = c;
      } else
        s = h, a++;
    }
  }
}
function io(n, e, t, i, r, s, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == r % 2)
    for (let a = e, h = 0; a < t; ) {
      let c = !0, f = !1;
      if (h == s.length || a < s[h].from) {
        let b = ie[a];
        b != l && (c = !1, f = b == 16);
      }
      let d = !c && l == 1 ? [] : null, g = c ? i : i + 1, y = a;
      e: for (; ; )
        if (h < s.length && y == s[h].from) {
          if (f)
            break e;
          let b = s[h];
          if (!c)
            for (let x = b.to, k = h + 1; ; ) {
              if (x == t)
                break e;
              if (k < s.length && s[k].from == x)
                x = s[k++].to;
              else {
                if (ie[x] == l)
                  break e;
                break;
              }
            }
          if (h++, d)
            d.push(b);
          else {
            b.from > a && o.push(new qt(a, b.from, g));
            let x = b.direction == ci != !(g % 2);
            no(n, x ? i + 1 : i, r, b.inner, b.from, b.to, o), a = b.to;
          }
          y = b.to;
        } else {
          if (y == t || (c ? ie[y] != l : ie[y] == l))
            break;
          y++;
        }
      d ? io(n, a, y, i + 1, r, d, o) : a < y && o.push(new qt(a, y, g)), a = y;
    }
  else
    for (let a = t, h = s.length; a > e; ) {
      let c = !0, f = !1;
      if (!h || a > s[h - 1].to) {
        let b = ie[a - 1];
        b != l && (c = !1, f = b == 16);
      }
      let d = !c && l == 1 ? [] : null, g = c ? i : i + 1, y = a;
      e: for (; ; )
        if (h && y == s[h - 1].to) {
          if (f)
            break e;
          let b = s[--h];
          if (!c)
            for (let x = b.from, k = h; ; ) {
              if (x == e)
                break e;
              if (k && s[k - 1].to == x)
                x = s[--k].from;
              else {
                if (ie[x - 1] == l)
                  break e;
                break;
              }
            }
          if (d)
            d.push(b);
          else {
            b.to < a && o.push(new qt(b.to, a, g));
            let x = b.direction == ci != !(g % 2);
            no(n, x ? i + 1 : i, r, b.inner, b.from, b.to, o), a = b.from;
          }
          y = b.from;
        } else {
          if (y == e || (c ? ie[y - 1] != l : ie[y - 1] == l))
            break;
          y--;
        }
      d ? io(n, y, a, i + 1, r, d, o) : y < a && o.push(new qt(y, a, g)), a = y;
    }
}
function no(n, e, t, i, r, s, o) {
  let l = e % 2 ? 2 : 1;
  zd(n, r, s, i, l), qd(n, r, s, i, l), Kd(r, s, i, l), io(n, r, s, e, t, i, o);
}
function $d(n, e, t) {
  if (!n)
    return [new qt(0, 0, e == Fo ? 1 : 0)];
  if (e == ci && !t.length && !Wd.test(n))
    return _h(n.length);
  if (t.length)
    for (; n.length > ie.length; )
      ie[ie.length] = 256;
  let i = [], r = e == ci ? 0 : 1;
  return no(n, r, r, t, 0, n.length, i), i;
}
function _h(n) {
  return [new qt(0, n, 0)];
}
let Qh = "";
function jd(n, e, t, i, r) {
  var s;
  let o = i.head - n.from, l = qt.find(e, o, (s = i.bidiLevel) !== null && s !== void 0 ? s : -1, i.assoc), a = e[l], h = a.side(r, t);
  if (o == h) {
    let d = l += r ? 1 : -1;
    if (d < 0 || d >= e.length)
      return null;
    a = e[l = d], o = a.side(!r, t), h = a.side(r, t);
  }
  let c = Ee(n.text, o, a.forward(r, t));
  (c < a.from || c > a.to) && (c = h), Qh = n.text.slice(Math.min(o, c), Math.max(o, c));
  let f = l == (r ? e.length - 1 : 0) ? null : e[l + (r ? 1 : -1)];
  return f && c == h && f.level + (r ? 0 : 1) < a.level ? M.cursor(f.side(!r, t) + n.from, f.forward(r, t) ? 1 : -1, f.level) : M.cursor(c + n.from, a.forward(r, t) ? -1 : 1, a.level);
}
function Ud(n, e, t) {
  for (let i = e; i < t; i++) {
    let r = Jh(n.charCodeAt(i));
    if (r == 1)
      return ci;
    if (r == 2 || r == 4)
      return Fo;
  }
  return ci;
}
const Zh = /* @__PURE__ */ F.define(), ec = /* @__PURE__ */ F.define(), tc = /* @__PURE__ */ F.define(), ic = /* @__PURE__ */ F.define(), ro = /* @__PURE__ */ F.define(), nc = /* @__PURE__ */ F.define(), rc = /* @__PURE__ */ F.define(), No = /* @__PURE__ */ F.define(), Io = /* @__PURE__ */ F.define(), sc = /* @__PURE__ */ F.define({
  combine: (n) => n.some((e) => e)
}), oc = /* @__PURE__ */ F.define({
  combine: (n) => n.some((e) => e)
}), lc = /* @__PURE__ */ F.define();
class Mi {
  constructor(e, t = "nearest", i = "nearest", r = 5, s = 5, o = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = r, this.xMargin = s, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new Mi(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new Mi(M.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const zn = /* @__PURE__ */ z.define({ map: (n, e) => n.map(e) }), ac = /* @__PURE__ */ z.define();
function Ve(n, e, t) {
  let i = n.facet(ic);
  i.length ? i[0](e) : window.onerror ? window.onerror(String(e), t, void 0, void 0, e) : t ? console.error(t + ":", e) : console.error(e);
}
const Et = /* @__PURE__ */ F.define({ combine: (n) => n.length ? n[0] : !0 });
let Gd = 0;
const Xi = /* @__PURE__ */ F.define();
class ge {
  constructor(e, t, i, r, s) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = r, this.extension = s(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: r, provide: s, decorations: o } = t || {};
    return new ge(Gd++, e, i, r, (l) => {
      let a = [Xi.of(l)];
      return o && a.push(pn.of((h) => {
        let c = h.plugin(l);
        return c ? o(c) : W.none;
      })), s && a.push(s(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return ge.define((i) => new e(i), t);
  }
}
class us {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (Ve(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(e);
      } catch (t) {
        Ve(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Ve(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const hc = /* @__PURE__ */ F.define(), Ho = /* @__PURE__ */ F.define(), pn = /* @__PURE__ */ F.define(), cc = /* @__PURE__ */ F.define(), Vo = /* @__PURE__ */ F.define(), fc = /* @__PURE__ */ F.define();
function ql(n, e) {
  let t = n.state.facet(fc);
  if (!t.length)
    return t;
  let i = t.map((s) => s instanceof Function ? s(n) : s), r = [];
  return j.spans(i, e.from, e.to, {
    point() {
    },
    span(s, o, l, a) {
      let h = s - e.from, c = o - e.from, f = r;
      for (let d = l.length - 1; d >= 0; d--, a--) {
        let g = l[d].spec.bidiIsolate, y;
        if (g == null && (g = Ud(e.text, h, c)), a > 0 && f.length && (y = f[f.length - 1]).to == h && y.direction == g)
          y.to = c, f = y.inner;
        else {
          let b = { from: h, to: c, direction: g, inner: [] };
          f.push(b), f = b.inner;
        }
      }
    }
  }), r;
}
const uc = /* @__PURE__ */ F.define();
function Wo(n) {
  let e = 0, t = 0, i = 0, r = 0;
  for (let s of n.state.facet(uc)) {
    let o = s(n);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (r = Math.max(r, o.bottom)));
  }
  return { left: e, right: t, top: i, bottom: r };
}
const _i = /* @__PURE__ */ F.define();
class it {
  constructor(e, t, i, r) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = r;
  }
  join(e) {
    return new it(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let r = e[t - 1];
      if (!(r.fromA > i.toA)) {
        if (r.toA < i.fromA)
          break;
        i = i.join(r), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let r = 0, s = 0, o = 0, l = 0; ; r++) {
      let a = r == e.length ? null : e[r], h = o - l, c = a ? a.fromB : 1e9;
      for (; s < t.length && t[s] < c; ) {
        let f = t[s], d = t[s + 1], g = Math.max(l, f), y = Math.min(c, d);
        if (g <= y && new it(g + h, y + h, g, y).addToSet(i), d > c)
          break;
        s += 2;
      }
      if (!a)
        return i;
      new it(a.fromA, a.toA, a.fromB, a.toB).addToSet(i), o = a.toA, l = a.toB;
    }
  }
}
class wr {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = we.empty(this.startState.doc.length);
    for (let s of i)
      this.changes = this.changes.compose(s.changes);
    let r = [];
    this.changes.iterChangedRanges((s, o, l, a) => r.push(new it(s, o, l, a))), this.changedRanges = r;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new wr(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
class Kl extends ne {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(e) {
    super(), this.view = e, this.decorations = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.editContextFormatting = W.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(e.contentDOM), this.children = [new ye()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new it(0, 0, 0, e.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: h, toA: c }) => c < this.minWidthFrom || h > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let r = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? r = this.domChanged.newSel.head : !ep(e.changes, this.hasComposition) && !e.selectionSet && (r = e.state.selection.main.head));
    let s = r > -1 ? Jd(this.view, e.changes, r) : null;
    if (this.domChanged = null, this.hasComposition) {
      this.markedForComposition.clear();
      let { from: h, to: c } = this.hasComposition;
      i = new it(h, c, e.changes.mapPos(h, -1), e.changes.mapPos(c, 1)).addToSet(i.slice());
    }
    this.hasComposition = s ? { from: s.range.fromB, to: s.range.toB } : null, (I.ie || I.chrome) && !s && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.updateDeco(), a = Qd(o, l, e.changes);
    return i = it.extendWithRanges(i, a), !(this.flags & 7) && i.length == 0 ? !1 : (this.updateInner(i, e.startState.doc.length, s), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t, i) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(e, t, i);
    let { observer: r } = this.view;
    r.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let o = I.chrome || I.ios ? { node: r.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, o), this.flags &= -8, o && (o.written || r.selectionRange.focusNode != o.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      (o) => o.flags &= -9
      /* ViewFlag.Composition */
    );
    let s = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let o of this.children)
        o instanceof Bt && o.widget instanceof eo && s.push(o.dom);
    r.updateGaps(s);
  }
  updateChildren(e, t, i) {
    let r = i ? i.range.addToSet(e.slice()) : e, s = this.childCursor(t);
    for (let o = r.length - 1; ; o--) {
      let l = o >= 0 ? r[o] : null;
      if (!l)
        break;
      let { fromA: a, toA: h, fromB: c, toB: f } = l, d, g, y, b;
      if (i && i.range.fromB < f && i.range.toB > c) {
        let E = on.build(this.view.state.doc, c, i.range.fromB, this.decorations, this.dynamicDecorationMap), O = on.build(this.view.state.doc, i.range.toB, f, this.decorations, this.dynamicDecorationMap);
        g = E.breakAtStart, y = E.openStart, b = O.openEnd;
        let C = this.compositionView(i);
        O.breakAtStart ? C.breakAfter = 1 : O.content.length && C.merge(C.length, C.length, O.content[0], !1, O.openStart, 0) && (C.breakAfter = O.content[0].breakAfter, O.content.shift()), E.content.length && C.merge(0, 0, E.content[E.content.length - 1], !0, 0, E.openEnd) && E.content.pop(), d = E.content.concat(C).concat(O.content);
      } else
        ({ content: d, breakAtStart: g, openStart: y, openEnd: b } = on.build(this.view.state.doc, c, f, this.decorations, this.dynamicDecorationMap));
      let { i: x, off: k } = s.findPos(h, 1), { i: D, off: T } = s.findPos(a, -1);
      Wh(this, D, T, x, k, d, g, y, b);
    }
    i && this.fixCompositionDOM(i);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(ac) && (this.editContextFormatting = i.value);
  }
  compositionView(e) {
    let t = new at(e.text.nodeValue);
    t.flags |= 8;
    for (let { deco: r } of e.marks)
      t = new Pt(r, [t], t.length);
    let i = new ye();
    return i.append(t, 0), i;
  }
  fixCompositionDOM(e) {
    let t = (s, o) => {
      o.flags |= 8 | (o.children.some(
        (a) => a.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add(o);
      let l = ne.get(s);
      l && l != o && (l.dom = null), o.setDOM(s);
    }, i = this.childPos(e.range.fromB, 1), r = this.children[i.i];
    t(e.line, r);
    for (let s = e.marks.length - 1; s >= -1; s--)
      i = r.childPos(i.off, 1), r = r.children[i.i], t(s >= 0 ? e.marks[s].node : e.text, r);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let i = this.view.root.activeElement, r = i == this.dom, s = !r && !(this.view.state.facet(Et) || this.dom.tabIndex > -1) && ar(this.dom, this.view.observer.selectionRange) && !(i && this.dom.contains(i));
    if (!(r || t || s))
      return;
    let o = this.forceSelection;
    this.forceSelection = !1;
    let l = this.view.state.selection.main, a = this.moveToLine(this.domAtPos(l.anchor)), h = l.empty ? a : this.moveToLine(this.domAtPos(l.head));
    if (I.gecko && l.empty && !this.hasComposition && Yd(a)) {
      let f = document.createTextNode("");
      this.view.observer.ignore(() => a.node.insertBefore(f, a.node.childNodes[a.offset] || null)), a = h = new Pe(f, 0), o = !0;
    }
    let c = this.view.observer.selectionRange;
    (o || !c.focusNode || (!sn(a.node, a.offset, c.anchorNode, c.anchorOffset) || !sn(h.node, h.offset, c.focusNode, c.focusOffset)) && !this.suppressWidgetCursorChange(c, l)) && (this.view.observer.ignore(() => {
      I.android && I.chrome && this.dom.contains(c.focusNode) && Zd(c.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let f = un(this.view.root);
      if (f) if (l.empty) {
        if (I.gecko) {
          let d = Xd(a.node, a.offset);
          if (d && d != 3) {
            let g = (d == 1 ? Ih : Hh)(a.node, a.offset);
            g && (a = new Pe(g.node, g.offset));
          }
        }
        f.collapse(a.node, a.offset), l.bidiLevel != null && f.caretBidiLevel !== void 0 && (f.caretBidiLevel = l.bidiLevel);
      } else if (f.extend) {
        f.collapse(a.node, a.offset);
        try {
          f.extend(h.node, h.offset);
        } catch {
        }
      } else {
        let d = document.createRange();
        l.anchor > l.head && ([a, h] = [h, a]), d.setEnd(h.node, h.offset), d.setStart(a.node, a.offset), f.removeAllRanges(), f.addRange(d);
      }
      s && this.view.root.activeElement == this.dom && (this.dom.blur(), i && i.focus());
    }), this.view.observer.setSelectionRange(a, h)), this.impreciseAnchor = a.precise ? null : new Pe(c.anchorNode, c.anchorOffset), this.impreciseHead = h.precise ? null : new Pe(c.focusNode, c.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && sn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = un(e.root), { anchorNode: r, anchorOffset: s } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let o = ye.find(this, t.head);
    if (!o)
      return;
    let l = o.posAtStart;
    if (t.head == l || t.head == l + o.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let c = this.domAtPos(t.head + t.assoc);
    i.collapse(c.node, c.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let f = e.observer.selectionRange;
    e.docView.posFromDOM(f.anchorNode, f.anchorOffset) != t.from && i.collapse(r, s);
  }
  // If a position is in/near a block widget, move it to a nearby text
  // line, since we don't want the cursor inside a block widget.
  moveToLine(e) {
    let t = this.dom, i;
    if (e.node != t)
      return e;
    for (let r = e.offset; !i && r < t.childNodes.length; r++) {
      let s = ne.get(t.childNodes[r]);
      s instanceof ye && (i = s.domAtPos(0));
    }
    for (let r = e.offset - 1; !i && r >= 0; r--) {
      let s = ne.get(t.childNodes[r]);
      s instanceof ye && (i = s.domAtPos(s.length));
    }
    return i ? new Pe(i.node, i.offset, !0) : e;
  }
  nearest(e) {
    for (let t = e; t; ) {
      let i = ne.get(t);
      if (i && i.rootView == this)
        return i;
      t = t.parentNode;
    }
    return null;
  }
  posFromDOM(e, t) {
    let i = this.nearest(e);
    if (!i)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return i.localPosFromDOM(e, t) + i.posAtStart;
  }
  domAtPos(e) {
    let { i: t, off: i } = this.childCursor().findPos(e, -1);
    for (; t < this.children.length - 1; ) {
      let r = this.children[t];
      if (i < r.length || r instanceof ye)
        break;
      t++, i = 0;
    }
    return this.children[t].domAtPos(i);
  }
  coordsAt(e, t) {
    let i = null, r = 0;
    for (let s = this.length, o = this.children.length - 1; o >= 0; o--) {
      let l = this.children[o], a = s - l.breakAfter, h = a - l.length;
      if (a < e)
        break;
      if (h <= e && (h < e || l.covers(-1)) && (a > e || l.covers(1)) && (!i || l instanceof ye && !(i instanceof ye && t >= 0)))
        i = l, r = h;
      else if (i && h == e && a == e && l instanceof Bt && Math.abs(t) < 2) {
        if (l.deco.startSide < 0)
          break;
        o && (i = null);
      }
      s = h;
    }
    return i ? i.coordsAt(e - r, t) : null;
  }
  coordsForChar(e) {
    let { i: t, off: i } = this.childPos(e, 1), r = this.children[t];
    if (!(r instanceof ye))
      return null;
    for (; r.children.length; ) {
      let { i: l, off: a } = r.childPos(i, 1);
      for (; ; l++) {
        if (l == r.children.length)
          return null;
        if ((r = r.children[l]).length)
          break;
      }
      i = a;
    }
    if (!(r instanceof at))
      return null;
    let s = Ee(r.text, i);
    if (s == i)
      return null;
    let o = hi(r.dom, i, s).getClientRects();
    for (let l = 0; l < o.length; l++) {
      let a = o[l];
      if (l == o.length - 1 || a.top < a.bottom && a.left < a.right)
        return a;
    }
    return null;
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: r } = e, s = this.view.contentDOM.clientWidth, o = s > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == oe.LTR;
    for (let h = 0, c = 0; c < this.children.length; c++) {
      let f = this.children[c], d = h + f.length;
      if (d > r)
        break;
      if (h >= i) {
        let g = f.dom.getBoundingClientRect();
        if (t.push(g.height), o) {
          let y = f.dom.lastChild, b = y ? dn(y) : [];
          if (b.length) {
            let x = b[b.length - 1], k = a ? x.right - g.left : g.right - x.left;
            k > l && (l = k, this.minWidth = s, this.minWidthFrom = h, this.minWidthTo = d);
          }
        }
      }
      h = d + f.breakAfter;
    }
    return t;
  }
  textDirectionAt(e) {
    let { i: t } = this.childPos(e, 1);
    return getComputedStyle(this.children[t].dom).direction == "rtl" ? oe.RTL : oe.LTR;
  }
  measureTextSize() {
    for (let s of this.children)
      if (s instanceof ye) {
        let o = s.measureTextSize();
        if (o)
          return o;
      }
    let e = document.createElement("div"), t, i, r;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(e);
      let s = dn(e.firstChild)[0];
      t = e.getBoundingClientRect().height, i = s ? s.width / 27 : 7, r = s ? s.height : t, e.remove();
    }), { lineHeight: t, charWidth: i, textHeight: r };
  }
  childCursor(e = this.length) {
    let t = this.children.length;
    return t && (e -= this.children[--t].length), new Vh(this.children, e, t);
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, r = 0; ; r++) {
      let s = r == t.viewports.length ? null : t.viewports[r], o = s ? s.from - 1 : this.length;
      if (o > i) {
        let l = (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(W.replace({
          widget: new eo(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!s)
        break;
      i = s.to + 1;
    }
    return W.set(e);
  }
  updateDeco() {
    let e = 1, t = this.view.state.facet(pn).map((s) => (this.dynamicDecorationMap[e++] = typeof s == "function") ? s(this.view) : s), i = !1, r = this.view.state.facet(cc).map((s, o) => {
      let l = typeof s == "function";
      return l && (i = !0), l ? s(this.view) : s;
    });
    for (r.length && (this.dynamicDecorationMap[e++] = i, t.push(j.join(r))), this.decorations = [
      this.editContextFormatting,
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    return this.decorations;
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let h of this.view.state.facet(lc))
      try {
        if (h(this.view, e.range, e))
          return !0;
      } catch (c) {
        Ve(this.view.state, c, "scroll handler");
      }
    let { range: t } = e, i = this.coordsAt(t.head, t.empty ? t.assoc : t.head > t.anchor ? -1 : 1), r;
    if (!i)
      return;
    !t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, r.left),
      top: Math.min(i.top, r.top),
      right: Math.max(i.right, r.right),
      bottom: Math.max(i.bottom, r.bottom)
    });
    let s = Wo(this.view), o = {
      left: i.left - s.left,
      top: i.top - s.top,
      right: i.right + s.right,
      bottom: i.bottom + s.bottom
    }, { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
    Md(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, l), -l), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == oe.LTR);
  }
}
function Yd(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
function dc(n, e) {
  let t = n.observer.selectionRange;
  if (!t.focusNode)
    return null;
  let i = Ih(t.focusNode, t.focusOffset), r = Hh(t.focusNode, t.focusOffset), s = i || r;
  if (r && i && r.node != i.node) {
    let l = ne.get(r.node);
    if (!l || l instanceof at && l.text != r.node.nodeValue)
      s = r;
    else if (n.docView.lastCompositionAfterCursor) {
      let a = ne.get(i.node);
      !a || a instanceof at && a.text != i.node.nodeValue || (s = r);
    }
  }
  if (n.docView.lastCompositionAfterCursor = s != i, !s)
    return null;
  let o = e - s.offset;
  return { from: o, to: o + s.node.nodeValue.length, node: s.node };
}
function Jd(n, e, t) {
  let i = dc(n, t);
  if (!i)
    return null;
  let { node: r, from: s, to: o } = i, l = r.nodeValue;
  if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
    return null;
  let a = e.invertedDesc, h = new it(a.mapPos(s), a.mapPos(o), s, o), c = [];
  for (let f = r.parentNode; ; f = f.parentNode) {
    let d = ne.get(f);
    if (d instanceof Pt)
      c.push({ node: f, deco: d.mark });
    else {
      if (d instanceof ye || f.nodeName == "DIV" && f.parentNode == n.contentDOM)
        return { range: h, text: r, marks: c, line: f };
      if (f != n.contentDOM)
        c.push({ node: f, deco: new An({
          inclusive: !0,
          attributes: Nd(f),
          tagName: f.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function Xd(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let _d = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    hr(e, t, this.changes);
  }
  comparePoint(e, t) {
    hr(e, t, this.changes);
  }
  boundChange(e) {
    hr(e, e, this.changes);
  }
};
function Qd(n, e, t) {
  let i = new _d();
  return j.compare(n, e, t, i), i.changes;
}
function Zd(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function ep(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, r) => {
    i < e.to && r > e.from && (t = !0);
  }), t;
}
function tp(n, e, t = 1) {
  let i = n.charCategorizer(e), r = n.doc.lineAt(e), s = e - r.from;
  if (r.length == 0)
    return M.cursor(e);
  s == 0 ? t = 1 : s == r.length && (t = -1);
  let o = s, l = s;
  t < 0 ? o = Ee(r.text, s, !1) : l = Ee(r.text, s);
  let a = i(r.text.slice(o, l));
  for (; o > 0; ) {
    let h = Ee(r.text, o, !1);
    if (i(r.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < r.length; ) {
    let h = Ee(r.text, l);
    if (i(r.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return M.range(o + r.from, l + r.from);
}
function ip(n, e) {
  return e.left > n ? e.left - n : Math.max(0, n - e.right);
}
function np(n, e) {
  return e.top > n ? e.top - n : Math.max(0, n - e.bottom);
}
function ds(n, e) {
  return n.top < e.bottom - 1 && n.bottom > e.top + 1;
}
function $l(n, e) {
  return e < n.top ? { top: e, left: n.left, right: n.right, bottom: n.bottom } : n;
}
function jl(n, e) {
  return e > n.bottom ? { top: n.top, left: n.left, right: n.right, bottom: e } : n;
}
function so(n, e, t) {
  let i, r, s, o, l = !1, a, h, c, f;
  for (let y = n.firstChild; y; y = y.nextSibling) {
    let b = dn(y);
    for (let x = 0; x < b.length; x++) {
      let k = b[x];
      r && ds(r, k) && (k = $l(jl(k, r.bottom), r.top));
      let D = ip(e, k), T = np(t, k);
      if (D == 0 && T == 0)
        return y.nodeType == 3 ? Ul(y, e, t) : so(y, e, t);
      if (!i || o > T || o == T && s > D) {
        i = y, r = k, s = D, o = T;
        let E = T ? t < k.top ? -1 : 1 : D ? e < k.left ? -1 : 1 : 0;
        l = !E || (E > 0 ? x < b.length - 1 : x > 0);
      }
      D == 0 ? t > k.bottom && (!c || c.bottom < k.bottom) ? (a = y, c = k) : t < k.top && (!f || f.top > k.top) && (h = y, f = k) : c && ds(c, k) ? c = jl(c, k.bottom) : f && ds(f, k) && (f = $l(f, k.top));
    }
  }
  if (c && c.bottom >= t ? (i = a, r = c) : f && f.top <= t && (i = h, r = f), !i)
    return { node: n, offset: 0 };
  let d = Math.max(r.left, Math.min(r.right, e));
  if (i.nodeType == 3)
    return Ul(i, d, t);
  if (l && i.contentEditable != "false")
    return so(i, d, t);
  let g = Array.prototype.indexOf.call(n.childNodes, i) + (e >= (r.left + r.right) / 2 ? 1 : 0);
  return { node: n, offset: g };
}
function Ul(n, e, t) {
  let i = n.nodeValue.length, r = -1, s = 1e9, o = 0;
  for (let l = 0; l < i; l++) {
    let a = hi(n, l, l + 1).getClientRects();
    for (let h = 0; h < a.length; h++) {
      let c = a[h];
      if (c.top == c.bottom)
        continue;
      o || (o = e - c.left);
      let f = (c.top > t ? c.top - t : t - c.bottom) - 1;
      if (c.left - 1 <= e && c.right + 1 >= e && f < s) {
        let d = e >= (c.left + c.right) / 2, g = d;
        if ((I.chrome || I.gecko) && hi(n, l).getBoundingClientRect().left == c.right && (g = !d), f <= 0)
          return { node: n, offset: l + (g ? 1 : 0) };
        r = l + (g ? 1 : 0), s = f;
      }
    }
  }
  return { node: n, offset: r > -1 ? r : o > 0 ? n.nodeValue.length : 0 };
}
function pc(n, e, t, i = -1) {
  var r, s;
  let o = n.contentDOM.getBoundingClientRect(), l = o.top + n.viewState.paddingTop, a, { docHeight: h } = n.viewState, { x: c, y: f } = e, d = f - l;
  if (d < 0)
    return 0;
  if (d > h)
    return n.state.doc.length;
  for (let E = n.viewState.heightOracle.textHeight / 2, O = !1; a = n.elementAtHeight(d), a.type != We.Text; )
    for (; d = i > 0 ? a.bottom + E : a.top - E, !(d >= 0 && d <= h); ) {
      if (O)
        return t ? null : 0;
      O = !0, i = -i;
    }
  f = l + d;
  let g = a.from;
  if (g < n.viewport.from)
    return n.viewport.from == 0 ? 0 : t ? null : Gl(n, o, a, c, f);
  if (g > n.viewport.to)
    return n.viewport.to == n.state.doc.length ? n.state.doc.length : t ? null : Gl(n, o, a, c, f);
  let y = n.dom.ownerDocument, b = n.root.elementFromPoint ? n.root : y, x = b.elementFromPoint(c, f);
  x && !n.contentDOM.contains(x) && (x = null), x || (c = Math.max(o.left + 1, Math.min(o.right - 1, c)), x = b.elementFromPoint(c, f), x && !n.contentDOM.contains(x) && (x = null));
  let k, D = -1;
  if (x && ((r = n.docView.nearest(x)) === null || r === void 0 ? void 0 : r.isEditable) != !1) {
    if (y.caretPositionFromPoint) {
      let E = y.caretPositionFromPoint(c, f);
      E && ({ offsetNode: k, offset: D } = E);
    } else if (y.caretRangeFromPoint) {
      let E = y.caretRangeFromPoint(c, f);
      E && ({ startContainer: k, startOffset: D } = E, (!n.contentDOM.contains(k) || I.safari && rp(k, D, c) || I.chrome && sp(k, D, c)) && (k = void 0));
    }
    k && (D = Math.min(At(k), D));
  }
  if (!k || !n.docView.dom.contains(k)) {
    let E = ye.find(n.docView, g);
    if (!E)
      return d > a.top + a.height / 2 ? a.to : a.from;
    ({ node: k, offset: D } = so(E.dom, c, f));
  }
  let T = n.docView.nearest(k);
  if (!T)
    return null;
  if (T.isWidget && ((s = T.dom) === null || s === void 0 ? void 0 : s.nodeType) == 1) {
    let E = T.dom.getBoundingClientRect();
    return e.y < E.top || e.y <= E.bottom && e.x <= (E.left + E.right) / 2 ? T.posAtStart : T.posAtEnd;
  } else
    return T.localPosFromDOM(k, D) + T.posAtStart;
}
function Gl(n, e, t, i, r) {
  let s = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((r - t.top - (n.defaultLineHeight - l) * 0.5) / l);
    s += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(t.from, t.to);
  return t.from + js(o, s, n.state.tabSize);
}
function rp(n, e, t) {
  let i;
  if (n.nodeType != 3 || e != (i = n.nodeValue.length))
    return !1;
  for (let r = n.nextSibling; r; r = r.nextSibling)
    if (r.nodeType != 1 || r.nodeName != "BR")
      return !1;
  return hi(n, i - 1, i).getBoundingClientRect().left > t;
}
function sp(n, e, t) {
  if (e != 0)
    return !1;
  for (let r = n; ; ) {
    let s = r.parentNode;
    if (!s || s.nodeType != 1 || s.firstChild != r)
      return !1;
    if (s.classList.contains("cm-line"))
      break;
    r = s;
  }
  let i = n.nodeType == 1 ? n.getBoundingClientRect() : hi(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
  return t - i.left > 5;
}
function oo(n, e) {
  let t = n.lineBlockAt(e);
  if (Array.isArray(t.type)) {
    for (let i of t.type)
      if (i.to > e || i.to == e && (i.to == t.to || i.type == We.Text))
        return i;
  }
  return t;
}
function op(n, e, t, i) {
  let r = oo(n, e.head), s = !i || r.type != We.Text || !(n.lineWrapping || r.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > r.from ? e.head - 1 : e.head);
  if (s) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(r.from), a = n.posAtCoords({
      x: t == (l == oe.LTR) ? o.right - 1 : o.left + 1,
      y: (s.top + s.bottom) / 2
    });
    if (a != null)
      return M.cursor(a, t ? -1 : 1);
  }
  return M.cursor(t ? r.to : r.from, t ? -1 : 1);
}
function Yl(n, e, t, i) {
  let r = n.state.doc.lineAt(e.head), s = n.bidiSpans(r), o = n.textDirectionAt(r.from);
  for (let l = e, a = null; ; ) {
    let h = jd(r, s, o, l, t), c = Qh;
    if (!h) {
      if (r.number == (t ? n.state.doc.lines : 1))
        return l;
      c = `
`, r = n.state.doc.line(r.number + (t ? 1 : -1)), s = n.bidiSpans(r), h = n.visualLineSide(r, !t);
    }
    if (a) {
      if (!a(c))
        return l;
    } else {
      if (!i)
        return h;
      a = i(c);
    }
    l = h;
  }
}
function lp(n, e, t) {
  let i = n.state.charCategorizer(e), r = i(t);
  return (s) => {
    let o = i(s);
    return r == ae.Space && (r = o), r == o;
  };
}
function ap(n, e, t, i) {
  let r = e.head, s = t ? 1 : -1;
  if (r == (t ? n.state.doc.length : 0))
    return M.cursor(r, e.assoc);
  let o = e.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(r, e.assoc || -1), c = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = s < 0 ? h.top : h.bottom;
  else {
    let g = n.viewState.lineBlockAt(r);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (r - g.from))), l = (s < 0 ? g.top : g.bottom) + c;
  }
  let f = a.left + o, d = i ?? n.viewState.heightOracle.textHeight >> 1;
  for (let g = 0; ; g += 10) {
    let y = l + (d + g) * s, b = pc(n, { x: f, y }, !1, s);
    if (y < a.top || y > a.bottom || (s < 0 ? b < r : b > r)) {
      let x = n.docView.coordsForChar(b), k = !x || y < x.top ? -1 : 1;
      return M.cursor(b, k, void 0, o);
    }
  }
}
function cr(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let r of n)
      r.between(e - 1, e + 1, (s, o, l) => {
        if (e > s && e < o) {
          let a = i || t || (e - s < o - e ? -1 : 1);
          e = a < 0 ? s : o, i = a;
        }
      });
    if (!i)
      return e;
  }
}
function ps(n, e, t) {
  let i = cr(n.state.facet(Vo).map((r) => r(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : M.cursor(i, i < t.from ? 1 : -1);
}
const Qi = "￿";
class hp {
  constructor(e, t) {
    this.points = e, this.text = "", this.lineSeparator = t.facet(X.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += Qi;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let r = e; ; ) {
      this.findPointBefore(i, r);
      let s = this.text.length;
      this.readNode(r);
      let o = r.nextSibling;
      if (o == t)
        break;
      let l = ne.get(r), a = ne.get(o);
      (l && a ? l.breakAfter : (l ? l.breakAfter : xr(r)) || xr(o) && (r.nodeName != "BR" || r.cmIgnore) && this.text.length > s) && this.lineBreak(), r = o;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, r = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s = -1, o = 1, l;
      if (this.lineSeparator ? (s = t.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = r.exec(t)) && (s = l.index, o = l[0].length), this.append(t.slice(i, s < 0 ? t.length : s)), s < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
      i = s + o;
    }
  }
  readNode(e) {
    if (e.cmIgnore)
      return;
    let t = ne.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let r = i.iter(); !r.next().done; )
        r.lineBreak ? this.lineBreak() : this.append(r.value);
    } else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (cp(e, i.node, i.offset) ? t : 0));
  }
}
function cp(n, e, t) {
  for (; ; ) {
    if (!e || t < At(e))
      return !1;
    if (e == n)
      return !0;
    t = ai(e) + 1, e = e.parentNode;
  }
}
class Jl {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class fp {
  constructor(e, t, i, r) {
    this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
    let { impreciseHead: s, impreciseAnchor: o } = e.docView;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = e.docView.domBoundsAround(t, i, 0))) {
      let l = s || o ? [] : pp(e), a = new hp(l, e.state);
      a.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = a.text, this.newSel = gp(l, this.bounds.from);
    } else {
      let l = e.observer.selectionRange, a = s && s.node == l.focusNode && s.offset == l.focusOffset || !Ys(e.contentDOM, l.focusNode) ? e.state.selection.main.head : e.docView.posFromDOM(l.focusNode, l.focusOffset), h = o && o.node == l.anchorNode && o.offset == l.anchorOffset || !Ys(e.contentDOM, l.anchorNode) ? e.state.selection.main.anchor : e.docView.posFromDOM(l.anchorNode, l.anchorOffset), c = e.viewport;
      if ((I.ios || I.chrome) && e.state.selection.main.empty && a != h && (c.from > 0 || c.to < e.state.doc.length)) {
        let f = Math.min(a, h), d = Math.max(a, h), g = c.from - f, y = c.to - d;
        (g == 0 || g == 1 || f == 0) && (y == 0 || y == -1 || d == e.state.doc.length) && (a = 0, h = e.state.doc.length);
      }
      this.newSel = M.single(h, a);
    }
  }
}
function gc(n, e) {
  let t, { newSel: i } = e, r = n.state.selection.main, s = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: o, to: l } = e.bounds, a = r.from, h = null;
    (s === 8 || I.android && e.text.length < l - o) && (a = r.to, h = "end");
    let c = dp(n.state.doc.sliceString(o, l, Qi), e.text, a - o, h);
    c && (I.chrome && s == 13 && c.toB == c.from + 2 && e.text.slice(c.from, c.toB) == Qi + Qi && c.toB--, t = {
      from: o + c.from,
      to: o + c.toA,
      insert: J.of(e.text.slice(c.from, c.toB).split(Qi))
    });
  } else i && (!n.hasFocus && n.state.facet(Et) || i.main.eq(r)) && (i = null);
  if (!t && !i)
    return !1;
  if (!t && e.typeOver && !r.empty && i && i.main.empty ? t = { from: r.from, to: r.to, insert: n.state.doc.slice(r.from, r.to) } : (I.mac || I.android) && t && t.from == t.to && t.from == r.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = M.single(i.main.anchor - 1, i.main.head - 1)), t = { from: t.from, to: t.to, insert: J.of([t.insert.toString().replace(".", " ")]) }) : t && t.from >= r.from && t.to <= r.to && (t.from != r.from || t.to != r.to) && r.to - r.from - (t.to - t.from) <= 4 ? t = {
    from: r.from,
    to: r.to,
    insert: n.state.doc.slice(r.from, t.from).append(t.insert).append(n.state.doc.slice(t.to, r.to))
  } : I.chrome && t && t.from == t.to && t.from == r.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = M.single(i.main.anchor - 1, i.main.head - 1)), t = { from: r.from, to: r.to, insert: J.of([" "]) }), t)
    return zo(n, t, i, s);
  if (i && !i.main.eq(r)) {
    let o = !1, l = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (o = !0), l = n.inputState.lastSelectionOrigin), n.dispatch({ selection: i, scrollIntoView: o, userEvent: l }), !0;
  } else
    return !1;
}
function zo(n, e, t, i = -1) {
  if (I.ios && n.inputState.flushIOSKey(e))
    return !0;
  let r = n.state.selection.main;
  if (I.android && (e.to == r.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == r.from || e.from == r.from - 1 && n.state.sliceDoc(e.from, r.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && Ai(n.contentDOM, "Enter", 13) || (e.from == r.from - 1 && e.to == r.to && e.insert.length == 0 || i == 8 && e.insert.length < e.to - e.from && e.to > r.head) && Ai(n.contentDOM, "Backspace", 8) || e.from == r.from && e.to == r.to + 1 && e.insert.length == 0 && Ai(n.contentDOM, "Delete", 46)))
    return !0;
  let s = e.insert.toString();
  n.inputState.composing >= 0 && n.inputState.composing++;
  let o, l = () => o || (o = up(n, e, t));
  return n.state.facet(nc).some((a) => a(n, e.from, e.to, s, l)) || n.dispatch(l()), !0;
}
function up(n, e, t) {
  let i, r = n.state, s = r.selection.main;
  if (e.from >= s.from && e.to <= s.to && e.to - e.from >= (s.to - s.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let l = s.from < e.from ? r.sliceDoc(s.from, e.from) : "", a = s.to > e.to ? r.sliceDoc(e.to, s.to) : "";
    i = r.replaceSelection(n.state.toText(l + e.insert.sliceString(0, void 0, n.state.lineBreak) + a));
  } else {
    let l = r.changes(e), a = t && t.main.to <= l.newLength ? t.main : void 0;
    if (r.selection.ranges.length > 1 && n.inputState.composing >= 0 && e.to <= s.to && e.to >= s.to - 10) {
      let h = n.state.sliceDoc(e.from, e.to), c, f = t && dc(n, t.main.head);
      if (f) {
        let y = e.insert.length - (e.to - e.from);
        c = { from: f.from, to: f.to - y };
      } else
        c = n.state.doc.lineAt(s.head);
      let d = s.to - e.to, g = s.to - s.from;
      i = r.changeByRange((y) => {
        if (y.from == s.from && y.to == s.to)
          return { changes: l, range: a || y.map(l) };
        let b = y.to - d, x = b - h.length;
        if (y.to - y.from != g || n.state.sliceDoc(x, b) != h || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        y.to >= c.from && y.from <= c.to)
          return { range: y };
        let k = r.changes({ from: x, to: b, insert: e.insert }), D = y.to - s.to;
        return {
          changes: k,
          range: a ? M.range(Math.max(0, a.anchor + D), Math.max(0, a.head + D)) : y.map(k)
        };
      });
    } else
      i = {
        changes: l,
        selection: a && r.selection.replaceRange(a)
      };
  }
  let o = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, o += ".compose", n.inputState.compositionFirstChange && (o += ".start", n.inputState.compositionFirstChange = !1)), r.update(i, { userEvent: o, scrollIntoView: !0 });
}
function dp(n, e, t, i) {
  let r = Math.min(n.length, e.length), s = 0;
  for (; s < r && n.charCodeAt(s) == e.charCodeAt(s); )
    s++;
  if (s == r && n.length == e.length)
    return null;
  let o = n.length, l = e.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, s - Math.min(o, l));
    t -= o + a - s;
  }
  if (o < s && n.length < e.length) {
    let a = t <= s && t >= o ? s - t : 0;
    s -= a, l = s + (l - o), o = s;
  } else if (l < s) {
    let a = t <= s && t >= l ? s - t : 0;
    s -= a, o = s + (o - l), l = s;
  }
  return { from: s, toA: o, toB: l };
}
function pp(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s } = n.observer.selectionRange;
  return t && (e.push(new Jl(t, i)), (r != t || s != i) && e.push(new Jl(r, s))), e;
}
function gp(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? M.single(t + e, i + e) : null;
}
class mp {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, I.safari && e.contentDOM.addEventListener("input", () => null), I.gecko && Lp(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !Cp(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || (this.view.updateState != 0 ? Promise.resolve().then(() => this.runHandlers(e.type, e)) : this.runHandlers(e.type, e));
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let r of i.observers)
        r(this.view, t);
      for (let r of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (r(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = yp(e), i = this.handlers, r = this.view.contentDOM;
    for (let s in t)
      if (s != "scroll") {
        let o = !t[s].handlers.length, l = i[s];
        l && o != !l.handlers.length && (r.removeEventListener(s, this.handleEvent), l = null), l || r.addEventListener(s, this.handleEvent, { passive: o });
      }
    for (let s in i)
      s != "scroll" && !t[s] && r.removeEventListener(s, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && yc.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), I.android && I.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let t;
    return I.ios && !e.synthetic && !e.altKey && !e.metaKey && ((t = mc.find((i) => i.keyCode == e.keyCode)) && !e.ctrlKey || bp.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = t || e, setTimeout(() => this.flushIOSKey(), 250), !0) : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey(e) {
    let t = this.pendingIOSKey;
    return !t || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Ai(this.view.contentDOM, t.key, t.keyCode, t instanceof KeyboardEvent ? t : void 0));
  }
  ignoreDuringComposition(e) {
    return /^key/.test(e.type) ? this.composing > 0 ? !0 : I.safari && !I.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Xl(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (r) {
      Ve(t.state, r);
    }
  };
}
function yp(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let r = i.spec;
    if (r && r.domEventHandlers)
      for (let s in r.domEventHandlers) {
        let o = r.domEventHandlers[s];
        o && t(s).handlers.push(Xl(i.value, o));
      }
    if (r && r.domEventObservers)
      for (let s in r.domEventObservers) {
        let o = r.domEventObservers[s];
        o && t(s).observers.push(Xl(i.value, o));
      }
  }
  for (let i in ht)
    t(i).handlers.push(ht[i]);
  for (let i in rt)
    t(i).observers.push(rt[i]);
  return e;
}
const mc = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], bp = "dthko", yc = [16, 17, 18, 20, 91, 92, 224, 225], qn = 6;
function Kn(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function xp(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class vp {
  constructor(e, t, i, r) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = r, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParents = Dd(e.contentDOM), this.atoms = e.state.facet(Vo).map((o) => o(e));
    let s = e.contentDOM.ownerDocument;
    s.addEventListener("mousemove", this.move = this.move.bind(this)), s.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(X.allowMultipleSelections) && wp(e, t), this.dragging = Sp(e, t) && vc(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && xp(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let t = 0, i = 0, r = 0, s = 0, o = this.view.win.innerWidth, l = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: r, right: o } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: s, bottom: l } = this.scrollParents.y.getBoundingClientRect());
    let a = Wo(this.view);
    e.clientX - a.left <= r + qn ? t = -Kn(r - e.clientX) : e.clientX + a.right >= o - qn && (t = Kn(e.clientX - o)), e.clientY - a.top <= s + qn ? i = -Kn(s - e.clientY) : e.clientY + a.bottom >= l - qn && (i = Kn(e.clientY - l)), this.setScrollSpeed(t, i);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: e, y: t } = this.scrollSpeed;
    e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), t && this.scrollParents.y && (this.scrollParents.y.scrollTop += t, t = 0), (e || t) && this.view.win.scrollBy(e, t), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(e) {
    let t = null;
    for (let i = 0; i < e.ranges.length; i++) {
      let r = e.ranges[i], s = null;
      if (r.empty) {
        let o = cr(this.atoms, r.from, 0);
        o != r.from && (s = M.cursor(o, -1));
      } else {
        let o = cr(this.atoms, r.from, -1), l = cr(this.atoms, r.to, 1);
        (o != r.from || l != r.to) && (s = M.range(r.from == r.anchor ? o : l, r.from == r.head ? o : l));
      }
      s && (t || (t = e.ranges.slice()), t[i] = s);
    }
    return t ? M.create(t, e.mainIndex) : e;
  }
  select(e) {
    let { view: t } = this, i = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((t) => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function wp(n, e) {
  let t = n.state.facet(Zh);
  return t.length ? t[0](e) : I.mac ? e.metaKey : e.ctrlKey;
}
function kp(n, e) {
  let t = n.state.facet(ec);
  return t.length ? t[0](e) : I.mac ? !e.altKey : !e.ctrlKey;
}
function Sp(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = un(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let r = i.getRangeAt(0).getClientRects();
  for (let s = 0; s < r.length; s++) {
    let o = r[s];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function Cp(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = ne.get(t)) && i.ignoreEvent(e))
      return !1;
  return !0;
}
const ht = /* @__PURE__ */ Object.create(null), rt = /* @__PURE__ */ Object.create(null), bc = I.ie && I.ie_version < 15 || I.ios && I.webkit_version < 604;
function Ap(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), xc(n, t.value);
  }, 50);
}
function Wr(n, e, t) {
  for (let i of n.facet(e))
    t = i(t, n);
  return t;
}
function xc(n, e) {
  e = Wr(n.state, No, e);
  let { state: t } = n, i, r = 1, s = t.toText(e), o = s.lines == t.selection.ranges.length;
  if (lo != null && t.selection.ranges.every((a) => a.empty) && lo == s.toString()) {
    let a = -1;
    i = t.changeByRange((h) => {
      let c = t.doc.lineAt(h.from);
      if (c.from == a)
        return { range: h };
      a = c.from;
      let f = t.toText((o ? s.line(r++).text : e) + t.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: M.cursor(h.from + f.length)
      };
    });
  } else o ? i = t.changeByRange((a) => {
    let h = s.line(r++);
    return {
      changes: { from: a.from, to: a.to, insert: h.text },
      range: M.cursor(a.from + h.length)
    };
  }) : i = t.replaceSelection(s);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
rt.scroll = (n) => {
  n.inputState.lastScrollTop = n.scrollDOM.scrollTop, n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft;
};
ht.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && n.inputState.tabFocusMode != 0 && (n.inputState.tabFocusMode = Date.now() + 2e3), !1);
rt.touchstart = (n, e) => {
  n.inputState.lastTouchTime = Date.now(), n.inputState.setSelectionOrigin("select.pointer");
};
rt.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
ht.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(tc))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = Op(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new vp(n, e, t, i)), i && n.observer.ignore(() => {
      Rh(n.contentDOM);
      let s = n.root.activeElement;
      s && !s.contains(n.contentDOM) && s.blur();
    });
    let r = n.inputState.mouseSelection;
    if (r)
      return r.start(e), r.dragging === !1;
  }
  return !1;
};
function _l(n, e, t, i) {
  if (i == 1)
    return M.cursor(e, t);
  if (i == 2)
    return tp(n.state, e, t);
  {
    let r = ye.find(n.docView, e), s = n.state.doc.lineAt(r ? r.posAtEnd : e), o = r ? r.posAtStart : s.from, l = r ? r.posAtEnd : s.to;
    return l < n.state.doc.length && l == s.to && l++, M.range(o, l);
  }
}
let Ql = (n, e, t) => e >= t.top && e <= t.bottom && n >= t.left && n <= t.right;
function Mp(n, e, t, i) {
  let r = ye.find(n.docView, e);
  if (!r)
    return 1;
  let s = e - r.posAtStart;
  if (s == 0)
    return 1;
  if (s == r.length)
    return -1;
  let o = r.coordsAt(s, -1);
  if (o && Ql(t, i, o))
    return -1;
  let l = r.coordsAt(s, 1);
  return l && Ql(t, i, l) ? 1 : o && o.bottom >= i ? -1 : 1;
}
function Zl(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: t, bias: Mp(n, t, e.clientX, e.clientY) };
}
const Dp = I.ie && I.ie_version <= 11;
let ea = null, ta = 0, ia = 0;
function vc(n) {
  if (!Dp)
    return n.detail;
  let e = ea, t = ia;
  return ea = n, ia = Date.now(), ta = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (ta + 1) % 3 : 1;
}
function Op(n, e) {
  let t = Zl(n, e), i = vc(e), r = n.state.selection;
  return {
    update(s) {
      s.docChanged && (t.pos = s.changes.mapPos(t.pos), r = r.map(s.changes));
    },
    get(s, o, l) {
      let a = Zl(n, s), h, c = _l(n, a.pos, a.bias, i);
      if (t.pos != a.pos && !o) {
        let f = _l(n, t.pos, t.bias, i), d = Math.min(f.from, c.from), g = Math.max(f.to, c.to);
        c = d < c.from ? M.range(d, g) : M.range(g, d);
      }
      return o ? r.replaceRange(r.main.extend(c.from, c.to)) : l && i == 1 && r.ranges.length > 1 && (h = Tp(r, a.pos)) ? h : l ? r.addRange(c) : M.create([c]);
    }
  };
}
function Tp(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: r } = n.ranges[t];
    if (i <= e && r >= e)
      return M.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
ht.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let r = n.docView.nearest(e.target);
    if (r && r.isWidget) {
      let s = r.posAtStart, o = s + r.length;
      (s >= t.to || o <= t.from) && (t = M.range(s, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", Wr(n.state, Io, n.state.sliceDoc(t.from, t.to))), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
ht.dragend = (n) => (n.inputState.draggedContent = null, !1);
function na(n, e, t, i) {
  if (t = Wr(n.state, No, t), !t)
    return;
  let r = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: s } = n.inputState, o = i && s && kp(n, e) ? { from: s.from, to: s.to } : null, l = { from: r, insert: t }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(r, -1), head: a.mapPos(r, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
ht.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), r = 0, s = () => {
      ++r == t.length && na(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let l = new FileReader();
      l.onerror = s, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), s();
      }, l.readAsText(t[o]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return na(n, e, i, !0), !0;
  }
  return !1;
};
ht.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = bc ? null : e.clipboardData;
  return t ? (xc(n, t.getData("text/plain") || t.getData("text/uri-list")), !0) : (Ap(n), !1);
};
function Ep(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function Bp(n) {
  let e = [], t = [], i = !1;
  for (let r of n.selection.ranges)
    r.empty || (e.push(n.sliceDoc(r.from, r.to)), t.push(r));
  if (!e.length) {
    let r = -1;
    for (let { from: s } of n.selection.ranges) {
      let o = n.doc.lineAt(s);
      o.number > r && (e.push(o.text), t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), r = o.number;
    }
    i = !0;
  }
  return { text: Wr(n, Io, e.join(n.lineBreak)), ranges: t, linewise: i };
}
let lo = null;
ht.copy = ht.cut = (n, e) => {
  let { text: t, ranges: i, linewise: r } = Bp(n.state);
  if (!t && !r)
    return !1;
  lo = r ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let s = bc ? null : e.clipboardData;
  return s ? (s.clearData(), s.setData("text/plain", t), !0) : (Ep(n, t), !1);
};
const wc = /* @__PURE__ */ Rt.define();
function kc(n, e) {
  let t = [];
  for (let i of n.facet(rc)) {
    let r = i(n, e);
    r && t.push(r);
  }
  return t ? n.update({ effects: t, annotations: wc.of(!0) }) : null;
}
function Sc(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = kc(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
rt.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), Sc(n);
};
rt.blur = (n) => {
  n.observer.clearSelectionRange(), Sc(n);
};
rt.compositionstart = rt.compositionupdate = (n) => {
  n.observer.editContext || (n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0));
};
rt.compositionend = (n) => {
  n.observer.editContext || (n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, I.chrome && I.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50));
};
rt.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
ht.beforeinput = (n, e) => {
  var t, i;
  if (e.inputType == "insertReplacementText" && n.observer.editContext) {
    let s = (t = e.dataTransfer) === null || t === void 0 ? void 0 : t.getData("text/plain"), o = e.getTargetRanges();
    if (s && o.length) {
      let l = o[0], a = n.posAtDOM(l.startContainer, l.startOffset), h = n.posAtDOM(l.endContainer, l.endOffset);
      return zo(n, { from: a, to: h, insert: n.state.toText(s) }, null), !0;
    }
  }
  let r;
  if (I.chrome && I.android && (r = mc.find((s) => s.inputType == e.inputType)) && (n.observer.delayAndroidKey(r.key, r.keyCode), r.key == "Backspace" || r.key == "Delete")) {
    let s = ((i = window.visualViewport) === null || i === void 0 ? void 0 : i.height) || 0;
    setTimeout(() => {
      var o;
      (((o = window.visualViewport) === null || o === void 0 ? void 0 : o.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return I.ios && e.inputType == "deleteContentForward" && n.observer.flushSoon(), I.safari && e.inputType == "insertText" && n.inputState.composing >= 0 && setTimeout(() => rt.compositionend(n, e), 20), !1;
};
const ra = /* @__PURE__ */ new Set();
function Lp(n) {
  ra.has(n) || (ra.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const sa = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let Li = !1;
function oa() {
  Li = !1;
}
class Pp {
  constructor(e) {
    this.lineWrapping = e, this.doc = J.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return sa.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      r < 0 ? i++ : this.heightSamples[Math.floor(r * 10)] || (t = !0, this.heightSamples[Math.floor(r * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, r, s, o) {
    let l = sa.indexOf(e) > -1, a = Math.round(t) != Math.round(this.lineHeight) || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = t, this.charWidth = i, this.textHeight = r, this.lineLength = s, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return a;
  }
}
class Rp {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class vt {
  /**
  @internal
  */
  constructor(e, t, i, r, s) {
    this.from = e, this.length = t, this.top = i, this.height = r, this._content = s;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? We.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof Gt ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new vt(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var se = /* @__PURE__ */ function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
}(se || (se = {}));
const fr = 1e-3;
class ze {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e) {
    this.height != e && (Math.abs(this.height - e) > fr && (Li = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return ze.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, r) {
    let s = this, o = i.doc;
    for (let l = r.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: c, toB: f } = r[l], d = s.lineAt(a, se.ByPosNoHeight, i.setDoc(t), 0, 0), g = d.to >= h ? d : s.lineAt(h, se.ByPosNoHeight, i, 0, 0);
      for (f += g.to - h, h = g.to; l > 0 && d.from <= r[l - 1].toA; )
        a = r[l - 1].fromA, c = r[l - 1].fromB, l--, a < d.from && (d = s.lineAt(a, se.ByPosNoHeight, i, 0, 0));
      c += d.from - a, a = d.from;
      let y = qo.build(i.setDoc(o), e, c, f);
      s = kr(s, s.replace(a, h, y));
    }
    return s.updateHeight(i, 0);
  }
  static empty() {
    return new _e(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, r = 0, s = 0;
    for (; ; )
      if (t == i)
        if (r > s * 2) {
          let l = e[t - 1];
          l.break ? e.splice(--t, 1, l.left, null, l.right) : e.splice(--t, 1, l.left, l.right), i += 1 + l.break, r -= l.size;
        } else if (s > r * 2) {
          let l = e[i];
          l.break ? e.splice(i, 1, l.left, null, l.right) : e.splice(i, 1, l.left, l.right), i += 2 + l.break, s -= l.size;
        } else
          break;
      else if (r < s) {
        let l = e[t++];
        l && (r += l.size);
      } else {
        let l = e[--i];
        l && (s += l.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, i++), new Fp(ze.of(e.slice(0, t)), o, ze.of(e.slice(i)));
  }
}
function kr(n, e) {
  return n == e ? n : (n.constructor != e.constructor && (Li = !0), e);
}
ze.prototype.size = 1;
class Cc extends ze {
  constructor(e, t, i) {
    super(e, t), this.deco = i;
  }
  blockAt(e, t, i, r) {
    return new vt(r, this.length, i, this.height, this.deco || 0);
  }
  lineAt(e, t, i, r, s) {
    return this.blockAt(0, i, r, s);
  }
  forEachLine(e, t, i, r, s, o) {
    e <= s + this.length && t >= s && o(this.blockAt(0, i, r, s));
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more && this.setHeight(r.heights[r.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class _e extends Cc {
  constructor(e, t) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(e, t, i, r) {
    return new vt(r, this.length, i, this.height, this.breaks);
  }
  replace(e, t, i) {
    let r = i[0];
    return i.length == 1 && (r instanceof _e || r instanceof De && r.flags & 4) && Math.abs(this.length - r.length) < 10 ? (r instanceof De ? r = new _e(r.length, this.height) : r.height = this.height, this.outdated || (r.outdated = !1), r) : ze.of(i);
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more ? this.setHeight(r.heights[r.index++]) : (i || this.outdated) && this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class De extends ze {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, r = e.doc.lineAt(t + this.length).number, s = r - i + 1, o, l = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * s);
      o = a / s, this.length > s + 1 && (l = (this.height - a) / (this.length - s - 1));
    } else
      o = this.height / s;
    return { firstLine: i, lastLine: r, perLine: o, perChar: l };
  }
  blockAt(e, t, i, r) {
    let { firstLine: s, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(t, r);
    if (t.lineWrapping) {
      let h = r + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length)), c = t.doc.lineAt(h), f = l + c.length * a, d = Math.max(i, e - f / 2);
      return new vt(c.from, c.length, d, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - s, Math.floor((e - i) / l))), { from: c, length: f } = t.doc.line(s + h);
      return new vt(c, f, i + l * h, l, 0);
    }
  }
  lineAt(e, t, i, r, s) {
    if (t == se.ByHeight)
      return this.blockAt(e, i, r, s);
    if (t == se.ByPosNoHeight) {
      let { from: g, to: y } = i.doc.lineAt(e);
      return new vt(g, y - g, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, s), h = i.doc.lineAt(e), c = l + h.length * a, f = h.number - o, d = r + l * f + a * (h.from - s - f);
    return new vt(h.from, h.length, Math.max(r, Math.min(d, r + this.height - c)), c, 0);
  }
  forEachLine(e, t, i, r, s, o) {
    e = Math.max(e, s), t = Math.min(t, s + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, s);
    for (let c = e, f = r; c <= t; ) {
      let d = i.doc.lineAt(c);
      if (c == e) {
        let y = d.number - l;
        f += a * y + h * (e - s - y);
      }
      let g = a + h * d.length;
      o(new vt(d.from, d.length, f, g, 0)), f += g, c = d.to + 1;
    }
  }
  replace(e, t, i) {
    let r = this.length - t;
    if (r > 0) {
      let s = i[i.length - 1];
      s instanceof De ? i[i.length - 1] = new De(s.length + r) : i.push(null, new De(r - 1));
    }
    if (e > 0) {
      let s = i[0];
      s instanceof De ? i[0] = new De(e + s.length) : i.unshift(new De(e - 1), null);
    }
    return ze.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new De(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new De(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, r) {
    let s = t + this.length;
    if (r && r.from <= t + this.length && r.more) {
      let o = [], l = Math.max(t, r.from), a = -1;
      for (r.from > t && o.push(new De(r.from - t - 1).updateHeight(e, t)); l <= s && r.more; ) {
        let c = e.doc.lineAt(l).length;
        o.length && o.push(null);
        let f = r.heights[r.index++];
        a == -1 ? a = f : Math.abs(f - a) >= fr && (a = -2);
        let d = new _e(c, f);
        d.outdated = !1, o.push(d), l += c + 1;
      }
      l <= s && o.push(null, new De(s - l).updateHeight(e, l));
      let h = ze.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= fr || Math.abs(a - this.heightMetrics(e, t).perLine) >= fr) && (Li = !0), kr(this, h);
    } else (i || this.outdated) && (this.setHeight(e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Fp extends ze {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, r) {
    let s = i + this.left.height;
    return e < s ? this.left.blockAt(e, t, i, r) : this.right.blockAt(e, t, s, r + this.left.length + this.break);
  }
  lineAt(e, t, i, r, s) {
    let o = r + this.left.height, l = s + this.left.length + this.break, a = t == se.ByHeight ? e < o : e < l, h = a ? this.left.lineAt(e, t, i, r, s) : this.right.lineAt(e, t, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let c = t == se.ByPosNoHeight ? se.ByPosNoHeight : se.ByPos;
    return a ? h.join(this.right.lineAt(l, c, i, o, l)) : this.left.lineAt(l, c, i, r, s).join(h);
  }
  forEachLine(e, t, i, r, s, o) {
    let l = r + this.left.height, a = s + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, i, r, s, o), t >= a && this.right.forEachLine(e, t, i, l, a, o);
    else {
      let h = this.lineAt(a, se.ByPos, i, r, s);
      e < h.from && this.left.forEachLine(e, h.from - 1, i, r, s, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, i, l, a, o);
    }
  }
  replace(e, t, i) {
    let r = this.left.length + this.break;
    if (t < r)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - r, t - r, i));
    let s = [];
    e > 0 && this.decomposeLeft(e, s);
    let o = s.length;
    for (let l of i)
      s.push(l);
    if (e > 0 && la(s, o - 1), t < this.length) {
      let l = s.length;
      this.decomposeRight(t, s), la(s, l);
    }
    return ze.of(s);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, r = i + this.break;
    if (e >= r)
      return this.right.decomposeRight(e - r, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < r && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? ze.of(this.break ? [e, null, t] : [e, t]) : (this.left = kr(this.left, e), this.right = kr(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, r) {
    let { left: s, right: o } = this, l = t + s.length + this.break, a = null;
    return r && r.from <= t + s.length && r.more ? a = s = s.updateHeight(e, t, i, r) : s.updateHeight(e, t, i), r && r.from <= l + o.length && r.more ? a = o = o.updateHeight(e, l, i, r) : o.updateHeight(e, l, i), a ? this.balanced(s, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function la(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof De && (i = n[e + 1]) instanceof De && n.splice(e - 1, 3, new De(t.length + 1 + i.length));
}
const Np = 5;
class qo {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), r = this.nodes[this.nodes.length - 1];
      r instanceof _e ? r.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new _e(i - this.pos, -1)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let r = i.widget ? i.widget.estimatedHeight : 0, s = i.widget ? i.widget.lineBreaks : 0;
      r < 0 && (r = this.oracle.lineHeight);
      let o = t - e;
      i.block ? this.addBlock(new Cc(o, r, i)) : (o || s || r >= Np) && this.addLineDeco(r, s, o);
    } else t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new _e(this.pos - e, -1)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new De(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof _e)
      return e;
    let t = new _e(0, -1);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let r = this.ensureLine();
    r.length += i, r.collapsed += i, r.widgetHeight = Math.max(r.widgetHeight, e), r.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof _e) && !this.isCovered ? this.nodes.push(new _e(0, -1)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let r of this.nodes)
      r instanceof _e && r.updateHeight(this.oracle, i), i += r ? r.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, r) {
    let s = new qo(i, e);
    return j.spans(t, i, r, s, 0), s.finish(i);
  }
}
function Ip(n, e, t) {
  let i = new Hp();
  return j.compare(n, e, t, i, 0), i.changes;
}
class Hp {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, r) {
    (e < t || i && i.heightRelevant || r && r.heightRelevant) && hr(e, t, this.changes, 5);
  }
}
function Vp(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, r = i.defaultView || window, s = Math.max(0, t.left), o = Math.min(r.innerWidth, t.right), l = Math.max(0, t.top), a = Math.min(r.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let c = h, f = window.getComputedStyle(c);
      if ((c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) && f.overflow != "visible") {
        let d = c.getBoundingClientRect();
        s = Math.max(s, d.left), o = Math.min(o, d.right), l = Math.max(l, d.top), a = Math.min(h == n.parentNode ? r.innerHeight : a, d.bottom);
      }
      h = f.position == "absolute" || f.position == "fixed" ? c.offsetParent : c.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: s - t.left,
    right: Math.max(s, o) - t.left,
    top: l - (t.top + e),
    bottom: Math.max(l, a) - (t.top + e)
  };
}
function Wp(n) {
  let e = n.getBoundingClientRect(), t = n.ownerDocument.defaultView || window;
  return e.left < t.innerWidth && e.right > 0 && e.top < t.innerHeight && e.bottom > 0;
}
function zp(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class gs {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.size = i, this.displaySize = r;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i], s = t[i];
      if (r.from != s.from || r.to != s.to || r.size != s.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return W.replace({
      widget: new qp(this.displaySize * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class qp extends Xt {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class aa {
  constructor(e) {
    this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !1, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = ha, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = oe.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let t = e.facet(Ho).some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
    this.heightOracle = new Pp(t), this.stateDeco = e.facet(pn).filter((i) => typeof i != "function"), this.heightMap = ze.empty().applyChanges(this.stateDeco, J.empty, this.heightOracle.setDoc(e.doc), [new it(0, 0, 0, e.doc.length)]);
    for (let i = 0; i < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); i++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = W.set(this.lineGaps.map((i) => i.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let r = i ? t.head : t.anchor;
      if (!e.some(({ from: s, to: o }) => r >= s && r <= o)) {
        let { from: s, to: o } = this.lineBlockAt(r);
        e.push(new $n(s, o));
      }
    }
    return this.viewports = e.sort((i, r) => i.from - r.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? ha : new Ko(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(Zi(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(pn).filter((c) => typeof c != "function");
    let r = e.changedRanges, s = it.extendWithRanges(r, Ip(i, this.stateDeco, e ? e.changes : we.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    oa(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), s), (this.heightMap.height != o || Li) && (e.flags |= 2), l ? (this.scrollAnchorPos = e.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let a = s.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, e.flags |= this.updateForViewport(), (h || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && e.selectionSet && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(oc) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(e) {
    let t = e.contentDOM, i = window.getComputedStyle(t), r = this.heightOracle, s = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? oe.RTL : oe.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(s), l = t.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (l.width && l.height) {
      let { scaleX: E, scaleY: O } = Ph(t, l);
      (E > 5e-3 && Math.abs(this.scaleX - E) > 5e-3 || O > 5e-3 && Math.abs(this.scaleY - O) > 5e-3) && (this.scaleX = E, this.scaleY = O, h |= 16, o = a = !0);
    }
    let f = (parseInt(i.paddingTop) || 0) * this.scaleY, d = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != d) && (this.paddingTop = f, this.paddingBottom = d, h |= 18), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 16);
    let g = e.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != g && (this.scrollAnchorHeight = -1, this.scrollTop = g), this.scrolledToBottom = Nh(e.scrollDOM);
    let y = (this.printing ? zp : Vp)(t, this.paddingTop), b = y.top - this.pixelViewport.top, x = y.bottom - this.pixelViewport.bottom;
    this.pixelViewport = y;
    let k = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (k != this.inView && (this.inView = k, k && (a = !0)), !this.inView && !this.scrollTarget && !Wp(e.dom))
      return 0;
    let D = l.width;
    if ((this.contentDOMWidth != D || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 16), a) {
      let E = e.docView.measureVisibleLineHeights(this.viewport);
      if (r.mustRefreshForHeights(E) && (o = !0), o || r.lineWrapping && Math.abs(D - this.contentDOMWidth) > r.charWidth) {
        let { lineHeight: O, charWidth: C, textHeight: A } = e.docView.measureTextSize();
        o = O > 0 && r.refresh(s, O, C, A, D / C, E), o && (e.docView.minWidth = 0, h |= 16);
      }
      b > 0 && x > 0 ? c = Math.max(b, x) : b < 0 && x < 0 && (c = Math.min(b, x)), oa();
      for (let O of this.viewports) {
        let C = O.from == this.viewport.from ? E : e.docView.measureVisibleLineHeights(O);
        this.heightMap = (o ? ze.empty().applyChanges(this.stateDeco, J.empty, this.heightOracle, [new it(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, o, new Rp(O.from, C));
      }
      Li && (h |= 2);
    }
    let T = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return T && (h & 2 && (h |= this.updateScaler()), this.viewport = this.getViewport(c, this.scrollTarget), h |= this.updateForViewport()), (h & 2 || T) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), r = this.heightMap, s = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new $n(r.lineAt(o - i * 1e3, se.ByHeight, s, 0, 0).from, r.lineAt(l + (1 - i) * 1e3, se.ByHeight, s, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = r.lineAt(h, se.ByPos, s, 0, 0), d;
        t.y == "center" ? d = (f.top + f.bottom) / 2 - c / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? d = f.top : d = f.bottom - c, a = new $n(r.lineAt(d - 1e3 / 2, se.ByHeight, s, 0, 0).from, r.lineAt(d + c + 1e3 / 2, se.ByHeight, s, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
    return new $n(this.heightMap.lineAt(i, se.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, se.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: r } = this.heightMap.lineAt(e, se.ByPos, this.heightOracle, 0, 0), { bottom: s } = this.heightMap.lineAt(t, se.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (e == 0 || r <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || s >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && r > o - 2 * 1e3 && s < l + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let r of e)
      t.touchesRange(r.from, r.to) || i.push(new gs(t.mapPos(r.from), t.mapPos(r.to), r.size, r.displaySize));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, r = i ? 1e4 : 2e3, s = r >> 1, o = r << 1;
    if (this.defaultTextDirection != oe.LTR && !i)
      return [];
    let l = [], a = (c, f, d, g) => {
      if (f - c < s)
        return;
      let y = this.state.selection.main, b = [y.from];
      y.empty || b.push(y.to);
      for (let k of b)
        if (k > c && k < f) {
          a(c, k - 10, d, g), a(k + 10, f, d, g);
          return;
        }
      let x = $p(e, (k) => k.from >= d.from && k.to <= d.to && Math.abs(k.from - c) < s && Math.abs(k.to - f) < s && !b.some((D) => k.from < D && k.to > D));
      if (!x) {
        if (f < d.to && t && i && t.visibleRanges.some((T) => T.from <= f && T.to >= f)) {
          let T = t.moveToLineBoundary(M.cursor(f), !1, !0).head;
          T > c && (f = T);
        }
        let k = this.gapSize(d, c, f, g), D = i || k < 2e6 ? k : 2e6;
        x = new gs(c, f, k, D);
      }
      l.push(x);
    }, h = (c) => {
      if (c.length < o || c.type != We.Text)
        return;
      let f = Kp(c.from, c.to, this.stateDeco);
      if (f.total < o)
        return;
      let d = this.scrollTarget ? this.scrollTarget.range.head : null, g, y;
      if (i) {
        let b = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, x, k;
        if (d != null) {
          let D = Un(f, d), T = ((this.visibleBottom - this.visibleTop) / 2 + b) / c.height;
          x = D - T, k = D + T;
        } else
          x = (this.visibleTop - c.top - b) / c.height, k = (this.visibleBottom - c.top + b) / c.height;
        g = jn(f, x), y = jn(f, k);
      } else {
        let b = f.total * this.heightOracle.charWidth, x = r * this.heightOracle.charWidth, k = 0;
        if (b > 2e6)
          for (let C of e)
            C.from >= c.from && C.from < c.to && C.size != C.displaySize && C.from * this.heightOracle.charWidth + k < this.pixelViewport.left && (k = C.size - C.displaySize);
        let D = this.pixelViewport.left + k, T = this.pixelViewport.right + k, E, O;
        if (d != null) {
          let C = Un(f, d), A = ((T - D) / 2 + x) / b;
          E = C - A, O = C + A;
        } else
          E = (D - x) / b, O = (T + x) / b;
        g = jn(f, E), y = jn(f, O);
      }
      g > c.from && a(c.from, g, c, f), y < c.to && a(y, c.to, c, f);
    };
    for (let c of this.viewportLines)
      Array.isArray(c.type) ? c.type.forEach(h) : h(c);
    return l;
  }
  gapSize(e, t, i, r) {
    let s = Un(r, i) - Un(r, t);
    return this.heightOracle.lineWrapping ? e.height * s : r.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(e) {
    gs.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = W.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(e) {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let i = [];
    j.spans(t, this.viewport.from, this.viewport.to, {
      span(s, o) {
        i.push({ from: s, to: o });
      },
      point() {
      }
    }, 20);
    let r = 0;
    if (i.length != this.visibleRanges.length)
      r = 12;
    else
      for (let s = 0; s < i.length && !(r & 8); s++) {
        let o = this.visibleRanges[s], l = i[s];
        (o.from != l.from || o.to != l.to) && (r |= 4, e && e.mapPos(o.from, -1) == l.from && e.mapPos(o.to, 1) == l.to || (r |= 8));
      }
    return this.visibleRanges = i, r;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || Zi(this.heightMap.lineAt(e, se.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || Zi(this.heightMap.lineAt(this.scaler.fromDOM(e), se.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return Zi(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class $n {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function Kp(n, e, t) {
  let i = [], r = n, s = 0;
  return j.spans(t, n, e, {
    span() {
    },
    point(o, l) {
      o > r && (i.push({ from: r, to: o }), s += o - r), r = l;
    }
  }, 20), r < e && (i.push({ from: r, to: e }), s += e - r), { total: s, ranges: i };
}
function jn({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let r = 0; ; r++) {
    let { from: s, to: o } = e[r], l = o - s;
    if (i <= l)
      return s + i;
    i -= l;
  }
}
function Un(n, e) {
  let t = 0;
  for (let { from: i, to: r } of n.ranges) {
    if (e <= r) {
      t += e - i;
      break;
    }
    t += r - i;
  }
  return t / n.total;
}
function $p(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const ha = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
  eq(n) {
    return n == this;
  }
};
class Ko {
  constructor(e, t, i) {
    let r = 0, s = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = t.lineAt(l, se.ByPos, e, 0, 0).top, c = t.lineAt(a, se.ByPos, e, 0, 0).bottom;
      return r += c - h, { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - r) / (t.height - r);
    for (let l of this.viewports)
      l.domTop = o + (l.top - s) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), s = l.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.top)
        return r + (e - i) * this.scale;
      if (e <= s.bottom)
        return s.domTop + (e - s.top);
      i = s.bottom, r = s.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.domTop)
        return i + (e - r) / this.scale;
      if (e <= s.domBottom)
        return s.top + (e - s.domTop);
      i = s.bottom, r = s.domBottom;
    }
  }
  eq(e) {
    return e instanceof Ko ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((t, i) => t.from == e.viewports[i].from && t.to == e.viewports[i].to) : !1;
  }
}
function Zi(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new vt(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((r) => Zi(r, e)) : n._content);
}
const Gn = /* @__PURE__ */ F.define({ combine: (n) => n.join(" ") }), ao = /* @__PURE__ */ F.define({ combine: (n) => n.indexOf(!0) > -1 }), ho = /* @__PURE__ */ jt.newName(), Ac = /* @__PURE__ */ jt.newName(), Mc = /* @__PURE__ */ jt.newName(), Dc = { "&light": "." + Ac, "&dark": "." + Mc };
function co(n, e, t) {
  return new jt(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (r) => {
        if (r == "&")
          return n;
        if (!t || !t[r])
          throw new RangeError(`Unsupported selector: ${r}`);
        return t[r];
      }) : n + " " + i;
    }
  });
}
const jp = /* @__PURE__ */ co("." + ho, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // https://github.com/codemirror/dev/issues/456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    insetInlineStart: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top",
    userSelect: "none"
  },
  ".cm-highlightSpace": {
    backgroundImage: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",
    backgroundPosition: "center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, Dc), Up = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, ms = I.ie && I.ie_version <= 11;
class Gp {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new Od(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (I.ie && I.ie_version <= 11 || I.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(I.chrome && I.chrome_version < 126) && (this.editContext = new Jp(e), e.state.facet(Et) && (e.contentDOM.editContext = this.editContext.editContext)), ms && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    (e.type == "change" || !e.type) && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, r = this.selectionRange;
    if (i.state.facet(Et) ? i.root.activeElement != this.dom : !ar(this.dom, r))
      return;
    let s = r.anchorNode && i.docView.nearest(r.anchorNode);
    if (s && s.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (I.ie && I.ie_version <= 11 || I.android && I.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    r.focusNode && sn(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = un(e.root);
    if (!t)
      return !1;
    let i = I.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && Yp(this.view, t) || t;
    if (!i || this.selectionRange.eq(i))
      return !1;
    let r = ar(this.dom, i);
    return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && Ed(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), r && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, Up), ms && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), ms && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let r = () => {
        let s = this.delayedAndroidKey;
        s && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = s.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && s.force && Ai(this.dom, s.key, s.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(r);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, r = !1;
    for (let s of e) {
      let o = this.readMutation(s);
      o && (o.typeOver && (r = !0), t == -1 ? { from: t, to: i } = o : (t = Math.min(o.from, t), i = Math.max(o.to, i)));
    }
    return { from: t, to: i, typeOver: r };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), r = this.selectionChanged && ar(this.dom, this.selectionRange);
    if (e < 0 && !r)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let s = new fp(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: s.newSel ? s.newSel.main : null }, s;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, r = gc(this.view, t);
    return this.view.state == i && (t.domChanged || t.newSel && !t.newSel.main.eq(this.view.state.selection.main)) && this.view.update([]), r;
  }
  readMutation(e) {
    let t = this.view.docView.nearest(e.target);
    if (!t || t.ignoreMutation(e))
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "attributes" && (t.flags |= 4), e.type == "childList") {
      let i = ca(t, e.previousSibling || e.target.previousSibling, -1), r = ca(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: r ? t.posBefore(r) : t.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(Et) != e.state.facet(Et) && (e.view.contentDOM.editContext = e.state.facet(Et) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let r of this.scrollTargets)
      r.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function ca(n, e, t) {
  for (; e; ) {
    let i = ne.get(e);
    if (i && i.parent == n)
      return i;
    let r = e.parentNode;
    e = r != n.dom ? r : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function fa(n, e) {
  let t = e.startContainer, i = e.startOffset, r = e.endContainer, s = e.endOffset, o = n.docView.domAtPos(n.state.selection.main.anchor);
  return sn(o.node, o.offset, r, s) && ([t, i, r, s] = [r, s, t, i]), { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s };
}
function Yp(n, e) {
  if (e.getComposedRanges) {
    let r = e.getComposedRanges(n.root)[0];
    if (r)
      return fa(n, r);
  }
  let t = null;
  function i(r) {
    r.preventDefault(), r.stopImmediatePropagation(), t = r.getTargetRanges()[0];
  }
  return n.contentDOM.addEventListener("beforeinput", i, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", i, !0), t ? fa(n, t) : null;
}
class Jp {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(e.state);
    let t = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    this.handlers.textupdate = (i) => {
      let r = e.state.selection.main, { anchor: s, head: o } = r, l = this.toEditorPos(i.updateRangeStart), a = this.toEditorPos(i.updateRangeEnd);
      e.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: i.updateRangeStart, editorBase: l, drifted: !1 });
      let h = { from: l, to: a, insert: J.of(i.text.split(`
`)) };
      if (h.from == this.from && s < this.from ? h.from = s : h.to == this.to && s > this.to && (h.to = s), h.from == h.to && !h.insert.length) {
        let c = M.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd));
        c.main.eq(r) || e.dispatch({ selection: c, userEvent: "select" });
        return;
      }
      if ((I.mac || I.android) && h.from == o - 1 && /^\. ?$/.test(i.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (h = { from: l, to: a, insert: J.of([i.text.replace(".", " ")]) }), this.pendingContextChange = h, !e.state.readOnly) {
        let c = this.to - this.from + (h.to - h.from + h.insert.length);
        zo(e, h, M.single(this.toEditorPos(i.selectionStart, c), this.toEditorPos(i.selectionEnd, c)));
      }
      this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state));
    }, this.handlers.characterboundsupdate = (i) => {
      let r = [], s = null;
      for (let o = this.toEditorPos(i.rangeStart), l = this.toEditorPos(i.rangeEnd); o < l; o++) {
        let a = e.coordsForChar(o);
        s = a && new DOMRect(a.left, a.top, a.right - a.left, a.bottom - a.top) || s || new DOMRect(), r.push(s);
      }
      t.updateCharacterBounds(i.rangeStart, r);
    }, this.handlers.textformatupdate = (i) => {
      let r = [];
      for (let s of i.getTextFormats()) {
        let o = s.underlineStyle, l = s.underlineThickness;
        if (o != "None" && l != "None") {
          let a = this.toEditorPos(s.rangeStart), h = this.toEditorPos(s.rangeEnd);
          if (a < h) {
            let c = `text-decoration: underline ${o == "Dashed" ? "dashed " : o == "Squiggle" ? "wavy " : ""}${l == "Thin" ? 1 : 2}px`;
            r.push(W.mark({ attributes: { style: c } }).range(a, h));
          }
        }
      }
      e.dispatch({ effects: ac.of(W.set(r)) });
    }, this.handlers.compositionstart = () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: i } = this.composing;
        this.composing = null, i && this.reset(e.state);
      }
    };
    for (let i in this.handlers)
      t.addEventListener(i, this.handlers[i]);
    this.measureReq = { read: (i) => {
      this.editContext.updateControlBounds(i.contentDOM.getBoundingClientRect());
      let r = un(i.root);
      r && r.rangeCount && this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let t = 0, i = !1, r = this.pendingContextChange;
    return e.changes.iterChanges((s, o, l, a, h) => {
      if (i)
        return;
      let c = h.length - (o - s);
      if (r && o >= r.to)
        if (r.from == s && r.to == o && r.insert.eq(h)) {
          r = this.pendingContextChange = null, t += c, this.to += c;
          return;
        } else
          r = null, this.revertPending(e.state);
      if (s += t, o += t, o <= this.from)
        this.from += c, this.to += c;
      else if (s < this.to) {
        if (s < this.from || o > this.to || this.to - this.from + h.length > 3e4) {
          i = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(s), this.toContextPos(o), h.toString()), this.to += c;
      }
      t += c;
    }), r && !i && this.revertPending(e.state), !i;
  }
  update(e) {
    let t = this.pendingContextChange, i = e.startState.selection.main;
    this.composing && (this.composing.drifted || !e.changes.touchesRange(i.from, i.to) && e.transactions.some((r) => !r.isUserEvent("input.type") && r.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || t) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: t } = e.selection.main;
    this.from = Math.max(
      0,
      t - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      t + 1e4
      /* CxVp.Margin */
    );
  }
  reset(e) {
    this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
  }
  revertPending(e) {
    let t = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.from + t.insert.length), e.doc.sliceString(t.from, t.to));
  }
  setSelection(e) {
    let { main: t } = e.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), r = this.toContextPos(t.head);
    (this.editContext.selectionStart != i || this.editContext.selectionEnd != r) && this.editContext.updateSelection(i, r);
  }
  rangeIsValid(e) {
    let { head: t } = e.selection.main;
    return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e, t = this.to - this.from) {
    e = Math.min(e, t);
    let i = this.composing;
    return i && i.drifted ? i.editorBase + (e - i.contextBase) : e + this.from;
  }
  toContextPos(e) {
    let t = this.composing;
    return t && t.drifted ? t.contextBase + (e - t.editorBase) : e - this.from;
  }
  destroy() {
    for (let e in this.handlers)
      this.editContext.removeEventListener(e, this.handlers[e]);
  }
}
class N {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    var t;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: i } = e;
    this.dispatchTransactions = e.dispatchTransactions || i && ((r) => r.forEach((s) => i(s, this))) || ((r) => this.update(r)), this.dispatch = this.dispatch.bind(this), this._root = e.root || Td(e.parent) || document, this.viewState = new aa(e.state || X.create(e)), e.scrollTo && e.scrollTo.is(zn) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(Xi).map((r) => new us(r));
    for (let r of this.plugins)
      r.update(this);
    this.observer = new Gp(this), this.inputState = new mp(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Kl(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((t = document.fonts) === null || t === void 0) && t.ready && document.fonts.ready.then(() => this.requestMeasure());
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof ke ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, r, s = this.state;
    for (let d of e) {
      if (d.startState != s)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      s = d.state;
    }
    if (this.destroyed) {
      this.viewState.state = s;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    e.some((d) => d.annotation(wc)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = kc(s, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(s.doc) || !this.state.selection.eq(s.selection)) && (c = null)) : this.observer.clear(), s.facet(X.phrases) != this.state.facet(X.phrases))
      return this.setState(s);
    r = wr.create(this, s, e), r.flags |= l;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let d of e) {
        if (f && (f = f.map(d.changes)), d.scrollIntoView) {
          let { main: g } = d.state.selection;
          f = new Mi(g.empty ? g : M.cursor(g.head, g.head > g.anchor ? -1 : 1));
        }
        for (let g of d.effects)
          g.is(zn) && (f = g.value.clip(this.state));
      }
      this.viewState.update(r, f), this.bidiCache = Sr.update(this.bidiCache, r.changes), r.empty || (this.updatePlugins(r), this.inputState.update(r)), t = this.docView.update(r), this.state.facet(_i) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((d) => d.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (r.startState.facet(Gn) != r.state.facet(Gn) && (this.viewState.mustMeasureContent = !0), (t || i || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), t && this.docViewUpdate(), !r.empty)
      for (let d of this.state.facet(ro))
        try {
          d(r);
        } catch (g) {
          Ve(this.state, g, "update listener");
        }
    (a || c) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), c && !gc(this, c) && h.force && Ai(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new aa(e), this.plugins = e.facet(Xi).map((i) => new us(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new Kl(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(Xi), i = e.state.facet(Xi);
    if (t != i) {
      let r = [];
      for (let s of i) {
        let o = t.indexOf(s);
        if (o < 0)
          r.push(new us(s));
        else {
          let l = this.plugins[o];
          l.mustUpdate = e, r.push(l);
        }
      }
      for (let s of this.plugins)
        s.mustUpdate != e && s.destroy(this);
      this.plugins = r, this.pluginMap.clear();
    } else
      for (let r of this.plugins)
        r.mustUpdate = e;
    for (let r = 0; r < this.plugins.length; r++)
      this.plugins[r].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let t = e.value;
      if (t && t.docViewUpdate)
        try {
          t.docViewUpdate(this);
        } catch (i) {
          Ve(this.state, i, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.scrollDOM, r = i.scrollTop * this.scaleY, { scrollAnchorPos: s, scrollAnchorHeight: o } = this.viewState;
    Math.abs(r - this.viewState.scrollTop) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (Nh(i))
            s = -1, o = this.viewState.heightMap.height;
          else {
            let g = this.viewState.scrollAnchorAt(r);
            s = g.from, o = g.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure(this);
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let c = h.map((g) => {
          try {
            return g.read(this);
          } catch (y) {
            return Ve(this.state, y), ua;
          }
        }), f = wr.create(this, this.state, []), d = !1;
        f.flags |= a, t ? t.flags |= a : t = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), d = this.docView.update(f), d && this.docViewUpdate());
        for (let g = 0; g < h.length; g++)
          if (c[g] != ua)
            try {
              let y = h[g];
              y.write && y.write(c[g], this);
            } catch (y) {
              Ve(this.state, y);
            }
        if (d && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let y = (s < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(s).top) - o;
              if (y > 1 || y < -1) {
                r = r + y, i.scrollTop = r / this.scaleY, o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let l of this.state.facet(ro))
        l(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return ho + " " + (this.state.facet(ao) ? Mc : Ac) + " " + this.state.facet(Gn);
  }
  updateAttrs() {
    let e = da(this, hc, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(Et) ? "true" : "false",
      class: "cm-content",
      style: `${I.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), da(this, Ho, t);
    let i = this.observer.ignore(() => {
      let r = Zs(this.contentDOM, this.contentAttrs, t), s = Zs(this.dom, this.editorAttrs, e);
      return r || s;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let r of i.effects)
        if (r.is(N.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let s = this.announceDOM.appendChild(document.createElement("div"));
          s.textContent = r.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(_i);
    let e = this.state.facet(N.cspNonce);
    jt.mount(this.root, this.styleModules.concat(jp).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.spec != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.spec == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return ps(this, e, Yl(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return ps(this, e, Yl(this, e, t, (i) => lp(this, e.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let i = this.bidiSpans(e), r = this.textDirectionAt(e.from), s = i[t ? i.length - 1 : 0];
    return M.cursor(s.side(t, r) + e.from, s.forward(!t, r) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return op(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return ps(this, e, ap(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e) {
    return this.docView.domAtPos(e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    return this.readMeasured(), pc(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(e, t);
    if (!i || i.left == i.right)
      return i;
    let r = this.state.doc.lineAt(e), s = this.bidiSpans(r), o = s[qt.find(s, e - r.from, -1, t)];
    return Hr(i, o.dir == oe.LTR == t > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(sc) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > Xp)
      return _h(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let s of this.bidiCache)
      if (s.from == e.from && s.dir == t && (s.fresh || Xh(s.isolates, i = ql(this, e))))
        return s.order;
    i || (i = ql(this, e));
    let r = $d(e.text, t, i);
    return this.bidiCache.push(new Sr(e.from, e.to, t, i, !0, r)), r;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || I.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Rh(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    return zn.of(new Mi(typeof e == "number" ? M.cursor(e) : e, t.y, t.x, t.yMargin, t.xMargin));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return zn.of(new Mi(M.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ge.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ge.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = jt.newName(), r = [Gn.of(i), _i.of(co(`.${i}`, e))];
    return t && t.dark && r.push(ao.of(!0)), r;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return di.lowest(_i.of(co("." + ho, e, Dc)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), r = i && ne.get(i) || ne.get(e);
    return ((t = r == null ? void 0 : r.rootView) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
N.styleModule = _i;
N.inputHandler = nc;
N.clipboardInputFilter = No;
N.clipboardOutputFilter = Io;
N.scrollHandler = lc;
N.focusChangeEffect = rc;
N.perLineTextDirection = sc;
N.exceptionSink = ic;
N.updateListener = ro;
N.editable = Et;
N.mouseSelectionStyle = tc;
N.dragMovesSelection = ec;
N.clickAddsSelectionRange = Zh;
N.decorations = pn;
N.outerDecorations = cc;
N.atomicRanges = Vo;
N.bidiIsolatedRanges = fc;
N.scrollMargins = uc;
N.darkTheme = ao;
N.cspNonce = /* @__PURE__ */ F.define({ combine: (n) => n.length ? n[0] : "" });
N.contentAttributes = Ho;
N.editorAttributes = hc;
N.lineWrapping = /* @__PURE__ */ N.contentAttributes.of({ class: "cm-lineWrapping" });
N.announce = /* @__PURE__ */ z.define();
const Xp = 4096, ua = {};
class Sr {
  constructor(e, t, i, r, s, o) {
    this.from = e, this.to = t, this.dir = i, this.isolates = r, this.fresh = s, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((s) => s.fresh))
      return e;
    let i = [], r = e.length ? e[e.length - 1].dir : oe.LTR;
    for (let s = Math.max(0, e.length - 10); s < e.length; s++) {
      let o = e[s];
      o.dir == r && !t.touchesRange(o.from, o.to) && i.push(new Sr(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function da(n, e, t) {
  for (let i = n.state.facet(e), r = i.length - 1; r >= 0; r--) {
    let s = i[r], o = typeof s == "function" ? s(n) : s;
    o && Qs(o, t);
  }
  return t;
}
const _p = I.mac ? "mac" : I.windows ? "win" : I.linux ? "linux" : "key";
function Qp(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let r, s, o, l;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      s = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? l = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return r && (i = "Alt-" + i), s && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function Yn(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const Zp = /* @__PURE__ */ di.default(/* @__PURE__ */ N.domEventHandlers({
  keydown(n, e) {
    return Tc(Oc(e.state), n, e, "editor");
  }
})), $o = /* @__PURE__ */ F.define({ enables: Zp }), pa = /* @__PURE__ */ new WeakMap();
function Oc(n) {
  let e = n.facet($o), t = pa.get(e);
  return t || pa.set(e, t = ig(e.reduce((i, r) => i.concat(r), []))), t;
}
function eg(n, e, t) {
  return Tc(Oc(n.state), e, n, t);
}
let Vt = null;
const tg = 4e3;
function ig(n, e = _p) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), r = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, s = (o, l, a, h, c) => {
    var f, d;
    let g = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), y = l.split(/ (?!$)/).map((k) => Qp(k, e));
    for (let k = 1; k < y.length; k++) {
      let D = y.slice(0, k).join(" ");
      r(D, !0), g[D] || (g[D] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(T) => {
          let E = Vt = { view: T, prefix: D, scope: o };
          return setTimeout(() => {
            Vt == E && (Vt = null);
          }, tg), !0;
        }]
      });
    }
    let b = y.join(" ");
    r(b, !1);
    let x = g[b] || (g[b] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((d = (f = g._any) === null || f === void 0 ? void 0 : f.run) === null || d === void 0 ? void 0 : d.slice()) || []
    });
    a && x.run.push(a), h && (x.preventDefault = !0), c && (x.stopPropagation = !0);
  };
  for (let o of n) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let c = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: f } = o;
        for (let d in c)
          c[d].run.push((g) => f(g, fo));
      }
    let a = o[e] || o.key;
    if (a)
      for (let h of l)
        s(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && s(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
let fo = null;
function Tc(n, e, t, i) {
  fo = e;
  let r = Cd(e), s = $e(r, 0), o = xt(s) == r.length && r != " ", l = "", a = !1, h = !1, c = !1;
  Vt && Vt.view == t && Vt.scope == i && (l = Vt.prefix + " ", yc.indexOf(e.keyCode) < 0 && (h = !0, Vt = null));
  let f = /* @__PURE__ */ new Set(), d = (x) => {
    if (x) {
      for (let k of x.run)
        if (!f.has(k) && (f.add(k), k(t)))
          return x.stopPropagation && (c = !0), !0;
      x.preventDefault && (x.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, g = n[i], y, b;
  return g && (d(g[l + Yn(r, e, !o)]) ? a = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(I.windows && e.ctrlKey && e.altKey) && (y = Ut[e.keyCode]) && y != r ? (d(g[l + Yn(y, e, !0)]) || e.shiftKey && (b = fn[e.keyCode]) != r && b != y && d(g[l + Yn(b, e, !1)])) && (a = !0) : o && e.shiftKey && d(g[l + Yn(r, e, !0)]) && (a = !0), !a && d(g._any) && (a = !0)), h && (a = !0), a && c && e.stopPropagation(), fo = null, a;
}
class Dn {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, r, s) {
    this.className = e, this.left = t, this.top = i, this.width = r, this.height = s;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let r = e.coordsAtPos(i.head, i.assoc || 1);
      if (!r)
        return [];
      let s = Ec(e);
      return [new Dn(t, r.left - s.left, r.top - s.top, null, r.bottom - r.top)];
    } else
      return ng(e, t, i);
  }
}
function Ec(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == oe.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function ga(n, e, t, i) {
  let r = n.coordsAtPos(e, t * 2);
  if (!r)
    return i;
  let s = n.dom.getBoundingClientRect(), o = (r.top + r.bottom) / 2, l = n.posAtCoords({ x: s.left + 1, y: o }), a = n.posAtCoords({ x: s.right - 1, y: o });
  return l == null || a == null ? i : { from: Math.max(i.from, Math.min(l, a)), to: Math.min(i.to, Math.max(l, a)) };
}
function ng(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), r = Math.min(t.to, n.viewport.to), s = n.textDirection == oe.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = Ec(n), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), d = l.right - (c ? parseInt(c.paddingRight) : 0), g = oo(n, i), y = oo(n, r), b = g.type == We.Text ? g : null, x = y.type == We.Text ? y : null;
  if (b && (n.lineWrapping || g.widgetLineBreaks) && (b = ga(n, i, 1, b)), x && (n.lineWrapping || y.widgetLineBreaks) && (x = ga(n, r, -1, x)), b && x && b.from == x.from && b.to == x.to)
    return D(T(t.from, t.to, b));
  {
    let O = b ? T(t.from, null, b) : E(g, !1), C = x ? T(null, t.to, x) : E(y, !0), A = [];
    return (b || g).to < (x || y).from - (b && x ? 1 : 0) || g.widgetLineBreaks > 1 && O.bottom + n.defaultLineHeight / 2 < C.top ? A.push(k(f, O.bottom, d, C.top)) : O.bottom < C.top && n.elementAtHeight((O.bottom + C.top) / 2).type == We.Text && (O.bottom = C.top = (O.bottom + C.top) / 2), D(O).concat(A).concat(D(C));
  }
  function k(O, C, A, R) {
    return new Dn(e, O - a.left, C - a.top, A - O, R - C);
  }
  function D({ top: O, bottom: C, horizontal: A }) {
    let R = [];
    for (let q = 0; q < A.length; q += 2)
      R.push(k(A[q], O, A[q + 1], C));
    return R;
  }
  function T(O, C, A) {
    let R = 1e9, q = -1e9, _ = [];
    function K(U, H, ue, de, Be) {
      let v = n.coordsAtPos(U, U == A.to ? -2 : 2), B = n.coordsAtPos(ue, ue == A.from ? 2 : -2);
      !v || !B || (R = Math.min(v.top, B.top, R), q = Math.max(v.bottom, B.bottom, q), Be == oe.LTR ? _.push(s && H ? f : v.left, s && de ? d : B.right) : _.push(!s && de ? f : B.left, !s && H ? d : v.right));
    }
    let V = O ?? A.from, Y = C ?? A.to;
    for (let U of n.visibleRanges)
      if (U.to > V && U.from < Y)
        for (let H = Math.max(U.from, V), ue = Math.min(U.to, Y); ; ) {
          let de = n.state.doc.lineAt(H);
          for (let Be of n.bidiSpans(de)) {
            let v = Be.from + de.from, B = Be.to + de.from;
            if (v >= ue)
              break;
            B > H && K(Math.max(v, H), O == null && v <= V, Math.min(B, ue), C == null && B >= Y, Be.dir);
          }
          if (H = de.to + 1, H >= ue)
            break;
        }
    return _.length == 0 && K(V, O == null, Y, C == null, n.textDirection), { top: R, bottom: q, horizontal: _ };
  }
  function E(O, C) {
    let A = l.top + (C ? O.top : O.bottom);
    return { top: A, bottom: A, horizontal: [] };
  }
}
function rg(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class sg {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(ur) != e.state.facet(ur) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let t = 0, i = e.facet(ur);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !rg(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let r of e)
        r.update && t && r.constructor && this.drawn[i].constructor && r.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(r.draw(), t);
      for (; t; ) {
        let r = t.nextSibling;
        t.remove(), t = r;
      }
      this.drawn = e;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const ur = /* @__PURE__ */ F.define();
function Bc(n) {
  return [
    ge.define((e) => new sg(e, n)),
    ur.of(n)
  ];
}
const gn = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function og(n = {}) {
  return [
    gn.of(n),
    lg,
    ag,
    hg,
    oc.of(!0)
  ];
}
function Lc(n) {
  return n.startState.facet(gn) != n.state.facet(gn);
}
const lg = /* @__PURE__ */ Bc({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(gn), i = [];
    for (let r of e.selection.ranges) {
      let s = r == e.selection.main;
      if (r.empty || t.drawRangeCursor) {
        let o = s ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = r.empty ? r : M.cursor(r.head, r.head > r.anchor ? -1 : 1);
        for (let a of Dn.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = Lc(n);
    return t && ma(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    ma(e.state, n);
  },
  class: "cm-cursorLayer"
});
function ma(n, e) {
  e.style.animationDuration = n.facet(gn).cursorBlinkRate + "ms";
}
const ag = /* @__PURE__ */ Bc({
  above: !1,
  markers(n) {
    return n.state.selection.ranges.map((e) => e.empty ? [] : Dn.forRange(n, "cm-selectionBackground", e)).reduce((e, t) => e.concat(t));
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || Lc(n);
  },
  class: "cm-selectionLayer"
}), hg = /* @__PURE__ */ di.highest(/* @__PURE__ */ N.theme({
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: "transparent !important" },
    caretColor: "transparent !important"
  },
  ".cm-content": {
    caretColor: "transparent !important",
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
})), Pc = /* @__PURE__ */ z.define({
  map(n, e) {
    return n == null ? null : e.mapPos(n);
  }
}), en = /* @__PURE__ */ Se.define({
  create() {
    return null;
  },
  update(n, e) {
    return n != null && (n = e.changes.mapPos(n)), e.effects.reduce((t, i) => i.is(Pc) ? i.value : t, n);
  }
}), cg = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var e;
    let t = n.state.field(en);
    t == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(en) != t || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, e = n.state.field(en), t = e != null && n.coordsAtPos(e);
    if (!t)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: t.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: t.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: t.bottom - t.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: e, scaleY: t } = this.view;
      n ? (this.cursor.style.left = n.left / e + "px", this.cursor.style.top = n.top / t + "px", this.cursor.style.height = n.height / t + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(en) != n && this.view.dispatch({ effects: Pc.of(n) });
  }
}, {
  eventObservers: {
    dragover(n) {
      this.setDropPos(this.view.posAtCoords({ x: n.clientX, y: n.clientY }));
    },
    dragleave(n) {
      (n.target == this.view.contentDOM || !this.view.contentDOM.contains(n.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function fg() {
  return [en, cg];
}
function ya(n, e, t, i, r) {
  e.lastIndex = 0;
  for (let s = n.iterRange(t, i), o = t, l; !s.next().done; o += s.value.length)
    if (!s.lineBreak)
      for (; l = e.exec(s.value); )
        r(o + l.index, l);
}
function ug(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: r, to: s } of t)
    r = Math.max(n.state.doc.lineAt(r).from, r - e), s = Math.min(n.state.doc.lineAt(s).to, s + e), i.length && i[i.length - 1].to >= r ? i[i.length - 1].to = s : i.push({ from: r, to: s });
  return i;
}
class dg {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: r, boundary: s, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, r)
      this.addMatch = (l, a, h, c) => r(c, h, h + l[0].length, l, a);
    else if (typeof i == "function")
      this.addMatch = (l, a, h, c) => {
        let f = i(l, a, h);
        f && c(h, h + l[0].length, f);
      };
    else if (i)
      this.addMatch = (l, a, h, c) => c(h, h + l[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = s, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new Lt(), i = t.add.bind(t);
    for (let { from: r, to: s } of ug(e, this.maxLength))
      ya(e.state.doc, this.regexp, r, s, (o, l) => this.addMatch(l, e, o, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, r = -1;
    return e.docChanged && e.changes.iterChanges((s, o, l, a) => {
      a >= e.view.viewport.from && l <= e.view.viewport.to && (i = Math.min(l, i), r = Math.max(a, r));
    }), e.viewportMoved || r - i > 1e3 ? this.createDeco(e.view) : r > -1 ? this.updateRange(e.view, t.map(e.changes), i, r) : t;
  }
  updateRange(e, t, i, r) {
    for (let s of e.visibleRanges) {
      let o = Math.max(s.from, i), l = Math.min(s.to, r);
      if (l > o) {
        let a = e.state.doc.lineAt(o), h = a.to < l ? e.state.doc.lineAt(l) : a, c = Math.max(s.from, a.from), f = Math.min(s.to, h.to);
        if (this.boundary) {
          for (; o > a.from; o--)
            if (this.boundary.test(a.text[o - 1 - a.from])) {
              c = o;
              break;
            }
          for (; l < h.to; l++)
            if (this.boundary.test(h.text[l - h.from])) {
              f = l;
              break;
            }
        }
        let d = [], g, y = (b, x, k) => d.push(k.range(b, x));
        if (a == h)
          for (this.regexp.lastIndex = c - a.from; (g = this.regexp.exec(a.text)) && g.index < f - a.from; )
            this.addMatch(g, e, g.index + a.from, y);
        else
          ya(e.state.doc, this.regexp, c, f, (b, x) => this.addMatch(x, e, b, y));
        t = t.update({ filterFrom: c, filterTo: f, filter: (b, x) => b < c || x > f, add: d });
      }
    }
    return t;
  }
}
const uo = /x/.unicode != null ? "gu" : "g", pg = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, uo), gg = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let ys = null;
function mg() {
  var n;
  if (ys == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    ys = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return ys || !1;
}
const dr = /* @__PURE__ */ F.define({
  combine(n) {
    let e = ct(n, {
      render: null,
      specialChars: pg,
      addSpecialChars: null
    });
    return (e.replaceTabs = !mg()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, uo)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, uo)), e;
  }
});
function yg(n = {}) {
  return [dr.of(n), bg()];
}
let ba = null;
function bg() {
  return ba || (ba = ge.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = W.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(dr)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new dg({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: r } = t.state, s = $e(e[0], 0);
          if (s == 9) {
            let o = r.lineAt(i), l = t.state.tabSize, a = Hi(o.text, l, i - o.from);
            return W.replace({
              widget: new kg((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[s] || (this.decorationCache[s] = W.replace({ widget: new wg(n, s) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(dr);
      n.startState.facet(dr) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const xg = "•";
function vg(n) {
  return n >= 32 ? xg : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class wg extends Xt {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = vg(this.code), i = e.state.phrase("Control character") + " " + (gg[this.code] || "0x" + this.code.toString(16)), r = this.options.render && this.options.render(this.code, i, t);
    if (r)
      return r;
    let s = document.createElement("span");
    return s.textContent = t, s.title = i, s.setAttribute("aria-label", i), s.className = "cm-specialChar", s;
  }
  ignoreEvent() {
    return !1;
  }
}
class kg extends Xt {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
function Sg() {
  return Ag;
}
const Cg = /* @__PURE__ */ W.line({ class: "cm-activeLine" }), Ag = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    for (let i of n.state.selection.ranges) {
      let r = n.lineBlockAt(i.head);
      r.from > e && (t.push(Cg.range(r.from)), e = r.from);
    }
    return W.set(t);
  }
}, {
  decorations: (n) => n.decorations
}), po = 2e3;
function Mg(n, e, t) {
  let i = Math.min(e.line, t.line), r = Math.max(e.line, t.line), s = [];
  if (e.off > po || t.off > po || e.col < 0 || t.col < 0) {
    let o = Math.min(e.off, t.off), l = Math.max(e.off, t.off);
    for (let a = i; a <= r; a++) {
      let h = n.doc.line(a);
      h.length <= l && s.push(M.range(h.from + o, h.to + l));
    }
  } else {
    let o = Math.min(e.col, t.col), l = Math.max(e.col, t.col);
    for (let a = i; a <= r; a++) {
      let h = n.doc.line(a), c = js(h.text, o, n.tabSize, !0);
      if (c < 0)
        s.push(M.cursor(h.to));
      else {
        let f = js(h.text, l, n.tabSize);
        s.push(M.range(h.from + c, h.from + f));
      }
    }
  }
  return s;
}
function Dg(n, e) {
  let t = n.coordsAtPos(n.viewport.from);
  return t ? Math.round(Math.abs((t.left - e) / n.defaultCharacterWidth)) : -1;
}
function xa(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), i = n.state.doc.lineAt(t), r = t - i.from, s = r > po ? -1 : r == i.length ? Dg(n, e.clientX) : Hi(i.text, n.state.tabSize, t - i.from);
  return { line: i.number, col: s, off: r };
}
function Og(n, e) {
  let t = xa(n, e), i = n.state.selection;
  return t ? {
    update(r) {
      if (r.docChanged) {
        let s = r.changes.mapPos(r.startState.doc.line(t.line).from), o = r.state.doc.lineAt(s);
        t = { line: o.number, col: t.col, off: Math.min(t.off, o.length) }, i = i.map(r.changes);
      }
    },
    get(r, s, o) {
      let l = xa(n, r);
      if (!l)
        return i;
      let a = Mg(n.state, t, l);
      return a.length ? o ? M.create(a.concat(i.ranges)) : M.create(a) : i;
    }
  } : null;
}
function Tg(n) {
  let e = (t) => t.altKey && t.button == 0;
  return N.mouseSelectionStyle.of((t, i) => e(i) ? Og(t, i) : null);
}
const Eg = {
  Alt: [18, (n) => !!n.altKey],
  Control: [17, (n) => !!n.ctrlKey],
  Shift: [16, (n) => !!n.shiftKey],
  Meta: [91, (n) => !!n.metaKey]
}, Bg = { style: "cursor: crosshair" };
function Lg(n = {}) {
  let [e, t] = Eg[n.key || "Alt"], i = ge.fromClass(class {
    constructor(r) {
      this.view = r, this.isDown = !1;
    }
    set(r) {
      this.isDown != r && (this.isDown = r, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(r) {
        this.set(r.keyCode == e || t(r));
      },
      keyup(r) {
        (r.keyCode == e || !t(r)) && this.set(!1);
      },
      mousemove(r) {
        this.set(t(r));
      }
    }
  });
  return [
    i,
    N.contentAttributes.of((r) => {
      var s;
      return !((s = r.plugin(i)) === null || s === void 0) && s.isDown ? Bg : null;
    })
  ];
}
const Ui = "-10000px";
class Rc {
  constructor(e, t, i, r) {
    this.facet = t, this.createTooltipView = i, this.removeTooltipView = r, this.input = e.state.facet(t), this.tooltips = this.input.filter((o) => o);
    let s = null;
    this.tooltipViews = this.tooltips.map((o) => s = i(o, s));
  }
  update(e, t) {
    var i;
    let r = e.state.facet(this.facet), s = r.filter((a) => a);
    if (r === this.input) {
      for (let a of this.tooltipViews)
        a.update && a.update(e);
      return !1;
    }
    let o = [], l = t ? [] : null;
    for (let a = 0; a < s.length; a++) {
      let h = s[a], c = -1;
      if (h) {
        for (let f = 0; f < this.tooltips.length; f++) {
          let d = this.tooltips[f];
          d && d.create == h.create && (c = f);
        }
        if (c < 0)
          o[a] = this.createTooltipView(h, a ? o[a - 1] : null), l && (l[a] = !!h.above);
        else {
          let f = o[a] = this.tooltipViews[c];
          l && (l[a] = t[c]), f.update && f.update(e);
        }
      }
    }
    for (let a of this.tooltipViews)
      o.indexOf(a) < 0 && (this.removeTooltipView(a), (i = a.destroy) === null || i === void 0 || i.call(a));
    return t && (l.forEach((a, h) => t[h] = a), t.length = l.length), this.input = r, this.tooltips = s, this.tooltipViews = o, !0;
  }
}
function Pg(n) {
  let e = n.dom.ownerDocument.documentElement;
  return { top: 0, left: 0, bottom: e.clientHeight, right: e.clientWidth };
}
const bs = /* @__PURE__ */ F.define({
  combine: (n) => {
    var e, t, i;
    return {
      position: I.ios ? "absolute" : ((e = n.find((r) => r.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = n.find((r) => r.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((i = n.find((r) => r.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || Pg
    };
  }
}), va = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = n.state.facet(bs);
    this.position = e.position, this.parent = e.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new Rc(n, zr, (t, i) => this.createTooltip(t, i), (t) => {
      this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove();
    }), this.above = this.manager.tooltips.map((t) => !!t.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(n, this.above);
    e && this.observeIntersection();
    let t = e || n.geometryChanged, i = n.state.facet(bs);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let r of this.manager.tooltipViews)
        r.dom.style.position = this.position;
      t = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let r of this.manager.tooltipViews)
        this.container.appendChild(r.dom);
      t = !0;
    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(n, e) {
    let t = n.create(this.view), i = e ? e.dom : null;
    if (t.dom.classList.add("cm-tooltip"), n.arrow && !t.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let r = document.createElement("div");
      r.className = "cm-tooltip-arrow", t.dom.appendChild(r);
    }
    return t.dom.style.position = this.position, t.dom.style.top = Ui, t.dom.style.left = "0px", this.container.insertBefore(t.dom, i), t.mount && t.mount(this.view), this.resizeObserver && this.resizeObserver.observe(t.dom), t;
  }
  destroy() {
    var n, e, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let i of this.manager.tooltipViews)
      i.dom.remove(), (n = i.destroy) === null || n === void 0 || n.call(i);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = 1, e = 1, t = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: s } = this.manager.tooltipViews[0];
      if (I.gecko)
        t = s.offsetParent != this.container.ownerDocument.body;
      else if (s.style.top == Ui && s.style.left == "0px") {
        let o = s.getBoundingClientRect();
        t = Math.abs(o.top + 1e4) > 1 || Math.abs(o.left) > 1;
      }
    }
    if (t || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (n = s.width / this.parent.offsetWidth, e = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: n, scaleY: e } = this.view.viewState);
    let i = this.view.scrollDOM.getBoundingClientRect(), r = Wo(this.view);
    return {
      visible: {
        left: i.left + r.left,
        top: i.top + r.top,
        right: i.right - r.right,
        bottom: i.bottom - r.bottom
      },
      parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
      pos: this.manager.tooltips.map((s, o) => {
        let l = this.manager.tooltipViews[o];
        return l.getCoords ? l.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(bs).tooltipSpace(this.view),
      scaleX: n,
      scaleY: e,
      makeAbsolute: t
    };
  }
  writeMeasure(n) {
    var e;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { visible: t, space: i, scaleX: r, scaleY: s } = n, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: c } = h, f = n.pos[l], d = n.size[l];
      if (!f || a.clip !== !1 && (f.bottom <= Math.max(t.top, i.top) || f.top >= Math.min(t.bottom, i.bottom) || f.right < Math.max(t.left, i.left) - 0.1 || f.left > Math.min(t.right, i.right) + 0.1)) {
        c.style.top = Ui;
        continue;
      }
      let g = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, y = g ? 7 : 0, b = d.right - d.left, x = (e = va.get(h)) !== null && e !== void 0 ? e : d.bottom - d.top, k = h.offset || Fg, D = this.view.textDirection == oe.LTR, T = d.width > i.right - i.left ? D ? i.left : i.right - d.width : D ? Math.max(i.left, Math.min(f.left - (g ? 14 : 0) + k.x, i.right - b)) : Math.min(Math.max(i.left, f.left - b + (g ? 14 : 0) - k.x), i.right - b), E = this.above[l];
      !a.strictSide && (E ? f.top - x - y - k.y < i.top : f.bottom + x + y + k.y > i.bottom) && E == i.bottom - f.bottom > f.top - i.top && (E = this.above[l] = !E);
      let O = (E ? f.top - i.top : i.bottom - f.bottom) - y;
      if (O < x && h.resize !== !1) {
        if (O < this.view.defaultLineHeight) {
          c.style.top = Ui;
          continue;
        }
        va.set(h, x), c.style.height = (x = O) / s + "px";
      } else c.style.height && (c.style.height = "");
      let C = E ? f.top - x - y - k.y : f.bottom + y + k.y, A = T + b;
      if (h.overlap !== !0)
        for (let R of o)
          R.left < A && R.right > T && R.top < C + x && R.bottom > C && (C = E ? R.top - x - 2 - y : R.bottom + y + 2);
      if (this.position == "absolute" ? (c.style.top = (C - n.parent.top) / s + "px", wa(c, (T - n.parent.left) / r)) : (c.style.top = C / s + "px", wa(c, T / r)), g) {
        let R = f.left + (D ? k.x : -k.x) - (T + 14 - 7);
        g.style.left = R / r + "px";
      }
      h.overlap !== !0 && o.push({ left: T, top: C, right: A, bottom: C + x }), c.classList.toggle("cm-tooltip-above", E), c.classList.toggle("cm-tooltip-below", !E), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = Ui;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
});
function wa(n, e) {
  let t = parseInt(n.style.left, 10);
  (isNaN(t) || Math.abs(e - t) > 1) && (n.style.left = e + "px");
}
const Rg = /* @__PURE__ */ N.baseTheme({
  ".cm-tooltip": {
    zIndex: 500,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: `${7 * 2}px`,
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), Fg = { x: 0, y: 0 }, zr = /* @__PURE__ */ F.define({
  enables: [jo, Rg]
}), Cr = /* @__PURE__ */ F.define({
  combine: (n) => n.reduce((e, t) => e.concat(t), [])
});
class qr {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new qr(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new Rc(e, Cr, (t, i) => this.createHostedView(t, i), (t) => t.dom.remove());
  }
  createHostedView(e, t) {
    let i = e.create(this.view);
    return i.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(i.dom, t ? t.dom.nextSibling : this.dom.firstChild), this.mounted && i.mount && i.mount(this.view), i;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let i of this.manager.tooltipViews) {
      let r = i[e];
      if (r !== void 0) {
        if (t === void 0)
          t = r;
        else if (t !== r)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const Ng = /* @__PURE__ */ zr.compute([Cr], (n) => {
  let e = n.facet(Cr);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var i;
      return (i = t.end) !== null && i !== void 0 ? i : t.pos;
    })),
    create: qr.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
});
class Ig {
  constructor(e, t, i, r, s) {
    this.view = e, this.source = t, this.field = i, this.setHover = r, this.hoverTime = s, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, i = e.docView.nearest(t.target);
    if (!i)
      return;
    let r, s = 1;
    if (i instanceof zt)
      r = i.posAtStart;
    else {
      if (r = e.posAtCoords(t), r == null)
        return;
      let l = e.coordsAtPos(r);
      if (!l || t.y < l.top || t.y > l.bottom || t.x < l.left - e.defaultCharacterWidth || t.x > l.right + e.defaultCharacterWidth)
        return;
      let a = e.bidiSpans(e.state.doc.lineAt(r)).find((c) => c.from <= r && c.to >= r), h = a && a.dir == oe.RTL ? -1 : 1;
      s = t.x < l.left ? -h : h;
    }
    let o = this.source(e, r, s);
    if (o != null && o.then) {
      let l = this.pending = { pos: r };
      o.then((a) => {
        this.pending == l && (this.pending = null, a && !(Array.isArray(a) && !a.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(a) ? a : [a]) }));
      }, (a) => Ve(e.state, a, "hover tooltip"));
    } else o && !(Array.isArray(o) && !o.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(o) ? o : [o]) });
  }
  get tooltip() {
    let e = this.view.plugin(jo), t = e ? e.manager.tooltips.findIndex((i) => i.create == qr.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t, i;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: r, tooltip: s } = this;
    if (r.length && s && !Hg(s.dom, e) || this.pending) {
      let { pos: o } = r[0] || this.pending, l = (i = (t = r[0]) === null || t === void 0 ? void 0 : t.end) !== null && i !== void 0 ? i : o;
      (o == l ? this.view.posAtCoords(this.lastMove) != o : !Vg(this.view, o, l, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t.length) {
      let { tooltip: i } = this;
      i && i.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(e) {
    let t = (i) => {
      e.removeEventListener("mouseleave", t), this.active.length && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const Jn = 4;
function Hg(n, e) {
  let { left: t, right: i, top: r, bottom: s } = n.getBoundingClientRect(), o;
  if (o = n.querySelector(".cm-tooltip-arrow")) {
    let l = o.getBoundingClientRect();
    r = Math.min(l.top, r), s = Math.max(l.bottom, s);
  }
  return e.clientX >= t - Jn && e.clientX <= i + Jn && e.clientY >= r - Jn && e.clientY <= s + Jn;
}
function Vg(n, e, t, i, r, s) {
  let o = n.scrollDOM.getBoundingClientRect(), l = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > r || Math.min(o.bottom, l) < r)
    return !1;
  let a = n.posAtCoords({ x: i, y: r }, !1);
  return a >= e && a <= t;
}
function Wg(n, e = {}) {
  let t = z.define(), i = Se.define({
    create() {
      return [];
    },
    update(r, s) {
      if (r.length && (e.hideOnChange && (s.docChanged || s.selection) ? r = [] : e.hideOn && (r = r.filter((o) => !e.hideOn(s, o))), s.docChanged)) {
        let o = [];
        for (let l of r) {
          let a = s.changes.mapPos(l.pos, -1, He.TrackDel);
          if (a != null) {
            let h = Object.assign(/* @__PURE__ */ Object.create(null), l);
            h.pos = a, h.end != null && (h.end = s.changes.mapPos(h.end)), o.push(h);
          }
        }
        r = o;
      }
      for (let o of s.effects)
        o.is(t) && (r = o.value), o.is(zg) && (r = []);
      return r;
    },
    provide: (r) => Cr.from(r)
  });
  return {
    active: i,
    extension: [
      i,
      ge.define((r) => new Ig(
        r,
        n,
        i,
        t,
        e.hoverTime || 300
        /* Hover.Time */
      )),
      Ng
    ]
  };
}
function Fc(n, e) {
  let t = n.plugin(jo);
  if (!t)
    return null;
  let i = t.manager.tooltips.indexOf(e);
  return i < 0 ? null : t.manager.tooltipViews[i];
}
const zg = /* @__PURE__ */ z.define(), ka = /* @__PURE__ */ F.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function mn(n, e) {
  let t = n.plugin(Nc), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const Nc = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(yn), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(ka);
    this.top = new Xn(n, !0, e.topContainer), this.bottom = new Xn(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(ka);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new Xn(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new Xn(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(yn);
    if (t != this.input) {
      let i = t.filter((a) => a), r = [], s = [], o = [], l = [];
      for (let a of i) {
        let h = this.specs.indexOf(a), c;
        h < 0 ? (c = a(n.view), l.push(c)) : (c = this.panels[h], c.update && c.update(n)), r.push(c), (c.top ? s : o).push(c);
      }
      this.specs = i, this.panels = r, this.top.sync(s), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => N.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class Xn {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = Sa(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = Sa(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function Sa(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const yn = /* @__PURE__ */ F.define({
  enables: Nc
});
class Mt extends li {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
Mt.prototype.elementClass = "";
Mt.prototype.toDOM = void 0;
Mt.prototype.mapMode = He.TrackBefore;
Mt.prototype.startSide = Mt.prototype.endSide = -1;
Mt.prototype.point = !0;
const pr = /* @__PURE__ */ F.define(), qg = /* @__PURE__ */ F.define(), Kg = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => j.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
}, ln = /* @__PURE__ */ F.define();
function Ic(n) {
  return [Hc(), ln.of(Object.assign(Object.assign({}, Kg), n))];
}
const Ca = /* @__PURE__ */ F.define({
  combine: (n) => n.some((e) => e)
});
function Hc(n) {
  return [
    $g
  ];
}
const $g = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(ln).map((e) => new Ma(n, e));
    for (let e of this.gutters)
      this.dom.appendChild(e.dom);
    this.fixed = !n.state.facet(Ca), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    n.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px"), this.view.state.facet(Ca) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && this.dom.remove();
    let t = j.iter(this.view.state.facet(pr), this.view.viewport.from), i = [], r = this.gutters.map((s) => new jg(s, this.view.viewport, -this.view.documentPadding.top));
    for (let s of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(s.type)) {
        let o = !0;
        for (let l of s.type)
          if (l.type == We.Text && o) {
            go(t, i, l.from);
            for (let a of r)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of r)
              a.widget(this.view, l);
      } else if (s.type == We.Text) {
        go(t, i, s.from);
        for (let o of r)
          o.line(this.view, s, i);
      } else if (s.widget)
        for (let o of r)
          o.widget(this.view, s);
    for (let s of r)
      s.finish();
    n && this.view.scrollDOM.insertBefore(this.dom, e);
  }
  updateGutters(n) {
    let e = n.startState.facet(ln), t = n.state.facet(ln), i = n.docChanged || n.heightChanged || n.viewportChanged || !j.eq(n.startState.facet(pr), n.state.facet(pr), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let r of this.gutters)
        r.update(n) && (i = !0);
    else {
      i = !0;
      let r = [];
      for (let s of t) {
        let o = e.indexOf(s);
        o < 0 ? r.push(new Ma(this.view, s)) : (this.gutters[o].update(n), r.push(this.gutters[o]));
      }
      for (let s of this.gutters)
        s.dom.remove(), r.indexOf(s) < 0 && s.destroy();
      for (let s of r)
        this.dom.appendChild(s.dom);
      this.gutters = r;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove();
  }
}, {
  provide: (n) => N.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return !t || t.gutters.length == 0 || !t.fixed ? null : e.textDirection == oe.LTR ? { left: t.dom.offsetWidth * e.scaleX } : { right: t.dom.offsetWidth * e.scaleX };
  })
});
function Aa(n) {
  return Array.isArray(n) ? n : [n];
}
function go(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class jg {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = j.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: r } = this, s = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == r.elements.length) {
      let l = new Vc(e, o, s, i);
      r.elements.push(l), r.dom.appendChild(l.dom);
    } else
      r.elements[this.i].update(e, o, s, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let r = [];
    go(this.cursor, r, t.from), i.length && (r = r.concat(i));
    let s = this.gutter.config.lineMarker(e, t, r);
    s && r.unshift(s);
    let o = this.gutter;
    r.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, r);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t), r = i ? [i] : null;
    for (let s of e.state.facet(qg)) {
      let o = s(e, t.widget, t);
      o && (r || (r = [])).push(o);
    }
    r && this.addElement(e, t, r);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class Ma {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (r) => {
        let s = r.target, o;
        if (s != this.dom && this.dom.contains(s)) {
          for (; s.parentNode != this.dom; )
            s = s.parentNode;
          let a = s.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = r.clientY;
        let l = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[i](e, l, r) && r.preventDefault();
      });
    this.markers = Aa(t.markers(e)), t.initialSpacer && (this.spacer = new Vc(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = Aa(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let r = this.config.updateSpacer(this.spacer.markers[0], e);
      r != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [r]);
    }
    let i = e.view.viewport;
    return !j.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class Vc {
  constructor(e, t, i, r) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, r);
  }
  update(e, t, i, r) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), Ug(this.markers, r) || this.setMarkers(e, r);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", r = this.dom.firstChild;
    for (let s = 0, o = 0; ; ) {
      let l = o, a = s < t.length ? t[s++] : null, h = !1;
      if (a) {
        let c = a.elementClass;
        c && (i += " " + c);
        for (let f = o; f < this.markers.length; f++)
          if (this.markers[f].compare(a)) {
            l = f, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let c = this.markers[o++];
        if (c.toDOM) {
          c.destroy(r);
          let f = r.nextSibling;
          r.remove(), r = f;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? r = r.nextSibling : this.dom.insertBefore(a.toDOM(e), r)), h && o++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function Ug(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const Gg = /* @__PURE__ */ F.define(), Yg = /* @__PURE__ */ F.define(), wi = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let r in t) {
          let s = i[r], o = t[r];
          i[r] = s ? (l, a, h) => s(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class xs extends Mt {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function vs(n, e) {
  return n.state.facet(wi).formatNumber(e, n.state);
}
const Jg = /* @__PURE__ */ ln.compute([wi], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(Gg);
  },
  lineMarker(e, t, i) {
    return i.some((r) => r.toDOM) ? null : new xs(vs(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: (e, t, i) => {
    for (let r of e.state.facet(Yg)) {
      let s = r(e, t, i);
      if (s)
        return s;
    }
    return null;
  },
  lineMarkerChange: (e) => e.startState.facet(wi) != e.state.facet(wi),
  initialSpacer(e) {
    return new xs(vs(e, Da(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = vs(t.view, Da(t.view.state.doc.lines));
    return i == e.number ? e : new xs(i);
  },
  domEventHandlers: n.facet(wi).domEventHandlers
}));
function Xg(n = {}) {
  return [
    wi.of(n),
    Hc(),
    Jg
  ];
}
function Da(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const _g = /* @__PURE__ */ new class extends Mt {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), Qg = /* @__PURE__ */ pr.compute(["selection"], (n) => {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.head).from;
    r > t && (t = r, e.push(_g.range(r)));
  }
  return j.of(e);
});
function Zg() {
  return Qg;
}
const em = 1024;
let tm = 0;
class ws {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class $ {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = tm++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = Ye.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
$.closedBy = new $({ deserialize: (n) => n.split(" ") });
$.openedBy = new $({ deserialize: (n) => n.split(" ") });
$.group = new $({ deserialize: (n) => n.split(" ") });
$.isolate = new $({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
$.contextHash = new $({ perNode: !0 });
$.lookAhead = new $({ perNode: !0 });
$.mounted = new $({ perNode: !0 });
class Ar {
  constructor(e, t, i) {
    this.tree = e, this.overlay = t, this.parser = i;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[$.mounted.id];
  }
}
const im = /* @__PURE__ */ Object.create(null);
class Ye {
  /**
  @internal
  */
  constructor(e, t, i, r = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = r;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : im, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), r = new Ye(e.name || "", t, e.id, i);
    if (e.props) {
      for (let s of e.props)
        if (Array.isArray(s) || (s = s(r)), s) {
          if (s[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[s[0].id] = s[1];
        }
    }
    return r;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop($.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let r of i.split(" "))
        t[r] = e[i];
    return (i) => {
      for (let r = i.prop($.group), s = -1; s < (r ? r.length : 0); s++) {
        let o = t[s < 0 ? i.name : r[s]];
        if (o)
          return o;
      }
    };
  }
}
Ye.none = new Ye(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Uo {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let r = null;
      for (let s of e) {
        let o = s(i);
        o && (r || (r = Object.assign({}, i.props)), r[o[0].id] = o[1]);
      }
      t.push(r ? new Ye(i.name, r, i.id, i.flags) : i);
    }
    return new Uo(t);
  }
}
const _n = /* @__PURE__ */ new WeakMap(), Oa = /* @__PURE__ */ new WeakMap();
var Te;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays";
})(Te || (Te = {}));
class ce {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, r, s) {
    if (this.type = e, this.children = t, this.positions = i, this.length = r, this.props = null, s && s.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of s)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = Ar.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let r = i.toString();
      r && (t && (t += ","), t += r);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new yo(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let r = _n.get(this) || this.topNode, s = new yo(r);
    return s.moveTo(e, t), _n.set(this, s._tree), s;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new nt(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = bn(_n.get(this) || this.topNode, e, t, !1);
    return _n.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = bn(Oa.get(this) || this.topNode, e, t, !0);
    return Oa.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return sm(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: r = 0, to: s = this.length } = e, o = e.mode || 0, l = (o & Te.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | Te.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= s && a.to >= r && (!l && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Jo(Ye.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, r) => new ce(this.type, t, i, r, this.propValues), e.makeTree || ((t, i, r) => new ce(Ye.none, t, i, r)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return om(e);
  }
}
ce.empty = new ce(Ye.none, [], [], 0);
class Go {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Go(this.buffer, this.index);
  }
}
class Yt {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Ye.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], r = this.set.types[t], s = r.name;
    if (/\W/.test(s) && !r.isError && (s = JSON.stringify(s)), e += 4, i == e)
      return s;
    let o = [];
    for (; e < i; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return s + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, r, s) {
    let { buffer: o } = this, l = -1;
    for (let a = e; a != t && !(Wc(s, r, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let r = this.buffer, s = new Uint16Array(t - e), o = 0;
    for (let l = e, a = 0; l < t; ) {
      s[a++] = r[l++], s[a++] = r[l++] - i;
      let h = s[a++] = r[l++] - i;
      s[a++] = r[l++] - e, o = Math.max(o, h);
    }
    return new Yt(s, o, this.set);
  }
}
function Wc(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function bn(n, e, t, i) {
  for (var r; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let o = !i && n instanceof nt && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let s = i ? 0 : Te.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof nt && o.index < 0 && ((r = l.enter(e, t, s)) === null || r === void 0 ? void 0 : r.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(e, t, s);
    if (!o)
      return n;
    n = o;
  }
}
class zc {
  cursor(e = 0) {
    return new yo(this, e);
  }
  getChild(e, t = null, i = null) {
    let r = Ta(this, e, t, i);
    return r.length ? r[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return Ta(this, e, t, i);
  }
  resolve(e, t = 0) {
    return bn(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return bn(this, e, t, !0);
  }
  matchContext(e) {
    return mo(this.parent, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let r = t.lastChild;
      if (!r || r.to != t.to)
        break;
      r.type.isError && r.from == r.to ? (i = t, t = r.prevSibling) : t = r;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class nt extends zc {
  constructor(e, t, i, r) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = r;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, r, s = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = t > 0 ? l.length : -1; e != h; e += t) {
        let c = l[e], f = a[e] + o.from;
        if (Wc(r, i, f, f + c.length)) {
          if (c instanceof Yt) {
            if (s & Te.ExcludeBuffers)
              continue;
            let d = c.findChild(0, c.buffer.length, t, i - f, r);
            if (d > -1)
              return new Kt(new nm(o, c, e, f), null, d);
          } else if (s & Te.IncludeAnonymous || !c.type.isAnonymous || Yo(c)) {
            let d;
            if (!(s & Te.IgnoreMounts) && (d = Ar.get(c)) && !d.overlay)
              return new nt(d.tree, f, e, o);
            let g = new nt(c, f, e, o);
            return s & Te.IncludeAnonymous || !g.type.isAnonymous ? g : g.nextChild(t < 0 ? c.children.length - 1 : 0, t, i, r);
          }
        }
      }
      if (s & Te.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    let r;
    if (!(i & Te.IgnoreOverlays) && (r = Ar.get(this._tree)) && r.overlay) {
      let s = e - this.from;
      for (let { from: o, to: l } of r.overlay)
        if ((t > 0 ? o <= s : o < s) && (t < 0 ? l >= s : l > s))
          return new nt(r.tree, r.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function Ta(n, e, t, i) {
  let r = n.cursor(), s = [];
  if (!r.firstChild())
    return s;
  if (t != null) {
    for (let o = !1; !o; )
      if (o = r.type.is(t), !r.nextSibling())
        return s;
  }
  for (; ; ) {
    if (i != null && r.type.is(i))
      return s;
    if (r.type.is(e) && s.push(r.node), !r.nextSibling())
      return i == null ? s : [];
  }
}
function mo(n, e, t = e.length - 1) {
  for (let i = n; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class nm {
  constructor(e, t, i, r) {
    this.parent = e, this.buffer = t, this.index = i, this.start = r;
  }
}
class Kt extends zc {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.context.start, i);
    return s < 0 ? null : new Kt(this.context, this, s);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    if (i & Te.ExcludeBuffers)
      return null;
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return s < 0 ? null : new Kt(this.context, this, s);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new Kt(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new Kt(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, r = this.index + 4, s = i.buffer[this.index + 3];
    if (s > r) {
      let o = i.buffer[this.index + 1];
      e.push(i.slice(r, s, o)), t.push(0);
    }
    return new ce(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function qc(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let s = 1; s < n.length; s++) {
    let o = n[s];
    (o.from > t.from || o.to < t.to) && (t = o, e = s);
  }
  let i = t instanceof nt && t.index < 0 ? null : t.parent, r = n.slice();
  return i ? r[e] = i : r.splice(e, 1), new rm(r, t);
}
class rm {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return qc(this.heads);
  }
}
function sm(n, e, t) {
  let i = n.resolveInner(e, t), r = null;
  for (let s = i instanceof nt ? i : i.context.parent; s; s = s.parent)
    if (s.index < 0) {
      let o = s.parent;
      (r || (r = [i])).push(o.resolve(e, t)), s = o;
    } else {
      let o = Ar.get(s.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let l = new nt(o.tree, o.overlay[0].from + s.from, -1, s);
        (r || (r = [i])).push(bn(l, e, t, !1));
      }
    }
  return r ? qc(r) : i;
}
class yo {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.mode = t, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, e instanceof nt)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: r } = this.buffer;
    return this.type = t || r.set.types[r.buffer[e]], this.from = i + r.buffer[e + 1], this.to = i + r.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof nt ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: r } = this.buffer, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.buffer.start, i);
    return s < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(s));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & Te.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & Te.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & Te.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let r = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != r)
        return this.yieldBuf(t.findChild(
          r,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let r = t.buffer[this.index + 3];
      if (r < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(r);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: r } = this;
    if (r) {
      if (e > 0) {
        if (this.index < r.buffer.buffer.length)
          return !1;
      } else
        for (let s = 0; s < this.index; s++)
          if (r.buffer.buffer[s + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = r);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let s = t + e, o = e < 0 ? -1 : i._tree.children.length; s != o; s += e) {
          let l = i._tree.children[s];
          if (this.mode & Te.IncludeAnonymous || l instanceof Yt || !l.type.isAnonymous || Yo(l))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e: for (let r = this.index, s = this.stack.length; s >= 0; ) {
        for (let o = e; o; o = o._parent)
          if (o.index == r) {
            if (r == this.index)
              return o;
            t = o, i = s + 1;
            break e;
          }
        r = this.stack[--s];
      }
    for (let r = i; r < this.stack.length; r++)
      t = new Kt(this.buffer, t, this.stack[r]);
    return this.bufferNode = new Kt(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let r = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (r = !0);
      }
      for (; ; ) {
        if (r && t && t(this), r = this.type.isAnonymous, !i)
          return;
        if (this.nextSibling())
          break;
        this.parent(), i--, r = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return mo(this.node.parent, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let r = e.length - 1, s = this.stack.length - 1; r >= 0; s--) {
      if (s < 0)
        return mo(this._tree, e, r);
      let o = i[t.buffer[this.stack[s]]];
      if (!o.isAnonymous) {
        if (e[r] && e[r] != o.name)
          return !1;
        r--;
      }
    }
    return !0;
  }
}
function Yo(n) {
  return n.children.some((e) => e instanceof Yt || !e.type.isAnonymous || Yo(e));
}
function om(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: r = em, reused: s = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(t) ? new Go(t, t.length) : t, a = i.types, h = 0, c = 0;
  function f(O, C, A, R, q, _) {
    let { id: K, start: V, end: Y, size: U } = l, H = c, ue = h;
    for (; U < 0; )
      if (l.next(), U == -1) {
        let fe = s[K];
        A.push(fe), R.push(V - O);
        return;
      } else if (U == -3) {
        h = K;
        return;
      } else if (U == -4) {
        c = K;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${U}`);
    let de = a[K], Be, v, B = V - O;
    if (Y - V <= r && (v = x(l.pos - C, q))) {
      let fe = new Uint16Array(v.size - v.skip), me = l.pos - v.size, qe = fe.length;
      for (; l.pos > me; )
        qe = k(v.start, fe, qe);
      Be = new Yt(fe, Y - v.start, i), B = v.start - O;
    } else {
      let fe = l.pos - U;
      l.next();
      let me = [], qe = [], Q = K >= o ? K : -1, he = 0, be = Y;
      for (; l.pos > fe; )
        Q >= 0 && l.id == Q && l.size >= 0 ? (l.end <= be - r && (y(me, qe, V, he, l.end, be, Q, H, ue), he = me.length, be = l.end), l.next()) : _ > 2500 ? d(V, fe, me, qe) : f(V, fe, me, qe, Q, _ + 1);
      if (Q >= 0 && he > 0 && he < me.length && y(me, qe, V, he, V, be, Q, H, ue), me.reverse(), qe.reverse(), Q > -1 && he > 0) {
        let gi = g(de, ue);
        Be = Jo(de, me, qe, 0, me.length, 0, Y - V, gi, gi);
      } else
        Be = b(de, me, qe, Y - V, H - Y, ue);
    }
    A.push(Be), R.push(B);
  }
  function d(O, C, A, R) {
    let q = [], _ = 0, K = -1;
    for (; l.pos > C; ) {
      let { id: V, start: Y, end: U, size: H } = l;
      if (H > 4)
        l.next();
      else {
        if (K > -1 && Y < K)
          break;
        K < 0 && (K = U - r), q.push(V, Y, U), _++, l.next();
      }
    }
    if (_) {
      let V = new Uint16Array(_ * 4), Y = q[q.length - 2];
      for (let U = q.length - 3, H = 0; U >= 0; U -= 3)
        V[H++] = q[U], V[H++] = q[U + 1] - Y, V[H++] = q[U + 2] - Y, V[H++] = H;
      A.push(new Yt(V, q[2] - Y, i)), R.push(Y - O);
    }
  }
  function g(O, C) {
    return (A, R, q) => {
      let _ = 0, K = A.length - 1, V, Y;
      if (K >= 0 && (V = A[K]) instanceof ce) {
        if (!K && V.type == O && V.length == q)
          return V;
        (Y = V.prop($.lookAhead)) && (_ = R[K] + V.length + Y);
      }
      return b(O, A, R, q, _, C);
    };
  }
  function y(O, C, A, R, q, _, K, V, Y) {
    let U = [], H = [];
    for (; O.length > R; )
      U.push(O.pop()), H.push(C.pop() + A - q);
    O.push(b(i.types[K], U, H, _ - q, V - _, Y)), C.push(q - A);
  }
  function b(O, C, A, R, q, _, K) {
    if (_) {
      let V = [$.contextHash, _];
      K = K ? [V].concat(K) : [V];
    }
    if (q > 25) {
      let V = [$.lookAhead, q];
      K = K ? [V].concat(K) : [V];
    }
    return new ce(O, C, A, R, K);
  }
  function x(O, C) {
    let A = l.fork(), R = 0, q = 0, _ = 0, K = A.end - r, V = { size: 0, start: 0, skip: 0 };
    e: for (let Y = A.pos - O; A.pos > Y; ) {
      let U = A.size;
      if (A.id == C && U >= 0) {
        V.size = R, V.start = q, V.skip = _, _ += 4, R += 4, A.next();
        continue;
      }
      let H = A.pos - U;
      if (U < 0 || H < Y || A.start < K)
        break;
      let ue = A.id >= o ? 4 : 0, de = A.start;
      for (A.next(); A.pos > H; ) {
        if (A.size < 0)
          if (A.size == -3)
            ue += 4;
          else
            break e;
        else A.id >= o && (ue += 4);
        A.next();
      }
      q = de, R += U, _ += ue;
    }
    return (C < 0 || R == O) && (V.size = R, V.start = q, V.skip = _), V.size > 4 ? V : void 0;
  }
  function k(O, C, A) {
    let { id: R, start: q, end: _, size: K } = l;
    if (l.next(), K >= 0 && R < o) {
      let V = A;
      if (K > 4) {
        let Y = l.pos - (K - 4);
        for (; l.pos > Y; )
          A = k(O, C, A);
      }
      C[--A] = V, C[--A] = _ - O, C[--A] = q - O, C[--A] = R;
    } else K == -3 ? h = R : K == -4 && (c = R);
    return A;
  }
  let D = [], T = [];
  for (; l.pos > 0; )
    f(n.start || 0, n.bufferStart || 0, D, T, -1, 0);
  let E = (e = n.length) !== null && e !== void 0 ? e : D.length ? T[0] + D[0].length : 0;
  return new ce(a[n.topID], D.reverse(), T.reverse(), E);
}
const Ea = /* @__PURE__ */ new WeakMap();
function gr(n, e) {
  if (!n.isAnonymous || e instanceof Yt || e.type != n)
    return 1;
  let t = Ea.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof ce)) {
        t = 1;
        break;
      }
      t += gr(n, i);
    }
    Ea.set(e, t);
  }
  return t;
}
function Jo(n, e, t, i, r, s, o, l, a) {
  let h = 0;
  for (let y = i; y < r; y++)
    h += gr(n, e[y]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], d = [];
  function g(y, b, x, k, D) {
    for (let T = x; T < k; ) {
      let E = T, O = b[T], C = gr(n, y[T]);
      for (T++; T < k; T++) {
        let A = gr(n, y[T]);
        if (C + A >= c)
          break;
        C += A;
      }
      if (T == E + 1) {
        if (C > c) {
          let A = y[E];
          g(A.children, A.positions, 0, A.children.length, b[E] + D);
          continue;
        }
        f.push(y[E]);
      } else {
        let A = b[T - 1] + y[T - 1].length - O;
        f.push(Jo(n, y, b, E, T, O, A, null, a));
      }
      d.push(O + D - s);
    }
  }
  return g(e, t, i, r, 0), (l || a)(f, d, o);
}
class si {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, r, s = !1, o = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = r, this.open = (s ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let r = [new si(0, e.length, e, 0, !1, i)];
    for (let s of t)
      s.to > e.length && r.push(s);
    return r;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let r = [], s = 1, o = e.length ? e[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let c = l < t.length ? t[l] : null, f = c ? c.fromA : 1e9;
      if (f - a >= i)
        for (; o && o.from < f; ) {
          let d = o;
          if (a >= d.from || f <= d.to || h) {
            let g = Math.max(d.from, a) - h, y = Math.min(d.to, f) - h;
            d = g >= y ? null : new si(g, y, d.tree, d.offset + h, l > 0, !!c);
          }
          if (d && r.push(d), o.to > f)
            break;
          o = s < e.length ? e[s++] : null;
        }
      if (!c)
        break;
      a = c.toA, h = c.toA - c.toB;
    }
    return r;
  }
}
class Kc {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new lm(e)), i = i ? i.length ? i.map((r) => new ws(r.from, r.to)) : [new ws(0, 0)] : [new ws(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let r = this.startParse(e, t, i);
    for (; ; ) {
      let s = r.advance();
      if (s)
        return s;
    }
  }
}
class lm {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
new $({ perNode: !0 });
let am = 0;
class Ze {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.name = e, this.set = t, this.base = i, this.modified = r, this.id = am++;
  }
  toString() {
    let { name: e } = this;
    for (let t of this.modified)
      t.name && (e = `${t.name}(${e})`);
    return e;
  }
  static define(e, t) {
    let i = typeof e == "string" ? e : "?";
    if (e instanceof Ze && (t = e), t != null && t.base)
      throw new Error("Can not derive from a modified tag");
    let r = new Ze(i, [], null, []);
    if (r.set.push(r), t)
      for (let s of t.set)
        r.set.push(s);
    return r;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(e) {
    let t = new Mr(e);
    return (i) => i.modified.indexOf(t) > -1 ? i : Mr.get(i.base || i, i.modified.concat(t).sort((r, s) => r.id - s.id));
  }
}
let hm = 0;
class Mr {
  constructor(e) {
    this.name = e, this.instances = [], this.id = hm++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((l) => l.base == e && cm(t, l.modified));
    if (i)
      return i;
    let r = [], s = new Ze(e.name, r, e, t);
    for (let l of t)
      l.instances.push(s);
    let o = fm(t);
    for (let l of e.set)
      if (!l.modified.length)
        for (let a of o)
          r.push(Mr.get(l, a));
    return s;
  }
}
function cm(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function fm(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, r = e.length; i < r; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function um(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let r of t.split(" "))
      if (r) {
        let s = [], o = 2, l = r;
        for (let f = 0; ; ) {
          if (l == "..." && f > 0 && f + 3 == r.length) {
            o = 1;
            break;
          }
          let d = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!d)
            throw new RangeError("Invalid path: " + r);
          if (s.push(d[0] == "*" ? "" : d[0][0] == '"' ? JSON.parse(d[0]) : d[0]), f += d[0].length, f == r.length)
            break;
          let g = r[f++];
          if (f == r.length && g == "!") {
            o = 0;
            break;
          }
          if (g != "/")
            throw new RangeError("Invalid path: " + r);
          l = r.slice(f);
        }
        let a = s.length - 1, h = s[a];
        if (!h)
          throw new RangeError("Invalid path: " + r);
        let c = new Dr(i, o, a > 0 ? s.slice(0, a) : null);
        e[h] = c.sort(e[h]);
      }
  }
  return $c.add(e);
}
const $c = new $();
class Dr {
  constructor(e, t, i, r) {
    this.tags = e, this.mode = t, this.context = i, this.next = r;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Dr.empty = new Dr([], 2, null);
function jc(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let s of n)
    if (!Array.isArray(s.tag))
      t[s.tag.id] = s.class;
    else
      for (let o of s.tag)
        t[o.id] = s.class;
  let { scope: i, all: r = null } = e || {};
  return {
    style: (s) => {
      let o = r;
      for (let l of s)
        for (let a of l.set) {
          let h = t[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function dm(n, e) {
  let t = null;
  for (let i of n) {
    let r = i.style(e);
    r && (t = t ? t + " " + r : r);
  }
  return t;
}
function pm(n, e, t, i = 0, r = n.length) {
  let s = new gm(i, Array.isArray(e) ? e : [e], t);
  s.highlightRange(n.cursor(), i, r, "", s.highlighters), s.flush(r);
}
class gm {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, r, s) {
    let { type: o, from: l, to: a } = e;
    if (l >= i || a <= t)
      return;
    o.isTop && (s = this.highlighters.filter((g) => !g.scope || g.scope(o)));
    let h = r, c = mm(e) || Dr.empty, f = dm(s, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (r += (r ? " " : "") + f)), this.startSpan(Math.max(t, l), h), c.opaque)
      return;
    let d = e.tree && e.tree.prop($.mounted);
    if (d && d.overlay) {
      let g = e.node.enter(d.overlay[0].from + l, 1), y = this.highlighters.filter((x) => !x.scope || x.scope(d.tree.type)), b = e.firstChild();
      for (let x = 0, k = l; ; x++) {
        let D = x < d.overlay.length ? d.overlay[x] : null, T = D ? D.from + l : a, E = Math.max(t, k), O = Math.min(i, T);
        if (E < O && b)
          for (; e.from < O && (this.highlightRange(e, E, O, r, s), this.startSpan(Math.min(O, e.to), h), !(e.to >= T || !e.nextSibling())); )
            ;
        if (!D || T > i)
          break;
        k = D.to + l, k > t && (this.highlightRange(g.cursor(), Math.max(t, D.from + l), Math.min(i, k), "", y), this.startSpan(Math.min(i, k), h));
      }
      b && e.parent();
    } else if (e.firstChild()) {
      d && (r = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, r, s), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function mm(n) {
  let e = n.type.prop($c);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const L = Ze.define, Qn = L(), It = L(), Ba = L(It), La = L(It), Ht = L(), Zn = L(Ht), ks = L(Ht), yt = L(), ei = L(yt), gt = L(), mt = L(), bo = L(), Gi = L(bo), er = L(), p = {
  /**
  A comment.
  */
  comment: Qn,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: L(Qn),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: L(Qn),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: L(Qn),
  /**
  Any kind of identifier.
  */
  name: It,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: L(It),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: Ba,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: L(Ba),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: La,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: L(La),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: L(It),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: L(It),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: L(It),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: L(It),
  /**
  A literal value.
  */
  literal: Ht,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: Zn,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: L(Zn),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: L(Zn),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: L(Zn),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: ks,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: L(ks),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: L(ks),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: L(Ht),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: L(Ht),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: L(Ht),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: L(Ht),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: L(Ht),
  /**
  A language keyword.
  */
  keyword: gt,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: L(gt),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: L(gt),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: L(gt),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: L(gt),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: L(gt),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: L(gt),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: L(gt),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: L(gt),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: L(gt),
  /**
  An operator.
  */
  operator: mt,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: L(mt),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: L(mt),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: L(mt),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: L(mt),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: L(mt),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: L(mt),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: L(mt),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: L(mt),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: L(mt),
  /**
  Program or markup punctuation.
  */
  punctuation: bo,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: L(bo),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: Gi,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: L(Gi),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: L(Gi),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: L(Gi),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: L(Gi),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: yt,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: ei,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: L(ei),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: L(ei),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: L(ei),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: L(ei),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: L(ei),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: L(ei),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: L(yt),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: L(yt),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: L(yt),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: L(yt),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: L(yt),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: L(yt),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: L(yt),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: L(yt),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: L(),
  /**
  Deleted text.
  */
  deleted: L(),
  /**
  Changed text.
  */
  changed: L(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: L(),
  /**
  Metadata or meta-instruction.
  */
  meta: er,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: L(er),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: L(er),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: L(er),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Ze.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Ze.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Ze.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Ze.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Ze.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Ze.defineModifier("special")
};
for (let n in p) {
  let e = p[n];
  e instanceof Ze && (e.name = n);
}
jc([
  { tag: p.link, class: "tok-link" },
  { tag: p.heading, class: "tok-heading" },
  { tag: p.emphasis, class: "tok-emphasis" },
  { tag: p.strong, class: "tok-strong" },
  { tag: p.keyword, class: "tok-keyword" },
  { tag: p.atom, class: "tok-atom" },
  { tag: p.bool, class: "tok-bool" },
  { tag: p.url, class: "tok-url" },
  { tag: p.labelName, class: "tok-labelName" },
  { tag: p.inserted, class: "tok-inserted" },
  { tag: p.deleted, class: "tok-deleted" },
  { tag: p.literal, class: "tok-literal" },
  { tag: p.string, class: "tok-string" },
  { tag: p.number, class: "tok-number" },
  { tag: [p.regexp, p.escape, p.special(p.string)], class: "tok-string2" },
  { tag: p.variableName, class: "tok-variableName" },
  { tag: p.local(p.variableName), class: "tok-variableName tok-local" },
  { tag: p.definition(p.variableName), class: "tok-variableName tok-definition" },
  { tag: p.special(p.variableName), class: "tok-variableName2" },
  { tag: p.definition(p.propertyName), class: "tok-propertyName tok-definition" },
  { tag: p.typeName, class: "tok-typeName" },
  { tag: p.namespace, class: "tok-namespace" },
  { tag: p.className, class: "tok-className" },
  { tag: p.macroName, class: "tok-macroName" },
  { tag: p.propertyName, class: "tok-propertyName" },
  { tag: p.operator, class: "tok-operator" },
  { tag: p.comment, class: "tok-comment" },
  { tag: p.meta, class: "tok-meta" },
  { tag: p.invalid, class: "tok-invalid" },
  { tag: p.punctuation, class: "tok-punctuation" }
]);
var Ss;
const ki = /* @__PURE__ */ new $();
function ym(n) {
  return F.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const bm = /* @__PURE__ */ new $();
class lt {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], r = "") {
    this.data = e, this.name = r, X.prototype.hasOwnProperty("tree") || Object.defineProperty(X.prototype, "tree", { get() {
      return Re(this);
    } }), this.parser = t, this.extension = [
      Jt.of(this),
      X.languageData.of((s, o, l) => {
        let a = Pa(s, o, l), h = a.type.prop(ki);
        if (!h)
          return [];
        let c = s.facet(h), f = a.type.prop(bm);
        if (f) {
          let d = a.resolve(o - a.from, l);
          for (let g of f)
            if (g.test(d, s)) {
              let y = s.facet(g.facet);
              return g.type == "replace" ? y : y.concat(c);
            }
        }
        return c;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return Pa(e, t, i).type.prop(ki) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(Jt);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], r = (s, o) => {
      if (s.prop(ki) == this.data) {
        i.push({ from: o, to: o + s.length });
        return;
      }
      let l = s.prop($.mounted);
      if (l) {
        if (l.tree.prop(ki) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              i.push({ from: a.from + o, to: a.to + o });
          else
            i.push({ from: o, to: o + s.length });
          return;
        } else if (l.overlay) {
          let a = i.length;
          if (r(l.tree, l.overlay[0].from + o), i.length > a)
            return;
        }
      }
      for (let a = 0; a < s.children.length; a++) {
        let h = s.children[a];
        h instanceof ce && r(h, s.positions[a] + o);
      }
    };
    return r(Re(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
lt.setState = /* @__PURE__ */ z.define();
function Pa(n, e, t) {
  let i = n.facet(Jt), r = Re(n).topNode;
  if (!i || i.allowsNesting)
    for (let s = r; s; s = s.enter(e, t, Te.ExcludeBuffers))
      s.type.isTop && (r = s);
  return r;
}
function Re(n) {
  let e = n.field(lt.state, !1);
  return e ? e.tree : ce.empty;
}
class xm {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let Yi = null;
class Pi {
  constructor(e, t, i = [], r, s, o, l, a) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = r, this.treeLen = s, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Pi(e, t, [], ce.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new xm(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != ce.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let r = Date.now() + e;
        e = () => Date.now() > r;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let r = this.parse.advance();
        if (r)
          if (this.fragments = this.withoutTempSkipped(si.addTree(r, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = r, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(si.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = Yi;
    Yi = this;
    try {
      return e();
    } finally {
      Yi = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = Ra(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: r, treeLen: s, viewport: o, skipped: l } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, c, f, d) => a.push({ fromA: h, toA: c, fromB: f, toB: d })), i = si.applyChanges(i, a), r = ce.empty, s = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let c = e.mapPos(h.from, 1), f = e.mapPos(h.to, -1);
          c < f && l.push({ from: c, to: f });
        }
      }
    }
    return new Pi(this.parser, t, i, r, s, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: r, to: s } = this.skipped[i];
      r < e.to && s > e.from && (this.fragments = Ra(this.fragments, r, s), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends Kc {
      createParse(t, i, r) {
        let s = r[0].from, o = r[r.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let a = Yi;
            if (a) {
              for (let h of r)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new ce(Ye.none, [], [], o - s);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return Yi;
  }
}
function Ra(n, e, t) {
  return si.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Ri {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new Ri(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = Pi.create(e.facet(Jt).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new Ri(i);
  }
}
lt.state = /* @__PURE__ */ Se.define({
  create: Ri.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(lt.setState))
        return t.value;
    return e.startState.facet(Jt) != e.state.facet(Jt) ? Ri.init(e.state) : n.apply(e);
  }
});
let Uc = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (Uc = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const Cs = typeof navigator < "u" && (!((Ss = navigator.scheduling) === null || Ss === void 0) && Ss.isInputPending) ? () => navigator.scheduling.isInputPending() : null, vm = /* @__PURE__ */ ge.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(lt.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(lt.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = Uc(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: r } } = this.view, s = i.field(lt.state);
    if (s.tree == s.context.tree && s.context.isDone(
      r + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !Cs ? Math.max(25, e.timeRemaining() - 5) : 1e9), l = s.context.treeLen < r && i.doc.length > r + 1e3, a = s.context.work(() => Cs && Cs() || Date.now() > o, r + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (s.context.takeTree(), this.view.dispatch({ effects: lt.setState.of(new Ri(s.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(s.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => Ve(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), Jt = /* @__PURE__ */ F.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    lt.state,
    vm,
    N.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
}), wm = /* @__PURE__ */ F.define(), Xo = /* @__PURE__ */ F.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function fi(n) {
  let e = n.facet(Xo);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function xn(n, e) {
  let t = "", i = n.tabSize, r = n.facet(Xo)[0];
  if (r == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    r = " ";
  }
  for (let s = 0; s < e; s++)
    t += r;
  return t;
}
function _o(n, e) {
  n instanceof X && (n = new Kr(n));
  for (let i of n.state.facet(wm)) {
    let r = i(n, e);
    if (r !== void 0)
      return r;
  }
  let t = Re(n.state);
  return t.length >= e ? km(n, t, e) : null;
}
class Kr {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = fi(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: r, simulateDoubleBreak: s } = this.options;
    return r != null && r >= i.from && r <= i.to ? s && r == e ? { text: "", from: e } : (t < 0 ? r < e : r <= e) ? { text: i.text.slice(r - i.from), from: r } : { text: i.text.slice(0, r - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: r } = this.lineAt(e, t);
    return i.slice(e - r, Math.min(i.length, e + 100 - r));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.countColumn(i, e - r), o = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
    return o > -1 && (s += o - this.countColumn(i, i.search(/\S|$/))), s;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return Hi(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.options.overrideIndentation;
    if (s) {
      let o = s(r);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Gc = /* @__PURE__ */ new $();
function km(n, e, t) {
  let i = e.resolveStack(t), r = e.resolveInner(t, -1).resolve(t, 0).enterUnfinishedNodesBefore(t);
  if (r != i.node) {
    let s = [];
    for (let o = r; o && !(o.from == i.node.from && o.type == i.node.type); o = o.parent)
      s.push(o);
    for (let o = s.length - 1; o >= 0; o--)
      i = { node: s[o], next: i };
  }
  return Yc(i, n, t);
}
function Yc(n, e, t) {
  for (let i = n; i; i = i.next) {
    let r = Cm(i.node);
    if (r)
      return r(Qo.create(e, t, i));
  }
  return 0;
}
function Sm(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function Cm(n) {
  let e = n.type.prop(Gc);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop($.closedBy))) {
    let r = n.lastChild, s = r && i.indexOf(r.name) > -1;
    return (o) => Om(o, !0, 1, void 0, s && !Sm(o) ? r.from : void 0);
  }
  return n.parent == null ? Am : null;
}
function Am() {
  return 0;
}
class Qo extends Kr {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Qo(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (Mm(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return Yc(this.context.next, this.base, this.pos);
  }
}
function Mm(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Dm(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let r = n.options.simulateBreak, s = n.state.doc.lineAt(t.from), o = r == null || r <= s.from ? s.to : Math.min(s.to, r);
  for (let l = t.to; ; ) {
    let a = e.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped) {
      if (a.from >= o)
        return null;
      let h = /^ */.exec(s.text.slice(t.to - s.from))[0].length;
      return { from: t.from, to: t.to + h };
    }
    l = a.to;
  }
}
function Om(n, e, t, i, r) {
  let s = n.textAfter, o = s.match(/^\s*/)[0].length, l = i && s.slice(o, o + i.length) == i || r == n.pos + o, a = Dm(n);
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * t);
}
const Tm = 200;
function Em() {
  return X.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let e = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!e.length)
      return n;
    let t = n.newDoc, { head: i } = n.newSelection.main, r = t.lineAt(i);
    if (i > r.from + Tm)
      return n;
    let s = t.sliceString(r.from, i);
    if (!e.some((h) => h.test(s)))
      return n;
    let { state: o } = n, l = -1, a = [];
    for (let { head: h } of o.selection.ranges) {
      let c = o.doc.lineAt(h);
      if (c.from == l)
        continue;
      l = c.from;
      let f = _o(o, c.from);
      if (f == null)
        continue;
      let d = /^\s*/.exec(c.text)[0], g = xn(o, f);
      d != g && a.push({ from: c.from, to: c.from + d.length, insert: g });
    }
    return a.length ? [n, { changes: a, sequential: !0 }] : n;
  });
}
const Bm = /* @__PURE__ */ F.define(), Lm = /* @__PURE__ */ new $();
function Pm(n, e, t) {
  let i = Re(n);
  if (i.length < t)
    return null;
  let r = i.resolveStack(t, 1), s = null;
  for (let o = r; o; o = o.next) {
    let l = o.node;
    if (l.to <= t || l.from > t)
      continue;
    if (s && l.from < e)
      break;
    let a = l.type.prop(Lm);
    if (a && (l.to < i.length - 50 || i.length == n.doc.length || !Rm(l))) {
      let h = a(l, n);
      h && h.from <= t && h.from >= e && h.to > t && (s = h);
    }
  }
  return s;
}
function Rm(n) {
  let e = n.lastChild;
  return e && e.to == n.to && e.type.isError;
}
function Or(n, e, t) {
  for (let i of n.facet(Bm)) {
    let r = i(n, e, t);
    if (r)
      return r;
  }
  return Pm(n, e, t);
}
function Jc(n, e) {
  let t = e.mapPos(n.from, 1), i = e.mapPos(n.to, -1);
  return t >= i ? void 0 : { from: t, to: i };
}
const $r = /* @__PURE__ */ z.define({ map: Jc }), On = /* @__PURE__ */ z.define({ map: Jc });
function Xc(n) {
  let e = [];
  for (let { head: t } of n.state.selection.ranges)
    e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
  return e;
}
const ui = /* @__PURE__ */ Se.define({
  create() {
    return W.none;
  },
  update(n, e) {
    n = n.map(e.changes);
    for (let t of e.effects)
      if (t.is($r) && !Fm(n, t.value.from, t.value.to)) {
        let { preparePlaceholder: i } = e.state.facet(Zc), r = i ? W.replace({ widget: new qm(i(e.state, t.value)) }) : Fa;
        n = n.update({ add: [r.range(t.value.from, t.value.to)] });
      } else t.is(On) && (n = n.update({
        filter: (i, r) => t.value.from != i || t.value.to != r,
        filterFrom: t.value.from,
        filterTo: t.value.to
      }));
    if (e.selection) {
      let t = !1, { head: i } = e.selection.main;
      n.between(i, i, (r, s) => {
        r < i && s > i && (t = !0);
      }), t && (n = n.update({
        filterFrom: i,
        filterTo: i,
        filter: (r, s) => s <= i || r >= i
      }));
    }
    return n;
  },
  provide: (n) => N.decorations.from(n),
  toJSON(n, e) {
    let t = [];
    return n.between(0, e.doc.length, (i, r) => {
      t.push(i, r);
    }), t;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < n.length; ) {
      let i = n[t++], r = n[t++];
      if (typeof i != "number" || typeof r != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(Fa.range(i, r));
    }
    return W.set(e, !0);
  }
});
function Tr(n, e, t) {
  var i;
  let r = null;
  return (i = n.field(ui, !1)) === null || i === void 0 || i.between(e, t, (s, o) => {
    (!r || r.from > s) && (r = { from: s, to: o });
  }), r;
}
function Fm(n, e, t) {
  let i = !1;
  return n.between(e, e, (r, s) => {
    r == e && s == t && (i = !0);
  }), i;
}
function _c(n, e) {
  return n.field(ui, !1) ? e : e.concat(z.appendConfig.of(ef()));
}
const Nm = (n) => {
  for (let e of Xc(n)) {
    let t = Or(n.state, e.from, e.to);
    if (t)
      return n.dispatch({ effects: _c(n.state, [$r.of(t), Qc(n, t)]) }), !0;
  }
  return !1;
}, Im = (n) => {
  if (!n.state.field(ui, !1))
    return !1;
  let e = [];
  for (let t of Xc(n)) {
    let i = Tr(n.state, t.from, t.to);
    i && e.push(On.of(i), Qc(n, i, !1));
  }
  return e.length && n.dispatch({ effects: e }), e.length > 0;
};
function Qc(n, e, t = !0) {
  let i = n.state.doc.lineAt(e.from).number, r = n.state.doc.lineAt(e.to).number;
  return N.announce.of(`${n.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${r}.`);
}
const Hm = (n) => {
  let { state: e } = n, t = [];
  for (let i = 0; i < e.doc.length; ) {
    let r = n.lineBlockAt(i), s = Or(e, r.from, r.to);
    s && t.push($r.of(s)), i = (s ? n.lineBlockAt(s.to) : r).to + 1;
  }
  return t.length && n.dispatch({ effects: _c(n.state, t) }), !!t.length;
}, Vm = (n) => {
  let e = n.state.field(ui, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, n.state.doc.length, (i, r) => {
    t.push(On.of({ from: i, to: r }));
  }), n.dispatch({ effects: t }), !0;
}, Wm = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: Nm },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: Im },
  { key: "Ctrl-Alt-[", run: Hm },
  { key: "Ctrl-Alt-]", run: Vm }
], zm = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, Zc = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, zm);
  }
});
function ef(n) {
  return [ui, jm];
}
function tf(n, e) {
  let { state: t } = n, i = t.facet(Zc), r = (o) => {
    let l = n.lineBlockAt(n.posAtDOM(o.target)), a = Tr(n.state, l.from, l.to);
    a && n.dispatch({ effects: On.of(a) }), o.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, r, e);
  let s = document.createElement("span");
  return s.textContent = i.placeholderText, s.setAttribute("aria-label", t.phrase("folded code")), s.title = t.phrase("unfold"), s.className = "cm-foldPlaceholder", s.onclick = r, s;
}
const Fa = /* @__PURE__ */ W.replace({ widget: /* @__PURE__ */ new class extends Xt {
  toDOM(n) {
    return tf(n, null);
  }
}() });
class qm extends Xt {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return tf(e, this.value);
  }
}
const Km = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class As extends Mt {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function $m(n = {}) {
  let e = Object.assign(Object.assign({}, Km), n), t = new As(e, !0), i = new As(e, !1), r = ge.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(Jt) != o.state.facet(Jt) || o.startState.field(ui, !1) != o.state.field(ui, !1) || Re(o.startState) != Re(o.state) || e.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let l = new Lt();
      for (let a of o.viewportLineBlocks) {
        let h = Tr(o.state, a.from, a.to) ? i : Or(o.state, a.from, a.to) ? t : null;
        h && l.add(a.from, a.from, h);
      }
      return l.finish();
    }
  }), { domEventHandlers: s } = e;
  return [
    r,
    Ic({
      class: "cm-foldGutter",
      markers(o) {
        var l;
        return ((l = o.plugin(r)) === null || l === void 0 ? void 0 : l.markers) || j.empty;
      },
      initialSpacer() {
        return new As(e, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, s), { click: (o, l, a) => {
        if (s.click && s.click(o, l, a))
          return !0;
        let h = Tr(o.state, l.from, l.to);
        if (h)
          return o.dispatch({ effects: On.of(h) }), !0;
        let c = Or(o.state, l.from, l.to);
        return c ? (o.dispatch({ effects: $r.of(c) }), !0) : !1;
      } })
    }),
    ef()
  ];
}
const jm = /* @__PURE__ */ N.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class Tn {
  constructor(e, t) {
    this.specs = e;
    let i;
    function r(l) {
      let a = jt.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const s = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, o = t.scope;
    this.scope = o instanceof lt ? (l) => l.prop(ki) == o.data : o ? (l) => l == o : void 0, this.style = jc(e.map((l) => ({
      tag: l.tag,
      class: l.class || r(Object.assign({}, l, { tag: null }))
    })), {
      all: s
    }).style, this.module = i ? new jt(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new Tn(e, t || {});
  }
}
const xo = /* @__PURE__ */ F.define(), nf = /* @__PURE__ */ F.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function Ms(n) {
  let e = n.facet(xo);
  return e.length ? e : n.facet(nf);
}
function rf(n, e) {
  let t = [Gm], i;
  return n instanceof Tn && (n.module && t.push(N.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(nf.of(n)) : i ? t.push(xo.computeN([N.darkTheme], (r) => r.facet(N.darkTheme) == (i == "dark") ? [n] : [])) : t.push(xo.of(n)), t;
}
class Um {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = Re(e.state), this.decorations = this.buildDeco(e, Ms(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = Re(e.state), i = Ms(e.state), r = i != Ms(e.startState), { viewport: s } = e.view, o = e.changes.mapPos(this.decoratedTo, 1);
    t.length < s.to && !r && t.type == this.tree.type && o >= s.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = o) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, i), this.decoratedTo = s.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return W.none;
    let i = new Lt();
    for (let { from: r, to: s } of e.visibleRanges)
      pm(this.tree, t, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = W.mark({ class: a })));
      }, r, s);
    return i.finish();
  }
}
const Gm = /* @__PURE__ */ di.high(/* @__PURE__ */ ge.fromClass(Um, {
  decorations: (n) => n.decorations
})), Ym = /* @__PURE__ */ Tn.define([
  {
    tag: p.meta,
    color: "#404740"
  },
  {
    tag: p.link,
    textDecoration: "underline"
  },
  {
    tag: p.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: p.emphasis,
    fontStyle: "italic"
  },
  {
    tag: p.strong,
    fontWeight: "bold"
  },
  {
    tag: p.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: p.keyword,
    color: "#708"
  },
  {
    tag: [p.atom, p.bool, p.url, p.contentSeparator, p.labelName],
    color: "#219"
  },
  {
    tag: [p.literal, p.inserted],
    color: "#164"
  },
  {
    tag: [p.string, p.deleted],
    color: "#a11"
  },
  {
    tag: [p.regexp, p.escape, /* @__PURE__ */ p.special(p.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ p.definition(p.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ p.local(p.variableName),
    color: "#30a"
  },
  {
    tag: [p.typeName, p.namespace],
    color: "#085"
  },
  {
    tag: p.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ p.special(p.variableName), p.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ p.definition(p.propertyName),
    color: "#00c"
  },
  {
    tag: p.comment,
    color: "#940"
  },
  {
    tag: p.invalid,
    color: "#f00"
  }
]), Jm = /* @__PURE__ */ N.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), sf = 1e4, of = "()[]{}", lf = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, {
      afterCursor: !0,
      brackets: of,
      maxScanDistance: sf,
      renderMatch: Qm
    });
  }
}), Xm = /* @__PURE__ */ W.mark({ class: "cm-matchingBracket" }), _m = /* @__PURE__ */ W.mark({ class: "cm-nonmatchingBracket" });
function Qm(n) {
  let e = [], t = n.matched ? Xm : _m;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
const Zm = /* @__PURE__ */ Se.define({
  create() {
    return W.none;
  },
  update(n, e) {
    if (!e.docChanged && !e.selection)
      return n;
    let t = [], i = e.state.facet(lf);
    for (let r of e.state.selection.ranges) {
      if (!r.empty)
        continue;
      let s = wt(e.state, r.head, -1, i) || r.head > 0 && wt(e.state, r.head - 1, 1, i) || i.afterCursor && (wt(e.state, r.head, 1, i) || r.head < e.state.doc.length && wt(e.state, r.head + 1, -1, i));
      s && (t = t.concat(i.renderMatch(s, e.state)));
    }
    return W.set(t, !0);
  },
  provide: (n) => N.decorations.from(n)
}), e0 = [
  Zm,
  Jm
];
function t0(n = {}) {
  return [lf.of(n), e0];
}
const i0 = /* @__PURE__ */ new $();
function vo(n, e, t) {
  let i = n.prop(e < 0 ? $.openedBy : $.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let r = t.indexOf(n.name);
    if (r > -1 && r % 2 == (e < 0 ? 1 : 0))
      return [t[r + e]];
  }
  return null;
}
function wo(n) {
  let e = n.type.prop(i0);
  return e ? e(n.node) : n;
}
function wt(n, e, t, i = {}) {
  let r = i.maxScanDistance || sf, s = i.brackets || of, o = Re(n), l = o.resolveInner(e, t);
  for (let a = l; a; a = a.parent) {
    let h = vo(a.type, t, s);
    if (h && a.from < a.to) {
      let c = wo(a);
      if (c && (t > 0 ? e >= c.from && e < c.to : e > c.from && e <= c.to))
        return n0(n, e, t, a, c, h, s);
    }
  }
  return r0(n, e, t, o, l.type, r, s);
}
function n0(n, e, t, i, r, s, o) {
  let l = i.parent, a = { from: r.from, to: r.to }, h = 0, c = l == null ? void 0 : l.cursor();
  if (c && (t < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
    do
      if (t < 0 ? c.to <= i.from : c.from >= i.to) {
        if (h == 0 && s.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = wo(c);
          return { start: a, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (vo(c.type, t, o))
          h++;
        else if (vo(c.type, -t, o)) {
          if (h == 0) {
            let f = wo(c);
            return {
              start: a,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? c.prevSibling() : c.nextSibling());
  return { start: a, matched: !1 };
}
function r0(n, e, t, i, r, s, o) {
  let l = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, c = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), f = 0;
  for (let d = 0; !c.next().done && d <= s; ) {
    let g = c.value;
    t < 0 && (d += g.length);
    let y = e + d * t;
    for (let b = t > 0 ? 0 : g.length - 1, x = t > 0 ? g.length : -1; b != x; b += t) {
      let k = o.indexOf(g[b]);
      if (!(k < 0 || i.resolveInner(y + b, 1).type != r))
        if (k % 2 == 0 == t > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: y + b, to: y + b + 1 }, matched: k >> 1 == a >> 1 };
          f--;
        }
    }
    t > 0 && (d += g.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
function Na(n, e, t, i = 0, r = 0) {
  e == null && (e = n.search(/[^\s\u00a0]/), e == -1 && (e = n.length));
  let s = r;
  for (let o = i; o < e; o++)
    n.charCodeAt(o) == 9 ? s += t - s % t : s++;
  return s;
}
class af {
  /**
  Create a stream.
  */
  constructor(e, t, i, r) {
    this.string = e, this.tabSize = t, this.indentUnit = i, this.overrideIndent = r, this.pos = 0, this.start = 0, this.lastColumnPos = 0, this.lastColumnValue = 0;
  }
  /**
  True if we are at the end of the line.
  */
  eol() {
    return this.pos >= this.string.length;
  }
  /**
  True if we are at the start of the line.
  */
  sol() {
    return this.pos == 0;
  }
  /**
  Get the next code unit after the current position, or undefined
  if we're at the end of the line.
  */
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  /**
  Read the next code unit and advance `this.pos`.
  */
  next() {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++);
  }
  /**
  Match the next character against the given string, regular
  expression, or predicate. Consume and return it if it matches.
  */
  eat(e) {
    let t = this.string.charAt(this.pos), i;
    if (typeof e == "string" ? i = t == e : i = t && (e instanceof RegExp ? e.test(t) : e(t)), i)
      return ++this.pos, t;
  }
  /**
  Continue matching characters that match the given string,
  regular expression, or predicate function. Return true if any
  characters were consumed.
  */
  eatWhile(e) {
    let t = this.pos;
    for (; this.eat(e); )
      ;
    return this.pos > t;
  }
  /**
  Consume whitespace ahead of `this.pos`. Return true if any was
  found.
  */
  eatSpace() {
    let e = this.pos;
    for (; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
      ++this.pos;
    return this.pos > e;
  }
  /**
  Move to the end of the line.
  */
  skipToEnd() {
    this.pos = this.string.length;
  }
  /**
  Move to directly before the given character, if found on the
  current line.
  */
  skipTo(e) {
    let t = this.string.indexOf(e, this.pos);
    if (t > -1)
      return this.pos = t, !0;
  }
  /**
  Move back `n` characters.
  */
  backUp(e) {
    this.pos -= e;
  }
  /**
  Get the column position at `this.pos`.
  */
  column() {
    return this.lastColumnPos < this.start && (this.lastColumnValue = Na(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
  }
  /**
  Get the indentation column of the current line.
  */
  indentation() {
    var e;
    return (e = this.overrideIndent) !== null && e !== void 0 ? e : Na(this.string, null, this.tabSize);
  }
  /**
  Match the input against the given string or regular expression
  (which should start with a `^`). Return true or the regexp match
  if it matches.
  
  Unless `consume` is set to `false`, this will move `this.pos`
  past the matched text.
  
  When matching a string `caseInsensitive` can be set to true to
  make the match case-insensitive.
  */
  match(e, t, i) {
    if (typeof e == "string") {
      let r = (o) => i ? o.toLowerCase() : o, s = this.string.substr(this.pos, e.length);
      return r(s) == r(e) ? (t !== !1 && (this.pos += e.length), !0) : null;
    } else {
      let r = this.string.slice(this.pos).match(e);
      return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r);
    }
  }
  /**
  Get the current token.
  */
  current() {
    return this.string.slice(this.start, this.pos);
  }
}
function s0(n) {
  return {
    name: n.name || "",
    token: n.token,
    blankLine: n.blankLine || (() => {
    }),
    startState: n.startState || (() => !0),
    copyState: n.copyState || o0,
    indent: n.indent || (() => null),
    languageData: n.languageData || {},
    tokenTable: n.tokenTable || el,
    mergeTokens: n.mergeTokens !== !1
  };
}
function o0(n) {
  if (typeof n != "object")
    return n;
  let e = {};
  for (let t in n) {
    let i = n[t];
    e[t] = i instanceof Array ? i.slice() : i;
  }
  return e;
}
const Ia = /* @__PURE__ */ new WeakMap();
class jr extends lt {
  constructor(e) {
    let t = ym(e.languageData), i = s0(e), r, s = new class extends Kc {
      createParse(o, l, a) {
        return new a0(r, o, l, a);
      }
    }();
    super(t, s, [], e.name), this.topNode = f0(t, this), r = this, this.streamParser = i, this.stateAfter = new $({ perNode: !0 }), this.tokenTable = e.tokenTable ? new uf(i.tokenTable) : c0;
  }
  /**
  Define a stream language.
  */
  static define(e) {
    return new jr(e);
  }
  /**
  @internal
  */
  getIndent(e) {
    let t, { overrideIndentation: i } = e.options;
    i && (t = Ia.get(e.state), t != null && t < e.pos - 1e4 && (t = void 0));
    let r = Zo(this, e.node.tree, e.node.from, e.node.from, t ?? e.pos), s, o;
    if (r ? (o = r.state, s = r.pos + 1) : (o = this.streamParser.startState(e.unit), s = e.node.from), e.pos - s > 1e4)
      return null;
    for (; s < e.pos; ) {
      let a = e.state.doc.lineAt(s), h = Math.min(e.pos, a.to);
      if (a.length) {
        let c = i ? i(a.from) : -1, f = new af(a.text, e.state.tabSize, e.unit, c < 0 ? void 0 : c);
        for (; f.pos < h - a.from; )
          cf(this.streamParser.token, f, o);
      } else
        this.streamParser.blankLine(o, e.unit);
      if (h == e.pos)
        break;
      s = a.to + 1;
    }
    let l = e.lineAt(e.pos);
    return i && t == null && Ia.set(e.state, l.from), this.streamParser.indent(o, /^\s*(.*)/.exec(l.text)[1], e);
  }
  get allowsNesting() {
    return !1;
  }
}
function Zo(n, e, t, i, r) {
  let s = t >= i && t + e.length <= r && e.prop(n.stateAfter);
  if (s)
    return { state: n.streamParser.copyState(s), pos: t + e.length };
  for (let o = e.children.length - 1; o >= 0; o--) {
    let l = e.children[o], a = t + e.positions[o], h = l instanceof ce && a < r && Zo(n, l, a, i, r);
    if (h)
      return h;
  }
  return null;
}
function hf(n, e, t, i, r) {
  if (r && t <= 0 && i >= e.length)
    return e;
  !r && t == 0 && e.type == n.topNode && (r = !0);
  for (let s = e.children.length - 1; s >= 0; s--) {
    let o = e.positions[s], l = e.children[s], a;
    if (o < i && l instanceof ce) {
      if (!(a = hf(n, l, t - o, i - o, r)))
        break;
      return r ? new ce(e.type, e.children.slice(0, s).concat(a), e.positions.slice(0, s + 1), o + a.length) : a;
    }
  }
  return null;
}
function l0(n, e, t, i, r) {
  for (let s of e) {
    let o = s.from + (s.openStart ? 25 : 0), l = s.to - (s.openEnd ? 25 : 0), a = o <= t && l > t && Zo(n, s.tree, 0 - s.offset, t, l), h;
    if (a && a.pos <= i && (h = hf(n, s.tree, t + s.offset, a.pos + s.offset, !1)))
      return { state: a.state, tree: h };
  }
  return { state: n.streamParser.startState(r ? fi(r) : 4), tree: ce.empty };
}
class a0 {
  constructor(e, t, i, r) {
    this.lang = e, this.input = t, this.fragments = i, this.ranges = r, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = r[r.length - 1].to;
    let s = Pi.get(), o = r[0].from, { state: l, tree: a } = l0(e, i, o, this.to, s == null ? void 0 : s.state);
    this.state = l, this.parsedPos = this.chunkStart = o + a.length;
    for (let h = 0; h < a.children.length; h++)
      this.chunks.push(a.children[h]), this.chunkPos.push(a.positions[h]);
    s && this.parsedPos < s.viewport.from - 1e5 && r.some((h) => h.from <= s.viewport.from && h.to >= s.viewport.from) && (this.state = this.lang.streamParser.startState(fi(s.state)), s.skipUntilInView(this.parsedPos, s.viewport.from), this.parsedPos = s.viewport.from), this.moveRangeIndex();
  }
  advance() {
    let e = Pi.get(), t = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt), i = Math.min(
      t,
      this.chunkStart + 2048
      /* C.ChunkSize */
    );
    for (e && (i = Math.min(i, e.viewport.to)); this.parsedPos < i; )
      this.parseLine(e);
    return this.chunkStart < this.parsedPos && this.finishChunk(), this.parsedPos >= t ? this.finish() : e && this.parsedPos >= e.viewport.to ? (e.skipUntilInView(this.parsedPos, t), this.finish()) : null;
  }
  stopAt(e) {
    this.stoppedAt = e;
  }
  lineAfter(e) {
    let t = this.input.chunk(e);
    if (this.input.lineChunks)
      t == `
` && (t = "");
    else {
      let i = t.indexOf(`
`);
      i > -1 && (t = t.slice(0, i));
    }
    return e + t.length <= this.to ? t : t.slice(0, this.to - e);
  }
  nextLine() {
    let e = this.parsedPos, t = this.lineAfter(e), i = e + t.length;
    for (let r = this.rangeIndex; ; ) {
      let s = this.ranges[r].to;
      if (s >= i || (t = t.slice(0, s - (i - t.length)), r++, r == this.ranges.length))
        break;
      let o = this.ranges[r].from, l = this.lineAfter(o);
      t += l, i = o + l.length;
    }
    return { line: t, end: i };
  }
  skipGapsTo(e, t, i) {
    for (; ; ) {
      let r = this.ranges[this.rangeIndex].to, s = e + t;
      if (i > 0 ? r > s : r >= s)
        break;
      let o = this.ranges[++this.rangeIndex].from;
      t += o - r;
    }
    return t;
  }
  moveRangeIndex() {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; )
      this.rangeIndex++;
  }
  emitToken(e, t, i, r) {
    let s = 4;
    if (this.ranges.length > 1) {
      r = this.skipGapsTo(t, r, 1), t += r;
      let l = this.chunk.length;
      r = this.skipGapsTo(i, r, -1), i += r, s += this.chunk.length - l;
    }
    let o = this.chunk.length - 4;
    return this.lang.streamParser.mergeTokens && s == 4 && o >= 0 && this.chunk[o] == e && this.chunk[o + 2] == t ? this.chunk[o + 2] = i : this.chunk.push(e, t, i, s), r;
  }
  parseLine(e) {
    let { line: t, end: i } = this.nextLine(), r = 0, { streamParser: s } = this.lang, o = new af(t, e ? e.state.tabSize : 4, e ? fi(e.state) : 2);
    if (o.eol())
      s.blankLine(this.state, o.indentUnit);
    else
      for (; !o.eol(); ) {
        let l = cf(s.token, o, this.state);
        if (l && (r = this.emitToken(this.lang.tokenTable.resolve(l), this.parsedPos + o.start, this.parsedPos + o.pos, r)), o.start > 1e4)
          break;
      }
    this.parsedPos = i, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
  }
  finishChunk() {
    let e = ce.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: h0,
      topID: 0,
      maxBufferLength: 2048,
      reused: this.chunkReused
    });
    e = new ce(e.type, e.children, e.positions, e.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]), this.chunks.push(e), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
  }
  finish() {
    return new ce(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  }
}
function cf(n, e, t) {
  e.start = e.pos;
  for (let i = 0; i < 10; i++) {
    let r = n(e, t);
    if (e.pos > e.start)
      return r;
  }
  throw new Error("Stream parser failed to advance stream.");
}
const el = /* @__PURE__ */ Object.create(null), vn = [Ye.none], h0 = /* @__PURE__ */ new Uo(vn), Ha = [], Va = /* @__PURE__ */ Object.create(null), ff = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  ff[n] = /* @__PURE__ */ df(el, e);
class uf {
  constructor(e) {
    this.extra = e, this.table = Object.assign(/* @__PURE__ */ Object.create(null), ff);
  }
  resolve(e) {
    return e ? this.table[e] || (this.table[e] = df(this.extra, e)) : 0;
  }
}
const c0 = /* @__PURE__ */ new uf(el);
function Ds(n, e) {
  Ha.indexOf(n) > -1 || (Ha.push(n), console.warn(e));
}
function df(n, e) {
  let t = [];
  for (let l of e.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let c = n[h] || p[h];
      c ? typeof c == "function" ? a.length ? a = a.map(c) : Ds(h, `Modifier ${h} used at start of tag`) : a.length ? Ds(h, `Tag ${h} used as modifier`) : a = Array.isArray(c) ? c : [c] : Ds(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), r = i + " " + t.map((l) => l.id), s = Va[r];
  if (s)
    return s.id;
  let o = Va[r] = Ye.define({
    id: vn.length,
    name: i,
    props: [um({ [i]: t })]
  });
  return vn.push(o), o.id;
}
function f0(n, e) {
  let t = Ye.define({ id: vn.length, name: "Document", props: [
    ki.add(() => n),
    Gc.add(() => (i) => e.getIndent(i))
  ], top: !0 });
  return vn.push(t), t;
}
oe.RTL, oe.LTR;
const u0 = (n) => {
  let { state: e } = n, t = e.doc.lineAt(e.selection.main.from), i = il(n.state, t.from);
  return i.line ? d0(n) : i.block ? g0(n) : !1;
};
function tl(n, e) {
  return ({ state: t, dispatch: i }) => {
    if (t.readOnly)
      return !1;
    let r = n(e, t);
    return r ? (i(t.update(r)), !0) : !1;
  };
}
const d0 = /* @__PURE__ */ tl(
  b0,
  0
  /* CommentOption.Toggle */
), p0 = /* @__PURE__ */ tl(
  pf,
  0
  /* CommentOption.Toggle */
), g0 = /* @__PURE__ */ tl(
  (n, e) => pf(n, e, y0(e)),
  0
  /* CommentOption.Toggle */
);
function il(n, e) {
  let t = n.languageDataAt("commentTokens", e, 1);
  return t.length ? t[0] : {};
}
const Ji = 50;
function m0(n, { open: e, close: t }, i, r) {
  let s = n.sliceDoc(i - Ji, i), o = n.sliceDoc(r, r + Ji), l = /\s*$/.exec(s)[0].length, a = /^\s*/.exec(o)[0].length, h = s.length - l;
  if (s.slice(h - e.length, h) == e && o.slice(a, a + t.length) == t)
    return {
      open: { pos: i - l, margin: l && 1 },
      close: { pos: r + a, margin: a && 1 }
    };
  let c, f;
  r - i <= 2 * Ji ? c = f = n.sliceDoc(i, r) : (c = n.sliceDoc(i, i + Ji), f = n.sliceDoc(r - Ji, r));
  let d = /^\s*/.exec(c)[0].length, g = /\s*$/.exec(f)[0].length, y = f.length - g - t.length;
  return c.slice(d, d + e.length) == e && f.slice(y, y + t.length) == t ? {
    open: {
      pos: i + d + e.length,
      margin: /\s/.test(c.charAt(d + e.length)) ? 1 : 0
    },
    close: {
      pos: r - g - t.length,
      margin: /\s/.test(f.charAt(y - 1)) ? 1 : 0
    }
  } : null;
}
function y0(n) {
  let e = [];
  for (let t of n.selection.ranges) {
    let i = n.doc.lineAt(t.from), r = t.to <= i.to ? i : n.doc.lineAt(t.to);
    r.from > i.from && r.from == t.to && (r = t.to == i.to + 1 ? i : n.doc.lineAt(t.to - 1));
    let s = e.length - 1;
    s >= 0 && e[s].to > i.from ? e[s].to = r.to : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: r.to });
  }
  return e;
}
function pf(n, e, t = e.selection.ranges) {
  let i = t.map((s) => il(e, s.from).block);
  if (!i.every((s) => s))
    return null;
  let r = t.map((s, o) => m0(e, i[o], s.from, s.to));
  if (n != 2 && !r.every((s) => s))
    return { changes: e.changes(t.map((s, o) => r[o] ? [] : [{ from: s.from, insert: i[o].open + " " }, { from: s.to, insert: " " + i[o].close }])) };
  if (n != 1 && r.some((s) => s)) {
    let s = [];
    for (let o = 0, l; o < r.length; o++)
      if (l = r[o]) {
        let a = i[o], { open: h, close: c } = l;
        s.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: c.pos - c.margin, to: c.pos + a.close.length });
      }
    return { changes: s };
  }
  return null;
}
function b0(n, e, t = e.selection.ranges) {
  let i = [], r = -1;
  for (let { from: s, to: o } of t) {
    let l = i.length, a = 1e9, h = il(e, s).line;
    if (h) {
      for (let c = s; c <= o; ) {
        let f = e.doc.lineAt(c);
        if (f.from > r && (s == o || o > f.from)) {
          r = f.from;
          let d = /^\s*/.exec(f.text)[0].length, g = d == f.length, y = f.text.slice(d, d + h.length) == h ? d : -1;
          d < f.text.length && d < a && (a = d), i.push({ line: f, comment: y, token: h, indent: d, empty: g, single: !1 });
        }
        c = f.to + 1;
      }
      if (a < 1e9)
        for (let c = l; c < i.length; c++)
          i[c].indent < i[c].line.text.length && (i[c].indent = a);
      i.length == l + 1 && (i[l].single = !0);
    }
  }
  if (n != 2 && i.some((s) => s.comment < 0 && (!s.empty || s.single))) {
    let s = [];
    for (let { line: l, token: a, indent: h, empty: c, single: f } of i)
      (f || !c) && s.push({ from: l.from + h, insert: a + " " });
    let o = e.changes(s);
    return { changes: o, selection: e.selection.map(o, 1) };
  } else if (n != 1 && i.some((s) => s.comment >= 0)) {
    let s = [];
    for (let { line: o, comment: l, token: a } of i)
      if (l >= 0) {
        let h = o.from + l, c = h + a.length;
        o.text[c - o.from] == " " && c++, s.push({ from: h, to: c });
      }
    return { changes: s };
  }
  return null;
}
const ko = /* @__PURE__ */ Rt.define(), x0 = /* @__PURE__ */ Rt.define(), v0 = /* @__PURE__ */ F.define(), gf = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (i, r) => e(i, r) || t(i, r)
    });
  }
}), mf = /* @__PURE__ */ Se.define({
  create() {
    return kt.empty;
  },
  update(n, e) {
    let t = e.state.facet(gf), i = e.annotation(ko);
    if (i) {
      let a = Ge.fromTransaction(e, i.selection), h = i.side, c = h == 0 ? n.undone : n.done;
      return a ? c = Er(c, c.length, t.minDepth, a) : c = xf(c, e.startState.selection), new kt(h == 0 ? i.rest : c, h == 0 ? c : i.rest);
    }
    let r = e.annotation(x0);
    if ((r == "full" || r == "before") && (n = n.isolate()), e.annotation(ke.addToHistory) === !1)
      return e.changes.empty ? n : n.addMapping(e.changes.desc);
    let s = Ge.fromTransaction(e), o = e.annotation(ke.time), l = e.annotation(ke.userEvent);
    return s ? n = n.addChanges(s, o, l, t, e) : e.selection && (n = n.addSelection(e.startState.selection, o, l, t.newGroupDelay)), (r == "full" || r == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((e) => e.toJSON()), undone: n.undone.map((e) => e.toJSON()) };
  },
  fromJSON(n) {
    return new kt(n.done.map(Ge.fromJSON), n.undone.map(Ge.fromJSON));
  }
});
function w0(n = {}) {
  return [
    mf,
    gf.of(n),
    N.domEventHandlers({
      beforeinput(e, t) {
        let i = e.inputType == "historyUndo" ? yf : e.inputType == "historyRedo" ? So : null;
        return i ? (e.preventDefault(), i(t)) : !1;
      }
    })
  ];
}
function Ur(n, e) {
  return function({ state: t, dispatch: i }) {
    if (!e && t.readOnly)
      return !1;
    let r = t.field(mf, !1);
    if (!r)
      return !1;
    let s = r.pop(n, t, e);
    return s ? (i(s), !0) : !1;
  };
}
const yf = /* @__PURE__ */ Ur(0, !1), So = /* @__PURE__ */ Ur(1, !1), k0 = /* @__PURE__ */ Ur(0, !0), S0 = /* @__PURE__ */ Ur(1, !0);
class Ge {
  constructor(e, t, i, r, s) {
    this.changes = e, this.effects = t, this.mapped = i, this.startSelection = r, this.selectionsAfter = s;
  }
  setSelAfter(e) {
    return new Ge(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, i;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((r) => r.toJSON())
    };
  }
  static fromJSON(e) {
    return new Ge(e.changes && we.fromJSON(e.changes), [], e.mapped && Ct.fromJSON(e.mapped), e.startSelection && M.fromJSON(e.startSelection), e.selectionsAfter.map(M.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let i = et;
    for (let r of e.startState.facet(v0)) {
      let s = r(e);
      s.length && (i = i.concat(s));
    }
    return !i.length && e.changes.empty ? null : new Ge(e.changes.invert(e.startState.doc), i, void 0, t || e.startState.selection, et);
  }
  static selection(e) {
    return new Ge(void 0, et, void 0, void 0, e);
  }
}
function Er(n, e, t, i) {
  let r = e + 1 > t + 20 ? e - t - 1 : 0, s = n.slice(r, e);
  return s.push(i), s;
}
function C0(n, e) {
  let t = [], i = !1;
  return n.iterChangedRanges((r, s) => t.push(r, s)), e.iterChangedRanges((r, s, o, l) => {
    for (let a = 0; a < t.length; ) {
      let h = t[a++], c = t[a++];
      l >= h && o <= c && (i = !0);
    }
  }), i;
}
function A0(n, e) {
  return n.ranges.length == e.ranges.length && n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0;
}
function bf(n, e) {
  return n.length ? e.length ? n.concat(e) : n : e;
}
const et = [], M0 = 200;
function xf(n, e) {
  if (n.length) {
    let t = n[n.length - 1], i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - M0));
    return i.length && i[i.length - 1].eq(e) ? n : (i.push(e), Er(n, n.length - 1, 1e9, t.setSelAfter(i)));
  } else
    return [Ge.selection([e])];
}
function D0(n) {
  let e = n[n.length - 1], t = n.slice();
  return t[n.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function Os(n, e) {
  if (!n.length)
    return n;
  let t = n.length, i = et;
  for (; t; ) {
    let r = O0(n[t - 1], e, i);
    if (r.changes && !r.changes.empty || r.effects.length) {
      let s = n.slice(0, t);
      return s[t - 1] = r, s;
    } else
      e = r.mapped, t--, i = r.selectionsAfter;
  }
  return i.length ? [Ge.selection(i)] : et;
}
function O0(n, e, t) {
  let i = bf(n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(e)) : et, t);
  if (!n.changes)
    return Ge.selection(i);
  let r = n.changes.map(e), s = e.mapDesc(n.changes, !0), o = n.mapped ? n.mapped.composeDesc(s) : s;
  return new Ge(r, z.mapEffects(n.effects, e), o, n.startSelection.map(s), i);
}
const T0 = /^(input\.type|delete)($|\.)/;
class kt {
  constructor(e, t, i = 0, r = void 0) {
    this.done = e, this.undone = t, this.prevTime = i, this.prevUserEvent = r;
  }
  isolate() {
    return this.prevTime ? new kt(this.done, this.undone) : this;
  }
  addChanges(e, t, i, r, s) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && e.changes && (!i || T0.test(i)) && (!l.selectionsAfter.length && t - this.prevTime < r.newGroupDelay && r.joinToEvent(s, C0(l.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? o = Er(o, o.length - 1, r.minDepth, new Ge(e.changes.compose(l.changes), bf(z.mapEffects(e.effects, l.changes), l.effects), l.mapped, l.startSelection, et)) : o = Er(o, o.length, r.minDepth, e), new kt(o, et, t, i);
  }
  addSelection(e, t, i, r) {
    let s = this.done.length ? this.done[this.done.length - 1].selectionsAfter : et;
    return s.length > 0 && t - this.prevTime < r && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && A0(s[s.length - 1], e) ? this : new kt(xf(this.done, e), this.undone, t, i);
  }
  addMapping(e) {
    return new kt(Os(this.done, e), Os(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, i) {
    let r = e == 0 ? this.done : this.undone;
    if (r.length == 0)
      return null;
    let s = r[r.length - 1], o = s.selectionsAfter[0] || t.selection;
    if (i && s.selectionsAfter.length)
      return t.update({
        selection: s.selectionsAfter[s.selectionsAfter.length - 1],
        annotations: ko.of({ side: e, rest: D0(r), selection: o }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (s.changes) {
      let l = r.length == 1 ? et : r.slice(0, r.length - 1);
      return s.mapped && (l = Os(l, s.mapped)), t.update({
        changes: s.changes,
        selection: s.startSelection,
        effects: s.effects,
        annotations: ko.of({ side: e, rest: l, selection: o }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
kt.empty = /* @__PURE__ */ new kt(et, et);
const E0 = [
  { key: "Mod-z", run: yf, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: So, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: So, preventDefault: !0 },
  { key: "Mod-u", run: k0, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: S0, preventDefault: !0 }
];
function Vi(n, e) {
  return M.create(n.ranges.map(e), n.mainIndex);
}
function Dt(n, e) {
  return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function ft({ state: n, dispatch: e }, t) {
  let i = Vi(n.selection, t);
  return i.eq(n.selection, !0) ? !1 : (e(Dt(n, i)), !0);
}
function Gr(n, e) {
  return M.cursor(e ? n.to : n.from);
}
function vf(n, e) {
  return ft(n, (t) => t.empty ? n.moveByChar(t, e) : Gr(t, e));
}
function Fe(n) {
  return n.textDirectionAt(n.state.selection.main.head) == oe.LTR;
}
const wf = (n) => vf(n, !Fe(n)), kf = (n) => vf(n, Fe(n));
function Sf(n, e) {
  return ft(n, (t) => t.empty ? n.moveByGroup(t, e) : Gr(t, e));
}
const B0 = (n) => Sf(n, !Fe(n)), L0 = (n) => Sf(n, Fe(n));
function P0(n, e, t) {
  if (e.type.prop(t))
    return !0;
  let i = e.to - e.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to))) || e.firstChild;
}
function Yr(n, e, t) {
  let i = Re(n).resolveInner(e.head), r = t ? $.closedBy : $.openedBy;
  for (let a = e.head; ; ) {
    let h = t ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    P0(n, h, r) ? i = h : a = t ? h.to : h.from;
  }
  let s = i.type.prop(r), o, l;
  return s && (o = t ? wt(n, i.from, 1) : wt(n, i.to, -1)) && o.matched ? l = t ? o.end.to : o.end.from : l = t ? i.to : i.from, M.cursor(l, t ? -1 : 1);
}
const R0 = (n) => ft(n, (e) => Yr(n.state, e, !Fe(n))), F0 = (n) => ft(n, (e) => Yr(n.state, e, Fe(n)));
function Cf(n, e) {
  return ft(n, (t) => {
    if (!t.empty)
      return Gr(t, e);
    let i = n.moveVertically(t, e);
    return i.head != t.head ? i : n.moveToLineBoundary(t, e);
  });
}
const Af = (n) => Cf(n, !1), Mf = (n) => Cf(n, !0);
function Df(n) {
  let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, t = 0, i = 0, r;
  if (e) {
    for (let s of n.state.facet(N.scrollMargins)) {
      let o = s(n);
      o != null && o.top && (t = Math.max(o == null ? void 0 : o.top, t)), o != null && o.bottom && (i = Math.max(o == null ? void 0 : o.bottom, i));
    }
    r = n.scrollDOM.clientHeight - t - i;
  } else
    r = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: i,
    selfScroll: e,
    height: Math.max(n.defaultLineHeight, r - 5)
  };
}
function Of(n, e) {
  let t = Df(n), { state: i } = n, r = Vi(i.selection, (o) => o.empty ? n.moveVertically(o, e, t.height) : Gr(o, e));
  if (r.eq(i.selection))
    return !1;
  let s;
  if (t.selfScroll) {
    let o = n.coordsAtPos(i.selection.main.head), l = n.scrollDOM.getBoundingClientRect(), a = l.top + t.marginTop, h = l.bottom - t.marginBottom;
    o && o.top > a && o.bottom < h && (s = N.scrollIntoView(r.main.head, { y: "start", yMargin: o.top - a }));
  }
  return n.dispatch(Dt(i, r), { effects: s }), !0;
}
const Wa = (n) => Of(n, !1), Co = (n) => Of(n, !0);
function _t(n, e, t) {
  let i = n.lineBlockAt(e.head), r = n.moveToLineBoundary(e, t);
  if (r.head == e.head && r.head != (t ? i.to : i.from) && (r = n.moveToLineBoundary(e, t, !1)), !t && r.head == i.from && i.length) {
    let s = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    s && e.head != i.from + s && (r = M.cursor(i.from + s));
  }
  return r;
}
const N0 = (n) => ft(n, (e) => _t(n, e, !0)), I0 = (n) => ft(n, (e) => _t(n, e, !1)), H0 = (n) => ft(n, (e) => _t(n, e, !Fe(n))), V0 = (n) => ft(n, (e) => _t(n, e, Fe(n))), W0 = (n) => ft(n, (e) => M.cursor(n.lineBlockAt(e.head).from, 1)), z0 = (n) => ft(n, (e) => M.cursor(n.lineBlockAt(e.head).to, -1));
function q0(n, e, t) {
  let i = !1, r = Vi(n.selection, (s) => {
    let o = wt(n, s.head, -1) || wt(n, s.head, 1) || s.head > 0 && wt(n, s.head - 1, 1) || s.head < n.doc.length && wt(n, s.head + 1, -1);
    if (!o || !o.end)
      return s;
    i = !0;
    let l = o.start.from == s.head ? o.end.to : o.end.from;
    return M.cursor(l);
  });
  return i ? (e(Dt(n, r)), !0) : !1;
}
const K0 = ({ state: n, dispatch: e }) => q0(n, e);
function st(n, e) {
  let t = Vi(n.state.selection, (i) => {
    let r = e(i);
    return M.range(i.anchor, r.head, r.goalColumn, r.bidiLevel || void 0);
  });
  return t.eq(n.state.selection) ? !1 : (n.dispatch(Dt(n.state, t)), !0);
}
function Tf(n, e) {
  return st(n, (t) => n.moveByChar(t, e));
}
const Ef = (n) => Tf(n, !Fe(n)), Bf = (n) => Tf(n, Fe(n));
function Lf(n, e) {
  return st(n, (t) => n.moveByGroup(t, e));
}
const $0 = (n) => Lf(n, !Fe(n)), j0 = (n) => Lf(n, Fe(n)), U0 = (n) => st(n, (e) => Yr(n.state, e, !Fe(n))), G0 = (n) => st(n, (e) => Yr(n.state, e, Fe(n)));
function Pf(n, e) {
  return st(n, (t) => n.moveVertically(t, e));
}
const Rf = (n) => Pf(n, !1), Ff = (n) => Pf(n, !0);
function Nf(n, e) {
  return st(n, (t) => n.moveVertically(t, e, Df(n).height));
}
const za = (n) => Nf(n, !1), qa = (n) => Nf(n, !0), Y0 = (n) => st(n, (e) => _t(n, e, !0)), J0 = (n) => st(n, (e) => _t(n, e, !1)), X0 = (n) => st(n, (e) => _t(n, e, !Fe(n))), _0 = (n) => st(n, (e) => _t(n, e, Fe(n))), Q0 = (n) => st(n, (e) => M.cursor(n.lineBlockAt(e.head).from)), Z0 = (n) => st(n, (e) => M.cursor(n.lineBlockAt(e.head).to)), Ka = ({ state: n, dispatch: e }) => (e(Dt(n, { anchor: 0 })), !0), $a = ({ state: n, dispatch: e }) => (e(Dt(n, { anchor: n.doc.length })), !0), ja = ({ state: n, dispatch: e }) => (e(Dt(n, { anchor: n.selection.main.anchor, head: 0 })), !0), Ua = ({ state: n, dispatch: e }) => (e(Dt(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), ey = ({ state: n, dispatch: e }) => (e(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), ty = ({ state: n, dispatch: e }) => {
  let t = Jr(n).map(({ from: i, to: r }) => M.range(i, Math.min(r + 1, n.doc.length)));
  return e(n.update({ selection: M.create(t), userEvent: "select" })), !0;
}, iy = ({ state: n, dispatch: e }) => {
  let t = Vi(n.selection, (i) => {
    let r = Re(n), s = r.resolveStack(i.from, 1);
    if (i.empty) {
      let o = r.resolveStack(i.from, -1);
      o.node.from >= s.node.from && o.node.to <= s.node.to && (s = o);
    }
    for (let o = s; o; o = o.next) {
      let { node: l } = o;
      if ((l.from < i.from && l.to >= i.to || l.to > i.to && l.from <= i.from) && o.next)
        return M.range(l.to, l.from);
    }
    return i;
  });
  return t.eq(n.selection) ? !1 : (e(Dt(n, t)), !0);
}, ny = ({ state: n, dispatch: e }) => {
  let t = n.selection, i = null;
  return t.ranges.length > 1 ? i = M.create([t.main]) : t.main.empty || (i = M.create([M.cursor(t.main.head)])), i ? (e(Dt(n, i)), !0) : !1;
};
function En(n, e) {
  if (n.state.readOnly)
    return !1;
  let t = "delete.selection", { state: i } = n, r = i.changeByRange((s) => {
    let { from: o, to: l } = s;
    if (o == l) {
      let a = e(s);
      a < o ? (t = "delete.backward", a = tr(n, a, !1)) : a > o && (t = "delete.forward", a = tr(n, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = tr(n, o, !1), l = tr(n, l, !0);
    return o == l ? { range: s } : { changes: { from: o, to: l }, range: M.cursor(o, o < s.head ? -1 : 1) };
  });
  return r.changes.empty ? !1 : (n.dispatch(i.update(r, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? N.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function tr(n, e, t) {
  if (n instanceof N)
    for (let i of n.state.facet(N.atomicRanges).map((r) => r(n)))
      i.between(e, e, (r, s) => {
        r < e && s > e && (e = t ? s : r);
      });
  return e;
}
const If = (n, e, t) => En(n, (i) => {
  let r = i.from, { state: s } = n, o = s.doc.lineAt(r), l, a;
  if (t && !e && r > o.from && r < o.from + 200 && !/[^ \t]/.test(l = o.text.slice(0, r - o.from))) {
    if (l[l.length - 1] == "	")
      return r - 1;
    let h = Hi(l, s.tabSize), c = h % fi(s) || fi(s);
    for (let f = 0; f < c && l[l.length - 1 - f] == " "; f++)
      r--;
    a = r;
  } else
    a = Ee(o.text, r - o.from, e, e) + o.from, a == r && o.number != (e ? s.doc.lines : 1) ? a += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(o.text.slice(a - o.from, r - o.from)) && (a = Ee(o.text, a - o.from, !1, !1) + o.from);
  return a;
}), Ao = (n) => If(n, !1, !0), Hf = (n) => If(n, !0, !1), Vf = (n, e) => En(n, (t) => {
  let i = t.head, { state: r } = n, s = r.doc.lineAt(i), o = r.charCategorizer(i);
  for (let l = null; ; ) {
    if (i == (e ? s.to : s.from)) {
      i == t.head && s.number != (e ? r.doc.lines : 1) && (i += e ? 1 : -1);
      break;
    }
    let a = Ee(s.text, i - s.from, e) + s.from, h = s.text.slice(Math.min(i, a) - s.from, Math.max(i, a) - s.from), c = o(h);
    if (l != null && c != l)
      break;
    (h != " " || i != t.head) && (l = c), i = a;
  }
  return i;
}), Wf = (n) => Vf(n, !1), ry = (n) => Vf(n, !0), sy = (n) => En(n, (e) => {
  let t = n.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), oy = (n) => En(n, (e) => {
  let t = n.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), ly = (n) => En(n, (e) => {
  let t = n.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), ay = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: J.of(["", ""]) },
    range: M.cursor(i.from)
  }));
  return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, hy = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let r = i.from, s = n.doc.lineAt(r), o = r == s.from ? r - 1 : Ee(s.text, r - s.from, !1) + s.from, l = r == s.to ? r + 1 : Ee(s.text, r - s.from, !0) + s.from;
    return {
      changes: { from: o, to: l, insert: n.doc.slice(r, l).append(n.doc.slice(o, r)) },
      range: M.cursor(l)
    };
  });
  return t.changes.empty ? !1 : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function Jr(n) {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.from), s = n.doc.lineAt(i.to);
    if (!i.empty && i.to == s.from && (s = n.doc.lineAt(i.to - 1)), t >= r.number) {
      let o = e[e.length - 1];
      o.to = s.to, o.ranges.push(i);
    } else
      e.push({ from: r.from, to: s.to, ranges: [i] });
    t = s.number + 1;
  }
  return e;
}
function zf(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [], r = [];
  for (let s of Jr(n)) {
    if (t ? s.to == n.doc.length : s.from == 0)
      continue;
    let o = n.doc.lineAt(t ? s.to + 1 : s.from - 1), l = o.length + 1;
    if (t) {
      i.push({ from: s.to, to: o.to }, { from: s.from, insert: o.text + n.lineBreak });
      for (let a of s.ranges)
        r.push(M.range(Math.min(n.doc.length, a.anchor + l), Math.min(n.doc.length, a.head + l)));
    } else {
      i.push({ from: o.from, to: s.from }, { from: s.to, insert: n.lineBreak + o.text });
      for (let a of s.ranges)
        r.push(M.range(a.anchor - l, a.head - l));
    }
  }
  return i.length ? (e(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: M.create(r, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const cy = ({ state: n, dispatch: e }) => zf(n, e, !1), fy = ({ state: n, dispatch: e }) => zf(n, e, !0);
function qf(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let r of Jr(n))
    t ? i.push({ from: r.from, insert: n.doc.slice(r.from, r.to) + n.lineBreak }) : i.push({ from: r.to, insert: n.lineBreak + n.doc.slice(r.from, r.to) });
  return e(n.update({ changes: i, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const uy = ({ state: n, dispatch: e }) => qf(n, e, !1), dy = ({ state: n, dispatch: e }) => qf(n, e, !0), py = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: e } = n, t = e.changes(Jr(e).map(({ from: r, to: s }) => (r > 0 ? r-- : s < e.doc.length && s++, { from: r, to: s }))), i = Vi(e.selection, (r) => {
    let s;
    if (n.lineWrapping) {
      let o = n.lineBlockAt(r.head), l = n.coordsAtPos(r.head, r.assoc || 1);
      l && (s = o.bottom + n.documentTop - l.bottom + n.defaultLineHeight / 2);
    }
    return n.moveVertically(r, !0, s);
  }).map(t);
  return n.dispatch({ changes: t, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function gy(n, e) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = Re(n).resolveInner(e), i = t.childBefore(e), r = t.childAfter(e), s;
  return i && r && i.to <= e && r.from >= e && (s = i.type.prop($.closedBy)) && s.indexOf(r.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(r.from).from && !/\S/.test(n.sliceDoc(i.to, r.from)) ? { from: i.to, to: r.from } : null;
}
const Ga = /* @__PURE__ */ Kf(!1), my = /* @__PURE__ */ Kf(!0);
function Kf(n) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let i = e.changeByRange((r) => {
      let { from: s, to: o } = r, l = e.doc.lineAt(s), a = !n && s == o && gy(e, s);
      n && (s = o = (o <= l.to ? l : e.doc.lineAt(o)).to);
      let h = new Kr(e, { simulateBreak: s, simulateDoubleBreak: !!a }), c = _o(h, s);
      for (c == null && (c = Hi(/^\s*/.exec(e.doc.lineAt(s).text)[0], e.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: s, to: o } = a : s > l.from && s < l.from + 100 && !/\S/.test(l.text.slice(0, s)) && (s = l.from);
      let f = ["", xn(e, c)];
      return a && f.push(xn(e, h.lineIndent(l.from, -1))), {
        changes: { from: s, to: o, insert: J.of(f) },
        range: M.cursor(s + 1 + f[1].length)
      };
    });
    return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function nl(n, e) {
  let t = -1;
  return n.changeByRange((i) => {
    let r = [];
    for (let o = i.from; o <= i.to; ) {
      let l = n.doc.lineAt(o);
      l.number > t && (i.empty || i.to > l.from) && (e(l, r, i), t = l.number), o = l.to + 1;
    }
    let s = n.changes(r);
    return {
      changes: r,
      range: M.range(s.mapPos(i.anchor, 1), s.mapPos(i.head, 1))
    };
  });
}
const yy = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), i = new Kr(n, { overrideIndentation: (s) => {
    let o = t[s];
    return o ?? -1;
  } }), r = nl(n, (s, o, l) => {
    let a = _o(i, s.from);
    if (a == null)
      return;
    /\S/.test(s.text) || (a = 0);
    let h = /^\s*/.exec(s.text)[0], c = xn(n, a);
    (h != c || l.from < s.from + h.length) && (t[s.from] = a, o.push({ from: s.from, to: s.from + h.length, insert: c }));
  });
  return r.changes.empty || e(n.update(r, { userEvent: "indent" })), !0;
}, by = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(nl(n, (t, i) => {
  i.push({ from: t.from, insert: n.facet(Xo) });
}), { userEvent: "input.indent" })), !0), xy = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(nl(n, (t, i) => {
  let r = /^\s*/.exec(t.text)[0];
  if (!r)
    return;
  let s = Hi(r, n.tabSize), o = 0, l = xn(n, Math.max(0, s - fi(n)));
  for (; o < r.length && o < l.length && r.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  i.push({ from: t.from + o, to: t.from + r.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), vy = (n) => (n.setTabFocusMode(), !0), wy = [
  { key: "Ctrl-b", run: wf, shift: Ef, preventDefault: !0 },
  { key: "Ctrl-f", run: kf, shift: Bf },
  { key: "Ctrl-p", run: Af, shift: Rf },
  { key: "Ctrl-n", run: Mf, shift: Ff },
  { key: "Ctrl-a", run: W0, shift: Q0 },
  { key: "Ctrl-e", run: z0, shift: Z0 },
  { key: "Ctrl-d", run: Hf },
  { key: "Ctrl-h", run: Ao },
  { key: "Ctrl-k", run: sy },
  { key: "Ctrl-Alt-h", run: Wf },
  { key: "Ctrl-o", run: ay },
  { key: "Ctrl-t", run: hy },
  { key: "Ctrl-v", run: Co }
], ky = /* @__PURE__ */ [
  { key: "ArrowLeft", run: wf, shift: Ef, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: B0, shift: $0, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: H0, shift: X0, preventDefault: !0 },
  { key: "ArrowRight", run: kf, shift: Bf, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: L0, shift: j0, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: V0, shift: _0, preventDefault: !0 },
  { key: "ArrowUp", run: Af, shift: Rf, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: Ka, shift: ja },
  { mac: "Ctrl-ArrowUp", run: Wa, shift: za },
  { key: "ArrowDown", run: Mf, shift: Ff, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: $a, shift: Ua },
  { mac: "Ctrl-ArrowDown", run: Co, shift: qa },
  { key: "PageUp", run: Wa, shift: za },
  { key: "PageDown", run: Co, shift: qa },
  { key: "Home", run: I0, shift: J0, preventDefault: !0 },
  { key: "Mod-Home", run: Ka, shift: ja },
  { key: "End", run: N0, shift: Y0, preventDefault: !0 },
  { key: "Mod-End", run: $a, shift: Ua },
  { key: "Enter", run: Ga, shift: Ga },
  { key: "Mod-a", run: ey },
  { key: "Backspace", run: Ao, shift: Ao },
  { key: "Delete", run: Hf },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: Wf },
  { key: "Mod-Delete", mac: "Alt-Delete", run: ry },
  { mac: "Mod-Backspace", run: oy },
  { mac: "Mod-Delete", run: ly }
].concat(/* @__PURE__ */ wy.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), Sy = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: R0, shift: U0 },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: F0, shift: G0 },
  { key: "Alt-ArrowUp", run: cy },
  { key: "Shift-Alt-ArrowUp", run: uy },
  { key: "Alt-ArrowDown", run: fy },
  { key: "Shift-Alt-ArrowDown", run: dy },
  { key: "Escape", run: ny },
  { key: "Mod-Enter", run: my },
  { key: "Alt-l", mac: "Ctrl-l", run: ty },
  { key: "Mod-i", run: iy, preventDefault: !0 },
  { key: "Mod-[", run: xy },
  { key: "Mod-]", run: by },
  { key: "Mod-Alt-\\", run: yy },
  { key: "Shift-Mod-k", run: py },
  { key: "Shift-Mod-\\", run: K0 },
  { key: "Mod-/", run: u0 },
  { key: "Alt-A", run: p0 },
  { key: "Ctrl-m", mac: "Shift-Alt-m", run: vy }
].concat(ky);
function te() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i)) {
      var r = t[i];
      typeof r == "string" ? n.setAttribute(i, r) : r != null && (n[i] = r);
    }
    e++;
  }
  for (; e < arguments.length; e++) $f(n, arguments[e]);
  return n;
}
function $f(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null) if (e.nodeType != null)
    n.appendChild(e);
  else if (Array.isArray(e))
    for (var t = 0; t < e.length; t++) $f(n, e[t]);
  else
    throw new RangeError("Unsupported child node: " + e);
}
const Ya = typeof String.prototype.normalize == "function" ? (n) => n.normalize("NFKD") : (n) => n;
class Fi {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, t, i = 0, r = e.length, s, o) {
    this.test = o, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(i, r), this.bufferStart = i, this.normalize = s ? (l) => s(Ya(l)) : Ya, this.query = this.normalize(t);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return $e(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let t = Eo(e), i = this.bufferStart + this.bufferPos;
      this.bufferPos += xt(e);
      let r = this.normalize(t);
      if (r.length)
        for (let s = 0, o = i; ; s++) {
          let l = r.charCodeAt(s), a = this.match(l, o, this.bufferPos + this.bufferStart);
          if (s == r.length - 1) {
            if (a)
              return this.value = a, this;
            break;
          }
          o == i && s < t.length && t.charCodeAt(s) == l && o++;
        }
    }
  }
  match(e, t, i) {
    let r = null;
    for (let s = 0; s < this.matches.length; s += 2) {
      let o = this.matches[s], l = !1;
      this.query.charCodeAt(o) == e && (o == this.query.length - 1 ? r = { from: this.matches[s + 1], to: i } : (this.matches[s]++, l = !0)), l || (this.matches.splice(s, 2), s -= 2);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? r = { from: t, to: i } : this.matches.push(1, t)), r && this.test && !this.test(r.from, r.to, this.buffer, this.bufferStart) && (r = null), r;
  }
}
typeof Symbol < "u" && (Fi.prototype[Symbol.iterator] = function() {
  return this;
});
const jf = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, rl = "gm" + (/x/.unicode == null ? "" : "u");
class Uf {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, t, i, r = 0, s = e.length) {
    if (this.text = e, this.to = s, this.curLine = "", this.done = !1, this.value = jf, /\\[sWDnr]|\n|\r|\[\^/.test(t))
      return new Gf(e, t, i, r, s);
    this.re = new RegExp(t, rl + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.iter = e.iter();
    let o = e.lineAt(r);
    this.curLineStart = o.from, this.matchPos = Br(e, r), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let t = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (t) {
        let i = this.curLineStart + t.index, r = i + t[0].length;
        if (this.matchPos = Br(this.text, r + (i == r ? 1 : 0)), i == this.curLineStart + this.curLine.length && this.nextLine(), (i < r || i > this.value.to) && (!this.test || this.test(i, r, t)))
          return this.value = { from: i, to: r, match: t }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const Ts = /* @__PURE__ */ new WeakMap();
class Di {
  constructor(e, t) {
    this.from = e, this.text = t;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, t, i) {
    let r = Ts.get(e);
    if (!r || r.from >= i || r.to <= t) {
      let l = new Di(t, e.sliceString(t, i));
      return Ts.set(e, l), l;
    }
    if (r.from == t && r.to == i)
      return r;
    let { text: s, from: o } = r;
    return o > t && (s = e.sliceString(t, o) + s, o = t), r.to < i && (s += e.sliceString(r.to, i)), Ts.set(e, new Di(o, s)), new Di(t, s.slice(t - o, i - o));
  }
}
class Gf {
  constructor(e, t, i, r, s) {
    this.text = e, this.to = s, this.done = !1, this.value = jf, this.matchPos = Br(e, r), this.re = new RegExp(t, rl + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.flat = Di.get(e, r, this.chunkEnd(
      r + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, t = this.re.exec(this.flat.text);
      if (t && !t[0] && t.index == e && (this.re.lastIndex = e + 1, t = this.re.exec(this.flat.text)), t) {
        let i = this.flat.from + t.index, r = i + t[0].length;
        if ((this.flat.to >= this.to || t.index + t[0].length <= this.flat.text.length - 10) && (!this.test || this.test(i, r, t)))
          return this.value = { from: i, to: r, match: t }, this.matchPos = Br(this.text, r + (i == r ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = Di.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (Uf.prototype[Symbol.iterator] = Gf.prototype[Symbol.iterator] = function() {
  return this;
});
function Cy(n) {
  try {
    return new RegExp(n, rl), !0;
  } catch {
    return !1;
  }
}
function Br(n, e) {
  if (e >= n.length)
    return e;
  let t = n.lineAt(e), i;
  for (; e < t.to && (i = t.text.charCodeAt(e - t.from)) >= 56320 && i < 57344; )
    e++;
  return e;
}
function Mo(n) {
  let e = String(n.state.doc.lineAt(n.state.selection.main.head).number), t = te("input", { class: "cm-textfield", name: "line", value: e }), i = te("form", {
    class: "cm-gotoLine",
    onkeydown: (s) => {
      s.keyCode == 27 ? (s.preventDefault(), n.dispatch({ effects: an.of(!1) }), n.focus()) : s.keyCode == 13 && (s.preventDefault(), r());
    },
    onsubmit: (s) => {
      s.preventDefault(), r();
    }
  }, te("label", n.state.phrase("Go to line"), ": ", t), " ", te("button", { class: "cm-button", type: "submit" }, n.state.phrase("go")), te("button", {
    name: "close",
    onclick: () => {
      n.dispatch({ effects: an.of(!1) }), n.focus();
    },
    "aria-label": n.state.phrase("close"),
    type: "button"
  }, ["×"]));
  function r() {
    let s = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);
    if (!s)
      return;
    let { state: o } = n, l = o.doc.lineAt(o.selection.main.head), [, a, h, c, f] = s, d = c ? +c.slice(1) : 0, g = h ? +h : l.number;
    if (h && f) {
      let x = g / 100;
      a && (x = x * (a == "-" ? -1 : 1) + l.number / o.doc.lines), g = Math.round(o.doc.lines * x);
    } else h && a && (g = g * (a == "-" ? -1 : 1) + l.number);
    let y = o.doc.line(Math.max(1, Math.min(o.doc.lines, g))), b = M.cursor(y.from + Math.max(0, Math.min(d, y.length)));
    n.dispatch({
      effects: [an.of(!1), N.scrollIntoView(b.from, { y: "center" })],
      selection: b
    }), n.focus();
  }
  return { dom: i };
}
const an = /* @__PURE__ */ z.define(), Ja = /* @__PURE__ */ Se.define({
  create() {
    return !0;
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(an) && (n = t.value);
    return n;
  },
  provide: (n) => yn.from(n, (e) => e ? Mo : null)
}), Ay = (n) => {
  let e = mn(n, Mo);
  if (!e) {
    let t = [an.of(!0)];
    n.state.field(Ja, !1) == null && t.push(z.appendConfig.of([Ja, My])), n.dispatch({ effects: t }), e = mn(n, Mo);
  }
  return e && e.dom.querySelector("input").select(), !0;
}, My = /* @__PURE__ */ N.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    position: "relative",
    "& label": { fontSize: "80%" },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      bottom: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: "0"
    }
  }
}), Dy = {
  highlightWordAroundCursor: !1,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: !1
}, Oy = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, Dy, {
      highlightWordAroundCursor: (e, t) => e || t,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function Ty(n) {
  return [Ry, Py];
}
const Ey = /* @__PURE__ */ W.mark({ class: "cm-selectionMatch" }), By = /* @__PURE__ */ W.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function Xa(n, e, t, i) {
  return (t == 0 || n(e.sliceDoc(t - 1, t)) != ae.Word) && (i == e.doc.length || n(e.sliceDoc(i, i + 1)) != ae.Word);
}
function Ly(n, e, t, i) {
  return n(e.sliceDoc(t, t + 1)) == ae.Word && n(e.sliceDoc(i - 1, i)) == ae.Word;
}
const Py = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.selectionSet || n.docChanged || n.viewportChanged) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = n.state.facet(Oy), { state: t } = n, i = t.selection;
    if (i.ranges.length > 1)
      return W.none;
    let r = i.main, s, o = null;
    if (r.empty) {
      if (!e.highlightWordAroundCursor)
        return W.none;
      let a = t.wordAt(r.head);
      if (!a)
        return W.none;
      o = t.charCategorizer(r.head), s = t.sliceDoc(a.from, a.to);
    } else {
      let a = r.to - r.from;
      if (a < e.minSelectionLength || a > 200)
        return W.none;
      if (e.wholeWords) {
        if (s = t.sliceDoc(r.from, r.to), o = t.charCategorizer(r.head), !(Xa(o, t, r.from, r.to) && Ly(o, t, r.from, r.to)))
          return W.none;
      } else if (s = t.sliceDoc(r.from, r.to), !s)
        return W.none;
    }
    let l = [];
    for (let a of n.visibleRanges) {
      let h = new Fi(t.doc, s, a.from, a.to);
      for (; !h.next().done; ) {
        let { from: c, to: f } = h.value;
        if ((!o || Xa(o, t, c, f)) && (r.empty && c <= r.from && f >= r.to ? l.push(By.range(c, f)) : (c >= r.to || f <= r.from) && l.push(Ey.range(c, f)), l.length > e.maxMatches))
          return W.none;
      }
    }
    return W.set(l);
  }
}, {
  decorations: (n) => n.decorations
}), Ry = /* @__PURE__ */ N.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
}), Fy = ({ state: n, dispatch: e }) => {
  let { selection: t } = n, i = M.create(t.ranges.map((r) => n.wordAt(r.head) || M.cursor(r.head)), t.mainIndex);
  return i.eq(t) ? !1 : (e(n.update({ selection: i })), !0);
};
function Ny(n, e) {
  let { main: t, ranges: i } = n.selection, r = n.wordAt(t.head), s = r && r.from == t.from && r.to == t.to;
  for (let o = !1, l = new Fi(n.doc, e, i[i.length - 1].to); ; )
    if (l.next(), l.done) {
      if (o)
        return null;
      l = new Fi(n.doc, e, 0, Math.max(0, i[i.length - 1].from - 1)), o = !0;
    } else {
      if (o && i.some((a) => a.from == l.value.from))
        continue;
      if (s) {
        let a = n.wordAt(l.value.from);
        if (!a || a.from != l.value.from || a.to != l.value.to)
          continue;
      }
      return l.value;
    }
}
const Iy = ({ state: n, dispatch: e }) => {
  let { ranges: t } = n.selection;
  if (t.some((s) => s.from === s.to))
    return Fy({ state: n, dispatch: e });
  let i = n.sliceDoc(t[0].from, t[0].to);
  if (n.selection.ranges.some((s) => n.sliceDoc(s.from, s.to) != i))
    return !1;
  let r = Ny(n, i);
  return r ? (e(n.update({
    selection: n.selection.addRange(M.range(r.from, r.to), !1),
    effects: N.scrollIntoView(r.to)
  })), !0) : !1;
}, Wi = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new Jy(e),
      scrollToMatch: (e) => N.scrollIntoView(e)
    });
  }
});
class Yf {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || Cy(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (t, i) => i == "n" ? `
` : i == "r" ? "\r" : i == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new zy(this) : new Vy(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, t = 0, i) {
    let r = e.doc ? e : X.create({ doc: e });
    return i == null && (i = r.doc.length), this.regexp ? vi(this, r, t, i) : xi(this, r, t, i);
  }
}
class Jf {
  constructor(e) {
    this.spec = e;
  }
}
function xi(n, e, t, i) {
  return new Fi(e.doc, n.unquoted, t, i, n.caseSensitive ? void 0 : (r) => r.toLowerCase(), n.wholeWord ? Hy(e.doc, e.charCategorizer(e.selection.main.head)) : void 0);
}
function Hy(n, e) {
  return (t, i, r, s) => ((s > t || s + r.length < i) && (s = Math.max(0, t - 2), r = n.sliceString(s, Math.min(n.length, i + 2))), (e(Lr(r, t - s)) != ae.Word || e(Pr(r, t - s)) != ae.Word) && (e(Pr(r, i - s)) != ae.Word || e(Lr(r, i - s)) != ae.Word));
}
class Vy extends Jf {
  constructor(e) {
    super(e);
  }
  nextMatch(e, t, i) {
    let r = xi(this.spec, e, i, e.doc.length).nextOverlapping();
    if (r.done) {
      let s = Math.min(e.doc.length, t + this.spec.unquoted.length);
      r = xi(this.spec, e, 0, s).nextOverlapping();
    }
    return r.done || r.value.from == t && r.value.to == i ? null : r.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, t, i) {
    for (let r = i; ; ) {
      let s = Math.max(t, r - 1e4 - this.spec.unquoted.length), o = xi(this.spec, e, s, r), l = null;
      for (; !o.nextOverlapping().done; )
        l = o.value;
      if (l)
        return l;
      if (s == t)
        return null;
      r -= 1e4;
    }
  }
  prevMatch(e, t, i) {
    let r = this.prevMatchInRange(e, 0, t);
    return r || (r = this.prevMatchInRange(e, Math.max(0, i - this.spec.unquoted.length), e.doc.length)), r && (r.from != t || r.to != i) ? r : null;
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, t) {
    let i = xi(this.spec, e, 0, e.doc.length), r = [];
    for (; !i.next().done; ) {
      if (r.length >= t)
        return null;
      r.push(i.value);
    }
    return r;
  }
  highlight(e, t, i, r) {
    let s = xi(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(i + this.spec.unquoted.length, e.doc.length));
    for (; !s.next().done; )
      r(s.value.from, s.value.to);
  }
}
function vi(n, e, t, i) {
  return new Uf(e.doc, n.search, {
    ignoreCase: !n.caseSensitive,
    test: n.wholeWord ? Wy(e.charCategorizer(e.selection.main.head)) : void 0
  }, t, i);
}
function Lr(n, e) {
  return n.slice(Ee(n, e, !1), e);
}
function Pr(n, e) {
  return n.slice(e, Ee(n, e));
}
function Wy(n) {
  return (e, t, i) => !i[0].length || (n(Lr(i.input, i.index)) != ae.Word || n(Pr(i.input, i.index)) != ae.Word) && (n(Pr(i.input, i.index + i[0].length)) != ae.Word || n(Lr(i.input, i.index + i[0].length)) != ae.Word);
}
class zy extends Jf {
  nextMatch(e, t, i) {
    let r = vi(this.spec, e, i, e.doc.length).next();
    return r.done && (r = vi(this.spec, e, 0, t).next()), r.done ? null : r.value;
  }
  prevMatchInRange(e, t, i) {
    for (let r = 1; ; r++) {
      let s = Math.max(
        t,
        i - r * 1e4
        /* FindPrev.ChunkSize */
      ), o = vi(this.spec, e, s, i), l = null;
      for (; !o.next().done; )
        l = o.value;
      if (l && (s == t || l.from > s + 10))
        return l;
      if (s == t)
        return null;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g, (t, i) => {
      if (i == "&")
        return e.match[0];
      if (i == "$")
        return "$";
      for (let r = i.length; r > 0; r--) {
        let s = +i.slice(0, r);
        if (s > 0 && s < e.match.length)
          return e.match[s] + i.slice(r);
      }
      return t;
    });
  }
  matchAll(e, t) {
    let i = vi(this.spec, e, 0, e.doc.length), r = [];
    for (; !i.next().done; ) {
      if (r.length >= t)
        return null;
      r.push(i.value);
    }
    return r;
  }
  highlight(e, t, i, r) {
    let s = vi(this.spec, e, Math.max(
      0,
      t - 250
      /* RegExp.HighlightMargin */
    ), Math.min(i + 250, e.doc.length));
    for (; !s.next().done; )
      r(s.value.from, s.value.to);
  }
}
const wn = /* @__PURE__ */ z.define(), sl = /* @__PURE__ */ z.define(), $t = /* @__PURE__ */ Se.define({
  create(n) {
    return new Es(Do(n).create(), null);
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(wn) ? n = new Es(t.value.create(), n.panel) : t.is(sl) && (n = new Es(n.query, t.value ? ol : null));
    return n;
  },
  provide: (n) => yn.from(n, (e) => e.panel)
});
class Es {
  constructor(e, t) {
    this.query = e, this.panel = t;
  }
}
const qy = /* @__PURE__ */ W.mark({ class: "cm-searchMatch" }), Ky = /* @__PURE__ */ W.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), $y = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.decorations = this.highlight(n.state.field($t));
  }
  update(n) {
    let e = n.state.field($t);
    (e != n.startState.field($t) || n.docChanged || n.selectionSet || n.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: n, panel: e }) {
    if (!e || !n.spec.valid)
      return W.none;
    let { view: t } = this, i = new Lt();
    for (let r = 0, s = t.visibleRanges, o = s.length; r < o; r++) {
      let { from: l, to: a } = s[r];
      for (; r < o - 1 && a > s[r + 1].from - 2 * 250; )
        a = s[++r].to;
      n.highlight(t.state, l, a, (h, c) => {
        let f = t.state.selection.ranges.some((d) => d.from == h && d.to == c);
        i.add(h, c, f ? Ky : qy);
      });
    }
    return i.finish();
  }
}, {
  decorations: (n) => n.decorations
});
function Bn(n) {
  return (e) => {
    let t = e.state.field($t, !1);
    return t && t.query.spec.valid ? n(e, t) : Qf(e);
  };
}
const Rr = /* @__PURE__ */ Bn((n, { query: e }) => {
  let { to: t } = n.state.selection.main, i = e.nextMatch(n.state, t, t);
  if (!i)
    return !1;
  let r = M.single(i.from, i.to), s = n.state.facet(Wi);
  return n.dispatch({
    selection: r,
    effects: [ll(n, i), s.scrollToMatch(r.main, n)],
    userEvent: "select.search"
  }), _f(n), !0;
}), Fr = /* @__PURE__ */ Bn((n, { query: e }) => {
  let { state: t } = n, { from: i } = t.selection.main, r = e.prevMatch(t, i, i);
  if (!r)
    return !1;
  let s = M.single(r.from, r.to), o = n.state.facet(Wi);
  return n.dispatch({
    selection: s,
    effects: [ll(n, r), o.scrollToMatch(s.main, n)],
    userEvent: "select.search"
  }), _f(n), !0;
}), jy = /* @__PURE__ */ Bn((n, { query: e }) => {
  let t = e.matchAll(n.state, 1e3);
  return !t || !t.length ? !1 : (n.dispatch({
    selection: M.create(t.map((i) => M.range(i.from, i.to))),
    userEvent: "select.search.matches"
  }), !0);
}), Uy = ({ state: n, dispatch: e }) => {
  let t = n.selection;
  if (t.ranges.length > 1 || t.main.empty)
    return !1;
  let { from: i, to: r } = t.main, s = [], o = 0;
  for (let l = new Fi(n.doc, n.sliceDoc(i, r)); !l.next().done; ) {
    if (s.length > 1e3)
      return !1;
    l.value.from == i && (o = s.length), s.push(M.range(l.value.from, l.value.to));
  }
  return e(n.update({
    selection: M.create(s, o),
    userEvent: "select.search.matches"
  })), !0;
}, _a = /* @__PURE__ */ Bn((n, { query: e }) => {
  let { state: t } = n, { from: i, to: r } = t.selection.main;
  if (t.readOnly)
    return !1;
  let s = e.nextMatch(t, i, i);
  if (!s)
    return !1;
  let o = s, l = [], a, h, c = [];
  if (o.from == i && o.to == r && (h = t.toText(e.getReplacement(o)), l.push({ from: o.from, to: o.to, insert: h }), o = e.nextMatch(t, o.from, o.to), c.push(N.announce.of(t.phrase("replaced match on line $", t.doc.lineAt(i).number) + "."))), o) {
    let f = l.length == 0 || l[0].from >= s.to ? 0 : s.to - s.from - h.length;
    a = M.single(o.from - f, o.to - f), c.push(ll(n, o)), c.push(t.facet(Wi).scrollToMatch(a.main, n));
  }
  return n.dispatch({
    changes: l,
    selection: a,
    effects: c,
    userEvent: "input.replace"
  }), !0;
}), Gy = /* @__PURE__ */ Bn((n, { query: e }) => {
  if (n.state.readOnly)
    return !1;
  let t = e.matchAll(n.state, 1e9).map((r) => {
    let { from: s, to: o } = r;
    return { from: s, to: o, insert: e.getReplacement(r) };
  });
  if (!t.length)
    return !1;
  let i = n.state.phrase("replaced $ matches", t.length) + ".";
  return n.dispatch({
    changes: t,
    effects: N.announce.of(i),
    userEvent: "input.replace.all"
  }), !0;
});
function ol(n) {
  return n.state.facet(Wi).createPanel(n);
}
function Do(n, e) {
  var t, i, r, s, o;
  let l = n.selection.main, a = l.empty || l.to > l.from + 100 ? "" : n.sliceDoc(l.from, l.to);
  if (e && !a)
    return e;
  let h = n.facet(Wi);
  return new Yf({
    search: ((t = e == null ? void 0 : e.literal) !== null && t !== void 0 ? t : h.literal) ? a : a.replace(/\n/g, "\\n"),
    caseSensitive: (i = e == null ? void 0 : e.caseSensitive) !== null && i !== void 0 ? i : h.caseSensitive,
    literal: (r = e == null ? void 0 : e.literal) !== null && r !== void 0 ? r : h.literal,
    regexp: (s = e == null ? void 0 : e.regexp) !== null && s !== void 0 ? s : h.regexp,
    wholeWord: (o = e == null ? void 0 : e.wholeWord) !== null && o !== void 0 ? o : h.wholeWord
  });
}
function Xf(n) {
  let e = mn(n, ol);
  return e && e.dom.querySelector("[main-field]");
}
function _f(n) {
  let e = Xf(n);
  e && e == n.root.activeElement && e.select();
}
const Qf = (n) => {
  let e = n.state.field($t, !1);
  if (e && e.panel) {
    let t = Xf(n);
    if (t && t != n.root.activeElement) {
      let i = Do(n.state, e.query.spec);
      i.valid && n.dispatch({ effects: wn.of(i) }), t.focus(), t.select();
    }
  } else
    n.dispatch({ effects: [
      sl.of(!0),
      e ? wn.of(Do(n.state, e.query.spec)) : z.appendConfig.of(_y)
    ] });
  return !0;
}, Zf = (n) => {
  let e = n.state.field($t, !1);
  if (!e || !e.panel)
    return !1;
  let t = mn(n, ol);
  return t && t.dom.contains(n.root.activeElement) && n.focus(), n.dispatch({ effects: sl.of(!1) }), !0;
}, Yy = [
  { key: "Mod-f", run: Qf, scope: "editor search-panel" },
  { key: "F3", run: Rr, shift: Fr, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: Rr, shift: Fr, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: Zf, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: Uy },
  { key: "Mod-Alt-g", run: Ay },
  { key: "Mod-d", run: Iy, preventDefault: !0 }
];
class Jy {
  constructor(e) {
    this.view = e;
    let t = this.query = e.state.field($t).query.spec;
    this.commit = this.commit.bind(this), this.searchField = te("input", {
      value: t.search,
      placeholder: Xe(e, "Find"),
      "aria-label": Xe(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = te("input", {
      value: t.replace,
      placeholder: Xe(e, "Replace"),
      "aria-label": Xe(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = te("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: t.caseSensitive,
      onchange: this.commit
    }), this.reField = te("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: t.regexp,
      onchange: this.commit
    }), this.wordField = te("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: t.wholeWord,
      onchange: this.commit
    });
    function i(r, s, o) {
      return te("button", { class: "cm-button", name: r, onclick: s, type: "button" }, o);
    }
    this.dom = te("div", { onkeydown: (r) => this.keydown(r), class: "cm-search" }, [
      this.searchField,
      i("next", () => Rr(e), [Xe(e, "next")]),
      i("prev", () => Fr(e), [Xe(e, "previous")]),
      i("select", () => jy(e), [Xe(e, "all")]),
      te("label", null, [this.caseField, Xe(e, "match case")]),
      te("label", null, [this.reField, Xe(e, "regexp")]),
      te("label", null, [this.wordField, Xe(e, "by word")]),
      ...e.state.readOnly ? [] : [
        te("br"),
        this.replaceField,
        i("replace", () => _a(e), [Xe(e, "replace")]),
        i("replaceAll", () => Gy(e), [Xe(e, "replace all")])
      ],
      te("button", {
        name: "close",
        onclick: () => Zf(e),
        "aria-label": Xe(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new Yf({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: wn.of(e) }));
  }
  keydown(e) {
    eg(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? Fr : Rr)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), _a(this.view));
  }
  update(e) {
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(wn) && !i.value.eq(this.query) && this.setQuery(i.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(Wi).top;
  }
}
function Xe(n, e) {
  return n.state.phrase(e);
}
const ir = 30, nr = /[\s\.,:;?!]/;
function ll(n, { from: e, to: t }) {
  let i = n.state.doc.lineAt(e), r = n.state.doc.lineAt(t).to, s = Math.max(i.from, e - ir), o = Math.min(r, t + ir), l = n.state.sliceDoc(s, o);
  if (s != i.from) {
    for (let a = 0; a < ir; a++)
      if (!nr.test(l[a + 1]) && nr.test(l[a])) {
        l = l.slice(a);
        break;
      }
  }
  if (o != r) {
    for (let a = l.length - 1; a > l.length - ir; a--)
      if (!nr.test(l[a - 1]) && nr.test(l[a])) {
        l = l.slice(0, a);
        break;
      }
  }
  return N.announce.of(`${n.state.phrase("current match")}. ${l} ${n.state.phrase("on line")} ${i.number}.`);
}
const Xy = /* @__PURE__ */ N.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), _y = [
  $t,
  /* @__PURE__ */ di.low($y),
  Xy
];
class eu {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, i, r) {
    this.state = e, this.pos = t, this.explicit = i, this.view = r, this.abortListeners = [], this.abortOnDocChange = !1;
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = Re(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), i = Math.max(t.from, this.pos - 250), r = t.text.slice(i - t.from, this.pos - t.from), s = r.search(tu(e, !1));
    return s < 0 ? null : { from: i + s, to: this.pos, text: r.slice(s) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  
  By default, running queries will not be aborted for regular
  typing or backspacing, on the assumption that they are likely to
  return a result with a
  [`validFor`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.validFor) field that
  allows the result to be used after all. Passing `onDocChange:
  true` will cause this query to be aborted for any document
  change.
  */
  addEventListener(e, t, i) {
    e == "abort" && this.abortListeners && (this.abortListeners.push(t), i && i.onDocChange && (this.abortOnDocChange = !0));
  }
}
function Qa(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function Qy(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: r } of n) {
    e[r[0]] = !0;
    for (let s = 1; s < r.length; s++)
      t[r[s]] = !0;
  }
  let i = Qa(e) + Qa(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function Zy(n) {
  let e = n.map((r) => typeof r == "string" ? { label: r } : r), [t, i] = e.every((r) => /^\w+$/.test(r.label)) ? [/\w*$/, /\w+$/] : Qy(e);
  return (r) => {
    let s = r.matchBefore(i);
    return s || r.explicit ? { from: s ? s.from : r.pos, options: e, validFor: t } : null;
  };
}
class Za {
  constructor(e, t, i, r) {
    this.completion = e, this.source = t, this.match = i, this.score = r;
  }
}
function oi(n) {
  return n.selection.main.from;
}
function tu(n, e) {
  var t;
  let { source: i } = n, r = e && i[0] != "^", s = i[i.length - 1] != "$";
  return !r && !s ? n : new RegExp(`${r ? "^" : ""}(?:${i})${s ? "$" : ""}`, (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : "");
}
const iu = /* @__PURE__ */ Rt.define();
function eb(n, e, t, i) {
  let { main: r } = n.selection, s = t - r.from, o = i - r.from;
  return Object.assign(Object.assign({}, n.changeByRange((l) => {
    if (l != r && t != i && n.sliceDoc(l.from + s, l.from + o) != n.sliceDoc(t, i))
      return { range: l };
    let a = n.toText(e);
    return {
      changes: { from: l.from + s, to: i == r.from ? l.to : l.from + o, insert: a },
      range: M.cursor(l.from + s + a.length)
    };
  })), { scrollIntoView: !0, userEvent: "input.complete" });
}
const eh = /* @__PURE__ */ new WeakMap();
function tb(n) {
  if (!Array.isArray(n))
    return n;
  let e = eh.get(n);
  return e || eh.set(n, e = Zy(n)), e;
}
const Nr = /* @__PURE__ */ z.define(), kn = /* @__PURE__ */ z.define();
class ib {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let t = 0; t < e.length; ) {
      let i = $e(e, t), r = xt(i);
      this.chars.push(i);
      let s = e.slice(t, t + r), o = s.toUpperCase();
      this.folded.push($e(o == s ? s.toLowerCase() : o, 0)), t += r;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, t) {
    return this.score = e, this.matched = t, this;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return null;
    let { chars: t, folded: i, any: r, precise: s, byWord: o } = this;
    if (t.length == 1) {
      let D = $e(e, 0), T = xt(D), E = T == e.length ? 0 : -100;
      if (D != t[0]) if (D == i[0])
        E += -200;
      else
        return null;
      return this.ret(E, [0, T]);
    }
    let l = e.indexOf(this.pattern);
    if (l == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let a = t.length, h = 0;
    if (l < 0) {
      for (let D = 0, T = Math.min(e.length, 200); D < T && h < a; ) {
        let E = $e(e, D);
        (E == t[h] || E == i[h]) && (r[h++] = D), D += xt(E);
      }
      if (h < a)
        return null;
    }
    let c = 0, f = 0, d = !1, g = 0, y = -1, b = -1, x = /[a-z]/.test(e), k = !0;
    for (let D = 0, T = Math.min(e.length, 200), E = 0; D < T && f < a; ) {
      let O = $e(e, D);
      l < 0 && (c < a && O == t[c] && (s[c++] = D), g < a && (O == t[g] || O == i[g] ? (g == 0 && (y = D), b = D + 1, g++) : g = 0));
      let C, A = O < 255 ? O >= 48 && O <= 57 || O >= 97 && O <= 122 ? 2 : O >= 65 && O <= 90 ? 1 : 0 : (C = Eo(O)) != C.toLowerCase() ? 1 : C != C.toUpperCase() ? 2 : 0;
      (!D || A == 1 && x || E == 0 && A != 0) && (t[f] == O || i[f] == O && (d = !0) ? o[f++] = D : o.length && (k = !1)), E = A, D += xt(O);
    }
    return f == a && o[0] == 0 && k ? this.result(-100 + (d ? -200 : 0), o, e) : g == a && y == 0 ? this.ret(-200 - e.length + (b == e.length ? 0 : -100), [0, b]) : l > -1 ? this.ret(-700 - e.length, [l, l + this.pattern.length]) : g == a ? this.ret(-900 - e.length, [y, b]) : f == a ? this.result(-100 + (d ? -200 : 0) + -700 + (k ? 0 : -1100), o, e) : t.length == 2 ? null : this.result((r[0] ? -700 : 0) + -200 + -1100, r, e);
  }
  result(e, t, i) {
    let r = [], s = 0;
    for (let o of t) {
      let l = o + (this.astral ? xt($e(i, o)) : 1);
      s && r[s - 1] == o ? r[s - 1] = l : (r[s++] = o, r[s++] = l);
    }
    return this.ret(e - i.length, r);
  }
}
class nb {
  constructor(e) {
    this.pattern = e, this.matched = [], this.score = 0, this.folded = e.toLowerCase();
  }
  match(e) {
    if (e.length < this.pattern.length)
      return null;
    let t = e.slice(0, this.pattern.length), i = t == this.pattern ? 0 : t.toLowerCase() == this.folded ? -200 : null;
    return i == null ? null : (this.matched = [0, t.length], this.score = i + (e.length == this.pattern.length ? 0 : -100), this);
  }
}
const Me = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, {
      activateOnTyping: !0,
      activateOnCompletion: () => !1,
      activateOnTypingDelay: 100,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: rb,
      filterStrict: !1,
      compareCompletions: (e, t) => e.label.localeCompare(t.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, t) => e && t,
      closeOnBlur: (e, t) => e && t,
      icons: (e, t) => e && t,
      tooltipClass: (e, t) => (i) => th(e(i), t(i)),
      optionClass: (e, t) => (i) => th(e(i), t(i)),
      addToOptions: (e, t) => e.concat(t),
      filterStrict: (e, t) => e || t
    });
  }
});
function th(n, e) {
  return n ? e ? n + " " + e : n : e;
}
function rb(n, e, t, i, r, s) {
  let o = n.textDirection == oe.RTL, l = o, a = !1, h = "top", c, f, d = e.left - r.left, g = r.right - e.right, y = i.right - i.left, b = i.bottom - i.top;
  if (l && d < Math.min(y, g) ? l = !1 : !l && g < Math.min(y, d) && (l = !0), y <= (l ? d : g))
    c = Math.max(r.top, Math.min(t.top, r.bottom - b)) - e.top, f = Math.min(400, l ? d : g);
  else {
    a = !0, f = Math.min(
      400,
      (o ? e.right : r.right - e.left) - 30
      /* Info.Margin */
    );
    let D = r.bottom - e.bottom;
    D >= b || D > e.top ? c = t.bottom - e.top : (h = "bottom", c = e.bottom - t.top);
  }
  let x = (e.bottom - e.top) / s.offsetHeight, k = (e.right - e.left) / s.offsetWidth;
  return {
    style: `${h}: ${c / x}px; max-width: ${f / k}px`,
    class: "cm-completionInfo-" + (a ? o ? "left-narrow" : "right-narrow" : l ? "left" : "right")
  };
}
function sb(n) {
  let e = n.addToOptions.slice();
  return n.icons && e.push({
    render(t) {
      let i = document.createElement("div");
      return i.classList.add("cm-completionIcon"), t.type && i.classList.add(...t.type.split(/\s+/g).map((r) => "cm-completionIcon-" + r)), i.setAttribute("aria-hidden", "true"), i;
    },
    position: 20
  }), e.push({
    render(t, i, r, s) {
      let o = document.createElement("span");
      o.className = "cm-completionLabel";
      let l = t.displayLabel || t.label, a = 0;
      for (let h = 0; h < s.length; ) {
        let c = s[h++], f = s[h++];
        c > a && o.appendChild(document.createTextNode(l.slice(a, c)));
        let d = o.appendChild(document.createElement("span"));
        d.appendChild(document.createTextNode(l.slice(c, f))), d.className = "cm-completionMatchedText", a = f;
      }
      return a < l.length && o.appendChild(document.createTextNode(l.slice(a))), o;
    },
    position: 50
  }, {
    render(t) {
      if (!t.detail)
        return null;
      let i = document.createElement("span");
      return i.className = "cm-completionDetail", i.textContent = t.detail, i;
    },
    position: 80
  }), e.sort((t, i) => t.position - i.position).map((t) => t.render);
}
function Bs(n, e, t) {
  if (n <= t)
    return { from: 0, to: n };
  if (e < 0 && (e = 0), e <= n >> 1) {
    let r = Math.floor(e / t);
    return { from: r * t, to: (r + 1) * t };
  }
  let i = Math.floor((n - e) / t);
  return { from: n - (i + 1) * t, to: n - i * t };
}
class ob {
  constructor(e, t, i) {
    this.view = e, this.stateField = t, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (a) => this.placeInfo(a),
      key: this
    }, this.space = null, this.currentClass = "";
    let r = e.state.field(t), { options: s, selected: o } = r.open, l = e.state.facet(Me);
    this.optionContent = sb(l), this.optionClass = l.optionClass, this.tooltipClass = l.tooltipClass, this.range = Bs(s.length, o, l.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (a) => {
      let { options: h } = e.state.field(t).open;
      for (let c = a.target, f; c && c != this.dom; c = c.parentNode)
        if (c.nodeName == "LI" && (f = /-(\d+)$/.exec(c.id)) && +f[1] < h.length) {
          this.applyCompletion(e, h[+f[1]]), a.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (a) => {
      let h = e.state.field(this.stateField, !1);
      h && h.tooltip && e.state.facet(Me).closeOnBlur && a.relatedTarget != e.contentDOM && e.dispatch({ effects: kn.of(null) });
    }), this.showOptions(s, r.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, t) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var t;
    let i = e.state.field(this.stateField), r = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), i != r) {
      let { options: s, selected: o, disabled: l } = i.open;
      (!r.open || r.open.options != s) && (this.range = Bs(s.length, o, e.state.facet(Me).maxRenderedOptions), this.showOptions(s, i.id)), this.updateSel(), l != ((t = r.open) === null || t === void 0 ? void 0 : t.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!l);
    }
  }
  updateTooltipClass(e) {
    let t = this.tooltipClass(e);
    if (t != this.currentClass) {
      for (let i of this.currentClass.split(" "))
        i && this.dom.classList.remove(i);
      for (let i of t.split(" "))
        i && this.dom.classList.add(i);
      this.currentClass = t;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), t = e.open;
    if ((t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = Bs(t.options.length, t.selected, this.view.state.facet(Me).maxRenderedOptions), this.showOptions(t.options, e.id)), this.updateSelectedOption(t.selected)) {
      this.destroyInfo();
      let { completion: i } = t.options[t.selected], { info: r } = i;
      if (!r)
        return;
      let s = typeof r == "string" ? document.createTextNode(r) : r(i);
      if (!s)
        return;
      "then" in s ? s.then((o) => {
        o && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(o, i);
      }).catch((o) => Ve(this.view.state, o, "completion info")) : this.addInfoPane(s, i);
    }
  }
  addInfoPane(e, t) {
    this.destroyInfo();
    let i = this.info = document.createElement("div");
    if (i.className = "cm-tooltip cm-completionInfo", e.nodeType != null)
      i.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: r, destroy: s } = e;
      i.appendChild(r), this.infoDestroy = s || null;
    }
    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let t = null;
    for (let i = this.list.firstChild, r = this.range.from; i; i = i.nextSibling, r++)
      i.nodeName != "LI" || !i.id ? r-- : r == e ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), t = i) : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return t && ab(this.list, t), t;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let t = this.dom.getBoundingClientRect(), i = this.info.getBoundingClientRect(), r = e.getBoundingClientRect(), s = this.space;
    if (!s) {
      let o = this.dom.ownerDocument.documentElement;
      s = { left: 0, top: 0, right: o.clientWidth, bottom: o.clientHeight };
    }
    return r.top > Math.min(s.bottom, t.bottom) - 10 || r.bottom < Math.max(s.top, t.top) + 10 ? null : this.view.state.facet(Me).positionInfo(this.view, t, r, i, s, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, t, i) {
    const r = document.createElement("ul");
    r.id = t, r.setAttribute("role", "listbox"), r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-label", this.view.state.phrase("Completions")), r.addEventListener("mousedown", (o) => {
      o.target == r && o.preventDefault();
    });
    let s = null;
    for (let o = i.from; o < i.to; o++) {
      let { completion: l, match: a } = e[o], { section: h } = l;
      if (h) {
        let d = typeof h == "string" ? h : h.name;
        if (d != s && (o > i.from || i.from == 0))
          if (s = d, typeof h != "string" && h.header)
            r.appendChild(h.header(h));
          else {
            let g = r.appendChild(document.createElement("completion-section"));
            g.textContent = d;
          }
      }
      const c = r.appendChild(document.createElement("li"));
      c.id = t + "-" + o, c.setAttribute("role", "option");
      let f = this.optionClass(l);
      f && (c.className = f);
      for (let d of this.optionContent) {
        let g = d(l, this.view.state, this.view, a);
        g && c.appendChild(g);
      }
    }
    return i.from && r.classList.add("cm-completionListIncompleteTop"), i.to < e.length && r.classList.add("cm-completionListIncompleteBottom"), r;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function lb(n, e) {
  return (t) => new ob(t, n, e);
}
function ab(n, e) {
  let t = n.getBoundingClientRect(), i = e.getBoundingClientRect(), r = t.height / n.offsetHeight;
  i.top < t.top ? n.scrollTop -= (t.top - i.top) / r : i.bottom > t.bottom && (n.scrollTop += (i.bottom - t.bottom) / r);
}
function ih(n) {
  return (n.boost || 0) * 100 + (n.apply ? 10 : 0) + (n.info ? 5 : 0) + (n.type ? 1 : 0);
}
function hb(n, e) {
  let t = [], i = null, r = (h) => {
    t.push(h);
    let { section: c } = h.completion;
    if (c) {
      i || (i = []);
      let f = typeof c == "string" ? c : c.name;
      i.some((d) => d.name == f) || i.push(typeof c == "string" ? { name: f } : c);
    }
  }, s = e.facet(Me);
  for (let h of n)
    if (h.hasResult()) {
      let c = h.result.getMatch;
      if (h.result.filter === !1)
        for (let f of h.result.options)
          r(new Za(f, h.source, c ? c(f) : [], 1e9 - t.length));
      else {
        let f = e.sliceDoc(h.from, h.to), d, g = s.filterStrict ? new nb(f) : new ib(f);
        for (let y of h.result.options)
          if (d = g.match(y.label)) {
            let b = y.displayLabel ? c ? c(y, d.matched) : [] : d.matched;
            r(new Za(y, h.source, b, d.score + (y.boost || 0)));
          }
      }
    }
  if (i) {
    let h = /* @__PURE__ */ Object.create(null), c = 0, f = (d, g) => {
      var y, b;
      return ((y = d.rank) !== null && y !== void 0 ? y : 1e9) - ((b = g.rank) !== null && b !== void 0 ? b : 1e9) || (d.name < g.name ? -1 : 1);
    };
    for (let d of i.sort(f))
      c -= 1e5, h[d.name] = c;
    for (let d of t) {
      let { section: g } = d.completion;
      g && (d.score += h[typeof g == "string" ? g : g.name]);
    }
  }
  let o = [], l = null, a = s.compareCompletions;
  for (let h of t.sort((c, f) => f.score - c.score || a(c.completion, f.completion))) {
    let c = h.completion;
    !l || l.label != c.label || l.detail != c.detail || l.type != null && c.type != null && l.type != c.type || l.apply != c.apply || l.boost != c.boost ? o.push(h) : ih(h.completion) > ih(l) && (o[o.length - 1] = h), l = h.completion;
  }
  return o;
}
class Si {
  constructor(e, t, i, r, s, o) {
    this.options = e, this.attrs = t, this.tooltip = i, this.timestamp = r, this.selected = s, this.disabled = o;
  }
  setSelected(e, t) {
    return e == this.selected || e >= this.options.length ? this : new Si(this.options, nh(t, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, t, i, r, s, o) {
    if (r && !o && e.some((h) => h.isPending))
      return r.setDisabled();
    let l = hb(e, t);
    if (!l.length)
      return r && e.some((h) => h.isPending) ? r.setDisabled() : null;
    let a = t.facet(Me).selectOnOpen ? 0 : -1;
    if (r && r.selected != a && r.selected != -1) {
      let h = r.options[r.selected].completion;
      for (let c = 0; c < l.length; c++)
        if (l[c].completion == h) {
          a = c;
          break;
        }
    }
    return new Si(l, nh(i, a), {
      pos: e.reduce((h, c) => c.hasResult() ? Math.min(h, c.from) : h, 1e8),
      create: gb,
      above: s.aboveCursor
    }, r ? r.timestamp : Date.now(), a, !1);
  }
  map(e) {
    return new Si(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: e.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
  setDisabled() {
    return new Si(this.options, this.attrs, this.tooltip, this.timestamp, this.selected, !0);
  }
}
class Ir {
  constructor(e, t, i) {
    this.active = e, this.id = t, this.open = i;
  }
  static start() {
    return new Ir(db, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: t } = e, i = t.facet(Me), s = (i.override || t.languageDataAt("autocomplete", oi(t)).map(tb)).map((a) => (this.active.find((c) => c.source == a) || new tt(
      a,
      this.active.some(
        (c) => c.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, i));
    s.length == this.active.length && s.every((a, h) => a == this.active[h]) && (s = this.active);
    let o = this.open, l = e.effects.some((a) => a.is(al));
    o && e.docChanged && (o = o.map(e.changes)), e.selection || s.some((a) => a.hasResult() && e.changes.touchesRange(a.from, a.to)) || !cb(s, this.active) || l ? o = Si.build(s, t, this.id, o, i, l) : o && o.disabled && !s.some((a) => a.isPending) && (o = null), !o && s.every((a) => !a.isPending) && s.some((a) => a.hasResult()) && (s = s.map((a) => a.hasResult() ? new tt(
      a.source,
      0
      /* State.Inactive */
    ) : a));
    for (let a of e.effects)
      a.is(ru) && (o = o && o.setSelected(a.value, this.id));
    return s == this.active && o == this.open ? this : new Ir(s, this.id, o);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : this.active.length ? fb : ub;
  }
}
function cb(n, e) {
  if (n == e)
    return !0;
  for (let t = 0, i = 0; ; ) {
    for (; t < n.length && !n[t].hasResult(); )
      t++;
    for (; i < e.length && !e[i].hasResult(); )
      i++;
    let r = t == n.length, s = i == e.length;
    if (r || s)
      return r == s;
    if (n[t++].result != e[i++].result)
      return !1;
  }
}
const fb = {
  "aria-autocomplete": "list"
}, ub = {};
function nh(n, e) {
  let t = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": n
  };
  return e > -1 && (t["aria-activedescendant"] = n + "-" + e), t;
}
const db = [];
function nu(n, e) {
  if (n.isUserEvent("input.complete")) {
    let i = n.annotation(iu);
    if (i && e.activateOnCompletion(i))
      return 12;
  }
  let t = n.isUserEvent("input.type");
  return t && e.activateOnTyping ? 5 : t ? 1 : n.isUserEvent("delete.backward") ? 2 : n.selection ? 8 : n.docChanged ? 16 : 0;
}
class tt {
  constructor(e, t, i = !1) {
    this.source = e, this.state = t, this.explicit = i;
  }
  hasResult() {
    return !1;
  }
  get isPending() {
    return this.state == 1;
  }
  update(e, t) {
    let i = nu(e, t), r = this;
    (i & 8 || i & 16 && this.touches(e)) && (r = new tt(
      r.source,
      0
      /* State.Inactive */
    )), i & 4 && r.state == 0 && (r = new tt(
      this.source,
      1
      /* State.Pending */
    )), r = r.updateFor(e, i);
    for (let s of e.effects)
      if (s.is(Nr))
        r = new tt(r.source, 1, s.value);
      else if (s.is(kn))
        r = new tt(
          r.source,
          0
          /* State.Inactive */
        );
      else if (s.is(al))
        for (let o of s.value)
          o.source == r.source && (r = o);
    return r;
  }
  updateFor(e, t) {
    return this.map(e.changes);
  }
  map(e) {
    return this;
  }
  touches(e) {
    return e.changes.touchesRange(oi(e.state));
  }
}
class Oi extends tt {
  constructor(e, t, i, r, s, o) {
    super(e, 3, t), this.limit = i, this.result = r, this.from = s, this.to = o;
  }
  hasResult() {
    return !0;
  }
  updateFor(e, t) {
    var i;
    if (!(t & 3))
      return this.map(e.changes);
    let r = this.result;
    r.map && !e.changes.empty && (r = r.map(r, e.changes));
    let s = e.changes.mapPos(this.from), o = e.changes.mapPos(this.to, 1), l = oi(e.state);
    if (l > o || !r || t & 2 && (oi(e.startState) == this.from || l < this.limit))
      return new tt(
        this.source,
        t & 4 ? 1 : 0
        /* State.Inactive */
      );
    let a = e.changes.mapPos(this.limit);
    return pb(r.validFor, e.state, s, o) ? new Oi(this.source, this.explicit, a, r, s, o) : r.update && (r = r.update(r, s, o, new eu(e.state, l, !1))) ? new Oi(this.source, this.explicit, a, r, r.from, (i = r.to) !== null && i !== void 0 ? i : oi(e.state)) : new tt(this.source, 1, this.explicit);
  }
  map(e) {
    return e.empty ? this : (this.result.map ? this.result.map(this.result, e) : this.result) ? new Oi(this.source, this.explicit, e.mapPos(this.limit), this.result, e.mapPos(this.from), e.mapPos(this.to, 1)) : new tt(
      this.source,
      0
      /* State.Inactive */
    );
  }
  touches(e) {
    return e.changes.touchesRange(this.from, this.to);
  }
}
function pb(n, e, t, i) {
  if (!n)
    return !1;
  let r = e.sliceDoc(t, i);
  return typeof n == "function" ? n(r, t, i, e) : tu(n, !0).test(r);
}
const al = /* @__PURE__ */ z.define({
  map(n, e) {
    return n.map((t) => t.map(e));
  }
}), ru = /* @__PURE__ */ z.define(), Ue = /* @__PURE__ */ Se.define({
  create() {
    return Ir.start();
  },
  update(n, e) {
    return n.update(e);
  },
  provide: (n) => [
    zr.from(n, (e) => e.tooltip),
    N.contentAttributes.from(n, (e) => e.attrs)
  ]
});
function hl(n, e) {
  const t = e.completion.apply || e.completion.label;
  let i = n.state.field(Ue).active.find((r) => r.source == e.source);
  return i instanceof Oi ? (typeof t == "string" ? n.dispatch(Object.assign(Object.assign({}, eb(n.state, t, i.from, i.to)), { annotations: iu.of(e.completion) })) : t(n, e.completion, i.from, i.to), !0) : !1;
}
const gb = /* @__PURE__ */ lb(Ue, hl);
function rr(n, e = "option") {
  return (t) => {
    let i = t.state.field(Ue, !1);
    if (!i || !i.open || i.open.disabled || Date.now() - i.open.timestamp < t.state.facet(Me).interactionDelay)
      return !1;
    let r = 1, s;
    e == "page" && (s = Fc(t, i.open.tooltip)) && (r = Math.max(2, Math.floor(s.dom.offsetHeight / s.dom.querySelector("li").offsetHeight) - 1));
    let { length: o } = i.open.options, l = i.open.selected > -1 ? i.open.selected + r * (n ? 1 : -1) : n ? 0 : o - 1;
    return l < 0 ? l = e == "page" ? 0 : o - 1 : l >= o && (l = e == "page" ? o - 1 : 0), t.dispatch({ effects: ru.of(l) }), !0;
  };
}
const mb = (n) => {
  let e = n.state.field(Ue, !1);
  return n.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < n.state.facet(Me).interactionDelay ? !1 : hl(n, e.open.options[e.open.selected]);
}, rh = (n) => n.state.field(Ue, !1) ? (n.dispatch({ effects: Nr.of(!0) }), !0) : !1, yb = (n) => {
  let e = n.state.field(Ue, !1);
  return !e || !e.active.some(
    (t) => t.state != 0
    /* State.Inactive */
  ) ? !1 : (n.dispatch({ effects: kn.of(null) }), !0);
};
class bb {
  constructor(e, t) {
    this.active = e, this.context = t, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const xb = 50, vb = 1e3, wb = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
    for (let e of n.state.field(Ue).active)
      e.isPending && this.startQuery(e);
  }
  update(n) {
    let e = n.state.field(Ue), t = n.state.facet(Me);
    if (!n.selectionSet && !n.docChanged && n.startState.field(Ue) == e)
      return;
    let i = n.transactions.some((s) => {
      let o = nu(s, t);
      return o & 8 || (s.selection || s.docChanged) && !(o & 3);
    });
    for (let s = 0; s < this.running.length; s++) {
      let o = this.running[s];
      if (i || o.context.abortOnDocChange && n.docChanged || o.updates.length + n.transactions.length > xb && Date.now() - o.time > vb) {
        for (let l of o.context.abortListeners)
          try {
            l();
          } catch (a) {
            Ve(this.view.state, a);
          }
        o.context.abortListeners = null, this.running.splice(s--, 1);
      } else
        o.updates.push(...n.transactions);
    }
    this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), n.transactions.some((s) => s.effects.some((o) => o.is(Nr))) && (this.pendingStart = !0);
    let r = this.pendingStart ? 50 : t.activateOnTypingDelay;
    if (this.debounceUpdate = e.active.some((s) => s.isPending && !this.running.some((o) => o.active.source == s.source)) ? setTimeout(() => this.startUpdate(), r) : -1, this.composing != 0)
      for (let s of n.transactions)
        s.isUserEvent("input.type") ? this.composing = 2 : this.composing == 2 && s.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1, this.pendingStart = !1;
    let { state: n } = this.view, e = n.field(Ue);
    for (let t of e.active)
      t.isPending && !this.running.some((i) => i.active.source == t.source) && this.startQuery(t);
    this.running.length && e.open && e.open.disabled && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(Me).updateSyncTime));
  }
  startQuery(n) {
    let { state: e } = this.view, t = oi(e), i = new eu(e, t, n.explicit, this.view), r = new bb(n, i);
    this.running.push(r), Promise.resolve(n.source(i)).then((s) => {
      r.context.aborted || (r.done = s || null, this.scheduleAccept());
    }, (s) => {
      this.view.dispatch({ effects: kn.of(null) }), Ve(this.view.state, s);
    });
  }
  scheduleAccept() {
    this.running.every((n) => n.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(Me).updateSyncTime));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var n;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let e = [], t = this.view.state.facet(Me), i = this.view.state.field(Ue);
    for (let r = 0; r < this.running.length; r++) {
      let s = this.running[r];
      if (s.done === void 0)
        continue;
      if (this.running.splice(r--, 1), s.done) {
        let l = oi(s.updates.length ? s.updates[0].startState : this.view.state), a = Math.min(l, s.done.from + (s.active.explicit ? 0 : 1)), h = new Oi(s.active.source, s.active.explicit, a, s.done, s.done.from, (n = s.done.to) !== null && n !== void 0 ? n : l);
        for (let c of s.updates)
          h = h.update(c, t);
        if (h.hasResult()) {
          e.push(h);
          continue;
        }
      }
      let o = i.active.find((l) => l.source == s.active.source);
      if (o && o.isPending)
        if (s.done == null) {
          let l = new tt(
            s.active.source,
            0
            /* State.Inactive */
          );
          for (let a of s.updates)
            l = l.update(a, t);
          l.isPending || e.push(l);
        } else
          this.startQuery(o);
    }
    (e.length || i.open && i.open.disabled) && this.view.dispatch({ effects: al.of(e) });
  }
}, {
  eventHandlers: {
    blur(n) {
      let e = this.view.state.field(Ue, !1);
      if (e && e.tooltip && this.view.state.facet(Me).closeOnBlur) {
        let t = e.open && Fc(this.view, e.open.tooltip);
        (!t || !t.dom.contains(n.relatedTarget)) && setTimeout(() => this.view.dispatch({ effects: kn.of(null) }), 10);
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: Nr.of(!1) }), 20), this.composing = 0;
    }
  }
}), kb = typeof navigator == "object" && /* @__PURE__ */ /Win/.test(navigator.platform), Sb = /* @__PURE__ */ di.highest(/* @__PURE__ */ N.domEventHandlers({
  keydown(n, e) {
    let t = e.state.field(Ue, !1);
    if (!t || !t.open || t.open.disabled || t.open.selected < 0 || n.key.length > 1 || n.ctrlKey && !(kb && n.altKey) || n.metaKey)
      return !1;
    let i = t.open.options[t.open.selected], r = t.active.find((o) => o.source == i.source), s = i.completion.commitCharacters || r.result.commitCharacters;
    return s && s.indexOf(n.key) > -1 && hl(e, i), !1;
  }
})), Cb = /* @__PURE__ */ N.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
}), Sn = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, ri = /* @__PURE__ */ z.define({
  map(n, e) {
    let t = e.mapPos(n, -1, He.TrackAfter);
    return t ?? void 0;
  }
}), cl = /* @__PURE__ */ new class extends li {
}();
cl.startSide = 1;
cl.endSide = -1;
const su = /* @__PURE__ */ Se.define({
  create() {
    return j.empty;
  },
  update(n, e) {
    if (n = n.map(e.changes), e.selection) {
      let t = e.state.doc.lineAt(e.selection.main.head);
      n = n.update({ filter: (i) => i >= t.from && i <= t.to });
    }
    for (let t of e.effects)
      t.is(ri) && (n = n.update({ add: [cl.range(t.value, t.value + 1)] }));
    return n;
  }
});
function Ab() {
  return [Db, su];
}
const Ls = "()[]{}<>«»»«［］｛｝";
function ou(n) {
  for (let e = 0; e < Ls.length; e += 2)
    if (Ls.charCodeAt(e) == n)
      return Ls.charAt(e + 1);
  return Eo(n < 128 ? n : n + 1);
}
function lu(n, e) {
  return n.languageDataAt("closeBrackets", e)[0] || Sn;
}
const Mb = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), Db = /* @__PURE__ */ N.inputHandler.of((n, e, t, i) => {
  if ((Mb ? n.composing : n.compositionStarted) || n.state.readOnly)
    return !1;
  let r = n.state.selection.main;
  if (i.length > 2 || i.length == 2 && xt($e(i, 0)) == 1 || e != r.from || t != r.to)
    return !1;
  let s = Eb(n.state, i);
  return s ? (n.dispatch(s), !0) : !1;
}), Ob = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let i = lu(n, n.selection.main.head).brackets || Sn.brackets, r = null, s = n.changeByRange((o) => {
    if (o.empty) {
      let l = Bb(n.doc, o.head);
      for (let a of i)
        if (a == l && Xr(n.doc, o.head) == ou($e(a, 0)))
          return {
            changes: { from: o.head - a.length, to: o.head + a.length },
            range: M.cursor(o.head - a.length)
          };
    }
    return { range: r = o };
  });
  return r || e(n.update(s, { scrollIntoView: !0, userEvent: "delete.backward" })), !r;
}, Tb = [
  { key: "Backspace", run: Ob }
];
function Eb(n, e) {
  let t = lu(n, n.selection.main.head), i = t.brackets || Sn.brackets;
  for (let r of i) {
    let s = ou($e(r, 0));
    if (e == r)
      return s == r ? Rb(n, r, i.indexOf(r + r + r) > -1, t) : Lb(n, r, s, t.before || Sn.before);
    if (e == s && au(n, n.selection.main.from))
      return Pb(n, r, s);
  }
  return null;
}
function au(n, e) {
  let t = !1;
  return n.field(su).between(0, n.doc.length, (i) => {
    i == e && (t = !0);
  }), t;
}
function Xr(n, e) {
  let t = n.sliceString(e, e + 2);
  return t.slice(0, xt($e(t, 0)));
}
function Bb(n, e) {
  let t = n.sliceString(e - 2, e);
  return xt($e(t, 0)) == t.length ? t : t.slice(1);
}
function Lb(n, e, t, i) {
  let r = null, s = n.changeByRange((o) => {
    if (!o.empty)
      return {
        changes: [{ insert: e, from: o.from }, { insert: t, from: o.to }],
        effects: ri.of(o.to + e.length),
        range: M.range(o.anchor + e.length, o.head + e.length)
      };
    let l = Xr(n.doc, o.head);
    return !l || /\s/.test(l) || i.indexOf(l) > -1 ? {
      changes: { insert: e + t, from: o.head },
      effects: ri.of(o.head + e.length),
      range: M.cursor(o.head + e.length)
    } : { range: r = o };
  });
  return r ? null : n.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Pb(n, e, t) {
  let i = null, r = n.changeByRange((s) => s.empty && Xr(n.doc, s.head) == t ? {
    changes: { from: s.head, to: s.head + t.length, insert: t },
    range: M.cursor(s.head + t.length)
  } : i = { range: s });
  return i ? null : n.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Rb(n, e, t, i) {
  let r = i.stringPrefixes || Sn.stringPrefixes, s = null, o = n.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: e, from: l.from }, { insert: e, from: l.to }],
        effects: ri.of(l.to + e.length),
        range: M.range(l.anchor + e.length, l.head + e.length)
      };
    let a = l.head, h = Xr(n.doc, a), c;
    if (h == e) {
      if (sh(n, a))
        return {
          changes: { insert: e + e, from: a },
          effects: ri.of(a + e.length),
          range: M.cursor(a + e.length)
        };
      if (au(n, a)) {
        let d = t && n.sliceDoc(a, a + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: a, to: a + d.length, insert: d },
          range: M.cursor(a + d.length)
        };
      }
    } else {
      if (t && n.sliceDoc(a - 2 * e.length, a) == e + e && (c = oh(n, a - 2 * e.length, r)) > -1 && sh(n, c))
        return {
          changes: { insert: e + e + e + e, from: a },
          effects: ri.of(a + e.length),
          range: M.cursor(a + e.length)
        };
      if (n.charCategorizer(a)(h) != ae.Word && oh(n, a, r) > -1 && !Fb(n, a, e, r))
        return {
          changes: { insert: e + e, from: a },
          effects: ri.of(a + e.length),
          range: M.cursor(a + e.length)
        };
    }
    return { range: s = l };
  });
  return s ? null : n.update(o, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function sh(n, e) {
  let t = Re(n).resolveInner(e + 1);
  return t.parent && t.from == e;
}
function Fb(n, e, t, i) {
  let r = Re(n).resolveInner(e, -1), s = i.reduce((o, l) => Math.max(o, l.length), 0);
  for (let o = 0; o < 5; o++) {
    let l = n.sliceDoc(r.from, Math.min(r.to, r.from + t.length + s)), a = l.indexOf(t);
    if (!a || a > -1 && i.indexOf(l.slice(0, a)) > -1) {
      let c = r.firstChild;
      for (; c && c.from == r.from && c.to - c.from > t.length + a; ) {
        if (n.sliceDoc(c.to - t.length, c.to) == t)
          return !1;
        c = c.firstChild;
      }
      return !0;
    }
    let h = r.to == e && r.parent;
    if (!h)
      break;
    r = h;
  }
  return !1;
}
function oh(n, e, t) {
  let i = n.charCategorizer(e);
  if (i(n.sliceDoc(e - 1, e)) != ae.Word)
    return e;
  for (let r of t) {
    let s = e - r.length;
    if (n.sliceDoc(s, e) == r && i(n.sliceDoc(s - 1, s)) != ae.Word)
      return s;
  }
  return -1;
}
function Nb(n = {}) {
  return [
    Sb,
    Ue,
    Me.of(n),
    wb,
    Ib,
    Cb
  ];
}
const hu = [
  { key: "Ctrl-Space", run: rh },
  { mac: "Alt-`", run: rh },
  { key: "Escape", run: yb },
  { key: "ArrowDown", run: /* @__PURE__ */ rr(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ rr(!1) },
  { key: "PageDown", run: /* @__PURE__ */ rr(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ rr(!1, "page") },
  { key: "Enter", run: mb }
], Ib = /* @__PURE__ */ di.highest(/* @__PURE__ */ $o.computeN([Me], (n) => n.facet(Me).defaultKeymap ? [hu] : []));
class lh {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.diagnostic = i;
  }
}
class ii {
  constructor(e, t, i) {
    this.diagnostics = e, this.panel = t, this.selected = i;
  }
  static init(e, t, i) {
    let r = i.facet(St).markerFilter;
    r && (e = r(e, i));
    let s = e.slice().sort((c, f) => c.from - f.from || c.to - f.to), o = new Lt(), l = [], a = 0;
    for (let c = 0; ; ) {
      let f = c == s.length ? null : s[c];
      if (!f && !l.length)
        break;
      let d, g;
      for (l.length ? (d = a, g = l.reduce((b, x) => Math.min(b, x.to), f && f.from > d ? f.from : 1e8)) : (d = f.from, g = f.to, l.push(f), c++); c < s.length; ) {
        let b = s[c];
        if (b.from == d && (b.to > b.from || b.to == d))
          l.push(b), c++, g = Math.min(b.to, g);
        else {
          g = Math.min(b.from, g);
          break;
        }
      }
      let y = mu(l);
      if (l.some((b) => b.from == b.to || b.from == b.to - 1 && i.doc.lineAt(b.from).to == b.from))
        o.add(d, d, W.widget({
          widget: new Gb(y),
          diagnostics: l.slice()
        }));
      else {
        let b = l.reduce((x, k) => k.markClass ? x + " " + k.markClass : x, "");
        o.add(d, g, W.mark({
          class: "cm-lintRange cm-lintRange-" + y + b,
          diagnostics: l.slice(),
          inclusiveEnd: l.some((x) => x.to > g)
        }));
      }
      a = g;
      for (let b = 0; b < l.length; b++)
        l[b].to <= a && l.splice(b--, 1);
    }
    let h = o.finish();
    return new ii(h, t, Ni(h));
  }
}
function Ni(n, e = null, t = 0) {
  let i = null;
  return n.between(t, 1e9, (r, s, { spec: o }) => {
    if (!(e && o.diagnostics.indexOf(e) < 0))
      if (!i)
        i = new lh(r, s, e || o.diagnostics[0]);
      else {
        if (o.diagnostics.indexOf(i.diagnostic) < 0)
          return !1;
        i = new lh(i.from, s, i.diagnostic);
      }
  }), i;
}
function cu(n, e) {
  let t = e.pos, i = e.end || t, r = n.state.facet(St).hideOn(n, t, i);
  if (r != null)
    return r;
  let s = n.startState.doc.lineAt(e.pos);
  return !!(n.effects.some((o) => o.is(_r)) || n.changes.touchesRange(s.from, Math.max(s.to, i)));
}
function fu(n, e) {
  return n.field(Qe, !1) ? e : e.concat(z.appendConfig.of(xu));
}
function Hb(n, e) {
  return {
    effects: fu(n, [_r.of(e)])
  };
}
const _r = /* @__PURE__ */ z.define(), fl = /* @__PURE__ */ z.define(), uu = /* @__PURE__ */ z.define(), Qe = /* @__PURE__ */ Se.define({
  create() {
    return new ii(W.none, null, null);
  },
  update(n, e) {
    if (e.docChanged && n.diagnostics.size) {
      let t = n.diagnostics.map(e.changes), i = null, r = n.panel;
      if (n.selected) {
        let s = e.changes.mapPos(n.selected.from, 1);
        i = Ni(t, n.selected.diagnostic, s) || Ni(t, null, s);
      }
      !t.size && r && e.state.facet(St).autoPanel && (r = null), n = new ii(t, r, i);
    }
    for (let t of e.effects)
      if (t.is(_r)) {
        let i = e.state.facet(St).autoPanel ? t.value.length ? Cn.open : null : n.panel;
        n = ii.init(t.value, i, e.state);
      } else t.is(fl) ? n = new ii(n.diagnostics, t.value ? Cn.open : null, n.selected) : t.is(uu) && (n = new ii(n.diagnostics, n.panel, t.value));
    return n;
  },
  provide: (n) => [
    yn.from(n, (e) => e.panel),
    N.decorations.from(n, (e) => e.diagnostics)
  ]
}), Vb = /* @__PURE__ */ W.mark({ class: "cm-lintRange cm-lintRange-active" });
function Wb(n, e, t) {
  let { diagnostics: i } = n.state.field(Qe), r, s = -1, o = -1;
  i.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (a, h, { spec: c }) => {
    if (e >= a && e <= h && (a == h || (e > a || t > 0) && (e < h || t < 0)))
      return r = c.diagnostics, s = a, o = h, !1;
  });
  let l = n.state.facet(St).tooltipFilter;
  return r && l && (r = l(r, n.state)), r ? {
    pos: s,
    end: o,
    above: n.state.doc.lineAt(s).to < o,
    create() {
      return { dom: du(n, r) };
    }
  } : null;
}
function du(n, e) {
  return te("ul", { class: "cm-tooltip-lint" }, e.map((t) => gu(n, t, !1)));
}
const zb = (n) => {
  let e = n.state.field(Qe, !1);
  (!e || !e.panel) && n.dispatch({ effects: fu(n.state, [fl.of(!0)]) });
  let t = mn(n, Cn.open);
  return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, ah = (n) => {
  let e = n.state.field(Qe, !1);
  return !e || !e.panel ? !1 : (n.dispatch({ effects: fl.of(!1) }), !0);
}, qb = (n) => {
  let e = n.state.field(Qe, !1);
  if (!e)
    return !1;
  let t = n.state.selection.main, i = e.diagnostics.iter(t.to + 1);
  return !i.value && (i = e.diagnostics.iter(0), !i.value || i.from == t.from && i.to == t.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), !0);
}, Kb = [
  { key: "Mod-Shift-m", run: zb, preventDefault: !0 },
  { key: "F8", run: qb }
], $b = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.timeout = -1, this.set = !0;
    let { delay: e } = n.state.facet(St);
    this.lintTime = Date.now() + e, this.run = this.run.bind(this), this.timeout = setTimeout(this.run, e);
  }
  run() {
    clearTimeout(this.timeout);
    let n = Date.now();
    if (n < this.lintTime - 10)
      this.timeout = setTimeout(this.run, this.lintTime - n);
    else {
      this.set = !1;
      let { state: e } = this.view, { sources: t } = e.facet(St);
      t.length && jb(t.map((i) => Promise.resolve(i(this.view))), (i) => {
        this.view.state.doc == e.doc && this.view.dispatch(Hb(this.view.state, i.reduce((r, s) => r.concat(s))));
      }, (i) => {
        Ve(this.view.state, i);
      });
    }
  }
  update(n) {
    let e = n.state.facet(St);
    (n.docChanged || e != n.startState.facet(St) || e.needsRefresh && e.needsRefresh(n)) && (this.lintTime = Date.now() + e.delay, this.set || (this.set = !0, this.timeout = setTimeout(this.run, e.delay)));
  }
  force() {
    this.set && (this.lintTime = Date.now(), this.run());
  }
  destroy() {
    clearTimeout(this.timeout);
  }
});
function jb(n, e, t) {
  let i = [], r = -1;
  for (let s of n)
    s.then((o) => {
      i.push(o), clearTimeout(r), i.length == n.length ? e(i) : r = setTimeout(() => e(i), 200);
    }, t);
}
const St = /* @__PURE__ */ F.define({
  combine(n) {
    return Object.assign({ sources: n.map((e) => e.source).filter((e) => e != null) }, ct(n.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null,
      hideOn: () => null
    }, {
      needsRefresh: (e, t) => e ? t ? (i) => e(i) || t(i) : e : t
    }));
  }
});
function Ub(n, e = {}) {
  return [
    St.of({ source: n, config: e }),
    $b,
    xu
  ];
}
function pu(n) {
  let e = [];
  if (n)
    e: for (let { name: t } of n) {
      for (let i = 0; i < t.length; i++) {
        let r = t[i];
        if (/[a-zA-Z]/.test(r) && !e.some((s) => s.toLowerCase() == r.toLowerCase())) {
          e.push(r);
          continue e;
        }
      }
      e.push("");
    }
  return e;
}
function gu(n, e, t) {
  var i;
  let r = t ? pu(e.actions) : [];
  return te("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, te("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage(n) : e.message), (i = e.actions) === null || i === void 0 ? void 0 : i.map((s, o) => {
    let l = !1, a = (d) => {
      if (d.preventDefault(), l)
        return;
      l = !0;
      let g = Ni(n.state.field(Qe).diagnostics, e);
      g && s.apply(n, g.from, g.to);
    }, { name: h } = s, c = r[o] ? h.indexOf(r[o]) : -1, f = c < 0 ? h : [
      h.slice(0, c),
      te("u", h.slice(c, c + 1)),
      h.slice(c + 1)
    ];
    return te("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${c < 0 ? "" : ` (access key "${r[o]})"`}.`
    }, f);
  }), e.source && te("div", { class: "cm-diagnosticSource" }, e.source));
}
class Gb extends Xt {
  constructor(e) {
    super(), this.sev = e;
  }
  eq(e) {
    return e.sev == this.sev;
  }
  toDOM() {
    return te("span", { class: "cm-lintPoint cm-lintPoint-" + this.sev });
  }
}
class hh {
  constructor(e, t) {
    this.diagnostic = t, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = gu(e, t, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class Cn {
  constructor(e) {
    this.view = e, this.items = [];
    let t = (r) => {
      if (r.keyCode == 27)
        ah(this.view), this.view.focus();
      else if (r.keyCode == 38 || r.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (r.keyCode == 40 || r.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (r.keyCode == 36)
        this.moveSelection(0);
      else if (r.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (r.keyCode == 13)
        this.view.focus();
      else if (r.keyCode >= 65 && r.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: s } = this.items[this.selectedIndex], o = pu(s.actions);
        for (let l = 0; l < o.length; l++)
          if (o[l].toUpperCase().charCodeAt(0) == r.keyCode) {
            let a = Ni(this.view.state.field(Qe).diagnostics, s);
            a && s.actions[l].apply(e, a.from, a.to);
          }
      } else
        return;
      r.preventDefault();
    }, i = (r) => {
      for (let s = 0; s < this.items.length; s++)
        this.items[s].dom.contains(r.target) && this.moveSelection(s);
    };
    this.list = te("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: t,
      onclick: i
    }), this.dom = te("div", { class: "cm-panel-lint" }, this.list, te("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => ah(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(Qe).selected;
    if (!e)
      return -1;
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].diagnostic == e.diagnostic)
        return t;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: t } = this.view.state.field(Qe), i = 0, r = !1, s = null, o = /* @__PURE__ */ new Set();
    for (e.between(0, this.view.state.doc.length, (l, a, { spec: h }) => {
      for (let c of h.diagnostics) {
        if (o.has(c))
          continue;
        o.add(c);
        let f = -1, d;
        for (let g = i; g < this.items.length; g++)
          if (this.items[g].diagnostic == c) {
            f = g;
            break;
          }
        f < 0 ? (d = new hh(this.view, c), this.items.splice(i, 0, d), r = !0) : (d = this.items[f], f > i && (this.items.splice(i, f - i), r = !0)), t && d.diagnostic == t.diagnostic ? d.dom.hasAttribute("aria-selected") || (d.dom.setAttribute("aria-selected", "true"), s = d) : d.dom.hasAttribute("aria-selected") && d.dom.removeAttribute("aria-selected"), i++;
      }
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      r = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new hh(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), r = !0), s ? (this.list.setAttribute("aria-activedescendant", s.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: s.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: l, panel: a }) => {
        let h = a.height / this.list.offsetHeight;
        l.top < a.top ? this.list.scrollTop -= (a.top - l.top) / h : l.bottom > a.bottom && (this.list.scrollTop += (l.bottom - a.bottom) / h);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), r && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function t() {
      let i = e;
      e = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; e != i.dom; )
          t();
        e = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, e);
    for (; e; )
      t();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let t = this.view.state.field(Qe), i = Ni(t.diagnostics, this.items[e].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: uu.of(i)
    });
  }
  static open(e) {
    return new Cn(e);
  }
}
function mr(n, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(n)}</svg>')`;
}
function sr(n) {
  return mr(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const Yb = /* @__PURE__ */ N.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ sr("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ sr("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ sr("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ sr("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
});
function Jb(n) {
  return n == "error" ? 4 : n == "warning" ? 3 : n == "info" ? 2 : 1;
}
function mu(n) {
  let e = "hint", t = 1;
  for (let i of n) {
    let r = Jb(i.severity);
    r > t && (t = r, e = i.severity);
  }
  return e;
}
class yu extends Mt {
  constructor(e) {
    super(), this.diagnostics = e, this.severity = mu(e);
  }
  toDOM(e) {
    let t = document.createElement("div");
    t.className = "cm-lint-marker cm-lint-marker-" + this.severity;
    let i = this.diagnostics, r = e.state.facet(Qr).tooltipFilter;
    return r && (i = r(i, e.state)), i.length && (t.onmouseover = () => _b(e, t, i)), t;
  }
}
function Xb(n, e) {
  let t = (i) => {
    let r = e.getBoundingClientRect();
    if (!(i.clientX > r.left - 10 && i.clientX < r.right + 10 && i.clientY > r.top - 10 && i.clientY < r.bottom + 10)) {
      for (let s = i.target; s; s = s.parentNode)
        if (s.nodeType == 1 && s.classList.contains("cm-tooltip-lint"))
          return;
      window.removeEventListener("mousemove", t), n.state.field(bu) && n.dispatch({ effects: ul.of(null) });
    }
  };
  window.addEventListener("mousemove", t);
}
function _b(n, e, t) {
  function i() {
    let o = n.elementAtHeight(e.getBoundingClientRect().top + 5 - n.documentTop);
    n.coordsAtPos(o.from) && n.dispatch({ effects: ul.of({
      pos: o.from,
      above: !1,
      clip: !1,
      create() {
        return {
          dom: du(n, t),
          getCoords: () => e.getBoundingClientRect()
        };
      }
    }) }), e.onmouseout = e.onmousemove = null, Xb(n, e);
  }
  let { hoverTime: r } = n.state.facet(Qr), s = setTimeout(i, r);
  e.onmouseout = () => {
    clearTimeout(s), e.onmouseout = e.onmousemove = null;
  }, e.onmousemove = () => {
    clearTimeout(s), s = setTimeout(i, r);
  };
}
function Qb(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r of e) {
    let s = n.lineAt(r.from);
    (t[s.from] || (t[s.from] = [])).push(r);
  }
  let i = [];
  for (let r in t)
    i.push(new yu(t[r]).range(+r));
  return j.of(i, !0);
}
const Zb = /* @__PURE__ */ Ic({
  class: "cm-gutter-lint",
  markers: (n) => n.state.field(Oo),
  widgetMarker: (n, e, t) => {
    let i = [];
    return n.state.field(Oo).between(t.from, t.to, (r, s, o) => {
      r > t.from && r < t.to && i.push(...o.diagnostics);
    }), i.length ? new yu(i) : null;
  }
}), Oo = /* @__PURE__ */ Se.define({
  create() {
    return j.empty;
  },
  update(n, e) {
    n = n.map(e.changes);
    let t = e.state.facet(Qr).markerFilter;
    for (let i of e.effects)
      if (i.is(_r)) {
        let r = i.value;
        t && (r = t(r || [], e.state)), n = Qb(e.state.doc, r.slice(0));
      }
    return n;
  }
}), ul = /* @__PURE__ */ z.define(), bu = /* @__PURE__ */ Se.define({
  create() {
    return null;
  },
  update(n, e) {
    return n && e.docChanged && (n = cu(e, n) ? null : Object.assign(Object.assign({}, n), { pos: e.changes.mapPos(n.pos) })), e.effects.reduce((t, i) => i.is(ul) ? i.value : t, n);
  },
  provide: (n) => zr.from(n)
}), e1 = /* @__PURE__ */ N.baseTheme({
  ".cm-gutter-lint": {
    width: "1.4em",
    "& .cm-gutterElement": {
      padding: ".2em"
    }
  },
  ".cm-lint-marker": {
    width: "1em",
    height: "1em"
  },
  ".cm-lint-marker-info": {
    content: /* @__PURE__ */ mr('<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>')
  },
  ".cm-lint-marker-warning": {
    content: /* @__PURE__ */ mr('<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>')
  },
  ".cm-lint-marker-error": {
    content: /* @__PURE__ */ mr('<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>')
  }
}), xu = [
  Qe,
  /* @__PURE__ */ N.decorations.compute([Qe], (n) => {
    let { selected: e, panel: t } = n.field(Qe);
    return !e || !t || e.from == e.to ? W.none : W.set([
      Vb.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ Wg(Wb, { hideOn: cu }),
  Yb
], Qr = /* @__PURE__ */ F.define({
  combine(n) {
    return ct(n, {
      hoverTime: 300,
      markerFilter: null,
      tooltipFilter: null
    });
  }
});
function v1(n = {}) {
  return [Qr.of(n), Oo, Zb, e1, bu];
}
const w1 = [
  Xg(),
  Zg(),
  yg(),
  w0(),
  $m(),
  og(),
  fg(),
  X.allowMultipleSelections.of(!0),
  Em(),
  rf(Ym, { fallback: !0 }),
  t0(),
  Ab(),
  Nb(),
  Tg(),
  Lg(),
  Sg(),
  Ty(),
  $o.of([
    ...Tb,
    ...Sy,
    ...Yy,
    ...E0,
    ...Wm,
    ...hu,
    ...Kb
  ])
];
function t1(n) {
  return new RegExp("^(?:" + n.join("|") + ")", "i");
}
function Zr(n) {
  return new RegExp("^(?:" + n.join("|") + ")$", "i");
}
var i1 = Zr([
  "_G",
  "_VERSION",
  "assert",
  "collectgarbage",
  "dofile",
  "error",
  "getfenv",
  "getmetatable",
  "ipairs",
  "load",
  "loadfile",
  "loadstring",
  "module",
  "next",
  "pairs",
  "pcall",
  "print",
  "rawequal",
  "rawget",
  "rawset",
  "require",
  "select",
  "setfenv",
  "setmetatable",
  "tonumber",
  "tostring",
  "type",
  "unpack",
  "xpcall",
  "coroutine.create",
  "coroutine.resume",
  "coroutine.running",
  "coroutine.status",
  "coroutine.wrap",
  "coroutine.yield",
  "debug.debug",
  "debug.getfenv",
  "debug.gethook",
  "debug.getinfo",
  "debug.getlocal",
  "debug.getmetatable",
  "debug.getregistry",
  "debug.getupvalue",
  "debug.setfenv",
  "debug.sethook",
  "debug.setlocal",
  "debug.setmetatable",
  "debug.setupvalue",
  "debug.traceback",
  "close",
  "flush",
  "lines",
  "read",
  "seek",
  "setvbuf",
  "write",
  "io.close",
  "io.flush",
  "io.input",
  "io.lines",
  "io.open",
  "io.output",
  "io.popen",
  "io.read",
  "io.stderr",
  "io.stdin",
  "io.stdout",
  "io.tmpfile",
  "io.type",
  "io.write",
  "math.abs",
  "math.acos",
  "math.asin",
  "math.atan",
  "math.atan2",
  "math.ceil",
  "math.cos",
  "math.cosh",
  "math.deg",
  "math.exp",
  "math.floor",
  "math.fmod",
  "math.frexp",
  "math.huge",
  "math.ldexp",
  "math.log",
  "math.log10",
  "math.max",
  "math.min",
  "math.modf",
  "math.pi",
  "math.pow",
  "math.rad",
  "math.random",
  "math.randomseed",
  "math.sin",
  "math.sinh",
  "math.sqrt",
  "math.tan",
  "math.tanh",
  "os.clock",
  "os.date",
  "os.difftime",
  "os.execute",
  "os.exit",
  "os.getenv",
  "os.remove",
  "os.rename",
  "os.setlocale",
  "os.time",
  "os.tmpname",
  "package.cpath",
  "package.loaded",
  "package.loaders",
  "package.loadlib",
  "package.path",
  "package.preload",
  "package.seeall",
  "string.byte",
  "string.char",
  "string.dump",
  "string.find",
  "string.format",
  "string.gmatch",
  "string.gsub",
  "string.len",
  "string.lower",
  "string.match",
  "string.rep",
  "string.reverse",
  "string.sub",
  "string.upper",
  "table.concat",
  "table.insert",
  "table.maxn",
  "table.remove",
  "table.sort"
]), n1 = Zr([
  "and",
  "break",
  "elseif",
  "false",
  "nil",
  "not",
  "or",
  "return",
  "true",
  "function",
  "end",
  "if",
  "then",
  "else",
  "do",
  "while",
  "repeat",
  "until",
  "for",
  "in",
  "local"
]), r1 = Zr(["function", "if", "repeat", "do", "\\(", "{"]), s1 = Zr(["end", "until", "\\)", "}"]), o1 = t1(["end", "until", "\\)", "}", "else", "elseif"]);
function ch(n) {
  for (var e = 0; n.eat("="); ) ++e;
  return n.eat("["), e;
}
function dl(n, e) {
  var t = n.next();
  return t == "-" && n.eat("-") ? n.eat("[") && n.eat("[") ? (e.cur = fh(ch(n), "comment"))(n, e) : (n.skipToEnd(), "comment") : t == '"' || t == "'" ? (e.cur = l1(t))(n, e) : t == "[" && /[\[=]/.test(n.peek()) ? (e.cur = fh(ch(n), "string"))(n, e) : /\d/.test(t) ? (n.eatWhile(/[\w.%]/), "number") : /[\w_]/.test(t) ? (n.eatWhile(/[\w\\\-_.]/), "variable") : null;
}
function fh(n, e) {
  return function(t, i) {
    for (var r = null, s; (s = t.next()) != null; )
      if (r == null)
        s == "]" && (r = 0);
      else if (s == "=") ++r;
      else if (s == "]" && r == n) {
        i.cur = dl;
        break;
      } else r = null;
    return e;
  };
}
function l1(n) {
  return function(e, t) {
    for (var i = !1, r; (r = e.next()) != null && !(r == n && !i); )
      i = !i && r == "\\";
    return i || (t.cur = dl), "string";
  };
}
const a1 = {
  name: "lua",
  startState: function() {
    return { basecol: 0, indentDepth: 0, cur: dl };
  },
  token: function(n, e) {
    if (n.eatSpace()) return null;
    var t = e.cur(n, e), i = n.current();
    return t == "variable" && (n1.test(i) ? t = "keyword" : i1.test(i) && (t = "builtin")), t != "comment" && t != "string" && (r1.test(i) ? ++e.indentDepth : s1.test(i) && --e.indentDepth), t;
  },
  indent: function(n, e, t) {
    var i = o1.test(e);
    return n.basecol + t.unit * (n.indentDepth - (i ? 1 : 0));
  },
  languageData: {
    indentOnInput: /^\s*(?:end|until|else|\)|\})$/,
    commentTokens: { line: "--", block: { open: "--[[", close: "]]--" } }
  }
};
var To = {};
function pl(n, e) {
  for (var t = 0; t < e.length; t++)
    To[e[t]] = n;
}
var vu = ["true", "false"], wu = [
  "if",
  "then",
  "do",
  "else",
  "elif",
  "while",
  "until",
  "for",
  "in",
  "esac",
  "fi",
  "fin",
  "fil",
  "done",
  "exit",
  "set",
  "unset",
  "export",
  "function"
], ku = [
  "ab",
  "awk",
  "bash",
  "beep",
  "cat",
  "cc",
  "cd",
  "chown",
  "chmod",
  "chroot",
  "clear",
  "cp",
  "curl",
  "cut",
  "diff",
  "echo",
  "find",
  "gawk",
  "gcc",
  "get",
  "git",
  "grep",
  "hg",
  "kill",
  "killall",
  "ln",
  "ls",
  "make",
  "mkdir",
  "openssl",
  "mv",
  "nc",
  "nl",
  "node",
  "npm",
  "ping",
  "ps",
  "restart",
  "rm",
  "rmdir",
  "sed",
  "service",
  "sh",
  "shopt",
  "shred",
  "source",
  "sort",
  "sleep",
  "ssh",
  "start",
  "stop",
  "su",
  "sudo",
  "svn",
  "tee",
  "telnet",
  "top",
  "touch",
  "vi",
  "vim",
  "wall",
  "wc",
  "wget",
  "who",
  "write",
  "yes",
  "zsh"
];
pl("atom", vu);
pl("keyword", wu);
pl("builtin", ku);
function h1(n, e) {
  if (n.eatSpace()) return null;
  var t = n.sol(), i = n.next();
  if (i === "\\")
    return n.next(), null;
  if (i === "'" || i === '"' || i === "`")
    return e.tokens.unshift(es(i, i === "`" ? "quote" : "string")), Ii(n, e);
  if (i === "#")
    return t && n.eat("!") ? (n.skipToEnd(), "meta") : (n.skipToEnd(), "comment");
  if (i === "$")
    return e.tokens.unshift(Su), Ii(n, e);
  if (i === "+" || i === "=")
    return "operator";
  if (i === "-")
    return n.eat("-"), n.eatWhile(/\w/), "attribute";
  if (i == "<") {
    if (n.match("<<")) return "operator";
    var r = n.match(/^<-?\s*(?:['"]([^'"]*)['"]|([^'"\s]*))/);
    if (r)
      return e.tokens.unshift(f1(r[1] || r[2])), "string.special";
  }
  if (/\d/.test(i) && (n.eatWhile(/\d/), n.eol() || !/\w/.test(n.peek())))
    return "number";
  n.eatWhile(/[\w-]/);
  var s = n.current();
  return n.peek() === "=" && /\w+/.test(s) ? "def" : To.hasOwnProperty(s) ? To[s] : null;
}
function es(n, e) {
  var t = n == "(" ? ")" : n == "{" ? "}" : n;
  return function(i, r) {
    for (var s, o = !1; (s = i.next()) != null; ) {
      if (s === t && !o) {
        r.tokens.shift();
        break;
      } else if (s === "$" && !o && n !== "'" && i.peek() != t) {
        o = !0, i.backUp(1), r.tokens.unshift(Su);
        break;
      } else {
        if (!o && n !== t && s === n)
          return r.tokens.unshift(es(n, e)), Ii(i, r);
        if (!o && /['"]/.test(s) && !/['"]/.test(n)) {
          r.tokens.unshift(c1(s, "string")), i.backUp(1);
          break;
        }
      }
      o = !o && s === "\\";
    }
    return e;
  };
}
function c1(n, e) {
  return function(t, i) {
    return i.tokens[0] = es(n, e), t.next(), Ii(t, i);
  };
}
var Su = function(n, e) {
  e.tokens.length > 1 && n.eat("$");
  var t = n.next();
  return /['"({]/.test(t) ? (e.tokens[0] = es(t, t == "(" ? "quote" : t == "{" ? "def" : "string"), Ii(n, e)) : (/\d/.test(t) || n.eatWhile(/\w/), e.tokens.shift(), "def");
};
function f1(n) {
  return function(e, t) {
    return e.sol() && e.string == n && t.tokens.shift(), e.skipToEnd(), "string.special";
  };
}
function Ii(n, e) {
  return (e.tokens[0] || h1)(n, e);
}
const u1 = {
  name: "shell",
  startState: function() {
    return { tokens: [] };
  },
  token: function(n, e) {
    return Ii(n, e);
  },
  languageData: {
    autocomplete: vu.concat(wu, ku),
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "#" }
  }
}, Ne = ({ variant: n, settings: e, styles: t }) => {
  const i = N.theme({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "&": {
      backgroundColor: e.background,
      color: e.foreground
    },
    ".cm-content": {
      caretColor: e.caret
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: e.caret
    },
    "&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: e.selection
    },
    ".cm-activeLine": {
      backgroundColor: e.lineHighlight
    },
    ".cm-gutters": {
      backgroundColor: e.gutterBackground,
      color: e.gutterForeground
    },
    ".cm-activeLineGutter": {
      backgroundColor: e.lineHighlight
    }
  }, {
    dark: n === "dark"
  }), r = Tn.define(t);
  return [i, rf(r)];
};
Ne({
  variant: "dark",
  settings: {
    background: "#200020",
    foreground: "#D0D0FF",
    caret: "#7070FF",
    selection: "#80000080",
    gutterBackground: "#200020",
    gutterForeground: "#C080C0",
    lineHighlight: "#80000040"
  },
  styles: [
    {
      tag: p.comment,
      color: "#404080"
    },
    {
      tag: [p.string, p.regexp],
      color: "#999999"
    },
    {
      tag: p.number,
      color: "#7090B0"
    },
    {
      tag: [p.bool, p.null],
      color: "#8080A0"
    },
    {
      tag: [p.punctuation, p.derefOperator],
      color: "#805080"
    },
    {
      tag: p.keyword,
      color: "#60B0FF"
    },
    {
      tag: p.definitionKeyword,
      color: "#B0FFF0"
    },
    {
      tag: p.moduleKeyword,
      color: "#60B0FF"
    },
    {
      tag: p.operator,
      color: "#A0A0FF"
    },
    {
      tag: [p.variableName, p.self],
      color: "#008080"
    },
    {
      tag: p.operatorKeyword,
      color: "#A0A0FF"
    },
    {
      tag: p.controlKeyword,
      color: "#80A0FF"
    },
    {
      tag: p.className,
      color: "#70E080"
    },
    {
      tag: [p.function(p.propertyName), p.propertyName],
      color: "#50A0A0"
    },
    {
      tag: p.tagName,
      color: "#009090"
    },
    {
      tag: p.modifier,
      color: "#B0FFF0"
    },
    {
      tag: [p.squareBracket, p.attributeName],
      color: "#D0D0FF"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#fcfcfc",
    foreground: "#5c6166",
    caret: "#ffaa33",
    selection: "#036dd626",
    gutterBackground: "#fcfcfc",
    gutterForeground: "#8a919966",
    lineHighlight: "#8a91991a"
  },
  styles: [
    {
      tag: p.comment,
      color: "#787b8099"
    },
    {
      tag: p.string,
      color: "#86b300"
    },
    {
      tag: p.regexp,
      color: "#4cbf99"
    },
    {
      tag: [p.number, p.bool, p.null],
      color: "#ffaa33"
    },
    {
      tag: p.variableName,
      color: "#5c6166"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#fa8d3e"
    },
    {
      tag: [p.keyword, p.special(p.brace)],
      color: "#fa8d3e"
    },
    {
      tag: p.operator,
      color: "#ed9366"
    },
    {
      tag: p.separator,
      color: "#5c6166b3"
    },
    {
      tag: p.punctuation,
      color: "#5c6166"
    },
    {
      tag: [p.definition(p.propertyName), p.function(p.variableName)],
      color: "#f2ae49"
    },
    {
      tag: [p.className, p.definition(p.typeName)],
      color: "#22a4e6"
    },
    {
      tag: [p.tagName, p.typeName, p.self, p.labelName],
      color: "#55b4d4"
    },
    {
      tag: p.angleBracket,
      color: "#55b4d480"
    },
    {
      tag: p.attributeName,
      color: "#f2ae49"
    }
  ]
});
Ne({
  variant: "dark",
  settings: {
    background: "#15191EFA",
    foreground: "#EEF2F7",
    caret: "#C4C4C4",
    selection: "#90B2D557",
    gutterBackground: "#15191EFA",
    gutterForeground: "#aaaaaa95",
    lineHighlight: "#57575712"
  },
  styles: [
    {
      tag: p.comment,
      color: "#6E6E6E"
    },
    {
      tag: [p.string, p.regexp, p.special(p.brace)],
      color: "#5C81B3"
    },
    {
      tag: p.number,
      color: "#C1E1B8"
    },
    {
      tag: p.bool,
      color: "#53667D"
    },
    {
      tag: [p.definitionKeyword, p.modifier, p.function(p.propertyName)],
      color: "#A3D295",
      fontWeight: "bold"
    },
    {
      tag: [p.keyword, p.moduleKeyword, p.operatorKeyword, p.operator],
      color: "#697A8E",
      fontWeight: "bold"
    },
    {
      tag: [p.variableName, p.attributeName],
      color: "#708E67"
    },
    {
      tag: [
        p.function(p.variableName),
        p.definition(p.propertyName),
        p.derefOperator
      ],
      color: "#fff"
    },
    {
      tag: p.tagName,
      color: "#A3D295"
    }
  ]
});
Ne({
  variant: "dark",
  settings: {
    background: "#2e241d",
    foreground: "#BAAE9E",
    caret: "#A7A7A7",
    selection: "#DDF0FF33",
    gutterBackground: "#28211C",
    gutterForeground: "#BAAE9E90",
    lineHighlight: "#FFFFFF08"
  },
  styles: [
    {
      tag: p.comment,
      color: "#666666"
    },
    {
      tag: [p.string, p.special(p.brace)],
      color: "#54BE0D"
    },
    {
      tag: p.regexp,
      color: "#E9C062"
    },
    {
      tag: p.number,
      color: "#CF6A4C"
    },
    {
      tag: [p.keyword, p.operator],
      color: "#5EA6EA"
    },
    {
      tag: p.variableName,
      color: "#7587A6"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#F9EE98"
    },
    {
      tag: [p.propertyName, p.function(p.variableName)],
      color: "#937121"
    },
    {
      tag: [p.typeName, p.angleBracket, p.tagName],
      color: "#9B859D"
    }
  ]
});
Ne({
  variant: "dark",
  settings: {
    background: "#3b2627",
    foreground: "#E6E1C4",
    caret: "#E6E1C4",
    selection: "#16120E",
    gutterBackground: "#3b2627",
    gutterForeground: "#E6E1C490",
    lineHighlight: "#1F1611"
  },
  styles: [
    {
      tag: p.comment,
      color: "#6B4E32"
    },
    {
      tag: [p.keyword, p.operator, p.derefOperator],
      color: "#EF5D32"
    },
    {
      tag: p.className,
      color: "#EFAC32",
      fontWeight: "bold"
    },
    {
      tag: [
        p.typeName,
        p.propertyName,
        p.function(p.variableName),
        p.definition(p.variableName)
      ],
      color: "#EFAC32"
    },
    {
      tag: p.definition(p.typeName),
      color: "#EFAC32",
      fontWeight: "bold"
    },
    {
      tag: p.labelName,
      color: "#EFAC32",
      fontWeight: "bold"
    },
    {
      tag: [p.number, p.bool],
      color: "#6C99BB"
    },
    {
      tag: [p.variableName, p.self],
      color: "#7DAF9C"
    },
    {
      tag: [p.string, p.special(p.brace), p.regexp],
      color: "#D9D762"
    },
    {
      tag: [p.angleBracket, p.tagName, p.attributeName],
      color: "#EFCB43"
    }
  ]
});
Ne({
  variant: "dark",
  settings: {
    background: "#000205",
    foreground: "#FFFFFF",
    caret: "#E60065",
    selection: "#E60C6559",
    gutterBackground: "#000205",
    gutterForeground: "#ffffff90",
    lineHighlight: "#4DD7FC1A"
  },
  styles: [
    {
      tag: p.comment,
      color: "#404040"
    },
    {
      tag: [p.string, p.special(p.brace), p.regexp],
      color: "#00D8FF"
    },
    {
      tag: p.number,
      color: "#E62286"
    },
    {
      tag: [p.variableName, p.attributeName, p.self],
      color: "#E62286",
      fontWeight: "bold"
    },
    {
      tag: p.function(p.variableName),
      color: "#fff",
      fontWeight: "bold"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#fff",
    foreground: "#000",
    caret: "#000",
    selection: "#BDD5FC",
    gutterBackground: "#fff",
    gutterForeground: "#00000070",
    lineHighlight: "#FFFBD1"
  },
  styles: [
    {
      tag: p.comment,
      color: "#BCC8BA"
    },
    {
      tag: [p.string, p.special(p.brace), p.regexp],
      color: "#5D90CD"
    },
    {
      tag: [p.number, p.bool, p.null],
      color: "#46A609"
    },
    {
      tag: p.keyword,
      color: "#AF956F"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#C52727"
    },
    {
      tag: [p.angleBracket, p.tagName, p.attributeName],
      color: "#606060"
    },
    {
      tag: p.self,
      color: "#000"
    }
  ]
});
Ne({
  variant: "dark",
  settings: {
    background: "#00254b",
    foreground: "#FFFFFF",
    caret: "#FFFFFF",
    selection: "#B36539BF",
    gutterBackground: "#00254b",
    gutterForeground: "#FFFFFF70",
    lineHighlight: "#00000059"
  },
  styles: [
    {
      tag: p.comment,
      color: "#0088FF"
    },
    {
      tag: p.string,
      color: "#3AD900"
    },
    {
      tag: p.regexp,
      color: "#80FFC2"
    },
    {
      tag: [p.number, p.bool, p.null],
      color: "#FF628C"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#FFEE80"
    },
    {
      tag: p.variableName,
      color: "#CCCCCC"
    },
    {
      tag: p.self,
      color: "#FF80E1"
    },
    {
      tag: [
        p.className,
        p.definition(p.propertyName),
        p.function(p.variableName),
        p.definition(p.typeName),
        p.labelName
      ],
      color: "#FFDD00"
    },
    {
      tag: [p.keyword, p.operator],
      color: "#FF9D00"
    },
    {
      tag: [p.propertyName, p.typeName],
      color: "#80FFBB"
    },
    {
      tag: p.special(p.brace),
      color: "#EDEF7D"
    },
    {
      tag: p.attributeName,
      color: "#9EFFFF"
    },
    {
      tag: p.derefOperator,
      color: "#fff"
    }
  ]
});
Ne({
  variant: "dark",
  settings: {
    background: "#060521",
    foreground: "#E0E0E0",
    caret: "#FFFFFFA6",
    selection: "#122BBB",
    gutterBackground: "#060521",
    gutterForeground: "#E0E0E090",
    lineHighlight: "#FFFFFF0F"
  },
  styles: [
    {
      tag: p.comment,
      color: "#AEAEAE"
    },
    {
      tag: [p.string, p.special(p.brace), p.regexp],
      color: "#8DFF8E"
    },
    {
      tag: [
        p.className,
        p.definition(p.propertyName),
        p.function(p.variableName),
        p.function(p.definition(p.variableName)),
        p.definition(p.typeName)
      ],
      color: "#A3EBFF"
    },
    {
      tag: [p.number, p.bool, p.null],
      color: "#62E9BD"
    },
    {
      tag: [p.keyword, p.operator],
      color: "#2BF1DC"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#F8FBB1"
    },
    {
      tag: [p.variableName, p.self],
      color: "#B683CA"
    },
    {
      tag: [p.angleBracket, p.tagName, p.typeName, p.propertyName],
      color: "#60A4F1"
    },
    {
      tag: p.derefOperator,
      color: "#E0E0E0"
    },
    {
      tag: p.attributeName,
      color: "#7BACCA"
    }
  ]
});
const k1 = Ne({
  variant: "dark",
  settings: {
    background: "#2d2f3f",
    foreground: "#f8f8f2",
    caret: "#f8f8f0",
    selection: "#44475a",
    gutterBackground: "#282a36",
    gutterForeground: "rgb(144, 145, 148)",
    lineHighlight: "#44475a"
  },
  styles: [
    {
      tag: p.comment,
      color: "#6272a4"
    },
    {
      tag: [p.string, p.special(p.brace)],
      color: "#f1fa8c"
    },
    {
      tag: [p.number, p.self, p.bool, p.null],
      color: "#bd93f9"
    },
    {
      tag: [p.keyword, p.operator],
      color: "#ff79c6"
    },
    {
      tag: [p.definitionKeyword, p.typeName],
      color: "#8be9fd"
    },
    {
      tag: p.definition(p.typeName),
      color: "#f8f8f2"
    },
    {
      tag: [
        p.className,
        p.definition(p.propertyName),
        p.function(p.variableName),
        p.attributeName
      ],
      color: "#50fa7b"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#000000",
    caret: "#000000",
    selection: "#80C7FF",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#00000070",
    lineHighlight: "#C1E2F8"
  },
  styles: [
    {
      tag: p.comment,
      color: "#AAAAAA"
    },
    {
      tag: [p.keyword, p.operator, p.typeName, p.tagName, p.propertyName],
      color: "#2F6F9F",
      fontWeight: "bold"
    },
    {
      tag: [p.attributeName, p.definition(p.propertyName)],
      color: "#4F9FD0"
    },
    {
      tag: [p.className, p.string, p.special(p.brace)],
      color: "#CF4F5F"
    },
    {
      tag: p.number,
      color: "#CF4F5F",
      fontWeight: "bold"
    },
    {
      tag: p.variableName,
      fontWeight: "bold"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#f2f1f8",
    foreground: "#0c006b",
    caret: "#5c49e9",
    selection: "#d5d1f2",
    gutterBackground: "#f2f1f8",
    gutterForeground: "#0c006b70",
    lineHighlight: "#e1def3"
  },
  styles: [
    {
      tag: p.comment,
      color: "#9995b7"
    },
    {
      tag: p.keyword,
      color: "#ff5792",
      fontWeight: "bold"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#ff5792"
    },
    {
      tag: [p.className, p.tagName, p.definition(p.typeName)],
      color: "#0094f0"
    },
    {
      tag: [p.number, p.bool, p.null, p.special(p.brace)],
      color: "#5842ff"
    },
    {
      tag: [p.definition(p.propertyName), p.function(p.variableName)],
      color: "#0095a8"
    },
    {
      tag: p.typeName,
      color: "#b3694d"
    },
    {
      tag: [p.propertyName, p.variableName],
      color: "#fa8900"
    },
    {
      tag: p.operator,
      color: "#ff5792"
    },
    {
      tag: p.self,
      color: "#e64100"
    },
    {
      tag: [p.string, p.regexp],
      color: "#00b368"
    },
    {
      tag: [p.paren, p.bracket],
      color: "#0431fa"
    },
    {
      tag: p.labelName,
      color: "#00bdd6"
    },
    {
      tag: p.attributeName,
      color: "#e64100"
    },
    {
      tag: p.angleBracket,
      color: "#9995b7"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#faf4ed",
    foreground: "#575279",
    caret: "#575279",
    selection: "#6e6a8614",
    gutterBackground: "#faf4ed",
    gutterForeground: "#57527970",
    lineHighlight: "#6e6a860d"
  },
  styles: [
    {
      tag: p.comment,
      color: "#9893a5"
    },
    {
      tag: [p.bool, p.null],
      color: "#286983"
    },
    {
      tag: p.number,
      color: "#d7827e"
    },
    {
      tag: p.className,
      color: "#d7827e"
    },
    {
      tag: [p.angleBracket, p.tagName, p.typeName],
      color: "#56949f"
    },
    {
      tag: p.attributeName,
      color: "#907aa9"
    },
    {
      tag: p.punctuation,
      color: "#797593"
    },
    {
      tag: [p.keyword, p.modifier],
      color: "#286983"
    },
    {
      tag: [p.string, p.regexp],
      color: "#ea9d34"
    },
    {
      tag: p.variableName,
      color: "#d7827e"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#000000",
    caret: "#000000",
    selection: "#FFFD0054",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#00000070",
    lineHighlight: "#00000008"
  },
  styles: [
    {
      tag: p.comment,
      color: "#CFCFCF"
    },
    {
      tag: [p.number, p.bool, p.null],
      color: "#E66C29"
    },
    {
      tag: [
        p.className,
        p.definition(p.propertyName),
        p.function(p.variableName),
        p.labelName,
        p.definition(p.typeName)
      ],
      color: "#2EB43B"
    },
    {
      tag: p.keyword,
      color: "#D8B229"
    },
    {
      tag: p.operator,
      color: "#4EA44E",
      fontWeight: "bold"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#925A47"
    },
    {
      tag: p.string,
      color: "#704D3D"
    },
    {
      tag: p.typeName,
      color: "#2F8996"
    },
    {
      tag: [p.variableName, p.propertyName],
      color: "#77ACB0"
    },
    {
      tag: p.self,
      color: "#77ACB0",
      fontWeight: "bold"
    },
    {
      tag: p.regexp,
      color: "#E3965E"
    },
    {
      tag: [p.tagName, p.angleBracket],
      color: "#BAA827"
    },
    {
      tag: p.attributeName,
      color: "#B06520"
    },
    {
      tag: p.derefOperator,
      color: "#000"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#fef7e5",
    foreground: "#586E75",
    caret: "#000000",
    selection: "#073642",
    gutterBackground: "#fef7e5",
    gutterForeground: "#586E7580",
    lineHighlight: "#EEE8D5"
  },
  styles: [
    {
      tag: p.comment,
      color: "#93A1A1"
    },
    {
      tag: p.string,
      color: "#2AA198"
    },
    {
      tag: p.regexp,
      color: "#D30102"
    },
    {
      tag: p.number,
      color: "#D33682"
    },
    {
      tag: p.variableName,
      color: "#268BD2"
    },
    {
      tag: [p.keyword, p.operator, p.punctuation],
      color: "#859900"
    },
    {
      tag: [p.definitionKeyword, p.modifier],
      color: "#073642",
      fontWeight: "bold"
    },
    {
      tag: [p.className, p.self, p.definition(p.propertyName)],
      color: "#268BD2"
    },
    {
      tag: p.function(p.variableName),
      color: "#268BD2"
    },
    {
      tag: [p.bool, p.null],
      color: "#B58900"
    },
    {
      tag: p.tagName,
      color: "#268BD2",
      fontWeight: "bold"
    },
    {
      tag: p.angleBracket,
      color: "#93A1A1"
    },
    {
      tag: p.attributeName,
      color: "#93A1A1"
    },
    {
      tag: p.typeName,
      color: "#859900"
    }
  ]
});
Ne({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#4D4D4C",
    caret: "#AEAFAD",
    selection: "#D6D6D6",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#4D4D4C80",
    lineHighlight: "#EFEFEF"
  },
  styles: [
    {
      tag: p.comment,
      color: "#8E908C"
    },
    {
      tag: [p.variableName, p.self, p.propertyName, p.attributeName, p.regexp],
      color: "#C82829"
    },
    {
      tag: [p.number, p.bool, p.null],
      color: "#F5871F"
    },
    {
      tag: [p.className, p.typeName, p.definition(p.typeName)],
      color: "#C99E00"
    },
    {
      tag: [p.string, p.special(p.brace)],
      color: "#718C00"
    },
    {
      tag: p.operator,
      color: "#3E999F"
    },
    {
      tag: [p.definition(p.propertyName), p.function(p.variableName)],
      color: "#4271AE"
    },
    {
      tag: p.keyword,
      color: "#8959A8"
    },
    {
      tag: p.derefOperator,
      color: "#4D4D4C"
    }
  ]
});
var uh = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function d1(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var tn = { exports: {} }, p1 = tn.exports, dh;
function g1() {
  return dh || (dh = 1, function(n, e) {
    (function(t, i, r) {
      var s = e && !e.nodeType && e, o = n && !n.nodeType && n, l = s && o && typeof uh == "object" && uh, a = o && o.exports === s && s;
      l && (l.global === l || /* istanbul ignore next */
      l.window === l || /* istanbul ignore next */
      l.self === l) && (t = l), r(s && o ? a ? o.exports : s : t[i] = {});
    })(p1, "luaparse", function(t) {
      t.version = "0.3.1";
      var i, r, s, o, l, a = t.defaultOptions = {
        // Explicitly tell the parser when the input ends.
        wait: !1,
        comments: !0,
        scope: !1,
        locations: !1,
        ranges: !1,
        onCreateNode: null,
        onCreateScope: null,
        onDestroyScope: null,
        onLocalDeclaration: null,
        luaVersion: "5.1",
        encodingMode: "none"
      };
      function h(u, m) {
        return m = m || 0, u < 128 ? String.fromCharCode(u) : u < 2048 ? String.fromCharCode(
          m | 192 | u >> 6,
          m | 128 | u & 63
        ) : u < 65536 ? String.fromCharCode(
          m | 224 | u >> 12,
          m | 128 | u >> 6 & 63,
          m | 128 | u & 63
        ) : u < 1114112 ? String.fromCharCode(
          m | 240 | u >> 18,
          m | 128 | u >> 12 & 63,
          m | 128 | u >> 6 & 63,
          m | 128 | u & 63
        ) : null;
      }
      function c(u, m) {
        for (var w = u.toString(16); w.length < m; )
          w = "0" + w;
        return w;
      }
      function f(u) {
        return function(m) {
          var w = u.exec(m);
          if (!w)
            return m;
          H(null, C.invalidCodeUnit, c(w[0].charCodeAt(0), 4).toUpperCase());
        };
      }
      var d = {
        // `pseudo-latin1` encoding mode: assume the input was decoded with the latin1 encoding
        // WARNING: latin1 does **NOT** mean cp1252 here like in the bone-headed WHATWG standard;
        // it means true ISO/IEC 8859-1 identity-mapped to Basic Latin and Latin-1 Supplement blocks
        "pseudo-latin1": {
          fixup: f(/[^\x00-\xff]/),
          encodeByte: function(u) {
            return u === null ? "" : String.fromCharCode(u);
          },
          encodeUTF8: function(u) {
            return h(u);
          }
        },
        // `x-user-defined` encoding mode: assume the input was decoded with the WHATWG `x-user-defined` encoding
        "x-user-defined": {
          fixup: f(/[^\x00-\x7f\uf780-\uf7ff]/),
          encodeByte: function(u) {
            return u === null ? "" : u >= 128 ? String.fromCharCode(u | 63232) : String.fromCharCode(u);
          },
          encodeUTF8: function(u) {
            return h(u, 63232);
          }
        },
        // `none` encoding mode: disregard intrepretation of string literals, leave identifiers as-is
        none: {
          discardStrings: !0,
          fixup: function(u) {
            return u;
          },
          encodeByte: function(u) {
            return "";
          },
          encodeUTF8: function(u) {
            return "";
          }
        }
      }, g = 1, y = 2, b = 4, x = 8, k = 16, D = 32, T = 64, E = 128, O = 256;
      t.tokenTypes = {
        EOF: g,
        StringLiteral: y,
        Keyword: b,
        Identifier: x,
        NumericLiteral: k,
        Punctuator: D,
        BooleanLiteral: T,
        NilLiteral: E,
        VarargLiteral: O
      };
      var C = t.errors = {
        unexpected: "unexpected %1 '%2' near '%3'",
        unexpectedEOF: "unexpected symbol near '<eof>'",
        expected: "'%1' expected near '%2'",
        expectedToken: "%1 expected near '%2'",
        unfinishedString: "unfinished string near '%1'",
        malformedNumber: "malformed number near '%1'",
        decimalEscapeTooLarge: "decimal escape too large near '%1'",
        invalidEscape: "invalid escape sequence near '%1'",
        hexadecimalDigitExpected: "hexadecimal digit expected near '%1'",
        braceExpected: "missing '%1' near '%2'",
        tooLargeCodepoint: "UTF-8 value too large near '%1'",
        unfinishedLongString: "unfinished long string (starting at line %1) near '%2'",
        unfinishedLongComment: "unfinished long comment (starting at line %1) near '%2'",
        ambiguousSyntax: "ambiguous syntax (function call x new statement) near '%1'",
        noLoopToBreak: "no loop to break near '%1'",
        labelAlreadyDefined: "label '%1' already defined on line %2",
        labelNotVisible: "no visible label '%1' for <goto>",
        gotoJumpInLocalScope: "<goto %1> jumps into the scope of local '%2'",
        cannotUseVararg: "cannot use '...' outside a vararg function near '%1'",
        invalidCodeUnit: "code unit U+%1 is not allowed in the current encoding mode"
      }, A = t.ast = {
        labelStatement: function(u) {
          return {
            type: "LabelStatement",
            label: u
          };
        },
        breakStatement: function() {
          return {
            type: "BreakStatement"
          };
        },
        gotoStatement: function(u) {
          return {
            type: "GotoStatement",
            label: u
          };
        },
        returnStatement: function(u) {
          return {
            type: "ReturnStatement",
            arguments: u
          };
        },
        ifStatement: function(u) {
          return {
            type: "IfStatement",
            clauses: u
          };
        },
        ifClause: function(u, m) {
          return {
            type: "IfClause",
            condition: u,
            body: m
          };
        },
        elseifClause: function(u, m) {
          return {
            type: "ElseifClause",
            condition: u,
            body: m
          };
        },
        elseClause: function(u) {
          return {
            type: "ElseClause",
            body: u
          };
        },
        whileStatement: function(u, m) {
          return {
            type: "WhileStatement",
            condition: u,
            body: m
          };
        },
        doStatement: function(u) {
          return {
            type: "DoStatement",
            body: u
          };
        },
        repeatStatement: function(u, m) {
          return {
            type: "RepeatStatement",
            condition: u,
            body: m
          };
        },
        localStatement: function(u, m) {
          return {
            type: "LocalStatement",
            variables: u,
            init: m
          };
        },
        assignmentStatement: function(u, m) {
          return {
            type: "AssignmentStatement",
            variables: u,
            init: m
          };
        },
        callStatement: function(u) {
          return {
            type: "CallStatement",
            expression: u
          };
        },
        functionStatement: function(u, m, w, S) {
          return {
            type: "FunctionDeclaration",
            identifier: u,
            isLocal: w,
            parameters: m,
            body: S
          };
        },
        forNumericStatement: function(u, m, w, S, P) {
          return {
            type: "ForNumericStatement",
            variable: u,
            start: m,
            end: w,
            step: S,
            body: P
          };
        },
        forGenericStatement: function(u, m, w) {
          return {
            type: "ForGenericStatement",
            variables: u,
            iterators: m,
            body: w
          };
        },
        chunk: function(u) {
          return {
            type: "Chunk",
            body: u
          };
        },
        identifier: function(u) {
          return {
            type: "Identifier",
            name: u
          };
        },
        literal: function(u, m, w) {
          return u = u === y ? "StringLiteral" : u === k ? "NumericLiteral" : u === T ? "BooleanLiteral" : u === E ? "NilLiteral" : "VarargLiteral", {
            type: u,
            value: m,
            raw: w
          };
        },
        tableKey: function(u, m) {
          return {
            type: "TableKey",
            key: u,
            value: m
          };
        },
        tableKeyString: function(u, m) {
          return {
            type: "TableKeyString",
            key: u,
            value: m
          };
        },
        tableValue: function(u) {
          return {
            type: "TableValue",
            value: u
          };
        },
        tableConstructorExpression: function(u) {
          return {
            type: "TableConstructorExpression",
            fields: u
          };
        },
        binaryExpression: function(u, m, w) {
          var S = u === "and" || u === "or" ? "LogicalExpression" : "BinaryExpression";
          return {
            type: S,
            operator: u,
            left: m,
            right: w
          };
        },
        unaryExpression: function(u, m) {
          return {
            type: "UnaryExpression",
            operator: u,
            argument: m
          };
        },
        memberExpression: function(u, m, w) {
          return {
            type: "MemberExpression",
            indexer: m,
            identifier: w,
            base: u
          };
        },
        indexExpression: function(u, m) {
          return {
            type: "IndexExpression",
            base: u,
            index: m
          };
        },
        callExpression: function(u, m) {
          return {
            type: "CallExpression",
            base: u,
            arguments: m
          };
        },
        tableCallExpression: function(u, m) {
          return {
            type: "TableCallExpression",
            base: u,
            arguments: m
          };
        },
        stringCallExpression: function(u, m) {
          return {
            type: "StringCallExpression",
            base: u,
            argument: m
          };
        },
        comment: function(u, m) {
          return {
            type: "Comment",
            value: u,
            raw: m
          };
        }
      };
      function R(u) {
        if (Ae) {
          var m = Je.pop();
          m.complete(), m.bless(u);
        }
        return r.onCreateNode && r.onCreateNode(u), u;
      }
      var q = Array.prototype.slice, _ = (
        /* istanbul ignore next */
        function(u, m) {
          for (var w = 0, S = u.length; w < S; ++w)
            if (u[w] === m) return w;
          return -1;
        }
      );
      Array.prototype.indexOf && (_ = function(u, m) {
        return u.indexOf(m);
      });
      function K(u, m, w) {
        for (var S = 0, P = u.length; S < P; ++S)
          if (u[S][m] === w) return S;
        return -1;
      }
      function V(u) {
        var m = q.call(arguments, 1);
        return u = u.replace(/%(\d)/g, function(w, S) {
          return "" + m[S - 1] || /* istanbul ignore next */
          "";
        }), u;
      }
      var Y = (
        /* istanbul ignore next */
        function(u) {
          for (var m = q.call(arguments, 1), w, S, P = 0, G = m.length; P < G; ++P) {
            w = m[P];
            for (S in w)
              Object.prototype.hasOwnProperty.call(w, S) && (u[S] = w[S]);
          }
          return u;
        }
      );
      Object.assign && (Y = Object.assign), t.SyntaxError = SyntaxError;
      function U(u) {
        return Object.create ? Object.create(u, {
          line: { writable: !0, value: u.line },
          index: { writable: !0, value: u.index },
          column: { writable: !0, value: u.column }
        }) : u;
      }
      function H(u) {
        var m = V.apply(null, q.call(arguments, 1)), w, S;
        throw u === null || typeof u.line > "u" ? (S = v - be + 1, w = U(new SyntaxError(V("[%1:%2] %3", he, S, m))), w.index = v, w.line = he, w.column = S) : (S = u.range[0] - u.lineStart, w = U(new SyntaxError(V("[%1:%2] %3", u.line, S, m))), w.line = u.line, w.index = u.range[0], w.column = S), w;
      }
      function ue(u) {
        var m = i.slice(u.range[0], u.range[1]);
        return m || u.value;
      }
      function de(u, m) {
        H(m, C.expectedToken, u, ue(m));
      }
      function Be(u) {
        var m = ue(me);
        if (typeof u.type < "u") {
          var w;
          switch (u.type) {
            case y:
              w = "string";
              break;
            case b:
              w = "keyword";
              break;
            case x:
              w = "identifier";
              break;
            case k:
              w = "number";
              break;
            case D:
              w = "symbol";
              break;
            case T:
              w = "boolean";
              break;
            case E:
              return H(u, C.unexpected, "symbol", "nil", m);
            case g:
              return H(u, C.unexpectedEOF);
          }
          return H(u, C.unexpected, w, ue(u), m);
        }
        return H(u, C.unexpected, "symbol", u, m);
      }
      var v, B, fe, me, qe, Q, he, be;
      t.lex = gi;
      function gi() {
        for (ts(); i.charCodeAt(v) === 45 && i.charCodeAt(v + 1) === 45; )
          Ru(), ts();
        if (v >= s) return {
          type: g,
          value: "<eof>",
          line: he,
          lineStart: be,
          range: [v, v]
        };
        var u = i.charCodeAt(v), m = i.charCodeAt(v + 1);
        if (Q = v, Nu(u)) return Cu();
        switch (u) {
          case 39:
          case 34:
            return Mu();
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
            return gl();
          case 46:
            return Ft(m) ? gl() : m === 46 ? i.charCodeAt(v + 2) === 46 ? Au() : Ce("..") : Ce(".");
          case 61:
            return Ce(m === 61 ? "==" : "=");
          case 62:
            return o.bitwiseOperators && m === 62 ? Ce(">>") : Ce(m === 61 ? ">=" : ">");
          case 60:
            return o.bitwiseOperators && m === 60 ? Ce("<<") : Ce(m === 61 ? "<=" : "<");
          case 126:
            if (m === 61) return Ce("~=");
            if (!o.bitwiseOperators)
              break;
            return Ce("~");
          case 58:
            return o.labels && m === 58 ? Ce("::") : Ce(":");
          case 91:
            return m === 91 || m === 61 ? Du() : Ce("[");
          case 47:
            return o.integerDivision && m === 47 ? Ce("//") : Ce("/");
          case 38:
          case 124:
            if (!o.bitwiseOperators)
              break;
          /* fall through */
          case 42:
          case 94:
          case 37:
          case 44:
          case 123:
          case 125:
          case 93:
          case 40:
          case 41:
          case 59:
          case 35:
          case 45:
          case 43:
            return Ce(i.charAt(v));
        }
        return Be(i.charAt(v));
      }
      function Ln() {
        var u = i.charCodeAt(v), m = i.charCodeAt(v + 1);
        return zi(u) ? (u === 10 && m === 13 && ++v, u === 13 && m === 10 && ++v, ++he, be = ++v, !0) : !1;
      }
      function ts() {
        for (; v < s; ) {
          var u = i.charCodeAt(v);
          if (Fu(u))
            ++v;
          else if (!Ln())
            break;
        }
      }
      function Cu() {
        for (var u, m; Iu(i.charCodeAt(++v)); ) ;
        return u = l.fixup(i.slice(Q, v)), Hu(u) ? m = b : u === "true" || u === "false" ? (m = T, u = u === "true") : u === "nil" ? (m = E, u = null) : m = x, {
          type: m,
          value: u,
          line: he,
          lineStart: be,
          range: [Q, v]
        };
      }
      function Ce(u) {
        return v += u.length, {
          type: D,
          value: u,
          line: he,
          lineStart: be,
          range: [Q, v]
        };
      }
      function Au() {
        return v += 3, {
          type: O,
          value: "...",
          line: he,
          lineStart: be,
          range: [Q, v]
        };
      }
      function Mu() {
        for (var u = i.charCodeAt(v++), m = he, w = be, S = v, P = l.discardStrings ? null : "", G; G = i.charCodeAt(v++), u !== G; )
          if ((v > s || zi(G)) && (P += i.slice(S, v - 1), H(null, C.unfinishedString, i.slice(Q, v - 1))), G === 92) {
            if (!l.discardStrings) {
              var Z = i.slice(S, v - 1);
              P += l.fixup(Z);
            }
            var ve = Pu();
            l.discardStrings || (P += ve), S = v;
          }
        return l.discardStrings || (P += l.encodeByte(null), P += l.fixup(i.slice(S, v - 1))), {
          type: y,
          value: P,
          line: m,
          lineStart: w,
          lastLine: he,
          lastLineStart: be,
          range: [Q, v]
        };
      }
      function Du() {
        var u = he, m = be, w = ml(!1);
        return w === !1 && H(B, C.expected, "[", ue(B)), {
          type: y,
          value: l.discardStrings ? null : l.fixup(w),
          line: u,
          lineStart: m,
          lastLine: he,
          lastLineStart: be,
          range: [Q, v]
        };
      }
      function gl() {
        var u = i.charAt(v), m = i.charAt(v + 1), w = u === "0" && "xX".indexOf(m || null) >= 0 ? Eu() : Bu(), S = Ou(), P = Tu();
        return P && (S || w.hasFractionPart) && H(null, C.malformedNumber, i.slice(Q, v)), {
          type: k,
          value: w.value,
          line: he,
          lineStart: be,
          range: [Q, v]
        };
      }
      function Ou() {
        if (o.imaginaryNumbers)
          return "iI".indexOf(i.charAt(v) || null) >= 0 ? (++v, !0) : !1;
      }
      function Tu() {
        if (o.integerSuffixes) {
          if ("uU".indexOf(i.charAt(v) || null) >= 0)
            if (++v, "lL".indexOf(i.charAt(v) || null) >= 0) {
              if (++v, "lL".indexOf(i.charAt(v) || null) >= 0)
                return ++v, "ULL";
              H(null, C.malformedNumber, i.slice(Q, v));
            } else
              H(null, C.malformedNumber, i.slice(Q, v));
          else if ("lL".indexOf(i.charAt(v) || null) >= 0) {
            if (++v, "lL".indexOf(i.charAt(v) || null) >= 0)
              return ++v, "LL";
            H(null, C.malformedNumber, i.slice(Q, v));
          }
        }
      }
      function Eu() {
        var u = 0, m = 1, w = 1, S, P, G, Z;
        for (Z = v += 2, Qt(i.charCodeAt(v)) || H(null, C.malformedNumber, i.slice(Q, v)); Qt(i.charCodeAt(v)); ) ++v;
        S = parseInt(i.slice(Z, v), 16);
        var ve = !1;
        if (i.charAt(v) === ".") {
          for (ve = !0, P = ++v; Qt(i.charCodeAt(v)); ) ++v;
          u = i.slice(P, v), u = P === v ? 0 : parseInt(u, 16) / Math.pow(16, v - P);
        }
        var Nn = !1;
        if ("pP".indexOf(i.charAt(v) || null) >= 0) {
          for (Nn = !0, ++v, "+-".indexOf(i.charAt(v) || null) >= 0 && (w = i.charAt(v++) === "+" ? 1 : -1), G = v, Ft(i.charCodeAt(v)) || H(null, C.malformedNumber, i.slice(Q, v)); Ft(i.charCodeAt(v)); ) ++v;
          m = i.slice(G, v), m = Math.pow(2, m * w);
        }
        return {
          value: (S + u) * m,
          hasFractionPart: ve || Nn
        };
      }
      function Bu() {
        for (; Ft(i.charCodeAt(v)); ) ++v;
        var u = !1;
        if (i.charAt(v) === ".")
          for (u = !0, ++v; Ft(i.charCodeAt(v)); ) ++v;
        var m = !1;
        if ("eE".indexOf(i.charAt(v) || null) >= 0)
          for (m = !0, ++v, "+-".indexOf(i.charAt(v) || null) >= 0 && ++v, Ft(i.charCodeAt(v)) || H(null, C.malformedNumber, i.slice(Q, v)); Ft(i.charCodeAt(v)); ) ++v;
        return {
          value: parseFloat(i.slice(Q, v)),
          hasFractionPart: u || m
        };
      }
      function Lu() {
        var u = v++;
        for (i.charAt(v++) !== "{" && H(null, C.braceExpected, "{", "\\" + i.slice(u, v)), Qt(i.charCodeAt(v)) || H(null, C.hexadecimalDigitExpected, "\\" + i.slice(u, v)); i.charCodeAt(v) === 48; ) ++v;
        for (var m = v; Qt(i.charCodeAt(v)); )
          ++v, v - m > 6 && H(null, C.tooLargeCodepoint, "\\" + i.slice(u, v));
        var w = i.charAt(v++);
        w !== "}" && (w === '"' || w === "'" ? H(null, C.braceExpected, "}", "\\" + i.slice(u, v--)) : H(null, C.hexadecimalDigitExpected, "\\" + i.slice(u, v)));
        var S = parseInt(i.slice(m, v - 1) || "0", 16), P = "\\" + i.slice(u, v);
        return S > 1114111 && H(null, C.tooLargeCodepoint, P), l.encodeUTF8(S, P);
      }
      function Pu() {
        var u = v;
        switch (i.charAt(v)) {
          // Lua allow the following escape sequences.
          case "a":
            return ++v, "\x07";
          case "n":
            return ++v, `
`;
          case "r":
            return ++v, "\r";
          case "t":
            return ++v, "	";
          case "v":
            return ++v, "\v";
          case "b":
            return ++v, "\b";
          case "f":
            return ++v, "\f";
          // Backslash at the end of the line. We treat all line endings as equivalent,
          // and as representing the [LF] character (code 10). Lua 5.1 through 5.3
          // have been verified to behave the same way.
          case "\r":
          case `
`:
            return Ln(), `
`;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            for (; Ft(i.charCodeAt(v)) && v - u < 3; ) ++v;
            var m = i.slice(u, v), w = parseInt(m, 10);
            return w > 255 && H(null, C.decimalEscapeTooLarge, "\\" + w), l.encodeByte(w, "\\" + m);
          case "z":
            if (o.skipWhitespaceEscape)
              return ++v, ts(), "";
            break;
          case "x":
            if (o.hexEscapes) {
              if (Qt(i.charCodeAt(v + 1)) && Qt(i.charCodeAt(v + 2)))
                return v += 3, l.encodeByte(parseInt(i.slice(u + 1, v), 16), "\\" + i.slice(u, v));
              H(null, C.hexadecimalDigitExpected, "\\" + i.slice(u, v + 2));
            }
            break;
          case "u":
            if (o.unicodeEscapes)
              return Lu();
            break;
          case "\\":
          case '"':
          case "'":
            return i.charAt(v++);
        }
        return o.strictEscapes && H(null, C.invalidEscape, "\\" + i.slice(u, v + 1)), i.charAt(v++);
      }
      function Ru() {
        Q = v, v += 2;
        var u = i.charAt(v), m = "", w = !1, S = v, P = be, G = he;
        if (u === "[" && (m = ml(!0), m === !1 ? m = u : w = !0), !w) {
          for (; v < s && !zi(i.charCodeAt(v)); )
            ++v;
          r.comments && (m = i.slice(S, v));
        }
        if (r.comments) {
          var Z = A.comment(m, i.slice(Q, v));
          r.locations && (Z.loc = {
            start: { line: G, column: Q - P },
            end: { line: he, column: v - be }
          }), r.ranges && (Z.range = [Q, v]), r.onCreateNode && r.onCreateNode(Z), qe.push(Z);
        }
      }
      function ml(u) {
        var m = 0, w = "", S = !1, P, G, Z = he;
        for (++v; i.charAt(v + m) === "="; ) ++m;
        if (i.charAt(v + m) !== "[") return !1;
        for (v += m + 1, zi(i.charCodeAt(v)) && Ln(), G = v; v < s; ) {
          for (; zi(i.charCodeAt(v)); ) Ln();
          if (P = i.charAt(v++), P === "]") {
            S = !0;
            for (var ve = 0; ve < m; ++ve)
              i.charAt(v + ve) !== "=" && (S = !1);
            i.charAt(v + m) !== "]" && (S = !1);
          }
          if (S)
            return w += i.slice(G, v - 1), v += m + 1, w;
        }
        H(
          null,
          u ? C.unfinishedLongComment : C.unfinishedLongString,
          Z,
          "<eof>"
        );
      }
      function ee() {
        fe = B, B = me, me = gi();
      }
      function le(u) {
        return u === B.value ? (ee(), !0) : !1;
      }
      function re(u) {
        u === B.value ? ee() : H(B, C.expected, u, ue(B));
      }
      function Fu(u) {
        return u === 9 || u === 32 || u === 11 || u === 12;
      }
      function zi(u) {
        return u === 10 || u === 13;
      }
      function Ft(u) {
        return u >= 48 && u <= 57;
      }
      function Qt(u) {
        return u >= 48 && u <= 57 || u >= 97 && u <= 102 || u >= 65 && u <= 70;
      }
      function Nu(u) {
        return !!(u >= 65 && u <= 90 || u >= 97 && u <= 122 || u === 95 || o.extendedIdentifiers && u >= 128);
      }
      function Iu(u) {
        return !!(u >= 65 && u <= 90 || u >= 97 && u <= 122 || u === 95 || u >= 48 && u <= 57 || o.extendedIdentifiers && u >= 128);
      }
      function Hu(u) {
        switch (u.length) {
          case 2:
            return u === "do" || u === "if" || u === "in" || u === "or";
          case 3:
            return u === "and" || u === "end" || u === "for" || u === "not";
          case 4:
            return u === "else" || u === "then" ? !0 : o.labels && !o.contextualGoto ? u === "goto" : !1;
          case 5:
            return u === "break" || u === "local" || u === "until" || u === "while";
          case 6:
            return u === "elseif" || u === "repeat" || u === "return";
          case 8:
            return u === "function";
        }
        return !1;
      }
      function Vu(u) {
        return D === u.type ? "#-~".indexOf(u.value) >= 0 : b === u.type ? u.value === "not" : !1;
      }
      function Wu(u) {
        if (g === u.type) return !0;
        if (b !== u.type) return !1;
        switch (u.value) {
          case "else":
          case "elseif":
          case "end":
          case "until":
            return !0;
          default:
            return !1;
        }
      }
      var Zt, mi, Pn;
      function ot() {
        var u = Zt[mi++].slice();
        Zt.push(u), r.onCreateScope && r.onCreateScope();
      }
      function ut() {
        Zt.pop(), --mi, r.onDestroyScope && r.onDestroyScope();
      }
      function is(u) {
        r.onLocalDeclaration && r.onLocalDeclaration(u), _(Zt[mi], u) === -1 && Zt[mi].push(u);
      }
      function qi(u) {
        is(u.name), Ki(u, !0);
      }
      function Ki(u, m) {
        !m && K(Pn, "name", u.name) === -1 && Pn.push(u), u.isLocal = m;
      }
      function ns(u) {
        return _(Zt[mi], u) !== -1;
      }
      var Je = [], Ae;
      function Ot() {
        return new Rn(B);
      }
      function Rn(u) {
        r.locations && (this.loc = {
          start: {
            line: u.line,
            column: u.range[0] - u.lineStart
          },
          end: {
            line: 0,
            column: 0
          }
        }), r.ranges && (this.range = [u.range[0], 0]);
      }
      Rn.prototype.complete = function() {
        r.locations && (this.loc.end.line = fe.lastLine || fe.line, this.loc.end.column = fe.range[1] - (fe.lastLineStart || fe.lineStart)), r.ranges && (this.range[1] = fe.range[1]);
      }, Rn.prototype.bless = function(u) {
        if (this.loc) {
          var m = this.loc;
          u.loc = {
            start: {
              line: m.start.line,
              column: m.start.column
            },
            end: {
              line: m.end.line,
              column: m.end.column
            }
          };
        }
        this.range && (u.range = [
          this.range[0],
          this.range[1]
        ]);
      };
      function yi() {
        Ae && Je.push(Ot());
      }
      function Ke(u) {
        Ae && Je.push(u);
      }
      function Tt() {
        this.scopes = [], this.pendingGotos = [];
      }
      Tt.prototype.isInLoop = function() {
        for (var u = this.scopes.length; u-- > 0; )
          if (this.scopes[u].isLoop)
            return !0;
        return !1;
      }, Tt.prototype.pushScope = function(u) {
        var m = {
          labels: {},
          locals: [],
          deferredGotos: [],
          isLoop: !!u
        };
        this.scopes.push(m);
      }, Tt.prototype.popScope = function() {
        for (var u = 0; u < this.pendingGotos.length; ++u) {
          var m = this.pendingGotos[u];
          m.maxDepth >= this.scopes.length && --m.maxDepth <= 0 && H(m.token, C.labelNotVisible, m.target);
        }
        this.scopes.pop();
      }, Tt.prototype.addGoto = function(u, m) {
        for (var w = [], S = 0; S < this.scopes.length; ++S) {
          var P = this.scopes[S];
          if (w.push(P.locals.length), Object.prototype.hasOwnProperty.call(P.labels, u))
            return;
        }
        this.pendingGotos.push({
          maxDepth: this.scopes.length,
          target: u,
          token: m,
          localCounts: w
        });
      }, Tt.prototype.addLabel = function(u, m) {
        var w = this.currentScope();
        if (Object.prototype.hasOwnProperty.call(w.labels, u))
          H(m, C.labelAlreadyDefined, u, w.labels[u].line);
        else {
          for (var S = [], P = 0; P < this.pendingGotos.length; ++P) {
            var G = this.pendingGotos[P];
            if (G.maxDepth >= this.scopes.length && G.target === u) {
              G.localCounts[this.scopes.length - 1] < w.locals.length && w.deferredGotos.push(G);
              continue;
            }
            S.push(G);
          }
          this.pendingGotos = S;
        }
        w.labels[u] = {
          localCount: w.locals.length,
          line: m.line
        };
      }, Tt.prototype.addLocal = function(u, m) {
        this.currentScope().locals.push({
          name: u,
          token: m
        });
      }, Tt.prototype.currentScope = function() {
        return this.scopes[this.scopes.length - 1];
      }, Tt.prototype.raiseDeferredErrors = function() {
        for (var u = this.currentScope(), m = u.deferredGotos, w = 0; w < m.length; ++w) {
          var S = m[w];
          H(S.token, C.gotoJumpInLocalScope, S.target, u.locals[S.localCounts[this.scopes.length - 1]].name);
        }
      };
      function Nt() {
        this.level = 0, this.loopLevels = [];
      }
      Nt.prototype.isInLoop = function() {
        return !!this.loopLevels.length;
      }, Nt.prototype.pushScope = function(u) {
        ++this.level, u && this.loopLevels.push(this.level);
      }, Nt.prototype.popScope = function() {
        var u = this.loopLevels, m = u.length;
        m && u[m - 1] === this.level && u.pop(), --this.level;
      }, Nt.prototype.addGoto = Nt.prototype.addLabel = /* istanbul ignore next */
      function() {
        throw new Error("This should never happen");
      }, Nt.prototype.addLocal = Nt.prototype.raiseDeferredErrors = function() {
      };
      function yl() {
        return o.labels ? new Tt() : new Nt();
      }
      function zu() {
        ee(), yi(), r.scope && ot();
        var u = yl();
        u.allowVararg = !0, u.pushScope();
        var m = dt(u);
        return u.popScope(), r.scope && ut(), g !== B.type && Be(B), Ae && !m.length && (fe = B), R(A.chunk(m));
      }
      function dt(u) {
        for (var m = [], w; !Wu(B); ) {
          if (B.value === "return" || !o.relaxedBreak && B.value === "break") {
            m.push(bl(u));
            break;
          }
          w = bl(u), le(";"), w && m.push(w);
        }
        return m;
      }
      function bl(u) {
        if (yi(), D === B.type && le("::"))
          return qu(u);
        if (o.emptyStatement && le(";")) {
          Ae && Je.pop();
          return;
        }
        if (u.raiseDeferredErrors(), b === B.type)
          switch (B.value) {
            case "local":
              return ee(), Xu(u);
            case "if":
              return ee(), Yu(u);
            case "return":
              return ee(), Gu(u);
            case "function":
              ee();
              var m = Qu();
              return rs(m);
            case "while":
              return ee(), ju(u);
            case "for":
              return ee(), Ju(u);
            case "repeat":
              return ee(), Uu(u);
            case "break":
              return ee(), u.isInLoop() || H(B, C.noLoopToBreak, B.value), Ku();
            case "do":
              return ee(), $u(u);
            case "goto":
              return ee(), xl(u);
          }
        return o.contextualGoto && B.type === x && B.value === "goto" && me.type === x && me.value !== "goto" ? (ee(), xl(u)) : (Ae && Je.pop(), _u(u));
      }
      function qu(u) {
        var m = B, w = Ie();
        return r.scope && (is("::" + m.value + "::"), Ki(w, !0)), re("::"), u.addLabel(m.value, m), R(A.labelStatement(w));
      }
      function Ku() {
        return R(A.breakStatement());
      }
      function xl(u) {
        var m = B.value, w = fe, S = Ie();
        return u.addGoto(m, w), R(A.gotoStatement(S));
      }
      function $u(u) {
        r.scope && ot(), u.pushScope();
        var m = dt(u);
        return u.popScope(), r.scope && ut(), re("end"), R(A.doStatement(m));
      }
      function ju(u) {
        var m = xe(u);
        re("do"), r.scope && ot(), u.pushScope(!0);
        var w = dt(u);
        return u.popScope(), r.scope && ut(), re("end"), R(A.whileStatement(m, w));
      }
      function Uu(u) {
        r.scope && ot(), u.pushScope(!0);
        var m = dt(u);
        re("until"), u.raiseDeferredErrors();
        var w = xe(u);
        return u.popScope(), r.scope && ut(), R(A.repeatStatement(w, m));
      }
      function Gu(u) {
        var m = [];
        if (B.value !== "end") {
          var w = Fn(u);
          for (w != null && m.push(w); le(","); )
            w = xe(u), m.push(w);
          le(";");
        }
        return R(A.returnStatement(m));
      }
      function Yu(u) {
        var m = [], w, S, P;
        for (Ae && (P = Je[Je.length - 1], Je.push(P)), w = xe(u), re("then"), r.scope && ot(), u.pushScope(), S = dt(u), u.popScope(), r.scope && ut(), m.push(R(A.ifClause(w, S))), Ae && (P = Ot()); le("elseif"); )
          Ke(P), w = xe(u), re("then"), r.scope && ot(), u.pushScope(), S = dt(u), u.popScope(), r.scope && ut(), m.push(R(A.elseifClause(w, S))), Ae && (P = Ot());
        return le("else") && (Ae && (P = new Rn(fe), Je.push(P)), r.scope && ot(), u.pushScope(), S = dt(u), u.popScope(), r.scope && ut(), m.push(R(A.elseClause(S)))), re("end"), R(A.ifStatement(m));
      }
      function Ju(u) {
        var m = Ie(), w;
        if (r.scope && (ot(), qi(m)), le("=")) {
          var S = xe(u);
          re(",");
          var P = xe(u), G = le(",") ? xe(u) : null;
          return re("do"), u.pushScope(!0), w = dt(u), u.popScope(), re("end"), r.scope && ut(), R(A.forNumericStatement(m, S, P, G, w));
        } else {
          for (var Z = [m]; le(","); )
            m = Ie(), r.scope && qi(m), Z.push(m);
          re("in");
          var ve = [];
          do {
            var Nn = xe(u);
            ve.push(Nn);
          } while (le(","));
          return re("do"), u.pushScope(!0), w = dt(u), u.popScope(), re("end"), r.scope && ut(), R(A.forGenericStatement(Z, ve, w));
        }
      }
      function Xu(u) {
        var m, w = fe;
        if (x === B.type) {
          var S = [], P = [];
          do
            m = Ie(), S.push(m), u.addLocal(m.name, w);
          while (le(","));
          if (le("="))
            do {
              var G = xe(u);
              P.push(G);
            } while (le(","));
          if (r.scope)
            for (var Z = 0, ve = S.length; Z < ve; ++Z)
              qi(S[Z]);
          return R(A.localStatement(S, P));
        }
        if (le("function"))
          return m = Ie(), u.addLocal(m.name, w), r.scope && (qi(m), ot()), rs(m, !0);
        de("<name>", B);
      }
      function _u(u) {
        var m, w, S, P, G, Z = [];
        Ae && (w = Ot());
        do {
          if (Ae && (m = Ot()), x === B.type)
            G = B.value, P = Ie(), r.scope && Ki(P, ns(G)), S = !0;
          else if (B.value === "(")
            ee(), P = xe(u), re(")"), S = !1;
          else
            return Be(B);
          e: for (; ; ) {
            switch (y === B.type ? '"' : B.value) {
              case ".":
              case "[":
                S = !0;
                break;
              case ":":
              case "(":
              case "{":
              case '"':
                S = null;
                break;
              default:
                break e;
            }
            P = wl(P, m, u);
          }
          if (Z.push(P), B.value !== ",")
            break;
          if (!S)
            return Be(B);
          ee();
        } while (!0);
        if (Z.length === 1 && S === null)
          return Ke(m), R(A.callStatement(Z[0]));
        if (!S)
          return Be(B);
        re("=");
        var ve = [];
        do
          ve.push(xe(u));
        while (le(","));
        return Ke(w), R(A.assignmentStatement(Z, ve));
      }
      function Ie() {
        yi();
        var u = B.value;
        return x !== B.type && de("<name>", B), ee(), R(A.identifier(u));
      }
      function rs(u, m) {
        var w = yl();
        w.pushScope();
        var S = [];
        if (re("("), !le(")"))
          for (; ; ) {
            if (x === B.type) {
              var P = Ie();
              if (r.scope && qi(P), S.push(P), le(",")) continue;
            } else O === B.type ? (w.allowVararg = !0, S.push(ls(w))) : de("<name> or '...'", B);
            re(")");
            break;
          }
        var G = dt(w);
        return w.popScope(), re("end"), r.scope && ut(), m = m || !1, R(A.functionStatement(u, S, m, G));
      }
      function Qu() {
        var u, m, w;
        for (Ae && (w = Ot()), u = Ie(), r.scope && (Ki(u, ns(u.name)), ot()); le("."); )
          Ke(w), m = Ie(), u = R(A.memberExpression(u, ".", m));
        return le(":") && (Ke(w), m = Ie(), u = R(A.memberExpression(u, ":", m)), r.scope && is("self")), u;
      }
      function vl(u) {
        for (var m = [], w, S; ; ) {
          if (yi(), D === B.type && le("["))
            w = xe(u), re("]"), re("="), S = xe(u), m.push(R(A.tableKey(w, S)));
          else if (x === B.type)
            me.value === "=" ? (w = Ie(), ee(), S = xe(u), m.push(R(A.tableKeyString(w, S)))) : (S = xe(u), m.push(R(A.tableValue(S))));
          else {
            if ((S = Fn(u)) == null) {
              Je.pop();
              break;
            }
            m.push(R(A.tableValue(S)));
          }
          if (",;".indexOf(B.value) >= 0) {
            ee();
            continue;
          }
          break;
        }
        return re("}"), R(A.tableConstructorExpression(m));
      }
      function Fn(u) {
        var m = ss(0, u);
        return m;
      }
      function xe(u) {
        var m = Fn(u);
        if (m == null) de("<expression>", B);
        else return m;
      }
      function Zu(u) {
        var m = u.charCodeAt(0), w = u.length;
        if (w === 1)
          switch (m) {
            case 94:
              return 12;
            // ^
            case 42:
            case 47:
            case 37:
              return 10;
            // * / %
            case 43:
            case 45:
              return 9;
            // + -
            case 38:
              return 6;
            // &
            case 126:
              return 5;
            // ~
            case 124:
              return 4;
            // |
            case 60:
            case 62:
              return 3;
          }
        else if (w === 2)
          switch (m) {
            case 47:
              return 10;
            // //
            case 46:
              return 8;
            // ..
            case 60:
            case 62:
              return u === "<<" || u === ">>" ? 7 : 3;
            // <= >=
            case 61:
            case 126:
              return 3;
            // == ~=
            case 111:
              return 1;
          }
        else if (m === 97 && u === "and") return 2;
        return 0;
      }
      function ss(u, m) {
        var w = B.value, S, P;
        if (Ae && (P = Ot()), Vu(B)) {
          yi(), ee();
          var G = ss(10, m);
          G == null && de("<expression>", B), S = R(A.unaryExpression(w, G));
        }
        if (S == null && (S = ls(m), S == null && (S = ed(m))), S == null) return null;
        for (var Z; w = B.value, Z = D === B.type || b === B.type ? Zu(w) : 0, !(Z === 0 || Z <= u); ) {
          (w === "^" || w === "..") && --Z, ee();
          var ve = ss(Z, m);
          ve == null && de("<expression>", B), Ae && Je.push(P), S = R(A.binaryExpression(w, S, ve));
        }
        return S;
      }
      function wl(u, m, w) {
        var S, P;
        if (D === B.type)
          switch (B.value) {
            case "[":
              return Ke(m), ee(), S = xe(w), re("]"), R(A.indexExpression(u, S));
            case ".":
              return Ke(m), ee(), P = Ie(), R(A.memberExpression(u, ".", P));
            case ":":
              return Ke(m), ee(), P = Ie(), u = R(A.memberExpression(u, ":", P)), Ke(m), os(u, w);
            case "(":
            case "{":
              return Ke(m), os(u, w);
          }
        else if (y === B.type)
          return Ke(m), os(u, w);
        return null;
      }
      function ed(u) {
        var m, w, S;
        if (Ae && (S = Ot()), x === B.type)
          w = B.value, m = Ie(), r.scope && Ki(m, ns(w));
        else if (le("("))
          m = xe(u), re(")");
        else
          return null;
        for (; ; ) {
          var P = wl(m, S, u);
          if (P === null)
            break;
          m = P;
        }
        return m;
      }
      function os(u, m) {
        if (D === B.type)
          switch (B.value) {
            case "(":
              o.emptyStatement || B.line !== fe.line && H(null, C.ambiguousSyntax, B.value), ee();
              var w = [], S = Fn(m);
              for (S != null && w.push(S); le(","); )
                S = xe(m), w.push(S);
              return re(")"), R(A.callExpression(u, w));
            case "{":
              yi(), ee();
              var P = vl(m);
              return R(A.tableCallExpression(u, P));
          }
        else if (y === B.type)
          return R(A.stringCallExpression(u, ls(m)));
        de("function arguments", B);
      }
      function ls(u) {
        var m = y | k | T | E | O, w = B.value, S = B.type, P;
        if (Ae && (P = Ot()), S === O && !u.allowVararg && H(B, C.cannotUseVararg, B.value), S & m) {
          Ke(P);
          var G = i.slice(B.range[0], B.range[1]);
          return ee(), R(A.literal(S, w, G));
        } else {
          if (b === S && w === "function")
            return Ke(P), ee(), r.scope && ot(), rs(null);
          if (le("{"))
            return Ke(P), vl(u);
        }
      }
      t.parse = td;
      var kl = {
        "5.1": {},
        "5.2": {
          labels: !0,
          emptyStatement: !0,
          hexEscapes: !0,
          skipWhitespaceEscape: !0,
          strictEscapes: !0,
          relaxedBreak: !0
        },
        "5.3": {
          labels: !0,
          emptyStatement: !0,
          hexEscapes: !0,
          skipWhitespaceEscape: !0,
          strictEscapes: !0,
          unicodeEscapes: !0,
          bitwiseOperators: !0,
          integerDivision: !0,
          relaxedBreak: !0
        },
        LuaJIT: {
          // XXX: LuaJIT language features may depend on compilation options; may need to
          // rethink how to handle this. Specifically, there is a LUAJIT_ENABLE_LUA52COMPAT
          // that removes contextual goto. Maybe add 'LuaJIT-5.2compat' as well?
          labels: !0,
          contextualGoto: !0,
          hexEscapes: !0,
          skipWhitespaceEscape: !0,
          strictEscapes: !0,
          unicodeEscapes: !0,
          imaginaryNumbers: !0,
          integerSuffixes: !0
        }
      };
      function td(u, m) {
        if (typeof m > "u" && typeof u == "object" && (m = u, u = void 0), m || (m = {}), i = u || "", r = Y({}, a, m), v = 0, he = 1, be = 0, s = i.length, Zt = [[]], mi = 0, Pn = [], Je = [], !Object.prototype.hasOwnProperty.call(kl, r.luaVersion))
          throw new Error(V("Lua version '%1' not supported", r.luaVersion));
        if (o = Y({}, kl[r.luaVersion]), r.extendedIdentifiers !== void 0 && (o.extendedIdentifiers = !!r.extendedIdentifiers), !Object.prototype.hasOwnProperty.call(d, r.encodingMode))
          throw new Error(V("Encoding mode '%1' not supported", r.encodingMode));
        return l = d[r.encodingMode], r.comments && (qe = []), r.wait ? t : Cl();
      }
      t.write = Sl;
      function Sl(u) {
        return i += String(u), s = i.length, t;
      }
      t.end = Cl;
      function Cl(u) {
        typeof u < "u" && Sl(u), i && i.substr(0, 2) === "#!" && (i = i.replace(/^.*/, function(w) {
          return w.replace(/./g, " ");
        })), s = i.length, Ae = r.locations || r.ranges, me = gi();
        var m = zu();
        if (r.comments && (m.comments = qe), r.scope && (m.globals = Pn), Je.length > 0)
          throw new Error("Location tracking failed. This is most likely a bug in luaparse");
        return m;
      }
    });
  }(tn, tn.exports)), tn.exports;
}
var m1 = /* @__PURE__ */ g1();
const y1 = /* @__PURE__ */ d1(m1), S1 = Ub((n) => {
  const e = [], t = n.state.doc.toString();
  try {
    y1.parse(t, { comments: !1 });
  } catch (i) {
    i && i.index != null && e.push({
      from: i.index,
      to: i.index,
      severity: "error",
      message: i.message
    });
  }
  return e;
}), C1 = N.baseTheme({}), A1 = new pi(), M1 = new pi(), D1 = new pi(), O1 = jr.define(u1), T1 = jr.define(a1);
export {
  pi as Compartment,
  M as EditorSelection,
  X as EditorState,
  N as EditorView,
  jr as StreamLanguage,
  Nb as autocompletion,
  C1 as baseTheme,
  w1 as basicSetup,
  k1 as dracula,
  M1 as languageConfig,
  D1 as lintConfig,
  v1 as lintGutter,
  Ub as linter,
  T1 as luaLanguage,
  S1 as luaLinter,
  O1 as shellLanguage,
  A1 as themeConfig
};
