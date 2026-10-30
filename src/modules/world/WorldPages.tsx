import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { db, type Profile } from '../../data/db'
import { ABYSS, CELESTIA, FATUI, HARBINGERS, LOAN, OATH, SHADES, SINNERS, type Harbinger, type ShadeId, type SinnerId } from '../../data/lore'
import { DRAIN, riftPool, seal, sealed, stageOf, totalStages, xpMult, XP_EROSION, SEAL_HOURS } from '../../engine/abyss'
import { activeJudgments, blessingOf, blessingStatus, claimBlessing, newLessonsLocked, takeNewJudgment } from '../../engine/celestia'
import { claim, earn, spend } from '../../engine/game/economy'
import { DUELISTS, duelOpen, loanProgress, oathProgress, swearOath, takeLoan, winDuel } from '../../engine/fatui'
import { Dialogue } from '../../ui/Dialogue'
import { Icon } from '../../ui/Icon'
import { btn, card } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toastBus'
import { setRealmOverride } from '../../ui/region/override'
import type { Realm } from '../../ui/region/regions'
import { learnedPool, type Q } from '../daily/pools'
import { Battle, Emblem, type Rules } from './Battle'
import { diagnose } from '../../engine/hexen'

const FATUI_COLOR = '#5aa9d6'
const ABYSS_COLOR = '#6b2fa0'
const SHADE_COLOR: Record<ShadeId, string> = { ronova: '#7a2f46', istaroth: '#2f5fa8', naberius: '#3f8f4a', asmoday: '#b08a2e' }
const STAGE_NAME = ['Tertidur', 'Bisikan', 'Erosi', 'Korupsi']

function useRealm(realm: Realm) {
  useEffect(() => { setRealmOverride(realm); return () => setRealmOverride(undefined) }, [realm])
}

function Header({ icon, color, title, ja, about, dark }: { icon: Parameters<typeof Emblem>[0]['icon']; color: string; title: string; ja: string; about: string; dark?: boolean }) {
  return (
    <header className="g-glass flex items-start gap-4 rounded-2xl p-4">
      <Emblem icon={icon} color={color} size={56} dark={dark} />
      <div>
        <h1 className="font-title text-2xl font-bold tracking-widest text-gold-soft">{title}</h1>
        <p lang="ja" className="text-sm text-paper/80">{ja}</p>
        <p className="mt-1 text-sm text-paper/85">{about}</p>
      </div>
    </header>
  )
}

/* ── Fatui ──────────────────────────────────────────────────────────────────────────────── */

const harbingerEmblem = (h: Harbinger, size = 56) => (
  <Emblem icon="snowmask" color={h.status === 'aktif' ? FATUI_COLOR : '#6b7280'} label={h.seat} size={size} />
)

