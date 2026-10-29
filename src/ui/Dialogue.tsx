import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { speak } from './speak'

/**
 * A Genshin-style dialogue box: dark glass, the speaker's name in gold above a thin rule, the Japanese
 * line with a replay button, and the Indonesian meaning underneath.
 */
export function Dialogue({ name, ja, tr, children, voice = true }: { name: string; ja: ReactNode; tr?: string; children?: ReactNode; voice?: boolean | string }) {
  const text = typeof voice === 'string' ? voice : typeof ja === 'string' ? ja : ''
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="g-glass relative rounded-2xl px-5 pt-3 pb-4 shadow-xl">
      <div className="mb-1.5 flex items-center gap-3">
        <span className="font-display text-sm font-extrabold tracking-wide text-[#f2cf7a]">{name}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-[#f2cf7a]/70 to-transparent" />
        {voice && text && (
          <button onClick={() => speak(text)} aria-label="Putar suara" className="cursor-pointer rounded-full p-1 text-gold-soft hover:bg-white/10">
            <Icon name="speaker" className="h-5 w-5" />
          </button>
        )}
      </div>
      <div lang="ja" className="text-lg leading-relaxed font-bold text-[#f6f1e6]">{ja}</div>
      {tr && <p className="mt-1 text-sm text-paper/70">{tr}</p>}
      {children}
      <span className="absolute right-4 bottom-2 text-[#f2cf7a] opacity-70"><Icon name="chevronDown" className="h-3.5 w-3.5" /></span>
    </motion.div>
  )
}
