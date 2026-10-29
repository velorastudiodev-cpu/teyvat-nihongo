import { useEffect, useState } from 'react'
import { answer } from '../engine/srs/srs'
import { BuildExercise } from '../modules/grammar/exercises'
import { GameOver, ModePicker, type GameMode } from './common'
import { useGameEnd } from './hooks'
import { sentencePool, type Line } from './sentencePool'

const DAILY = 5
const SECONDS = 120

export function SentenceBuilderGame() {
  const [game, setGame] = useState<{ run: number; mode: GameMode; lines: Line[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ run: Date.now(), mode, ...(await sentencePool(mode)) })
  if (!game) return <ModePicker title="🧱 Sentence Builder" blurb="Susun blok kata menjadi kalimat yang benar. Kalimat panjang = poin lebih besar."
    daily={`${DAILY} kalimat`} endless={`Time attack · ${SECONDS} detik`} onStart={start} />
  return <Builder key={game.run} {...game} onExit={() => setGame(undefined)} />
}

function Builder({ mode, lines, due, onExit }: { mode: GameMode; lines: Line[]; due: Set<string>; onExit: () => void }) {
  const [n, setN] = useState(0)
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(SECONDS)
  const over = mode === 'daily' ? n >= DAILY : left <= 0
  const { best, result } = useGameEnd(`sentence-builder:${mode}`, over, score)

  useEffect(() => {
    if (mode === 'daily' || over) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [mode, over])

  if (over) return result ? <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} /> : null
  const line = lines[n % lines.length]
  const head = mode === 'daily' ? `${n + 1}/${DAILY} · skor ${score}` : `⏱ ${left}s · skor ${score}`
  return (
    <div>
      <p className="mt-2 text-center font-display font-bold">{head}</p>
      <BuildExercise key={n} ja={line.ja} tr={line.tr} title={line.pattern.title} onAnswer={(ok, given, ms) => {
        if (ok) setScore((s) => s + line.tokens.length * 5)
        if (due.has(`grammar:${line.pattern.id}`)) answer(`grammar:${line.pattern.id}`, ok, ms, given, line.ja)
        setN(n + 1)
      }} />
    </div>
  )
}
