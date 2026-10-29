import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { SrsItem } from '../data/db'
import { kanaById, romajiMatches, type Kana } from '../data/kana'
import { kanjiById, mainReading, wordById, type Kanji, type Word } from '../data/kanji'
import { toHiragana } from 'wanakana'
import { KanjiQuestion } from './kanji/KanjiLesson'
import { WordQuestion } from './vocab/VocabLesson'
import { readingMatches } from './kanji/content'
import { StrokeOrder, StrokePad } from '../ui/strokes'
import { useChoiceKeys } from '../ui/useChoiceKeys'
import { patternById } from '../data/grammar'
import { BlankExercise, BuildExercise } from './grammar/exercises'
import { answer, dueItems } from '../engine/srs/srs'
import { Buddy } from '../ui/Buddy'
import { btn, card, sample, shuffle } from '../ui/kit'
import { sfx } from '../ui/sfx'
import { speak } from '../ui/speak'
import type { Expression } from '../characters'
import { distractors } from './kana/progress'

const SESSION = 40
type Mode = 'read' | 'write' | 'type' | 'listen'

export function Review() {
  const [queue, setQueue] = useState<SrsItem[]>()
  const [stats, setStats] = useState({ right: 0, total: 0 })
  useEffect(() => { dueItems().then((xs) => setQueue(shuffle(xs).slice(0, SESSION))) }, [])

  if (!queue) return null
  if (!queue.length) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood={stats.total ? 'happy' : 'idle'} size={130} /></div>
      {stats.total
        ? <p className="font-display text-3xl font-extrabold">Review selesai! {Math.round((stats.right / stats.total) * 100)}% benar</p>
        : <p className="font-display text-2xl font-extrabold">Belum ada kartu jatuh tempo ✨</p>}
      <div className="flex justify-center gap-2">
        <Link to="/learn" className={`${btn} bg-torii text-white`}>Belajar baru</Link>
        <Link to="/daily" className={`${btn} bg-anemo text-white`}>Commission harian</Link>
      </div>
    </main>
  )
  return <ItemQuestion key={`${queue[0].id}:${stats.total}`} item={queue[0]} title={`Review · sisa ${queue.length}`} onDone={(right) => {
    setStats((s) => ({ right: s.right + (right ? 1 : 0), total: s.total + 1 }))
    setQueue(queue.slice(1))
  }} />
}

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

/**
 * One question for any SRS item, with a question type picked once per mount.
 * The answer is recorded (SRS + Mistake Journal) before `onDone` is called.
 */
export function ItemQuestion({ item, title, onDone }: { item: Pick<SrsItem, 'id' | 'kind'>; title: string; onDone: (right: boolean, ms: number) => void }) {
  const [type] = useState(() => {
    if (item.kind === 'kanji') return pick(kanjiById.get(item.id)!.strokes <= 12 ? ['meaning', 'reading', 'write'] : ['meaning', 'reading'])
    if (item.kind === 'grammar') return pick(['build', 'blank'])
    return pick(['meaning', 'listen', 'type'])
  })
  const [sentence] = useState(() => (item.kind === 'grammar' ? pick(patternById.get(item.id)!.sentences) : undefined))
  const record = (expected: string) => (right: boolean, given: string, ms: number) => {
    answer(item.id, right, ms, given, expected)
    onDone(right, ms)
  }
  if (item.kind === 'kana') return <KanaQuestion kana={kanaById.get(item.id)!} left={0} title={title} onAnswer={(right, ms) => onDone(right, ms)} />
  if (item.kind === 'kanji') {
    const k = kanjiById.get(item.id)!
    return type === 'write'
      ? <WriteQuestion k={k} title={title} onAnswer={record(k.char)} />
      : <KanjiQuestion k={k} type={type as 'meaning' | 'reading'} title={title} onAnswer={record(k.char)} />
  }
  if (item.kind === 'grammar') {
    const [ja, tr] = sentence!
    const p = patternById.get(item.id)!
    return type === 'build'
      ? <BuildExercise ja={ja} tr={tr} title={title} onAnswer={record(ja)} />
      : <BlankExercise ja={ja} tr={tr} level={p.level} title={title} onAnswer={record(ja)} />
  }
  const w = wordById.get(item.id)!
  return type === 'type'
    ? <TypeReading w={w} title={title} onAnswer={record(w.reading)} />
    : <WordQuestion w={w} type={type as 'meaning' | 'listen'} title={title} onAnswer={record(w.word)} />
}

function WriteQuestion({ k, title, onAnswer }: { k: Kanji; title: string; onAnswer: (right: boolean, given: string, ms: number) => void }) {
  const [started] = useState(() => Date.now())
  const [gaveUp, setGaveUp] = useState(false)
  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-3 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title}</span>
        <Buddy mood={gaveUp ? 'sad' : 'idle'} size={70} />
      </div>
      <p className="text-sm opacity-70">Tulis kanji untuk</p>
      <p className="font-display text-2xl font-extrabold">{k.meaning} <span lang="ja" className="font-sans text-lg font-normal">（{mainReading(k)}）</span></p>
      {gaveUp ? (
        <div className="space-y-2">
          <div className="flex justify-center"><StrokeOrder char={k.char} /></div>
          <button autoFocus onClick={() => onAnswer(false, '', Date.now() - started)} className={`${btn} bg-ink text-paper`}>Lanjut →</button>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <StrokePad key={k.char} char={k.char} ghost={false} onDone={({ mistakes }) => setTimeout(() => onAnswer(mistakes <= 1, mistakes ? 'salah goresan' : k.char, Date.now() - started), 700)} />
          </div>
          <button onClick={() => { sfx.bad(); setGaveUp(true) }} className="text-sm underline opacity-60">Tidak ingat</button>
        </>
      )}
    </main>
  )
}

