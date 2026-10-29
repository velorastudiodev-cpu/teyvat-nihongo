import { useEffect, useRef, useState } from 'react'

/**
 * A countdown driven by a deadline. It ticks a few times a second and, when time runs out,
 * calls `onExpire` once from the timer callback (not from an effect). start/stop/add are
 * meant for event handlers; `initialSeconds` starts it right away on mount.
 */
export function useDeadline(initialSeconds: number | undefined, onExpire: () => void) {
  const [deadline, setDeadline] = useState<number | undefined>(() => (initialSeconds === undefined ? undefined : Date.now() + initialSeconds * 1000))
  const [now, setNow] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(initialSeconds ?? 0)
  const expire = useRef(onExpire)
  useEffect(() => { expire.current = onExpire })

  useEffect(() => {
    if (deadline === undefined) return
    const t = setInterval(() => {
      const n = Date.now()
      setNow(n)
      if (n >= deadline) { clearInterval(t); setDeadline(undefined); setFrozen(0); expire.current() }
    }, 200)
    return () => clearInterval(t)
  }, [deadline])

  return {
    /** seconds left (fractional); frozen while stopped */
    left: deadline === undefined ? frozen : Math.max(0, (deadline - now) / 1000),
    running: deadline !== undefined,
    start: (seconds: number) => { const n = Date.now(); setNow(n); setDeadline(n + seconds * 1000) },
    stop: () => { if (deadline !== undefined) { setFrozen(Math.max(0, (deadline - Date.now()) / 1000)); setDeadline(undefined) } },
    add: (seconds: number) => setDeadline((d) => (d === undefined ? d : d + seconds * 1000)),
  }
}
