import { db } from '../data/db'
import { GRAMMAR, type Pattern } from '../data/grammar'
import { parse, type Token } from '../engine/sentence'
import { levelOpen } from '../modules/kanji/content'
import { shuffle } from '../ui/kit'
import type { GameMode } from './common'

export interface Line { ja: string; tr: string; tokens: Token[]; pattern: Pattern }

const linesOf = (ps: Pattern[]) => ps.flatMap((p) => p.sentences.map(([ja, tr]) => ({ ja, tr, tokens: parse(ja), pattern: p })))

/** Daily: sentences of patterns you've learned (due first). Endless: every sentence of the levels you've reached. */
export async function sentencePool(mode: GameMode) {
  const stage = (await db.profile.get('me'))?.stage
  const open = GRAMMAR.filter((p) => levelOpen(p.level, stage))
  const base = open.length ? open : GRAMMAR.filter((p) => p.level === 'N5')
  const items = await db.items.where('kind').equals('grammar').toArray()
  const due = new Set(items.filter((i) => i.due <= Date.now()).map((i) => i.id))
  if (mode === 'endless') return { lines: shuffle(linesOf(base)), due }
  const learned = new Set(items.map((i) => i.id))
  const mine = base.filter((p) => learned.has(`grammar:${p.id}`))
  const pick = mine.length >= 2 ? mine : base.slice(0, 4)
  const lines = linesOf(pick)
  return { lines: [...shuffle(lines.filter((l) => due.has(`grammar:${l.pattern.id}`))), ...shuffle(lines.filter((l) => !due.has(`grammar:${l.pattern.id}`)))], due }
}
