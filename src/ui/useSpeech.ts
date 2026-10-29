import { useEffect, useRef, useState } from 'react'

/* Minimal typing for the Web Speech API (not in lib.dom for every TS version). */
interface RecResult { isFinal: boolean; length: number; [i: number]: { transcript: string } }
interface RecEvent { resultIndex: number; results: { length: number; [i: number]: RecResult } }
interface Recognition {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number
  onresult: ((e: RecEvent) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null
  start(): void; stop(): void; abort(): void
}
type Ctor = new () => Recognition
const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor }
const Recognizer = w.SpeechRecognition ?? w.webkitSpeechRecognition

export const speechSupported = !!Recognizer

const ERRORS: Record<string, string> = {
  'not-allowed': 'Izin mikrofon ditolak. Izinkan mikrofon di browser, atau pakai mode ketik.',
  'service-not-allowed': 'Layanan suara tidak tersedia di browser ini. Pakai mode ketik.',
  'no-speech': 'Tidak terdengar suara. Coba lagi lebih dekat ke mikrofon.',
  'audio-capture': 'Mikrofon tidak ditemukan.',
  network: 'Pengenalan suara butuh koneksi internet di Chrome.',
}

/**
 * ja-JP speech recognition. `onResult` gets every alternative (best first) and whether it's final.
 * Continuous mode restarts itself when the browser ends a session after silence.
 */
export function useSpeech() {
  const rec = useRef<Recognition | null>(null)
  const keepAlive = useRef(false)
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => () => { keepAlive.current = false; rec.current?.abort() }, [])

  function listen(onResult: (alternatives: string[], final: boolean) => void, { continuous = false } = {}) {
    if (!Recognizer) return setError(ERRORS['service-not-allowed'])
    rec.current?.abort()
    const r = new Recognizer()
    r.lang = 'ja-JP'
    r.continuous = continuous
    r.interimResults = continuous
    r.maxAlternatives = 5
    r.onresult = (e) => {
      const res = e.results[e.results.length - 1]
      onResult(Array.from({ length: res.length }, (_, i) => res[i].transcript), res.isFinal)
    }
    r.onerror = (e) => { if (e.error !== 'aborted') setError(ERRORS[e.error] ?? `Error suara: ${e.error}`); if (e.error === 'not-allowed') keepAlive.current = false }
    r.onend = () => { if (keepAlive.current) { try { r.start() } catch { setListening(false) } } else setListening(false) }
    keepAlive.current = continuous
    rec.current = r
    setError(undefined)
    setListening(true)
    r.start()
  }

  function stop() {
    keepAlive.current = false
    rec.current?.stop()
    setListening(false)
  }

  return { supported: speechSupported, listening, error, listen, stop }
}
