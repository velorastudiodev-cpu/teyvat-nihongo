import { useCallback, useEffect, useRef, useState } from 'react'
import { Capacitor, type PluginListenerHandle } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

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

/**
 * The Android WebView has no Web Speech API, so the APK drives the system recognizer through a
 * Capacitor plugin behind the same Recognition shape. One start() is one utterance; continuous
 * mode is kept alive by useSpeech restarting it from onend, as browsers do after silence.
 */
class NativeRecognition implements Recognition {
  lang = 'ja-JP'; continuous = false; interimResults = false; maxAlternatives = 5
  onresult: Recognition['onresult'] = null; onerror: Recognition['onerror'] = null; onend: Recognition['onend'] = null
  private active = false
  private subs: Promise<PluginListenerHandle>[] = []
  private timers: ReturnType<typeof setTimeout>[] = []

  start() { this.active = true; void this.run() }
  stop() { void SpeechRecognition.stop().catch(() => {}) }
  abort() { this.onresult = null; this.onend = null; this.stop(); this.finish() }

  private emit(matches: string[] = [], isFinal: boolean) {
    if (!matches.length) return
    const res = Object.assign(matches.map((transcript) => ({ transcript })), { isFinal })
    this.onresult?.({ resultIndex: 0, results: [res] })
  }

  private async run() {
    const perm = await SpeechRecognition.requestPermissions().catch(() => undefined)
    if (!this.active) return
    if (perm?.speechRecognition !== 'granted') { this.onerror?.({ error: 'not-allowed' }); return this.finish() }
    const options = { language: this.lang, maxResults: this.maxAlternatives, popup: false }
    try {
      if (!this.interimResults) {
        const r = await SpeechRecognition.start({ ...options, partialResults: false })
        this.emit(r.matches, true)
        return this.finish()
      }
      this.subs.push(SpeechRecognition.addListener('partialResults', (d) => this.emit(d.matches, false)))
      // final results can land just after "stopped", so wind down a moment later
      this.subs.push(SpeechRecognition.addListener('listeningState', (d) => { if (d.status === 'stopped') this.timers.push(setTimeout(() => this.finish(), 600)) }))
      await SpeechRecognition.start({ ...options, partialResults: true })
      // errors such as silence end a partial session without any event; notice them by polling
      const poll = () => this.timers.push(setTimeout(async () => {
        if (!this.active) return
        const { listening } = await SpeechRecognition.isListening().catch(() => ({ listening: false }))
        if (listening) poll(); else this.finish()
      }, 1500))
      poll()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      this.onerror?.({ error: /match|timeout/i.test(msg) ? 'no-speech' : /permission/i.test(msg) ? 'not-allowed' : msg })
      this.finish()
    }
  }

  private finish() {
    if (!this.active) return
    this.active = false
    this.timers.forEach(clearTimeout); this.timers = []
    this.subs.forEach((s) => s.then((h) => h.remove()).catch(() => {})); this.subs = []
    this.onend?.()
  }
}

const native = Capacitor.isNativePlatform()
const Recognizer: Ctor | undefined = native ? NativeRecognition : w.SpeechRecognition ?? w.webkitSpeechRecognition

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

  const listen = useCallback((onResult: (alternatives: string[], final: boolean) => void, { continuous = false } = {}) => {
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
  }, [])

  const stop = useCallback(() => {
    keepAlive.current = false
    rec.current?.stop()
    setListening(false)
  }, [])

  return { supported: speechSupported, listening, error, listen, stop }
}
