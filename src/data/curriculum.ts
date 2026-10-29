import type { Region } from '../characters'

export const STAGES = ['hiragana', 'katakana', 'N5', 'N4', 'N3', 'N2', 'N1'] as const
export type Stage = (typeof STAGES)[number]
export const TARGETS = ['N4', 'N3', 'N2', 'N1'] as const
export type Target = (typeof TARGETS)[number]

export const stageIndex = (s: Stage) => STAGES.indexOf(s)

export interface StageInfo { label: string; regions: Region[]; kana: number; kanji: number; vocab: number; grammar: number }

/** New items per stage: kanji and vocabulary match the bundled data; grammar counts are JLPT estimates. */
export const STAGE_INFO: Record<Stage, StageInfo> = {
  hiragana: { label: 'Hiragana', regions: ['mondstadt'], kana: 104, kanji: 0, vocab: 0, grammar: 0 },
  katakana: { label: 'Katakana', regions: ['mondstadt'], kana: 104, kanji: 0, vocab: 0, grammar: 0 },
  N5: { label: 'JLPT N5', regions: ['mondstadt'], kana: 0, kanji: 79, vocab: 710, grammar: 80 },
  N4: { label: 'JLPT N4', regions: ['liyue'], kana: 0, kanji: 166, vocab: 663, grammar: 130 },
  N3: { label: 'JLPT N3', regions: ['inazuma'], kana: 0, kanji: 367, vocab: 2078, grammar: 180 },
  N2: { label: 'JLPT N2', regions: ['sumeru'], kana: 0, kanji: 367, vocab: 1790, grammar: 200 },
  N1: { label: 'JLPT N1', regions: ['fontaine', 'natlan'], kana: 0, kanji: 1232, vocab: 2655, grammar: 220 },
}

export const stageItems = (s: Stage) => {
  const i = STAGE_INFO[s]
  return i.kana + i.kanji + i.vocab + i.grammar
}
