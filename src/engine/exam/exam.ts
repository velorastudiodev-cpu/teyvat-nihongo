import { GRAMMAR } from '../../data/grammar'
import { READINGS } from '../../data/readings'
import { KANJI, VOCAB, kanjiIn, levelIndex, type Level } from '../../data/kanji'
import { parse, textOf } from '../sentence'
import { blankOptions } from '../../modules/grammar/blanks'
import { seeded } from '../game/rules'

export type Section = 'moji' | 'bunpou' | 'choukai'
export const SECTION_NAME: Record<Section, string> = { moji: '文字・語彙', bunpou: '文法・読解', choukai: '聴解' }
export const TAG_NAME: Record<string, string> = {
  'kanji-read': 'Bacaan kanji', 'kanji-write': 'Penulisan kanji', 'kanji-meaning': 'Arti kanji',
  grammar: 'Tata bahasa', order: 'Susun kalimat', reading: 'Pemahaman bacaan', listening: 'Mendengar',
}
export const TAG_LINK: Record<string, string> = {
  'kanji-read': '/vocab', 'kanji-write': '/kanji', 'kanji-meaning': '/kanji', grammar: '/grammar', order: '/games/sentence-builder', reading: '/reading', listening: '/listening',
}

export interface Question {
  section: Section
  tag: string
  ask: string                 // instruction (Indonesian)
  prompt?: string             // Japanese text shown (sentence markup allowed)
  passage?: string            // reading passage id
  audio?: string              // text to speak instead of showing
  choices: string[]
  answer: string
  itemId?: string             // for the Mistake Journal
}

type Rnd = () => number
const pick = <T,>(xs: T[], r: Rnd) => xs[Math.floor(r() * xs.length)]
const shuffle = <T,>(xs: T[], r: Rnd) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const take = <T,>(xs: T[], n: number, r: Rnd) => shuffle([...new Set(xs)], r).slice(0, n)   // unique picks
const mc = (answer: string, wrong: string[], r: Rnd) => shuffle([answer, ...[...new Set(wrong)].filter((w) => w !== answer).slice(0, 3)], r)

/** Levels up to and including `level` (an N4 exam may use N5 material too). */
const upTo = (level: Level) => (l: Level) => levelIndex(l) <= levelIndex(level)

function moji(level: Level, n: number, r: Rnd): Question[] {
  const words = VOCAB.filter((w) => w.level === level && kanjiIn(w.word).length && w.word !== w.reading)
  const kanji = KANJI.filter((k) => k.level === level)
  const out: Question[] = []
  for (let i = 0; i < n; i++) {
    const kind = i % 3
    if (kind < 2) {
      const w = pick(words, r)
      const near = words.filter((x) => x.word !== w.word && Math.abs(x.reading.length - w.reading.length) <= 1)
      out.push(kind === 0
        ? { section: 'moji', tag: 'kanji-read', ask: 'Bagaimana cara membaca kata ini?', prompt: w.word, choices: mc(w.reading, take(near.map((x) => x.reading), 3, r), r), answer: w.reading, itemId: `vocab:${w.word}` }
        : { section: 'moji', tag: 'kanji-write', ask: 'Bagaimana kata ini ditulis dengan kanji?', prompt: w.reading, choices: mc(w.word, take(near.filter((x) => x.reading !== w.reading).map((x) => x.word), 3, r), r), answer: w.word, itemId: `vocab:${w.word}` })
    } else {
      const k = pick(kanji, r)
      out.push({ section: 'moji', tag: 'kanji-meaning', ask: 'Apa arti kanji ini?', prompt: k.char, choices: mc(k.meaning, take(kanji.filter((x) => x.meaning !== k.meaning).map((x) => x.meaning), 3, r), r), answer: k.meaning, itemId: `kanji:${k.char}` })
    }
  }
  return out
}

