import type { Design } from './Chibi'
import { Bangs, BOB, Body } from './parts'

// Liyue chibi: original drawings, same grid and style as Mondstadt.

const Petals = ({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) => <>
  {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - r} rx={r * .55} ry={r} fill={fill} strokeWidth={2.5} transform={`rotate(${a} ${x} ${y})`} />)}
  <circle cx={x} cy={y} r={r * .45} fill="#f6c443" strokeWidth={2} />
</>

const Talisman = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => <>
  <rect x={x} y={y} width={w} height={h} rx={2} fill="#f5e6b8" strokeWidth={3} />
  <path d={`M${x + w / 2} ${y + 5} v${h - 12} M${x + 3} ${y + h / 3} h${w - 6} M${x + 3} ${y + h / 2 + 4} q${w / 2 - 3} -6 ${w - 6} 0`} stroke="#c0392b" strokeWidth={2} fill="none" />
</>

export const LIYUE: Record<string, Design> = {
  zhongli: {
    eye: '#e0a526',
    back: <>
      <path d="M118 96 Q156 118 144 182 Q134 152 110 124Z" fill="#3a2a22" />
      <path d="M144 182 Q140 168 132 160 Q142 162 146 172Z" fill="#e0a526" strokeWidth={2.5} />
      <path d={BOB} fill="#3a2a22" />
    </>,
    body: <Body coat="#4a3527" shade="#33241b" legs="#2b2220" shoes="#1b1512">
      <path d="M74 116 L100 128 L126 116 L124 110 Q100 104 76 110Z" fill="#33241b" strokeWidth={3} />
      <path d="M100 128 L107 137 L100 146 L93 137Z" fill="#e0a526" strokeWidth={2.5} />
      <path d="M66 150 L134 150" stroke="#e0a526" strokeWidth={3} />
    </Body>,
    front: <>
      <Bangs fill="#3a2a22" shine="#5a4334" />
      <path d="M46 86 Q40 116 50 132 L60 100Z" fill="#3a2a22" />
      <path d="M154 86 Q160 116 150 132 L140 100Z" fill="#3a2a22" />
      <path d="M50 108 v14" stroke="#e0a526" strokeWidth={2} />
      <path d="M50 122 l4 6 -4 6 -4 -6z" fill="#e0a526" strokeWidth={2} />
    </>,
  },

  xiangling: {
    eye: '#f0b33c',
    back: <path d={BOB} fill="#2d3150" />,
    body: <Body coat="#c8372d" shade="#9e2a22" legs="#2b2a33" shoes="#6b4a2e">
      <path d="M64 156 Q100 164 136 156" stroke="#f0b33c" strokeWidth={6} fill="none" />
      <path d="M86 120 L100 130 L114 120" stroke="#f0b33c" strokeWidth={3} fill="none" />
      {/* Guoba */}
      <circle cx={154} cy={176} r={12} fill="#d9522f" strokeWidth={3} />
      <circle cx={145} cy={166} r={4} fill="#d9522f" strokeWidth={2.5} />
      <circle cx={163} cy={166} r={4} fill="#d9522f" strokeWidth={2.5} />
      <ellipse cx={154} cy={180} rx={6} ry={4} fill="#f6e6d6" stroke="none" />
      <circle cx={150} cy={174} r={1.6} fill="#3b2a24" stroke="none" /><circle cx={158} cy={174} r={1.6} fill="#3b2a24" stroke="none" />
    </Body>,
    front: <Bangs fill="#2d3150" shine="#464b72" />,
    top: <>
      <circle cx={58} cy={42} r={15} fill="#2d3150" />
      <circle cx={142} cy={42} r={15} fill="#2d3150" />
      <path d="M66 52 l8 6 M134 52 l-8 6" stroke="#f0b33c" strokeWidth={5} />
    </>,
  },

  hutao: {
    eye: '#c0392b',
    back: <>
      <path d="M50 96 Q24 140 40 186 Q52 160 60 120Z" fill="#4a2e25" />
      <path d="M150 96 Q176 140 160 186 Q148 160 140 120Z" fill="#4a2e25" />
      <path d={BOB} fill="#4a2e25" />
    </>,
    body: <Body coat="#3d2b2b" shade="#2a1d1d" legs="#f2ece4" shoes="#2a1d1d">
      <path d="M68 124 L80 122 L82 178 L60 176Z" fill="#7a2a24" stroke="none" />
      <path d="M86 120 L100 132 L114 120" stroke="#c0392b" strokeWidth={3} fill="none" />
      <circle cx={100} cy={144} r={4} fill="#e0a526" strokeWidth={2} />
    </Body>,
    front: <Bangs fill="#4a2e25" shine="#6a4436" />,
    top: <>
      <path d="M58 52 Q60 12 100 12 Q140 12 142 52Z" fill="#2b2a33" />
      <ellipse cx={100} cy={54} rx={58} ry={9} fill="#1b1a20" />
      <Petals x={128} y={30} r={6} fill="#c0392b" />
      <Talisman x={140} y={56} w={12} h={30} />
    </>,
  },

  xiao: {
    eye: '#e0a526',
    back: <path d={BOB} fill="#2c4a4a" />,
    body: <Body coat="#f2efe6" shade="#d9d3c3" sleeve="#2f7a6e" legs="#2c3a3a" shoes="#1b2424">
      <path d="M78 122 Q100 140 122 122" stroke="#7a4fb0" strokeWidth={4} fill="none" strokeDasharray="1 7" />
      <path d="M64 150 L136 150" stroke="#2f7a6e" strokeWidth={6} />
      <path d="M136 132 l6 -3 M58 132 l-6 -3" stroke="#2f7a6e" strokeWidth={4} />
    </Body>,
    front: <>
      <path d="M50 64 L44 40 L64 52 L66 26 L84 46 L100 20 L116 46 L134 26 L136 52 L156 40 L150 64Z" fill="#2c4a4a" />
      <Bangs fill="#2c4a4a" shine="#3f6a66" />
      <path d="M60 60 Q80 52 96 60" stroke="#4fa3a0" strokeWidth={3} fill="none" />
    </>,
  },

  ganyu: {
    eye: '#7d68c9',
    back: <path d="M44 84 Q32 174 62 180 L138 180 Q168 174 156 84Z" fill="#7cc6de" />,
    body: <Body coat="#f2f2f7" shade="#d6d8e4" sleeve="#2b2a33" legs="#2b2a33" shoes="#1b1a20">
      <path d="M68 124 L84 122 L86 180 L60 176Z" fill="#2b2a33" />
      <path d="M132 124 L116 122 L114 180 L140 176Z" fill="#2b2a33" />
      <circle cx={100} cy={132} r={6} fill="#e0a526" strokeWidth={2.5} />
      <path d="M100 138 v4" strokeWidth={2} />
    </Body>,
    front: <Bangs fill="#7cc6de" shine="#a9def0" />,
    top: <>
      <path d="M70 38 Q56 12 74 4 Q72 22 84 34Z" fill="#3b2a24" />
      <path d="M130 38 Q144 12 126 4 Q128 22 116 34Z" fill="#3b2a24" />
      <path d="M74 4 Q70 12 72 18 M126 4 Q130 12 128 18" stroke="#c0392b" strokeWidth={4} />
    </>,
  },

  keqing: {
    eye: '#b38be0',
    back: <>
      <path d="M58 60 Q22 120 42 182 Q54 150 66 110Z" fill="#6b4fa0" />
      <path d="M142 60 Q178 120 158 182 Q146 150 134 110Z" fill="#6b4fa0" />
      <path d={BOB} fill="#6b4fa0" />
    </>,
    body: <Body coat="#5b3f8c" shade="#432d6b" legs="#2b2a33" shoes="#2b2a33">
      <path d="M88 122 L112 122 L114 170 L86 170Z" fill="#f2f0f7" strokeWidth={3} />
      <path d="M100 126 L104 132 L100 138 L96 132Z" fill="#e0a526" strokeWidth={2} />
    </Body>,
    front: <Bangs fill="#6b4fa0" shine="#8a6fc0" />,
    top: <>
      <path d="M60 46 Q50 14 74 16 Q86 26 82 44Z" fill="#6b4fa0" />
      <path d="M140 46 Q150 14 126 16 Q114 26 118 44Z" fill="#6b4fa0" />
      <path d="M66 30 l10 4 M134 30 l-10 4" stroke="#e0a526" strokeWidth={3} />
    </>,
  },

  qiqi: {
    skin: '#f5e9ee',
    eye: '#c35d8f',
    back: <>
      <path d="M100 120 Q112 150 104 186 Q96 160 92 128Z" fill="#8f6fae" />
      <path d={BOB} fill="#8f6fae" />
    </>,
    body: <Body coat="#e9dccb" shade="#cfbfa8" sleeve="#4a3a66" legs="#e9dccb" shoes="#4a3a66">
      <path d="M86 120 L100 132 L114 120" stroke="#4a3a66" strokeWidth={4} fill="none" />
      <circle cx={100} cy={150} r={5} fill="#7cc6de" strokeWidth={2.5} />
    </Body>,
    front: <Bangs fill="#8f6fae" shine="#b094cc" />,
    top: <>
      <path d="M54 52 Q58 14 100 14 Q142 14 146 52Z" fill="#4a3a66" />
      <ellipse cx={100} cy={52} rx={52} ry={7} fill="#3a2d52" />
      <circle cx={100} cy={12} r={6} fill="#e0a526" strokeWidth={2.5} />
      <Talisman x={91} y={54} w={18} h={34} />
    </>,
  },
}

