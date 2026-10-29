import { describe, expect, it } from 'vitest'
import { characters, REGIONS } from '../characters'
import { DESIGNS } from '../characters/designs'
import { STAGES, STAGE_INFO } from './curriculum'
import { GRAMMAR } from './grammar'
import { KANJI, VOCAB } from './kanji'
import { READINGS } from './readings'
import { buildExam } from '../engine/exam/exam'

describe('every region is filled with content (M8 acceptance)', () => {
  for (const r of REGIONS) {
    it(`${r.name}`, () => {
      const levels = STAGES.filter((s) => STAGE_INFO[s].regions.includes(r.id) && s.startsWith('N')) as ('N5' | 'N4' | 'N3' | 'N2' | 'N1')[]
      expect(levels.length).toBeGreaterThan(0)
      for (const l of levels) {
        expect(KANJI.filter((k) => k.level === l).length, `${l} kanji`).toBeGreaterThan(50)
        expect(VOCAB.filter((w) => w.level === l).length, `${l} vocab`).toBeGreaterThan(500)
        expect(GRAMMAR.filter((p) => p.level === l).length, `${l} grammar`).toBeGreaterThanOrEqual(10)
        expect(READINGS.filter((x) => x.level === l).length, `${l} readings`).toBeGreaterThanOrEqual(2)
        expect(buildExam('gate', l, r.id).sections.every((s) => s.questions.length > 0)).toBe(true)
      }
      const drawn = characters.filter((c) => c.region === r.id && DESIGNS[c.id])
      expect(drawn.length, `${r.name} drawn chibi`).toBe(characters.filter((c) => c.region === r.id).length)
    })
  }
})
