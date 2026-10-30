import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyCard } from 'ts-fsrs'
import { db } from '../data/db'
import { STAGE_INFO } from '../data/curriculum'
import { REGIONS } from '../characters'
import { atRisk, confusions, diagnose, leeches, recall, tale, transmute, TRANSMUTE_PER_DAY } from './hexen'

const DAY = 86_400_000
const item = (id: string, lapses: number, stability: number, lastDaysAgo: number) => {
  const card = { ...createEmptyCard(), lapses, stability, reps: 3, last_review: new Date(Date.now() - lastDaysAgo * DAY) }
  return { id, kind: id.startsWith('kanji') ? 'kanji' as const : 'kana' as const, stage: 'N5' as const, card, due: Date.now() + DAY }
}

describe('the Hexenzirkel', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('Alice spots the signs of being stuck', async () => {
    expect((await diagnose()).stuck).toBe(false)
    await db.items.bulkPut(Array.from({ length: 5 }, (_, i) => item(`kana:l${i}`, 4, 1, 2)))
    const d = await diagnose()
    expect(d.stuck).toBe(true)
    expect(d.signs.map((s) => s.id)).toContain('leech')
  })

  it('Nicole ranks cards by recall; Barbeloth finds swapped pairs', async () => {
    await db.items.bulkPut([item('kana:a', 0, 30, 1), item('kana:b', 0, 1, 10)])
    const [first] = await atRisk(2)
    expect(first.id).toBe('kana:b')
    expect(recall(first)).toBeLessThan(0.6)
    for (let i = 0; i < 3; i++) await db.mistakes.add({ itemId: 'kana:a', answer: 'ぬ', expected: 'め', at: Date.now(), fixed: false })
    expect((await confusions())[0]).toMatchObject({ count: 3 })
  })

  it('Andersdotter tells a tale from a kanji\'s parts; Rhinedottir resets a few leeches a day', async () => {
    const t = tale('kanji:休')
    expect(t?.parts.length).toBeGreaterThanOrEqual(2)
    expect(t?.story).toContain('istirahat')
    await db.items.bulkPut(Array.from({ length: 6 }, (_, i) => item(`kana:x${i}`, 5, 1, 3)))
    expect((await leeches()).length).toBe(6)
    for (let i = 0; i < TRANSMUTE_PER_DAY; i++) expect(await transmute(`kana:x${i}`)).toBe(true)
    expect(await transmute('kana:x5')).toBe(false)
    expect((await db.items.get('kana:x0'))?.card.lapses).toBe(0)
  })
})

describe('the northern regions', () => {
  it('N1 runs Fontaine → Natlan → Nod-Krai, and Snezhnaya closes the map', () => {
    expect(STAGE_INFO.N1.regions).toEqual(['fontaine', 'natlan', 'nodkrai'])
    expect(REGIONS.at(-1)?.id).toBe('snezhnaya')
  })
})
