import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyCard } from 'ts-fsrs'
import { db } from '../data/db'
import { addDays } from './game/rules'
import { earn } from './game/economy'
import { answer, bumpDay, learn, today } from './srs/srs'
import { blessingStatus, claimBlessing, judged, multipliers, newLessonsLocked, watchOrder } from './celestia'
import { drainAbyss, refreshAbyss, seal, stageOf, xpMult } from './abyss'
import { duelOpen, settleContracts, swearOath, takeLoan, winDuel } from './fatui'

const profile = () => db.profile.get('me')
const DAY = 86_400_000
const card = (due: number, lapses = 0) => ({ ...createEmptyCard(new Date(due)), due: new Date(due), lapses })
const addItems = (n: number, due: number, lapses = 0) =>
  db.items.bulkPut(Array.from({ length: n }, (_, i) => ({ id: `kana:t${due}${i}`, kind: 'kana' as const, stage: 'hiragana' as const, card: card(due, lapses), due })))

describe('Celestia and the Four Shades', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('Ronova: five fast wrong answers in a row halve XP for a day', async () => {
    for (let i = 0; i < 5; i++) await answer('kana:x', false, 400)
    await new Promise((r) => setTimeout(r, 20))
    expect(judged(await profile(), 'ronova')).toBe(true)
    await bumpDay({ xp: 10 })
    expect((await db.days.get(today()))?.xp).toBe(5)
  })

  it('Naberius: cramming far past your share locks new lessons until tomorrow', async () => {
    await db.profile.update('me', { minutesPerDay: 10 })
    await learn(Array.from({ length: 45 }, (_, i) => ({ id: `kana:n${i}`, kind: 'kana' as const, stage: 'hiragana' as const })))
    expect(newLessonsLocked(await profile())).toBe(true)
  })

  it('Istaroth: a pile overdue for days halves Kirameki until it is cleared; Asmoday: a turned-back clock zeroes it', async () => {
    await addItems(20, Date.now() - 5 * DAY)
    await watchOrder()
    expect(multipliers(await profile()).kirameki).toBe(0.5)
    await db.items.clear(); await watchOrder()
    expect(judged(await profile(), 'istaroth')).toBe(false)
    await db.days.put({ date: addDays(today(), 5), xp: 10, reviews: 0, correct: 0, newItems: 0, minutes: 0 })
    await watchOrder()
    expect(await earn(100)).toBe(0)
  })

  it('a clean week of study earns one blessing; Asmoday\'s gives +20% Kirameki', async () => {
    for (let i = 0; i < 5; i++) await db.days.put({ date: addDays(today(), -i), xp: 30, reviews: 0, correct: 0, newItems: 0, minutes: 0 })
    expect((await blessingStatus()).ready).toBe(true)
    expect(await claimBlessing('asmoday')).toBe(true)
    expect(await claimBlessing('ronova')).toBe(false)            // once a week
    expect(await earn(100)).toBe(120)
  })
})

describe('the Abyss and the Five Sinners', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('overdue cards wake Vedrfolnir; erosion drains Kirameki once a day; a seal silences him', async () => {
    await addItems(45, Date.now() - DAY)
    await refreshAbyss()
    expect(stageOf(await profile(), 'vedrfolnir')).toBe(2)
    expect(await drainAbyss()).toBe(10)
    expect(await drainAbyss()).toBe(0)
    expect((await profile())?.kirameki).toBe(150)
    await seal('vedrfolnir')
    expect(stageOf(await profile(), 'vedrfolnir')).toBe(0)
  })

  it('six or more stages in total eat 20% of XP; nothing learned is ever removed', async () => {
    await addItems(80, Date.now() - DAY, 3)                          // Vedrfolnir 3, Rerir 3
    await refreshAbyss()
    expect(xpMult(await profile())).toBe(0.8)
    await drainAbyss()
    expect(await db.items.count()).toBe(80)
  })
})

describe('the Fatui', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('duels open from the Eleventh upward and pay once', async () => {
    expect(duelOpen(await profile(), 'tartaglia')).toBe(true)
    expect(duelOpen(await profile(), 'pantalone')).toBe(false)
    expect(await winDuel('tartaglia')).toBe(200)
    expect(await winDuel('tartaglia')).toBe(0)
    expect(duelOpen(await profile(), 'pantalone')).toBe(true)
  })

  it('Pantalone collects an unpaid loan; Arlecchino rewards a kept oath', async () => {
    expect(await takeLoan()).toBe(true)
    expect((await profile())?.kirameki).toBe(460)
    await settleContracts(addDays(today(), 8))
    expect((await profile())?.fatui?.loan?.result).toBe('collected')
    expect((await profile())?.kirameki).toBe(60)

    await swearOath()
    const start = (await profile())!.fatui!.oath!.start
    for (let i = 0; i < 7; i++) await db.days.put({ date: addDays(start, i), xp: 25, reviews: 0, correct: 0, newItems: 0, minutes: 0 })
    const events = await settleContracts(addDays(start, 7))
    expect((await profile())?.fatui?.oath?.result).toBe('kept')
    expect(events.join()).toContain('ditepati')
  })
})
