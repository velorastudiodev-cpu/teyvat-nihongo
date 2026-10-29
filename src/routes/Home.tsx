import { useLiveQuery } from 'dexie-react-hooks'
import { Link, Navigate } from 'react-router-dom'
import { db } from '../data/db'
import { getCharacter, REGIONS } from '../characters'
import { STAGE_INFO } from '../data/curriculum'
import { PaceCard } from '../ui/PaceCard'
import { streak } from '../engine/game/rules'
import { today } from '../engine/srs/srs'
import { Companion } from '../ui/Companion'

export function Home() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  if (!profile) return null
  if (!profile.onboardedAt || !profile.stage) return <Navigate to="/onboarding" />
  const c = getCharacter(profile.companionId)
  const info = STAGE_INFO[profile.stage]
  const region = REGIONS.find((r) => r.id === info.regions[0])!
  return (
    <main className="grid items-center gap-8 py-6 md:grid-cols-2">
      <Companion id={profile.companionId} outfit={profile.outfit} />
      <section className="space-y-4">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-anemo">{region.name} · {info.label}</p>
        <h1 className="font-display text-4xl font-extrabold leading-tight">
          ようこそ、旅人！<br /><span className="text-torii">Petualangan bahasa Jepangmu</span> dimulai di sini.
        </h1>
        <p className="opacity-80">{c?.name} menemanimu. Tap dia untuk dengar sapaannya!</p>
        <DailyStrip />
        <PaceCard profile={profile} />
        <div className="flex flex-wrap gap-2">
        <Link to="/learn" className="inline-block rounded-full border-[3px] border-ink bg-torii px-6 py-2 font-display text-lg font-bold text-white shadow-[3px_3px_0_var(--color-ink)] transition-transform active:translate-y-0.5 active:shadow-none">
          Belajar →
        </Link>
        <Link to="/map" className="inline-block rounded-full border-[3px] border-ink bg-geo px-6 py-2 font-display text-lg font-bold shadow-[3px_3px_0_var(--color-ink)] transition-transform active:translate-y-0.5 active:shadow-none">
          Skill Map
        </Link>
        </div>
      </section>
    </main>
  )
}

function DailyStrip() {
  const date = today()
  const days = useLiveQuery(() => db.days.toArray(), []) ?? []
  const claimed = useLiveQuery(() => db.unlocks.where('id').startsWith(`claim:${date}:`).count(), [date]) ?? 0
  const done = Math.min(4, claimed)
  return (
    <Link to="/daily" className="flex items-center justify-between gap-3 rounded-3xl border-[3px] border-ink bg-geo/30 px-5 py-3 font-display font-bold shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5">
      <span>📜 Commission {done}/4{claimed > 4 ? ' + bonus ✓' : ''}</span>
      <span>🔥 {streak(days, date)} hari</span>
      <span>Kerjakan →</span>
    </Link>
  )
}
