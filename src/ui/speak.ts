// Per-viewer preferences: plain localStorage, wrapped because it can be unavailable.
export function pref<T extends string>(key: string, fallback: T): T {
  try { return (localStorage.getItem(key) as T) ?? fallback } catch { return fallback }
}
export function setPref(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* private mode: keep the default */ }
}

export const RATES = ['0.75', '1', '1.25'] as const
export const getRate = () => Number(pref('tts-rate', '1'))

export function speak(text: string, rate = getRate()) {
  if (!('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = rate
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}
