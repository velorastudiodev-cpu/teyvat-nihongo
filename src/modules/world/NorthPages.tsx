import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { AUDIENCE, HEXENZIRKEL, NODKRAI, SNEZHNAYA, TSARITSA, WITCHES, type WitchId } from '../../data/lore'
import { characters } from '../../characters'
import { Chibi } from '../../characters/Chibi'
import { claim } from '../../engine/game/economy'
import { atRisk, confusionPool, confusions, diagnose, leeches, tale, transmute, TRANSMUTE_PER_DAY } from '../../engine/hexen'
import { parse, textOf } from '../../engine/sentence'
import { Dialogue } from '../../ui/Dialogue'
import { Icon } from '../../ui/Icon'
import { btn, card } from '../../ui/kit'
import { Sentence } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toastBus'
import { setRealmOverride } from '../../ui/region/override'
import { useHomeRegion } from '../../ui/region/useRealm'
import { ItemQuestion } from '../Review'
import type { Q } from '../daily/pools'
import { Emblem } from './Battle'

const witch = (id: WitchId) => WITCHES.find((w) => w.id === id)!
const witchEmblem = (id: WitchId, size = 52) => <Emblem icon={witch(id).icon} color={witch(id).color} label={witch(id).code} size={size} />

/* ── the Hexenzirkel's tea party ─────────────────────────────────────────────────────────── */

export function HexenPage() {
  const d = useLiveQuery(() => diagnose(), [])
  const pairs = useLiveQuery(() => confusions(), []) ?? []
  const hard = useLiveQuery(() => leeches(), []) ?? []
  const risk = useLiveQuery(() => atRisk(10), []) ?? []
  const tales = hard.map((h) => ({ id: h.id, t: tale(h.id) })).filter((x) => x.t).slice(0, 5)
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <header className="g-glass flex items-start gap-4 rounded-2xl p-4">
        <Emblem icon="sparkle" color="#7a52c4" size={56} />
        <div>
          <h1 className="font-title text-2xl font-bold tracking-widest text-gold-soft">HEXENZIRKEL</h1>
          <p lang="ja" className="text-sm text-paper/80">魔女会のお茶会</p>
          <p className="mt-1 text-sm text-paper/85">{HEXENZIRKEL.about}</p>
        </div>
      </header>

      {/* Alice reads your notes and draws up the plan */}
      <section className={`${card} space-y-3`}>
        <div className="flex items-center gap-3">{witchEmblem('alice')}<div><p className="font-display font-black">{witch('alice').name}</p><p className="text-xs opacity-75">{witch('alice').fact}</p></div></div>
        <Dialogue name="Alice" ja={witch('alice').greet.ja} tr={witch('alice').greet.tr} />
        {d && (d.signs.length
          ? <ul className="space-y-2">{d.signs.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-2xl bg-soft p-3">
                <Icon name="bulb" className="h-5 w-5 shrink-0 text-geo" />
                <span className="flex-1 text-sm">{s.text}</span>
                <Link to={s.to} className={`${btn} shrink-0 bg-primary px-3 py-1.5 text-xs text-white`}>{s.action}</Link>
              </li>))}</ul>
          : <p className="rounded-2xl bg-soft p-3 text-sm">Catatanmu rapi. Tak ada tanda buntu; teruskan ritmemu, dan datanglah kapan pun butuh teman minum teh.</p>)}
      </section>

      {/* Nicole foresees the cards you will forget next */}
      <section className={`${card} space-y-3`}>
        <div className="flex items-center gap-3">{witchEmblem('nicole')}<div><p className="font-display font-black">{witch('nicole').name}</p><p className="text-xs opacity-75">{witch('nicole').help}</p></div></div>
        <Dialogue name="Nicole" ja={witch('nicole').greet.ja} tr={witch('nicole').greet.tr} />
        {risk.length
          ? <Link to="/hexenzirkel/drill/nicole" className={`${btn} w-full bg-primary text-white`}><Icon name="eye" /> Latih {risk.length} kartu paling rawan</Link>
          : <p className="text-sm opacity-70">Belum ada kartu yang bisa diramal. Pelajari dan review beberapa dulu.</p>}
      </section>

      {/* Barbeloth charts the answers you keep swapping */}
      <section className={`${card} space-y-3`}>
        <div className="flex items-center gap-3">{witchEmblem('barbeloth')}<div><p className="font-display font-black">{witch('barbeloth').name}</p><p className="text-xs opacity-75">{witch('barbeloth').help}</p></div></div>
        {pairs.length ? (
          <>
            <ul className="grid gap-2 sm:grid-cols-2">{pairs.map((p) => (
              <li key={`${p.given}${p.expected}`} className="flex items-center justify-between rounded-2xl bg-paper px-3 py-2 text-sm">
                <span><span lang="ja" className="font-bold text-wrong">{p.given}</span> <Icon name="arrowRight" className="h-3.5 w-3.5 opacity-50" /> <span lang="ja" className="font-bold text-anemo">{p.expected}</span></span>
                <span className="text-xs opacity-60">{p.count}×</span>
              </li>))}</ul>
            <Link to="/hexenzirkel/drill/barbeloth" className={`${btn} w-full bg-deep text-white`}><Icon name="star" /> Latih pasangan yang tertukar</Link>
          </>
        ) : <p className="text-sm opacity-70">Belum ada pola kesalahan yang berulang.</p>}
      </section>

      {/* Andersdotter turns hard kanji into little tales */}
      <section id="andersdotter" className={`${card} space-y-3`}>
        <div className="flex items-center gap-3">{witchEmblem('andersdotter')}<div><p className="font-display font-black">{witch('andersdotter').name}</p><p className="text-xs opacity-75">{witch('andersdotter').help}</p></div></div>
        <Dialogue name="Andersdotter" ja={witch('andersdotter').greet.ja} tr={witch('andersdotter').greet.tr} />
        {tales.length ? tales.map(({ id, t }) => (
          <article key={id} className="rounded-2xl bg-paper p-3">
            <p className="flex items-baseline gap-2"><span lang="ja" className="text-3xl font-bold">{t!.title}</span><span className="font-bold">{t!.meaning}</span></p>
            <p className="mt-1 flex flex-wrap gap-1.5">{t!.parts.map((p, i) => <span key={i} className="rounded-full bg-soft px-2 py-0.5 text-xs"><span lang="ja" className="font-bold">{p.glyph}</span>{p.meaning ? ` ${p.meaning}` : ''}</span>)}</p>
            <p className="mt-2 text-sm italic">{t!.story}</p>
          </article>
        )) : <p className="text-sm opacity-70">Belum ada kanji yang terus terlupa. Kalau nanti ada, dongengnya muncul di sini.</p>}
      </section>

      {/* Rhinedottir dissolves a leech so it can be learned anew */}
      <section className={`${card} space-y-3`}>
        <div className="flex items-center gap-3">{witchEmblem('rhinedottir')}<div><p className="font-display font-black">{witch('rhinedottir').name} <span className="text-xs font-bold text-wrong">· salah satu Lima Pendosa</span></p><p className="text-xs opacity-75">{witch('rhinedottir').help}</p></div></div>
        <Dialogue name="Rhinedottir" ja={witch('rhinedottir').greet.ja} tr={witch('rhinedottir').greet.tr} />
        {hard.length ? (
          <ul className="space-y-1.5">{hard.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-2 rounded-2xl bg-paper px-3 py-2 text-sm">
              <span lang="ja" className="font-bold">{h.id.slice(h.id.indexOf(':') + 1)}</span>
              <span className="text-xs opacity-60">terlupa {h.card.lapses}×</span>
              <button className={`${btn} bg-paper px-3 py-1 text-xs`} onClick={async () => {
                if (!confirm('Kartu ini dipelajari ulang dari awal (jadwalnya direset). Lanjutkan?')) return
                if (await transmute(h.id)) { sfx.good(); toast('Kartu dilebur dan siap dipelajari ulang', 'sprout') }
                else toast(`Batas transmutasi hari ini: ${TRANSMUTE_PER_DAY} kartu`, 'warning')
              }}><Icon name="sprout" className="h-3.5 w-3.5" /> Transmutasi</button>
            </li>))}</ul>
        ) : <p className="text-sm opacity-70">Tidak ada kartu yang perlu dilebur.</p>}
      </section>
    </div>
  )
}

