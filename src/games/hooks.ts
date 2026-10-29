import { useCallback, useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { logPlay } from '../engine/srs/srs'
import { KANA, isBasic, kanaById, kanaId, type Kana } from '../data/kana'
import { sfx } from '../ui/sfx'
import { getCharacter } from '../characters'
import type { KanaSet } from './common'

/** Daily: what you've learned (due first). Endless: any set you pick. Never empty. */
export async function kanaPool(set: KanaSet): Promise<{ pool: Kana[]; due: Set<string> }> {
  const items = await db.items.where('kind').equals('kana').toArray()
  const due = new Set(items.filter((i) => i.due <= Date.now()).map((i) => i.id))
  const learned = items.map((i) => kanaById.get(i.id)!).filter(Boolean)
  const pool =
    set === 'learned' ? (learned.length >= 6 ? learned : KANA.filter((k) => k.script === 'hiragana' && isBasic(k)).slice(0, 10))
    : set === 'all' ? KANA
    : KANA.filter((k) => k.script === set)
  return { pool, due: new Set([...due].filter((id) => pool.some((k) => kanaId(k) === id))) }
}

export function useBest(id: string) {
  const best = useLiveQuery(() => db.scores.get(id).then((s) => s?.best ?? 0), [id]) ?? 0
  const submit = useCallback(async (score: number) => {
    await logPlay(id.split(':')[0])
    const isNew = score > ((await db.scores.get(id))?.best ?? 0)
    if (isNew) await db.scores.put({ id, best: score, at: Date.now() })
    return isNew
  }, [id])
  return { best, submit }
}

/** Saves the score once when `over` turns true and reports whether it beat the record. */
export function useGameEnd(id: string, over: boolean, score: number) {
  const { best, submit } = useBest(id)
  const [result, setResult] = useState<{ newBest: boolean }>()
  const saved = useRef(false)
  useEffect(() => {
    if (!over || saved.current) return
    saved.current = true
    submit(score).then((newBest) => { setResult({ newBest }); if (newBest) sfx.win() })
  }, [over, score, submit])
  return { best, result }
}

export function useCompanionBuff(game: string) {
  const id = useLiveQuery(() => db.profile.get('me').then((p) => p?.companionId))
  const buff = getCharacter(id ?? '')?.buff
  return buff?.game === game ? buff : undefined
}
