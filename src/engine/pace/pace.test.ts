import { describe, expect, it } from 'vitest'
import { plan, stagesToTarget } from './pace'

const today = new Date('2026-11-01')

describe('pace engine', () => {
  it('a N1 target still starts from the placement stage', () => {
    expect(stagesToTarget('hiragana', 'N1')).toEqual(['hiragana', 'katakana', 'N5', 'N4', 'N3', 'N2', 'N1'])
    expect(stagesToTarget('N5', 'N1')[0]).toBe('N5')
  })

  it('without a date, pace follows daily minutes and projects a finish date', () => {
    const p = plan({ stage: 'N5', target: 'N4', minutesPerDay: 16, learned: 0, today })
    expect(p.remaining).toBe(876 + 952)
    expect(p.newPerDay).toBe(10)
    expect(p.status).toBe('free')
    expect(p.finish.toISOString().slice(0, 10)).toBe('2027-05-03')    // 183 days
  })

  it('when the date is too close, pushes the load up by at most 25%', () => {
    const p = plan({ stage: 'N5', target: 'N4', minutesPerDay: 16, learned: 0, targetDate: '2026-12-01', today })
    expect(p.status).toBe('behind')
    expect(p.requiredPerDay).toBe(61)
    expect(p.newPerDay).toBe(13)
  })

  it('a relaxed date asks for less than capacity', () => {
    const p = plan({ stage: 'N5', target: 'N4', minutesPerDay: 16, learned: 828, targetDate: '2027-11-01', today })
    expect(p.status).toBe('on-track')
    expect(p.newPerDay).toBe(3)
  })

  it('brakes new items when accuracy drops', () => {
    const recent = Array.from({ length: 5 }, () => ({ newItems: 10, reviews: 20, correct: 13 }))
    const p = plan({ stage: 'N5', target: 'N4', minutesPerDay: 16, learned: 0, recent, today })
    expect(p.status).toBe('brake')
    expect(p.accuracy).toBeCloseTo(0.65)
    expect(p.newPerDay).toBe(5)
    expect(p.finishActual).toBeDefined()
  })
})
