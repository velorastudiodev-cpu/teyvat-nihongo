import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Profile } from '../../data/db'
import { STAGE_INFO, stageItems } from '../../data/curriculum'
import type { Realm } from './regions'
import { useRealmOverride } from './override'

/**
 * The region your progress has reached. N1 spans Fontaine → Natlan → Nod-Krai by thirds of its material;
 * passing the N1 mock test brings you to Snezhnaya, the journey's end.
 */
export function useHomeRegion(profile?: Profile) {
  const n1 = useLiveQuery(() => db.items.where('stage').equals('N1').count(), []) ?? 0
  const mock = useLiveQuery(() => db.exams.where('level').equals('N1').filter((x) => x.kind === 'mock' && x.passed).count(), []) ?? 0
  const regions = STAGE_INFO[profile?.stage ?? 'hiragana'].regions
  if (profile?.stage === 'N1' && mock > 0) return 'snezhnaya'
  return regions[Math.min(regions.length - 1, Math.floor((n1 / stageItems('N1')) * regions.length))]
}

/** The realm shown on screen: a theme chosen in Profile, else the region you have reached. */
export function useRealm(profile?: Profile): Realm {
  const home = useHomeRegion(profile)
  const forced = useRealmOverride()
  const chosen = profile?.realm
  return forced ?? (chosen && chosen !== 'auto' ? chosen : home)
}

/** Paints the realm onto <html data-region> so every region token follows it. */
export function useRealmOnDocument(realm: Realm) {
  useEffect(() => { document.documentElement.dataset.region = realm }, [realm])
}
