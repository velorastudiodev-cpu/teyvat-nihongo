import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { textOf } from '../engine/sentence'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { card, sample, shuffle } from '../ui/kit'
import { Sentence } from '../ui/Sentence'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { PlayButton, SpeedPicker } from '../modules/listening/Listening'
import { GameOver, ModePicker, useCompanionBuff, useGameEnd, type GameMode } from './common'
import { sentencePool, type Line } from './sentencePool'

const DAILY = 10
const SECONDS = 12

export function ListeningEcho() {
  const [game, setGame] = useState<{ mode: GameMode; lines: Line[]; all: Line[] }>()
  const start = async (mode: GameMode) => setGame({ mode, lines: (await sentencePool(mode)).lines, all: (await sentencePool('endless')).lines })
  if (!game) return (
    <div>
      <ModePicker title="🎧 Listening Echo" blurb="Dengarkan kalimatnya, lalu pilih kalimat Jepang yang cocok sebelum waktunya habis." daily={`${DAILY} kalimat`} onStart={start} />
      <div className="mt-3 flex justify-center"><SpeedPicker /></div>
    </div>
  )
  return <Echo key={Math.random()} {...game} onExit={() => setGame(undefined)} />
}

function Echo({ mode, lines, all, onExit }: { mode: GameMode; lines: Line[]; all: Line[]; onExit: () => void }) {
  const buff = useCompanionBuff('listening-echo')
  const [n, setN] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [left, setLeft] = useState(SECONDS)
  const [picked, setPicked] = useState<string>()
  const [mood, setMood] = useState<Expression>('idle')
  const over = lives <= 0 || (mode === 'daily' && n >= DAILY)
  const { best, result } = useGameEnd(`listening-echo:${mode}`, over, score)

  const line = lines[n % lines.length]
  const options = useMemo(() => shuffle([line, ...sample(all.filter((l) => l.ja !== line.ja), 3)]), [n])
  useEffect(() => {
    if (over || picked) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [n, picked, over])
  useEffect(() => { if (left <= 0 && !picked && !over) pick('') }, [left])

  function pick(ja: string) {
    if (picked !== undefined) return
    const ok = ja === line.ja
    setPicked(ja)
    setMood(ok ? 'happy' : 'sad')
    if (ok) { sfx.good(); setScore((s) => s + 10 + left) } else { sfx.bad(); setLives((l) => l - 1); speak(textOf(line.tokens)) }
    setTimeout(() => { setPicked(undefined); setLeft(SECONDS); setMood('idle'); setN((x) => x + 1) }, ok ? 800 : 2000)
  }

  if (over && result) return <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} />
  return (
    <main className="mx-auto mt-2 max-w-xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span>{'❤️'.repeat(Math.max(0, lives))}</span>
        <span>Skor {score}{buff && <span className="text-anemo"> · {buff.desc}</span>}</span>
        <span className={left <= 3 ? 'text-torii' : ''}>⏱ {left}s</span>
      </div>
      <motion.div key={n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${card} space-y-3`}>
        <div className="flex items-center justify-between">
          <PlayButton text={textOf(line.tokens)} auto />
          <Buddy mood={mood} size={64} />
        </div>
        {options.map((o) => (
          <button key={o.ja} onClick={() => pick(o.ja)}
            className={`block w-full cursor-pointer rounded-2xl border-[3px] px-3 text-left transition-colors ${picked !== undefined && o.ja === line.ja ? 'border-anemo bg-anemo/15' : picked === o.ja ? 'border-torii bg-torii/10' : 'border-ink/20 bg-paper hover:border-ink'}`}>
            <Sentence tokens={o.tokens} className="text-xl" />
          </button>
        ))}
        {picked !== undefined && <p className="text-center text-sm">{line.tr}</p>}
      </motion.div>
      <button className="text-sm underline opacity-60" onClick={() => setLives(0)}>Berhenti</button>
    </main>
  )
}