export function FatuiPage() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const loan = useLiveQuery(() => loanProgress(profile), [profile])
  const oath = useLiveQuery(() => oathProgress(profile), [profile])
  if (!profile) return null
  const beaten = profile.fatui?.beaten ?? []
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4" data-region="fontaine">
      <Header icon="snowmask" color={FATUI_COLOR} title="ORGANISASI FATUI" ja="ファデュイ執行官" about={FATUI.about} />

      <section className={`${card} space-y-3`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Sebelas Harbinger</h2>
        <ul className="space-y-2">
          {HARBINGERS.map((h) => {
            const open = h.duel && duelOpen(profile, h.id)
            const won = beaten.includes(h.id)
            return (
              <li key={h.id} className={`flex items-center gap-3 rounded-2xl p-2.5 ${h.duel ? 'bg-soft/60' : 'opacity-75'}`}>
                {harbingerEmblem(h, 48)}
                <div className="min-w-0 flex-1">
                  <p className="font-display font-black leading-tight">{h.name} <span className="text-sm font-bold opacity-70">· {h.alias}</span></p>
                  <p className="text-xs opacity-80">{h.fact}</p>
                  {h.duel && <p className="mt-0.5 text-xs font-bold text-primary">{h.duel.twist}</p>}
                </div>
                {h.duel
                  ? won ? <span className="flex items-center gap-1 text-sm font-bold text-anemo"><Icon name="check" className="h-4 w-4" />Kalah</span>
                    : open ? <Link to={`/fatui/duel/${h.id}`} className={`${btn} bg-primary px-3 py-1.5 text-sm text-white`}><Icon name="swords" className="h-4 w-4" />Duel</Link>
                      : <span className="flex items-center gap-1 text-xs font-bold opacity-60"><Icon name="lock" className="h-3.5 w-3.5" />kalahkan kursi sebelumnya</span>
                  : <span className="rounded-full bg-paper-deep px-2 py-0.5 text-xs font-bold">{h.status}</span>}
              </li>
            )
          })}
        </ul>
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Kontrak (rekan)</h2>
        <div className="rounded-2xl bg-paper p-3">
          <p className="font-display font-black"><Icon name="scale" className="mr-1 h-5 w-5 text-primary" />Pinjaman Pantalone</p>
          <p className="text-sm">Terima {LOAN.amount} Kirameki sekarang. Lunasi dengan {LOAN.xpToRepay} XP belajar dalam {LOAN.days} hari, atau Pantalone menagih {LOAN.penalty} Kirameki.</p>
          {loan ? <p className="mt-1 text-sm font-bold">Berjalan: {loan.xp}/{LOAN.xpToRepay} XP · jatuh tempo {loan.due}</p>
            : <button className={`${btn} mt-2 bg-deep text-sm text-white`} onClick={async () => { if (await takeLoan()) { sfx.good(); toast(`+${LOAN.amount} Kirameki dari Pantalone. "Jangan terlambat."`, 'scale') } }}>Tanda tangani</button>}
          {profile.fatui?.loan?.result && <p className="mt-1 text-xs opacity-70">Kontrak terakhir: {profile.fatui.loan.result === 'repaid' ? 'lunas' : `ditagih ${profile.fatui.loan.collected} Kirameki`}</p>}
        </div>
        <div className="rounded-2xl bg-paper p-3">
          <p className="font-display font-black"><Icon name="flame" className="mr-1 h-5 w-5 text-primary" />Sumpah Hearth House (Arlecchino)</p>
          <p className="text-sm">Mulai besok, belajar minimal {OATH.xpPerDay} XP setiap hari selama {OATH.days} hari. Tepati, dan Father memberi {OATH.reward} Kirameki.</p>
          {oath ? (
            <div className="mt-2 flex gap-1">{oath.days.map((d) => (
              <span key={d.date} title={d.date} className={`flex h-7 flex-1 items-center justify-center rounded-lg text-xs font-bold ${d.kept ? 'bg-anemo text-white' : d.past ? 'bg-wrong text-white' : 'bg-paper-deep'}`}>{d.date.slice(8)}</span>
            ))}</div>
          ) : <button className={`${btn} mt-2 bg-deep text-sm text-white`} onClick={async () => { if (await swearOath()) toast('Sumpah diterima. "Buktikan dirimu, anakku."', 'flame') }}>Bersumpah</button>}
          {profile.fatui?.oath?.result && <p className="mt-1 text-xs opacity-70">Sumpah terakhir: {profile.fatui.oath.result === 'kept' ? 'ditepati' : 'dilanggar'}</p>}
        </div>
      </section>
    </div>
  )
}

function rulesFor(h: Harbinger): Rules {
  const d = h.duel!
  const base: Rules = { hp: d.hp, lives: d.lives, seconds: d.seconds }
  switch (d.rule) {
    case 'foul-legacy': return { ...base, wrongCost: (hp) => (hp < d.hp / 2 ? 2 : 1) }
    case 'equal-exchange': return { ...base, onAnswer: (right) => { void (right ? earn(3) : spend(5)) } }
    case 'discipline': return { ...base, damage: (b) => b * 1.2 }
    case 'segments': return { ...base, revive: 0.4 }
    case 'honor': return { ...base, damage: () => 25 }
    case 'jester': return { ...base, revive: 0.3 }
    default: return base
  }
}

