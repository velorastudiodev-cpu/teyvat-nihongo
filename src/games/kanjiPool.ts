import { db } from '../data/db'
import { KANJI, type Kanji } from '../data/kanji'
import { levelOpen } from '../modules/kanji/content'
import { shuffle } from '../ui/kit'
import type { GameMode } from './common'

/** Daily: learned kanji, due ones first. Endless: every kanji of the levels you've reached. */
export async function kanjiPool(mode: GameMode, filter: (k: Kanji) => boolean = () => true) {
  const stage = (await db.profile.get('me'))?.stage
  const open = KANJI.filter((k) => levelOpen(k.level, stage) && filter(k))
  const items = await db.items.where('kind').equals('kanji').toArray()
  const due = new Set(items.filter((i) => i.due <= Date.now()).map((i) => i.id))
  if (mode === 'endless') return { pool: shuffle(open.length ? open : KANJI.filter(filter).slice(0, 20)), due }
  const learned = new Set(items.map((i) => i.id))
  const mine = open.filter((k) => learned.has(`kanji:${k.char}`))
  const ordered = [...shuffle(mine.filter((k) => due.has(`kanji:${k.char}`))), ...shuffle(mine.filter((k) => !due.has(`kanji:${k.char}`)))]
  return { pool: ordered.length >= 3 ? ordered : (open.length ? open : KANJI.filter(filter)).slice(0, 10), due }
}
