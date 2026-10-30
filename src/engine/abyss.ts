import { db, type AbyssState, type Profile } from '../data/db'
import { SINNERS, type SinnerId } from '../data/lore'
import { addDays } from './game/rules'
import { today } from './srs/srs'

/*
 * The Five Sinners each feed on one kind of neglect and rise through stages 0–3:
 *   1 whisper  – a warning only
 *   2 erosion  – drains Kirameki once a day (10 per Sinner)
 *   3 corruption – drains more (20), and the companion's friendship fades (−5 a day)
 * With 6+ stages in total the Abyss also eats 20% of the XP you earn. Clearing the cause lowers the
 * stage at the next reading; winning an Abyss Rift seals that Sinner for 48 hours. Learned items,
 * reviews and history are never deleted: corrosion only takes rewards.
 */

export const DRAIN = [0, 0, 10, 20]
export const FRIENDSHIP_DRAIN = 5
export const XP_EROSION = { stages: 6, mult: 0.8 }
export const SEAL_HOURS = 48
export const LAPSES = 3

const empty = (): AbyssState => ({ stages: {}, seals: {}, drained: {} })
export const abyssOf = (p?: Profile) => p?.abyss ?? empty()
export const sealed = (p: Profile | undefined, id: SinnerId, now = Date.now()) => (abyssOf(p).seals[id] ?? 0) > now
export const stageOf = (p: Profile | undefined, id: SinnerId, now = Date.now()) => (sealed(p, id, now) ? 0 : abyssOf(p).stages[id] ?? 0)
export const totalStages = (p?: Profile, now = Date.now()) => SINNERS.reduce((n, s) => n + stageOf(p, s.id, now), 0)
export const xpMult = (p?: Profile, now = Date.now()) => (totalStages(p, now) >= XP_EROSION.stages ? XP_EROSION.mult : 1)

const stageFor = (value: number, [a, b, c]: [number, number, number]) => (value >= c ? 3 : value >= b ? 2 : value >= a ? 1 : 0)

/** How much each Sinner has to feed on right now. */
export async function measure(now = Date.now()): Promise<Record<SinnerId, number>> {
  const p = await db.profile.get('me')
  const created = new Date(p?.createdAt ?? now).toLocaleDateString('sv')
  const date = today()
  const week = Array.from({ length: 7 }, (_, i) => addDays(date, -(i + 1))).filter((d) => d >= created)
  const days = new Map((await db.days.where('date').anyOf(week).toArray()).map((d) => [d.date, d]))
  const items = await db.items.toArray()
  return {
    vedrfolnir: items.filter((i) => i.due <= now).length,
    hroptatyr: await db.mistakes.filter((m) => !m.fixed).count(),
    rhinedottir: week.filter((d) => !days.get(d)?.frozen && !(days.get(d)?.xp)).length,
    surtalogi: items.length ? week.filter((d) => !(days.get(d)?.newItems)).length : 0,
    rerir: items.filter((i) => i.card.lapses >= LAPSES).length,
  }
}

/** Re-reads every Sinner and stores the stages. Returns Sinners that just reached a higher stage. */
export async function refreshAbyss(now = Date.now()) {
  const values = await measure(now)
  const p = await db.profile.get('me')
  if (!p) return []
  const a = abyssOf(p)
  const stages = Object.fromEntries(SINNERS.map((s) => [s.id, stageFor(values[s.id], s.thresholds)]))
  const rising = SINNERS.filter((s) => stages[s.id] > (a.seen?.[s.id] ?? 0) && !sealed(p, s.id, now))
  const seen = Object.fromEntries(SINNERS.map((s) => [s.id, stages[s.id]]))   // falling stages are forgotten, so a relapse announces again
  await db.profile.update('me', { abyss: { ...a, stages, seen } })
  return rising.map((s) => ({ sinner: s, stage: stages[s.id] }))
}

/** Once a day: Sinners at erosion or worse take their share of Kirameki (and friendship at corruption). */
export async function drainAbyss(date = today(), now = Date.now()) {
  const p = await db.profile.get('me')
  if (!p) return 0
  const a = abyssOf(p)
  if (a.drained[date] !== undefined) return 0
  const want = SINNERS.reduce((n, s) => n + DRAIN[stageOf(p, s.id, now)], 0)
  const taken = Math.min(want, p.kirameki ?? 0)
  const corrupt = SINNERS.some((s) => stageOf(p, s.id, now) === 3)
  await db.profile.update('me', { kirameki: (p.kirameki ?? 0) - taken, abyss: { ...a, drained: { ...a.drained, [date]: taken } } })
  if (corrupt) {
    const own = await db.owned.get(p.companionId)
    if (own) await db.owned.update(own.charId, { friendship: Math.max(0, own.friendship - FRIENDSHIP_DRAIN) })
  }
  return taken
}

export async function seal(id: SinnerId, now = Date.now()) {
  const p = await db.profile.get('me')
  const a = abyssOf(p)
  await db.profile.update('me', { abyss: { ...a, seals: { ...a.seals, [id]: now + SEAL_HOURS * 3_600_000 } } })
}

/** Questions for a Sinner's rift: the very cards it feeds on, else anything learned. */
export async function riftPool(id: SinnerId, now = Date.now()) {
  const items = await db.items.toArray()
  const mistaken = id === 'hroptatyr' ? new Set((await db.mistakes.filter((m) => !m.fixed).toArray()).map((m) => m.itemId)) : undefined
  const list = id === 'vedrfolnir' ? items.filter((i) => i.due <= now)
    : id === 'rerir' ? items.filter((i) => i.card.lapses >= LAPSES)
    : mistaken ? items.filter((i) => mistaken.has(i.id))
    : items
  return (list.length >= 4 ? list : items).map((i) => ({ id: i.id, kind: i.kind })).sort(() => Math.random() - 0.5)
}
