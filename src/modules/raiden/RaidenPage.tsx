import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../../data/db'
import {
  BOND_LEVELS, DANGO_PRICE, EUTHYMIA_LEVEL, REWARDS, SECRET_STREAK, TRIAL, TRIAL_PASS, TRIAL_SIZE, TRIAL_REWARD,
  bondLevel, finishTalk, giveDango, passTrial, phaseOf, talkFor, titleOf,
} from '../../engine/raiden'
import { today } from '../../engine/srs/srs'
import { Chibi } from '../../characters/Chibi'
import { Dialogue } from '../../ui/Dialogue'
import { Icon } from '../../ui/Icon'
import { btn, card, shuffle } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toastBus'
import { useDeadline } from '../../ui/useDeadline'
import { setRealmOverride } from '../../ui/region/override'
import { Scene } from './Scene'
import { LETTER, TALKS, type Talk } from './talks'

/** While a Raiden page is open the backdrop moves to Inazuma, or to the Plane of Euthymia once Ei is met. */
function useRaidenRealm(euthymia: boolean) {
  useEffect(() => {
    setRealmOverride(euthymia ? 'euthymia' : 'inazuma')
    return () => setRealmOverride(undefined)
  }, [euthymia])
}

function TomoeMeter({ bond }: { bond: number }) {
  const level = bondLevel(bond)
  const prev = BOND_LEVELS[level - 1] ?? 0
  const next = BOND_LEVELS[level]
  return (
    <div>
      <div className="flex justify-between">
        {BOND_LEVELS.map((_, i) => (
          <Icon key={i} name="tomoe" className={`h-6 w-6 ${i < level ? 'text-primary drop-shadow-[0_0_6px_var(--r-glow)]' : 'text-ink/20'}`} />
        ))}
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary" style={{ width: next ? `${((bond - prev) / (next - prev)) * 100}%` : '100%' }} />
      </div>
      <p className="mt-1 text-right text-xs font-bold opacity-70">{next ? `${bond - prev} / ${next - prev} menuju Lv ${level + 1}` : 'Ikatan maksimal'}</p>
    </div>
  )
}

