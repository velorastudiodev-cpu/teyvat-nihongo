import { describe, expect, it } from 'vitest'
import { isParticle, parse, parseToken, sameSound, textOf } from './sentence'

describe('sentence markup', () => {
  it('splits furigana from okurigana and marks the key token', () => {
    const t = parseToken('*食{た}べません')
    expect(t).toMatchObject({ key: true, text: '食べません', kana: 'たべません' })
    expect(t.ruby).toEqual([['食', 'た'], ['べません']])
    expect(parseToken('朝{あさ}ご飯{はん}').ruby).toEqual([['朝', 'あさ'], ['ご'], ['飯', 'はん']])
  })

  it('reads whole sentences', () => {
    const s = parse('わたし *は 学生{がくせい} です')
    expect(textOf(s)).toBe('わたしは学生です')
    expect(s.filter((t) => t.key).map((t) => t.text)).toEqual(['は'])
    expect(s.filter(isParticle)).toHaveLength(1)
  })

  it('dictation ignores spaces, punctuation and script', () => {
    const s = parse('わたし は 学生{がくせい} です')
    expect(sameSound('わたしは がくせいです。', s)).toBe(true)
    expect(sameSound('watashi wa gakusei desu', s)).toBe(true)    // は is read wa
    expect(sameSound('watashi wa sensei desu', s)).toBe(false)
    expect(sameSound('watashiha gakuseidesu', s)).toBe(true)
  })
})
