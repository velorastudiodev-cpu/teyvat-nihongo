import { useEffect, useMemo, useState } from 'react'
import { Icon, type IconName } from '../../ui/Icon'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { GRAMMAR } from '../../data/grammar'
import { READINGS } from '../../data/readings'
import { VOCAB, kanjiIn, type Word } from '../../data/kanji'
import { parse, textOf } from '../../engine/sentence'
import { answer, bumpDay } from '../../engine/srs/srs'
import { sameWord, shadow, toKana } from '../../engine/voice/match'
import { levelOpen } from '../kanji/content'
import { SpeedPicker, PlayButton } from '../listening/Listening'
import { Buddy } from '../../ui/Buddy'
import { btn, card, shuffle } from '../../ui/kit'
import { Sentence } from '../../ui/Sentence'
import { SpeakOrType } from '../../ui/SpeakOrType'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { Capacitor } from '@capacitor/core'
import { speechSupported } from '../../ui/useSpeech'

export function SpeakingHub() {
  const items: { to: string; icon: IconName; name: string; desc: string }[] = [
    { to: '/games/voice-fill', icon: 'mic', name: 'Voice Fill', desc: 'Ucapkan kata yang hilang dari kalimat' },
    { to: '/games/speed-speak', icon: 'echo', name: 'Speed Speak', desc: 'Ucapkan kata secepat mungkin, kejar combo' },
    { to: '/speaking/shadowing', icon: 'waves', name: 'Shadowing', desc: 'Dengar, tirukan, lihat bagian yang meleset' },
    { to: '/speaking/read-aloud', icon: 'book', name: 'Kanji Read-Aloud', desc: 'Baca kata berkanji tanpa furigana' },
  ]
  return (
    <main className="space-y-4 py-4">
      <h1 className="flex items-center gap-3 font-display text-3xl font-black text-paper drop-shadow"><span className="g-chip h-12 w-12"><Icon name="mic" className="h-6 w-6" /></span>Berbicara</h1>
      <p className={`g-panel flex items-start gap-2 p-3 text-sm font-bold ${speechSupported ? 'text-anemo' : 'text-wrong'}`}>
        <Icon name={speechSupported ? 'check' : 'warning'} className="mt-0.5 h-4 w-4" />
        {Capacitor.isNativePlatform() ? 'Memakai pengenalan suara Android (ja-JP). Izinkan mikrofon saat diminta.' : speechSupported ? 'Browser ini mendukung pengenalan suara ja-JP. Izinkan mikrofon saat diminta.' : 'Browser ini tidak mendukung pengenalan suara (pakai Chrome/Edge). Semua latihan tetap bisa dikerjakan dengan mode ketik.'}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <Link key={i.to} to={i.to} className={`${card} flex items-center gap-4 transition-transform hover:-translate-y-1`}>
            <span className="g-chip h-12 w-12 shrink-0"><Icon name={i.icon} className="h-6 w-6" /></span>
            <span><b className="font-display text-xl">{i.name}</b><br /><span className="text-sm opacity-70">{i.desc}</span></span>
          </Link>
        ))}
      </div>
    </main>
  )
}

/** Grammar sentences and reading lines of the levels you've reached. */
function useShadowLines() {
  const stage = useLiveQuery(() => db.profile.get('me').then((p) => p?.stage))
  return useMemo(() => shuffle([
    ...GRAMMAR.filter((p) => levelOpen(p.level, stage) || p.level === 'N5').flatMap((p) => p.sentences.map(([ja, tr]) => ({ tokens: parse(ja), tr }))),
    ...READINGS.filter((r) => levelOpen(r.level, stage) || r.level === 'N5').flatMap((r) => r.text.split('/').map((l) => ({ tokens: parse(l), tr: r.titleId }))),
  ]), [stage])
}

