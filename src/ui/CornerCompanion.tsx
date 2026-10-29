import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCharacter, type Expression } from '../characters'
import { Chibi } from '../characters/Chibi'
import type { Profile } from '../data/db'
import { speak } from './speak'

const IDLE_MS = 60_000

/** The companion keeps you company in the corner: dozes off when idle, talks when tapped. */
export function CornerCompanion({ profile }: { profile: Profile }) {
  const c = getCharacter(profile.companionId)
  const [expr, setExpr] = useState<Expression>('idle')
  const [line, setLine] = useState<string>()
  useEffect(() => {
    let t = setTimeout(() => setExpr('sleep'), IDLE_MS)
    const wake = () => { clearTimeout(t); setExpr((e) => (e === 'sleep' ? 'idle' : e)); t = setTimeout(() => setExpr('sleep'), IDLE_MS) }
    window.addEventListener('pointerdown', wake); window.addEventListener('keydown', wake)
    return () => { clearTimeout(t); window.removeEventListener('pointerdown', wake); window.removeEventListener('keydown', wake) }
  }, [])
  if (!c) return null
  return (
    <div className="fixed bottom-3 left-3 z-40 hidden items-end gap-1 xl:flex">
      <motion.button whileTap={{ scale: .9 }} aria-label={`Sapa ${c.name}`} className="cursor-pointer" onClick={() => {
        const l = c.lines[Math.floor(Math.random() * c.lines.length)]
        setLine(`${l.ja} · ${l.tr}`); setExpr('happy'); speak(l.ja)
        setTimeout(() => { setExpr('idle'); setLine(undefined) }, 2500)
      }}>
        <Chibi id={c.id} expression={expr} size={90} outfit={profile.outfit} />
      </motion.button>
      <AnimatePresence>
        {line && <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          className="mb-10 max-w-56 rounded-2xl border-[3px] border-ink bg-white px-3 py-1 text-sm shadow-[2px_2px_0_var(--color-ink)]">{line}</motion.p>}
      </AnimatePresence>
    </div>
  )
}
