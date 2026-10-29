import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/db'
import { bumpDay, logPlay } from '../srs/srs'
import { claim, dailyUpkeep, spend } from './economy'

describe('economy', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('starts with 160 Kirameki, rewards are claimed once, spending checks the balance', async () => {
    expect((await db.profile.get('me'))?.kirameki).toBe(160)
    expect(await claim('claim:2026-10-29:review', 40)).toBe(40)
    expect(await claim('claim:2026-10-29:review', 40)).toBe(0)
    expect(await spend(1000)).toBe(false)
    expect(await spend(100)).toBe(true)
    expect((await db.profile.get('me'))?.kirameki).toBe(100)
  })

  it('xp grows friendship with the companion; games are counted for commissions', async () => {
    await bumpDay({ xp: 30 })
    await logPlay('kana-rain')
    expect((await db.owned.get('paimon'))?.friendship).toBe(30)
    const [day] = await db.days.toArray()
    expect(day.games).toEqual({ 'kana-rain': 1 })
  })

  it('weekly freeze grant + freezes cover a missed day', async () => {
    await db.days.bulkPut([{ date: '2026-10-27', xp: 10, reviews: 0, correct: 0, newItems: 0, minutes: 0 }])
    await db.profile.update('me', { freezes: 0, freezeWeek: undefined })
    const { frozen } = await dailyUpkeep('2026-10-29')        // missed the 28th, gets 1 free freeze this week
    expect(frozen).toEqual(['2026-10-28'])
    expect((await db.profile.get('me'))?.freezes).toBe(0)
    expect((await dailyUpkeep('2026-10-29')).frozen).toEqual([])   // idempotent, no double grant
  })
})