function bunpou(level: Level, n: number, r: Rnd): Question[] {
  const patterns = GRAMMAR.filter((p) => upTo(level)(p.level))
  const out: Question[] = []
  for (let i = 0; i < n; i++) {
    const p = pick(patterns, r)
    const [ja] = pick(p.sentences, r)
    const tokens = parse(ja)
    if (i % 3 === 2 && tokens.length >= 4) {
      // 並べ替え: which order is right?
      const right = textOf(tokens)
      const wrong = new Set<string>()
      for (let t = 0; wrong.size < 3 && t < 30; t++) { const s = shuffle(tokens, r).map((x) => x.text).join(''); if (s !== right) wrong.add(s) }
      out.push({ section: 'bunpou', tag: 'order', ask: 'Pilih susunan kalimat yang benar.', choices: mc(right, [...wrong], r), answer: right, itemId: `grammar:${p.id}` })
    } else {
      const key = tokens.findIndex((t) => t.key)
      const prompt = tokens.map((t, j) => (j === key ? '（　）' : t.text)).join('')
      out.push({ section: 'bunpou', tag: 'grammar', ask: 'Pilih kata yang paling tepat untuk（　）.', prompt, choices: mc(tokens[key].text, blankOptions(tokens[key], p.level, 3, r), r), answer: tokens[key].text, itemId: `grammar:${p.id}` })
    }
  }
  // reading comprehension: one passage, all its questions
  const passage = pick(READINGS.filter((x) => upTo(level)(x.level)), r)
  for (const q of passage.quiz) out.push({ section: 'bunpou', tag: 'reading', ask: q.q, passage: passage.id, choices: mc(q.a, q.wrong, r), answer: q.a })
  return out
}

function choukai(level: Level, n: number, r: Rnd): Question[] {
  const lines = GRAMMAR.filter((p) => upTo(level)(p.level)).flatMap((p) => p.sentences.map(([ja, tr]) => ({ ja, tr, id: p.id })))
  return take(lines, n, r).map((l) => ({
    section: 'choukai' as const, tag: 'listening', ask: 'Dengarkan, lalu pilih artinya.', audio: textOf(parse(l.ja)),
    choices: mc(l.tr, take(lines.filter((x) => x.tr !== l.tr).map((x) => x.tr), 3, r), r), answer: l.tr, itemId: `grammar:${l.id}`,
  }))
}

export interface ExamSpec { kind: 'mock' | 'gate'; level: Level; sections: { id: Section; minutes: number; questions: Question[] }[] }

/** Mock: the 3 official sections, shortened. Gate: a compact mix, pass at 70%. */
export function buildExam(kind: 'mock' | 'gate', level: Level, seed = String(Date.now())): ExamSpec {
  const r = seeded(seed)
  const size = kind === 'mock' ? { moji: 12, bunpou: 9, choukai: 8 } : { moji: 6, bunpou: 5, choukai: 5 }
  return {
    kind, level, sections: [
      { id: 'moji', minutes: kind === 'mock' ? 8 : 4, questions: moji(level, size.moji, r) },
      { id: 'bunpou', minutes: kind === 'mock' ? 14 : 7, questions: bunpou(level, size.bunpou, r) },
      { id: 'choukai', minutes: kind === 'mock' ? 8 : 4, questions: choukai(level, size.choukai, r) },
    ],
  }
}

export const GATE_PASS = 0.7

/** JLPT-style pass: overall ≥ 55% and every section ≥ 33%. Gate: overall ≥ 70%. */
export function grade(spec: ExamSpec, answers: Record<string, string>) {
  const sections = spec.sections.map((s) => ({
    name: SECTION_NAME[s.id],
    right: s.questions.filter((q, i) => answers[`${s.id}:${i}`] === q.answer).length,
    total: s.questions.length,
  }))
  const tags: Record<string, [number, number]> = {}
  spec.sections.forEach((s) => s.questions.forEach((q, i) => {
    const t = (tags[q.tag] ??= [0, 0])
    t[1]++
    if (answers[`${s.id}:${i}`] === q.answer) t[0]++
  }))
  const right = sections.reduce((n, s) => n + s.right, 0), total = sections.reduce((n, s) => n + s.total, 0)
  const ratio = right / total
  const passed = spec.kind === 'gate' ? ratio >= GATE_PASS : ratio >= 0.55 && sections.every((s) => s.right / s.total >= 1 / 3)
  return { sections, tags, ratio, passed }
}
