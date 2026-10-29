import { useRef, useState } from 'react'
import { Hearts, Icon } from '../ui/Icon'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../data/db'
import type { Kanji } from '../data/kanji'
import { answer } from '../engine/srs/srs'
import { getCharacter, type Expression } from '../characters'
import { Chibi } from '../characters/Chibi'
import { DESIGNS } from '../characters/designs'
import { Buddy } from '../ui/Buddy'
import { btn, card } from '../ui/kit'
import { sfx } from '../ui/sfx'
import { StrokePad } from '../ui/strokes'
import { useDeadline } from '../ui/useDeadline'
import { NewBest, type GameMode } from './common'
import { useGameEnd } from './hooks'
import { kanjiPool } from './kanjiPool'

const DAILY_ROUNDS = 5
const SEC_PER_STROKE = 1.8

export function StrokeDuel() {
  const [game, setGame] = useState<{ run: number; mode: GameMode; pool: Kanji[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ run: Date.now(), mode, ...(await kanjiPool(mode)) })
  if (!game) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <h1 className="flex items-center gap-3 font-display text-3xl font-black"><span className="g-chip h-14 w-14"><Icon name="brush" className="h-7 w-7" /></span>Stroke Duel</h1>
      <p>Tulis kanji dengan urutan & arah goresan yang benar sebelum lawan chibi selesai menulis. Salah goresan = waktu terbuang!</p>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => start('daily')}>Daily · {DAILY_ROUNDS} kanji yang sudah kamu pelajari</button>
      <button className={`${btn} w-full bg-deep text-white`} onClick={() => start('endless')}>Endless · 3 nyawa</button>
    </main>
  )
  return <Duel key={game.run} {...game} onExit={() => setGame(undefined)} />
}

function Duel({ mode, pool, due, onExit }: { mode: GameMode; pool: Kanji[]; due: Set<string>; onExit: () => void }) {
  const companion = useLiveQuery(() => db.profile.get('me').then((p) => p?.companionId))
  const buff = getCharacter(companion ?? '')?.buff
  const bonus = buff?.game === 'stroke-duel' && buff.effect === 'extraTime' ? buff.value : 0
  const [rival] = useState(() => { const ids = Object.keys(DESIGNS); return ids[Math.floor(Math.random() * ids.length)] })
  const limitFor = (k: Kanji) => k.strokes * SEC_PER_STROKE + 3 + bonus

  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [outcome, setOutcome] = useState<'win' | 'lose'>()
  const [mood, setMood] = useState<Expression>('idle')
  const mistakes = useRef(0)

  const k = pool[round % pool.length]
  const limit = limitFor(k)
  const timer = useDeadline(limit, () => end(false))
  const elapsed = limit - timer.left
  const finished = lives <= 0 || (mode === 'daily' && round >= DAILY_ROUNDS)
  const { best, result: over } = useGameEnd(`stroke-duel:${mode}`, finished, score)

  function end(won: boolean) {
    if (outcome || finished) return
    timer.stop()
    setOutcome(won ? 'win' : 'lose')
    setMood(won ? 'happy' : 'sad')
    if (won) { sfx.win(); setScore((s) => s + 10 * k.strokes + Math.round((limit - elapsed) * 5)) } else { sfx.bad(); setLives((l) => l - 1) }
    if (due.has(`kanji:${k.char}`)) answer(`kanji:${k.char}`, won && mistakes.current <= 1, elapsed * 1000, won ? k.char : '', k.char)
    const ends = (!won && lives <= 1) || (mode === 'daily' && round + 1 >= DAILY_ROUNDS)
    setTimeout(() => {
      mistakes.current = 0; setOutcome(undefined); setMood('idle'); setRound(round + 1)
      if (!ends) timer.start(limitFor(pool[(round + 1) % pool.length]))
    }, 1300)
  }

  if (over) return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center gap-2"><Buddy mood="happy" size={110} /><Chibi id={rival} expression="sad" size={90} /></div>
      <p className="font-display text-4xl font-extrabold">{score} poin</p>
      <NewBest newBest={over.newBest} best={best} />
      <button className={`${btn} bg-primary text-white`} onClick={onExit}>Main lagi</button>
    </main>
  )

  const rivalProgress = Math.min(1, elapsed / limit)
  return (
    <main className="mx-auto mt-2 max-w-xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <Hearts lives={lives} />
        <span>Skor {score}{bonus > 0 && <span className="text-anemo"> · +{bonus}s buff</span>}</span>
        <span className="opacity-60">{mode === 'daily' ? `${Math.min(round + 1, DAILY_ROUNDS)}/${DAILY_ROUNDS}` : `rekor ${best}`}</span>
      </div>
      <div className={`${card} space-y-3`}>
        <div className="flex items-center gap-3">
          <Chibi id={rival} expression={outcome === 'lose' ? 'happy' : outcome === 'win' ? 'sad' : 'idle'} size={64} />
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper-deep">
            <motion.div className="h-full bg-primary" style={{ width: `${rivalProgress * 100}%` }} />
          </div>
          <span className="w-12 text-right font-display font-bold">{Math.max(0, limit - elapsed).toFixed(1)}s</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="text-center">
            <p lang="ja" className="text-6xl font-bold">{k.char}</p>
            <p className="font-display font-bold">{k.meaning}</p>
            <Buddy mood={mood} size={70} />
          </div>
          <StrokePad key={round} char={k.char} ghost={false} size={240}
            onStroke={(ok) => { if (!ok) mistakes.current++ }} onDone={() => end(true)} />
        </div>
        {outcome && <p className={`text-center font-display text-2xl font-extrabold ${outcome === 'win' ? 'text-anemo' : 'text-wrong'}`}>{outcome === 'win' ? 'Menang!' : 'Kalah cepat…'}</p>}
      </div>
      <button className="text-sm underline opacity-60" onClick={() => { timer.stop(); setLives(0) }}>Berhenti</button>
    </main>
  )
}
