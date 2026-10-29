import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import type { Profile } from '../../data/db'
import { BOND_LEVELS, bondLevel, passedN1, phaseOf, talkFor, vowReady } from '../../engine/raiden'
import { Chibi } from '../../characters/Chibi'
import { Icon } from '../../ui/Icon'

/**
 * The questline's entry on the home screen. `events` shows only the big moments (her letter, the shrine
 * invitation) for the top of the page; `routine` shows today's talk or the bond meter further down.
 */
export function RaidenCard({ profile, show }: { profile: Profile; show: 'events' | 'routine' }) {
  const r = profile.raiden
  const phase = phaseOf(r)
  const n1 = useLiveQuery(passedN1, []) ?? false
  if (phase === 'hidden' || !r) return null
  const invited = vowReady(profile, n1)
  if ((show === 'events') !== (invited || phase === 'letter')) return null
  if (invited) return (
    <Link to="/raiden/vow" className="relative block overflow-hidden rounded-[20px] border border-[#f29ac2]/70 bg-gradient-to-br from-[#2a1638] via-[#6b2f5e] to-[#b0447c] p-4 text-white shadow-xl">
      <Icon name="sakura" className="absolute -top-6 -right-6 h-32 w-32 text-white/15" />
      <div className="relative flex items-center gap-3">
        <div className="-my-2 shrink-0"><Chibi id="raiden" expression="happy" size={84} /></div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-display text-xs font-extrabold tracking-widest text-[#ffd1e6] uppercase"><Icon name="ring" className="h-3.5 w-3.5" /> Rahasia terakhir</p>
          <b className="block font-display text-lg leading-tight">Undangan dari Kuil Narukami</b>
          <span className="block text-sm text-white/80">Yae Miko menunggumu dan Ei malam ini, di bawah Sakura Suci…</span>
        </div>
        <span className="g-btn shrink-0 bg-[#ffd1e6] px-3 py-1.5 text-sm text-[#2a1638]">Datang</span>
      </div>
    </Link>
  )
  const talk = talkFor(profile)
  const level = bondLevel(r.bond)
  const name = r.ei ? 'Ei' : 'Raiden Shogun'
  const [title, desc, cta] = phase === 'letter'
    ? ['Surat dari Tenshukaku', 'Kujou Sara membawa panggilan Shogun. Ujian Musou menantimu.', 'Buka surat']
    : talk
      ? [`${name} ingin bicara`, talk.title, 'Temui']
      : [`Ikatan dengan ${name} · Lv ${level}`, 'Sudah bicara hari ini. Kembali besok, atau beri dango.', 'Lihat']
  const next = BOND_LEVELS[level] ?? BOND_LEVELS.at(-1)!
  const prev = BOND_LEVELS[level - 1] ?? 0
  return (
    <Link to="/raiden" className="relative block overflow-hidden rounded-[20px] border border-[#b48cf0]/60 bg-gradient-to-br from-[#2c1f52] via-[#4b3390] to-[#7a52c4] p-4 text-white shadow-xl">
      <Icon name="tomoe" className="absolute -top-6 -right-6 h-32 w-32 text-white/10" />
      <div className="relative flex items-center gap-3">
        <div className="-my-2 shrink-0"><Chibi id="raiden" expression={talk || phase === 'letter' ? 'happy' : 'idle'} size={84} /></div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-display text-xs font-extrabold tracking-widest text-[#e3d0ff] uppercase"><Icon name="electro" className="h-3.5 w-3.5" /> Inazuma · rahasia</p>
          <b className="block font-display text-lg leading-tight">{title}</b>
          <span className="block text-sm text-white/75">{desc}</span>
          {phase === 'bond' && (
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full rounded-full bg-gradient-to-r from-[#d9c4ff] to-[#f7b6cf]" style={{ width: `${Math.min(100, ((r.bond - prev) / Math.max(1, next - prev)) * 100)}%` }} />
            </span>
          )}
        </div>
        <span className="g-btn shrink-0 bg-[#e3d0ff] px-3 py-1.5 text-sm text-[#2c1f52]">{cta}</span>
      </div>
    </Link>
  )
}
