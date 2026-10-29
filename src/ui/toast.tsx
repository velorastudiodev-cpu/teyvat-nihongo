import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
import { onToast, type Toast } from './toastBus'

export function Toaster() {
  const [list, setList] = useState<Toast[]>([])
  useEffect(() => {
    const l = (t: Toast) => {
      setList((xs) => [...xs, t])
      setTimeout(() => setList((xs) => xs.filter((x) => x.id !== t.id)), 3800)
    }
    return onToast(l)
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
      <AnimatePresence>
        {list.map((t) => (
          <motion.div key={t.id} initial={{ y: -24, opacity: 0, scale: .95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -16 }}
            className="g-glass flex items-center gap-2 rounded-full py-2 pr-5 pl-2 font-display font-bold shadow-lg">
            <span className="g-chip h-8 w-8"><Icon name={t.icon} className="h-4.5 w-4.5" /></span>
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