export function FatuiDuel() {
  const { id } = useParams()
  const h = DUELISTS.find((x) => x.id === id)
  const profile = useLiveQuery(() => db.profile.get('me'))
  const [pool, setPool] = useState<Q[]>()
  const [phase, setPhase] = useState<'intro' | 'fight' | 'won' | 'lost'>('intro')
  const [reward, setReward] = useState(0)
  useEffect(() => { learnedPool().then((p) => setPool(p.sort(() => Math.random() - 0.5))) }, [])
  if (!h || !profile || !pool) return null
  if (!duelOpen(profile, h.id)) return <Locked text="Kalahkan Harbinger di kursi sebelumnya dulu." back="/fatui" />
  if (phase === 'intro') return (
    <main className="mx-auto mt-4 max-w-md space-y-4 text-center">
      <div className="flex justify-center">{harbingerEmblem(h, 120)}</div>
      <Dialogue name={`${h.name} · ${h.alias}`} ja={h.taunt!.ja} tr={h.taunt!.tr} />
      <p className="g-panel p-3 text-sm"><b>Aturan duel:</b> {h.duel!.twist} · HP {h.duel!.hp} · {h.duel!.lives} nyawa · hadiah pertama {h.duel!.reward} Kirameki</p>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => setPhase('fight')}><Icon name="swords" /> Mulai duel</button>
    </main>
  )
  if (phase === 'fight') return <Battle name={`${h.name} · ${h.alias}`} emblem={harbingerEmblem(h)} pool={pool} rules={rulesFor(h)}
    onEnd={async (won) => { if (won) { setReward(await winDuel(h.id)); sfx.win(); setPhase('won') } else setPhase('lost') }} />
  return (
    <main className="mx-auto mt-4 max-w-md space-y-4 text-center">
      <div className="flex justify-center">{harbingerEmblem(h, 110)}</div>
      {phase === 'won'
        ? <Dialogue name={`${h.name} · ${h.alias}`} ja={h.defeat!.ja} tr={`${h.defeat!.tr}${reward ? ` (+${reward} Kirameki)` : ''}`} />
        : <Dialogue name={`${h.name} · ${h.alias}`} ja="まだまだだな。" tr="Masih jauh dari cukup. (Coba lagi setelah review.)" />}
      <Link to="/fatui" className={`${btn} w-full bg-primary text-white`}>Kembali ke Fatui</Link>
    </main>
  )
}

/* ── The Abyss ──────────────────────────────────────────────────────────────────────────── */

