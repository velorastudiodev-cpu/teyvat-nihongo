import type { ReactNode } from 'react'
import { BANGS, SKIN } from './shapes'

// Chibi building blocks (components only, so fast refresh keeps working).

export function Body({ coat, shade, sleeve = coat, legs, shoes, children }: {
  coat: string; shade: string; sleeve?: string; legs: string; shoes: string; children?: ReactNode
}) {
  return <>
    <rect x={80} y={170} width={16} height={20} rx={6} fill={legs} />
    <rect x={104} y={170} width={16} height={20} rx={6} fill={legs} />
    <ellipse cx={87} cy={192} rx={11} ry={6} fill={shoes} />
    <ellipse cx={113} cy={192} rx={11} ry={6} fill={shoes} />
    <path d="M68 124 Q100 116 132 124 L140 176 Q100 186 60 176Z" fill={coat} />
    <path d="M62 166 Q100 176 138 166 L140 176 Q100 186 60 176Z" fill={shade} stroke="none" />
    {children}
    <ellipse cx={58} cy={148} rx={10} ry={17} fill={sleeve} transform="rotate(20 58 148)" />
    <ellipse cx={142} cy={148} rx={10} ry={17} fill={sleeve} transform="rotate(-20 142 148)" />
    <circle cx={53} cy={163} r={7} fill={SKIN} />
    <circle cx={147} cy={163} r={7} fill={SKIN} />
  </>
}

export const Bangs = ({ fill, shine }: { fill: string; shine: string }) => <>
  <path d={BANGS} fill={fill} />
  <path d="M70 40 Q100 30 130 40" stroke={shine} strokeWidth={5} fill="none" />
</>

export const Star = ({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) => (
  <path d={`M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3}Z`} fill={fill} />
)

/** Venti-style braid: dark beads ending in a glowing tip. */
export const BeadBraid = ({ x }: { x: number }) => <>
  {[104, 114, 124, 134].map((y) => <circle key={y} cx={x} cy={y} r={6} fill="#2b2b3d" strokeWidth={3} />)}
  <circle cx={x} cy={145} r={6} fill="#4fd1c5" strokeWidth={3} />
</>

export const Petals = ({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) => <>
  {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - r} rx={r * .55} ry={r} fill={fill} strokeWidth={2.5} transform={`rotate(${a} ${x} ${y})`} />)}
  <circle cx={x} cy={y} r={r * .45} fill="#f6c443" strokeWidth={2} />
</>

export const Talisman = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => <>
  <rect x={x} y={y} width={w} height={h} rx={2} fill="#f5e6b8" strokeWidth={3} />
  <path d={`M${x + w / 2} ${y + 5} v${h - 12} M${x + 3} ${y + h / 3} h${w - 6} M${x + 3} ${y + h / 2 + 4} q${w / 2 - 3} -6 ${w - 6} 0`} stroke="#c0392b" strokeWidth={2} fill="none" />
</>

export const Glasses = () => (
  <g fill="#ffffff22" strokeWidth={3}>
    <circle cx={80} cy={91} r={13} /><circle cx={120} cy={91} r={13} />
    <path d="M93 90 Q100 86 107 90" fill="none" />
  </g>
)

export const WitchHat = ({ fill, band, children }: { fill: string; band: string; children?: ReactNode }) => <>
  <ellipse cx={100} cy={48} rx={72} ry={12} fill={fill} />
  <path d="M66 46 Q84 -4 136 2 Q120 18 134 46Z" fill={fill} />
  <path d="M68 42 Q100 34 132 42" stroke={band} strokeWidth={5} fill="none" />
  {children}
</>

export const Ponytail = ({ fill, side = 1 }: { fill: string; side?: 1 | -1 }) =>
  <path d={side === 1 ? 'M120 40 Q176 52 166 112 Q160 146 148 166 Q150 120 128 84Z' : 'M80 40 Q24 52 34 112 Q40 146 52 166 Q50 120 72 84Z'} fill={fill} />
export const Braid = ({ x, fill, from = 110, to = 180 }: { x: number; fill: string; from?: number; to?: number }) => <>
  {Array.from({ length: Math.floor((to - from) / 12) }, (_, i) => <ellipse key={i} cx={x} cy={from + i * 12} rx={8} ry={7} fill={fill} strokeWidth={3} />)}
</>

