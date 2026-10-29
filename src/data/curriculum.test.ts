import { describe, expect, it } from 'vitest'
import { STAGE_INFO } from './curriculum'
import { KANJI, LEVELS, VOCAB } from './kanji'

describe('curriculum', () => {
  it('kanji and vocabulary counts match the bundled data for every level', () => {
    for (const l of LEVELS) {
      expect(STAGE_INFO[l].kanji, l).toBe(KANJI.filter((k) => k.level === l).length)
      expect(STAGE_INFO[l].vocab, l).toBe(VOCAB.filter((w) => w.level === l).length)
    }
  })
})
