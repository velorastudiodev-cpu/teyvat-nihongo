import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { isParticle, textOf } from '../engine/sentence'
import { answer } from '../engine/srs/srs'
import { judgeBlanks } from '../engine/voice/match'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { btn, card, shuffle } from '../ui/kit'
import { Sentence } from '../ui/Sentence'
import { SpeakOrType } from '../ui/SpeakOrType'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { GameOver, ModePicker, useGameEnd, type GameMode } from './common'
import { sentencePool, type Line } from './sentencePool'

const DAILY = 8

/** 1–3 blanks: always the grammar key, plus up to two content words. */
export function pickBlanks(line: Line) {
  const key = line.tokens.findIndex((t) => t.key)
  const extra = shuffle(line.tokens.map((_, i) => i).filter((i) => i !== key && !isParticle(line.tokens[i]) && line.tokens[i].kana.length >= 2))
  return [key, ...extra.slice(0, Math.floor(Math.random() * 3))].sort((a, b) => a - b)
}

export function VoiceFill() {
  const [game, setGame] = useState<{ mode: GameMode; lines: Line[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ mode, ...(await sentencePool(mode)) })
  if (!game) return <ModePicker title="🎤 Voice Fill" blurb="Kalimat punya 1–3 bagian kosong. Ucapkan kalimat lengkapnya atau hanya kata yang hilang. Toleransi ±1 mora untuk kata panjang."
    daily={`${DAILY} kalimat`} onStart={start} />
  return <Fill key={Math.random()} {...game} onExit={() => setGame(undefined)} />
}

function Fill({ mode, lines, due, onExit }: { mode: GameMode; lines: Line[]; due: Set<string>; onExit: () => void }) {
  const [n, setN] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [result, setResult] = useState<{ right: boolean[]; heard: string }>()
  const over = lives <= 0 || (mode === 'daily' && n >= DAILY)
  const { best, result: end } = useGameEnd(`voice-fill:${mode}`, over, score)
  const line = lines[n % lines.length]
  const blanks = useMemo(() => pickBlanks(line), [n])

  const judge = (alts: string[]) => {
    if (result) return
    const r = judgeBlanks(alts, line.tokens, blanks)
    const all = r.right.every(Boolean)
    setResult(r)
    speak(textOf(line.tokens))
    if (all) { sfx.good(); setScore((s) => s + 15 * blanks.length) } else { sfx.bad(); if (mode === 'endless') setLives((l) => l - 1) }
    setScore((s) => s + 5 * r.right.filter(Boolean).length)
    if (due.has(`grammar:${line.pattern.id}`)) answer(`grammar:${line.pattern.id}`, r.right[blanks.indexOf(line.tokens.findIndex((t) => t.key))], 0, r.heard, line.ja)
  }
  const next = () => { setResult(undefined); setN(n + 1) }
  const mood: Expression = !result ? 'idle' : result.right.every(Boolean) ? 'happy' : 'sad'

  if (over) return end ? <GameOver score={score} newBest={end.newBest} best={best} onExit={onExit} /> : null
  return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-4 text-center`}>
      <div className="flex items-center justify-between font-display font-bold">
        <span>{mode === 'daily' ? `${n + 1}/${DAILY}` : '❤️'.repeat(Math.max(0, lives))}</span>
        <span>Skor {score}</span>
        <Buddy mood={mood} size={64} />
      </div>
      <p className="text-sm opacity-70">{line.tr}</p>
      <motion.div key={`${n}${!!result}`} initial={{ scale: .97 }} animate={{ scale: 1 }}>
        <Sentence tokens={line.tokens} blank={result ? undefined : blanks}
          marks={result ? line.tokens.map((_, i) => (blanks.includes(i) ? result.right[blanks.indexOf(i)] : undefined)) : undefined} className="text-3xl" />
      </motion.div>
      {result ? (
        <div className="space-y-2">
          <p className="text-sm">Terdengar: <span lang="ja" className="font-bold">{result.heard || '—'}</span></p>
          <button autoFocus onClick={next} className={`${btn} bg-torii text-white`}>Lanjut →</button>
        </div>
      ) : <SpeakOrType onAnswer={judge} hint={`Ucapkan ${blanks.length} kata yang hilang, atau seluruh kalimat`} />}
    </main>
  )
}
