import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { isMastered } from '../engine/srs/srs'
import { textOf, type Token } from '../engine/sentence'
import { pref, setPref } from './speak'

export type FuriganaMode = 'all' | 'auto' | 'none'
const KANJI = /[一-龯々]/g

/** Kanji whose SRS stability says you know them; "auto" furigana hides their readings. */
export function useMasteredKanji() {
  return useLiveQuery(async () => new Set((await db.items.where('kind').equals('kanji').toArray()).filter(isMastered).map((i) => i.id.slice(6))), []) ?? new Set<string>()
}

export function useFurigana() {
  const [mode, setMode] = useState<FuriganaMode>(() => pref('furigana', 'auto'))
  return [mode, (m: FuriganaMode) => { setPref('furigana', m); setMode(m) }] as const
}

export function Ruby({ token, mode = 'all', known }: { token: Token; mode?: FuriganaMode; known?: Set<string> }) {
  return <>{token.ruby.map(([base, reading], i) => {
    const show = reading && (mode === 'all' || (mode === 'auto' && (base.match(KANJI) ?? []).some((k) => !known?.has(k))))
    return show ? <ruby key={i}>{base}<rt className="text-[0.5em] font-normal">{reading}</rt></ruby> : <span key={i}>{base}</span>
  })}</>
}

/** A sentence with furigana; one token can be blanked, tokens can be tapped. */
export function Sentence({ tokens, blank, marks, mode = 'all', known, onTap, className = '' }: {
  tokens: Token[]; blank?: number | number[]; marks?: (boolean | undefined)[]; mode?: FuriganaMode; known?: Set<string>; onTap?: (t: Token) => void; className?: string
}) {
  const blanks = blank === undefined ? [] : [blank].flat()
  return (
    <p lang="ja" className={`leading-[2.4] ${className}`} aria-label={textOf(tokens)}>
      {tokens.map((t, i) => blanks.includes(i)
        ? <span key={i} className="mx-1 inline-block min-w-12 border-b-4 border-torii text-center text-torii">？</span>
        : marks?.[i] !== undefined
          ? <span key={i} className={`rounded px-0.5 ${marks[i] ? 'bg-anemo/20 text-anemo' : 'bg-torii/15 text-torii underline decoration-wavy'}`}><Ruby token={t} mode={mode} known={known} /></span>
        : onTap
          ? <button key={i} onClick={() => onTap(t)} className="cursor-pointer rounded hover:bg-geo/40"><Ruby token={t} mode={mode} known={known} /></button>
          : <Ruby key={i} token={t} mode={mode} known={known} />)}
    </p>
  )
}

export function FuriganaToggle({ mode, setMode }: { mode: FuriganaMode; setMode: (m: FuriganaMode) => void }) {
  const label = { all: 'Furigana: semua', auto: 'Furigana: otomatis', none: 'Furigana: mati' }
  const next: Record<FuriganaMode, FuriganaMode> = { all: 'auto', auto: 'none', none: 'all' }
  return (
    <button onClick={() => setMode(next[mode])} title="Otomatis = furigana hilang untuk kanji yang sudah kamu kuasai"
      className="cursor-pointer rounded-full bg-paper-deep px-3 py-1 text-sm font-bold">あ {label[mode]}</button>
  )
}
