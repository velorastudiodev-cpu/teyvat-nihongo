import { useState } from 'react'
import { Hearts, Icon } from '../ui/Icon'
import { motion } from 'framer-motion'
import { textOf } from '../engine/sentence'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { card, sample, shuffle } from '../ui/kit'
import { Sentence } from '../ui/Sentence'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { useDeadline } from '../ui/useDeadline'
import { PlayButton, SpeedPicker } from '../modules/listening/Listening'
import { GameOver, ModePicker, type GameMode } from './common'
import { useCompanionBuff, useGameEnd } from './hooks'
import { sentencePool, type Line } from './sentencePool'

const DAILY = 10
const SECONDS = 12
const optionsFor = (line: Line, all: Line[]) => shuffle([line, ...sample(all.filter((l) => l.ja !== line.ja), 3)])

export function ListeningEcho() {
  const [game, setGame] = useState<{ run: number; mode: GameMode; lines: Line[]; all: Line[] }>()
  const start = async (mode: GameMode) => setGame({ run: Date.now(), mode, lines: (await sentencePool(mode)).lines, all: (await sentencePool('endless')).lines })
  if (!game) return (
    <div>
      <ModePicker title="Listening Echo" icon="headphones" blurb="Dengarkan kalimatnya, lalu pilih kalimat Jepang yang cocok sebelum waktunya habis." daily={`${DAILY} kalimat`} onStart={start} />
      <div className="mt-3 flex justify-center"><SpeedPicker /></div>
    </div>
  )
  return <Echo key={game.run} {...game} onExit={() => setGame(undefined)} />
}

function Echo({ mode, lines, all, onExit }: { mode: GameMode; lines: Line[]; all: Line[]; onExit: () => void }) {
  const buff = useCompanionBuff('listening-echo')
  const [n, setN] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [picked, setPicked] = useState<string>()
  const [mood, setMood] = useState<Expression>('idle')
  const [options, setOptions] = useState(() => optionsFor(lines[0], all))
  const timer = useDeadline(SECONDS, () => pick(''))
  const left = Math.ceil(timer.left)
  const over = lives <= 0 || (mode === 'daily' && n >= DAILY)
  const { best, result } = useGameEnd(`listening-echo:${mode}`, over, score)
  const line = lines[n % lines.length]

  function pick(ja: string) {
    if (picked !== undefined || over) return
    timer.stop()
    const ok = ja === line.ja
    setPicked(ja)
    setMood(ok ? 'happy' : 'sad')
    if (ok) { sfx.good(); setScore((s) => s + 10 + left) } else { sfx.bad(); setLives((l) => l - 1); speak(textOf(line.tokens)) }
    const ends = (!ok && lives <= 1) || (mode === 'daily' && n + 1 >= DAILY)
    setTimeout(() => {
      setPicked(undefined); setMood('idle'); setN(n + 1); setOptions(optionsFor(lines[(n + 1) % lines.length], all))
      if (!ends) timer.start(SECONDS)
    }, ok ? 800 : 2000)
  }

  if (over && result) return <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} />
  return (
    <main className="mx-auto mt-2 max-w-xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <Hearts lives={lives} />
        <span>Skor {score}{buff && <span className="text-anemo"> · {buff.desc}</span>}</span>
        <span className={left <= 3 ? 'text-wrong' : ''}><Icon name="timer" className="h-4 w-4" /> {left}s</span>
      </div>
      <motion.div key={n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${card} space-y-3`}>
        <div className="flex items-center justify-between">
          <PlayButton text={textOf(line.tokens)} auto />
          <Buddy mood={mood} size={64} />
        </div>
        {options.map((o) => (
          <button key={o.ja} onClick={() => pick(o.ja)}
            className={`block w-full cursor-pointer rounded-2xl border-2 px-3 text-left transition-colors ${picked !== undefined && o.ja === line.ja ? 'border-anemo bg-anemo/15' : picked === o.ja ? 'border-wrong bg-wrong/10' : 'border-ink/20 bg-paper hover:border-ink'}`}>
            <Sentence tokens={o.tokens} className="text-xl" />
          </button>
        ))}
        {picked !== undefined && <p className="text-center text-sm">{line.tr}</p>}
      </motion.div>
      <button className="text-sm underline opacity-60" onClick={() => { timer.stop(); setLives(0) }}>Berhenti</button>
    </main>
  )
}
