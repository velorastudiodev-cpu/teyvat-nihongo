import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Profile } from '../data/db'
import { plan, stagesToTarget } from '../engine/pace/pace'

export function usePacePlan(profile?: Profile) {
  const { stage, target, minutesPerDay, targetDate } = profile ?? {}
  const data = useLiveQuery(async () => {
    if (!stage || !target) return
    const learned = await db.items.where('stage').anyOf(stagesToTarget(stage, target)).count()
    const recent = await db.days.orderBy('date').reverse().limit(7).toArray()
    return { learned, recent: recent.reverse() }
  }, [stage, target])
  if (!stage || !target || !minutesPerDay || !data) return
  return plan({ stage, target, minutesPerDay, targetDate, ...data })
}
