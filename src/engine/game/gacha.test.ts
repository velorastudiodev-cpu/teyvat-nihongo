import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/db'
import { pull } from './gacha'
import { HARD_PITY } from './rules'

describe('gacha', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('costs Kirameki and refuses when broke', async () => {
    await db.profile.update('me', { kirameki: 50 })
    expect(await pull(1)).toBeUndefined()
    await db.profile.update('me', { kirameki: 100 })
    expect(await pull(1)).toHaveLength(1)
  })

  it('a 10-pull always contains a new character', async () => {
    await db.profile.update('me', { kirameki: 100 * HARD_PITY })
    const before = await db.owned.count()
    const got = await pull(HARD_PITY)
    expect(got!.some((r) => r.rarity === 5)).toBe(true)
    expect(await db.owned.count()).toBeGreaterThan(before)
    expect((await db.profile.get('me'))?.pulls).toBe(HARD_PITY)
  })
})
