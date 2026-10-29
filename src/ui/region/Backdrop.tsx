import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { Realm } from './regions'
import { RegionScene } from './scenes'
import { useFx } from '../fx'

/* Particles per realm: what drifts through the air there. */
const PETAL = <path d="M0 -9 C6 -6 7 2 0 9 C-7 2 -6 -6 0 -9z M0 -9 l-1.5 3 1.5 -1 1.5 1z" />
const MOTES: Record<Realm, { kind: 'fall' | 'rise'; shapes: ReactNode[]; colors: string[] }> = {
  mondstadt: { kind: 'rise', colors: ['#ffffff', '#e9fff6'], shapes: [
    <g key="seed" stroke="currentColor" strokeWidth={1.2}><path d="M0 8 V-2" />{[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => <path key={a} d="M0 -2 v-7" transform={`rotate(${a} 0 -2)`} />)}</g>,
    <path key="wind" d="M-10 0 c4 -5 10 -5 14 0 s8 4 10 -1" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />,
  ] },
  liyue: { kind: 'rise', colors: ['#f2a03d', '#e5523a', '#ffd36e'], shapes: [
    <g key="lantern"><rect x={-6} y={-8} width={12} height={15} rx={4} fill="currentColor" /><rect x={-4} y={-10} width={8} height={2} fill="#5c2e17" /><rect x={-4} y={7} width={8} height={2} fill="#5c2e17" /><rect x={-3} y={-5} width={6} height={9} rx={2} fill="#fff3c4" opacity={0.6} /></g>,
    <circle key="mote" r={2.5} fill="currentColor" />,
  ] },
  inazuma: { kind: 'fall', colors: ['#f7b6cf', '#ffd6e6', '#c9a4ff'], shapes: [
    <g key="petal" fill="currentColor">{PETAL}</g>,
    <path key="spark" d="M2 -9 L-4 1 H1 L-2 9 L5 -2 H0z" fill="#e3d0ff" />,
  ] },
  sumeru: { kind: 'rise', colors: ['#c8f27a', '#9be37b', '#e9ffb0'], shapes: [
    <g key="mote"><circle r={4} fill="currentColor" /><circle r={8} fill="currentColor" opacity={0.25} /></g>,
    <path key="leaf" d="M-7 0 C-3 -6 4 -6 8 0 C4 6 -3 6 -7 0z" fill="currentColor" />,
  ] },
  fontaine: { kind: 'rise', colors: ['#ffffff', '#cfe8fb'], shapes: [
    <g key="bubble" fill="none" stroke="currentColor" strokeWidth={1.4}><circle r={7} /><path d="M-3 -4 a4 4 0 0 1 4 -1.5" /></g>,
    <circle key="drop" r={3} fill="currentColor" opacity={0.7} />,
  ] },
  natlan: { kind: 'rise', colors: ['#ffb14a', '#ff7a2f', '#ffe08a'], shapes: [
    <g key="ember"><circle r={2.6} fill="currentColor" /><circle r={6} fill="currentColor" opacity={0.25} /></g>,
    <path key="flame" d="M0 8 C-5 4 -4 -2 0 -8 C4 -2 5 4 0 8z" fill="currentColor" />,
  ] },
  euthymia: { kind: 'fall', colors: ['#e7b8ff', '#f6dcff', '#ffffff'], shapes: [
    <g key="petal" fill="currentColor">{PETAL}</g>,
    <path key="star" d="M0 -6 L1.5 -1.5 6 0 1.5 1.5 0 6 -1.5 1.5 -6 0 -1.5 -1.5z" fill="currentColor" />,
  ] },
}

// deterministic spread so particles keep their places across renders
const rand = (i: number, salt: number) => { const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453; return x - Math.floor(x) }

function Particles({ realm, count = 16 }: { realm: Realm; count?: number }) {
  const m = MOTES[realm]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 14 + rand(i, 1) * 16
        const style = {
          left: `${rand(i, 2) * 100}%`,
          [m.kind === 'fall' ? 'top' : 'bottom']: 0,
          color: m.colors[i % m.colors.length],
          animationDuration: `${(m.kind === 'fall' ? 11 : 16) + rand(i, 3) * 12}s`,
          animationDelay: `${-rand(i, 4) * 20}s`,
          '--dx': `${(rand(i, 5) - 0.3) * 18}vw`,
          '--spin': `${200 + rand(i, 6) * 500}deg`,
          '--o': 0.5 + rand(i, 7) * 0.5,
        } as CSSProperties
        return (
          <svg key={i} viewBox="-12 -12 24 24" width={size} height={size} className={`absolute ${m.kind === 'fall' ? 'anim-fall' : 'anim-rise'}`} style={style}>
            {m.shapes[i % m.shapes.length]}
          </svg>
        )
      })}
    </div>
  )
}

function usePortrait() {
  const q = '(max-aspect-ratio: 4/5)'
  const [portrait, setPortrait] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setPortrait(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return portrait
}

/** Full-screen scenery of the realm behind the whole app, softly veiled so panels stay readable. */
export function Backdrop({ realm }: { realm: Realm }) {
  // phones: a taller canvas so the scene sits in the lower half at a readable scale instead of a close crop
  const view = usePortrait() ? '0 -760 1440 1660' : '0 0 1440 900'
  const fx = useFx()
  // its own compositor layer, so scrolling the page never repaints the scenery
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 [contain:strict] [transform:translateZ(0)]" aria-hidden>
      <svg viewBox={view} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <RegionScene region={realm} />
      </svg>
      <Particles realm={realm} count={fx === 'lite' ? 6 : 16} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-black/10" />
    </div>
  )
}
