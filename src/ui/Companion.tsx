import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Chibi } from '../characters/Chibi'
import { getCharacter, type Expression } from '../characters'
import { speak } from './speak'

const IDLE_MS = 45_000

/** Companion chibi: falls asleep when the app is idle, cheers when tapped. */
export function Companion({ id, size = 220, outfit }: { id: string; size?: number; outfit?: string }) {
  const c = getCharacter(id)
  const [expr, setExpr] = useState<Expression>('idle')
  const [line, setLine] = useState(c?.lines[0])

  useEffect(() => {
    let t = setTimeout(() => setExpr('sleep'), IDLE_MS)
    const wake = () => {
      clearTimeout(t)
      setExpr((e) => (e === 'sleep' ? 'idle' : e))
      t = setTimeout(() => setExpr('sleep'), IDLE_MS)
    }
    const events = ['pointerdown', 'keydown', 'pointermove'] as const
    events.forEach((e) => window.addEventListener(e, wake))
    return () => { clearTimeout(t); events.forEach((e) => window.removeEventListener(e, wake)) }
  }, [])

  if (!c) return null
  const tap = () => {
    const next = c.lines[Math.floor(Math.random() * c.lines.length)]
    setLine(next)
    setExpr('happy')
    speak(next.ja)
    setTimeout(() => setExpr('idle'), 1600)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div key={line?.ja + expr} initial={{ opacity: 0, y: 6, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .15 }}
          className="relative rounded-2xl border-[3px] border-ink bg-white px-4 py-2 text-center shadow-[3px_3px_0_var(--color-ink)]">
          {expr === 'sleep' ? <p className="font-display">すやすや… <span className="text-sm opacity-60">(sedang tidur, gerakkan kursor)</span></p>
            : <><p className="text-lg font-bold">{line?.ja}</p><p className="text-sm opacity-70">{line?.tr}</p></>}
        </motion.div>
      </AnimatePresence>
      <motion.button whileTap={{ scale: .9 }} onClick={tap} aria-label={`Sapa ${c.name}`} className="cursor-pointer">
        <Chibi id={id} expression={expr} size={size} outfit={outfit} />
      </motion.button>
    </div>
  )
}
