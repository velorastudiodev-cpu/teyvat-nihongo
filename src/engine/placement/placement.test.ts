import { describe, expect, it } from 'vitest'
import { nextStep, type Answer } from './placement'
import type { Stage } from '../../data/curriculum'

const run = (stage: Stage, ...results: boolean[]): Answer[] => results.map((correct) => ({ stage, correct }))

describe('placement', () => {
  it('starts at hiragana', () => {
    expect(nextStep([], 'N1')).toEqual({ kind: 'ask', stage: 'hiragana', n: 0 })
  })

  it('a beginner aiming for N1 is placed at hiragana, not N1', () => {
    expect(nextStep(run('hiragana', false, false, true, false), 'N1')).toEqual({ kind: 'done', placement: 'hiragana' })
  })

  it('skips known kana and places at the first unknown stage', () => {
    const a = [...run('hiragana', true, true, true, true), ...run('katakana', true, true, false, true), ...run('N5', false, false, false, true)]
    expect(nextStep(a, 'N1')).toEqual({ kind: 'done', placement: 'N5' })
  })

  it('2/4 asks two tie-break questions', () => {
    const a = run('hiragana', true, false, true, false)
    expect(nextStep(a, 'N1')).toEqual({ kind: 'ask', stage: 'hiragana', n: 4 })
    expect(nextStep([...a, ...run('hiragana', true, true)], 'N1')).toEqual({ kind: 'ask', stage: 'katakana', n: 0 })
    expect(nextStep([...a, ...run('hiragana', true, false)], 'N1')).toEqual({ kind: 'done', placement: 'hiragana' })
  })

  it('never tests beyond the target', () => {
    const all = (['hiragana', 'katakana', 'N5', 'N4'] as const).flatMap((s) => run(s, true, true, true, true))
    expect(nextStep(all, 'N4')).toEqual({ kind: 'done', placement: 'N4' })
  })
})
