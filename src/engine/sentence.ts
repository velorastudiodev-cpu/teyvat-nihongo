import { toHiragana } from 'wanakana'

/**
 * Sentence markup: tokens separated by spaces, furigana as 漢字{かんじ}, the token that
 * carries the grammar point prefixed with *. Example: "わたし *は 学生{がくせい} です"
 */
export interface Token { text: string; kana: string; ruby: [string, string?][]; key: boolean }

const RUBY = /([^{}\s]+?)\{([^}]+)\}/g

export function parseToken(raw: string): Token {
  const key = raw.startsWith('*')
  const src = key ? raw.slice(1) : raw
  const ruby: [string, string?][] = []
  let last = 0
  for (const m of src.matchAll(RUBY)) {
    // only the trailing kanji of the match take the reading (送り仮名 stay plain)
    const lead = m[1].match(/^(.*?)([一-龯々]+)$/)
    if (m.index! > last) ruby.push([src.slice(last, m.index)])
    if (lead?.[1]) ruby.push([lead[1]])
    ruby.push([lead ? lead[2] : m[1], m[2]])
    last = m.index! + m[0].length
  }
  if (last < src.length) ruby.push([src.slice(last)])
  return { key, ruby, text: ruby.map(([t]) => t).join(''), kana: ruby.map(([t, r]) => r ?? t).join('') }
}

export const parse = (s: string) => s.trim().split(/\s+/).map(parseToken)
export const textOf = (ts: Token[]) => ts.map((t) => t.text).join('')
export const kanaOf = (ts: Token[]) => ts.map((t) => t.kana).join('')

export const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'から', 'まで', 'より', 'や', 'か', 'ね', 'よ']
export const isParticle = (t: Token) => PARTICLES.includes(t.text)

const PUNCT = /[\s、。？！?!「」：:,.]/g
const SPOKEN: Record<string, string> = { は: 'わ', へ: 'え', を: 'お' }
const norm = (s: string) => toHiragana(s.replace(PUNCT, '').toLowerCase().replace(/tch/g, 'cch'))

/** Dictation check: compares sounds only (kana or romaji in; spaces, punctuation and は/へ/を spelling ignored). */
export function sameSound(input: string, ts: Token[]) {
  if (!input.trim()) return false
  const spoken = (t: Token) => (isParticle(t) && SPOKEN[t.text]) || t.kana
  const typed = norm(input)
  return typed === norm(kanaOf(ts)) || typed === norm(ts.map(spoken).join(''))
}
