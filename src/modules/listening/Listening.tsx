import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../ui/Icon'
import { Link } from 'react-router-dom'
import { textOf } from '../../engine/sentence'
import { bumpDay } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { Choice } from '../../ui/Choice'
import { btn, card, sample } from '../../ui/kit'
import { Sentence } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { RATES, getRate, pref, setPref, speak } from '../../ui/speak'
import { sameSound } from '../../engine/sentence'
import { sentencePool, type Line } from '../../games/sentencePool'

const SESSION = 8

export function SpeedPicker() {
  const [rate, setRate] = useState<string>(() => pref('tts-rate', '1'))
  return (
    <div className="flex gap-1">
      {RATES.map((r) => (
        <button key={r} onClick={() => { setPref('tts-rate', r); setRate(r) }}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-bold ${r === rate ? 'bg-ink text-paper' : 'bg-paper-deep'}`}>{r}×</button>
      ))}
    </div>
  )
}

export function Listening() {
  const [lines, setLines] = useState<Line[]>()
  const [i, setI] = useState(0)
  const [right, setRight] = useState(0)
  const [all, setAll] = useState<Line[]>([])
  const start = async () => {
    const { lines: pool } = await sentencePool('endless')
    setAll(pool)
    setLines(sample(pool, SESSION))
    setI(0); setRight(0)
  }

  if (!lines) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4`}>
      <h1 className="flex items-center gap-3 font-display text-3xl font-black"><span className="g-chip h-12 w-12"><Icon name="headphones" className="h-6 w-6" /></span>Mendengar</h1>
      <p>Dengarkan kalimat, lalu pilih artinya atau tulis apa yang kamu dengar (dikte). Atur kecepatan suaranya:</p>
      <SpeedPicker />
      <button className={`${btn} w-full bg-primary text-white`} onClick={start}>Kuis dengar ({SESSION} soal)</button>
      <Link to="/games/listening-echo" className={`${btn} block w-full bg-anemo text-center text-white`}><Icon name="gamepad" className="h-4 w-4" /> Listening Echo</Link>
    </main>
  )
  if (i >= lines.length) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={120} /></div>
      <p className="font-display text-3xl font-extrabold">{right} / {lines.length} benar</p>
      <button className={`${btn} bg-primary text-white`} onClick={start}>Lagi</button>
    </main>
  )
  const line = lines[i]
  const done = (ok: boolean) => {
    if (ok) setRight(right + 1)
    bumpDay({ xp: ok ? 3 : 0 })
    setI(i + 1)
  }
  const title = `Listening · ${i + 1}/${lines.length}`
  return i % 2 === 0
    ? <Choice key={i} title={title} ask="Dengarkan. Apa artinya?" answer={line.tr}
        wrong={sample(all.filter((l) => l.tr !== line.tr).map((l) => l.tr), 3)}
        prompt={<PlayButton text={textOf(line.tokens)} auto />}
        explain={<Sentence tokens={line.tokens} className="text-xl" />} onAnswer={done} />
    : <Dictation key={i} title={title} line={line} onAnswer={done} />
}

export function PlayButton({ text, auto = false }: { text: string; auto?: boolean }) {
  useEffect(() => { if (auto) speak(text) }, [text, auto])
  return (
    <div className="flex justify-center gap-2">
      <button onClick={() => speak(text)} className={`${btn} bg-paper`} aria-label="putar"><Icon name="speaker" className="h-8 w-8" /></button>
      <button onClick={() => speak(text, Math.min(getRate(), 0.75) * 0.9)} className={`${btn} bg-paper`} aria-label="putar pelan"><Icon name="turtle" className="h-8 w-8" /></button>
    </div>
  )
}

function Dictation({ line, title, onAnswer }: { line: Line; title: string; onAnswer: (ok: boolean) => void }) {
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<boolean>()
  const input = useRef<HTMLInputElement>(null)
  const submit = () => {
    if (result !== undefined) return
    const ok = sameSound(typed, line.tokens)
    setResult(ok)
    if (ok) { sfx.good(); setTimeout(() => onAnswer(true), 900) } else sfx.bad()
  }
  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title}</span>
        <Buddy mood={result === undefined ? 'idle' : result ? 'happy' : 'sad'} size={70} />
      </div>
      <p className="text-sm opacity-70">Dikte: tulis yang kamu dengar (kana atau romaji)</p>
      <PlayButton text={textOf(line.tokens)} auto />
      <form onSubmit={(e) => { e.preventDefault(); submit() }} className="flex gap-2">
        <input ref={input} autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} disabled={result !== undefined} autoComplete="off" autoCapitalize="off"
          className="min-w-0 flex-1 rounded-full border-2 border-gold/70 bg-paper px-4 py-2 text-center text-xl" aria-label="dikte" />
        <button className={`${btn} bg-primary text-white`}>OK</button>
      </form>
      {result !== undefined && (
        <div className="space-y-2">
          <Sentence tokens={line.tokens} className="text-xl" />
          <p className="text-sm">{line.tr}</p>
          {!result && <button autoFocus onClick={() => onAnswer(false)} className={`${btn} bg-ink text-paper`}>Lanjut →</button>}
        </div>
      )}
    </main>
  )
}
