import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Expression } from '../characters'
import { Buddy } from './Buddy'
import { btn, card, shuffle } from './kit'
import { sfx } from './sfx'
import { speak } from './speak'
import { useChoiceKeys } from './useChoiceKeys'

export interface ChoiceProps {
  title: string
  ask: string
  prompt: ReactNode
  answer: string
  wrong: string[]
  lang?: 'ja'
  say?: string                    // spoken after answering
  explain?: ReactNode             // shown when wrong
  onAnswer: (right: boolean, given: string, ms: number) => void   // called once the learner moves on
}

/** Multiple choice with sound + motion feedback; right answers advance on their own, wrong ones wait. */
export function Choice({ title, ask, prompt, answer, wrong, lang, say, explain, onAnswer }: ChoiceProps) {
  const [choices] = useState(() => shuffle([answer, ...wrong]))   // parent keys this per question
  const started = useRef(Date.now())
  const [given, setGiven] = useState<string>()
  const right = given === answer

  const pick = (c: string) => {
    if (given !== undefined) return
    setGiven(c)
    const ms = Date.now() - started.current
    if (c === answer) sfx.good(); else sfx.bad()
    if (say) speak(say)
    if (c === answer) setTimeout(() => onAnswer(true, c, ms), 650)
  }
  useChoiceKeys(choices.length, (i) => pick(choices[i]), given !== undefined && !right ? () => onAnswer(false, given, Date.now() - started.current) : undefined)
  const mood: Expression = given === undefined ? 'idle' : right ? 'happy' : 'sad'

  return (
    <main className={`${card} mx-auto mt-4 max-w-lg space-y-4 text-center`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title}</span>
        <Buddy mood={mood} size={70} />
      </div>
      <p className="text-sm opacity-70">{ask}</p>
      <p className="sr-only" aria-live="assertive">{given === undefined ? '' : right ? 'Benar!' : `Salah. Jawaban yang benar: ${answer}`}</p>
      <div>{prompt}</div>
      <div className="grid grid-cols-2 gap-3">
        {choices.map((c) => (
          <motion.button key={c} whileTap={{ scale: .95 }} onClick={() => pick(c)} lang={lang}
            animate={given === c && !right ? { x: [0, -6, 6, -4, 0] } : {}}
            className={`${btn} ${lang ? 'text-2xl' : 'text-base'} ${given !== undefined && c === answer ? 'bg-anemo text-white' : given === c ? 'bg-torii text-white' : 'bg-paper'}`}>
            <span className="mr-2 align-super text-[10px] opacity-40" aria-hidden>{choices.indexOf(c) + 1}</span>{c}
          </motion.button>
        ))}
      </div>
      {given !== undefined && !right && (
        <div className="space-y-2">
          {explain}
          <button autoFocus onClick={() => onAnswer(false, given, Date.now() - started.current)} className={`${btn} bg-ink text-paper`}>Lanjut →</button>
        </div>
      )}
    </main>
  )
}
