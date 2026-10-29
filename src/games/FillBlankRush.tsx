import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'
import { motion } from 'framer-motion'
import { textOf } from '../engine/sentence'
import { answer } from '../engine/srs/srs'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { btn, card, shuffle } from '../ui/kit'
import { Sentence } from '../ui/Sentence'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { blankOptions } from '../modules/grammar/blanks'
import { GameOver, ModePicker, type GameMode } from './common'
import { useCompanionBuff, useGameEnd } from './hooks'
import { sentencePool, type Line } from './sentencePool'

const SECONDS = 60
const blankOf = (line: Line) => line.tokens.findIndex((t) => t.key)
const optionsFor = (line: Line) => { const t = line.tokens[blankOf(line)]; return shuffle([t.text, ...blankOptions(t, line.pattern.level)]) }

export function FillBlankRush() {
  const [game, setGame] = useState<{ run: number; mode: GameMode; lines: Line[]; due: Set<string> }>()
  const start = async (mode: GameMode) => setGame({ run: Date.now(), mode, ...(await sentencePool(mode)) })
  if (!game) return <ModePicker title="Fill-the-Blank Rush" icon="bolt" blurb="60 detik! Isi bagian kosong secepat mungkin. Combo menaikkan multiplier, jawaban salah memotong 3 detik."
    daily="pola yang sudah dipelajari" endless="Endless · semua pola yang terbuka" onStart={start} />
  return <Rush key={game.run} {...game} onExit={() => setGame(undefined)} />
}

function Rush({ mode, lines, due, onExit }: { mode: GameMode; lines: Line[]; due: Set<string>; onExit: () => void }) {
  const buff = useCompanionBuff('fill-blank-rush')
  const comboBoost = buff?.effect === 'comboMult' ? buff.value : 1
  const [n, setN] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [left, setLeft] = useState(SECONDS)
  const [flash, setFlash] = useState<string>()
  const [mood, setMood] = useState<Expression>('idle')
  const [options, setOptions] = useState(() => optionsFor(lines[0]))
  const over = left <= 0
  const { best, result } = useGameEnd(`fill-blank-rush:${mode}`, over, score)

  const line = lines[n % lines.length]
  const blank = blankOf(line)
  const multiplier = Math.min(3, 1 + combo * 0.25) * comboBoost

  useEffect(() => {
    if (over) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [over])

  const pick = (o: string) => {
    if (flash) return
    const ok = o === line.tokens[blank].text
    setFlash(o)
    setMood(ok ? 'happy' : 'sad')
    if (ok) { sfx.good(); setScore((s) => s + Math.round(10 * multiplier)); setCombo((c) => c + 1) }
    else { sfx.bad(); setCombo(0); setLeft((s) => s - 3); speak(textOf(line.tokens)) }
    if (due.has(`grammar:${line.pattern.id}`)) answer(`grammar:${line.pattern.id}`, ok, 0, o, line.tokens[blank].text)
    setTimeout(() => { setFlash(undefined); setMood('idle'); setN(n + 1); setOptions(optionsFor(lines[(n + 1) % lines.length])) }, ok ? 350 : 1100)
  }

  if (over && result) return <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} />
  return (
    <main className="mx-auto mt-2 max-w-xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span className={left <= 10 ? 'text-wrong' : ''}><Icon name="timer" className="h-4 w-4" /> {Math.max(0, left)}s</span>
        <span>Skor {score}</span>
        <span className="text-wrong">×{multiplier.toFixed(2).replace(/\.?0+$/, '')}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-deep"><div className="h-full bg-geo transition-all" style={{ width: `${(left / SECONDS) * 100}%` }} /></div>
      <motion.div key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${card} space-y-3 text-center`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-anemo" lang="ja">{line.pattern.title}</span>
          <Buddy mood={mood} size={56} />
        </div>
        <Sentence tokens={line.tokens} blank={flash === line.tokens[blank].text ? undefined : blank} className="text-2xl" />
        <p className="text-sm opacity-70">{line.tr}</p>
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <button key={o} lang="ja" onClick={() => pick(o)}
              className={`${btn} text-xl ${flash && o === line.tokens[blank].text ? 'bg-deep text-white' : flash === o ? 'bg-primary text-white' : 'bg-paper'}`}>{o}</button>
          ))}
        </div>
      </motion.div>
    </main>
  )
}