export function AbyssPage() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  useRealm('abyss')
  if (!profile) return null
  const total = totalStages(profile)
  const drain = SINNERS.reduce((n, s) => n + DRAIN[stageOf(profile, s.id)], 0)
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4" data-region="euthymia">
      <Header icon="abyss" color={ABYSS_COLOR} title="ANCAMAN ABYSS" ja="カーンルイアの五大罪人" about={ABYSS.about} dark />
      <section className="g-glass grid grid-cols-3 gap-2 rounded-2xl p-3 text-center text-paper">
        <div><p className="font-display text-2xl font-black">{total}<span className="text-sm opacity-70">/15</span></p><p className="text-xs opacity-75">tingkat korupsi</p></div>
        <div><p className="font-display text-2xl font-black">−{drain}</p><p className="text-xs opacity-75">Kirameki / hari</p></div>
        <div><p className="font-display text-2xl font-black">{xpMult(profile) < 1 ? `−${Math.round((1 - XP_EROSION.mult) * 100)}%` : '0%'}</p><p className="text-xs opacity-75">XP terserap</p></div>
      </section>
      <ul className="space-y-3">
        {SINNERS.map((s) => {
          const st = stageOf(profile, s.id)
          const isSealed = sealed(profile, s.id)
          return (
            <li key={s.id} className={`${card} space-y-2`}>
              <div className="flex items-center gap-3">
                <Emblem icon={s.icon} color={st ? ABYSS_COLOR : '#4b5563'} size={52} dark />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-black leading-tight">{s.name} <span className="text-sm font-bold opacity-70">· {s.title} · {s.attribute}</span></p>
                  <p className="text-xs opacity-80">{s.fact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => <span key={i} className={`h-2 flex-1 rounded-full ${st >= i ? 'bg-gradient-to-r from-[#3b1663] to-[#a24bd6]' : 'bg-paper-deep'}`} />)}
                <span className="w-20 text-right text-xs font-bold">{isSealed ? 'Tersegel' : STAGE_NAME[st]}</span>
              </div>
              <p className="text-sm">Menyerap dari <b>{s.feeds}</b>.</p>
              {st > 0 && <Dialogue name={`${s.name} · ${s.title}`} ja={s.voice.ja} tr={s.voice.tr} />}
              <div className="flex flex-wrap gap-2">
                <Link to={s.purify.to} className={`${btn} bg-paper text-sm`}><Icon name="sparkle" className="h-4 w-4" />{s.purify.text}</Link>
                {st > 0 && <Link to={`/abyss/rift/${s.id}`} className={`${btn} bg-[#3b1663] text-sm text-white`}><Icon name="abyss" className="h-4 w-4" />Abyss Rift · segel {SEAL_HOURS} jam</Link>}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="g-glass rounded-2xl p-3 text-xs text-paper/85">Tahap: Bisikan (peringatan) → Erosi (−10 Kirameki/hari) → Korupsi (−20 Kirameki/hari dan friendship companion −5/hari). Total ≥6 tahap: XP −20%. Materi, review, dan riwayatmu tidak pernah dihapus. Bereskan penyebabnya, atau menangkan Abyss Rift untuk menyegel Pendosa itu.</p>
    </div>
  )
}

export function AbyssRift() {
  const { id } = useParams()
  const s = SINNERS.find((x) => x.id === id)
  const navigate = useNavigate()
  const [pool, setPool] = useState<Q[]>()
  const [result, setResult] = useState<'won' | 'lost'>()
  useRealm('abyss')
  useEffect(() => { if (s) riftPool(s.id as SinnerId).then(setPool) }, [s])
  if (!s || !pool) return null
  const emblem = <Emblem icon={s.icon} color={ABYSS_COLOR} size={56} dark />
  if (result) return (
    <main className="mx-auto mt-4 max-w-md space-y-4 text-center">
      <div className="flex justify-center"><Emblem icon={s.icon} color={result === 'won' ? '#4b5563' : ABYSS_COLOR} size={110} dark /></div>
      <Dialogue name={`${s.name} · ${s.title}`} ja={result === 'won' ? 'ぐっ……封じられるとは……' : s.voice.ja}
        tr={result === 'won' ? `Ugh… aku tersegel… (${s.name} tersegel ${SEAL_HOURS} jam, +40 Kirameki)` : `${s.voice.tr} (Rift gagal ditutup)`} />
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => navigate('/abyss')}>Kembali</button>
    </main>
  )
  return <Battle name={`Abyss Rift · ${s.name}`} emblem={emblem} pool={pool} rules={{ hp: 180, lives: 3 }}
    onEnd={async (won) => { if (won) { await seal(s.id as SinnerId); await claim(`rift:${s.id}:${new Date().toLocaleDateString('sv')}`, 40); sfx.win() } setResult(won ? 'won' : 'lost') }} />
}

/* ── Celestia and the Four Shades ───────────────────────────────────────────────────────── */

const shadeEmblem = (id: ShadeId, size = 52) => <Emblem icon={SHADES.find((s) => s.id === id)!.icon} color={SHADE_COLOR[id]} size={size} />
const left = (until?: number) => (until === undefined ? 'sampai penyebabnya dibereskan' : `${Math.max(1, Math.round((until - Date.now()) / 3_600_000))} jam lagi`)

