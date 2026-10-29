import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../data/db'
import { parse } from './sentence'
import { today } from './srs/srs'
import { DAILY, LETTER, TALKS, VOW, type Beat } from '../modules/raiden/talks'
import { greetingFor } from '../modules/raiden/lines'
import {
  BOND_LEVELS, TRIAL, VOW_TITLE, bondLevel, checkLetter, finishTalk, giveDango, passTrial, passedN1, phaseOf, takeVow, talkFor, tapSigil, titleOf, vowReady,
} from './raiden'

const profile = () => db.profile.get('me')

describe('raiden questline', () => {
  beforeEach(async () => { await db.delete(); await db.open() })

  it('bond levels climb 1 → 10 at the thresholds', () => {
    expect(bondLevel(0)).toBe(1)
    expect(bondLevel(BOND_LEVELS[4])).toBe(5)
    expect(bondLevel(99_999)).toBe(10)
  })

  it('the letter comes on reaching Inazuma (N3), not before', async () => {
    await db.profile.update('me', { stage: 'N4' })
    expect(await checkLetter()).toBe(false)
    await db.profile.update('me', { stage: 'N3' })
    expect(await checkLetter()).toBe(true)
    expect(await checkLetter()).toBe(false)
    expect(phaseOf((await profile())?.raiden)).toBe('letter')
  })

  it('the secret: three sigil taps give a hint without a 7-day streak, the letter with one', async () => {
    expect(await tapSigil()).toBe('count')
    expect(await tapSigil()).toBe('count')
    expect(await tapSigil()).toBe('hint')
    for (let i = 0; i < 7; i++) await db.days.put({ date: new Date(Date.now() - i * 864e5).toLocaleDateString('sv'), xp: 40, reviews: 1, correct: 1, newItems: 1, minutes: 5 })
    await tapSigil(); await tapSigil()
    expect(await tapSigil()).toBe('letter')
    expect(await tapSigil()).toBe('none')
  })

  it('passing the trial gives Raiden and Kirameki once; talks build the bond, one per day', async () => {
    await db.profile.update('me', { stage: 'N3' }); await checkLetter()
    await passTrial(); await passTrial()
    expect(await db.owned.get('raiden')).toBeTruthy()
    expect((await profile())?.kirameki).toBe(160 + 300)
    const first = talkFor(await profile())!
    expect(first.id).toBe('meet')
    const res = await finishTalk(first, 1)
    expect(res.gained).toBe(20)
    expect(talkFor(await profile())).toBeUndefined()            // done for today
    expect(await giveDango()).toBe(true)
    expect(await giveDango()).toBe(false)                         // once a day
    expect((await profile())?.raiden?.bond).toBe(45)
  })

  it('studying with her as companion adds to the day’s talk; the Euthymia talk introduces Ei', async () => {
    await db.profile.update('me', { stage: 'N3', companionId: 'raiden' }); await checkLetter(); await passTrial()
    await db.days.put({ date: today(), xp: 120, reviews: 0, correct: 0, newItems: 0, minutes: 0 })
    expect((await finishTalk(TALKS[0], 0)).study).toBe(12)
    const r = (await profile())!.raiden!
    await db.profile.update('me', { raiden: { ...r, bond: BOND_LEVELS[4], lastTalk: '2000-01-01', talks: TALKS.filter((t) => t.level < 5).map((t) => t.id) } })
    const t = talkFor(await profile())!
    expect(t.euthymia).toBe(true)
    await finishTalk(t, 1)
    expect((await profile())?.raiden?.ei).toBeTruthy()
    expect(greetingFor(await profile(), 8)?.ja).toContain('一緒')    // Ei's morning line
  })

  it('the last secret opens only at N1 (or a passed N1 mock), after meeting Ei and the Lv 10 promise', async () => {
    await db.profile.update('me', { stage: 'N3' }); await checkLetter(); await passTrial()
    const r = (await profile())!.raiden!
    await db.profile.update('me', { raiden: { ...r, ei: Date.now(), bond: BOND_LEVELS[9], talks: ['promise'] } })
    expect(vowReady(await profile(), await passedN1())).toBe(false)            // still at N3
    await db.exams.add({ kind: 'mock', level: 'N1', at: Date.now(), passed: true, sections: [], tags: {} })
    expect(vowReady(await profile(), await passedN1())).toBe(true)             // the N1 mock counts
    await db.exams.clear(); await db.profile.update('me', { stage: 'N1' })
    expect(vowReady(await profile(), await passedN1())).toBe(true)             // so does reaching N1
    const before = (await profile())!.kirameki!
    await takeVow(); await takeVow()
    expect((await profile())!.kirameki).toBe(before + 1000)
    expect(titleOf((await profile())!.raiden)).toBe(VOW_TITLE)
    expect(vowReady(await profile(), true)).toBe(false)                         // once only
    await db.profile.update('me', { companionId: 'raiden' })
    expect(greetingFor(await profile(), 20)?.ja).toContain('あなた')
  })

  it('every line parses, every question has a good reply, every trial answer is a choice', () => {
    const beats: Beat[] = [...LETTER, ...TALKS.flatMap((t) => t.beats), ...VOW.beats, ...DAILY.flatMap((d) => d('ei').beats)]
    for (const b of beats) {
      expect(parse(b.ja).length).toBeGreaterThan(0)
      if ('options' in b) {
        expect(b.options.some((o) => o.ok)).toBe(true)
        for (const o of b.options) expect(parse(o.reply.ja).length).toBeGreaterThan(0)
      }
    }
    for (const q of TRIAL) expect(q.choices).toContain(q.answer)
    expect(new Set(TALKS.map((t) => t.id)).size).toBe(TALKS.length)
  })
})
