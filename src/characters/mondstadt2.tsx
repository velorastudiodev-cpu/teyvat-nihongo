import type { Design } from './Chibi'
import { Bangs, Body, Glasses, Star, WitchHat } from './pieces'
import { BOB } from './shapes'

// Mondstadt, part 2 — original drawings in the shared style.

export const MONDSTADT2: Record<string, Design> = {
  jean: {
    eye: '#4a7bd6',
    back: <path d="M118 30 Q172 38 162 100 Q158 132 146 156 Q150 112 126 70Z" fill="#e9c46a" />,
    body: <Body coat="#f2f0e8" shade="#d8d4c6" sleeve="#2f5fa8" legs="#2f5fa8" shoes="#1b1a20">
      <path d="M68 124 L82 122 L86 180 L60 176Z" fill="#2f5fa8" />
      <path d="M132 124 L118 122 L114 180 L140 176Z" fill="#2f5fa8" />
      <path d="M86 120 L100 132 L114 120" fill="#1b1a20" strokeWidth={3} />
      <circle cx={100} cy={146} r={3} fill="#e0a526" strokeWidth={2} /><circle cx={100} cy={158} r={3} fill="#e0a526" strokeWidth={2} />
    </Body>,
    front: <>
      <Bangs fill="#e9c46a" shine="#f6dc94" />
      <path d="M46 86 Q40 112 50 126 L58 98Z M154 86 Q160 112 150 126 L142 98Z" fill="#e9c46a" />
    </>,
    top: <path d="M120 30 L110 20 L112 40Z M120 30 L132 20 L130 40Z" fill="#1b1a20" strokeWidth={2.5} />,
  },

  barbara: {
    eye: '#3d8fd6',
    back: <>
      {[104, 128, 150].map((y) => <ellipse key={y} cx={42} cy={y} rx={12} ry={12} fill="#f2d28a" />)}
      {[104, 128, 150].map((y) => <ellipse key={-y} cx={158} cy={y} rx={12} ry={12} fill="#f2d28a" />)}
    </>,
    body: <Body coat="#fbfbf8" shade="#d6e2f0" legs="#fbfbf8" shoes="#3d8fd6">
      <path d="M64 150 Q100 160 136 150 L138 164 Q100 174 62 164Z" fill="#3d8fd6" strokeWidth={3} />
      <path d="M90 122 L100 134 L110 122" stroke="#3d8fd6" strokeWidth={4} fill="none" />
    </Body>,
    front: <Bangs fill="#f2d28a" shine="#fbe6b4" />,
    top: <>
      <path d="M68 44 Q70 18 100 16 Q130 18 132 44Z" fill="#ffffff" />
      <path d="M68 44 Q100 36 132 44" stroke="#3d8fd6" strokeWidth={5} fill="none" />
      <path d="M128 42 L142 60 L134 62Z" fill="#3d8fd6" strokeWidth={2.5} />
    </>,
  },

  lisa: {
    eye: '#4f9a64',
    back: <path d="M44 84 Q30 170 64 178 L136 178 Q170 170 156 84Z" fill="#6b4a3a" />,
    body: <Body coat="#5b3f8c" shade="#43306b" legs="#2b2a33" shoes="#2b2a33">
      <path d="M84 120 L100 136 L116 120" fill="#f2ece4" strokeWidth={3} />
      <circle cx={100} cy={140} r={5} fill="#b38be0" strokeWidth={2.5} />
    </Body>,
    front: <Bangs fill="#6b4a3a" shine="#8a6450" />,
    top: <WitchHat fill="#5b3f8c" band="#b38be0">
      <circle cx={124} cy={36} r={7} fill="#f59a8f" strokeWidth={2.5} />
      <circle cx={124} cy={36} r={3} fill="#d1402f" stroke="none" />
    </WitchHat>,
  },

  kaeya: {
    skin: '#e8b98f',
    eye: '#4a8fd6',
    back: <>
      <path d="M58 122 Q100 108 142 122 L160 184 Q100 192 40 184Z" fill="#f2f2f7" />
      <path d={BOB} fill="#2d3a6b" />
    </>,
    body: <Body coat="#2d3a6b" shade="#1e2850" legs="#2b2a33" shoes="#1b1a20">
      <path d="M66 118 Q100 134 134 118 Q130 108 100 112 Q70 108 66 118Z" fill="#f2f2f7" strokeWidth={3} />
      <path d="M100 132 L106 140 L100 148 L94 140Z" fill="#7cc6de" strokeWidth={2} />
    </Body>,
    front: <>
      <Bangs fill="#2d3a6b" shine="#46558a" />
      <path d="M46 86 Q38 120 52 140 L60 100Z" fill="#2d3a6b" />
      <path d="M104 80 Q120 72 136 82 L134 102 Q120 108 106 100Z" fill="#1b1a20" strokeWidth={3} />
      <path d="M104 82 L60 70 M136 84 L154 80" strokeWidth={2.5} />
    </>,
  },

  mona: {
    eye: '#3fa6a0',
    back: <>
      <path d="M50 96 Q22 140 38 188 Q52 160 62 120Z" fill="#3a2f5c" />
      <path d="M150 96 Q178 140 162 188 Q148 160 138 120Z" fill="#3a2f5c" />
      <path d={BOB} fill="#3a2f5c" />
    </>,
    body: <Body coat="#2a2448" shade="#1b1733" legs="#2a2448" shoes="#1b1733">
      <path d="M88 122 L112 122 L110 150 L90 150Z" fill="#f2f0f7" strokeWidth={3} />
      <g stroke="none"><Star x={100} y={160} r={6} fill="#f6c443" /></g>
    </Body>,
    front: <Bangs fill="#3a2f5c" shine="#55487f" />,
    top: <WitchHat fill="#2a2448" band="#f6c443">
      <g stroke="none"><Star x={84} y={26} r={6} fill="#f6c443" /><Star x={112} y={14} r={4} fill="#f6c443" /></g>
    </WitchHat>,
  },

  sucrose: {
    eye: '#c9a43a',
    back: <path d={BOB} fill="#a6d8b5" />,
    body: <Body coat="#f2f2ee" shade="#d6dbd2" sleeve="#3fae8f" legs="#3a4a42" shoes="#2b2a33">
      <path d="M86 120 L100 132 L114 120" stroke="#3fae8f" strokeWidth={4} fill="none" />
      <rect x={92} y={140} width={16} height={12} rx={3} fill="#e0a526" strokeWidth={2.5} />
    </Body>,
    front: <>
      <Bangs fill="#a6d8b5" shine="#c9ead2" />
      <Glasses />
    </>,
    top: <path d="M64 44 L56 16 L82 34Z M136 44 L144 16 L118 34Z" fill="#a6d8b5" />,
  },
}

