import { useState } from 'react'
import { pref, setPref } from './speak'
import { speechSupported } from './useSpeech'

export function useInputMode() {
  const [mode, setMode] = useState<'voice' | 'type'>(() => (speechSupported ? pref('input-mode', 'voice') : 'type'))
  return [mode, (m: 'voice' | 'type') => { setPref('input-mode', m); setMode(m) }] as const
}
