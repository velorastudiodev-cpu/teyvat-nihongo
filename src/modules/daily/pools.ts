import { db, type SrsItem } from '../../data/db'
import { HIRAGANA, kanaId } from '../../data/kana'
import { shuffle } from '../../ui/kit'

export type Q = Pick<SrsItem, 'id' | 'kind'>

/** Everything learned so far, weakest first; a few hiragana if nothing is learned yet. */
export async function learnedPool(): Promise<(Q & { stability: number })[]> {
  const items = await db.items.toArray()
  const list = items.map((i) => ({ id: i.id, kind: i.kind, stability: i.card.stability })).sort((a, b) => a.stability - b.stability)
  return list.length >= 5 ? list : HIRAGANA.slice(0, 10).map((k) => ({ id: kanaId(k), kind: 'kana' as const, stability: 0 }))
}

/** This week's material: items reviewed or learned since Monday, else everything learned. */
export async function weekPool(weekStart: string): Promise<Q[]> {
  const since = Date.parse(`${weekStart}T00:00:00`)
  const ids = new Set(await db.reviews.where('at').aboveOrEqual(since).toArray().then((rs) => rs.map((r) => r.itemId)))
  const all = await learnedPool()
  const week = all.filter((i) => ids.has(i.id) || i.stability < 3)
  return shuffle(week.length >= 8 ? week : all)
}
