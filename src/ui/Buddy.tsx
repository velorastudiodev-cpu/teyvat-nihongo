import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { Chibi } from '../characters/Chibi'
import type { Expression } from '../characters'

/** The active companion, reacting to what just happened. */
export function Buddy({ mood = 'idle', size = 90 }: { mood?: Expression; size?: number }) {
  const p = useLiveQuery(() => db.profile.get('me'))
  return p ? <Chibi id={p.companionId} expression={mood} size={size} outfit={p.outfit} /> : null
}