export function CelestiaPage() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const status = useLiveQuery(() => blessingStatus(), [profile])
  useRealm('celestia')
  if (!profile) return null
  const judgments = activeJudgments(profile)
  const bless = blessingOf(profile)
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <Header icon="halo" color="#c9a96b" title="CELESTIA" ja="天空の島・四影" about={CELESTIA.about} />

      {judgments.map((j) => {
        const s = SHADES.find((x) => x.id === j.shade)!
        return (
          <section key={j.at} className="space-y-2 rounded-[20px] border border-wrong/50 bg-gradient-to-br from-[#2a1638] to-[#5c1f2e] p-4 text-white shadow-xl">
            <div className="flex items-center gap-3">{shadeEmblem(s.id, 48)}<div><p className="font-display font-black">{s.punishment.name}</p><p className="text-sm text-white/80">{s.punishment.text} · {left(j.until)}</p></div></div>
            <p className="text-xs text-white/70">Pelanggaran: {j.reason}</p>
          </section>
        )
      })}

      <section className={`${card} space-y-3`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Berkat mingguan</h2>
        {bless ? <p className="rounded-2xl bg-soft p-3 text-sm"><Icon name="sparkle" className="mr-1 h-4 w-4 text-primary" /><b>{SHADES.find((s) => s.id === bless)!.blessing.name}</b> aktif: {SHADES.find((s) => s.id === bless)!.blessing.text}.</p> : null}
        {status && (status.ready
          ? <p className="text-sm">Tatananmu terjaga minggu ini. Pilih satu berkat:</p>
          : <p className="text-sm opacity-80">{status.claimed ? 'Berkat minggu ini sudah diterima.' : `Syarat: belajar ≥5 dari 7 hari terakhir (sekarang ${status.studied}) tanpa hukuman dalam 7 hari${status.clean ? '' : ' (ada hukuman minggu ini)'}.`}</p>)}
        <div className="grid gap-2 sm:grid-cols-2">
          {SHADES.map((s) => (
            <button key={s.id} disabled={!status?.ready} onClick={async () => { if (await claimBlessing(s.id)) { sfx.win(); toast(`${s.blessing.name}: ${s.blessing.text}`, 'halo') } }}
              className={`${btn} items-start justify-start bg-paper text-left`}>
              {shadeEmblem(s.id, 36)}
              <span><b>{s.blessing.name}</b><br /><span className="text-xs font-normal">{s.blessing.text}</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Empat Bayangan & tatanan</h2>
        {SHADES.map((s) => (
          <div key={s.id} className="flex gap-3 rounded-2xl bg-paper p-3">
            {shadeEmblem(s.id)}
            <div className="min-w-0">
              <p className="font-display font-black">{s.name} <span className="text-sm opacity-70">· {s.title}</span></p>
              <p className="text-xs opacity-80">{s.fact}</p>
              <p className="mt-1 text-sm"><b>Aturan:</b> {s.rule}</p>
              <p className="text-sm"><b>Hukuman:</b> {s.punishment.name}: {s.punishment.text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

/* ── shared pieces: the home card, a Shade's descent, the gate Naberius closes ─────────────── */

/** Top of Home: the most pressing word from the wider world, if any. */
export function WorldEvents({ profile }: { profile: Profile }) {
  const status = useLiveQuery(() => blessingStatus(), [profile])
  const stuck = useLiveQuery(() => diagnose(), [profile])
  const judgments = activeJudgments(profile)
  const awake = SINNERS.filter((s) => stageOf(profile, s.id) > 0)
  const items: ReactNode[] = []
  for (const j of judgments) {
    const s = SHADES.find((x) => x.id === j.shade)!
    items.push(<Link key={`j${j.at}`} to="/celestia" className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2a1638] to-[#5c1f2e] p-3 text-white">{shadeEmblem(s.id, 40)}<span className="min-w-0 flex-1"><b className="block font-display">{s.name} turun: {s.punishment.name}</b><span className="block text-xs text-white/80">{s.punishment.text} · {left(j.until)}</span></span><Icon name="chevronRight" /></Link>)
  }
  if (awake.length) {
    const worst = Math.max(...awake.map((s) => stageOf(profile, s.id)))
    items.push(<Link key="abyss" to="/abyss" className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#120b1f] to-[#3b1663] p-3 text-white"><Emblem icon="abyss" color={ABYSS_COLOR} size={40} dark /><span className="min-w-0 flex-1"><b className="block font-display">Abyss bangkit: {awake.map((s) => s.name).join(', ')}</b><span className="block text-xs text-white/80">Tahap terburuk: {STAGE_NAME[worst]}. Bereskan penyebabnya atau tutup Rift-nya.</span></span><Icon name="chevronRight" /></Link>)
  }
  if (status?.ready) items.push(<Link key="bless" to="/celestia" className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#f6ecd2] to-[#e7d4a3] p-3"><Emblem icon="halo" color="#c9a96b" size={40} /><span className="min-w-0 flex-1"><b className="block font-display">Berkat Celestia menantimu</b><span className="block text-xs opacity-75">Tatananmu terjaga minggu ini. Pilih satu berkat dari Empat Bayangan.</span></span><Icon name="chevronRight" /></Link>)
  if (stuck?.stuck) items.push(<Link key="hexen" to="/hexenzirkel" className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#3b2a5c] to-[#7a52c4] p-3 text-white"><Emblem icon="sparkle" color="#7a52c4" size={40} /><span className="min-w-0 flex-1"><b className="block font-display">Hexenzirkel mengundangmu minum teh</b><span className="block text-xs text-white/80">{stuck.signs[0].text}</span></span><Icon name="chevronRight" /></Link>)
  return items.length ? <div className="space-y-2">{items}</div> : null
}

/** When a Shade passes a new judgment, it descends over the whole app once, but never in the middle of a lesson or game. */
export function ShadeDescent({ hold }: { hold: boolean }) {
  const count = useLiveQuery(() => db.profile.get('me').then((p) => p?.celestia?.judgments.length ?? 0))
  const [shown, setShown] = useState<Awaited<ReturnType<typeof takeNewJudgment>>>()
  useEffect(() => { if (count && !hold) takeNewJudgment().then((j) => { if (j) { sfx.bad(); setShown(j) } }) }, [count, hold])
  return (
    <AnimatePresence>
      {shown && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-night/80 p-4 sm:items-center" role="dialog" aria-label={`${shown.shade.name} turun`}>
          <motion.div initial={{ y: -40, scale: .9 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-md space-y-3 text-center">
            <div className="flex justify-center">{shadeEmblem(shown.shade.id, 120)}</div>
            <Dialogue name={`${shown.shade.name} · ${shown.shade.title}`} ja={shown.shade.descend.ja} tr={shown.shade.descend.tr}>
              <p className="mt-2 text-sm font-bold text-[#ffb3a8]">{shown.shade.punishment.name}: {shown.shade.punishment.text}</p>
              <p className="text-xs text-paper/70">Pelanggaran: {shown.reason}</p>
            </Dialogue>
            <button className={`${btn} w-full bg-paper`} onClick={() => setShown(undefined)}>Aku mengerti</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Wraps a new-lesson page: while Naberius's judgment stands, only reviews are allowed. */
export function NewGate({ children }: { children: ReactNode }) {
  const profile = useLiveQuery(() => db.profile.get('me'))
  if (!profile) return null
  if (!newLessonsLocked(profile)) return <>{children}</>
  const s = SHADES.find((x) => x.id === 'naberius')!
  return (
    <main className="mx-auto mt-6 max-w-md space-y-4 text-center">
      <div className="flex justify-center">{shadeEmblem('naberius', 100)}</div>
      <Dialogue name={`${s.name} · ${s.title}`} ja={s.descend.ja} tr={`${s.descend.tr} (Pelajaran baru dikunci sampai besok.)`} />
      <Link to="/review" className={`${btn} w-full bg-primary text-white`}><Icon name="replay" /> Review saja hari ini</Link>
    </main>
  )
}

function Locked({ text, back }: { text: string; back: string }) {
  return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <Icon name="lock" className="mx-auto h-10 w-10 opacity-50" />
      <p>{text}</p>
      <Link to={back} className={`${btn} bg-primary text-white`}>Kembali</Link>
    </main>
  )
}
