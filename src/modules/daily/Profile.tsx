import { Link } from 'react-router-dom'
import { Icon } from '../../ui/Icon'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { ACHIEVEMENTS } from '../../data/cosmetics'
import { addDays, rank, streak } from '../../engine/game/rules'
import { today } from '../../engine/srs/srs'
import { getCharacter } from '../../characters'
import { Chibi } from '../../characters/Chibi'
import { card } from '../../ui/kit'
import { Settings } from './Settings'
import { RealmPicker } from '../../ui/region/RealmPicker'
import { titleOf } from '../../engine/raiden'

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
    return xp === 0 ? 'bg-paper-deep' : xp < 30 ? 'bg-primary/30' : xp < 80 ? 'bg-primary/60' : 'bg-primary'
  }

  return (
    <main className="space-y-5 py-4">
      <section className={`${card} flex flex-wrap items-center gap-5`}>
        <div className="rounded-full bg-gradient-to-b from-soft to-paper-deep ring-2 ring-gold"><Chibi id={profile.companionId} expression="happy" size={110} outfit={profile.outfit} /></div>
        <div className="flex-1 space-y-2">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-primary">Adventure Rank</p>
          <p className="font-display text-4xl font-black">AR {r.ar}</p>
          {titleOf(profile.raiden) && <p className="inline-flex items-center gap-1 rounded-full bg-[#2c1f52] px-3 py-0.5 text-xs font-bold text-[#e3d0ff]"><Icon name="tomoe" className="h-3.5 w-3.5" />{titleOf(profile.raiden)}</p>}
          <div className="h-3 overflow-hidden rounded-full bg-paper-deep"><div className="h-full bg-geo" style={{ width: `${(r.into / r.need) * 100}%` }} /></div>
          <p className="text-sm">{r.into} / {r.need} XP ke AR {r.ar + 1} · total {total.toLocaleString('id-ID')} XP · streak {streak(days, date)} hari · companion: {getCharacter(profile.companionId)?.name}</p>
        </div>
        <div className="flex flex-col gap-1 text-right font-bold">
          <Link to="/insight" className="underline"><Icon name="chart" className="h-4 w-4" /> Insight</Link>
          <Link to="/exam" className="underline"><Icon name="exam" className="h-4 w-4" /> Mock Test</Link>
          <Link to="/map" className="underline"><Icon name="map" className="h-4 w-4" /> Peta</Link>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-xl font-extrabold">Kalender belajar</h2>
        <div className="mt-3 grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
          {cells.map((d) => <div key={d} title={`${d}: ${byDate.get(d)?.xp ?? 0} XP${byDate.get(d)?.frozen ? ' (freeze)' : ''}`} className={`aspect-square min-w-3 rounded ${shade(d)}`} />)}
        </div>
        <p className="mt-2 text-xs opacity-60">Warna = hari belajar (makin gelap makin banyak XP) · biru = diselamatkan Streak Freeze</p>
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="font-display text-xl font-black"><Icon name="palette" className="mr-1 h-5 w-5 text-primary" />Tema region</h2>
        <RealmPicker profile={profile} />
      </section>

      <Settings />

      <section className={card}>
        <h2 className="font-display text-xl font-extrabold">Achievement {got.length}/{ACHIEVEMENTS.length}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const done = got.some((g) => g.id === `ach:${a.id}`)
            return (
              <div key={a.id} className={`rounded-2xl p-3 ${done ? 'bg-geo/30' : 'bg-paper opacity-60'}`}>
                <p className="font-display font-bold"><Icon name={done ? 'trophy' : 'lock'} className={`mr-1 h-4 w-4 ${done ? 'text-geo' : 'opacity-50'}`} />{a.name}</p>
                <p className="text-sm">{a.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
      <footer className="g-glass rounded-2xl p-4 text-center text-xs leading-relaxed">
        Penggunaan pribadi, non-komersial. Karakter Genshin Impact © HoYoverse; gambar chibi dibuat ulang untuk aplikasi ini.<br />
        Data: <a className="underline" href="https://kanjivg.tagaini.net">KanjiVG</a> (CC BY-SA 3.0, Ulrich Apel) ·{' '}
        <a className="underline" href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project">KANJIDIC2</a> (EDRDG, CC BY-SA 4.0) ·{' '}
        kosakata JLPT <a className="underline" href="https://github.com/jamsinclair/open-anki-jlpt-decks">open-anki-jlpt-decks</a> (MIT)
      </footer>
    </main>
  )
}
