import { useEffect, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { ELEMENT_COLOR, getCharacter, type Element, type Expression } from '.'
import { DESIGNS } from './designs'
import { OUTFIT_ART } from './parts'

export const INK = '#3b2a24'

export interface Design {
  skin?: string
  eye: string
  float?: boolean
  back?: ReactNode   // behind everything: long hair, capes, ears
  body: ReactNode    // torso, arms, legs
  front?: ReactNode  // bangs, drawn over the face
  top?: ReactNode    // hats and ornaments
}

const failed = new Set<string>()

/** Uploaded art (this expression, else idle) → public/chibi/<id>/ file → built-in SVG → silhouette. */
export function Chibi({ id, expression = 'idle', size = 160, outfit }: { id: string; expression?: Expression; size?: number; outfit?: string }) {
  const c = getCharacter(id)
  const uploads = useLiveQuery(() => db.art.bulkGet([`${id}:${expression}`, `${id}:idle`]), [id, expression])
  const url = useObjectUrl(uploads?.[0]?.blob ?? uploads?.[1]?.blob)
  const src = c?.assets[expression]
  const [, rerender] = useState(0)
  if (!uploads) return <div style={{ width: size, height: size }} />
  if (url) return <Picture src={url} expression={expression} size={size} alt={c?.name ?? id} outfit={outfit} />
  if (src && !failed.has(src)) {
    return <img src={src} width={size} height={size} alt={c?.name} className="object-contain"
      onError={() => { failed.add(src); rerender((n) => n + 1) }} />
  }
  const design = DESIGNS[id]
  return design
    ? <ChibiSvg design={design} element={c?.element ?? 'none'} expression={expression} size={size} title={c?.name ?? id} outfit={outfit} />
    : <Silhouette element={c?.element ?? 'none'} size={size} title={c?.name ?? id} />
}

function useObjectUrl(blob?: Blob) {
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    if (!blob) return setUrl(undefined)
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])
  return url
}

const FX_EMOJI: Record<Expression, string> = { idle: '', happy: '✨', sad: '💧', sleep: '💤' }

/** Uploaded pictures get the same motion as the built-in SVGs, plus an emoji for the mood. */
function Picture({ src, expression, size, alt, outfit }: { src: string; expression: Expression; size: number; alt: string; outfit?: string }) {
  const motion = expression === 'happy' ? 'chibi-hop' : expression === 'sleep' ? 'chibi-doze' : 'chibi-breathe'
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img src={src} alt={`${alt} (${expression})`} className={`h-full w-full object-contain ${motion} ${expression === 'sleep' ? 'opacity-80' : ''}`} />
      {outfit && <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">{OUTFIT_ART[outfit]}</svg>}
      {FX_EMOJI[expression] && <span className="absolute top-0 right-1" style={{ fontSize: size / 6 }}>{FX_EMOJI[expression]}</span>}
    </div>
  )
}

function ChibiSvg({ design, element, expression, size, title, outfit }: { design: Design; element: Element; expression: Expression; size: number; title: string; outfit?: string }) {
  const motion = expression === 'happy' ? 'chibi-hop' : expression === 'sleep' ? 'chibi-doze' : design.float ? 'chibi-float' : ''
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="chibi" role="img" aria-label={`${title} (${expression})`}>
      <g className={motion}>
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
          {design.back}
          <g className={expression === 'sleep' ? '' : 'chibi-breathe'}>{design.body}</g>
          <ellipse cx={100} cy={80} rx={54} ry={50} fill={design.skin ?? '#fde3cf'} />
          <Face expression={expression} eye={design.eye} />
          {design.front}
          {design.top}
          {outfit && OUTFIT_ART[outfit]}
        </g>
      </g>
      <Fx expression={expression} />
      <ElementBadge element={element} />
    </svg>
  )
}

