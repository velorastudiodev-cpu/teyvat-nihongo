import { describe, expect, it } from 'vitest'
import { readingMatches } from './content'
import { examples, KANJI, mainReading, VOCAB } from '../../data/kanji'

describe('kanji & vocab content', () => {
  it('bundles all N5–N4 kanji with Indonesian meanings and readings', () => {
    expect(KANJI.filter((k) => k.level === 'N5')).toHaveLength(79)
    expect(KANJI.filter((k) => k.level === 'N4')).toHaveLength(166)
    expect(KANJI.every((k) => k.meaning && (k.on.length || k.kun.length))).toBe(true)
    expect(VOCAB.length).toBeGreaterThan(1300)
  })

  it('picks a clean quiz reading and example words', () => {
    expect(mainReading(KANJI.find((k) => k.char === '休')!)).toBe('やす')
    expect(examples('休').map((w) => w.word)).toContain('休み')
  })

  it('accepts romaji in any common spelling', () => {
    expect(readingMatches('atchi', 'あっち')).toBe(true)
    expect(readingMatches('acchi', 'あっち')).toBe(true)
    expect(readingMatches('gakkō', 'がっこう')).toBe(true)
    expect(readingMatches('tōi', 'とおい')).toBe(true)
    expect(readingMatches('apaato', 'アパート')).toBe(true)
    expect(readingMatches('がっこう', 'がっこう')).toBe(true)
    expect(readingMatches('gako', 'がっこう')).toBe(false)
    expect(readingMatches('', 'あ')).toBe(false)
  })
})
