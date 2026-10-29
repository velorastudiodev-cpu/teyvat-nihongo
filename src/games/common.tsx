import { useState } from 'react'
import { btn, card } from '../ui/kit'
import { Buddy } from '../ui/Buddy'

export type GameMode = 'daily' | 'endless'
export type KanaSet = 'learned' | 'hiragana' | 'katakana' | 'all'

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
