import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../data/db'
import { learn } from './srs/srs'
import { exportAll, importAll } from './backup'

describe('backup', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('round-trips progress, SRS dates and uploaded art through JSON', async () => {
    await learn([{ id: 'kana:あ', kind: 'kana', stage: 'hiragana' }])
    await db.profile.update('me', { kirameki: 777 })
    await db.art.put({ id: 'klee:idle', blob: new Blob([new Uint8Array([1, 2, 3, 250])], { type: 'image/png' }) })
    const json = JSON.parse(JSON.stringify(await exportAll()))

    await db.delete(); await db.open()
    expect((await db.profile.get('me'))?.kirameki).toBe(160)
    await importAll(json)

    expect((await db.profile.get('me'))?.kirameki).toBe(777)
    const item = await db.items.get('kana:あ')
    expect(item?.card.due).toBeInstanceOf(Date)
    const art = await db.art.get('klee:idle')
    expect([...new Uint8Array(await art!.blob.arrayBuffer())]).toEqual([1, 2, 3, 250])
    expect(art!.blob.type).toBe('image/png')
  })

  it('rejects files that are not backups', async () => {
    await expect(importAll({ hello: 1 })).rejects.toThrow('bukan file backup')
    await expect(importAll({ app: 'teyvat-nihongo', tables: { items: 'x', profile: [{}] } })).rejects.toThrow('rusak')
  })
})
