import { db, type CelestiaState, type Profile } from '../data/db'
import { BLESS_MIN_DAYS, SHADES, type ShadeId } from '../data/lore'
import { addDays, weekId } from './game/rules'
import { today } from './srs/srs'

/*
 * The Four Shades guard the order of study. Each rule maps to one Shade; breaking it brings a judgment
 * (a timed or condition-bound penalty). Keeping the order for a week earns one of their blessings.
 * Penalties only ever scale rewards or pause new lessons: no learned item is ever removed.
 */

const HOUR = 3_600_000
export const RECKLESS = { streak: 5, ms: 1500 }           // Ronova
export const PILE = { cards: 20, days: 3 }                // Istaroth
export const OVERLOAD_MIN = 40                            // Naberius: at least this many new items in a day…
export const OVERLOAD_FACTOR = 3                          // …and more than 3× your daily share
export const BLESS_DAYS = 7

const empty = (): CelestiaState => ({ judgments: [] })
const stateOf = (p?: Profile) => p?.celestia ?? empty()

export const activeJudgments = (p?: Profile, now = Date.now()) =>
  stateOf(p).judgments.filter((j) => !j.lifted && (j.until === undefined || j.until > now))
export const judged = (p: Profile | undefined, shade: ShadeId, now = Date.now()) => activeJudgments(p, now).some((j) => j.shade === shade)
export const blessingOf = (p?: Profile, now = Date.now()) => {
  const b = stateOf(p).blessing
  return b && b.until > now && !judged(p, 'asmoday', now) ? b.shade as ShadeId : undefined
}

/** Reward multipliers the economy and the day log apply. */
export function multipliers(p?: Profile, now = Date.now()) {
  const bless = blessingOf(p, now)
  return {
    kirameki: judged(p, 'asmoday', now) ? 0 : (judged(p, 'istaroth', now) ? 0.5 : 1) * (bless === 'asmoday' ? 1.2 : 1),
    xp: (judged(p, 'ronova', now) ? 0.5 : 1) * (bless === 'ronova' ? 1.15 : 1),
    friendship: bless === 'naberius' ? 2 : 1,
  }
}
export const newLessonsLocked = (p?: Profile, now = Date.now()) => judged(p, 'naberius', now)

async function update(f: (c: CelestiaState) => CelestiaState) {
  const p = await db.profile.get('me')
  if (p) await db.profile.update('me', { celestia: f(stateOf(p)) })
}

/** A Shade descends. One judgment per Shade at a time; returns whether a new one was passed. */
export async function judge(shade: ShadeId, reason: string, hours?: number, now = Date.now()) {
  const p = await db.profile.get('me')
  if (!p || judged(p, shade, now)) return false
  await update((c) => ({
    ...c,
    judgments: [...c.judgments.slice(-19), { shade, at: now, reason, until: hours === undefined ? undefined : now + hours * HOUR }],
    // Asmoday's separation also takes away the current blessing
    blessing: shade === 'asmoday' ? undefined : c.blessing,
  }))
  return true
}

async function lift(shade: ShadeId, now = Date.now()) {
  await update((c) => ({ ...c, judgments: c.judgments.map((j) => (j.shade === shade && !j.lifted && j.until === undefined ? { ...j, lifted: now } : j)) }))
}

/* Ronova: reckless guessing, watched answer by answer. */
let streak = 0
export function watchAnswer(correct: boolean, ms: number) {
  streak = !correct && ms < RECKLESS.ms ? streak + 1 : 0
  if (streak < RECKLESS.streak) return
  streak = 0
  void judge('ronova', `${RECKLESS.streak} jawaban salah beruntun, masing-masing di bawah 1,5 detik`, 24)
}

/* Naberius: cramming, checked whenever new items are learned. */
export async function watchNewItems() {
  const p = await db.profile.get('me')
  const day = await db.days.get(today())
  const share = Math.round((p?.minutesPerDay ?? 20) / 1.6)
  const limit = Math.max(OVERLOAD_MIN, OVERLOAD_FACTOR * share)
  if ((day?.newItems ?? 0) <= limit) return
  const midnight = Date.parse(`${addDays(today(), 1)}T00:00:00`)
  await judge('naberius', `${day!.newItems} materi baru dalam sehari (batasmu ${limit})`, (midnight - Date.now()) / HOUR)
}

/** Istaroth (a pile of reviews overdue for days) and Asmoday (the clock turned back), checked as the app runs. */
export async function watchOrder(now = Date.now()) {
  const pile = await db.items.where('due').below(now - PILE.days * 24 * HOUR).count()
  const p = await db.profile.get('me')
  if (pile >= PILE.cards) await judge('istaroth', `${pile} kartu terlambat lebih dari ${PILE.days} hari`, undefined, now)
  else if (judged(p, 'istaroth', now)) await lift('istaroth', now)

  const latest = (await db.days.orderBy('date').last())?.date
  if (latest && latest > addDays(today(), 1)) await judge('asmoday', `jam perangkat mundur ke ${today()}, padahal ada catatan belajar ${latest}`, 72, now)
}

/** The weekly blessing: open when you studied enough days this past week without any judgment. */
export async function blessingStatus(now = Date.now()) {
  const p = await db.profile.get('me')
  const c = stateOf(p)
  const week = weekId(today())
  const since = addDays(today(), -6)
  const days = await db.days.where('date').between(since, today(), true, true).toArray()
  const studied = days.filter((d) => d.xp > 0).length
  const clean = !c.judgments.some((j) => j.at > now - 7 * 24 * HOUR)
  return { claimed: c.blessWeek === week, studied, clean, ready: c.blessWeek !== week && clean && studied >= BLESS_MIN_DAYS }
}

export async function claimBlessing(shade: ShadeId, now = Date.now()) {
  const s = await blessingStatus(now)
  if (!s.ready) return false
  const p = await db.profile.get('me')
  await update((c) => ({ ...c, blessWeek: weekId(today()), blessing: { shade, until: now + BLESS_DAYS * 24 * HOUR } }))
  if (shade === 'istaroth') await db.profile.update('me', { freezes: Math.min(3, (p?.freezes ?? 0) + 1) })
  return true
}

/** The newest judgment not yet shown, for the descent scene; marks it as seen. */
export async function takeNewJudgment() {
  const p = await db.profile.get('me')
  const c = stateOf(p)
  const fresh = c.judgments.filter((j) => j.at > (c.seen ?? 0)).at(-1)
  if (!fresh) return
  await update((x) => ({ ...x, seen: fresh.at }))
  return { ...fresh, shade: SHADES.find((s) => s.id === fresh.shade)! }
}
