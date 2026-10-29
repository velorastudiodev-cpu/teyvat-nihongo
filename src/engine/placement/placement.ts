import { STAGES, stageIndex, type Stage, type Target } from '../../data/curriculum'

export interface Answer { stage: Stage; correct: boolean }
export type Step = { kind: 'ask'; stage: Stage; n: number } | { kind: 'done'; placement: Stage }

/**
 * Adaptive placement: 4 questions per stage, from hiragana up to the target.
 * 3–4 right passes, 0–1 fails, 2 right earns 2 tie-break questions (4/6 to pass).
 * Placement = the first stage not passed, so known material is skipped.
 */
export function nextStep(answers: Answer[], target: Target): Step {
  for (const stage of STAGES.slice(0, stageIndex(target) + 1)) {
    const mine = answers.filter((a) => a.stage === stage)
    const n = mine.length
    const right = mine.filter((a) => a.correct).length
    const passed = (n === 4 && right >= 3) || (n === 6 && right >= 4)
    if (passed) continue
    const failed = (n === 4 && right <= 1) || n === 6
    if (failed) return { kind: 'done', placement: stage }
    return { kind: 'ask', stage, n }
  }
  return { kind: 'done', placement: target }
}
