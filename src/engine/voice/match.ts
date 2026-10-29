import { toHiragana } from 'wanakana'
import { KANJI, VOCAB, mainReading } from '../../data/kanji'
import type { Token } from '../sentence'

/*
 * Speech transcripts come back in normal orthography (漢字かな交じり). We turn them into kana
 * using what we already know: the target's own readings first, then the bundled vocabulary,
 * then single-kanji readings as a last resort. No 17 MB morphological dictionary needed.
 */

const DIGITS = '〇一二三四五六七八九'
/** 0–9999 in kanji numerals, so "7時" can match 七時{しちじ}. */
export function toKanjiNumber(n: number): string {
  if (n === 0) return '〇'
  let out = ''
  for (const [unit, size] of [['千', 1000], ['百', 100], ['十', 10]] as const) {
    const d = Math.floor(n / size) % 10
    if (d) out += (d > 1 ? DIGITS[d] : '') + unit
  }
  return out + (n % 10 ? DIGITS[n % 10] : '')
}

const DICT: [string, string][] = VOCAB
  .filter((w) => /[一-龯々]/.test(w.word) && w.word !== w.reading)
  .map((w) => [w.word, w.reading] as [string, string])
const KANJI_READING = new Map(KANJI.map((k) => [k.char, toHiragana(mainReading(k).replace(/[.-]/g, ''))]))

const PUNCT = /[\s、。？！?!「」：:,.・]/g

export function toKana(transcript: string, known: [string, string][] = []): string {
  let s = transcript.replace(PUNCT, '').replace(/\d+/g, (d) => toKanjiNumber(Number(d)))
  for (const [surface, kana] of [...known, ...DICT].sort((a, b) => b[0].length - a[0].length)) {
    if (s.includes(surface)) s = s.split(surface).join(kana)
  }
  s = s.replace(/[一-龯々]/g, (k) => KANJI_READING.get(k) ?? k)
  return toHiragana(s)
}

const SMALL = 'ゃゅょぁぃぅぇぉゎ'
/** Split kana into morae: きょ is one, っ ー ん each count. */
export function mora(kana: string): string[] {
  const out: string[] = []
  for (const ch of kana) {
    if (SMALL.includes(ch) && out.length) out[out.length - 1] += ch
    else out.push(ch)
  }
  return out
}

/** Edit distance over morae, plus which target morae were matched. */
export function align(target: string[], heard: string[]) {
  const d = Array.from({ length: target.length + 1 }, (_, i) => Array.from({ length: heard.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i <= target.length; i++)
    for (let j = 1; j <= heard.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (target[i - 1] === heard[j - 1] ? 0 : 1))
  const ok = Array<boolean>(target.length).fill(false)
  for (let i = target.length, j = heard.length; i > 0 && j > 0;) {
    if (d[i][j] === d[i - 1][j - 1] + (target[i - 1] === heard[j - 1] ? 0 : 1)) { ok[i - 1] = target[i - 1] === heard[j - 1]; i--; j-- }
    else if (d[i][j] === d[i - 1][j] + 1) i--
    else j--
  }
  return { distance: d[target.length][heard.length], ok }
}

/** ±1 mora tolerance, but only for words of 3+ morae; short words must be exact. */
export const tolerance = (m: string[]) => (m.length >= 3 ? 1 : 0)

export function sameWord(heardKana: string, targetKana: string) {
  const t = mora(toHiragana(targetKana))
  return align(t, mora(heardKana)).distance <= tolerance(t)
}

/**
 * Does `hay` contain `needle` with at most the allowed mora errors? Inside a longer utterance
 * a 3-mora word with one wrong mora is too easy to hit by accident (きます in ちがいます), so
 * the ±1 tolerance only applies from 4 morae here.
 */
export function fuzzyContains(hay: string, needle: string) {
  const h = mora(hay), n = mora(toHiragana(needle)), tol = n.length >= 4 ? 1 : 0
  for (let len = Math.max(1, n.length - tol); len <= n.length + tol; len++)
    for (let i = 0; i + len <= h.length; i++)
      if (align(n, h.slice(i, i + len)).distance <= tol) return true
  return false
}

const pairs = (ts: Token[]) => ts.filter((t) => t.text !== t.kana).map((t) => [t.text, t.kana] as [string, string])
const kanaOf = (ts: Token[]) => toHiragana(ts.map((t) => t.kana).join('').replace(PUNCT, ''))

/**
 * Voice Fill: the learner may say the whole sentence or just the missing words.
 * Every recognizer alternative is tried; the best one wins.
 */
export function judgeBlanks(alternatives: string[], tokens: Token[], blanks: number[]) {
  let best = { right: blanks.map(() => false), heard: '' }
  for (const alt of alternatives) {
    const heard = toKana(alt, pairs(tokens))
    const whole = align(mora(kanaOf(tokens)), mora(heard)).distance <= 1
    const right = blanks.map((b) => whole || fuzzyContains(heard, tokens[b].kana))
    if (right.filter(Boolean).length > best.right.filter(Boolean).length || !best.heard) best = { right, heard }
  }
  return best
}

/** Shadowing: score 0–100 and, per token, whether every mora was heard. */
export function shadow(alternatives: string[], tokens: Token[]) {
  let best = { score: 0, tokenOk: tokens.map(() => false), heard: '' }
  for (const alt of alternatives) {
    const heard = toKana(alt, pairs(tokens))
    const target = tokens.map((t) => mora(toHiragana(t.kana.replace(PUNCT, ''))))
    const { distance, ok } = align(target.flat(), mora(heard))
    const total = target.flat().length || 1
    const score = Math.max(0, Math.round(100 * (1 - distance / total)))
    let k = 0
    const tokenOk = target.map((m) => { const slice = ok.slice(k, k + m.length); k += m.length; return slice.every(Boolean) })
    if (score > best.score || !best.heard) best = { score, tokenOk, heard }
  }
  return best
}
