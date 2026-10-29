import { GRAMMAR } from '../../data/grammar'
import type { Level } from '../../data/kanji'
import { isParticle, parse, PARTICLES, type Token } from '../../engine/sentence'

const COMMON_PARTICLES = PARTICLES.slice(0, 11)

/** Wrong options for a blank: other particles for a particle, other grammar keys of the level otherwise. */
export function blankOptions(t: Token, level: Level, n = 3, rand = Math.random) {
  const draw = (xs: string[]) => xs.map((x) => [rand(), x] as const).sort((a, b) => a[0] - b[0]).slice(0, n).map(([, x]) => x)
  if (isParticle(t)) return draw(COMMON_PARTICLES.filter((p) => p !== t.text))
  const keys = GRAMMAR.filter((p) => p.level === level).flatMap((p) => p.sentences.map(([ja]) => parse(ja).find((x) => x.key)!.text))
  return draw([...new Set(keys)].filter((k) => k !== t.text && !COMMON_PARTICLES.includes(k)))
}
