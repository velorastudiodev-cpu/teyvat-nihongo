import { useEffect, useRef, useState } from 'react'
import { Hearts, Icon } from '../ui/Icon'
import { motion } from 'framer-motion'
import { toKana } from 'wanakana'
import { db } from '../data/db'
import { VOCAB, type Word } from '../data/kanji'
import { answer } from '../engine/srs/srs'
import { sameWord, toKana as heardKana } from '../engine/voice/match'
import { levelOpen } from '../modules/kanji/content'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { btn, card, shuffle } from '../ui/kit'
import { sfx } from '../ui/sfx'
import { useDeadline } from '../ui/useDeadline'
import { useInputMode } from '../ui/useInputMode'
import { useSpeech } from '../ui/useSpeech'
import { GameOver, ModePicker, type GameMode } from './common'
import { useCompanionBuff, useGameEnd } from './hooks'

const DAILY = 15
const SECONDS = 5

async function wordPool(mode: GameMode) {
  const stage = (await db.profile.get('me'))?.stage
  const open = VOCAB.filter((w) => levelOpen(w.level, stage))
  const items = await db.items.where('kind').equals('vocab').toArray()
  const due = new Set(items.filter((i) => i.due <= Date.now()).map((i) => i.id))
  const learned = new Set(items.map((i) => i.id))
  const mine = open.filter((w) => learned.has(`vocab:${w.word}`))
  const base = open.length ? open : VOCAB.filter((w) => w.level === 'N5')
  return { words: shuffle(mode === 'daily' && mine.length >= 5 ? mine : base), due }
}

export function SpeedSpeak() {
  const [game, setGame] = useState<{ run: number; mode: GameMode; words: Word[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ run: Date.now(), mode, ...(await wordPool(mode)) })
  if (!game) return <ModePicker title="Speed Speak" icon="echo" blurb={`Kata muncul satu per satu. Ucapkan sebelum ${SECONDS} detik habis. Mikrofon tetap menyala, jadi langsung bicara saja!`}
    daily={`${DAILY} kata yang sudah dipelajari`} onStart={start} />
  return <Speak key={game.run} {...game} onExit={() => setGame(undefined)} />
}

function Speak({ mode, words, due, onExit }: { mode: GameMode; words: Word[]; due: Set<string>; onExit: () => void }) {
  const timeBuff = useCompanionBuff('speed-speak')
  const seconds = SECONDS + (timeBuff?.effect === 'extraTime' ? timeBuff.value : 0)
  const comboBoost = timeBuff?.effect === 'comboMult' ? timeBuff.value : 1
  const [input] = useInputMode()
  const { listening, error, listen, stop } = useSpeech()
  const [n, setN] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lives, setLives] = useState(3)
  const [flash, setFlash] = useState<'hit' | 'miss'>()
  const [heard, setHeard] = useState('')
  const [typed, setTyped] = useState('')
  const over = lives <= 0 || (mode === 'daily' && n >= DAILY)
  const { best, result } = useGameEnd(`speed-speak:${mode}`, over, score)
  const word = words[n % words.length]
  const current = useRef(word)
  const started = useRef(0)
  useEffect(() => { current.current = word; started.current = Date.now() }, [word])

  const timer = useDeadline(seconds, () => settle(false))
  const left = Math.ceil(timer.left)

  function settle(ok: boolean) {
    if (flash || over) return
    timer.stop()
    setFlash(ok ? 'hit' : 'miss')
    const w = current.current
    if (ok) { sfx.good(); setScore((s) => s + Math.round((10 + combo * 3) * comboBoost)); setCombo((c) => c + 1) }
    else { sfx.bad(); setCombo(0); setLives((l) => (mode === 'endless' ? l - 1 : l)) }
    if (due.has(`vocab:${w.word}`)) answer(`vocab:${w.word}`, ok, Date.now() - started.current, heard, w.reading)
    const ends = (!ok && mode === 'endless' && lives <= 1) || (mode === 'daily' && n + 1 >= DAILY)
    setTimeout(() => {
      setFlash(undefined); setHeard(''); setTyped(''); setN(n + 1)
      if (!ends) timer.start(seconds)
    }, ok ? 450 : 1200)
  }
  const settleRef = useRef(settle)
  useEffect(() => { settleRef.current = settle })

  // one continuous recognition session for the whole run
  useEffect(() => {
    if (input !== 'voice' || over) return
    listen((alts) => {
      const w = current.current
      const hit = alts.some((a) => sameWord(heardKana(a, [[w.word, w.reading]]), w.reading))
      setHeard(alts[0])
      if (hit) settleRef.current(true)
    }, { continuous: true })
    return stop
  }, [input, over, listen, stop])

  if (over) return result ? <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} /> : null
  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between font-display font-bold">
        <span>{mode === 'daily' ? `${n + 1}/${DAILY}` : <Hearts lives={lives} />}</span>
        <span>Skor {score}{combo > 1 && <span className="text-wrong"> · combo ×{combo}</span>}</span>
        <span className={left <= 2 ? 'text-wrong' : ''}><Icon name="timer" className="h-4 w-4" /> {left}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-deep"><div className="h-full bg-geo transition-all duration-1000" style={{ width: `${(timer.left / seconds) * 100}%` }} /></div>
      <motion.div key={n} initial={{ scale: .5, opacity: 0 }} animate={flash === 'miss' ? { x: [0, -8, 8, 0], opacity: 1, scale: 1 } : { scale: flash === 'hit' ? 1.15 : 1, opacity: 1 }}
        className={`rounded-3xl py-8 ${flash === 'hit' ? 'bg-anemo/20' : flash === 'miss' ? 'bg-wrong/10' : 'bg-paper'}`}>
        <p lang="ja" className="text-6xl font-bold">{word.word}</p>
        <p className="mt-2 text-sm opacity-70">{word.meaning}</p>
        {flash === 'miss' && <p lang="ja" className="mt-1 text-lg font-bold text-wrong">{word.reading}</p>}
      </motion.div>
      <div className="flex items-center justify-center gap-3">
        <Buddy mood={(flash === 'hit' ? 'happy' : flash === 'miss' ? 'sad' : 'idle') as Expression} size={64} />
        {input === 'voice'
          ? <p className="text-sm"><Icon name={listening ? 'mic' : 'micOff'} className="h-4 w-4" /> {listening ? 'mendengarkan…' : 'mati'} <span lang="ja" className="opacity-60">{heard}</span></p>
          : <form onSubmit={(e) => { e.preventDefault(); settle(sameWord(heardKana(typed), word.reading)) }} className="flex gap-2">
              <input autoFocus value={typed} onChange={(e) => setTyped(toKana(e.target.value, { IMEMode: true }))} lang="ja" aria-label="jawaban" autoComplete="off"
                className="w-40 rounded-full border-2 border-gold/70 bg-paper px-3 py-1 text-center text-xl" />
              <button className={`${btn} bg-primary text-white`}>OK</button>
            </form>}
      </div>
      {error && <p className="text-sm font-bold text-wrong">{error}</p>}
      <button className="text-sm underline opacity-60" onClick={() => { timer.stop(); setLives(0) }}>Berhenti</button>
    </main>
  )
}
