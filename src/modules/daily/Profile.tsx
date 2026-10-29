import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { ACHIEVEMENTS } from '../../data/cosmetics'
import { addDays, rank, streak } from '../../engine/game/rules'
import { today } from '../../engine/srs/srs'
import { getCharacter } from '../../characters'
import { Chibi } from '../../characters/Chibi'
import { card } from '../../ui/kit'
import { Settings } from './Settings'

const WEEKS = 16

export function ProfilePage() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const days = useLiveQuery(() => db.days.toArray(), []) ?? []
  const got = useLiveQuery(() => db.unlocks.where('id').startsWith('ach:').toArray(), []) ?? []
  if (!profile) return null
  const total = days.reduce((n, d) => n + d.xp, 0)
  const r = rank(total)
  const byDate = new Map(days.map((d) => [d.date, d]))
  const date = today()
  // heatmap: columns are weeks (Mon→Sun), the last column holds this week
  const start = addDays(date, -((new Date(`${date}T12:00:00`).getDay() + 6) % 7) - (WEEKS - 1) * 7)
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => addDays(start, i))
  const shade = (d: string) => {
    const x = byDate.get(d)
    if (d > date) return 'bg-transparent'
    if (x?.frozen) return 'bg-[#7cc6de]'
    const xp = x?.xp ?? 0
    return xp === 0 ? 'bg-paper-deep' : xp < 30 ? 'bg-anemo/30' : xp < 80 ? 'bg-anemo/60' : 'bg-anemo'
  }

  return (
    <main className="space-y-5 py-4">
      <section className={`${card} flex flex-wrap items-center gap-5`}>
        <Chibi id={profile.companionId} expression="happy" size={110} outfit={profile.outfit} />
        <div className="flex-1 space-y-2">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-anemo">Adventure Rank</p>
          <p className="font-display text-4xl font-extrabold">AR {r.ar}</p>
          <div className="h-3 overflow-hidden rounded-full bg-paper-deep"><div className="h-full bg-geo" style={{ width: `${(r.into / r.need) * 100}%` }} /></div>
          <p className="text-sm">{r.into} / {r.need} XP ke AR {r.ar + 1} · total {total.toLocaleString('id-ID')} XP · 🔥 {streak(days, date)} hari · companion: {getCharacter(profile.companionId)?.name}</p>
        </div>
        <div className="flex flex-col gap-1 text-right font-bold">
          <Link to="/insight" className="underline">📊 Insight →</Link>
          <Link to="/exam" className="underline">📝 Mock Test →</Link>
          <Link to="/map" className="underline">🗺️ Skill Map →</Link>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-xl font-extrabold">Kalender belajar</h2>
        <div className="mt-3 grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
          {cells.map((d) => <div key={d} title={`${d}: ${byDate.get(d)?.xp ?? 0} XP${byDate.get(d)?.frozen ? ' (freeze)' : ''}`} className={`aspect-square min-w-3 rounded ${shade(d)}`} />)}
        </div>
        <p className="mt-2 text-xs opacity-60">Hijau = hari belajar (makin gelap makin banyak XP) · biru = diselamatkan Streak Freeze</p>
      </section>

      <Settings />

      <section className={card}>
        <h2 className="font-display text-xl font-extrabold">Achievement {got.length}/{ACHIEVEMENTS.length}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const done = got.some((g) => g.id === `ach:${a.id}`)
            return (
              <div key={a.id} className={`rounded-2xl p-3 ${done ? 'bg-geo/30' : 'bg-paper opacity-60'}`}>
                <p className="font-display font-bold">{done ? '🏆' : '🔒'} {a.name}</p>
                <p className="text-sm">{a.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
