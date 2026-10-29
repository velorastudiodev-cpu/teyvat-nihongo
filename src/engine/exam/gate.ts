import { db } from '../../data/db'
import { STAGES, STAGE_INFO, stageIndex, type Stage } from '../../data/curriculum'
import type { Level } from '../../data/kanji'
import type { Region } from '../../characters'
import { earn } from '../game/economy'

/** The sensei who welcomes you when a region opens (and joins your collection). */
export const REGION_SENSEI: Partial<Record<Region, string>> = { liyue: 'zhongli', inazuma: 'raiden', sumeru: 'nahida', fontaine: 'furina', natlan: 'mavuika' }
export const GATE_REWARD = 500

/** A gate sits after the last stage of a region; it is open while you stand on that stage. */
export function gateFor(stage: Stage) {
  const region = STAGE_INFO[stage].regions[0]
  const next = STAGES[stageIndex(stage) + 1] as Stage | undefined
  if (!next || STAGE_INFO[next].regions[0] === region) return undefined
  const level: Level = stage === 'hiragana' || stage === 'katakana' ? 'N5' : stage
  return { region, level, next, nextRegion: STAGE_INFO[next].regions[0] }
}

/** Passing moves you into the next region, pays out, and brings its sensei along. */
export async function passGate(stage: Stage) {
  const g = gateFor(stage)
  if (!g) return
  const fresh = !(await db.unlocks.get(`gate:${g.region}`))
  await db.unlocks.put({ id: `gate:${g.region}`, at: Date.now() })
  await db.profile.update('me', { stage: g.next })
  const sensei = REGION_SENSEI[g.nextRegion]
  if (sensei && !(await db.owned.get(sensei))) await db.owned.add({ charId: sensei, friendship: 0, obtainedAt: Date.now() })
  return { ...g, sensei, reward: fresh ? await earn(GATE_REWARD) : 0 }
}
