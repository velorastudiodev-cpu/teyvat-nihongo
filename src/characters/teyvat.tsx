import type { Design } from './Chibi'
import { Bangs, Body, Braid, Ponytail } from './pieces'
import { BOB, LONG } from './shapes'

// Inazuma, Sumeru, Fontaine and Natlan — original drawings in the shared style.

export const TEYVAT: Record<string, Design> = {
  // ── Inazuma ──
  raiden: {
    eye: '#9b6bd6',
    back: <><path d={LONG} fill="#5b3f8c" /><Braid x={58} fill="#5b3f8c" from={150} to={200} /></>,
    body: <Body coat="#6a4b9c" shade="#4d3578" legs="#2b2a33" shoes="#2b2a33">
      <path d="M84 120 L100 140 L116 120" fill="#f2ecf7" strokeWidth={3} />
      <path d="M64 152 Q100 160 136 152 L137 162 Q100 170 63 162Z" fill="#c9a43a" strokeWidth={3} />
    </Body>,
    front: <Bangs fill="#5b3f8c" shine="#7a5cb0" />,
    top: <>
      <g fill="#b38be0" strokeWidth={2.5}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={138} cy={42} rx={4} ry={7} transform={`rotate(${a} 138 49)`} />)}</g>
      <circle cx={138} cy={49} r={3} fill="#e0a526" strokeWidth={2} />
    </>,
  },

  yae: {
    eye: '#9b6bd6',
    back: <path d={LONG} fill="#f2a6c4" />,
    body: <Body coat="#fbf8f2" shade="#e6dccf" legs="#d1402f" shoes="#2b2a33">
      <path d="M62 158 Q100 168 138 158 L140 176 Q100 186 60 176Z" fill="#d1402f" strokeWidth={3} />
      <path d="M86 120 L100 132 L114 120" stroke="#d1402f" strokeWidth={4} fill="none" />
      {/* fan */}
      <path d="M150 168 L136 146 Q150 136 166 146Z" fill="#f2a6c4" strokeWidth={3} />
      <path d="M150 168 L144 144 M150 168 L152 140 M150 168 L160 144" strokeWidth={1.5} />
    </Body>,
    front: <Bangs fill="#f2a6c4" shine="#f8c8db" />,
    top: <>
      <path d="M62 48 L50 4 L88 32Z" fill="#f2a6c4" /><path d="M64 40 L58 16 L78 32Z" fill="#fbf8f2" stroke="none" />
      <path d="M138 48 L150 4 L112 32Z" fill="#f2a6c4" /><path d="M136 40 L142 16 L122 32Z" fill="#fbf8f2" stroke="none" />
      <circle cx={70} cy={56} r={4} fill="#e0a526" strokeWidth={2} />
    </>,
  },

  ayaka: {
    eye: '#4a7bd6',
    back: <Ponytail fill="#c9d6e8" />,
    body: <Body coat="#2f5fa8" shade="#22477e" sleeve="#f2f2f7" legs="#2b2a33" shoes="#1b1a20">
      <path d="M86 120 L100 134 L114 120" fill="#f2f2f7" strokeWidth={3} />
      <path d="M66 150 L134 150" stroke="#c9a43a" strokeWidth={4} />
    </Body>,
    front: <>
      <Bangs fill="#c9d6e8" shine="#e6edf6" />
      <path d="M46 86 Q40 114 50 130 L58 98Z M154 86 Q160 114 150 130 L142 98Z" fill="#c9d6e8" />
    </>,
    top: <>
      <path d="M118 34 L134 28 L128 44Z" fill="#2f5fa8" strokeWidth={2.5} />
      <path d="M130 42 v16" stroke="#d1402f" strokeWidth={3} />
      <circle cx={130} cy={60} r={3} fill="#d1402f" stroke="none" />
    </>,
  },

  kazuha: {
    eye: '#c0392b',
    back: <><path d={BOB} fill="#eceae6" /><path d="M110 110 Q120 150 108 176 Q100 150 98 118Z" fill="#eceae6" /></>,
    body: <Body coat="#f2ede4" shade="#d8cfbf" sleeve="#8a3a22" legs="#2b2a33" shoes="#1b1a20">
      <path d="M68 124 L84 122 L86 178 L60 176Z" fill="#8a3a22" />
      <path d="M100 136 L106 142 L100 148 L94 142Z" fill="#3fae8f" strokeWidth={2} />
    </Body>,
    front: <>
      <Bangs fill="#eceae6" shine="#ffffff" />
      <path d="M62 54 Q70 64 66 80" stroke="#c0392b" strokeWidth={5} fill="none" />
    </>,
    top: <path d="M128 36 l6 -10 2 8 8 -4 -4 8 8 2 -10 6 2 6 -8 -4Z" fill="#d1402f" strokeWidth={2} />,
  },

  yoimiya: {
    eye: '#e07a2a',
    back: <Ponytail fill="#f0b35a" />,
    body: <Body coat="#e0663a" shade="#b84d28" sleeve="#f6e6d6" legs="#e0663a" shoes="#6b4a2e">
      <path d="M66 136 L134 136 L136 150 L64 150Z" fill="#fff6ea" strokeWidth={3} />
      <path d="M86 120 L100 132 L114 120" stroke="#f6c443" strokeWidth={4} fill="none" />
    </Body>,
    front: <Bangs fill="#f0b35a" shine="#f8d28e" />,
    top: <>
      <path d="M58 52 Q100 36 142 52" stroke="#e0663a" strokeWidth={7} fill="none" />
      <circle cx={140} cy={50} r={6} fill="#f6c443" strokeWidth={2.5} />
    </>,
  },

  // ── Sumeru ──
  nahida: {
    eye: '#4fae6a',
    back: <>
      <path d={BOB} fill="#f3f1ea" />
      <path d="M140 70 Q178 92 170 140 Q164 160 156 166 Q160 130 140 100Z" fill="#f3f1ea" />
      <path d="M156 166 Q160 152 166 146 Q170 156 156 166Z" fill="#7fb23a" strokeWidth={2.5} />
    </>,
    body: <Body coat="#fbfbf6" shade="#dfe8cf" legs="#fbfbf6" shoes="#5f9a2c">
      <path d="M64 156 Q100 166 136 156 L138 166 Q100 176 62 166Z" fill="#7fb23a" strokeWidth={3} />
      <circle cx={100} cy={136} r={5} fill="#7fb23a" strokeWidth={2.5} />
    </Body>,
    front: <Bangs fill="#f3f1ea" shine="#ffffff" />,
    top: <g strokeWidth={2.5}>
      {[[70, 40, -40], [86, 30, -20], [114, 30, 20], [130, 40, 40]].map(([x, y, a]) => <ellipse key={x} cx={x} cy={y} rx={5} ry={10} fill="#7fb23a" transform={`rotate(${a} ${x} ${y})`} />)}
      <circle cx={100} cy={28} r={6} fill="#f6c443" />
    </g>,
  },

  alhaitham: {
    eye: '#3fae8f',
    back: <path d={BOB} fill="#9aa0a6" />,
    body: <Body coat="#2b2f2e" shade="#1b1e1d" legs="#2b2f2e" shoes="#1b1a20">
      <path d="M68 124 L82 122 L84 178 L60 176Z" fill="#2f7a6e" />
      <path d="M86 120 L100 134 L114 120" stroke="#e0a526" strokeWidth={3} fill="none" />
    </Body>,
    front: <>
      <Bangs fill="#9aa0a6" shine="#c4c8cc" />
      <path d="M70 50 Q60 64 62 80 M130 50 Q140 64 138 80" stroke="#3fae8f" strokeWidth={4} fill="none" />
      <rect x={38} y={82} width={12} height={22} rx={5} fill="#2f7a6e" strokeWidth={3} />
      <rect x={150} y={82} width={12} height={22} rx={5} fill="#2f7a6e" strokeWidth={3} />
    </>,
  },

  tighnari: {
    eye: '#7fb23a',
    back: <path d={BOB} fill="#2b2f4a" />,
    body: <Body coat="#3e7a3a" shade="#2c5a2a" sleeve="#2b2f4a" legs="#2b2f4a" shoes="#1b1a20">
      <path d="M86 120 L100 134 L114 120" fill="#e9dccb" strokeWidth={3} />
      <path d="M64 150 L136 150" stroke="#e0a526" strokeWidth={3} />
    </Body>,
    front: <Bangs fill="#2b2f4a" shine="#454b70" />,
    top: <>
      <path d="M62 54 L30 0 L88 34Z" fill="#2b2f4a" /><path d="M60 44 L40 12 L78 34Z" fill="#e9dccb" stroke="none" />
      <path d="M138 54 L170 0 L112 34Z" fill="#2b2f4a" /><path d="M140 44 L160 12 L122 34Z" fill="#e9dccb" stroke="none" />
      <path d="M30 0 L38 14 M170 0 L162 14" stroke="#7fb23a" strokeWidth={6} />
    </>,
  },

  nilou: {
    eye: '#3fa6c4',
    back: <path d={LONG} fill="#c8463c" />,
    body: <Body coat="#f2f6fa" shade="#cfe0ee" legs="#f2f6fa" shoes="#3d8fd6">
      <path d="M64 146 Q100 156 136 146 L138 160 Q100 170 62 160Z" fill="#3d8fd6" strokeWidth={3} />
      <circle cx={100} cy={132} r={5} fill="#7cc6de" strokeWidth={2.5} />
    </Body>,
    front: <Bangs fill="#c8463c" shine="#e06a5e" />,
    top: <>
      <path d="M66 44 Q52 18 70 10 Q68 28 80 38Z" fill="#7cc6de" />
      <path d="M134 44 Q148 18 130 10 Q132 28 120 38Z" fill="#7cc6de" />
    </>,
  },

  cyno: {
    skin: '#c98f5f',
    eye: '#c0392b',
    back: <path d={LONG} fill="#eeece6" />,
    body: <Body coat="#2b2f4a" shade="#1b1e33" legs="#2b2f4a" shoes="#1b1a20">
      <path d="M68 124 Q100 140 132 124 L132 132 Q100 148 68 132Z" fill="#e0a526" strokeWidth={3} />
    </Body>,
    front: <Bangs fill="#eeece6" shine="#ffffff" />,
    top: <>
      <path d="M48 66 Q50 20 100 18 Q150 20 152 66 Q100 50 48 66Z" fill="#2b2f4a" />
      <path d="M62 34 L56 -2 L84 24Z M138 34 L144 -2 L116 24Z" fill="#2b2f4a" />
      <path d="M50 62 Q100 46 150 62" stroke="#e0a526" strokeWidth={4} fill="none" />
    </>,
  },

  // ── Fontaine ──
  furina: {
    eye: '#3d6fd6',
    back: <path d={BOB} fill="#e8eef8" />,
    body: <Body coat="#24346e" shade="#18234d" legs="#f2f2f7" shoes="#24346e">
      <path d="M86 120 L100 134 L114 120" fill="#f2f2f7" strokeWidth={3} />
      <path d="M94 134 L100 140 L106 134 L100 150Z" fill="#3d8fd6" strokeWidth={2} />
    </Body>,
    front: <>
      <Bangs fill="#e8eef8" shine="#ffffff" />
      <path d="M70 46 Q64 62 66 80" stroke="#3d8fd6" strokeWidth={4} fill="none" />
    </>,
    top: <g transform="rotate(-10 112 30)">
      <ellipse cx={112} cy={40} rx={30} ry={6} fill="#24346e" />
      <path d="M94 38 L98 4 L126 4 L130 38Z" fill="#24346e" />
      <path d="M96 30 L130 30" stroke="#f2f2f7" strokeWidth={4} />
    </g>,
  },

  neuvillette: {
    eye: '#7d68c9',
    back: <path d={LONG} fill="#eeeef2" />,
    body: <Body coat="#24346e" shade="#18234d" legs="#24346e" shoes="#1b1a20">
      <path d="M90 120 L100 134 L110 120 L100 146Z" fill="#f2f2f7" strokeWidth={3} />
      <path d="M68 124 L80 122 L82 178 L62 176Z" fill="#3a2f5c" />
    </Body>,
    front: <>
      <Bangs fill="#eeeef2" shine="#ffffff" />
      <path d="M46 86 Q38 120 50 140 L58 100Z M154 86 Q162 120 150 140 L142 100Z" fill="#eeeef2" />
    </>,
    top: <path d="M88 28 Q80 8 70 4 M112 28 Q120 8 130 4" stroke="#3d8fd6" strokeWidth={4} fill="none" />,
  },

  navia: {
    eye: '#3d8fd6',
    back: <>
      <path d={LONG} fill="#f2d28a" />
      {[120, 146, 172].map((y) => <circle key={y} cx={44} cy={y} r={10} fill="#f2d28a" />)}
      {[120, 146, 172].map((y) => <circle key={-y} cx={156} cy={y} r={10} fill="#f2d28a" />)}
    </>,
    body: <Body coat="#2b2a33" shade="#1b1a20" sleeve="#f2f2f7" legs="#2b2a33" shoes="#1b1a20">
      <path d="M86 120 L100 134 L114 120" fill="#f2f2f7" strokeWidth={3} />
      <circle cx={100} cy={142} r={4} fill="#e0a526" strokeWidth={2} />
    </Body>,
    front: <Bangs fill="#f2d28a" shine="#fbe6b4" />,
    top: <>
      <ellipse cx={100} cy={46} rx={74} ry={12} fill="#2b2a33" />
      <path d="M62 44 Q66 12 100 12 Q134 12 138 44Z" fill="#2b2a33" />
      <circle cx={126} cy={34} r={8} fill="#7cc6de" strokeWidth={2.5} />
      <circle cx={112} cy={30} r={5} fill="#f2f2f7" strokeWidth={2} />
    </>,
  },

  // ── Natlan ──
  mavuika: {
    eye: '#f0a020',
    back: <path d={LONG} fill="#c7381e" />,
    body: <Body coat="#2b2a33" shade="#1b1a20" sleeve="#c7381e" legs="#2b2a33" shoes="#1b1a20">
      <path d="M64 146 L136 146" stroke="#f0a020" strokeWidth={5} />
      <path d="M86 120 L100 132 L114 120" stroke="#f0a020" strokeWidth={3} fill="none" />
    </Body>,
    front: <Bangs fill="#c7381e" shine="#e0553a" />,
    top: <g strokeWidth={3}>
      <rect x={66} y={34} width={28} height={14} rx={6} fill="#1b1a20" />
      <rect x={106} y={34} width={28} height={14} rx={6} fill="#1b1a20" />
      <path d="M94 40 L106 40" />
      <path d="M72 38 l8 0" stroke="#f0a020" strokeWidth={2} />
    </g>,
  },

  kinich: {
    eye: '#9ac43a',
    back: <path d={BOB} fill="#2b2f2a" />,
    body: <Body coat="#2f5a3a" shade="#1f3e28" legs="#2b2a33" shoes="#1b1a20">
      <path d="M86 120 L100 132 L114 120" stroke="#e0663a" strokeWidth={4} fill="none" />
      {/* Ajaw, the little dragon */}
      <ellipse cx={150} cy={128} rx={11} ry={9} fill="#7fb23a" strokeWidth={3} />
      <path d="M142 122 L138 112 L148 120Z M156 120 L162 112 L160 124Z" fill="#7fb23a" strokeWidth={2.5} />
      <circle cx={147} cy={127} r={1.6} fill="#3b2a24" stroke="none" /><circle cx={154} cy={127} r={1.6} fill="#3b2a24" stroke="none" />
    </Body>,
    front: <>
      <Bangs fill="#2b2f2a" shine="#454b42" />
      <path d="M128 52 Q136 64 134 80" stroke="#7fb23a" strokeWidth={5} fill="none" />
    </>,
  },

  mualani: {
    skin: '#c98f5f',
    eye: '#2fb8c8',
    back: <path d={LONG} fill="#3a2a28" />,
    body: <Body coat="#2fb8c8" shade="#2290a0" sleeve="#f2f6fa" legs="#c98f5f" shoes="#f2f6fa">
      <path d="M64 150 Q100 160 136 150" stroke="#f2f6fa" strokeWidth={5} fill="none" />
      <circle cx={100} cy={132} r={5} fill="#f6c443" strokeWidth={2.5} />
    </Body>,
    front: <>
      <Bangs fill="#3a2a28" shine="#5a4440" />
      <path d="M60 60 Q66 72 64 86" stroke="#2fb8c8" strokeWidth={4} fill="none" />
    </>,
    top: <path d="M96 30 Q110 0 132 8 Q118 18 120 34Z" fill="#2fb8c8" />,
  },
}
