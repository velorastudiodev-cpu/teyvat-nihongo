import { Link } from 'react-router-dom'
import type { Profile } from '../../data/db'
import { BOND_LEVELS, bondLevel, phaseOf, talkFor } from '../../engine/raiden'
import { Chibi } from '../../characters/Chibi'
import { Icon } from '../../ui/Icon'

/** The questline's entry on the home screen: her letter, today's conversation, or the bond meter. */
export function RaidenCard({ profile }: { profile: Profile }) {
  const r = profile.raiden
  const phase = phaseOf(r)
  if (phase === 'hidden' || !r) return null
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
