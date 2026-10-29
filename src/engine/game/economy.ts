import { db } from '../../data/db'
import { getCharacter } from '../../characters'
import { today } from '../srs/srs'
import { daysToFreeze, weekId } from './rules'

/** Adds Kirameki (Furina as companion: ×1.1). Returns the amount actually added. */
export async function earn(amount: number) {
  const p = await db.profile.get('me')
  const buff = getCharacter(p?.companionId ?? '')?.buff
  const total = Math.round(amount * (buff?.effect === 'kiramekiMult' ? buff.value : 1))
  await db.profile.update('me', { kirameki: (p?.kirameki ?? 0) + total })
  return total
}

export async function spend(amount: number) {
  return db.transaction('rw', db.profile, async () => {
    const have = (await db.profile.get('me'))?.kirameki ?? 0
    if (have < amount) return false
    await db.profile.update('me', { kirameki: have - amount })
    return true
  })
}

/** A one-time reward: returns the Kirameki granted, or 0 if it was already claimed. */
export async function claim(id: string, reward: number) {
  const fresh = await db.transaction('rw', db.unlocks, async () => {
    if (await db.unlocks.get(id)) return false
    await db.unlocks.add({ id, at: Date.now() })
    return true
  })
  return fresh ? earn(reward) : 0
}

export const MAX_FREEZES = 3

/**
 * Runs once per app start: grants the weekly free Streak Freeze (Jean as companion: +1)
 * and spends freezes on missed days so the streak survives.
 */
export async function dailyUpkeep(date = today()) {
  const p = await db.profile.get('me')
  if (!p) return { frozen: [] as string[] }
  let freezes = p.freezes ?? 0
  const week = weekId(date)
  if (p.freezeWeek !== week) {
    const jean = getCharacter(p.companionId)?.buff.effect === 'streakFreeze'
    freezes = Math.min(MAX_FREEZES, freezes + 1 + (jean ? 1 : 0))
  }
  const frozen = daysToFreeze(await db.days.toArray(), date, freezes)
  await db.days.bulkPut(frozen.map((d) => ({ date: d, xp: 0, reviews: 0, correct: 0, newItems: 0, minutes: 0, frozen: true })))
  await db.profile.update('me', { freezes: freezes - frozen.length, freezeWeek: week })
  return { frozen }
}
