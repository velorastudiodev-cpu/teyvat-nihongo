import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { Rating } from 'ts-fsrs'
import { db } from '../../data/db'
import { answer, dueItems, gradeFor, learn, today } from './srs'

const DAY = 86_400_000

describe('srs', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('grades by correctness and speed', () => {
    expect(gradeFor(false, 500)).toBe(Rating.Again)
    expect(gradeFor(true, 9000)).toBe(Rating.Hard)
    expect(gradeFor(true, 1200)).toBe(Rating.Good)
  })

  it('learning schedules items in the future and counts new items for today', async () => {
    const now = new Date()
    expect(await learn([{ id: 'kana:あ', kind: 'kana', stage: 'hiragana' }], now)).toBe(1)
    expect(await learn([{ id: 'kana:あ', kind: 'kana', stage: 'hiragana' }], now)).toBe(0)
    expect(await dueItems(+now)).toHaveLength(0)
    expect((await db.days.get(today()))?.newItems).toBe(1)
  })

  it('a wrong review comes back sooner than a right one and lands in the mistake journal', async () => {
    const now = new Date()
    await learn([{ id: 'kana:あ', kind: 'kana', stage: 'hiragana' }, { id: 'kana:い', kind: 'kana', stage: 'hiragana' }], now)
    const later = new Date(+now + 30 * DAY)
    await answer('kana:あ', true, 1000, 'a', 'a', later)
    await answer('kana:い', false, 1000, 'ri', 'i', later)
    const [a, i] = await db.items.bulkGet(['kana:あ', 'kana:い'])
    expect(i!.due).toBeLessThan(a!.due)
    expect(await db.mistakes.where('itemId').equals('kana:い').count()).toBe(1)
    expect(await db.reviews.count()).toBe(2)
  })
})
