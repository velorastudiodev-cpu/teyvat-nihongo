import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { loadStrokes, type StrokeSet } from '../data/kanji'
import { judgeStroke, REASON, type Pt } from '../engine/stroke/match'
import { sfx } from './sfx'

export function useStrokes(char: string) {
  const [set, setSet] = useState<StrokeSet>()
  useEffect(() => { loadStrokes(char).then(setSet) }, [char])
  return set
}

const GRID = <g stroke="#e6d6b8" strokeWidth={0.6} strokeDasharray="2 2"><path d="M54.5 0V109M0 54.5H109" /></g>

/** Replays KanjiVG strokes one by one, numbered. */
export function StrokeOrder({ char, size = 160, speed = 0.45 }: { char: string; size?: number; speed?: number }) {
  const set = useStrokes(char)
  const [run, setRun] = useState(0)
  if (!set) return <div style={{ width: size, height: size }} />
  return (
    <button onClick={() => setRun((r) => r + 1)} title="Putar ulang urutan goresan" className="cursor-pointer rounded-2xl bg-paper">
      <svg key={run} viewBox="0 0 109 109" width={size} height={size} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {GRID}
        {set.d.map((d, i) => <path key={`g${i}`} d={d} stroke="#e8dcc6" strokeWidth={4} />)}
        {set.d.map((d, i) => (
          <path key={i} d={d} stroke="#3b2a24" strokeWidth={4} pathLength={1} strokeDasharray="1" strokeDashoffset="1"
            style={{ animation: `draw ${speed}s ease-out ${i * speed}s forwards` }} />
        ))}
        {set.p.map((p, i) => (
          <text key={`n${i}`} x={p[0][0] - 4} y={p[0][1] - 2} fontSize={8} fill="#d1402f" fontWeight={700}
            style={{ opacity: 0, animation: `appear .1s ${i * speed}s forwards` }}>{i + 1}</text>
        ))}
      </svg>
    </button>
  )
}

export interface PadResult { mistakes: number }

/**
 * Draw a character stroke by stroke. Each stroke is checked against KanjiVG (shape, place,
 * direction, order). A correct stroke snaps to the model; a wrong one flashes the expected stroke.
 */
export function StrokePad({ char, ghost = true, size = 260, onDone, onStroke }: {
  char: string; ghost?: boolean; size?: number; onDone: (r: PadResult) => void; onStroke?: (ok: boolean) => void
}) {
  const set = useStrokes(char)
  const svg = useRef<SVGSVGElement>(null)
  const [done, setDone] = useState(0)
  const [line, setLine] = useState<Pt[]>([])
  const [hint, setHint] = useState<{ index: number; text: string }>()
  const [mistakes, setMistakes] = useState(0)
  const misses = useRef(0)       // misses on the current stroke; after 2 we show it outright

  useEffect(() => { setDone(0); setMistakes(0); setHint(undefined); misses.current = 0 }, [char])
  if (!set) return <div style={{ width: size, height: size }} className="rounded-3xl bg-paper" />

  const toPt = (e: PointerEvent): Pt => {
    const m = svg.current!.getScreenCTM()!.inverse()
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m)
    return [p.x, p.y]
  }
  const finished = done >= set.d.length
  const end = () => {
    if (line.length < 2 || finished) return setLine([])
    const v = judgeStroke(line, set.p, done)
    setLine([])
    onStroke?.(v.ok)
    if (v.ok) {
      sfx.pop()
      misses.current = 0
      setHint(undefined)
      const next = done + 1
      setDone(next)
      if (next === set.d.length) { sfx.good(); onDone({ mistakes }) }
    } else {
      sfx.bad()
      misses.current++
      setMistakes((m) => m + 1)
      setHint({ index: done, text: REASON[v.reason] })
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg ref={svg} viewBox="0 0 109 109" width={size} height={size} fill="none" strokeLinecap="round" strokeLinejoin="round"
        className={`touch-none rounded-3xl border-[3px] border-ink bg-white ${finished ? 'outline-4 outline-anemo' : ''}`}
        onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); setLine([toPt(e)]) }}
        onPointerMove={(e) => line.length && setLine((l) => [...l, toPt(e)])}
        onPointerUp={end} onPointerLeave={end}>
        {GRID}
        {ghost && set.d.map((d, i) => <path key={`g${i}`} d={d} stroke="#efe5d3" strokeWidth={4} />)}
        {set.d.slice(0, done).map((d, i) => <path key={i} d={d} stroke="#3b2a24" strokeWidth={4.5} />)}
        {hint && (misses.current >= 2 || ghost) && (
          <path key={`h${misses.current}`} d={set.d[hint.index]} stroke="#d1402f" strokeWidth={4.5} pathLength={1} strokeDasharray="1" strokeDashoffset="1"
            style={{ animation: 'draw .5s ease-out forwards' }} />
        )}
        {line.length > 1 && <polyline points={line.map((p) => p.join(',')).join(' ')} stroke="#3fae8f" strokeWidth={4} />}
      </svg>
      <p className={`h-5 text-sm font-bold ${hint ? 'text-torii' : 'text-anemo'}`}>
        {finished ? `Selesai! ${mistakes ? `${mistakes} kesalahan` : 'Sempurna ✨'}` : hint?.text ?? `Goresan ${done + 1} / ${set.d.length}`}
      </p>
    </div>
  )
}
