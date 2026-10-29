import { db, type Profile } from '../data/db'
import { GRAMMAR } from '../data/grammar'
import { KANJI, VOCAB, type Level } from '../data/kanji'
import { STAGE_INFO, type Stage } from '../data/curriculum'
import { gateFor } from './exam/gate'
import type { IconName } from '../ui/Icon'

export interface Step { to: string; title: string; desc: string; icon: IconName; minutes: number }
export interface Plan { main: Step; more: Step[]; due: number; learned: number; total: number }

const REVIEW_FIRST = 8   // this many due cards come before anything new

/**
 * The one thing to do next, for the home screen: overdue reviews first, then the least advanced part of
 * the current stage (kana, or kanji / vocabulary / grammar), then the gate exam once the stage is done.
 */
export async function nextPlan(profile: Profile): Promise<Plan> {
  const stage: Stage = profile.stage ?? 'hiragana'
  const due = await db.items.where('due').below(Date.now()).count()
  const review: Step = { to: '/review', title: `Review ${due} kartu`, desc: 'Kartu yang hampir terlupa. Paling efektif dikerjakan dulu.', icon: 'replay', minutes: Math.max(2, Math.ceil(due * 0.25)) }

  let tracks: (Step & { done: number; of: number })[]
  if (stage === 'hiragana' || stage === 'katakana') {
    const done = await db.items.where('stage').equals(stage).count()
    tracks = [{ to: `/kana/learn/${stage}`, title: `Pelajaran ${stage}`, desc: '5 huruf baru, mnemonic, lalu kuis cepat.', icon: 'brush', minutes: 4, done, of: STAGE_INFO[stage].kana }]
  } else {
    const level = stage as Level
    const items = await db.items.where('stage').equals(stage).toArray()
    const count = (kind: string) => items.filter((i) => i.kind === kind).length
    const grammar = GRAMMAR.filter((p) => p.level === level)
    const nextPattern = grammar.find((p) => !items.some((i) => i.id === `grammar:${p.id}`))
    tracks = [
      { to: `/kanji/learn/${level}`, title: `Kanji ${level} baru`, desc: '5 kanji: arti, bacaan, urutan goresan.', icon: 'brush', minutes: 5, done: count('kanji'), of: KANJI.filter((k) => k.level === level).length },
      { to: `/vocab/learn/${level}`, title: `Kosakata ${level} baru`, desc: '6 kata dengan suara dan contoh.', icon: 'cards', minutes: 4, done: count('vocab'), of: VOCAB.filter((w) => w.level === level).length },
      { to: nextPattern ? `/grammar/learn/${nextPattern.id}` : '/grammar', title: nextPattern ? `Grammar: ${nextPattern.title}` : `Grammar ${level}`, desc: 'Satu pola, contoh kalimat, 5 latihan.', icon: 'blocks', minutes: 6, done: count('grammar'), of: grammar.length },
    ]
  }
  const open = tracks.filter((t) => t.done < t.of).sort((a, b) => a.done / a.of - b.done / b.of)
  const learned = tracks.reduce((n, t) => n + Math.min(t.done, t.of), 0)
  const total = tracks.reduce((n, t) => n + t.of, 0)

  const gate = gateFor(stage)
  const exam: Step | undefined = gate && !open.length
    ? { to: '/gate', title: 'Gate Exam', desc: 'Materi tahap ini sudah lengkap. Lulus ≥70% untuk membuka region berikutnya.', icon: 'exam', minutes: 15 }
    : undefined
  const daily: Step = { to: '/daily', title: 'Commission harian', desc: '4 misi kecil, hadiah Kirameki.', icon: 'scroll', minutes: 10 }

  const steps = [
    ...(due >= REVIEW_FIRST ? [review] : []),
    ...open.slice(0, 1),
    ...(exam ? [exam] : []),
    ...(due > 0 && due < REVIEW_FIRST ? [review] : []),
    ...open.slice(1),
    daily,
  ]
  return { main: steps[0], more: steps.slice(1, 4), due, learned, total }
}
