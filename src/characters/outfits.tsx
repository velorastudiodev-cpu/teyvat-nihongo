import type { ReactNode } from 'react'
import { INK } from './shapes'

/** Gacha accessories, drawn over any chibi (built-in or uploaded). */
export const OUTFIT_ART: Record<string, ReactNode> = {
  glasses: <g fill="#ffffff33" stroke={INK} strokeWidth={3.5}><circle cx={80} cy={91} r={14} /><circle cx={120} cy={91} r={14} /><path d="M94 90 Q100 86 106 90 M66 88 L50 84 M134 88 L150 84" fill="none" /></g>,
  scarf: <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round"><path d="M66 118 Q100 136 134 118 L136 130 Q100 148 64 130Z" fill="#d1402f" /><path d="M118 132 L126 168 L112 166 L108 136Z" fill="#b8322a" /><path d="M70 124 h60" stroke="#f6c443" strokeWidth={2.5} strokeDasharray="4 5" /></g>,
  flowers: <g stroke={INK} strokeWidth={2}>{[[62, 46], [80, 34], [100, 30], [120, 34], [138, 46]].map(([x, y], i) => <g key={i}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - 5} rx={3.5} ry={5} fill={i % 2 ? '#ffffff' : '#f59a8f'} transform={`rotate(${a} ${x} ${y})`} />)}<circle cx={x} cy={y} r={2.5} fill="#f6c443" /></g>)}</g>,
  headphones: <g stroke={INK} strokeWidth={3.5}><path d="M48 92 Q44 22 100 20 Q156 22 152 92" fill="none" strokeWidth={6} /><rect x={36} y={80} width={18} height={30} rx={8} fill="#3fae8f" /><rect x={146} y={80} width={18} height={30} rx={8} fill="#3fae8f" /></g>,
  hachimaki: <g stroke={INK} strokeWidth={3}><path d="M46 66 Q100 50 154 66 L154 76 Q100 60 46 76Z" fill="#ffffff" /><circle cx={100} cy={64} r={6} fill="#d1402f" /><path d="M154 70 L176 62 L170 76Z M154 72 L174 84 L162 88Z" fill="#ffffff" /></g>,
  bow: <g stroke={INK} strokeWidth={3}><path d="M140 34 L122 22 L124 46Z M140 34 L158 22 L156 46Z" fill="#f59a8f" /><circle cx={140} cy={34} r={5} fill="#d1402f" /></g>,
}
