import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/db'
import { gateFor, passGate } from './gate'

describe('gate exam', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('only the last stage of a region has a gate', () => {
    expect(gateFor('hiragana')).toBeUndefined()
    expect(gateFor('katakana')).toBeUndefined()
    expect(gateFor('N5')).toMatchObject({ region: 'mondstadt', next: 'N4', nextRegion: 'liyue', level: 'N5' })
    expect(gateFor('N4')).toMatchObject({ region: 'liyue', next: 'N3', nextRegion: 'inazuma' })
    expect(gateFor('N1')).toBeUndefined()
  })

  it('passing opens the next region, pays once and adds its sensei', async () => {
    await db.profile.update('me', { stage: 'N5', kirameki: 0 })
    const r = await passGate('N5')
    expect(r).toMatchObject({ nextRegion: 'liyue', sensei: 'zhongli', reward: 500 })
    expect((await db.profile.get('me'))?.stage).toBe('N4')
    expect(await db.owned.get('zhongli')).toBeTruthy()
    await db.profile.update('me', { stage: 'N5' })
    expect((await passGate('N5'))?.reward).toBe(0)
  })
})
