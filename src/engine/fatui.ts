import { db, type FatuiState, type Profile } from '../data/db'
import { HARBINGERS, LOAN, OATH } from '../data/lore'
import { claim } from './game/economy'
import { addDays } from './game/rules'
import { today } from './srs/srs'

/*
 * The Fatui as foes and as partners. Foes: Harbinger duels, from the Eleventh up to the Jester; each
 * must be beaten before the next will face you. Partners: Pantalone lends Kirameki to be repaid in study,
 * Arlecchino swears you to a week of daily discipline. Contracts settle in the daily upkeep.
 */

export const DUELISTS = HARBINGERS.filter((h) => h.duel)
const stateOf = (p?: Profile): FatuiState => p?.fatui ?? { beaten: [] }

export const duelOpen = (p: Profile | undefined, id: string) => {
  const i = DUELISTS.findIndex((h) => h.id === id)
  return i === 0 || (i > 0 && stateOf(p).beaten.includes(DUELISTS[i - 1].id))
}

async function update(f: (s: FatuiState) => FatuiState) {
  const p = await db.profile.get('me')
  if (p) await db.profile.update('me', { fatui: f(stateOf(p)) })
}

/** A won duel: the first win pays the Harbinger's bounty. Returns the Kirameki granted. */
export async function winDuel(id: string) {
  const h = DUELISTS.find((x) => x.id === id)!
  await update((s) => ({ ...s, beaten: s.beaten.includes(id) ? s.beaten : [...s.beaten, id] }))
  return claim(`fatui:${id}`, h.duel!.reward)
}

const xpBetween = async (from: string, to: string) =>
  (await db.days.where('date').between(from, to, true, true).toArray()).reduce((n, d) => n + d.xp, 0)

/** Pantalone's loan: the Kirameki now (paid straight, outside any multiplier), repaid by XP within a week. */
export async function takeLoan() {
  const p = await db.profile.get('me')
  const s = stateOf(p)
  if (!p || (s.loan && !s.loan.result)) return false
  const start = today()
  await db.profile.update('me', { kirameki: (p.kirameki ?? 0) + LOAN.amount, fatui: { ...s, loan: { start, due: addDays(start, LOAN.days) } } })
  return true
}

/** Arlecchino's oath: from tomorrow, every day for a week with at least a little study. */
export async function swearOath() {
  const p = await db.profile.get('me')
  const s = stateOf(p)
  if (!p || (s.oath && !s.oath.result)) return false
  await update((x) => ({ ...x, oath: { start: addDays(today(), 1) } }))
  return true
}

export async function loanProgress(p?: Profile) {
  const loan = stateOf(p).loan
  return loan && !loan.result ? { ...loan, xp: await xpBetween(loan.start, today()) } : undefined
}

export async function oathProgress(p?: Profile, date = today()) {
  const oath = stateOf(p).oath
  if (!oath || oath.result) return
  const days = Array.from({ length: OATH.days }, (_, i) => addDays(oath.start, i))
  const logs = new Map((await db.days.where('date').anyOf(days).toArray()).map((d) => [d.date, d.xp]))
  return { ...oath, days: days.map((d) => ({ date: d, kept: (logs.get(d) ?? 0) >= OATH.xpPerDay, past: d < date })) }
}

/** Daily settlement of both contracts. Returns what happened, for a message. */
export async function settleContracts(date = today()) {
  const p = await db.profile.get('me')
  const s = stateOf(p)
  const events: string[] = []
  if (s.loan && !s.loan.result && date > s.loan.due) {
    const xp = await xpBetween(s.loan.start, s.loan.due)
    if (xp >= LOAN.xpToRepay) { await update((x) => ({ ...x, loan: { ...x.loan!, result: 'repaid' } })); events.push('Pantalone: pinjaman lunas dengan belajar. "Pertukaran yang setara."') }
    else {
      const have = (await db.profile.get('me'))?.kirameki ?? 0
      const taken = Math.min(have, LOAN.penalty)
      await db.profile.update('me', { kirameki: have - taken })
      await update((x) => ({ ...x, loan: { ...x.loan!, result: 'collected', collected: taken } }))
      events.push(`Pantalone menagih ${taken} Kirameki: XP-mu baru ${xp}/${LOAN.xpToRepay}.`)
    }
  }
  const oath = await oathProgress(p, date)
  if (oath) {
    if (oath.days.some((d) => d.past && !d.kept)) { await update((x) => ({ ...x, oath: { ...x.oath!, result: 'broken' } })); events.push('Arlecchino: sumpah Hearth House dilanggar. "Mengecewakan."') }
    else if (oath.days.every((d) => d.past && d.kept)) {
      await update((x) => ({ ...x, oath: { ...x.oath!, result: 'kept' } }))
      const got = await claim(`oath:${oath.start}`, OATH.reward)
      events.push(`Arlecchino: sumpah ditepati. +${got} Kirameki.`)
    }
  }
  return events
}
