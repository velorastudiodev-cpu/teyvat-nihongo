import { useState } from 'react'
import { Icon } from '../../ui/Icon'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { READINGS } from '../../data/readings'
import { parse } from '../../engine/sentence'
import { grade, SECTION_NAME, TAG_LINK, TAG_NAME, type ExamSpec } from '../../engine/exam/exam'
import { Buddy } from '../../ui/Buddy'
import { btn, card } from '../../ui/kit'
import { Sentence } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { useChoiceKeys } from '../../ui/useChoiceKeys'
import { useDeadline } from '../../ui/useDeadline'
import type { Answers } from '../../engine/exam/record'

const MAX_PLAYS = 2

/** Runs an exam section by section with a timer per section; no feedback until the end, like the real JLPT. */
export function ExamRunner({ spec, onDone }: { spec: ExamSpec; onDone: (answers: Answers) => void }) {
  const [sec, setSec] = useState(0)
  const [started, setStarted] = useState(false)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [flags, setFlags] = useState<Set<string>>(new Set())
  const [plays, setPlays] = useState<Record<string, number>>({})
  const section = spec.sections[sec]
  const timer = useDeadline(undefined, () => finishSection())
  const left = Math.ceil(timer.left)

  function finishSection() {
    sfx.pop()
    timer.stop()
    if (sec + 1 < spec.sections.length) { setSec(sec + 1); setI(0); setStarted(false) }
    else onDone(answers)
  }

  const key = `${section.id}:${i}`
  const q = section.questions[i]
  const play = (k: string, text: string) => {
    if ((plays[k] ?? 0) >= MAX_PLAYS) return
    setPlays({ ...plays, [k]: (plays[k] ?? 0) + 1 })
    speak(text)
  }
  // listening questions play once on arrival
  const go = (j: number) => {
    setI(j)
    const next = section.questions[j]
    const k = `${section.id}:${j}`
    if (next.audio && !plays[k]) play(k, next.audio)
  }
  const begin = () => { setStarted(true); timer.start(section.minutes * 60); go(0) }

  useChoiceKeys(started ? section.questions[i].choices.length : 0, (n) => setAnswers((a) => ({ ...a, [`${section.id}:${i}`]: section.questions[i].choices[n] })))
  if (!started) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <p className="font-display text-sm font-bold uppercase tracking-widest text-anemo">{spec.kind === 'gate' ? 'Gate Exam' : 'JLPT Mock Test'} {spec.level} · bagian {sec + 1}/{spec.sections.length}</p>
      <h1 lang="ja" className="font-display text-4xl font-extrabold">{SECTION_NAME[section.id]}</h1>
      <p>{section.questions.length} soal · {section.minutes} menit. Jawaban baru dinilai setelah ujian selesai. Soal yang ragu bisa ditandai bendera.</p>
      {section.id === 'choukai' && <p className="text-sm opacity-70">Audio diputar otomatis dan boleh diulang maksimal {MAX_PLAYS}×. Teksnya tidak ditampilkan.</p>}
      <button className={`${btn} bg-primary text-white`} onClick={begin}>Mulai</button>
    </main>
  )

  const mm = `${Math.floor(Math.max(0, left) / 60)}:${String(Math.max(0, left) % 60).padStart(2, '0')}`
  const passage = q.passage ? READINGS.find((r) => r.id === q.passage) : undefined
  return (
    <main className="mx-auto mt-2 max-w-2xl space-y-3">
      <div className="flex items-center justify-between font-display font-bold">
        <span lang="ja">{SECTION_NAME[section.id]}</span>
        <span className={left <= 60 ? 'text-wrong' : ''}><Icon name="timer" className="h-4 w-4" /> {mm}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {section.questions.map((_, j) => {
          const k = `${section.id}:${j}`
          return <button key={j} onClick={() => go(j)} aria-label={`soal ${j + 1}`}
            className={`h-8 w-8 cursor-pointer rounded-lg text-sm font-bold ${j === i ? 'bg-ink text-paper' : answers[k] ? 'bg-anemo/30' : 'bg-paper-deep'} ${flags.has(k) ? 'ring-2 ring-wrong' : ''}`}>{j + 1}</button>
        })}
      </div>
      {passage && (
        <article className={`${card} max-h-64 overflow-y-auto`}>
          {passage.text.split('/').map((l, n) => <Sentence key={n} tokens={parse(l)} mode="auto" className="text-xl" />)}
        </article>
      )}
      <motion.div key={key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className={`${card} space-y-4`}>
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold">{i + 1}. {q.ask}</p>
          <button onClick={() => setFlags((f) => { const n = new Set(f); if (n.has(key)) n.delete(key); else n.add(key); return n })}
            className={`cursor-pointer text-xl ${flags.has(key) ? '' : 'opacity-30'}`} aria-label="tandai"><Icon name="flag" className="h-6 w-6 text-wrong" /></button>
        </div>
        {q.prompt && <p lang="ja" className="text-center text-4xl font-bold">{q.prompt}</p>}
        {q.audio && <div className="text-center"><button onClick={() => play(key, q.audio!)} disabled={(plays[key] ?? 0) >= MAX_PLAYS} className={`${btn} bg-paper text-xl`}><Icon name="speaker" className="h-7 w-7" /> {MAX_PLAYS - (plays[key] ?? 0)}×</button></div>}
        <div className="grid gap-2">
          {q.choices.map((c, n) => (
            <button key={c} lang={q.section === 'choukai' || q.tag === 'reading' || q.tag === 'kanji-meaning' ? undefined : 'ja'} onClick={() => setAnswers({ ...answers, [key]: c })}
              className={`cursor-pointer rounded-2xl border-2 px-4 py-2 text-left text-lg ${answers[key] === c ? 'border-ink bg-geo/40' : 'border-ink/15 bg-paper hover:border-ink/50'}`}>
              <b className="mr-2">{n + 1}</b>{c}
            </button>
          ))}
        </div>
      </motion.div>
      <div className="flex justify-between gap-2">
        <button disabled={i === 0} onClick={() => go(i - 1)} className={`${btn} bg-paper`}>← Sebelumnya</button>
        {i + 1 < section.questions.length
          ? <button onClick={() => go(i + 1)} className={`${btn} bg-paper`}>Berikutnya →</button>
          : <button onClick={finishSection} className={`${btn} bg-primary text-white`}><Icon name="check" className="h-4 w-4" /> Selesai bagian ini</button>}
      </div>
    </main>
  )
}

