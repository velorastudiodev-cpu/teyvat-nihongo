import { describe, expect, it } from 'vitest'
import { GRAMMAR } from './grammar'
import { READINGS } from './readings'
import { parse } from '../engine/sentence'

describe('grammar & reading content', () => {
  it('every grammar sentence has exactly one key token and a translation', () => {
    for (const p of GRAMMAR) {
      expect(p.explain.split(/[.!?](\s|$)/).filter((s) => s.trim().length > 1).length, p.id).toBeLessThanOrEqual(3)
      expect(p.sentences.length, p.id).toBeGreaterThanOrEqual(3)
      for (const [ja, tr] of p.sentences) {
        expect(parse(ja).filter((t) => t.key), ja).toHaveLength(1)
        expect(tr.length).toBeGreaterThan(3)
      }
    }
    expect(new Set(GRAMMAR.map((p) => p.id)).size).toBe(GRAMMAR.length)
  })

  it('every gloss entry is a tappable token, every quiz has 3 wrong options', () => {
    for (const r of READINGS) {
      const tokens = new Set(parse(r.text.replace(/\//g, ' ')).map((t) => t.text))
      for (const g of Object.keys(r.gloss)) expect(tokens, `${r.id}: ${g}`).toContain(g)
      for (const q of r.quiz) expect(q.wrong).toHaveLength(3)
    }
  })
})
