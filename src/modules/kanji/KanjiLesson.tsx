import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { examples, mainReading, type Kanji, type Level } from '../../data/kanji'
import { learn } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { Choice } from '../../ui/Choice'
import { btn, card, shuffle } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { StrokeOrder, StrokePad } from '../../ui/strokes'
import { nextKanji, otherMeanings, otherReadings } from './content'

export function KanjiCard({ k }: { k: Kanji }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <StrokeOrder char={k.char} size={150} />
        <div className="text-left">
          <p className="font-display text-3xl font-extrabold text-torii">{k.meaning}</p>
          <p className="text-sm opacity-60">{k.en.join(', ')} · {k.strokes} goresan</p>
          {k.on.length > 0 && <p lang="ja"><b className="font-display text-xs">ON</b> {k.on.join('、')}</p>}
          {k.kun.length > 0 && <p lang="ja"><b className="font-display text-xs">KUN</b> {k.kun.join('、')}</p>}
          {k.parts.length > 1 && <p className="text-sm">Komponen: <span lang="ja" className="text-lg">{k.parts.join(' + ')}</span></p>}
        </div>
      </div>
      {examples(k.char).length > 0 && (
        <ul className="space-y-1 rounded-2xl bg-paper p-3 text-left">
          {examples(k.char).map((w) => (
            <li key={w.word}>
              <button onClick={() => speak(w.reading)} className="cursor-pointer text-left hover:text-torii">
                🔊 <span lang="ja" className="text-lg font-bold">{w.word}</span> <span lang="ja">（{w.reading}）</span> <span className="text-sm opacity-70">{w.meaning}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function KanjiLesson() {
  const level = (useParams().level ?? 'N5') as Level
  const [kanji, setKanji] = useState<Kanji[]>()
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'see' | 'write' | 'quiz' | 'done'>('see')
  const [round, setRound] = useState(0)
  useEffect(() => { nextKanji(level).then(setKanji) }, [level, round])

  if (!kanji) return null
  if (!kanji.length) return <p className={`${card} mx-auto mt-6 max-w-lg text-center font-display text-2xl`}>Semua kanji {level} sudah dipelajari! 🎉</p>

  if (phase === 'quiz') return <KanjiQuiz kanji={kanji} onDone={async () => {
    await learn(kanji.map((k) => ({ id: `kanji:${k.char}`, kind: 'kanji', stage: k.level })))
    sfx.win(); setPhase('done')
  }} />
  if (phase === 'done') return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={130} /></div>
      <p className="font-display text-3xl font-extrabold">+{kanji.length * 5} XP</p>
      <p lang="ja" className="text-4xl">{kanji.map((k) => k.char).join(' ')}</p>
      <p>Masuk SRS! Review dan Stroke Duel akan menguatkannya.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button className={`${btn} bg-torii text-white`} onClick={() => { setI(0); setPhase('see'); setRound((r) => r + 1) }}>Pelajaran berikutnya</button>
        <Link to="/games/stroke-duel" className={`${btn} bg-anemo text-white`}>Stroke Duel</Link>
      </div>
    </main>
  )

  const k = kanji[i]
  const next = () => { if (i + 1 < kanji.length) { setI(i + 1); setPhase('see') } else setPhase('quiz') }
  return (
    <main className="mx-auto mt-4 max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">Kanji {level} · {i + 1}/{kanji.length}</span>
        <Buddy size={70} />
      </div>
      <motion.div key={`${k.char}${phase}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${card} text-center`}>
        {phase === 'see'
          ? <KanjiCard k={k} />
          : <><p className="mb-2 font-display font-bold">Tulis <span lang="ja">{k.char}</span> ({k.meaning}) mengikuti urutan goresan</p>
              <div className="flex justify-center"><StrokePad key={k.char} char={k.char} onDone={() => setTimeout(next, 700)} /></div></>}
      </motion.div>
      {phase === 'see'
        ? <button className={`${btn} w-full bg-torii text-white`} onClick={() => setPhase('write')}>Tulis ✍️ →</button>
        : <button className="w-full text-sm underline opacity-60" onClick={next}>Lewati latihan menulis</button>}
    </main>
  )
}

function KanjiQuiz({ kanji, onDone }: { kanji: Kanji[]; onDone: () => void }) {
  const [queue, setQueue] = useState(() => shuffle(kanji).map((k) => ({ k, type: (Math.random() < .5 ? 'meaning' : 'reading') as 'meaning' | 'reading' })))
  const [n, setN] = useState(0)
  const { k, type } = queue[0]
  return <KanjiQuestion key={n} k={k} type={type} title={`Kuis · sisa ${queue.length}`} onAnswer={(right) => {
    const rest = right ? queue.slice(1) : [...queue.slice(1), queue[0]]
    setN(n + 1)
    if (rest.length) setQueue(rest); else onDone()
  }} />
}

export function KanjiQuestion({ k, type, title, onAnswer }: { k: Kanji; type: 'meaning' | 'reading'; title: string; onAnswer: (right: boolean, given: string, ms: number) => void }) {
  const [wrong] = useState(() => (type === 'meaning' ? otherMeanings(k) : otherReadings(k)))
  return (
    <Choice title={title} ask={type === 'meaning' ? 'Apa artinya?' : 'Bacaan yang umum?'}
      prompt={<p lang="ja" className="text-7xl font-bold">{k.char}</p>}
      answer={type === 'meaning' ? k.meaning : mainReading(k)} wrong={wrong} lang={type === 'reading' ? 'ja' : undefined}
      say={mainReading(k)} onAnswer={onAnswer}
      explain={<p><span lang="ja" className="text-2xl font-bold">{k.char}</span> = <b>{k.meaning}</b> · <span lang="ja">{[...k.on, ...k.kun].slice(0, 4).join('、')}</span></p>} />
  )
}
