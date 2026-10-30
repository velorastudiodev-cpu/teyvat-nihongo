import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Hearts, Icon, type IconName } from '../../ui/Icon'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toastBus'
import { useDeadline } from '../../ui/useDeadline'
import { ItemQuestion } from '../Review'
import type { Q } from '../daily/pools'

/** A round medallion: the figure's sign in a ringed seal. Figures appear as emblems, never portraits. */
export function Emblem({ icon, color, label, size = 64, dark }: { icon: IconName; color: string; label?: string; size?: number; dark?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center rounded-full shadow-lg ring-2 ring-gold ring-offset-2 ring-offset-paper"
      style={{ width: size, height: size, background: `radial-gradient(circle at 50% 35%, ${color}, ${dark ? '#0d0b16' : '#1c2030'} 82%)` }}>
      <Icon name={icon} className="text-white" style={{ width: size * 0.52, height: size * 0.52 }} />
      {label && <span className="absolute -bottom-1.5 rounded-full bg-night px-1.5 font-title text-[10px] font-bold text-gold-soft ring-1 ring-gold">{label}</span>}
    </span>
  )
}

export interface Rules {
  hp: number; lives: number; seconds?: number
  damage?: (base: number, hp: number) => number          // turn a base hit into this foe's damage
  wrongCost?: (hp: number) => number                     // lives lost on a miss
  revive?: number                                        // revive once at this share of HP
  onAnswer?: (right: boolean) => void                    // side effects (e.g. Pantalone's wager)
}

/**
 * Battle against a foe: each right answer strikes (faster is harder), each miss costs a life. Questions
 * come from the pool, and every answer is a real SRS review.
 */
export function Battle({ name, emblem, pool, rules, onEnd }: { name: string; emblem: ReactNode; pool: Q[]; rules: Rules; onEnd: (won: boolean) => void }) {
  const [n, setN] = useState(0)
  const [hp, setHp] = useState(rules.hp)
  const [lives, setLives] = useState(rules.lives)
  const [revived, setRevived] = useState(false)
  const [hit, setHit] = useState<number>()
  const [done, setDone] = useState(false)
  const timer = useDeadline(rules.seconds, () => resolve(false, (rules.seconds ?? 0) * 1000))

  function resolve(right: boolean, ms: number) {
    if (done) return
    rules.onAnswer?.(right)
    let nextHp = hp, nextLives = lives
    if (right) {
      const dmg = Math.round((rules.damage ?? ((b) => b))(20 + Math.max(0, 10 - ms / 1000), hp))
      nextHp = hp - dmg; setHit(dmg); sfx.pop()
      if (nextHp <= 0 && rules.revive && !revived) { nextHp = Math.round(rules.hp * rules.revive); setRevived(true); toast(`${name} bangkit kembali!`, 'warning') }
    } else { nextLives = lives - (rules.wrongCost?.(hp) ?? 1); setHit(undefined); sfx.bad() }
    setHp(nextHp); setLives(nextLives); setN(n + 1)
    const over = nextHp <= 0 || nextLives <= 0
    if (over) { setDone(true); timer.stop(); onEnd(nextHp <= 0) }
    else if (rules.seconds) timer.start(rules.seconds)
  }

  return (
    <div className="mx-auto max-w-lg space-y-2 py-2">
      <div className="g-panel flex items-center gap-3 p-3">
        <motion.div key={n} animate={hit ? { x: [0, -8, 8, -4, 0] } : {}}>{emblem}</motion.div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-black">{name}</p>
          <div className="h-3 overflow-hidden rounded-full bg-paper-deep"><motion.div className="h-full bg-gradient-to-r from-wrong to-primary" animate={{ width: `${(Math.max(0, hp) / rules.hp) * 100}%` }} /></div>
          <p className="flex items-center gap-2 text-sm">HP {Math.max(0, hp)} / {rules.hp} <Hearts lives={lives} />
            {hit ? <span className="font-bold text-wrong">-{hit}</span> : null}
            {rules.seconds ? <span className="ml-auto flex items-center gap-1 font-bold"><Icon name="timer" className="h-4 w-4" />{Math.ceil(timer.left)}s</span> : null}
          </p>
        </div>
      </div>
      {!done && pool.length > 0 && <ItemQuestion key={n} item={pool[n % pool.length]} title={`Serangan ${n + 1}`} onDone={(right, ms) => resolve(right, ms)} />}
    </div>
  )
}
