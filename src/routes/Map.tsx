import { useLiveQuery } from 'dexie-react-hooks'
import { Link, Navigate } from 'react-router-dom'
import { db } from '../data/db'
import { gateFor } from '../engine/exam/gate'
import { STAGES, STAGE_INFO, stageIndex, stageItems } from '../data/curriculum'
import { characters, REGIONS } from '../characters'
import { Chibi } from '../characters/Chibi'
import { DESIGNS } from '../characters/designs'

export function SkillMap() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const passed = useLiveQuery(() => db.unlocks.where('id').startsWith('gate:').primaryKeys(), []) ?? []
  if (!profile) return null
  if (!profile.stage || !profile.target) return <Navigate to="/onboarding" />
  const current = stageIndex(profile.stage)
  const gate = gateFor(profile.stage)
  const target = stageIndex(profile.target)

  return (
    <main className="space-y-5 py-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Skill Map</h1>
          <p>Mulai dari <b>{STAGE_INFO[profile.placement ?? 'hiragana'].label}</b> → tujuan <b>{profile.target}</b></p>
        </div>
        <div className="flex gap-3 text-sm font-bold">
          <Link to="/exam" className="underline">JLPT Mock Test</Link>
          <Link to="/onboarding" className="underline">Ubah target / ulang tes</Link>
        </div>
      </div>

      {REGIONS.map((r) => {
        const stages = STAGES.filter((s) => STAGE_INFO[s].regions.includes(r.id))
        const open = stages.some((s) => stageIndex(s) <= current)
        const beyond = stages.every((s) => stageIndex(s) > target)
        const senseis = characters.filter((c) => c.region === r.id && DESIGNS[c.id]).slice(0, 3)
        return (
          <section key={r.id} className={`rounded-3xl border-[3px] p-5 ${open ? 'border-ink bg-white shadow-[4px_4px_0_var(--color-ink)]' : 'border-dashed border-ink/30 bg-paper-deep/60'} ${beyond ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold">
                {open ? '' : '🔒 '}{r.name} <span className="text-sm font-bold opacity-60">{r.level}</span>
              </h2>
              <div className="flex">{senseis.map((c) => <Chibi key={c.id} id={c.id} size={56} expression={open ? 'idle' : 'sleep'} />)}</div>
            </div>
            <ol className="mt-3 flex flex-wrap items-center gap-2">
              {stages.map((s) => {
                const i = stageIndex(s)
                const state = i < current ? 'done' : i === current ? 'now' : 'locked'
                const parts = STAGE_INFO[s].regions   // N1 is split over Fontaine and Natlan
                const part = parts.length > 1 ? ` · bagian ${parts.indexOf(r.id) + 1}/${parts.length}` : ''
                return (
                  <li key={s} className={`rounded-2xl px-4 py-2 font-display font-bold ${state === 'now' ? 'bg-torii text-white' : state === 'done' ? 'bg-anemo text-white' : 'bg-paper-deep opacity-70'}`}>
                    {state === 'done' ? '✓ ' : state === 'locked' ? '🔒 ' : '▶ '}{STAGE_INFO[s].label}{part}
                    <span className="ml-2 text-xs font-normal">{state === 'done' && i < stageIndex(profile.placement ?? 'hiragana') ? 'dilewati' : `${Math.round(stageItems(s) / parts.length).toLocaleString('id-ID')} item`}</span>
                  </li>
                )
              })}
              {!beyond && stages.includes('N1') && (
                <li><Link to="/exam" className="block rounded-2xl border-[3px] border-ink bg-geo px-4 py-2 font-display font-bold shadow-[2px_2px_0_var(--color-ink)]">🎓 Ujian akhir: JLPT N1 Mock Test →</Link></li>
              )}
              {!beyond && !stages.includes('N1') && (passed.includes(`gate:${r.id}`)
                ? <li className="rounded-2xl bg-anemo px-4 py-2 font-display font-bold text-white">✓ Gate lulus</li>
                : gate?.region === r.id
                  ? <li><Link to="/gate" className="block rounded-2xl border-[3px] border-ink bg-geo px-4 py-2 font-display font-bold shadow-[2px_2px_0_var(--color-ink)]">👹 Gate Exam ≥70% →</Link></li>
                  : <li className="rounded-2xl border-2 border-dashed border-ink/40 px-4 py-2 font-display font-bold opacity-70">🔒 Gate Exam</li>)}
            </ol>
          </section>
        )
      })}
    </main>
  )
}
