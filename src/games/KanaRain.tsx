import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { db } from '../data/db'
import { kanaId, romajiMatches, type Kana } from '../data/kana'
import { answer } from '../engine/srs/srs'
import { getCharacter, type Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { btn, card } from '../ui/kit'
import { sfx } from '../ui/sfx'
import { GameSetup, kanaPool, useBest, type GameMode, type KanaSet } from './common'

interface Drop { key: number; kana: Kana; x: number; y: number; born: number }
const DAILY_DROPS = 30

export function KanaRain() {
  const [game, setGame] = useState<{ mode: GameMode; pool: Kana[]; due: Set<string> }>()
  const start = async (mode: GameMode, set: KanaSet) => setGame({ mode, ...(await kanaPool(set)) })
  if (!game) return <GameSetup title="☔ Kana Rain" blurb="Kana berjatuhan! Ketik romaji-nya sebelum menyentuh tanah. Combo menaikkan skor." onStart={start} />
  return <Rain key={Math.random()} {...game} onExit={() => setGame(undefined)} />
}

function Rain({ mode, pool, due, onExit }: { mode: GameMode; pool: Kana[]; due: Set<string>; onExit: () => void }) {
  const companion = useLiveQuery(() => db.profile.get('me').then((p) => p?.companionId))
  const buff = getCharacter(companion ?? '')?.buff
  const mult = buff?.game === 'kana-rain' && buff.effect === 'scoreMult' ? buff.value : 1
  const { best, submit } = useBest(`kana-rain:${mode}`)

  const [drops, setDrops] = useState<Drop[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lives, setLives] = useState(3)
  const [spawned, setSpawned] = useState(0)
  const [typed, setTyped] = useState('')
  const [mood, setMood] = useState<Expression>('idle')
  const [over, setOver] = useState<{ newBest: boolean }>()
  const nextKey = useRef(0)

  const speed = 9 + Math.min(score / 60, 22)                  // % of height per second
  const spawnEvery = Math.max(650, 1700 - score * 2.5)
  const tune = useRef({ speed, spawnEvery })
  tune.current = { speed, spawnEvery }
  const live = useRef<Drop[]>([])                             // the loop owns the drops; state only mirrors them for render
  const done = lives <= 0 || (mode === 'daily' && spawned >= DAILY_DROPS && drops.length === 0)

  useEffect(() => {
    if (done) {
      if (!over) submit(score).then((newBest) => { setOver({ newBest }); if (newBest) sfx.win() })
      return
    }
    let last = performance.now()
    let sinceSpawn = Infinity
    let raf = 0
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      sinceSpawn += dt * 1000
      const moved = live.current.map((d) => ({ ...d, y: d.y + tune.current.speed * dt }))
      const landed = moved.filter((d) => d.y >= 92)
      live.current = moved.filter((d) => d.y < 92)
      if (landed.length) {
        sfx.bad()
        setLives((l) => l - landed.length)
        setCombo(0)
        setMood('sad')
        landed.forEach((d) => due.has(kanaId(d.kana)) && answer(kanaId(d.kana), false, 0, '', d.kana.romaji))
      }
      if (sinceSpawn >= tune.current.spawnEvery && (mode === 'endless' || nextKey.current < DAILY_DROPS)) {
        sinceSpawn = 0
        const kana = pool[Math.floor(Math.random() * pool.length)]
        live.current.push({ key: nextKey.current++, kana, x: 6 + Math.random() * 82, y: -8, born: Date.now() })
        setSpawned(nextKey.current)
      }
      setDrops(live.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done])

  const type = (value: string) => {
    setTyped(value)
    const v = value.trim()
    const ds = live.current
    const hit = ds.filter((d) => romajiMatches(v, d.kana)).sort((a, b) => b.y - a.y)[0]
    const couldGrow = ds.some((d) => d.kana.romaji.startsWith(v) && d.kana.romaji !== v)
    if (!hit) {
      if (v.length >= 3 && !couldGrow) { setTyped(''); setCombo(0) }   // typo: clear and break the combo
      return
    }
    if (couldGrow) return                                     // "n" might still become "na" (type "nn" for ん)
    sfx.pop()
    live.current = ds.filter((d) => d.key !== hit.key)
    setDrops(live.current)
    setScore((s) => s + Math.round(10 * (1 + Math.min(combo, 20) * 0.1) * mult))
    setCombo((c) => c + 1)
    setMood('happy')
    setTyped('')
    if (due.has(kanaId(hit.kana))) answer(kanaId(hit.kana), true, Date.now() - hit.born)
  }
  useEffect(() => { const t = setTimeout(() => setMood('idle'), 700); return () => clearTimeout(t) }, [mood])

  if (over) return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood={lives > 0 || over.newBest ? 'happy' : 'sad'} size={120} /></div>
      <p className="font-display text-4xl font-extrabold">{score} poin</p>
      <p>{over.newBest ? '🏆 Rekor baru!' : `Rekor: ${best}`}</p>
      <div className="flex justify-center gap-2">
        <button className={`${btn} bg-torii text-white`} onClick={onExit}>Main lagi</button>
      </div>
    </main>
  )

  return (
    <main className="mx-auto mt-2 max-w-2xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span>{'❤️'.repeat(Math.max(0, lives))}{'🖤'.repeat(Math.max(0, 3 - Math.max(0, lives)))}</span>
        <span>Skor {score} {combo > 1 && <span className="text-torii">· combo ×{combo}</span>}{mult > 1 && <span className="text-anemo"> · buff ×{mult}</span>}</span>
        <span className="opacity-60">{mode === 'daily' ? `${Math.min(spawned, DAILY_DROPS)}/${DAILY_DROPS}` : `rekor ${best}`}</span>
      </div>
      <div className="relative h-[60vh] min-h-80 overflow-hidden rounded-3xl border-[3px] border-ink bg-gradient-to-b from-[#dff1ea] to-paper">
        <AnimatePresence>
          {drops.map((d) => (
            <motion.span key={d.key} lang="ja" exit={{ scale: 1.8, opacity: 0 }} transition={{ duration: .2 }}
              className="absolute -translate-x-1/2 rounded-2xl border-[3px] border-ink bg-white px-2 text-4xl font-bold shadow-[2px_2px_0_var(--color-ink)]"
              style={{ left: `${d.x}%`, top: `${d.y}%` }}>{d.kana.char}</motion.span>
          ))}
        </AnimatePresence>
        <div className="absolute right-2 bottom-2"><Buddy mood={mood} size={80} /></div>
        <div className="absolute inset-x-0 bottom-0 h-[8%] bg-[#8cc79c]" />
      </div>
      <input autoFocus value={typed} onChange={(e) => type(e.target.value.toLowerCase())} placeholder="ketik romaji…" autoCapitalize="off" autoComplete="off"
        className="w-full rounded-full border-[3px] border-ink bg-white px-5 py-3 text-center text-2xl" aria-label="romaji" />
      <button className="text-sm underline opacity-60" onClick={() => setLives(0)}>Berhenti</button>
    </main>
  )
}
