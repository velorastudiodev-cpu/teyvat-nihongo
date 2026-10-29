import { useState } from 'react'
import { Icon } from '../../ui/Icon'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../../data/db'
import { GRAMMAR, patternById, type Pattern } from '../../data/grammar'
import { LEVELS, type Level } from '../../data/kanji'
import { parse, textOf } from '../../engine/sentence'
import { learn } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { btn, card } from '../../ui/kit'
import { Sentence } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { levelOpen } from '../kanji/content'
import { BlankExercise, BuildExercise } from './exercises'

export function GrammarHub() {
  const [level, setLevel] = useState<Level>('N5')
  const profile = useLiveQuery(() => db.profile.get('me'))
  const learned = useLiveQuery(() => db.items.where('kind').equals('grammar').primaryKeys(), []) ?? []
  const open = levelOpen(level, profile?.stage)
  const patterns = GRAMMAR.filter((p) => p.level === level)
  const next = patterns.find((p) => !learned.includes(`grammar:${p.id}`))
  return (
    <main className="space-y-5 py-4">
      <h1 className="font-display text-3xl font-extrabold">Grammar</h1>
      <div className="flex flex-wrap items-center gap-2">
        {LEVELS.map((l) => (
          <button key={l} onClick={() => setLevel(l)} className={`${btn} ${l === level ? 'bg-ink text-paper' : 'bg-paper'}`}>{levelOpen(l, profile?.stage) ? null : <Icon name="lock" className="h-3.5 w-3.5" />}{l}</button>
        ))}
        <span className="ml-auto text-sm"><b>{patterns.filter((p) => learned.includes(`grammar:${p.id}`)).length}</b> / {patterns.length} pola</span>
      </div>
      {open ? (
        <div className="flex flex-wrap gap-2">
          {next && <Link to={`/grammar/learn/${next.id}`} className={`${btn} bg-primary text-white`}>Pola baru: {next.title} →</Link>}
          <Link to="/games/particle-shooter" className={`${btn} bg-deep text-white`}><Icon name="target" className="h-4 w-4" /> Particle Shooter</Link>
          <Link to="/games/sentence-builder" className={`${btn} bg-paper`}><Icon name="blocks" className="h-4 w-4" /> Sentence Builder</Link>
          <Link to="/games/fill-blank-rush" className={`${btn} bg-paper`}><Icon name="bolt" className="h-4 w-4" /> Fill-Blank Rush</Link>
        </div>
      ) : <p className={`${card} text-sm`}><Icon name="lock" className="h-4 w-4" /> {level} terbuka setelah kamu mencapai tahap {level}.</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {patterns.map((p) => {
          const done = learned.includes(`grammar:${p.id}`)
          const body = <>
            <p className="font-display font-bold" lang="ja">{done && <Icon name="check" className="mr-1 h-4 w-4 text-anemo" />}{p.title}</p>
            <p className="text-sm opacity-70">{p.explain}</p>
          </>
          return open
            ? <Link key={p.id} to={`/grammar/learn/${p.id}`} className={`rounded-2xl border-2 p-3 transition-transform hover:-translate-y-0.5 ${done ? 'border-anemo bg-white' : 'border-transparent bg-paper-deep'}`}>{body}</Link>
            : <div key={p.id} className="rounded-2xl bg-paper-deep p-3 opacity-60">{body}</div>
        })}
      </div>
    </main>
  )
}

/** Five exercises alternating build / fill-in over the pattern's sentences. */
const plan = (p: Pattern) => [0, 1, 2, 3, 4].map((n) => ({ s: p.sentences[n % p.sentences.length], type: n % 2 ? 'blank' : 'build' as 'blank' | 'build' }))

export function GrammarLesson() {
  const p = patternById.get(`grammar:${useParams().id}`)
  const [phase, setPhase] = useState<'card' | 'drill' | 'done'>('card')
  const [queue, setQueue] = useState(() => (p ? plan(p) : []))
  const [n, setN] = useState(0)
  if (!p) return <p className="p-8">Pola tidak ditemukan.</p>
  const example = parse(p.sentences[0][0])

  if (phase === 'card') return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-4`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold uppercase tracking-widest text-anemo">Grammar {p.level}</span>
        <Buddy size={70} />
      </div>
      <h1 lang="ja" className="font-display text-3xl font-extrabold">{p.title}</h1>
      <p className="text-lg">{p.explain}</p>
      <button onClick={() => speak(textOf(example))} className="w-full cursor-pointer rounded-2xl bg-paper p-3 text-left">
        <Sentence tokens={example} className="text-2xl" />
        <p className="text-sm opacity-70"><Icon name="speaker" className="mr-1 h-4 w-4" />{p.sentences[0][1]}</p>
      </button>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => setPhase('drill')}>5 latihan →</button>
    </main>
  )
  if (phase === 'done') return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={130} /></div>
      <p className="font-display text-3xl font-extrabold">Pola dikuasai! +5 XP</p>
      <p lang="ja" className="text-2xl">{p.title}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/grammar" className={`${btn} bg-primary text-white`}>Pola berikutnya</Link>
        <Link to="/games/sentence-builder" className={`${btn} bg-deep text-white`}>Sentence Builder</Link>
      </div>
    </main>
  )

  const { s: [ja, tr], type } = queue[0]
  const onAnswer = async (right: boolean) => {
    const rest = right ? queue.slice(1) : [...queue.slice(1), queue[0]]
    setN(n + 1)
    if (rest.length) return setQueue(rest)
    await learn([{ id: `grammar:${p.id}`, kind: 'grammar', stage: p.level }])
    sfx.win()
    setPhase('done')
  }
  const title = `${p.title} · sisa ${queue.length}`
  return (
    <motion.div key={n} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {type === 'build'
        ? <BuildExercise ja={ja} tr={tr} title={title} onAnswer={onAnswer} />
        : <BlankExercise ja={ja} tr={tr} level={p.level} title={title} onAnswer={onAnswer} />}
    </motion.div>
  )
}
