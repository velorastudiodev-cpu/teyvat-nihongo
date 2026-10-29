import { useLiveQuery } from 'dexie-react-hooks'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { db } from '../data/db'
import { gateFor } from '../engine/exam/gate'
import { tapSigil } from '../engine/raiden'
import { STAGES, STAGE_INFO, stageIndex, stageItems } from '../data/curriculum'
import { REGIONS } from '../characters'
import { Icon } from '../ui/Icon'
import { RegionScene } from '../ui/region/scenes'
import { REALMS } from '../ui/region/regions'
import { sfx } from '../ui/sfx'
import { toast } from '../ui/toastBus'

const SIGIL_MSG = {
  count: 'Lambang itu bergetar pelan…',
  hint: 'Petir menyambar, lalu sunyi. Shogun belum melihatmu. Berlatihlah 7 hari tanpa henti.',
  letter: 'Petir ungu menyambar! Sebuah surat dari Tenshukaku jatuh di hadapanmu…',
  none: '',
}

export function SkillMap() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const passed = useLiveQuery(() => db.unlocks.where('id').startsWith('gate:').primaryKeys(), []) ?? []
  if (!profile) return null
  if (!profile.stage || !profile.target) return <Navigate to="/onboarding" />
  const current = stageIndex(profile.stage)
  const gate = gateFor(profile.stage)
  const target = stageIndex(profile.target)

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <header className="g-glass rounded-2xl px-5 py-3">
        <h1 className="font-title text-2xl font-bold tracking-widest text-gold-soft">Peta Teyvat</h1>
        <p className="text-sm text-paper/80">Mulai dari <b>{STAGE_INFO[profile.placement ?? 'hiragana'].label}</b>, tujuan <b>{profile.target}</b>. Lulus Gate Exam untuk menyeberang ke region berikutnya.</p>
        <div className="mt-2 flex gap-4 text-sm font-bold text-gold-soft">
          <Link to="/exam" className="flex items-center gap-1 underline-offset-2 hover:underline"><Icon name="exam" className="h-4 w-4" />JLPT Mock Test</Link>
          <Link to="/onboarding" className="flex items-center gap-1 underline-offset-2 hover:underline"><Icon name="target" className="h-4 w-4" />Ubah target</Link>
        </div>
      </header>

      <ol className="relative space-y-4 before:absolute before:top-6 before:bottom-6 before:left-1/2 before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-gold/50">
        {REGIONS.map((r) => {
          const realm = REALMS[r.id]
          const stages = STAGES.filter((s) => STAGE_INFO[s].regions.includes(r.id))
          const open = stages.some((s) => stageIndex(s) <= current)
          const here = stages.some((s) => stageIndex(s) === current)
          const beyond = stages.every((s) => stageIndex(s) > target)
          const sigil = (
            <span className={`g-chip h-11 w-11 ${here ? 'ring-4 ring-glow' : ''}`}>
              <Icon name={realm.element === 'none' ? 'sparkle' : realm.element} className="h-6 w-6" />
            </span>
          )
          return (
            <li key={r.id} data-region={r.id} className={`relative ${beyond ? 'opacity-60' : ''}`}>
              <section className="g-panel overflow-hidden p-0">
                {/* a window onto the region's scenery */}
                <div className={`relative h-32 ${open ? '' : 'grayscale'}`} style={{ background: `linear-gradient(180deg, var(--r-sky-1), var(--r-sky-2))` }}>
                  <svg viewBox="0 260 1440 640" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
                    <RegionScene region={r.id} />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
                  <div className="absolute right-4 bottom-3 left-4 flex items-end justify-between gap-3 text-white">
                    <div className="min-w-0">
                      <p className="font-title text-2xl font-bold tracking-[.2em]">{realm.name.toUpperCase()}</p>
                      <p className="text-xs opacity-85"><span lang="ja">{realm.nameJa}</span> · {realm.title} · {r.level}</p>
                    </div>
                    {r.id === 'inazuma'
                      ? <motion.button whileTap={{ scale: .85, rotate: 30 }} aria-label="Lambang Inazuma" className="cursor-pointer" onClick={async () => {
                          const res = await tapSigil()
                          if (res === 'letter') sfx.win(); else if (res !== 'none') sfx.pop()
                          if (SIGIL_MSG[res]) toast(SIGIL_MSG[res], 'tomoe')
                        }}>{sigil}</motion.button>
                      : sigil}
                  </div>
                  {!open && <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-night/70 px-2.5 py-1 text-xs font-bold text-white"><Icon name="lock" className="h-3.5 w-3.5" />Terkunci</span>}
                  {here && <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">Kamu di sini</span>}
                </div>

                <ol className="space-y-1.5 p-3">
                  {stages.map((s) => {
                    const i = stageIndex(s)
                    const state = i < current ? 'done' : i === current ? 'now' : 'locked'
                    const parts = STAGE_INFO[s].regions   // N1 is split over Fontaine and Natlan
                    const part = parts.length > 1 ? ` · bagian ${parts.indexOf(r.id) + 1}/${parts.length}` : ''
                    const skipped = state === 'done' && i < stageIndex(profile.placement ?? 'hiragana')
                    return (
                      <li key={s} className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${state === 'now' ? 'bg-soft ring-1 ring-primary/40' : ''}`}>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${state === 'done' ? 'bg-anemo text-white' : state === 'now' ? 'g-chip' : 'bg-paper-deep text-ink/50'}`}>
                          <Icon name={state === 'done' ? 'check' : state === 'now' ? 'play' : 'lock'} className="h-4 w-4" />
                        </span>
                        <span className="flex-1 font-display font-bold">{STAGE_INFO[s].label}{part}</span>
                        <span className="text-xs opacity-70">{skipped ? 'dilewati' : `${Math.round(stageItems(s) / parts.length).toLocaleString('id-ID')} item`}</span>
                      </li>
                    )
                  })}
                  {!beyond && stages.includes('N1') && (
                    <li><Link to="/exam" className="g-btn w-full bg-geo"><Icon name="medal" /> Ujian akhir: JLPT N1 Mock Test</Link></li>
                  )}
                  {!beyond && !stages.includes('N1') && (passed.includes(`gate:${r.id}`)
                    ? <li className="flex items-center gap-2 rounded-2xl bg-anemo/15 px-3 py-2 font-display font-bold text-anemo"><Icon name="check" /> Gate lulus</li>
                    : gate?.region === r.id
                      ? <li><Link to="/gate" className="g-btn w-full bg-geo"><Icon name="door" /> Gate Exam · lulus ≥70%</Link></li>
                      : <li className="flex items-center gap-2 rounded-2xl border border-dashed border-ink/30 px-3 py-2 font-display font-bold opacity-60"><Icon name="lock" className="h-4 w-4" /> Gate Exam</li>)}
                </ol>
              </section>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
