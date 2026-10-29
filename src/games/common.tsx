import { useState } from 'react'
import { btn, card } from '../ui/kit'
import { Buddy } from '../ui/Buddy'
import { Icon, type IconName } from '../ui/Icon'

export type GameMode = 'daily' | 'endless'
export type KanaSet = 'learned' | 'hiragana' | 'katakana' | 'all'

function GameTitle({ title, icon }: { title: string; icon: IconName }) {
  return (
    <div className="flex items-center gap-3">
      <span className="g-chip h-14 w-14 shrink-0"><Icon name={icon} className="h-7 w-7" /></span>
      <h1 className="font-display text-3xl font-black">{title}</h1>
    </div>
  )
}

export function GameSetup({ title, icon, blurb, onStart }: { title: string; icon: IconName; blurb: string; onStart: (mode: GameMode, set: KanaSet) => void }) {
  const [set, setSet] = useState<KanaSet>('hiragana')
  return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <GameTitle title={title} icon={icon} />
      <p>{blurb}</p>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => onStart('daily', 'learned')}>
        <Icon name="calendar" /> Daily · kana yang sudah kamu pelajari
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
        <button className={`${btn} mt-3 w-full bg-deep text-white`} onClick={() => onStart('endless', set)}>Mulai Endless</button>
      </div>
    </main>
  )
}

export function ModePicker({ title, icon, blurb, daily, endless = 'Endless · 3 nyawa', onStart }: { title: string; icon: IconName; blurb: string; daily: string; endless?: string; onStart: (m: GameMode) => void }) {
  return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <GameTitle title={title} icon={icon} />
      <p>{blurb}</p>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => onStart('daily')}><Icon name="calendar" /> Daily · {daily}</button>
      <button className={`${btn} w-full bg-deep text-white`} onClick={() => onStart('endless')}><Icon name="spiral" /> {endless}</button>
    </main>
  )
}

export function GameOver({ score, unit = 'poin', newBest, best, onExit }: { score: number; unit?: string; newBest: boolean; best: number; onExit: () => void }) {
  return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={120} /></div>
      <p className="font-display text-4xl font-extrabold">{score} {unit}</p>
      <NewBest newBest={newBest} best={best} />
      <button className={`${btn} bg-primary text-white`} onClick={onExit}>Main lagi</button>
    </main>
  )
}

export function NewBest({ newBest, best }: { newBest: boolean; best: number }) {
  return newBest
    ? <p className="flex items-center justify-center gap-1.5 font-display font-black text-geo"><Icon name="trophy" className="h-6 w-6" /> Rekor baru!</p>
    : <p>Rekor: {best}</p>
}
