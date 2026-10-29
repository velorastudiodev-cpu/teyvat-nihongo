import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Profile } from '../../data/db'
import { STAGE_INFO, stageItems } from '../../data/curriculum'
import type { Realm } from './regions'
import { useRealmOverride } from './override'

/** The region your progress has reached. N1 spans Fontaine, then Natlan once half of it is learned. */
export function useHomeRegion(profile?: Profile) {
  const n1 = useLiveQuery(() => db.items.where('stage').equals('N1').count(), []) ?? 0
  const regions = STAGE_INFO[profile?.stage ?? 'hiragana'].regions
  return regions.length > 1 && n1 >= stageItems('N1') / 2 ? regions[1] : regions[0]
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
