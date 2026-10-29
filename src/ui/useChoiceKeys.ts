import { useEffect } from 'react'

/** Number keys 1–n pick a choice; Enter/Space moves on when `onNext` is given. Ignored while typing in a field. */
export function useChoiceKeys(count: number, onPick: (index: number) => void, onNext?: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= count) { e.preventDefault(); onPick(n - 1) }
      else if (onNext && e.key === 'Enter') { e.preventDefault(); onNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}
