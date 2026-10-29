import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Level, Word } from '../../data/kanji'
import { learn } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { Choice } from '../../ui/Choice'
import { btn, card, shuffle } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { nextWords, otherWordMeanings, otherWords } from '../kanji/content'

export function VocabLesson() {
  const level = (useParams().level ?? 'N5') as Level
  const [words, setWords] = useState<Word[]>()
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'see' | 'quiz' | 'done'>('see')
  const [round, setRound] = useState(0)
  useEffect(() => { nextWords(level).then(setWords) }, [level, round])
  useEffect(() => { if (phase === 'see' && words?.[i]) speak(words[i].reading) }, [words, i, phase])

  if (!words) return null
  if (!words.length) return <p className={`${card} mx-auto mt-6 max-w-lg text-center font-display text-2xl`}>Semua kosakata {level} sudah dipelajari! 🎉</p>
  if (phase === 'quiz') return <VocabQuiz words={words} onDone={async () => {
    await learn(words.map((w) => ({ id: `vocab:${w.word}`, kind: 'vocab', stage: w.level })))
    sfx.win(); setPhase('done')
  }} />
  if (phase === 'done') return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={130} /></div>
      <p className="font-display text-3xl font-extrabold">+{words.length * 5} XP</p>
      <p lang="ja" className="text-2xl">{words.map((w) => w.word).join('・')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button className={`${btn} bg-torii text-white`} onClick={() => { setI(0); setPhase('see'); setRound((r) => r + 1) }}>Pelajaran berikutnya</button>
        <Link to="/review" className={`${btn} bg-geo`}>Review</Link>
      </div>
    </main>
  )

  const w = words[i]
  const next = () => (i + 1 < words.length ? setI(i + 1) : setPhase('quiz'))
  return (
    <main className="mx-auto mt-4 max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">Kosakata {level} · {i + 1}/{words.length}</span>
        <Buddy size={70} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={w.word} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
          onDragEnd={(_, info) => Math.abs(info.offset.x) > 90 && next()}
          initial={{ opacity: 0, x: 60, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -80, rotate: -6 }}
          className={`${card} cursor-grab space-y-2 py-10 text-center active:cursor-grabbing`}>
          <p lang="ja" className="text-sm opacity-60">{w.reading !== w.word ? w.reading : ' '}</p>
          <button onClick={() => speak(w.reading)} lang="ja" className="cursor-pointer text-5xl font-bold">{w.word}</button>
          <p className="text-lg">{w.meaning}{!w.en && <span className="ml-2 rounded bg-paper-deep px-1.5 text-xs font-bold" title="Arti masih dalam bahasa Inggris">EN</span>}</p>
          <p className="text-xs opacity-50">geser kartu atau tekan tombol · tap kata untuk dengar</p>
        </motion.div>
      </AnimatePresence>
      <button className={`${btn} w-full bg-torii text-white`} onClick={next}>{i + 1 < words.length ? 'Berikutnya →' : 'Kuis cepat →'}</button>
    </main>
  )
}

function VocabQuiz({ words, onDone }: { words: Word[]; onDone: () => void }) {
  const [queue, setQueue] = useState(() => shuffle(words).map((w) => ({ w, type: (Math.random() < .5 ? 'meaning' : 'listen') as 'meaning' | 'listen' })))
  const [n, setN] = useState(0)
  return <WordQuestion key={n} w={queue[0].w} type={queue[0].type} title={`Kuis · sisa ${queue.length}`} onAnswer={(right) => {
    const rest = right ? queue.slice(1) : [...queue.slice(1), queue[0]]
    setN(n + 1)
    if (rest.length) setQueue(rest); else onDone()
  }} />
}

export function WordQuestion({ w, type, title, onAnswer }: { w: Word; type: 'meaning' | 'listen'; title: string; onAnswer: (right: boolean, given: string, ms: number) => void }) {
  const [wrong] = useState(() => (type === 'meaning' ? otherWordMeanings(w) : otherWords(w)))
  useEffect(() => { if (type === 'listen') speak(w.reading) }, [type, w])
  return (
    <Choice title={title} ask={type === 'meaning' ? 'Apa artinya?' : 'Dengarkan, lalu pilih katanya'}
      prompt={type === 'meaning'
        ? <p lang="ja" className="text-5xl font-bold">{w.word}</p>
        : <button onClick={() => speak(w.reading)} className={`${btn} bg-paper text-4xl`}>🔊</button>}
      answer={type === 'meaning' ? w.meaning : w.word} wrong={wrong} lang={type === 'listen' ? 'ja' : undefined}
      say={w.reading} onAnswer={onAnswer}
      explain={<p><span lang="ja" className="text-xl font-bold">{w.word}</span> <span lang="ja">（{w.reading}）</span> = {w.meaning}</p>} />
  )
}
