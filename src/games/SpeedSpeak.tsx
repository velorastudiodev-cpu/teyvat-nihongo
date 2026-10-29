import { useEffect, useRef, useState } from 'react'
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
import { useInputMode } from '../ui/SpeakOrType'
import { useSpeech } from '../ui/useSpeech'
import { GameOver, ModePicker, useCompanionBuff, useGameEnd, type GameMode } from './common'

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
  const [game, setGame] = useState<{ mode: GameMode; words: Word[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ mode, ...(await wordPool(mode)) })
  if (!game) return <ModePicker title="⚡ Speed Speak" blurb={`Kata muncul satu per satu. Ucapkan sebelum ${SECONDS} detik habis. Mikrofon tetap menyala, jadi langsung bicara saja!`}
    daily={`${DAILY} kata yang sudah dipelajari`} onStart={start} />
  return <Speak key={Math.random()} {...game} onExit={() => setGame(undefined)} />
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
  const [left, setLeft] = useState(seconds)
  const [flash, setFlash] = useState<'hit' | 'miss'>()
  const [heard, setHeard] = useState('')
  const [typed, setTyped] = useState('')
  const over = lives <= 0 || (mode === 'daily' && n >= DAILY)
  const { best, result } = useGameEnd(`speed-speak:${mode}`, over, score)
  const word = words[n % words.length]
  const current = useRef(word)
  current.current = word
  const started = useRef(Date.now())

  const settle = (ok: boolean) => {
    if (flash) return
    setFlash(ok ? 'hit' : 'miss')
    const w = current.current
    if (ok) { sfx.good(); setScore((s) => s + Math.round((10 + combo * 3) * comboBoost)); setCombo((c) => c + 1) }
    else { sfx.bad(); setCombo(0); setLives((l) => (mode === 'endless' ? l - 1 : l)) }
    if (due.has(`vocab:${w.word}`)) answer(`vocab:${w.word}`, ok, Date.now() - started.current, heard, w.reading)
    setTimeout(() => { setFlash(undefined); setHeard(''); setTyped(''); setLeft(seconds); started.current = Date.now(); setN((x) => x + 1) }, ok ? 450 : 1200)
  }
  const settleRef = useRef(settle)
  settleRef.current = settle

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
  }, [input, over])

  useEffect(() => {
    if (over || flash) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [n, flash, over])
  useEffect(() => { if (left <= 0 && !flash && !over) settle(false) }, [left])

  if (over) return result ? <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} /> : null
  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between font-display font-bold">
        <span>{mode === 'daily' ? `${n + 1}/${DAILY}` : '❤️'.repeat(Math.max(0, lives))}</span>
        <span>Skor {score}{combo > 1 && <span className="text-torii"> · combo ×{combo}</span>}</span>
        <span className={left <= 2 ? 'text-torii' : ''}>⏱ {left}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-deep"><div className="h-full bg-geo transition-all duration-1000" style={{ width: `${(left / seconds) * 100}%` }} /></div>
      <motion.div key={n} initial={{ scale: .5, opacity: 0 }} animate={flash === 'miss' ? { x: [0, -8, 8, 0], opacity: 1, scale: 1 } : { scale: flash === 'hit' ? 1.15 : 1, opacity: 1 }}
        className={`rounded-3xl py-8 ${flash === 'hit' ? 'bg-anemo/20' : flash === 'miss' ? 'bg-torii/10' : 'bg-paper'}`}>
        <p lang="ja" className="text-6xl font-bold">{word.word}</p>
        <p className="mt-2 text-sm opacity-70">{word.meaning}</p>
        {flash === 'miss' && <p lang="ja" className="mt-1 text-lg font-bold text-torii">{word.reading}</p>}
      </motion.div>
      <div className="flex items-center justify-center gap-3">
        <Buddy mood={(flash === 'hit' ? 'happy' : flash === 'miss' ? 'sad' : 'idle') as Expression} size={64} />
        {input === 'voice'
          ? <p className="text-sm">{listening ? '🎤 mendengarkan…' : '🎤 mati'} <span lang="ja" className="opacity-60">{heard}</span></p>
          : <form onSubmit={(e) => { e.preventDefault(); settle(sameWord(heardKana(typed), word.reading)) }} className="flex gap-2">
              <input autoFocus value={typed} onChange={(e) => setTyped(toKana(e.target.value, { IMEMode: true }))} lang="ja" aria-label="jawaban" autoComplete="off"
                className="w-40 rounded-full border-[3px] border-ink bg-paper px-3 py-1 text-center text-xl" />
              <button className={`${btn} bg-torii text-white`}>OK</button>
            </form>}
      </div>
      {error && <p className="text-sm font-bold text-torii">{error}</p>}
      <button className="text-sm underline opacity-60" onClick={() => setLives(0)}>Berhenti</button>
    </main>
  )
}
