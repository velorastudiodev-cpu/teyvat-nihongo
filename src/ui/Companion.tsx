import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Chibi } from '../characters/Chibi'
import { getCharacter, type Expression } from '../characters'
import { Dialogue } from './Dialogue'
import { speak } from './speak'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { companionVoice } from '../modules/raiden/lines'

const IDLE_MS = 45_000

/** Companion chibi with a dialogue box: falls asleep when the app is idle, says a new line when tapped. */
export function Companion({ id, size = 220, outfit, greeting }: { id: string; size?: number; outfit?: string; greeting?: { ja: string; tr: string } }) {
  const c = getCharacter(id)
  const profile = useLiveQuery(() => db.profile.get('me'))
  const voice = c && companionVoice(profile, c)
  const [expr, setExpr] = useState<Expression>('idle')
  const [picked, setLine] = useState<{ ja: string; tr: string }>()
  const line = picked ?? greeting ?? voice?.lines[0]

  useEffect(() => {
    let t = setTimeout(() => setExpr('sleep'), IDLE_MS)
    const wake = () => {
      clearTimeout(t)
      setExpr((e) => (e === 'sleep' ? 'idle' : e))
      t = setTimeout(() => setExpr('sleep'), IDLE_MS)
    }
    const events = ['pointerdown', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, wake))
    return () => { clearTimeout(t); events.forEach((e) => window.removeEventListener(e, wake)) }
  }, [])

  if (!c || !voice) return null
  const tap = () => {
    const next = voice.lines[Math.floor(Math.random() * voice.lines.length)]
    setLine(next)
    setExpr('happy')
    speak(next.ja)
    setTimeout(() => setExpr('idle'), 1600)
  }

  return (
    <div className="flex flex-col items-center">
      <motion.button whileTap={{ scale: .94 }} onClick={tap} aria-label={`Sapa ${c.name}`} className="relative cursor-pointer">
        <span className="absolute inset-x-6 bottom-1 h-7 rounded-[50%] bg-[radial-gradient(circle,rgba(0,0,0,.28)_0%,transparent_68%)]" />
        <Chibi id={id} expression={expr} size={size} outfit={outfit} />
      </motion.button>
      <div className="-mt-3 w-full max-w-md">
        {expr === 'sleep'
          ? <Dialogue name={voice.name} ja="すやすや…" tr="(sedang tidur, sentuh layar untuk membangunkan)" voice={false} />
          : <Dialogue name={voice.name} ja={line?.ja} tr={line?.tr} voice={line?.ja} />}
      </div>
    </div>
  )
}
