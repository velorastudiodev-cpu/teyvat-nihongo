import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { dailyUpkeep } from '../engine/game/economy'
import { checkAchievements } from '../engine/game/stats'
import { toast } from './toastBus'
import { maybeRemind } from './reminder'
import { checkLetter } from '../engine/raiden'

/** App-wide: daily upkeep once, reminders, and achievements whenever progress changes. */
export function useGameLoop() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const progress = useLiveQuery(async () => `${await db.items.count()}:${await db.days.count()}:${await db.owned.count()}:${await db.unlocks.count()}:${(await db.profile.get('me'))?.pulls ?? 0}`)

  useEffect(() => {
    maybeRemind()
    const t = setInterval(maybeRemind, 10 * 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    dailyUpkeep().then(({ frozen }) => frozen.length && toast(`Streak diselamatkan! ${frozen.length} Streak Freeze dipakai`, 'snowflake'))
  }, [])

  useEffect(() => {
    if (!progress) return
    checkAchievements().then((list) => list.forEach((a) => toast(`Achievement: ${a.name} · +50 Kirameki`, 'trophy')))
    checkLetter().then((arrived) => arrived && toast('Surat bersegel petir tiba dari Tenshukaku…', 'tomoe'))
  }, [progress])

  return profile
}
