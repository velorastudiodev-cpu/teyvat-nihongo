import kanjiData from './kanji.json'
import vocabData from './vocab.json'

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
export type Level = (typeof LEVELS)[number]
export const levelIndex = (l: Level) => LEVELS.indexOf(l)
export interface Kanji { char: string; level: Level; strokes: number; meaning: string; en: string[]; on: string[]; kun: string[]; parts: string[] }
export interface Word { word: string; reading: string; meaning: string; level: Level; en?: string }   // en present ⇒ meaning is Indonesian
export interface StrokeSet { d: string[]; p: [number, number][][] }

export const KANJI = kanjiData as Kanji[]
export const VOCAB = vocabData as Word[]
export const kanjiById = new Map(KANJI.map((k) => [`kanji:${k.char}`, k]))
export const wordById = new Map(VOCAB.map((w) => [`vocab:${w.word}`, w]))

/** Stroke data is big (KanjiVG, ~6 MB), so it's split per level and each chunk loads on first use. */
type Chunk = 'base' | 'n3' | 'n2' | 'n1'
const CHUNKS: Record<Chunk, () => Promise<{ default: unknown }>> = {
  base: () => import('./strokes/base.json'), n3: () => import('./strokes/n3.json'), n2: () => import('./strokes/n2.json'), n1: () => import('./strokes/n1.json'),
}
const loaded = new Map<Chunk, Promise<Record<string, StrokeSet>>>()
const kanjiLevel = new Map(KANJI.map((k) => [k.char, k.level]))
export function loadStrokes(char: string): Promise<StrokeSet | undefined> {
  const lv = kanjiLevel.get(char)
  const chunk: Chunk = !lv || lv === 'N5' || lv === 'N4' ? 'base' : (lv.toLowerCase() as Chunk)
  if (!loaded.has(chunk)) loaded.set(chunk, CHUNKS[chunk]().then((m) => m.default as Record<string, StrokeSet>))
  return loaded.get(chunk)!.then((all) => all[char])
}

/** Up to n words that use the kanji, easiest level first. */
export const examples = (char: string, n = 3) =>
  VOCAB.filter((w) => w.word.includes(char) && w.word !== char).sort((a, b) => b.level.localeCompare(a.level) || a.word.length - b.word.length).slice(0, n)

/** First reading to quiz on: a kun reading without okurigana, else the first on reading. */
export const mainReading = (k: Kanji) => (k.kun[0]?.split('.')[0].replace(/-/g, '') ?? k.on[0])

const KANJI_RE = /[一-龯々]/g
export const kanjiIn = (s: string) => s.match(KANJI_RE) ?? []
