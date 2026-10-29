import { describe, expect, it } from 'vitest'
import { HIRAGANA, KANA, KATAKANA, isBasic, romajiMatches } from './kana'

describe('kana data', () => {
  it('has 46 basic hiragana + 46 basic katakana, all with mnemonics', () => {
    const basic = KANA.filter(isBasic)
    expect(basic).toHaveLength(92)
    expect(basic.every((k) => k.mnemonic)).toBe(true)
    expect(HIRAGANA.slice(0, 5).map((k) => k.char).join('')).toBe('あいうえお')
    expect(KATAKANA.find((k) => k.romaji === 'n')?.char).toBe('ン')
  })

  it('has unique characters (dakuten + yōon included)', () => {
    expect(new Set(KANA.map((k) => k.char)).size).toBe(KANA.length)
    expect(KANA.length).toBe(2 * (46 + 25 + 33))
  })

  it('accepts alternative romaji spellings', () => {
    const find = (c: string) => KANA.find((k) => k.char === c)!
    expect(romajiMatches('si', find('し'))).toBe(true)
    expect(romajiMatches('shi', find('シ'))).toBe(true)
    expect(romajiMatches('tu', find('つ'))).toBe(true)
    expect(romajiMatches('o', find('を'))).toBe(true)
    expect(romajiMatches('ji', find('ぢ'))).toBe(true)
    expect(romajiMatches('n', find('ん'))).toBe(true)
    expect(romajiMatches('sa', find('し'))).toBe(false)
    expect(romajiMatches('', find('あ'))).toBe(false)
  })
})