/** /raiden: her hub. Hidden → the hint; letter → the summons; bond → meter, today's talk, dango, rewards. */
export function RaidenPage() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const r = profile?.raiden
  useRaidenRealm(!!r?.ei)
  if (!profile) return null
  const phase = phaseOf(r)

  if (phase === 'hidden') return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4 text-center`}>
      <div className="flex justify-center opacity-40 grayscale"><Chibi id="raiden" expression="sleep" size={180} /></div>
      <h1 className="font-display text-2xl font-black">Sang Shogun belum memanggilmu</h1>
      <p>Surat dari Tenshukaku tiba saat kamu sampai di <b>Inazuma</b> (JLPT N3).</p>
      <p className="rounded-2xl bg-soft p-3 text-sm"><Icon name="bulb" className="mr-1 h-4 w-4 text-primary" />Konon, Shogun memperhatikan mereka yang berlatih <b>{SECRET_STREAK} hari tanpa henti</b>… dan yang berani menyentuh lambang Inazuma di Peta.</p>
      <Link to="/map" className={`${btn} bg-primary text-white`}><Icon name="map" /> Buka Peta</Link>
    </main>
  )

  if (phase === 'letter') return (
      <main className={`${card} mx-auto mt-6 max-w-lg space-y-4 text-center`}>
        <Icon name="scroll" className="mx-auto h-16 w-16 text-primary" />
        <h1 className="font-display text-2xl font-black">Surat dari Tenshukaku</h1>
        <p>Segel petir ungu menyegel surat ini. Kujou Sara menunggumu di luar.</p>
        <Link to="/raiden/letter" className={`${btn} w-full bg-primary text-white`}><Icon name="unlock" /> Buka surat</Link>
      </main>
    )

  const level = bondLevel(r!.bond)
  const talk = talkFor(profile)
  const name = r!.ei ? 'Ei · 影' : 'Raiden Shogun · 雷電将軍'
  const dangoToday = r!.dango === Date.parse(today())
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <section className="relative flex flex-col items-center">
        <div className="absolute top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--r-glow)_0%,transparent_68%)]" />
        <div className="relative"><Chibi id="raiden" expression={talk ? 'happy' : 'idle'} size={240} /></div>
        <div className="g-glass -mt-4 rounded-full px-5 py-1.5 text-center">
          <b className="font-display text-[#f2cf7a]">{name}</b>
          {titleOf(r) && <span className="ml-2 text-xs text-paper/70">«{titleOf(r)}»</span>}
        </div>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Ikatan Keabadian · Lv {level}</h2>
        <TomoeMeter bond={r!.bond} />
        <div className="grid gap-2 sm:grid-cols-2">
          {talk
            ? <Link to="/raiden/talk" className={`${btn} bg-primary text-white`}><Icon name="chat" /> Bicara: {talk.title}</Link>
            : <span className={`${btn} bg-paper-deep opacity-70`}><Icon name="hourglass" /> Sudah bicara hari ini</span>}
          <button disabled={dangoToday} className={`${btn} bg-paper`} onClick={async () => {
            if (await giveDango()) { sfx.win(); toast(r!.ei ? 'Ei tersenyum manis. Ikatan +25' : 'Shogun menyimpannya "untuk dia". Ikatan +25', 'dango') }
            else toast('Kirameki tidak cukup', 'gem')
          }}><Icon name="dango" /> {dangoToday ? 'Dango sudah diberikan' : `Beri dango · ${DANGO_PRICE}`}</button>
          {profile.companionId !== 'raiden'
            ? <button className={`${btn} bg-deep text-white`} onClick={() => db.profile.update('me', { companionId: 'raiden' }).then(() => toast(`${r!.ei ? 'Ei' : 'Shogun'} kini menemanimu`, 'electro'))}><Icon name="users" /> Jadikan companion</button>
            : <span className={`${btn} bg-soft`}><Icon name="check" /> Sedang menemanimu</span>}
          {r!.ei && (
            <button className={`${btn} bg-paper`} onClick={() => db.profile.update('me', { realm: profile.realm === 'euthymia' ? 'auto' : 'euthymia' })}>
              <Icon name="palette" /> Tema Euthymia: {profile.realm === 'euthymia' ? 'aktif' : 'mati'}
            </button>
          )}
        </div>
        <p className="text-xs opacity-70">Setiap hari: satu percakapan dalam bahasa Jepang (+10 tiap jawaban baik, +10 selesai). Kalau dia jadi companion, latihanmu hari itu ikut menambah ikatan (maks +20).</p>
      </section>

      <section className={card}>
        <h2 className="g-heading mb-3 text-sm tracking-widest uppercase">Hadiah ikatan</h2>
        <ul className="space-y-2">
          {REWARDS.map((x) => {
            const got = level >= x.level
            return (
              <li key={x.level} className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${got ? 'bg-soft' : 'opacity-60'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display font-black ${got ? 'g-chip' : 'bg-paper-deep'}`}>{got ? <Icon name="check" className="h-4 w-4" /> : x.level}</span>
                <span><b className="font-display">{x.level === EUTHYMIA_LEVEL && !got ? '??? (rahasia)' : x.title}</b><br /><span className="text-sm opacity-75">{x.level === EUTHYMIA_LEVEL && !got ? 'Sesuatu menanti di balik keabadian…' : x.desc}</span></span>
              </li>
            )
          })}
        </ul>
      </section>

      {r!.talks.length > 0 && (
        <section className={card}>
          <h2 className="g-heading mb-3 text-sm tracking-widest uppercase">Kenangan</h2>
          <div className="flex flex-wrap gap-2">
            {TALKS.filter((t) => r!.talks.includes(t.id)).map((t) => (
              <Link key={t.id} to={`/raiden/talk?replay=${t.id}`} className={`${btn} bg-paper text-sm`}><Icon name="replay" className="h-4 w-4" /> {t.title}</Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/** /raiden/letter: Kujou Sara brings the summons, then the trial. */
export function RaidenLetter() {
  const navigate = useNavigate()
  useRaidenRealm(false)
  return <Scene beats={LETTER} onEnd={() => navigate('/raiden/trial')} />
}

/** /raiden/talk: today's conversation (or a replay from the memories, which gives no bond). */
export function RaidenTalk() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const [params] = useSearchParams()
  const replay = params.get('replay')
  // the talk is pinned when it ends, since finishing it makes today's talk disappear
  const [pinned, setPinned] = useState<Talk>()
  const [done, setDone] = useState<{ gained: number; study: number; good: number; levelUp?: number }>()
  const talk = pinned ?? (replay ? TALKS.find((x) => x.id === replay) : talkFor(profile))
  useRaidenRealm(!!profile?.raiden?.ei || !!talk?.euthymia)
  if (!profile) return null
  if (!talk) return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <p className="font-display text-xl font-black">Tidak ada percakapan sekarang</p>
      <Link to="/raiden" className={`${btn} bg-primary text-white`}>Kembali</Link>
    </main>
  )
  if (done) {
    const ei = talk.euthymia || profile.raiden?.ei
    return (
      <main className={`${card} mx-auto mt-6 max-w-md space-y-4 text-center`}>
        <div className="flex justify-center"><Chibi id="raiden" expression="happy" size={160} /></div>
        {replay ? <p className="font-display text-xl font-black">Kenangan diputar ulang</p> : <>
          <p className="font-display text-3xl font-black text-primary">Ikatan +{done.gained}</p>
          <p className="text-sm opacity-80">{done.good} jawaban baik{done.study ? ` · +${done.study} dari latihanmu hari ini` : ''}</p>
          {done.levelUp && <p className="rounded-2xl bg-soft p-3 font-display font-bold"><Icon name="sparkle" className="mr-1 text-primary" />Ikatan naik ke Lv {done.levelUp}!</p>}
          {talk.euthymia && <Dialogue name="Ei · 影" ja="これからは、ずっと一緒です。" tr="Mulai sekarang, kita selalu bersama. (Ei kini bisa menemanimu, dan tema Alam Euthymia terbuka.)" />}
        </>}
        <Link to="/raiden" className={`${btn} w-full bg-primary text-white`}>Kembali ke {ei ? 'Ei' : 'Shogun'}</Link>
      </main>
    )
  }
  return <Scene key={talk.id} beats={talk.beats} onEnd={async (good) => {
    setPinned(talk)
    if (replay) return setDone({ gained: 0, study: 0, good })
    const before = bondLevel(profile.raiden?.bond ?? 0)
    const res = await finishTalk(talk, good)
    const after = bondLevel((profile.raiden?.bond ?? 0) + res.gained)
    sfx.win()
    setDone({ ...res, good, levelUp: after > before ? after : undefined })
  }} />
}

/** /raiden/trial: the Musou trial, eight questions under the storm clock; six right to pass. */
export function RaidenTrial() {
  const navigate = useNavigate()
  const [qs, setQs] = useState(() => shuffle(TRIAL).slice(0, TRIAL_SIZE).map((q) => ({ ...q, choices: shuffle(q.choices) })))
  const [i, setI] = useState(0)
  const [right, setRight] = useState(0)
  const [picked, setPicked] = useState<string>()
  const [result, setResult] = useState<'pass' | 'fail'>()
  const timer = useDeadline(15, () => pick(''))
  useRaidenRealm(false)
  const q = qs[i]

  function pick(c: string) {
    if (picked !== undefined || result) return
    timer.stop()
    const ok = c === q.answer
    if (ok) sfx.good(); else sfx.bad()
    setPicked(c)
    const score = right + (ok ? 1 : 0)
    setRight(score)
    setTimeout(async () => {
      setPicked(undefined)
      if (i + 1 < qs.length) { setI(i + 1); timer.start(15) }
      else if (score >= TRIAL_PASS) { await passTrial(); sfx.win(); setResult('pass') }
      else setResult('fail')
    }, 900)
  }

  if (result) return (
    <main className="mx-auto mt-4 max-w-lg space-y-4">
      <div className="flex justify-center"><Chibi id="raiden" expression={result === 'pass' ? 'happy' : 'sad'} size={220} /></div>
      {result === 'pass'
        ? <Dialogue name="Raiden Shogun · 雷電将軍" ja="見事です。あなたを認めましょう。" tr={`Luar biasa. Aku mengakuimu. (${right}/${qs.length} · Raiden bergabung · +${TRIAL_REWARD} Kirameki)`} />
        : <Dialogue name="Raiden Shogun · 雷電将軍" ja="まだ未熟です。鍛錬を積んでから、また来なさい。" tr={`Masih belum matang. Berlatihlah, lalu datang lagi. (${right}/${qs.length}, butuh ${TRIAL_PASS})`} />}
      {result === 'pass'
        ? <button className={`${btn} w-full bg-primary text-white`} onClick={() => navigate('/raiden')}>Temui Shogun</button>
        : <button className={`${btn} w-full bg-primary text-white`} onClick={() => { setQs(shuffle(TRIAL).slice(0, TRIAL_SIZE).map((x) => ({ ...x, choices: shuffle(x.choices) }))); setI(0); setRight(0); setResult(undefined); timer.start(15) }}>Coba lagi</button>}
    </main>
  )

  return (
    <main className="mx-auto mt-4 max-w-lg space-y-4">
      <div className="g-glass flex items-center justify-between rounded-2xl px-4 py-2 font-display font-bold">
        <span lang="ja" className="text-[#e3d0ff]">夢想の試練</span>
        <span>{i + 1}/{qs.length} · benar {right}</span>
        <span className="flex items-center gap-1"><Icon name="timer" className="h-4 w-4" />{Math.ceil(timer.left)}s</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-night/40"><div className="h-full bg-gradient-to-r from-[#d9c4ff] to-[#7a52c4] transition-[width] duration-200" style={{ width: `${(timer.left / 15) * 100}%` }} /></div>
      <motion.section key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${card} space-y-4 text-center`}>
        <p className="text-sm font-bold opacity-70">{q.ask}</p>
        <p lang="ja" className={`font-display font-black ${q.prompt.length > 6 ? 'text-3xl' : 'text-5xl'}`}>{q.prompt}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.choices.map((c) => (
            <button key={c} onClick={() => pick(c)} lang={q.ask === 'Artinya' ? undefined : 'ja'}
              className={`${btn} text-lg ${picked !== undefined && c === q.answer ? 'bg-anemo text-white' : picked === c ? 'bg-wrong text-white' : 'bg-paper'}`}>{c}</button>
          ))}
        </div>
      </motion.section>
      <p className="text-center text-sm text-paper drop-shadow">Jawab benar {TRIAL_PASS} dari {qs.length} untuk diakui Shogun.</p>
    </main>
  )
}
