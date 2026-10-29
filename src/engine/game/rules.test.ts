import { describe, expect, it } from 'vitest'
import { commissionsFor, daysToFreeze, friendLevel, HARD_PITY, rank, roll, streak, weekId } from './rules'

describe('game rules', () => {
  it('weeks start on Monday', () => {
    expect(weekId('2026-10-29')).toBe('2026-10-26')   // Thursday
    expect(weekId('2026-10-26')).toBe('2026-10-26')
    expect(weekId('2026-11-01')).toBe('2026-10-26')   // Sunday
  })

  it('four commissions a day, review always first, stable for the day', () => {
    const a = commissionsFor('2026-10-29'), b = commissionsFor('2026-10-29')
    expect(a.map((c) => c.id)).toEqual(b.map((c) => c.id))
    expect(a).toHaveLength(4)
    expect(a[0].id).toBe('review')
    expect(new Set(a.map((c) => c.id)).size).toBe(4)
    expect(a[0].progress({ xp: 0, reviews: 12, correct: 0, newItems: 0 })).toBe(12)
  })

  it('streak counts back from today or yesterday, freezes bridge gaps', () => {
    const days = [{ date: '2026-10-26', xp: 5 }, { date: '2026-10-27', xp: 9 }, { date: '2026-10-28', xp: 3 }]
    expect(streak(days, '2026-10-28')).toBe(3)
    expect(streak(days, '2026-10-29')).toBe(3)       // today not done yet
    expect(streak(days, '2026-10-30')).toBe(0)       // missed a day
    expect(daysToFreeze(days, '2026-10-30', 1)).toEqual(['2026-10-29'])
    expect(daysToFreeze(days, '2026-10-31', 1)).toEqual([])   // 2 missed days, 1 freeze
    expect(streak([...days, { date: '2026-10-29', xp: 0, frozen: true }], '2026-10-30')).toBe(4)
  })

  it('adventure rank grows with xp', () => {
    expect(rank(0).ar).toBe(1)
    expect(rank(40).ar).toBe(2)
    expect(rank(1000).ar).toBe(6)
    expect(rank(10_000_000).ar).toBe(60)
  })

  it('gacha guarantees a character within the hard pity', () => {
    let pity = 0, since = 0, worst = 0
    for (let i = 0; i < 500; i++) {
      const r = roll(pity, 0.99)                // worst luck every time
      pity = r.pity
      since = r.rarity === 5 ? 0 : since + 1
      worst = Math.max(worst, since)
    }
    expect(worst).toBe(HARD_PITY - 1)
    expect(roll(0, 0.01).rarity).toBe(5)
    expect(roll(0, 0.2).rarity).toBe(4)
  })

  it('friendship levels', () => {
    expect(friendLevel(0)).toBe(1)
    expect(friendLevel(60)).toBe(2)
    expect(friendLevel(99999)).toBe(10)
  })
})
