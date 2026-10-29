import { describe, expect, it } from 'vitest'
import { parse } from '../sentence'
import { align, fuzzyContains, judgeBlanks, mora, sameWord, shadow, toKana, toKanjiNumber } from './match'

describe('voice matcher', () => {
  it('splits morae', () => {
    expect(mora('きょうはがっこう')).toEqual(['きょ', 'う', 'は', 'が', 'っ', 'こ', 'う'])
  })

  it('turns transcripts into kana using the target, the dictionary and digits', () => {
    const t = parse('七時{しちじ} *に 起{お}きます')
    expect(toKana('7時に起きます。', t.filter((x) => x.text !== x.kana).map((x) => [x.text, x.kana]))).toBe('しちじにおきます')
    expect(toKana('私は学生です')).toBe('わたしはがくせいです')
    expect(toKana('コーヒー')).toBe(toKana('こうひい'))   // ー becomes its vowel on both sides
    expect(toKanjiNumber(1987)).toBe('千九百八十七')
  })

  it('allows ±1 mora only for longer words', () => {
    expect(sameWord('がっこ', 'がっこう')).toBe(true)
    expect(sameWord('て', 'め')).toBe(false)
    expect(fuzzyContains('わたしはがくせえです', 'がくせい')).toBe(true)
    expect(align(mora('ねこ'), mora('ねこ')).distance).toBe(0)
  })

  it('Voice Fill accepts the whole sentence or just the missing word', () => {
    const t = parse('わたし *は 学生{がくせい} です')
    expect(judgeBlanks(['私は学生です'], t, [2]).right).toEqual([true])
    expect(judgeBlanks(['学生'], t, [2]).right).toEqual([true])
    expect(judgeBlanks(['先生'], t, [2]).right).toEqual([false])
    expect(judgeBlanks(['ぜんぜん違います'], parse('あした も *来{き}ます'), [2]).right).toEqual([false])   // きます ≠ います
    expect(judgeBlanks(['先生', 'がくせい'], t, [2]).right).toEqual([true])       // any alternative may win
    expect(judgeBlanks(['水を飲みます'], parse('水{みず} *を 飲{の}みます'), [0, 2]).right).toEqual([true, true])
  })

  it('Shadowing scores and highlights the token that was missed', () => {
    const t = parse('ちょっと *待{ま}ってください')
    expect(shadow(['ちょっと待ってください'], t).score).toBe(100)
    const miss = shadow(['ちょっとまってくだ'], t)
    expect(miss.score).toBeLessThan(100)
    expect(miss.tokenOk).toEqual([true, false])
  })
})
