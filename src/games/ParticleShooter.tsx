import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { isParticle, textOf } from '../engine/sentence'
import { answer } from '../engine/srs/srs'
import type { Expression } from '../characters'
import { Buddy } from '../ui/Buddy'
import { card, sample, shuffle } from '../ui/kit'
import { Sentence } from '../ui/Sentence'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import { GameOver, ModePicker, useCompanionBuff, useGameEnd, type GameMode } from './common'
import { sentencePool, type Line } from './sentencePool'

const DAILY = 10
const SECONDS = 8
const TARGETS = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'から']

export function ParticleShooter() {
  const [game, setGame] = useState<{ mode: GameMode; lines: Line[]; due: Set<string> }>()
  const start = async (mode: GameMode) => {
    const { lines, due } = await sentencePool(mode)
    setGame({ mode, lines: lines.filter((l) => l.tokens.some(isParticle)), due })
  }
  if (!game) return <ModePicker title="🎯 Particle Shooter" blurb="Partikel melayang di arena. Tembak partikel yang tepat untuk mengisi kalimat sebelum waktunya habis!" daily={`${DAILY} kalimat`} onStart={start} />
  return <Arena key={Math.random()} {...game} onExit={() => setGame(undefined)} />
}

function Arena({ mode, lines, due, onExit }: { mode: GameMode; lines: Line[]; due: Set<string>; onExit: () => void }) {
  const buff = useCompanionBuff('particle-shooter')
  const mult = buff?.effect === 'scoreMult' ? buff.value : 1
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lives, setLives] = useState(3)
  const [left, setLeft] = useState(SECONDS)
  const [hit, setHit] = useState<{ p: string; ok: boolean }>()
  const [mood, setMood] = useState<Expression>('idle')
  const over = lives <= 0 || (mode === 'daily' && round >= DAILY)
  const { best, result } = useGameEnd(`particle-shooter:${mode}`, over, score)

  const line = lines[round % lines.length]
  const blank = useMemo(() => {
    const idx = line.tokens.map((t, i) => (isParticle(t) && TARGETS.includes(t.text) ? i : -1)).filter((i) => i >= 0)
    return idx.find((i) => line.tokens[i].key) ?? idx[Math.floor(Math.random() * idx.length)] ?? 0
  }, [round])
  const targets = useMemo(() => shuffle([line.tokens[blank].text, ...sample(TARGETS.filter((p) => p !== line.tokens[blank].text), 4)])
    .map((p) => ({ p, top: 10 + Math.random() * 60, dur: 3 + Math.random() * 3, delay: -Math.random() * 3 })), [round])

  useEffect(() => {
    if (over || hit) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [round, hit, over])
  useEffect(() => { if (left <= 0 && !hit && !over) shoot('') }, [left])

  function shoot(p: string) {
    if (hit) return
    const ok = p === line.tokens[blank].text
    setHit({ p, ok })
    setMood(ok ? 'happy' : 'sad')
    speak(textOf(line.tokens))
    if (ok) { sfx.good(); setScore((s) => s + Math.round((10 + combo * 2 + left) * mult)); setCombo((c) => c + 1) }
    else { sfx.bad(); setLives((l) => l - 1); setCombo(0) }
    if (line.tokens[blank].key && due.has(`grammar:${line.pattern.id}`)) answer(`grammar:${line.pattern.id}`, ok, (SECONDS - left) * 1000, p, line.tokens[blank].text)
    setTimeout(() => { setHit(undefined); setLeft(SECONDS); setMood('idle'); setRound((r) => r + 1) }, ok ? 900 : 1600)
  }

  if (over && result) return <GameOver score={score} newBest={result.newBest} best={best} onExit={onExit} />
  return (
    <main className="mx-auto mt-2 max-w-2xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span>{'❤️'.repeat(Math.max(0, lives))}</span>
        <span>Skor {score}{combo > 1 && <span className="text-torii"> · combo ×{combo}</span>}{mult > 1 && <span className="text-anemo"> · buff ×{mult}</span>}</span>
        <span className={left <= 3 ? 'text-torii' : ''}>⏱ {left}s</span>
      </div>
      <div className={`${card} space-y-1 text-center`}>
        <Sentence tokens={line.tokens} blank={hit?.ok ? undefined : blank} className="text-2xl" />
        <p className="text-sm opacity-70">{line.tr}</p>
      </div>
      <div className="relative h-72 overflow-hidden rounded-3xl border-[3px] border-ink bg-[#e3f1ec]">
        {targets.map((t) => (
            <motion.button key={`${round}${t.p}`} onClick={() => shoot(t.p)} lang="ja"
              animate={hit?.p === t.p ? { scale: [1, 1.4, 0], rotate: 20 } : {}}
              className={`absolute cursor-crosshair rounded-full border-[3px] border-ink px-4 py-2 text-3xl font-bold shadow-[2px_2px_0_var(--color-ink)] ${hit && t.p === line.tokens[blank].text ? 'bg-anemo text-white' : hit?.p === t.p ? 'bg-torii text-white' : 'bg-white'}`}
              style={{ top: `${t.top}%`, animation: `drift ${t.dur}s ease-in-out ${t.delay}s infinite alternate` }}>{t.p}</motion.button>
          ))}
        <div className="absolute right-2 bottom-2"><Buddy mood={mood} size={70} /></div>
      </div>
      <button className="text-sm underline opacity-60" onClick={() => setLives(0)}>Berhenti</button>
    </main>
  )
}