function TypeReading({ w, title, onAnswer }: { w: Word; title: string; onAnswer: (right: boolean, given: string, ms: number) => void }) {
  const [started] = useState(() => Date.now())
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<boolean>()
  const submit = () => {
    if (result !== undefined) return
    const right = readingMatches(typed, w.reading)
    setResult(right)
    if (right) sfx.good(); else sfx.bad()
    speak(w.reading)
    if (right) setTimeout(() => onAnswer(true, typed, Date.now() - started), 650)
  }
  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title}</span>
        <Buddy mood={result === undefined ? 'idle' : result ? 'happy' : 'sad'} size={70} />
      </div>
      <p className="text-sm opacity-70">Ketik bacaannya (romaji atau kana) · {w.meaning}</p>
      <p lang="ja" className="text-5xl font-bold">{w.word}</p>
      <form onSubmit={(e) => { e.preventDefault(); submit() }} className="flex gap-2">
        <input autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} disabled={result !== undefined} autoCapitalize="off" autoComplete="off"
          className="min-w-0 flex-1 rounded-full border-[3px] border-ink bg-paper px-4 py-2 text-center text-xl" aria-label="bacaan" />
        <button className={`${btn} bg-torii text-white`}>OK</button>
      </form>
      <p lang="ja" className="h-6 text-lg">{typed && toHiragana(typed, { IMEMode: true })}</p>
      {result === false && (
        <div className="space-y-2">
          <p lang="ja" className="text-xl">{w.word}（<b>{w.reading}</b>）</p>
          <button autoFocus onClick={() => onAnswer(false, typed, Date.now() - started)} className={`${btn} bg-ink text-paper`}>Lanjut →</button>
        </div>
      )}
    </main>
  )
}

function KanaQuestion({ kana, left, title, onAnswer }: { kana: Kana; left: number; title?: string; onAnswer: (right: boolean, ms: number) => void }) {
  const mode = useMemo<Mode>(() => sample(['read', 'write', 'type', 'listen'] as const, 1)[0], [])
  const [started] = useState(() => Date.now())
  const [result, setResult] = useState<{ right: boolean; given: string }>()
  const [typed, setTyped] = useState('')
  const choices = useMemo(() => shuffle([kana, ...distractors(kana)]), [kana])
  useEffect(() => { if (mode === 'listen') speak(kana.char) }, [mode, kana])

  const submit = (right: boolean, given: string) => {
    if (result) return
    setResult({ right, given })
    if (right) sfx.good(); else sfx.bad()
    speak(kana.char)
    answer(`kana:${kana.char}`, right, Date.now() - started, given, kana.romaji)
    if (right) setTimeout(() => onAnswer(true, Date.now() - started), 650)
  }
  useChoiceKeys(mode === 'type' ? 0 : choices.length, (i) => submit(choices[i] === kana, choices[i].romaji), result && !result.right ? () => onAnswer(false, Date.now() - started) : undefined)
  const mood: Expression = !result ? 'idle' : result.right ? 'happy' : 'sad'
  const label = (k: Kana) => (mode === 'read' ? k.romaji : k.char)

  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title ?? `Review · sisa ${left}`}</span>
        <Buddy mood={mood} size={70} />
      </div>
      <p className="text-sm opacity-70">{{ read: 'Bagaimana dibacanya?', write: 'Pilih kana yang tepat', type: 'Ketik romaji-nya', listen: 'Dengarkan, lalu pilih' }[mode]}</p>
      {mode === 'listen'
        ? <button onClick={() => speak(kana.char)} className={`${btn} bg-paper text-4xl`}>🔊</button>
        : <p lang="ja" className="text-7xl font-bold">{mode === 'write' ? kana.romaji : kana.char}</p>}

      {mode === 'type' ? (
        <form onSubmit={(e) => { e.preventDefault(); submit(romajiMatches(typed, kana), typed) }} className="flex gap-2">
          <input autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} disabled={!!result} autoCapitalize="off" autoComplete="off"
            className="min-w-0 flex-1 rounded-full border-[3px] border-ink bg-paper px-4 py-2 text-center text-xl" aria-label="romaji" />
          <button className={`${btn} bg-torii text-white`}>OK</button>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <motion.button key={c.char} whileTap={{ scale: .94 }} onClick={() => submit(c === kana, c.romaji)} lang="ja"
              animate={result && !result.right && result.given === c.romaji ? { x: [0, -6, 6, -4, 0] } : {}}
              className={`${btn} text-2xl ${result && c === kana ? 'bg-anemo text-white' : result?.given === c.romaji ? 'bg-torii text-white' : 'bg-paper'}`}>{label(c)}</motion.button>
          ))}
        </div>
      )}

      {result && !result.right && (
        <div className="space-y-2">
          <p><span lang="ja" className="text-2xl font-bold">{kana.char}</span> = <b>{kana.romaji}</b>{kana.mnemonic && <> · 💡 {kana.mnemonic}</>}</p>
          <button autoFocus onClick={() => onAnswer(false, Date.now() - started)} className={`${btn} bg-ink text-paper`}>Lanjut →</button>
        </div>
      )}
    </main>
  )
}
