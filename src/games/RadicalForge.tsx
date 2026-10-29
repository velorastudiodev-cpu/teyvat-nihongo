import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../data/db'
import { KANJI, mainReading, type Kanji } from '../data/kanji'
import { answer } from '../engine/srs/srs'
import { getCharacter, type Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { btn, card, sample, shuffle } from '../ui/kit'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { useBest, type GameMode } from './common'
import { kanjiPool } from './kanjiPool'

const DAILY_ROUNDS = 8
const SECONDS = 20
const BARE_STROKES = new Set('丿丶丨乙亅乚㇒㇏𠂉')     // single strokes, not meaningful building blocks
const forgeable = (k: Kanji) => k.parts.length >= 2 && !k.parts.some((p) => BARE_STROKES.has(p))
const ALL_PARTS = [...new Set(KANJI.filter(forgeable).flatMap((k) => k.parts))]

export function RadicalForge() {
  const [game, setGame] = useState<{ mode: GameMode; pool: Kanji[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ mode, ...(await kanjiPool(mode, forgeable)) })
  if (!game) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <h1 className="font-display text-3xl font-extrabold">⚒️ Radical Forge</h1>
      <p>Pilih komponen yang tepat lalu tempa jadi kanji yang diminta. Contoh: 亻 + 木 = 休 (orang bersandar di pohon = istirahat).</p>
      <button className={`${btn} w-full bg-torii text-white`} onClick={() => start('daily')}>Daily · {DAILY_ROUNDS} kanji</button>
      <button className={`${btn} w-full bg-anemo text-white`} onClick={() => start('endless')}>Endless · 3 nyawa</button>
    </main>
  )
  return <Forge key={Math.random()} {...game} onExit={() => setGame(undefined)} />
}

function Forge({ mode, pool, due, onExit }: { mode: GameMode; pool: Kanji[]; due: Set<string>; onExit: () => void }) {
  const companion = useLiveQuery(() => db.profile.get('me').then((p) => p?.companionId))
  const buff = getCharacter(companion ?? '')?.buff
  const seconds = SECONDS + (buff?.game === 'radical-forge' && buff.effect === 'extraTime' ? buff.value : 0)
  const { best, submit } = useBest(`radical-forge:${mode}`)

  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [left, setLeft] = useState(seconds)
  const [chosen, setChosen] = useState<string[]>([])
  const [result, setResult] = useState<boolean>()
  const [mood, setMood] = useState<Expression>('idle')
  const [over, setOver] = useState<{ newBest: boolean }>()

  const k = pool[round % pool.length]
  const options = useMemo(() => shuffle([...k.parts, ...sample(ALL_PARTS.filter((p) => !k.parts.includes(p)), 6 - k.parts.length)]), [k, round])
  const finished = lives <= 0 || (mode === 'daily' && round >= DAILY_ROUNDS)

  useEffect(() => {
    if (finished) { if (!over) submit(score).then((newBest) => { setOver({ newBest }); if (newBest) sfx.win() }); return }
    if (result !== undefined) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [round, result, finished])
  useEffect(() => { if (left <= 0 && result === undefined && !finished) settle(false) }, [left])

  function settle(right: boolean) {
    setResult(right)
    setMood(right ? 'happy' : 'sad')
    speak(mainReading(k))
    if (right) { sfx.win(); setScore((s) => s + 20 + left * 2) } else { sfx.bad(); setLives((l) => l - 1) }
    if (due.has(`kanji:${k.char}`)) answer(`kanji:${k.char}`, right, (seconds - left) * 1000, chosen.join('+'), k.parts.join('+'))
    setTimeout(() => { setResult(undefined); setChosen([]); setLeft(seconds); setMood('idle'); setRound((r) => r + 1) }, 1500)
  }
  const forge = () => {
    if (result !== undefined || !chosen.length) return
    settle(chosen.length === k.parts.length && k.parts.every((p) => chosen.includes(p)))
  }

  if (over) return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={120} /></div>
      <p className="font-display text-4xl font-extrabold">{score} poin</p>
      <p>{over.newBest ? '🏆 Rekor baru!' : `Rekor: ${best}`}</p>
      <button className={`${btn} bg-torii text-white`} onClick={onExit}>Main lagi</button>
    </main>
  )

  return (
    <main className="mx-auto mt-2 max-w-lg space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span>{'❤️'.repeat(Math.max(0, lives))}</span>
        <span>Skor {score}</span>
        <span className={left <= 5 ? 'text-torii' : ''}>⏱ {left}s</span>
      </div>
      <div className={`${card} space-y-4 text-center`}>
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-sm opacity-70">Tempa kanji:</p>
            <p className="font-display text-3xl font-extrabold">{k.meaning}</p>
            <p lang="ja" className="opacity-70">{mainReading(k)} · {k.parts.length} komponen</p>
          </div>
          <Buddy mood={mood} size={80} />
        </div>
        <motion.div key={`${round}${result}`} initial={{ scale: .6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }}
          className={`mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border-[3px] border-dashed text-6xl font-bold ${result === true ? 'border-anemo bg-anemo/15' : result === false ? 'border-torii bg-torii/10' : 'border-ink/40'}`}>
          <span lang="ja">{result !== undefined ? k.char : chosen.join('') || '？'}</span>
        </motion.div>
        {result === false && <p lang="ja">{k.char} = {k.parts.join(' + ')}</p>}
        <div className="grid grid-cols-3 gap-2">
          {options.map((p) => (
            <motion.button key={p} whileTap={{ scale: .9 }} lang="ja"
              onClick={() => { sfx.pop(); setChosen((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p])) }}
              className={`${btn} text-3xl ${chosen.includes(p) ? 'bg-geo' : 'bg-paper'}`}>{p}</motion.button>
          ))}
        </div>
        <button className={`${btn} w-full bg-torii text-white`} disabled={!chosen.length || result !== undefined} onClick={forge}>Tempa! 🔨</button>
      </div>
      <button className="text-sm underline opacity-60" onClick={() => setLives(0)}>Berhenti</button>
    </main>
  )
}
