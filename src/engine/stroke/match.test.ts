import { describe, expect, it } from 'vitest'
import strokes from '../../data/strokes/base.json'
import { judgeStroke, type Pt } from './match'

const ten = (strokes as unknown as Record<string, { p: Pt[][] }>)['十'].p
const jitter = (s: Pt[], amount = 3): Pt[] => s.map(([x, y], i) => [x + Math.sin(i) * amount, y + Math.cos(i) * amount])

describe('stroke judge (十: horizontal first, then vertical)', () => {
  it('accepts a slightly wobbly correct stroke', () => {
    expect(judgeStroke(jitter(ten[0]), ten, 0)).toEqual({ ok: true })
    expect(judgeStroke(jitter(ten[1]), ten, 1)).toEqual({ ok: true })
  })
  it('catches wrong order', () => {
    expect(judgeStroke(ten[1], ten, 0)).toEqual({ ok: false, reason: 'order' })
  })
  it('catches wrong direction', () => {
    expect(judgeStroke([...ten[0]].reverse(), ten, 0)).toEqual({ ok: false, reason: 'direction' })
  })
  it('rejects a stroke in the wrong place', () => {
    expect(judgeStroke(ten[0].map(([x, y]) => [x, y + 35] as Pt), ten, 0)).toEqual({ ok: false, reason: 'shape' })
  })
  it('every N5–N4 kanji and kana has stroke paths with matching sampled points', () => {
    for (const s of Object.values(strokes as unknown as Record<string, { d: string[]; p: Pt[][] }>)) {
      expect(s.d.length).toBeGreaterThan(0)
      expect(s.p).toHaveLength(s.d.length)
    }
  })
})
