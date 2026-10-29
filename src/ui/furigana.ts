import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { isMastered } from '../engine/srs/srs'
import { pref, setPref } from './speak'

export type FuriganaMode = 'all' | 'auto' | 'none'

/** Kanji whose SRS stability says you know them; "auto" furigana hides their readings. */
export function useMasteredKanji() {
  return useLiveQuery(async () => new Set((await db.items.where('kind').equals('kanji').toArray()).filter(isMastered).map((i) => i.id.slice(6))), []) ?? new Set<string>()
}

export function useFurigana() {
  const [mode, setMode] = useState<FuriganaMode>(() => pref('furigana', 'auto'))
  return [mode, (m: FuriganaMode) => { setPref('furigana', m); setMode(m) }] as const
}
