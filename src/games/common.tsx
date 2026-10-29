import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { logPlay } from '../engine/srs/srs'
import { KANA, isBasic, kanaById, kanaId, type Kana } from '../data/kana'
import { btn, card } from '../ui/kit'
import { Buddy } from '../ui/Buddy'
import { sfx } from '../ui/sfx'
import { getCharacter } from '../characters'

export type GameMode = 'daily' | 'endless'
export type KanaSet = 'learned' | 'hiragana' | 'katakana' | 'all'

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
  const submit = async (score: number) => {
    await logPlay(id.split(':')[0])
    const isNew = score > ((await db.scores.get(id))?.best ?? 0)
    if (isNew) await db.scores.put({ id, best: score, at: Date.now() })
    return isNew
  }
  return { best, submit }
}

export function GameSetup({ title, blurb, onStart }: { title: string; blurb: string; onStart: (mode: GameMode, set: KanaSet) => void }) {
  const [set, setSet] = useState<KanaSet>('hiragana')
  return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <p>{blurb}</p>
      <button className={`${btn} w-full bg-torii text-white`} onClick={() => onStart('daily', 'learned')}>
        Daily · kana yang sudah kamu pelajari
      </button>
      <div className="rounded-2xl bg-paper p-3">
        <p className="font-display font-bold">Endless · main sepuasnya</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['hiragana', 'katakana', 'all'] as const).map((s) => (
            <button key={s} onClick={() => setSet(s)} className={`${btn} text-sm ${s === set ? 'bg-ink text-paper' : 'bg-white'}`}>
              {s === 'all' ? 'semua (208)' : s}
            </button>
          ))}
        </div>
        <button className={`${btn} mt-3 w-full bg-anemo text-white`} onClick={() => onStart('endless', set)}>Mulai Endless</button>
      </div>
    </main>
  )
}

export function ModePicker({ title, blurb, daily, endless = 'Endless · 3 nyawa', onStart }: { title: string; blurb: string; daily: string; endless?: string; onStart: (m: GameMode) => void }) {
  return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <p>{blurb}</p>
      <button className={`${btn} w-full bg-torii text-white`} onClick={() => onStart('daily')}>Daily · {daily}</button>
      <button className={`${btn} w-full bg-anemo text-white`} onClick={() => onStart('endless')}>{endless}</button>
    </main>
  )
}

export function GameOver({ score, unit = 'poin', newBest, best, onExit }: { score: number; unit?: string; newBest: boolean; best: number; onExit: () => void }) {
  return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={120} /></div>
      <p className="font-display text-4xl font-extrabold">{score} {unit}</p>
      <p>{newBest ? '🏆 Rekor baru!' : `Rekor: ${best}`}</p>
      <button className={`${btn} bg-torii text-white`} onClick={onExit}>Main lagi</button>
    </main>
  )
}

/** Saves the score once when `over` turns true and reports whether it beat the record. */
export function useGameEnd(id: string, over: boolean, score: number) {
  const { best, submit } = useBest(id)
  const [result, setResult] = useState<{ newBest: boolean }>()
  useEffect(() => {
    if (over && !result) submit(score).then((newBest) => { setResult({ newBest }); if (newBest) sfx.win() })
  }, [over])
  return { best, result }
}

export function useCompanionBuff(game: string) {
  const id = useLiveQuery(() => db.profile.get('me').then((p) => p?.companionId))
  const buff = getCharacter(id ?? '')?.buff
  return buff?.game === game ? buff : undefined
}
