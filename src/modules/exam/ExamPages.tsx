import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../../data/db'
import { STAGE_INFO } from '../../data/curriculum'
import { REGIONS } from '../../characters'
import { Chibi } from '../../characters/Chibi'
import { buildExam, type ExamSpec } from '../../engine/exam/exam'
import { gateFor, passGate, GATE_REWARD } from '../../engine/exam/gate'
import { levelOpen } from '../kanji/content'
import { LEVELS } from '../../data/kanji'
import { btn, card } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { ExamReport, ExamRunner } from './ExamRunner'
import { recordExam, type Answers } from '../../engine/exam/record'

export function MockTest() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const history = useLiveQuery(() => db.exams.orderBy('at').reverse().limit(8).toArray(), []) ?? []
  const [spec, setSpec] = useState<ExamSpec>()
  const [answers, setAnswers] = useState<Answers>()
  if (!profile) return null
  if (spec && answers) return <ExamReport spec={spec} answers={answers} extra={<button className={`${btn} bg-paper`} onClick={() => { setSpec(undefined); setAnswers(undefined) }}>Kembali</button>} />
  if (spec) return <ExamRunner spec={spec} onDone={async (a) => { await recordExam(spec, a); sfx.win(); setAnswers(a) }} />
  return (
    <main className="space-y-4 py-4">
      <h1 className="font-display text-3xl font-extrabold">JLPT Mock Test</h1>
      <p className="opacity-80">Format resmi dalam versi ringkas: <span lang="ja">文字・語彙</span> (8 menit) → <span lang="ja">文法・読解</span> (14 menit) → <span lang="ja">聴解</span> (8 menit). Skor per bagian dan analisis kelemahan muncul di akhir.</p>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button key={l} disabled={!levelOpen(l, profile.stage)} onClick={() => setSpec(buildExam('mock', l))} className={`${btn} bg-torii text-white`}>
            {levelOpen(l, profile.stage) ? '' : '🔒 '}Mulai mock {l}
          </button>
        ))}
      </div>
      {history.length > 0 && (
        <section className={card}>
          <h2 className="font-display text-xl font-extrabold">Riwayat</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {history.map((h) => (
              <li key={h.id} className="flex justify-between gap-2">
                <span>{new Date(h.at).toLocaleDateString('id-ID')} · {h.kind === 'gate' ? 'Gate' : 'Mock'} {h.level}</span>
                <span>{h.sections.map((s) => `${s.right}/${s.total}`).join(' · ')} {h.passed ? '✅' : '❌'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

export function GateExam() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const [spec, setSpec] = useState<ExamSpec>()
  const [answers, setAnswers] = useState<Answers>()
  const [unlocked, setUnlocked] = useState<Awaited<ReturnType<typeof passGate>>>()
  if (!profile?.stage) return null
  const gate = gateFor(profile.stage)
  const region = REGIONS.find((r) => r.id === (gate?.region ?? STAGE_INFO[profile.stage!].regions[0]))!

  if (spec && answers) return <ExamReport spec={spec} answers={answers} extra={unlocked ? (
    <motion.div initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2 rounded-3xl bg-geo/30 p-4">
      <p className="font-display text-2xl font-extrabold">🗺️ {REGIONS.find((r) => r.id === unlocked.nextRegion)?.name} terbuka!</p>
      {unlocked.sensei && <div className="flex justify-center"><Chibi id={unlocked.sensei} expression="happy" size={120} /></div>}
      <p>Sensei baru bergabung{unlocked.reward ? ` · +${unlocked.reward} ✦` : ''}. Tahapmu sekarang {STAGE_INFO[unlocked.next].label}.</p>
      <Link to="/map" className={`${btn} inline-block bg-torii text-white`}>Lihat Skill Map →</Link>
    </motion.div>
  ) : <button className={`${btn} bg-paper`} onClick={() => { setSpec(undefined); setAnswers(undefined) }}>Coba lagi</button>} />
  if (spec) return <ExamRunner spec={spec} onDone={async (a) => {
    const g = await recordExam(spec, a)
    if (g.passed) { setUnlocked(await passGate(profile.stage!)); sfx.win() } else sfx.bad()
    setAnswers(a)
  }} />

  return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4 text-center`}>
      <p className="text-6xl">👹</p>
      <h1 className="font-display text-3xl font-extrabold">Gate Exam {region.name}</h1>
      {gate ? <>
        <p>Ujian kecil gaya JLPT ({gate.level}): 3 bagian, 16 soal, 15 menit. Lulus <b>≥ 70%</b> untuk membuka <b>{REGIONS.find((r) => r.id === gate.nextRegion)?.name}</b> ({STAGE_INFO[gate.next].label}).</p>
        <p className="font-display font-bold">Hadiah: ✦ {GATE_REWARD} + sensei region baru</p>
        <button className={`${btn} w-full bg-torii text-white`} onClick={() => setSpec(buildExam('gate', gate.level))}>Masuki gerbang ⚔️</button>
      </> : <p>Gate Exam terbuka saat kamu berada di tahap terakhir region ini. Tahapmu sekarang: <b>{STAGE_INFO[profile.stage].label}</b>.</p>}
      <Link to="/map" className="block text-sm underline">Kembali ke Skill Map</Link>
    </main>
  )
}