export function Shadowing() {
  const lines = useShadowLines()
  const [n, setN] = useState(0)
  const [result, setResult] = useState<ReturnType<typeof shadow>>()
  const [attempt, setAttempt] = useState(0)
  if (!lines.length) return null
  const line = lines[n % lines.length]
  const text = textOf(line.tokens)

  return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">Shadowing · {n + 1}</span>
        <SpeedPicker />
        <Buddy mood={!result ? 'idle' : result.score >= 80 ? 'happy' : 'sad'} size={64} />
      </div>
      <p className="text-sm opacity-70">1. Dengarkan · 2. Tekan mikrofon dan tirukan persis · 3. Lihat bagian yang merah</p>
      <PlayButton key={n} text={text} auto />
      <Sentence tokens={line.tokens} marks={result?.tokenOk} className="text-2xl" />
      <p className="text-sm opacity-60">{line.tr}</p>
      {result && (
        <div className="space-y-1">
          <p className={`font-display text-4xl font-extrabold ${result.score >= 80 ? 'text-anemo' : 'text-wrong'}`}>{result.score}%</p>
          <p className="text-sm">Terdengar: <span lang="ja">{result.heard}</span></p>
        </div>
      )}
      <SpeakOrType key={`${n}:${attempt}`} hint="Tekan lalu tirukan kalimatnya" onAnswer={(alts) => {
        const r = shadow(alts, line.tokens)
        setResult(r)
        if (r.score >= 80) sfx.good(); else sfx.bad()
        bumpDay({ xp: Math.round(r.score / 20) })
      }} />
      <div className="flex justify-center gap-2">
        {result && <button className={`${btn} bg-paper`} onClick={() => { setResult(undefined); setAttempt(attempt + 1); speak(text) }}>Ulangi</button>}
        <button className={`${btn} bg-primary text-white`} onClick={() => { setResult(undefined); setN(n + 1) }}>Kalimat berikutnya →</button>
      </div>
    </main>
  )
}

export function ReadAloud() {
  const [words, setWords] = useState<Word[]>()
  const [due, setDue] = useState<Set<string>>(new Set())
  const [n, setN] = useState(0)
  const [result, setResult] = useState<{ ok: boolean; heard: string }>()
  const [stats, setStats] = useState({ right: 0, total: 0 })
  useEffect(() => { (async () => {
    const stage = (await db.profile.get('me'))?.stage
    const items = await db.items.where('kind').anyOf('vocab', 'kanji').toArray()
    const knownKanji = new Set(items.filter((i) => i.kind === 'kanji').map((i) => i.id.slice(6)))
    setDue(new Set(items.filter((i) => i.due <= Date.now()).map((i) => i.id)))
    const withKanji = VOCAB.filter((w) => levelOpen(w.level, stage) && kanjiIn(w.word).length)
    const familiar = withKanji.filter((w) => items.some((i) => i.id === `vocab:${w.word}`) || kanjiIn(w.word).every((k) => knownKanji.has(k)))
    setWords(shuffle(familiar.length >= 5 ? familiar : withKanji.length ? withKanji : VOCAB.filter((w) => kanjiIn(w.word).length && w.level === 'N5')))
  })() }, [])
  if (!words) return null
  const w = words[n % words.length]

  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">Kanji Read-Aloud · {stats.right}/{stats.total}</span>
        <Buddy mood={!result ? 'idle' : result.ok ? 'happy' : 'sad'} size={64} />
      </div>
      <p className="text-sm opacity-70">Baca dengan suara (tanpa furigana)</p>
      <p lang="ja" className="text-7xl font-bold">{w.word}</p>
      {result ? (
        <div className="space-y-2">
          <p lang="ja" className="text-2xl">{w.reading} <span className="text-base opacity-70">· {w.meaning}</span></p>
          <p className="text-sm">Terdengar: <span lang="ja">{result.heard}</span> <Icon name={result.ok ? 'check' : 'cross'} className={`h-4 w-4 ${result.ok ? 'text-anemo' : 'text-wrong'}`} /></p>
          <button autoFocus className={`${btn} bg-primary text-white`} onClick={() => { setResult(undefined); setN(n + 1) }}>Berikutnya →</button>
        </div>
      ) : (
        <SpeakOrType key={n} hint="Tekan lalu baca katanya" onAnswer={(alts) => {
          const heard = alts.map((a) => toKana(a, [[w.word, w.reading]]))
          const ok = heard.some((h) => sameWord(h, w.reading))
          setResult({ ok, heard: heard[0] })
          setStats((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }))
          speak(w.reading)
          if (ok) sfx.good(); else sfx.bad()
          if (due.has(`vocab:${w.word}`)) answer(`vocab:${w.word}`, ok, 0, heard[0], w.reading)
        }} />
      )}
    </main>
  )
}
