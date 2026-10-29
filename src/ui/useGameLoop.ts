import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { THEMES } from '../data/cosmetics'
import { dailyUpkeep } from '../engine/game/economy'
import { checkAchievements } from '../engine/game/stats'
import { toast } from './toastBus'
import { maybeRemind } from './reminder'

/** App-wide: daily upkeep once, achievements whenever progress changes, and the chosen UI theme. */
export function useGameLoop() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const progress = useLiveQuery(async () => `${await db.items.count()}:${await db.days.count()}:${await db.owned.count()}:${await db.unlocks.count()}:${(await db.profile.get('me'))?.pulls ?? 0}`)

  useEffect(() => {
    maybeRemind()
    const t = setInterval(maybeRemind, 10 * 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    dailyUpkeep().then(({ frozen }) => frozen.length && toast(`Streak diselamatkan! ${frozen.length} Streak Freeze dipakai`, '🧊'))
  }, [])

  useEffect(() => {
    if (!progress) return
    checkAchievements().then((list) => list.forEach((a) => toast(`Achievement: ${a.name} · +50 ✦`, '🏆')))
  }, [progress])

  useEffect(() => {
    const vars = THEMES.find((t) => t.id === profile?.theme)?.vars ?? {}
    const root = document.documentElement
    for (const k of ['paper', 'paper-deep', 'torii', 'anemo', 'geo']) {
      if (vars[k]) root.style.setProperty(`--color-${k}`, vars[k]); else root.style.removeProperty(`--color-${k}`)
    }
  }, [profile?.theme])

  return profile
}
