import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../../ui/Icon'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { kanaId, type Kana, type Script } from '../../data/kana'
import { learn } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { btn, card, shuffle } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import type { Expression } from '../../characters'
import { advanceIfComplete, distractors, nextLesson } from './progress'

export function Lesson() {
  const script = (useParams().script ?? 'hiragana') as Script
  const [kana, setKana] = useState<Kana[]>()
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'done'>('intro')
  const [i, setI] = useState(0)
  const [batch, setBatch] = useState(0)
  useEffect(() => { nextLesson(script).then(setKana) }, [script, batch])

  if (!kana) return null
  if (!kana.length) return (
    <main className={`${card} mx-auto mt-6 max-w-lg text-center`}>
      <p className="font-display text-2xl font-extrabold">Semua {script} sudah dipelajari!</p>
      <Link to="/review" className={`${btn} mt-4 inline-block bg-geo`}>Review →</Link>
    </main>
  )

  if (phase === 'quiz') return <LessonQuiz kana={kana} onDone={async () => { await learn(kana.map((k) => ({ id: kanaId(k), kind: 'kana', stage: k.script }))); await advanceIfComplete(); sfx.win(); setPhase('done') }} />
  if (phase === 'done') return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={130} /></div>
      <p className="font-display text-3xl font-extrabold">+{kana.length * 5} XP</p>
      <p lang="ja" className="text-3xl">{kana.map((k) => k.char).join(' ')}</p>
      <p>Masuk ke SRS. Kartu ini akan muncul lagi di review pada waktu yang pas.</p>
      <div className="flex justify-center gap-2">
        <button className={`${btn} bg-primary text-white`} onClick={() => { setI(0); setPhase('intro'); setBatch(batch + 1) }}>Pelajaran berikutnya</button>
        <Link to="/games/kana-rain" className={`${btn} bg-deep text-white`}>Main Kana Rain</Link>
      </div>
    </main>
  )

  const k = kana[i]
  return (
    <main className="mx-auto mt-4 max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{script} · grup {k.group} · {i + 1}/{kana.length}</span>
        <Buddy size={70} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={k.char} initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }} transition={{ duration: .2 }}
          className={`${card} space-y-2 text-center`}>
          <button onClick={() => speak(k.char)} lang="ja" className="cursor-pointer text-8xl font-bold">{k.char}</button>
          <p className="font-display text-3xl font-extrabold text-wrong">{k.romaji}</p>
          {k.mnemonic && <p className="rounded-2xl bg-soft p-3"><Icon name="bulb" className="mr-1 h-4 w-4 text-geo" />{k.mnemonic}</p>}
          <p className="text-xs opacity-60">Tap hurufnya untuk mendengar · <Link to={`/write/${k.char}`} className="underline"><Icon name="brush" className="h-3.5 w-3.5" /> latihan menulis</Link></p>
        </motion.div>
      </AnimatePresence>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => {
        if (i + 1 < kana.length) { setI(i + 1); speak(kana[i + 1].char) } else setPhase('quiz')
      }}>{i + 1 < kana.length ? 'Berikutnya →' : 'Kuis cepat →'}</button>
    </main>
  )
}

/** Each new kana must be answered right once; misses go to the back of the queue. */
function LessonQuiz({ kana, onDone }: { kana: Kana[]; onDone: () => void }) {
  const [queue, setQueue] = useState(() => shuffle(kana))
  const [mood, setMood] = useState<Expression>('idle')
  const [picked, setPicked] = useState<string>()
  const k = queue[0]
  const choices = useMemo(() => shuffle([k, ...distractors(k)]), [k])

  const pick = (c: Kana) => {
    if (picked) return
    const right = c === k
    setPicked(c.char)
    setMood(right ? 'happy' : 'sad')
    if (right) sfx.good(); else sfx.bad()
    speak(k.char)
    setTimeout(() => {
      setPicked(undefined)
      setMood('idle')
      const rest = right ? queue.slice(1) : [...queue.slice(1), k]
      if (rest.length) setQueue(rest); else onDone()
    }, right ? 600 : 1300)
  }

  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">Kuis · sisa {queue.length}</span>
        <Buddy mood={mood} size={70} />
      </div>
      <p lang="ja" className="text-7xl font-bold">{k.char}</p>
      <div className="grid grid-cols-2 gap-3">
        {choices.map((c) => (
          <motion.button key={c.char} whileTap={{ scale: .94 }} onClick={() => pick(c)}
            className={`${btn} text-xl ${picked && c === k ? 'bg-deep text-white' : picked === c.char ? 'bg-primary text-white' : 'bg-paper'}`}>{c.romaji}</motion.button>
        ))}
      </div>
    </main>
  )
}
