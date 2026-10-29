import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { db } from '../data/db'
import { STAGES, STAGE_INFO, TARGETS, type Stage, type Target } from '../data/curriculum'
import { PLACEMENT } from '../data/placement'
import { nextStep, type Answer } from '../engine/placement/placement'
import { Chibi } from '../characters/Chibi'
import { REGIONS, type Expression } from '../characters'
import { btn, card, shuffle } from '../ui/kit'

const MINUTES = [10, 20, 30, 45, 60]

export function Onboarding() {
  const [target, setTarget] = useState<Target>('N1')
  const [targetDate, setTargetDate] = useState('')
  const [minutes, setMinutes] = useState(20)
  const [phase, setPhase] = useState<'goal' | 'test' | 'result'>('goal')
  const [placement, setPlacement] = useState<Stage>('hiragana')
  const [minDate] = useState(() => new Date().toISOString().slice(0, 10))
  const navigate = useNavigate()

  const finish = async () => {
    await db.profile.update('me', {
      target, minutesPerDay: minutes, targetDate: targetDate || undefined,
      placement, stage: placement, onboardedAt: Date.now(),
    })
    navigate('/map')
  }

  if (phase === 'goal') return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-6`}>
      <div className="flex items-center gap-4">
        <Chibi id="paimon" expression="happy" size={110} />
        <p className="font-display text-xl font-bold">Halo, Pengembara! Paimon bantu atur perjalananmu dulu, ya.</p>
      </div>
      <fieldset>
        <legend className="font-display font-bold">Target akhirmu</legend>
        <div className="mt-2 flex gap-2">
          {TARGETS.map((t) => (
            <button key={t} onClick={() => setTarget(t)} className={`${btn} ${t === target ? 'bg-torii text-white' : 'bg-paper'}`}>{t}</button>
          ))}
        </div>
        <p className="mt-1 text-sm opacity-70">Ini tujuan akhir, bukan titik awal. Titik awal ditentukan tes penempatan.</p>
      </fieldset>
      <fieldset>
        <legend className="font-display font-bold">Menit belajar per hari</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {MINUTES.map((m) => (
            <button key={m} onClick={() => setMinutes(m)} className={`${btn} ${m === minutes ? 'bg-anemo text-white' : 'bg-paper'}`}>{m}</button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="font-display font-bold">Target tanggal ujian (opsional)</span>
        <input type="date" value={targetDate} min={minDate} onChange={(e) => setTargetDate(e.target.value)}
          className="mt-2 block rounded-xl border-[3px] border-ink bg-paper px-3 py-1.5" />
      </label>
      <div className="flex flex-wrap gap-3">
        <button className={`${btn} bg-geo`} onClick={() => setPhase('test')}>Tes penempatan (±10 menit) →</button>
        <button className={`${btn} bg-paper`} onClick={() => { setPlacement('hiragana'); setPhase('result') }}>Aku masih nol, mulai dari hiragana</button>
      </div>
    </main>
  )

  if (phase === 'test') return <PlacementTest target={target} onDone={(p) => { setPlacement(p); setPhase('result') }} />

  const region = REGIONS.find((r) => r.id === STAGE_INFO[placement].regions[0])!
  return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-4 text-center`}>
      <div className="flex justify-center"><Chibi id="paimon" expression="happy" size={150} /></div>
      <p className="font-display text-sm font-bold uppercase tracking-widest text-anemo">Hasil penempatan</p>
      <h1 className="font-display text-4xl font-extrabold">Mulai dari {STAGE_INFO[placement].label}</h1>
      <p>Region awal: <b>{region.name}</b>. Target akhir: <b>{target}</b>.
        {placement !== 'hiragana' && <> Materi sebelum {STAGE_INFO[placement].label} dilewati karena kamu sudah menguasainya.</>}</p>
      <button className={`${btn} bg-torii text-white`} onClick={finish}>Mulai petualangan →</button>
    </main>
  )
}

function PlacementTest({ target, onDone }: { target: Target; onDone: (s: Stage) => void }) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [feedback, setFeedback] = useState<{ pick: string; correct: boolean }>()
  const order = useMemo(() => Object.fromEntries(STAGES.map((s) => [s, shuffle(PLACEMENT[s])])) as Record<Stage, typeof PLACEMENT[Stage]>, [])
  const step = nextStep(answers, target)
  const q = step.kind === 'ask' ? order[step.stage][step.n] : undefined
  const choices = useMemo(() => (q ? shuffle(q.choices) : []), [q])
  if (step.kind === 'done' || !q) return null

  const answer = (pick: string) => {
    if (feedback) return
    const correct = pick === q.answer
    setFeedback({ pick, correct })
    setTimeout(() => {
      setFeedback(undefined)
      const next = [...answers, { stage: step.stage, correct }]
      const s = nextStep(next, target)
      if (s.kind === 'done') onDone(s.placement)
      else setAnswers(next)
    }, 650)
  }
  const mood: Expression = !feedback ? 'idle' : feedback.correct ? 'happy' : 'sad'
  const progress = STAGES.indexOf(step.stage) / STAGES.indexOf(target)

  return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-5`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-display font-bold">Tes penempatan · {STAGE_INFO[step.stage].label}</span>
        <Chibi id="paimon" expression={mood} size={70} />
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-paper-deep">
        <motion.div className="h-full bg-anemo" animate={{ width: `${Math.max(4, progress * 100)}%` }} />
      </div>
      <motion.div key={answers.length} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 text-center">
        <p className="text-sm opacity-70">{q.ask}</p>
        <p lang="ja" className="text-4xl font-bold">{q.prompt}</p>
        <div className="grid grid-cols-2 gap-3">
          {choices.map((c) => {
            const shown = feedback && (c === q.answer ? 'bg-anemo text-white' : c === feedback.pick ? 'bg-torii text-white' : '')
            return (
              <motion.button key={c} whileTap={{ scale: .95 }} onClick={() => answer(c)}
                animate={feedback?.pick === c && !feedback.correct ? { x: [0, -6, 6, -4, 0] } : {}}
                className={`${btn} ${shown || 'bg-paper'} text-lg`}>{c}</motion.button>
            )
          })}
        </div>
        <button onClick={() => answer('')} className="cursor-pointer text-sm underline opacity-70">Tidak tahu</button>
      </motion.div>
    </main>
  )
}
