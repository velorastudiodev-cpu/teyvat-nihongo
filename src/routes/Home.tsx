import { useLiveQuery } from 'dexie-react-hooks'
import { Link, Navigate } from 'react-router-dom'
import { db } from '../data/db'
import { STAGE_INFO } from '../data/curriculum'
import { nextPlan, type Step } from '../engine/next'
import { today } from '../engine/srs/srs'
import { Companion } from '../ui/Companion'
import { Icon } from '../ui/Icon'
import { usePacePlan } from '../ui/usePacePlan'
import { REALMS } from '../ui/region/regions'
import { useHomeRegion } from '../ui/region/useRealm'
import { RaidenCard } from '../modules/raiden/RaidenCard'
import { greetingFor } from '../modules/raiden/lines'

export function Home() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const region = useHomeRegion(profile)
  const plan = useLiveQuery(() => (profile ? nextPlan(profile) : undefined), [profile])
  if (!profile) return null
  if (!profile.onboardedAt || !profile.stage) return <Navigate to="/onboarding" />
  const r = REALMS[region]
  const pct = plan && plan.total ? Math.round((plan.learned / plan.total) * 100) : 0

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-8 md:py-8">
      <section className="md:sticky md:top-20">
        <Companion id={profile.companionId} outfit={profile.outfit} size={230} greeting={greetingFor(profile)} />
      </section>

      <section className="space-y-4">
        {/* region title card */}
        <Link to="/map" className="g-panel block overflow-hidden p-0">
          <div className="relative bg-gradient-to-r from-deep to-primary px-5 py-3 text-white">
            <p className="font-title text-2xl font-bold tracking-[.18em]">{r.name.toUpperCase()}</p>
            <p className="text-xs opacity-85"><span lang="ja">{r.nameJa}</span> · {r.title} · {STAGE_INFO[profile.stage].label}</p>
            <Icon name={r.element === 'none' ? 'sparkle' : r.element} className="absolute top-1/2 right-4 h-12 w-12 -translate-y-1/2 opacity-30" />
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper-deep">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-display text-sm font-extrabold">{pct}%</span>
            <span className="flex items-center gap-1 text-sm font-bold text-primary">Peta <Icon name="chevronRight" className="h-4 w-4" /></span>
          </div>
        </Link>

        <RaidenCard profile={profile} show="events" />

        {/* the one next step */}
        {plan && <NextStep step={plan.main} />}

        {plan && plan.more.length > 0 && (
          <div className="g-panel p-2">
            <p className="px-3 pt-2 pb-1 font-display text-xs font-extrabold tracking-widest text-ink/60 uppercase">Setelah itu</p>
            <ul>
              {plan.more.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-soft/60">
                    <span className="g-chip h-9 w-9"><Icon name={s.icon} className="h-4.5 w-4.5" /></span>
                    <span className="min-w-0 flex-1">
                      <b className="block truncate font-display">{s.title}</b>
                      <span className="block truncate text-xs opacity-70">{s.desc}</span>
                    </span>
                    <span className="text-xs font-bold opacity-60">±{s.minutes} mnt</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <RaidenCard profile={profile} show="routine" />
        <TodayStrip />
        <PaceLine />
      </section>
    </div>
  )
}

function NextStep({ step }: { step: Step }) {
  return (
    <Link to={step.to} className="group g-panel relative block overflow-hidden p-5">
      <div className="pointer-events-none absolute -top-12 -right-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,var(--r-glow)_0%,transparent_68%)]" />
      <p className="font-display text-xs font-extrabold tracking-widest text-primary uppercase">Lanjutkan petualangan</p>
      <div className="mt-2 flex items-center gap-4">
        <span className="g-chip h-14 w-14 shrink-0"><Icon name={step.icon} className="h-7 w-7" /></span>
        <span className="min-w-0 flex-1">
          <b className="block font-display text-xl leading-tight font-black">{step.title}</b>
          <span className="block text-sm opacity-75">{step.desc}</span>
        </span>
      </div>
      <span className="g-btn mt-4 w-full bg-primary text-white">
        Mulai · ±{step.minutes} menit <Icon name="arrowRight" className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function TodayStrip() {
  const date = today()
  const claimed = useLiveQuery(() => db.unlocks.where('id').startsWith(`claim:${date}:`).count(), [date]) ?? 0
  const done = Math.min(4, claimed)
  return (
    <Link to="/daily" className="g-panel flex items-center gap-4 px-5 py-3.5">
      <span className="g-chip h-10 w-10"><Icon name="scroll" className="h-5 w-5" /></span>
      <span className="flex-1">
        <b className="font-display">Commission harian</b>
        <span className="mt-1 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-2.5 w-2.5 rotate-45 border border-gold ${i < done ? 'bg-geo' : 'bg-paper-deep'}`} />
          ))}
          <span className="ml-2 text-xs font-bold opacity-70">{done}/4{claimed > 4 ? ' · bonus diklaim' : ''}</span>
        </span>
      </span>
      <Icon name="chevronRight" className="h-5 w-5 opacity-60" />
    </Link>
  )
}

function PaceLine() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const p = usePacePlan(profile)
  if (!p || !profile) return null
  return (
    <Link to="/insight" className="flex items-center justify-between gap-3 rounded-2xl bg-night/80 px-4 py-2.5 text-sm text-paper">
      <span className="flex items-center gap-2"><Icon name="calendar" className="h-4.5 w-4.5 text-gold-soft" /> Estimasi lulus {profile.target}</span>
      <b className="font-display">{p.finish.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</b>
    </Link>
  )
}