/** /hexenzirkel/drill/:witch: a short practice set from Nicole's foresight or Barbeloth's star chart. */
export function HexenDrill() {
  const { witch: id } = useParams()
  const [pool, setPool] = useState<Q[]>()
  const [n, setN] = useState(0)
  const [right, setRight] = useState(0)
  useEffect(() => {
    (id === 'nicole' ? atRisk(10).then((xs) => xs.map((x) => ({ id: x.id, kind: x.kind }))) : confusionPool()).then(setPool)
  }, [id])
  if (!pool) return null
  const w = witch(id === 'nicole' ? 'nicole' : 'barbeloth')
  if (!pool.length || n >= pool.length) return (
    <main className={`${card} mx-auto mt-6 max-w-md space-y-3 text-center`}>
      <div className="flex justify-center">{witchEmblem(w.id, 90)}</div>
      <p className="font-display text-2xl font-black">{pool.length ? `${right} / ${pool.length} benar` : 'Tidak ada kartu untuk dilatih'}</p>
      <p className="text-sm opacity-80">Latihan ini menguatkan ingatan. Kartu yang memang jatuh tempo ikut terjadwal ulang.</p>
      <Link to="/hexenzirkel" className={`${btn} bg-primary text-white`}>Kembali ke pesta teh</Link>
    </main>
  )
  return <ItemQuestion key={n} item={pool[n]} title={`${w.name} · ${n + 1}/${pool.length}`} onDone={(ok) => { if (ok) setRight(right + 1); setN(n + 1) }} />
}

/* ── Snezhnaya: the journey's end, and an audience with the Tsaritsa ──────────────────────── */

