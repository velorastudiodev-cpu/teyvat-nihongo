import { useState } from 'react'
import { motion } from 'framer-motion'
import { toKana } from 'wanakana'
import { btn } from './kit'
import { speechSupported, useSpeech } from './useSpeech'
import { useInputMode } from './useInputMode'

/** One answer, spoken (all recognizer alternatives) or typed (romaji becomes kana as you type). */
export function SpeakOrType({ onAnswer, disabled, hint = 'Tekan lalu ucapkan' }: { onAnswer: (alternatives: string[]) => void; disabled?: boolean; hint?: string }) {
  const [mode, setMode] = useInputMode()
  const { listening, error, listen, stop } = useSpeech()
  const [typed, setTyped] = useState('')

  return (
    <div className="space-y-2 text-center">
      {mode === 'voice' ? (
        <>
          <motion.button disabled={disabled} whileTap={{ scale: .9 }} aria-label="mikrofon"
            animate={listening ? { scale: [1, 1.08, 1], boxShadow: ['0 0 0 0 #d1402f66', '0 0 0 14px #d1402f00'] } : {}}
            transition={listening ? { repeat: Infinity, duration: 1.1 } : {}}
            onClick={() => (listening ? stop() : listen((alts, final) => { if (final) { stop(); onAnswer(alts) } }))}
            className={`mx-auto flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-[3px] border-ink text-4xl shadow-[3px_3px_0_var(--color-ink)] disabled:opacity-40 ${listening ? 'bg-torii' : 'bg-white'}`}>🎤</motion.button>
          <p className="text-sm opacity-70">{listening ? 'Mendengarkan… ucapkan sekarang' : hint}</p>
          {error && <p className="text-sm font-bold text-torii">{error}</p>}
        </>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (typed.trim()) { onAnswer([typed]); setTyped('') } }} className="flex gap-2">
          <input autoFocus value={typed} disabled={disabled} onChange={(e) => setTyped(toKana(e.target.value, { IMEMode: true }))} lang="ja"
            placeholder="ketik romaji → かな" autoComplete="off" autoCapitalize="off" aria-label="jawaban"
            className="min-w-0 flex-1 rounded-full border-[3px] border-ink bg-paper px-4 py-2 text-center text-xl" />
          <button disabled={disabled} className={`${btn} bg-torii text-white`}>OK</button>
        </form>
      )}
      {speechSupported && (
        <button onClick={() => { stop(); setMode(mode === 'voice' ? 'type' : 'voice') }} className="text-xs underline opacity-60">
          {mode === 'voice' ? 'Tidak bisa bicara sekarang? Ketik saja' : 'Pakai suara 🎤'}
        </button>
      )}
      {!speechSupported && <p className="text-xs opacity-60">Browser ini tidak mendukung pengenalan suara ja-JP (pakai Chrome/Edge). Mode ketik aktif.</p>}
    </div>
  )
}
