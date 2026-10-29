import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Level } from '../../data/kanji'
import { parse, textOf } from '../../engine/sentence'
import type { Expression } from '../../characters'
import { Buddy } from '../../ui/Buddy'
import { Choice } from '../../ui/Choice'
import { btn, card, shuffle } from '../../ui/kit'
import { Ruby, Sentence } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { blankOptions } from './blanks'

export type OnAnswer = (right: boolean, given: string, ms: number) => void
export function BlankExercise({ ja, tr, level, title, blankAt, onAnswer }: { ja: string; tr: string; level: Level; title: string; blankAt?: number; onAnswer: OnAnswer }) {
  const tokens = parse(ja)
  const blank = blankAt ?? tokens.findIndex((t) => t.key)
  const [wrong] = useState(() => blankOptions(tokens[blank], level))
  return (
    <Choice title={title} ask={`Lengkapi kalimatnya · "${tr}"`} answer={tokens[blank].text} wrong={wrong} lang="ja" say={textOf(tokens)}
      prompt={<Sentence tokens={tokens} blank={blank} className="text-3xl" />}
      explain={<Sentence tokens={tokens} className="text-xl" />} onAnswer={onAnswer} />
  )
}

/** Tap tiles into order. Only the canonical word order counts as right. */
export function BuildExercise({ ja, tr, title, onAnswer }: { ja: string; tr: string; title: string; onAnswer: OnAnswer }) {
  const tokens = parse(ja)
  const [started] = useState(() => Date.now())
  const [pool, setPool] = useState(() => {
    let order = shuffle(tokens.map((_, i) => i))
    while (tokens.length > 1 && order.every((x, i) => tokens[x].text === tokens[i].text)) order = shuffle(order)
    return order
  })
  const [line, setLine] = useState<number[]>([])
  const [result, setResult] = useState<boolean>()

  const check = () => {
    const right = line.map((i) => tokens[i].text).join(' ') === tokens.map((t) => t.text).join(' ')
    setResult(right)
    if (right) sfx.good(); else sfx.bad()
    speak(textOf(tokens))
    if (right) setTimeout(() => onAnswer(true, line.map((i) => tokens[i].text).join(''), Date.now() - started), 900)
  }
  const tile = (i: number, from: 'pool' | 'line') => (
    <motion.button layout key={i} lang="ja" disabled={result !== undefined}
      onClick={() => { sfx.pop(); if (from === 'pool') { setPool(pool.filter((x) => x !== i)); setLine([...line, i]) } else { setLine(line.filter((x) => x !== i)); setPool([...pool, i]) } }}
      className="cursor-pointer rounded-xl border-2 border-gold/70 bg-white px-3 py-1 text-xl shadow-md">
      <Ruby token={tokens[i]} />
    </motion.button>
  )
  const mood: Expression = result === undefined ? 'idle' : result ? 'happy' : 'sad'

  return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title}</span>
        <Buddy mood={mood} size={70} />
      </div>
      <p className="text-sm opacity-70">Susun kalimat:</p>
      <p className="font-display text-xl font-bold">{tr}</p>
      <div className={`flex min-h-16 flex-wrap items-end justify-center gap-2 rounded-2xl border-2 border-dashed p-2 ${result === true ? 'border-anemo bg-anemo/10' : result === false ? 'border-wrong bg-wrong/10' : 'border-ink/30'}`}>
        {line.map((i) => tile(i, 'line'))}
      </div>
      <div className="flex min-h-14 flex-wrap items-end justify-center gap-2">{pool.map((i) => tile(i, 'pool'))}</div>
      {result === undefined && <button className={`${btn} w-full bg-primary text-white`} disabled={pool.length > 0} onClick={check}>Cek</button>}
      {result === false && (
        <div className="space-y-2">
          <Sentence tokens={tokens} className="text-xl" />
          <button autoFocus onClick={() => onAnswer(false, line.map((i) => tokens[i].text).join(''), Date.now() - started)} className={`${btn} bg-ink text-paper`}>Lanjut →</button>
        </div>
      )}
    </main>
  )
}
