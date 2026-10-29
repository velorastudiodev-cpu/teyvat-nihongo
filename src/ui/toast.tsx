import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Toast = { id: number; text: string; icon: string }
let listeners: ((t: Toast) => void)[] = []
let seq = 0
export const toast = (text: string, icon = '✦') => listeners.forEach((l) => l({ id: ++seq, text, icon }))

export function Toaster() {
  const [list, setList] = useState<Toast[]>([])
  useEffect(() => {
    const l = (t: Toast) => {
      setList((xs) => [...xs, t])
      setTimeout(() => setList((xs) => xs.filter((x) => x.id !== t.id)), 3800)
    }
    listeners.push(l)
    return () => { listeners = listeners.filter((x) => x !== l) }
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2" aria-live="polite">
      <AnimatePresence>
        {list.map((t) => (
          <motion.div key={t.id} initial={{ y: -30, opacity: 0, scale: .9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            className="rounded-full border-[3px] border-ink bg-geo px-5 py-2 font-display font-bold shadow-[3px_3px_0_var(--color-ink)]">
            {t.icon} {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