function Face({ expression, eye }: { expression: Expression; eye: string }) {
  const openEyes = (small = false) => [80, 120].map((x) => (
    <g key={x}>
      <ellipse cx={x} cy={90} rx={small ? 8 : 9.5} ry={small ? 10 : 12.5} fill={eye} strokeWidth={3} />
      <ellipse cx={x} cy={94} rx={5} ry={6.5} fill={INK} stroke="none" opacity={0.55} />
      <circle cx={x - 3} cy={85} r={3.6} fill="#fff" stroke="none" />
      <circle cx={x + 3.5} cy={96} r={1.6} fill="#fff" stroke="none" />
    </g>
  ))
  return (
    <g fill="none">
      <ellipse cx={68} cy={106} rx={8} ry={4.5} fill="#f59a8f" stroke="none" opacity={0.55} />
      <ellipse cx={132} cy={106} rx={8} ry={4.5} fill="#f59a8f" stroke="none" opacity={0.55} />
      {expression === 'idle' && <>
        <g className="chibi-blink">{openEyes()}</g>
        <path d="M94 108 Q100 113 106 108" strokeWidth={3} />
      </>}
      {expression === 'happy' && <>
        <path d="M71 93 Q80 80 89 93 M111 93 Q120 80 129 93" />
        <path d="M91 105 Q100 120 109 105 Z" fill="#c8453a" strokeWidth={3} />
      </>}
      {expression === 'sad' && <>
        {openEyes(true)}
        <path d="M70 76 L88 71 M112 71 L130 76" strokeWidth={3} />
        <path d="M94 112 Q100 107 106 112" strokeWidth={3} />
      </>}
      {expression === 'sleep' && <>
        <path d="M71 90 Q80 97 89 90 M111 90 Q120 97 129 90" />
        <circle cx={100} cy={110} r={3} fill="#c8453a" strokeWidth={2.5} />
      </>}
    </g>
  )
}

function Fx({ expression }: { expression: Expression }) {
  if (expression === 'happy') return (
    <g fill="#f6c443" stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
      <path d="M30 40 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" />
      <path d="M170 30 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" />
    </g>
  )
  if (expression === 'sad') return (
    <path d="M160 52 Q168 66 160 72 Q152 66 160 52Z" fill="#8fd0f0" stroke={INK} strokeWidth={2.5} />
  )
  if (expression === 'sleep') return (
    <g fill={INK} fontFamily="var(--font-display)" fontWeight={800}>
      <text x={150} y={40} fontSize={22} className="chibi-zzz">Z</text>
      <text x={168} y={24} fontSize={15} className="chibi-zzz" style={{ animationDelay: '.8s' }}>z</text>
    </g>
  )
  return null
}

const GLYPH: Partial<Record<Element, string>> = {
  pyro: 'M0 -8 Q7 -1 4 5 Q2 8 0 8 Q-6 8 -6 2 Q-6 -2 -2 -4 Q-2 0 0 1 Q2 -3 0 -8Z',
  anemo: 'M-6 2 Q-6 -7 3 -6 Q8 -4 6 1 Q4 4 0 2 M-6 2 Q-3 8 4 6',
  hydro: 'M0 -8 Q7 2 5 5 Q3 8 0 8 Q-3 8 -5 5 Q-7 2 0 -8Z',
  geo: 'M0 -8 L7 -2 L4 7 L-4 7 L-7 -2Z',
  electro: 'M2 -8 L-5 1 L0 1 L-2 8 L5 -1 L0 -1Z',
  dendro: 'M0 8 Q-8 0 0 -8 Q8 0 0 8 M0 8 L0 -3',
  cryo: 'M0 -8 L0 8 M-7 -4 L7 4 M-7 4 L7 -4',
}

function ElementBadge({ element }: { element: Element }) {
  const glyph = GLYPH[element]
  if (!glyph) return null
  return (
    <g transform="translate(176 180)">
      <circle r={14} fill={ELEMENT_COLOR[element]} stroke={INK} strokeWidth={3} />
      <path d={glyph} fill="#fff" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
    </g>
  )
}

function Silhouette({ element, size, title }: { element: Element; size: number; title: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`${title} (belum digambar)`}>
      <g fill={ELEMENT_COLOR[element]} opacity={0.35}>
        <path d="M66 124 Q100 116 134 124 L142 186 Q100 196 58 186Z" />
        <ellipse cx={100} cy={80} rx={56} ry={52} />
      </g>
      <text x={100} y={98} textAnchor="middle" fontSize={52} fontWeight={800} fill={INK} opacity={0.5} fontFamily="var(--font-display)">?</text>
    </svg>
  )
}
