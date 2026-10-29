import type { ReactNode } from 'react'

// Shared chibi parts on a 200×200 grid. Head: ellipse (100,80) 54×50.

export const SKIN = '#fde3cf'

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

export const BANGS = 'M46 86 Q42 28 100 26 Q158 28 154 86 Q146 62 134 58 Q128 66 118 66 Q114 52 100 48 Q88 58 82 66 Q72 60 64 58 Q52 68 46 86Z'
export const BOB = 'M44 84 Q40 132 58 136 L142 136 Q160 132 156 84Z'

export const Bangs = ({ fill, shine }: { fill: string; shine: string }) => <>
  <path d={BANGS} fill={fill} />
  <path d="M70 40 Q100 30 130 40" stroke={shine} strokeWidth={5} fill="none" />
</>

export const Star = ({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) => (
  <path d={`M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3}Z`} fill={fill} />
)


const INK = '#3b2a24'

/** Gacha accessories, drawn over any chibi (built-in or uploaded). */
export const OUTFIT_ART: Record<string, ReactNode> = {
  glasses: <g fill="#ffffff33" stroke={INK} strokeWidth={3.5}><circle cx={80} cy={91} r={14} /><circle cx={120} cy={91} r={14} /><path d="M94 90 Q100 86 106 90 M66 88 L50 84 M134 88 L150 84" fill="none" /></g>,
  scarf: <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round"><path d="M66 118 Q100 136 134 118 L136 130 Q100 148 64 130Z" fill="#d1402f" /><path d="M118 132 L126 168 L112 166 L108 136Z" fill="#b8322a" /><path d="M70 124 h60" stroke="#f6c443" strokeWidth={2.5} strokeDasharray="4 5" /></g>,
  flowers: <g stroke={INK} strokeWidth={2}>{[[62, 46], [80, 34], [100, 30], [120, 34], [138, 46]].map(([x, y], i) => <g key={i}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - 5} rx={3.5} ry={5} fill={i % 2 ? '#ffffff' : '#f59a8f'} transform={`rotate(${a} ${x} ${y})`} />)}<circle cx={x} cy={y} r={2.5} fill="#f6c443" /></g>)}</g>,
  headphones: <g stroke={INK} strokeWidth={3.5}><path d="M48 92 Q44 22 100 20 Q156 22 152 92" fill="none" strokeWidth={6} /><rect x={36} y={80} width={18} height={30} rx={8} fill="#3fae8f" /><rect x={146} y={80} width={18} height={30} rx={8} fill="#3fae8f" /></g>,
  hachimaki: <g stroke={INK} strokeWidth={3}><path d="M46 66 Q100 50 154 66 L154 76 Q100 60 46 76Z" fill="#ffffff" /><circle cx={100} cy={64} r={6} fill="#d1402f" /><path d="M154 70 L176 62 L170 76Z M154 72 L174 84 L162 88Z" fill="#ffffff" /></g>,
  bow: <g stroke={INK} strokeWidth={3}><path d="M140 34 L122 22 L124 46Z M140 34 L158 22 L156 46Z" fill="#f59a8f" /><circle cx={140} cy={34} r={5} fill="#d1402f" /></g>,
}
