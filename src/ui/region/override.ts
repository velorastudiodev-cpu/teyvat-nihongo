import { useSyncExternalStore } from 'react'
import type { Realm } from './regions'

// A page can take over the backdrop for a while (the Raiden scenes move to Inazuma or the Plane of Euthymia).
let current: Realm | undefined
const subs = new Set<() => void>()

export function setRealmOverride(realm?: Realm) {
  current = realm
  subs.forEach((f) => f())
}

export const useRealmOverride = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f) } }, () => current)