export function SnezhnayaPage() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const home = useHomeRegion(profile)
  const met = useLiveQuery(() => db.unlocks.get('tsaritsa:audience'), [])
  const [step, setStep] = useState(-1)
  const [reply, setReply] = useState<{ ja: string; tr: string }>()
  useEffect(() => { setRealmOverride('snezhnaya'); return () => setRealmOverride(undefined) }, [])
  if (!profile) return null
  const reached = home === 'snezhnaya'
  const lines = AUDIENCE.open
  const ts = <Emblem icon="cryo" color="#4a7fb5" size={110} />
  const say = (ja: string) => <Sentence tokens={parse(ja)} className="text-lg leading-[2.2] text-[#f6f1e6]" />
  const name = `${TSARITSA.name} · ${TSARITSA.fullName}`

  let scene = null
  if (step >= 0 && step < lines.length) scene = <Dialogue name={name} ja={say(lines[step].ja)} tr={lines[step].tr} voice={textOf(parse(lines[step].ja))} />
  else if (step === lines.length) scene = (
    <div className="space-y-2">
      {reply ? <Dialogue name={name} ja={say(reply.ja)} tr={reply.tr} voice={textOf(parse(reply.ja))} />
        : <Dialogue name={name} ja={say(AUDIENCE.ask.ja)} tr={AUDIENCE.ask.tr} voice={textOf(parse(AUDIENCE.ask.ja))} />}
      {!reply && AUDIENCE.options.map((o) => (
        <button key={o.ja} onClick={() => setReply(o.reply)} className="g-glass flex w-full cursor-pointer items-center gap-3 rounded-full py-1 pr-5 pl-2 text-left">
          <span className="g-chip h-8 w-8 shrink-0"><Icon name="chat" className="h-4 w-4" /></span><Sentence tokens={parse(o.ja)} className="text-base font-bold text-paper" />
        </button>
      ))}
    </div>
  )
  else if (step > lines.length) scene = <Dialogue name={name} ja={say(AUDIENCE.close[0].ja)} tr={AUDIENCE.close[0].tr} voice={textOf(parse(AUDIENCE.close[0].ja))} />
  const next = async () => {
    if (step === lines.length && !reply) return
    if (step > lines.length) {
      const got = await claim('tsaritsa:audience', AUDIENCE.reward)
      if (got) { sfx.win(); toast(`${AUDIENCE.title} · +${got} Kirameki`, 'cryo') }
      setStep(-1); setReply(undefined); return
    }
    setStep(step + 1)
  }
  const north = characters.filter((c) => c.region === 'snezhnaya' || c.region === 'nodkrai')

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <header className="g-glass flex items-start gap-4 rounded-2xl p-4">
        <Emblem icon="cryo" color="#4a7fb5" size={56} />
        <div>
          <h1 className="font-title text-2xl font-bold tracking-widest text-gold-soft">SNEZHNAYA</h1>
          <p lang="ja" className="text-sm text-paper/80">スネージナヤ · 氷の女皇</p>
          <p className="mt-1 text-sm text-paper/85">{SNEZHNAYA.about}</p>
        </div>
      </header>

      <section className={`${card} space-y-3`}>
        <div className="flex items-center gap-3"><Emblem icon="cryo" color="#4a7fb5" size={52} /><div><p className="font-display font-black">{TSARITSA.fullName}</p><p className="text-xs font-bold text-primary">{TSARITSA.title}</p><p className="text-xs opacity-80">{TSARITSA.fact}</p></div></div>
        {!reached ? (
          <p className="rounded-2xl bg-paper-deep p-3 text-sm"><Icon name="lock" className="mr-1 h-4 w-4" />Istana Snezhnograd menunggumu di akhir perjalanan: lulus <Link to="/exam" className="font-bold underline">JLPT N1 Mock Test</Link> untuk mendapat audiensi.</p>
        ) : step < 0 ? (
          <button className={`${btn} w-full bg-primary text-white`} onClick={() => setStep(0)}><Icon name="cryo" /> {met ? 'Audiensi lagi' : 'Mohon audiensi dengan Tsaritsa'}</button>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">{ts}</div>
            {scene}
            <button className={`${btn} w-full bg-paper`} disabled={step === lines.length && !reply} onClick={next}>{step > lines.length ? (met ? 'Selesai' : `Terima hormat · +${AUDIENCE.reward} Kirameki`) : 'Lanjut'}</button>
          </div>
        )}
        {met && <p className="text-xs font-bold text-anemo"><Icon name="check" className="h-3.5 w-3.5" /> Gelar: {AUDIENCE.title}</p>}
      </section>

      <section className={`${card} space-y-2`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Jalan dari Nod-Krai</h2>
        <p className="text-sm">{NODKRAI.about}</p>
      </section>

      <section className={`${card} space-y-2`}>
        <h2 className="g-heading text-sm tracking-widest uppercase">Karakter dari utara</h2>
        <div className="grid grid-cols-4 gap-2">
          {north.map((c) => (
            <Link key={c.id} to={`/characters/${c.id}`} className="flex flex-col items-center rounded-2xl bg-paper p-1 text-center">
              <Chibi id={c.id} size={64} />
              <span className="text-[11px] font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
        <p className="text-xs opacity-70">Karakter baru tampil sebagai siluet sampai gambarnya ditambahkan.</p>
      </section>
    </div>
  )
}
