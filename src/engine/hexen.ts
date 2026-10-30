import { createEmptyCard } from 'ts-fsrs'
import { db, type SrsItem } from '../data/db'
import { kanjiById, wordById } from '../data/kanji'
import { addDays } from './game/rules'
import { today } from './srs/srs'

/*
 * The Hexenzirkel, for when you are stuck. `diagnose` reads the signs (low accuracy, cards forgotten
 * again and again, a review pile, absence, failed gate exams); each witch then helps in her own way.
 */

const DAY = 86_400_000
export const LEECH = 3
export const TRANSMUTE_PER_DAY = 5

export interface Sign { id: string; text: string; to: string; action: string }

/** FSRS recall probability now: (1 + t / 9S)^-1, t in days since the last review. */
export const recall = (it: SrsItem, now = Date.now()) => {
  const last = it.card.last_review ? +new Date(it.card.last_review) : now
  const t = Math.max(0, (now - last) / DAY)
  return 1 / (1 + t / (9 * Math.max(0.1, it.card.stability)))
}

export async function diagnose(now = Date.now()) {
  const since = now - 7 * DAY
  const reviews = await db.reviews.where('at').above(since).toArray()
  const accuracy = reviews.length ? reviews.filter((r) => r.rating > 1).length / reviews.length : 1
  const items = await db.items.toArray()
  const leeches = items.filter((i) => i.card.lapses >= LEECH)
  const due = items.filter((i) => i.due <= now).length
  const mistakes = await db.mistakes.filter((m) => !m.fixed).count()
  const week = await db.days.where('date').between(addDays(today(), -3), addDays(today(), -1), true, true).toArray()
  const absent = items.length > 0 && week.filter((d) => d.xp > 0).length === 0
  const gateFails = await db.exams.where('kind').equals('gate').filter((e) => !e.passed).count()

  const signs: Sign[] = []
  if (reviews.length >= 20 && accuracy < 0.7) signs.push({ id: 'accuracy', text: `Akurasi 7 hari terakhir ${Math.round(accuracy * 100)}%. Materi baru terlalu cepat; perkuat dulu yang sudah ada.`, to: '/review', action: 'Fokus review' })
  if (leeches.length >= 5) signs.push({ id: 'leech', text: `${leeches.length} kartu sudah terlupa ${LEECH}× atau lebih. Kartu seperti ini butuh cara mengingat baru.`, to: '/hexenzirkel#andersdotter', action: 'Dongeng pengingat' })
  if (due >= 40) signs.push({ id: 'pile', text: `${due} kartu menunggu review. Kerjakan sedikit demi sedikit, 20 kartu per sesi.`, to: '/review', action: 'Review 20 kartu' })
  if (mistakes >= 20) signs.push({ id: 'mistakes', text: `${mistakes} kesalahan belum dibalas.`, to: '/revenge', action: 'Revenge Quest' })
  if (absent) signs.push({ id: 'absent', text: 'Tiga hari tanpa belajar. Mulai lagi dengan sesi kecil 5 menit saja.', to: '/', action: 'Langkah kecil' })
  if (gateFails >= 2) signs.push({ id: 'gate', text: `Gate Exam gagal ${gateFails}×. Latih bagian terlemah dari hasil ujianmu dulu.`, to: '/insight', action: 'Lihat kelemahan' })
  return { signs, stuck: signs.length > 0, accuracy, leeches: leeches.length, due }
}

/** Nicole: the cards you are about to forget (lowest recall first). */
export async function atRisk(n = 10, now = Date.now()) {
  const items = await db.items.toArray()
  return items.filter((i) => i.card.reps > 0).sort((a, b) => recall(a, now) - recall(b, now)).slice(0, n)
}

/** Barbeloth: answer pairs you keep swapping, from the mistake journal. */
export async function confusions(n = 6) {
  const ms = await db.mistakes.toArray()
  const pairs = new Map<string, { given: string; expected: string; count: number; itemId: string }>()
  for (const m of ms) {
    if (!m.answer || !m.expected || m.answer === m.expected) continue
    const key = [m.answer, m.expected].sort().join('↔')
    const p = pairs.get(key) ?? { given: m.answer, expected: m.expected, count: 0, itemId: m.itemId }
    p.count++
    pairs.set(key, p)
  }
  return [...pairs.values()].sort((a, b) => b.count - a.count).slice(0, n)
}

/** Items behind the confusions, for a focused drill. */
export async function confusionPool() {
  const ids = new Set((await confusions(10)).map((c) => c.itemId))
  return (await db.items.where('id').anyOf([...ids]).toArray()).map((i) => ({ id: i.id, kind: i.kind }))
}

/** Andersdotter: a small tale built from the parts of a hard kanji or word. */
export function tale(itemId: string): { title: string; meaning: string; parts: { glyph: string; meaning?: string }[]; story: string } | undefined {
  const [kind, key] = [itemId.slice(0, itemId.indexOf(':')), itemId.slice(itemId.indexOf(':') + 1)]
  const glyphs = kind === 'kanji' ? (kanjiById.get(itemId)?.parts ?? []) : kind === 'vocab' ? [...key].filter((c) => kanjiById.has(`kanji:${c}`)) : []
  const meaning = kind === 'kanji' ? kanjiById.get(itemId)?.meaning : wordById.get(itemId)?.meaning
  if (!meaning || glyphs.length < 2) return
  const parts = glyphs.map((g) => ({ glyph: g, meaning: kanjiById.get(`kanji:${g}`)?.meaning?.split(/[;,]/)[0] }))
  const named = parts.map((p) => `「${p.glyph}」${p.meaning ? ` (${p.meaning})` : ''}`)
  const story = `${named.slice(0, -1).join(', ')} bertemu ${named.at(-1)}. Bersama-sama mereka menjadi "${meaning}". Bayangkan adegannya setiap kali melihat ${key}.`
  return { title: key, meaning, parts, story }
}

export async function leeches(n = 8) {
  return (await db.items.toArray()).filter((i) => i.card.lapses >= LEECH).sort((a, b) => b.card.lapses - a.card.lapses).slice(0, n)
}

/** Rhinedottir: dissolve a leech and learn it again from nothing (a fresh card, due now). A few a day. */
export async function transmute(itemId: string, now = new Date()) {
  const key = `transmute:${today()}`
  const used = (await db.unlocks.where('id').startsWith(key).count())
  if (used >= TRANSMUTE_PER_DAY) return false
  const item = await db.items.get(itemId)
  if (!item) return false
  const card = createEmptyCard(now)
  await db.items.update(itemId, { card, due: +now })
  await db.unlocks.add({ id: `${key}:${itemId}`, at: +now })
  return true
}
