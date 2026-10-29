import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../ui/Icon'
import { motion } from 'framer-motion'
import type { Kana } from '../data/kana'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { btn, card, shuffle } from '../ui/kit'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { useDeadline } from '../ui/useDeadline'
import { GameSetup, type GameMode, type KanaSet, NewBest } from './common'
import { kanaPool, useBest } from './hooks'

const ENDLESS_SECONDS = 90
interface Tile { id: string; pair: string; face: string; isKana: boolean }

export function MemoryMatch() {
  const [game, setGame] = useState<{ run: number; mode: GameMode; pool: Kana[] }>()
  const start = async (mode: GameMode, set: KanaSet) => setGame({ run: Date.now(), mode, pool: (await kanaPool(set)).pool })
  if (!game) return <GameSetup title="Memory Match" icon="cards" blurb="Balik kartu dan pasangkan kana dengan romaji-nya. Daily: 1 papan. Endless: sebanyak mungkin pasangan dalam 90 detik." onStart={start} />
  return <Board key={game.run} {...game} onExit={() => setGame(undefined)} />
}

function deal(pool: Kana[], pairs: number): Tile[] {
  // romaji must be unique on a board or two kana would share a partner
  const picked: Kana[] = []
  for (const k of shuffle(pool)) if (picked.length < pairs && !picked.some((p) => p.romaji === k.romaji)) picked.push(k)
  return shuffle(picked.flatMap((k) => [
    { id: `k${k.char}`, pair: k.char, face: k.char, isKana: true },
    { id: `r${k.char}`, pair: k.char, face: k.romaji, isKana: false },
  ]))
}

function Board({ mode, pool, onExit }: { mode: GameMode; pool: Kana[]; onExit: () => void }) {
  const { best, submit } = useBest(`memory-match:${mode}`)
  const pairs = Math.min(mode === 'daily' ? 6 : 8, pool.length)
  const [tiles, setTiles] = useState(() => deal(pool, pairs))
  const [open, setOpen] = useState<Tile[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [found, setFound] = useState(0)
  const [time, setTime] = useState(0)
  const [mood, setMood] = useState<Expression>('idle')
  const [over, setOver] = useState<{ score: number; newBest: boolean }>()

  useEffect(() => {
    if (over) return
    const t = setInterval(() => setTime((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [over])

  const finish = async (score: number) => setOver({ score, newBest: await submit(score) })
  const clock = useDeadline(mode === 'endless' ? ENDLESS_SECONDS : undefined, () => finish(found))

  const flip = (t: Tile) => {
    if (over || open.length === 2 || open.includes(t) || matched.has(t.pair)) return
    if (t.isKana) speak(t.face)
    const now = [...open, t]
    setOpen(now)
    if (now.length < 2) return
    setMoves((m) => m + 1)
    if (now[0].pair === t.pair) {
      sfx.good()
      setMood('happy')
      const m = new Set(matched).add(t.pair)
      setMatched(m)
      setFound((f) => f + 1)
      setOpen([])
      if (m.size === pairs) {
        if (mode === 'daily') { sfx.win(); finish(Math.max(10, 200 - (moves + 1 - pairs) * 10 - time)) }
        else setTimeout(() => { setTiles(deal(pool, pairs)); setMatched(new Set()) }, 500)
      }
    } else {
      sfx.bad()
      setMood('sad')
      setTimeout(() => setOpen([]), 750)
    }
  }
  useEffect(() => { const t = setTimeout(() => setMood('idle'), 800); return () => clearTimeout(t) }, [mood])

  const grid = useMemo(() => (pairs * 2 > 12 ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'), [pairs])
  if (over) return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={120} /></div>
      <p className="font-display text-4xl font-extrabold">{over.score} {mode === 'endless' ? 'pasangan' : 'poin'}</p>
      <NewBest newBest={over.newBest} best={best} />
      <button className={`${btn} bg-primary text-white`} onClick={onExit}>Main lagi</button>
    </main>
  )

  return (
    <main className="mx-auto mt-2 max-w-xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span className="flex items-center gap-1"><Icon name="timer" className="h-4 w-4" /> {mode === 'endless' ? `${Math.ceil(clock.left)}s · ${found} pasangan` : `${time}s · ${moves} langkah`}</span>
        <Buddy mood={mood} size={64} />
      </div>
      <div className={`grid gap-2 ${grid}`}>
        {tiles.map((t) => {
          const up = open.includes(t) || matched.has(t.pair)
          return (
            <motion.button key={t.id} onClick={() => flip(t)} animate={{ rotateY: up ? 0 : 180 }} transition={{ duration: .25 }}
              className={`aspect-square cursor-pointer rounded-2xl border-2 border-gold/70 text-3xl font-bold shadow-md ${matched.has(t.pair) ? 'bg-anemo text-white' : up ? 'bg-white' : 'bg-primary'}`}>
              <span lang={t.isKana ? 'ja' : undefined} style={{ display: up ? 'inline' : 'none' }}>{t.face}</span>
              {!up && <Icon name="torii" className="h-8 w-8 text-paper" />}
            </motion.button>
          )
        })}
      </div>
    </main>
  )
}
