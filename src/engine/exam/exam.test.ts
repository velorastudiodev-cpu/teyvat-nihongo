import { describe, expect, it } from 'vitest'
import { buildExam, grade } from './exam'
import { LEVELS } from '../../data/kanji'

describe('exam builder', () => {
  for (const level of LEVELS) {
    it(`${level} mock has the 3 JLPT sections with valid 4-choice questions`, () => {
      const e = buildExam('mock', level, 'seed-1')
      expect(e.sections.map((s) => s.id)).toEqual(['moji', 'bunpou', 'choukai'])
      for (const s of e.sections) for (const q of s.questions) {
        expect(q.choices).toContain(q.answer)
        expect(new Set(q.choices).size, `${q.tag}: ${q.choices}`).toBe(q.choices.length)
        expect(q.choices.length).toBeGreaterThanOrEqual(3)
      }
    })
  }

  it('is reproducible from a seed', () => {
    expect(buildExam('gate', 'N5', 'x')).toEqual(buildExam('gate', 'N5', 'x'))
  })

  it('grades sections and tags; gate needs 70%', () => {
    const e = buildExam('gate', 'N5', 'y')
    const all: Record<string, string> = {}
    e.sections.forEach((s) => s.questions.forEach((q, i) => { all[`${s.id}:${i}`] = q.answer }))
    expect(grade(e, all).passed).toBe(true)
    expect(grade(e, all).ratio).toBe(1)
    const total = e.sections.reduce((n, s) => n + s.questions.length, 0)
    const keys = Object.keys(all)
    const some = Object.fromEntries(keys.slice(0, Math.floor(total * 0.6)).map((k) => [k, all[k]]))
    expect(grade(e, some).passed).toBe(false)
    expect(Object.values(grade(e, {}).tags).every(([r]) => r === 0)).toBe(true)
  })
})
