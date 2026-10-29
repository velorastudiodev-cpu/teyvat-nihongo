import { toHiragana } from 'wanakana'
import { db } from '../../data/db'
import { KANJI, VOCAB, kanjiIn, mainReading, type Kanji, type Level, type Word } from '../../data/kanji'
import { stageIndex, type Stage } from '../../data/curriculum'
import { sample } from '../../ui/kit'

export const KANJI_LESSON = 5
export const VOCAB_LESSON = 6

export const levelOpen = (level: Level, stage?: Stage) => !!stage && stageIndex(level) <= stageIndex(stage)

const learnedIds = (kind: 'kanji' | 'vocab') => db.items.where('kind').equals(kind).primaryKeys().then((ks) => new Set(ks))

export async function nextKanji(level: Level) {
  const known = await learnedIds('kanji')
  return KANJI.filter((k) => k.level === level && !known.has(`kanji:${k.char}`)).slice(0, KANJI_LESSON)
}

/** Words whose kanji you already know (or that need none) come first. */
export async function nextWords(level: Level) {
  const known = await learnedIds('vocab')
  const kanjiKnown = new Set([...(await learnedIds('kanji'))].map((id) => id.slice(6)))
  const ready = (w: Word) => kanjiIn(w.word).every((c) => kanjiKnown.has(c))
  const todo = VOCAB.filter((w) => w.level === level && !known.has(`vocab:${w.word}`))
  return [...todo.filter(ready), ...todo.filter((w) => !ready(w))].slice(0, VOCAB_LESSON)
}

export const otherMeanings = (k: Kanji, n = 3) => sample([...new Set(KANJI.filter((x) => x.meaning !== k.meaning).map((x) => x.meaning))], n)
export const otherReadings = (k: Kanji, n = 3) => sample([...new Set(KANJI.map(mainReading).filter((r) => r !== mainReading(k)))], n)
export const otherWordMeanings = (w: Word, n = 3) => sample([...new Set(VOCAB.filter((x) => x.meaning !== w.meaning && x.level === w.level).map((x) => x.meaning))], n)
export const otherWords = (w: Word, n = 3) => sample([...new Set(VOCAB.filter((x) => x.word !== w.word && x.reading !== w.reading && x.level === w.level).map((x) => x.word))], n)

const MACRON: Record<string, string> = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ee' }

/** Romaji or kana in, compared as hiragana so katakana readings also match. Hepburn "tch" and macrons are accepted. */
export function readingMatches(input: string, reading: string) {
  const base = input.trim().toLowerCase().replace(/tch/g, 'cch').replace(/[āīūē]/g, (m) => MACRON[m])
  const target = toHiragana(reading)
  return !!base && [base.replace(/ō/g, 'ou'), base.replace(/ō/g, 'oo')].some((v) => toHiragana(v) === target)
}
