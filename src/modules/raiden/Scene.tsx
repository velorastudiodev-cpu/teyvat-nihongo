import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Chibi } from '../../characters/Chibi'
import type { Expression } from '../../characters'
import { parse, textOf } from '../../engine/sentence'
import { Dialogue } from '../../ui/Dialogue'
import { Icon } from '../../ui/Icon'
import { Sentence } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { SPEAKER, type Beat, type Line, type Option } from './talks'

const isQuestion = (b: Beat): b is Extract<Beat, { options: Option[] }> => 'options' in b
const say = (ja: string) => speak(textOf(parse(ja)))

/**
 * Plays a conversation like a Genshin cutscene: the speaker stands over the scene, lines appear in the
 * dialogue box (tap to continue), and questions offer Japanese replies as dialogue options. Translations of
 * the replies stay hidden until you choose, so the choice tests your Japanese.
 */
export function Scene({ beats, onEnd }: { beats: Beat[]; onEnd: (good: number) => void }) {
  const [i, setI] = useState(0)
  const [reply, setReply] = useState<{ option: Option; line: Line }>()
  const [good, setGood] = useState(0)
  const [showTr, setShowTr] = useState(true)
  const beat = beats[i]
  const line: Line = reply?.line ?? beat
  const mood: Expression = reply ? (reply.option.ok ? 'happy' : 'sad') : line.who === 'ei' ? 'happy' : 'idle'

  useEffect(() => { say(line.ja) }, [line.ja])

  const next = () => {
    if (isQuestion(beat) && !reply) return
    setReply(undefined)
    if (i + 1 < beats.length) setI(i + 1)
    else onEnd(good)
  }
  const choose = (o: Option) => {
    if (o.ok) { sfx.good(); setGood(good + 1) } else sfx.bad()
    setReply({ option: o, line: o.reply })
  }
  const asking = isQuestion(beat) && !reply

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-2xl flex-col justify-end gap-3 pt-4">
      <div className="flex justify-end">
        <button onClick={() => setShowTr(!showTr)} className="g-glass flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
          <Icon name="eye" className="h-4 w-4" /> Arti: {showTr ? 'tampil' : 'sembunyi'}
        </button>
      </div>
      <div className="relative flex flex-1 items-end justify-center">
        <div className="absolute bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--r-glow)_0%,transparent_68%)] opacity-80" />
        {line.who !== 'sara'
          ? <motion.div key={line.who} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative"><Chibi id={line.who === 'yae' ? 'yae' : 'raiden'} expression={mood} size={300} /></motion.div>
          : <div className="relative mb-10 flex h-40 w-40 items-center justify-center rounded-full border border-[#e3d0ff]/50 bg-night/50 text-[#e3d0ff]"><Icon name="scroll" className="h-20 w-20" /></div>}
      </div>

      <AnimatePresence>
        {asking && (
          <motion.ul initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="ml-auto w-full max-w-md space-y-2">
            {beat.options.map((o) => (
              <li key={o.ja}>
                <button onClick={() => choose(o)} className="g-glass flex w-full cursor-pointer items-center gap-3 rounded-full py-1 pr-5 pl-2 text-left transition-transform hover:translate-x-1 hover:ring-2 hover:ring-gold/70">
                  <span className="g-chip h-8 w-8 shrink-0"><Icon name="chat" className="h-4 w-4" /></span>
                  <Sentence tokens={parse(o.ja)} className="text-base font-bold text-paper" />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div role="button" tabIndex={0} aria-disabled={asking} onClick={next} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next() } }}
        className={`block w-full text-left ${asking ? '' : 'cursor-pointer'}`}>
        <Dialogue name={`${SPEAKER[line.who].name} · ${SPEAKER[line.who].nameJa}`} voice={textOf(parse(line.ja))}
          ja={<Sentence tokens={parse(line.ja)} className="text-lg leading-[2.2] text-[#f6f1e6]" />} tr={showTr ? line.tr : undefined}>
          {reply && (
            <p className={`mt-2 flex items-center gap-1.5 text-sm font-bold ${reply.option.ok ? 'text-[#d9c4ff]' : 'text-[#ffb3a8]'}`}>
              <Icon name={reply.option.ok ? 'sparkle' : 'cross'} className="h-4 w-4" />
              {reply.option.ok ? 'Jawaban yang baik · ikatan +10' : 'Dikoreksi'} · kamu memilih: <span lang="ja">{textOf(parse(reply.option.ja))}</span> ({reply.option.tr})
            </p>
          )}
          {!asking && <p className="mt-2 text-right text-xs text-paper/50">ketuk untuk lanjut</p>}
        </Dialogue>
      </div>
    </div>
  )
}
