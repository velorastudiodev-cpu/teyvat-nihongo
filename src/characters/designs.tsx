import type { Design } from './Chibi'
import { Bangs, BOB, Body, SKIN, Star } from './parts'
import { LIYUE } from './liyue'
import { MONDSTADT2 } from './mondstadt2'
import { TEYVAT } from './teyvat'

// All chibi are original drawings on a 200×200 grid. Head: ellipse (100,80) 54×50.

const Braid = ({ x }: { x: number }) => <>
  {[104, 114, 124, 134].map((y) => <circle key={y} cx={x} cy={y} r={6} fill="#2b2b3d" strokeWidth={3} />)}
  <circle cx={x} cy={145} r={6} fill="#4fd1c5" strokeWidth={3} />
</>

export const DESIGNS: Record<string, Design> = {
  ...LIYUE,
  ...MONDSTADT2,
  ...TEYVAT,
  paimon: {
    eye: '#4a3f8c',
    float: true,
    back: <>
      <path d="M58 122 Q100 108 142 122 L162 186 Q100 174 38 186Z" fill="#243466" />
      <g stroke="none"><Star x={52} y={170} r={5} fill="#fff" /><Star x={150} y={160} r={4} fill="#f6c443" /><Star x={146} y={178} r={3} fill="#fff" /></g>
      <path d={BOB} fill="#f5f3f0" />
    </>,
    body: <Body coat="#fbfbf8" shade="#dfe3ec" legs="#fbfbf8" shoes="#243466">
      <path d="M78 122 Q100 134 122 122" stroke="#243466" strokeWidth={5} fill="none" />
      <circle cx={100} cy={136} r={5} fill="#f6c443" strokeWidth={3} />
    </Body>,
    front: <>
      <Bangs fill="#f5f3f0" shine="#ffffff" />
      <path d="M46 86 Q40 112 50 124 L58 98Z" fill="#f5f3f0" />
      <path d="M154 86 Q160 112 150 124 L142 98Z" fill="#f5f3f0" />
    </>,
    top: <>
      <ellipse cx={100} cy={16} rx={28} ry={7} fill="none" stroke="#243466" strokeWidth={5} />
      <Star x={58} y={50} r={13} fill="#243466" />
    </>,
  },

  klee: {
    eye: '#d1402f',
    back: <>
      <path d="M50 90 L20 74 L48 110Z" fill={SKIN} />
      <path d="M150 90 L180 74 L152 110Z" fill={SKIN} />
      <ellipse cx={44} cy={130} rx={13} ry={22} fill="#f3cf86" />
      <ellipse cx={156} cy={130} rx={13} ry={22} fill="#f3cf86" />
      <circle cx={46} cy={110} r={5} fill="#d1402f" strokeWidth={3} />
      <circle cx={154} cy={110} r={5} fill="#d1402f" strokeWidth={3} />
    </>,
    body: <Body coat="#d6453a" shade="#b23629" legs="#fff6ea" shoes="#7a4a2a">
      <path d="M82 121 L100 134 L118 121 Q100 116 82 121Z" fill="#fff6ea" strokeWidth={3} />
      <path d="M70 130 L132 170" stroke="#7a4a2a" strokeWidth={6} />
      {/* Dodoco */}
      <circle cx={148} cy={176} r={12} fill="#f2e0c8" strokeWidth={3} />
      <path d="M137 172 Q148 156 159 172Z" fill="#c8372d" strokeWidth={3} />
      <circle cx={144} cy={178} r={1.8} fill="#3b2a24" stroke="none" />
      <circle cx={152} cy={178} r={1.8} fill="#3b2a24" stroke="none" />
    </Body>,
    front: <Bangs fill="#f3cf86" shine="#fde7b0" />,
    top: <>
      <path d="M52 56 Q56 8 100 10 Q144 8 148 56 Q100 44 52 56Z" fill="#c8372d" />
      <path d="M38 60 Q100 38 162 60 Q164 68 156 68 Q100 50 44 68 Q36 68 38 60Z" fill="#a92c24" />
      <path d="M64 30 Q70 10 86 8 Q78 20 74 34Z" fill="#fff6ea" strokeWidth={3} />
      <g fill="#7fb23a" strokeWidth={2.5}>
        <circle cx={127} cy={30} r={5} /><circle cx={137} cy={30} r={5} />
        <circle cx={127} cy={40} r={5} /><circle cx={137} cy={40} r={5} />
      </g>
    </>,
  },

  venti: {
    eye: '#3fae8f',
    back: <>
      <path d="M60 122 Q100 112 140 122 L158 184 Q100 192 42 184Z" fill="#2f7a52" />
      <path d={BOB} fill="#2b2b3d" />
    </>,
    body: <Body coat="#f7f4ea" shade="#ddd8c6" sleeve="#f7f4ea" legs="#f7f4ea" shoes="#6b4a2e">
      <path d="M68 124 L86 121 L88 180 L60 176Z" fill="#3e9a64" />
      <path d="M132 124 L114 121 L112 180 L140 176Z" fill="#3e9a64" />
      <circle cx={100} cy={132} r={5.5} fill="#4fd1c5" strokeWidth={3} />
    </Body>,
    front: <>
      <Bangs fill="#2b2b3d" shine="#4a4a63" />
      <Braid x={50} /><Braid x={150} />
    </>,
    top: <>
      <path d="M38 58 Q42 12 110 12 Q166 16 162 52 Q130 40 100 42 Q66 44 38 58Z" fill="#3e9a64" />
      <path d="M40 56 Q100 34 162 50" stroke="#2f7a52" strokeWidth={6} fill="none" />
      <g fill="#fff" strokeWidth={2.5}>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={150} cy={22} rx={4} ry={8} transform={`rotate(${a} 150 30)`} />)}
      </g>
      <circle cx={150} cy={30} r={3.5} fill="#f6c443" strokeWidth={2} />
    </>,
  },

  amber: {
    eye: '#c07a25',
    back: <path d="M44 84 Q32 172 64 178 L136 178 Q168 172 156 84Z" fill="#6e3f24" />,
    body: <Body coat="#d1402f" shade="#a92f22" legs="#4a2e22" shoes="#8a3a22">
      <path d="M90 122 L110 122 L112 166 L88 166Z" fill="#fff6ea" strokeWidth={3} />
      <path d="M62 166 Q100 176 138 166" stroke="#6b4a2e" strokeWidth={6} fill="none" />
    </Body>,
    front: <Bangs fill="#6e3f24" shine="#8d5634" />,
    top: <>
      <path d="M78 38 Q48 0 68 2 Q90 6 94 34Z" fill="#d1402f" />
      <path d="M122 38 Q152 0 132 2 Q110 6 106 34Z" fill="#d1402f" />
      <path d="M80 30 Q66 12 70 8 Q84 12 88 30Z" fill="#a92f22" stroke="none" />
      <path d="M120 30 Q134 12 130 8 Q116 12 112 30Z" fill="#a92f22" stroke="none" />
      <circle cx={100} cy={36} r={8} fill="#d1402f" />
    </>,
  },

  diluc: {
    eye: '#c0392b',
    back: <>
      <path d="M136 90 Q178 94 180 132 Q182 162 162 184 Q170 152 160 134 Q152 118 136 112Z" fill="#b8312b" />
      <path d="M150 112 Q166 124 168 150" stroke="#8f2420" strokeWidth={3} fill="none" />
      <rect x={140} y={92} width={14} height={18} rx={4} fill="#1b1a20" transform="rotate(-20 147 101)" />
      <path d={BOB} fill="#b8312b" />
    </>,
    body: <Body coat="#2b2a33" shade="#1b1a20" legs="#2b2a33" shoes="#1b1a20">
      <path d="M72 114 L86 132 L100 120 L114 132 L128 114 Q100 106 72 114Z" fill="#3d3c48" strokeWidth={3} />
      <path d="M93 124 L107 124 L100 140Z" fill="#b8312b" strokeWidth={3} />
      <circle cx={100} cy={152} r={3} fill="#e0a526" strokeWidth={2} />
      <circle cx={100} cy={164} r={3} fill="#e0a526" strokeWidth={2} />
    </Body>,
    front: <>
      <Bangs fill="#b8312b" shine="#d9554a" />
      <path d="M46 86 Q40 114 52 130 L60 98Z" fill="#b8312b" />
      <path d="M154 86 Q160 114 148 130 L140 98Z" fill="#b8312b" />
    </>,
  },
}