/** Score per section, weakest skills first (with where to train them), and every wrong answer explained. */
export function ExamReport({ spec, answers, extra }: { spec: ExamSpec; answers: Answers; extra?: React.ReactNode }) {
  const g = grade(spec, answers)
  const weak = Object.entries(g.tags).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])
  const wrong = spec.sections.flatMap((s) => s.questions.map((q, i) => ({ q, given: answers[`${s.id}:${i}`] }))).filter((x) => x.given !== x.q.answer)
  return (
    <main className="mx-auto mt-4 max-w-2xl space-y-4">
      <section className={`${card} space-y-3 text-center`}>
        <div className="flex justify-center"><Buddy mood={g.passed ? 'happy' : 'sad'} size={110} /></div>
        <p className={`font-display text-4xl font-extrabold ${g.passed ? 'text-anemo' : 'text-wrong'}`}>{g.passed ? '合格 Lulus!' : '不合格 Belum lulus'}</p>
        <p className="font-display text-2xl">{Math.round(g.ratio * 100)}%{spec.kind === 'gate' ? ' (minimal 70%)' : ' (minimal 55%, tiap bagian ≥ 33%)'}</p>
        {extra}
        <div className="space-y-2 text-left">
          {g.sections.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm"><span lang="ja" className="font-bold">{s.name}</span><span>{s.right}/{s.total}</span></div>
              <div className="h-3 overflow-hidden rounded bg-paper-deep" title={`${s.name}: ${s.right}/${s.total}`}><div className="h-full rounded bg-anemo" style={{ width: `${(s.right / s.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
      <section className={card}>
        <h2 className="font-display text-xl font-extrabold">Analisis kelemahan</h2>
        <ul className="mt-2 space-y-1">
          {weak.map(([tag, [r, t]]) => (
            <li key={tag} className="flex items-center justify-between gap-2">
              <span><Icon name={r / t < 0.6 ? 'warning' : 'check'} className={`h-4 w-4 ${r / t < 0.6 ? 'text-wrong' : 'text-anemo'}`} /> {TAG_NAME[tag]} <span className="text-sm opacity-60">{r}/{t}</span></span>
              {r / t < 0.6 && <Link to={TAG_LINK[tag]} className="text-sm font-bold underline">Latih →</Link>}
            </li>
          ))}
        </ul>
      </section>
      {wrong.length > 0 && (
        <section className={card}>
          <h2 className="font-display text-xl font-extrabold">Pembahasan ({wrong.length} salah)</h2>
          <p className="text-sm opacity-60">Item yang salah otomatis masuk Mistake Journal untuk Revenge Quest.</p>
          <ul className="mt-2 space-y-2">
            {wrong.map(({ q, given }, n) => (
              <li key={n} className="rounded-2xl bg-paper p-3">
                <p className="text-sm">{q.ask}</p>
                {(q.prompt || q.audio) && <p lang="ja" className="text-lg font-bold">{q.prompt ?? <><Icon name="speaker" className="h-4 w-4" /> {q.audio}</>}</p>}
                <p className="text-sm"><span className="text-wrong"><Icon name="cross" className="h-3.5 w-3.5" /> {given ?? '(kosong)'}</span> · <span className="font-bold text-anemo"><Icon name="check" className="h-3.5 w-3.5" /> {q.answer}</span></p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
