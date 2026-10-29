import { createEmptyCard, fsrs, Rating, type Grade } from 'ts-fsrs'
import { db, type SrsItem } from '../../data/db'

const scheduler = fsrs()
export const today = (d = new Date()) => d.toLocaleDateString('sv')   // YYYY-MM-DD, local time

/** Wrong → Again, slow (>6s) → Hard, otherwise Good. */
export const gradeFor = (correct: boolean, ms: number): Grade =>
  !correct ? Rating.Again : ms > 6000 ? Rating.Hard : Rating.Good

type Counter = 'xp' | 'reviews' | 'correct' | 'newItems' | 'minutes'

/** Adds to today's counters. XP also grows friendship with the current companion. */
export async function bumpDay(patch: Partial<Record<Counter, number>>) {
  const date = today()
  await db.transaction('rw', db.days, db.profile, db.owned, async () => {
    const d = (await db.days.get(date)) ?? { date, xp: 0, reviews: 0, correct: 0, newItems: 0, minutes: 0 }
    for (const [k, v] of Object.entries(patch) as [Counter, number][]) d[k] += v
    await db.days.put(d)
    if (patch.xp) {
      const companion = (await db.profile.get('me'))?.companionId
      const owned = companion && (await db.owned.get(companion))
      if (owned) await db.owned.update(owned.charId, { friendship: owned.friendship + patch.xp })
    }
  })
}

/** Counts a finished game for today (commissions read this). */
export async function logPlay(game: string) {
  const date = today()
  await db.transaction('rw', db.days, async () => {
    const d = (await db.days.get(date)) ?? { date, xp: 0, reviews: 0, correct: 0, newItems: 0, minutes: 0 }
    d.games = { ...d.games, [game]: (d.games?.[game] ?? 0) + 1 }
    d.xp += 5
    await db.days.put(d)
  })
}

/** Introduce new items after their lesson quiz. */
export async function learn(items: Pick<SrsItem, 'id' | 'kind' | 'stage'>[], now = new Date()) {
  const fresh = []
  for (const it of items) {
    if (await db.items.get(it.id)) continue
    const card = scheduler.next(createEmptyCard(now), now, Rating.Good).card
    fresh.push({ ...it, card, due: +card.due })
  }
  await db.items.bulkPut(fresh)
  await bumpDay({ newItems: fresh.length, xp: fresh.length * 5 })
  return fresh.length
}

/** Record one answer: reschedules the item if it was due, logs mistakes either way. */
export async function answer(itemId: string, correct: boolean, ms: number, given = '', expected = '', now = new Date()) {
  const item = await db.items.get(itemId)
  if (item && item.due <= +now) {
    const rating = gradeFor(correct, ms)
    const card = scheduler.next(item.card, now, rating).card
    await db.items.update(itemId, { card, due: +card.due })
    await db.reviews.add({ itemId, rating, at: +now, ms })
    await bumpDay({ reviews: 1, correct: correct ? 1 : 0, xp: correct ? 2 : 0 })
  }
  if (!correct) await db.mistakes.add({ itemId, answer: given, expected, at: +now, fixed: false })
}

export const dueItems = (now = Date.now()) => db.items.where('due').belowOrEqual(now).toArray()

/** Good at least once and stable for a week: counts as mastered (used for furigana fading later). */
export const isMastered = (it: SrsItem) => it.card.stability >= 7
