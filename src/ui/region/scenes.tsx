/*
 * Region scenery, drawn on a 1440×900 canvas that is cropped to the screen (xMidYMax slice), so each
 * landmark sits near the middle where phones still show it. Colours are fixed per region; the sky
 * gradient underneath comes from the region tokens in index.css.
 */

const seigaiha = (y: number, color: string, w = 1440) => (
  <g fill="none" stroke={color} strokeWidth={2} opacity={0.5}>
    {Array.from({ length: Math.ceil(w / 60) + 1 }, (_, i) => (
      <g key={i} transform={`translate(${i * 60} ${y})`}>
        <path d="M-30 0a30 30 0 0 1 60 0M-22 0a22 22 0 0 1 44 0M-14 0a14 14 0 0 1 28 0" />
      </g>
    ))}
  </g>
)

/* ── Mondstadt: the city of freedom on Cider Lake, windmills, the Windrise oak ─────────────── */
function Mondstadt() {
  return (
    <>
      <circle cx={1180} cy={150} r={70} fill="#fff8dc" opacity={0.85} />
      <g fill="#ffffff" opacity={0.75}>
        <ellipse cx={260} cy={160} rx={130} ry={26} /><ellipse cx={330} cy={140} rx={80} ry={30} />
        <ellipse cx={980} cy={110} rx={110} ry={20} /><ellipse cx={1040} cy={95} rx={60} ry={24} />
      </g>
      {/* far ridge of Starfell valley */}
      <path d="M0 520 C180 430 330 470 470 420 S760 380 900 430 1200 400 1440 450 V900 H0z" fill="#9fcbb8" />
      {/* Mondstadt city on its island: walls, towers, the Cathedral of Favonius spire */}
      <g fill="#6f9fa0">
        <path d="M520 520 h400 v-40 h-30 v-30 h-40 v30 h-60 v-60 l-20 -30 -20 30 v60 h-40 v-90 l-12 -18 v-80 l-10 -40 -10 40 v80 l-12 18 v90 h-60 v-40 h-40 v40 h-46z" />
        <path d="M690 300 l10 -55 10 55z" />
        <rect x={560} y={470} width={26} height={50} /><path d="M556 470 l17 -26 17 26z" />
        <rect x={860} y={460} width={28} height={60} /><path d="M856 460 l18 -28 18 28z" />
      </g>
      {/* Cider Lake */}
      <path d="M0 560 C300 540 520 540 720 548 S1160 540 1440 556 V640 H0z" fill="#7cc3d8" />
      <g stroke="#e8fbff" strokeWidth={3} strokeLinecap="round" opacity={0.7}>
        <path d="M300 575 h70M820 585 h110M1120 570 h60M520 600 h50" />
      </g>
      {/* rolling hills */}
      <path d="M0 640 C220 590 420 610 600 650 S1000 610 1200 630 1440 640 1440 640 V900 H0z" fill="#79b36a" />
      <path d="M0 720 C260 670 520 700 760 730 S1220 690 1440 720 V900 H0z" fill="#5f9e55" />
      {/* windmills */}
      {[{ x: 240, y: 600, s: 1 }, { x: 1170, y: 610, s: 0.8 }].map((m, i) => (
        <g key={i} transform={`translate(${m.x} ${m.y}) scale(${m.s})`}>
          <path d="M-18 0 L-10 -120 h20 L18 0z" fill="#efe4cc" stroke="#7b6a4f" strokeWidth={3} />
          <path d="M-14 -120 l14 -22 14 22z" fill="#a0533a" />
          <g className="anim-spin" style={{ animationDuration: `${14 + i * 4}s` }}>
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a} 0 -108)`}>
                <path d="M0 -108 L0 -200" stroke="#7b6a4f" strokeWidth={4} />
                <path d="M2 -120 h22 v-74 h-22z" fill="#f7f0de" stroke="#7b6a4f" strokeWidth={2.5} />
              </g>
            ))}
            <circle cx={0} cy={-108} r={7} fill="#7b6a4f" />
          </g>
        </g>
      ))}
      {/* Windrise: the great oak */}
      <g transform="translate(1310 700)">
        <path d="M-14 0 C-10 -60 -20 -110 -6 -150 h18 C24 -110 14 -60 18 0z" fill="#6d4a32" />
        <g fill="#4f8a4c"><circle cx={0} cy={-190} r={80} /><circle cx={-70} cy={-160} r={55} /><circle cx={70} cy={-165} r={58} /></g>
        <g fill="#6aa35f" opacity={0.8}><circle cx={-20} cy={-215} r={45} /><circle cx={45} cy={-190} r={35} /></g>
      </g>
      {/* foreground grass with Cecilias and dandelions */}
      <path d="M0 800 C300 760 600 790 900 800 S1300 770 1440 790 V900 H0z" fill="#4c8a47" />
      <g>
        {[90, 420, 640, 980, 1240].map((x, i) => (
          <g key={x} transform={`translate(${x} ${812 - (i % 2) * 14})`}>
            <path d="M0 0 v-40" stroke="#3a6e38" strokeWidth={3} />
            {i % 2 === 0
              ? <g fill="#fdfdf7">{[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx={0} cy={-48} rx={4} ry={10} transform={`rotate(${a} 0 -40)`} />)}<circle cx={0} cy={-40} r={3} fill="#f3d47a" /></g>
              : <g><circle cx={0} cy={-44} r={10} fill="#ffffff" opacity={0.9} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M0 -44 l0 -12" stroke="#ffffff" strokeWidth={1.5} transform={`rotate(${a} 0 -44)`} />)}</g>}
          </g>
        ))}
      </g>
      {/* wind currents */}
      <g fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" opacity={0.6}>
        <path className="anim-sway" style={{ animationDuration: '7s' }} d="M80 330 c80 -40 160 -40 230 0 s120 20 160 -20" />
        <path className="anim-sway" style={{ animationDuration: '9s' }} d="M980 300 c60 -30 130 -30 190 0 s90 20 130 -10" />
      </g>
    </>
  )
}

/* ── Liyue: Jueyun Karst in the mist, the harbour roofs, the Jade Chamber above ───────────── */
function Liyue() {
  const pillar = (x: number, h: number, w: number, fill: string) => (
    <g key={`${x}${h}`} transform={`translate(${x} 640)`}>
      <path d={`M${-w / 2} 0 C${-w / 2} ${-h * 0.6} ${-w * 0.42} ${-h} 0 ${-h} S${w / 2} ${-h * 0.6} ${w / 2} 0z`} fill={fill} />
      <g fill="#3e6b4a" opacity={0.85}><ellipse cx={-w * 0.12} cy={-h + 6} rx={w * 0.28} ry={9} /><ellipse cx={w * 0.16} cy={-h + 12} rx={w * 0.2} ry={7} /></g>
    </g>
  )
  return (
    <>
      <circle cx={260} cy={190} r={90} fill="#ffe6a8" opacity={0.9} />
      {/* xiangyun cloud scrolls */}
      <g fill="none" stroke="#fff4d6" strokeWidth={5} strokeLinecap="round" opacity={0.85}>
        <path d="M120 120 c0 -30 50 -30 50 0 c0 20 -30 20 -30 0 M170 120 h120 c30 0 30 -40 0 -40" />
        <path d="M1060 210 c0 -28 46 -28 46 0 c0 18 -28 18 -28 0 M1106 210 h140 c26 0 26 -36 0 -36" />
      </g>
      {/* the Jade Chamber, floating */}
      <g transform="translate(990 150)">
        <path d="M-120 60 q120 70 240 0 q-40 50 -120 60 q-80 -10 -120 -60z" fill="#8a7a6a" opacity={0.85} />
        <rect x={-90} y={10} width={180} height={50} fill="#e7d3a3" />
        <path d="M-120 14 q120 -40 240 0 l-20 -26 q-100 -26 -200 0z" fill="#3f6b58" />
        <rect x={-50} y={-40} width={100} height={30} fill="#e7d3a3" />
        <path d="M-75 -36 q75 -30 150 0 l-16 -22 q-60 -18 -118 0z" fill="#3f6b58" />
        <g fill="#c64a2e">{[-70, -35, 0, 35, 70].map((x) => <rect key={x} x={x - 4} y={18} width={8} height={34} />)}</g>
      </g>
      {/* karst pillars, three depths of mist */}
      <g opacity={0.55}>{[[140, 360, 90], [420, 300, 80], [1180, 340, 100], [1360, 280, 80]].map(([x, h, w]) => pillar(x, h, w, '#c9b48f'))}</g>
      <g opacity={0.8}>{[[60, 260, 110], [330, 220, 90], [1240, 250, 110]].map(([x, h, w]) => pillar(x, h, w, '#a28d68'))}</g>
      <path d="M0 560 C240 530 480 560 720 540 S1200 530 1440 550 V900 H0z" fill="#f6e7c4" opacity={0.7} />
      {/* Liyue Harbor: Yuehai Pavilion roofs over the water */}
      <g transform="translate(720 650)">
        <rect x={-220} y={-60} width={440} height={60} fill="#e5cfa0" />
        <path d="M-270 -56 q270 -60 540 0 l-30 -30 q-240 -40 -480 0z" fill="#7a3b26" />
        <rect x={-130} y={-140} width={260} height={56} fill="#e5cfa0" />
        <path d="M-180 -136 q180 -50 360 0 l-26 -28 q-154 -34 -308 0z" fill="#7a3b26" />
        <rect x={-50} y={-200} width={100} height={40} fill="#e5cfa0" />
        <path d="M-80 -196 q80 -34 160 0 l-18 -24 q-62 -20 -124 0z" fill="#7a3b26" />
        <path d="M0 -236 v-30" stroke="#d6a340" strokeWidth={6} />
        <g fill="#b8432c">{[-180, -120, -60, 0, 60, 120, 180].map((x) => <rect key={x} x={x - 5} y={-52} width={10} height={52} />)}</g>
        <g fill="#f3c34f">{[-240, 240, -150, 150].map((x, i) => <ellipse key={x} cx={x} cy={i < 2 ? -40 : -126} rx={8} ry={11} />)}</g>
      </g>
      <path d="M0 650 C300 640 600 660 900 650 S1300 640 1440 650 V900 H0z" fill="#d9a86a" />
      <path d="M0 700 C320 680 640 700 960 690 S1300 680 1440 690 V900 H0z" fill="#8fb8b3" />
      <g stroke="#f7efd8" strokeWidth={3} strokeLinecap="round" opacity={0.6}><path d="M200 730 h80M640 760 h120M1100 740 h70" /></g>
      {/* cliffs and glaze lilies in front */}
      <path d="M0 820 C200 780 380 800 520 830 S760 860 900 830 1240 790 1440 820 V900 H0z" fill="#7a5a3a" />
      {[140, 300, 1180, 1330].map((x) => (
        <g key={x} transform={`translate(${x} 812)`}>
          <path d="M0 0 v-46" stroke="#4d6b3c" strokeWidth={3} />
          <g fill="#f4f1ff" stroke="#b9b2e6" strokeWidth={1.5}>{[-30, 0, 30].map((a) => <path key={a} d="M0 -46 q-9 -20 0 -34 q9 14 0 34z" transform={`rotate(${a} 0 -46)`} />)}</g>
        </g>
      ))}
    </>
  )
}

/* ── Inazuma: eternal storm, Tenshukaku, the Sacred Sakura on Mt. Yougou, torii in the sea ─── */
function Inazuma() {
  return (
    <>
      {/* storm clouds and the Raiden mitsudomoe in the sky */}
      <g fill="#4d3c84" opacity={0.75}>
        <ellipse cx={240} cy={120} rx={260} ry={70} /><ellipse cx={720} cy={80} rx={300} ry={70} /><ellipse cx={1220} cy={130} rx={260} ry={70} />
      </g>
      <g transform="translate(720 210)" opacity={0.35}>
        <circle r={92} fill="none" stroke="#e3d0ff" strokeWidth={4} />
        {[0, 120, 240].map((a) => <path key={a} d="M0 -56a24 24 0 1 1 -1 48c-24 0 -42 15 -48 36 -9 -42 15 -84 49 -84z" fill="#e3d0ff" transform={`rotate(${a})`} />)}
      </g>
      {/* lightning */}
      <g className="anim-flash" stroke="#f2e6ff" strokeWidth={5} fill="none" strokeLinejoin="round">
        <path d="M1080 60 l-40 90 h36 l-50 110 h30 l-56 120" />
      </g>
      <g className="anim-flash" style={{ animationDelay: '4.5s' }} stroke="#d9c4ff" strokeWidth={4} fill="none" strokeLinejoin="round">
        <path d="M330 40 l-30 70 h28 l-36 80" />
      </g>
      {/* Mt. Yougou with the Grand Narukami Shrine and the Sacred Sakura */}
      <path d="M760 620 C860 470 940 400 1060 360 C1180 400 1260 480 1440 560 V700 H760z" fill="#55457f" />
      <g transform="translate(1065 360)">
        <path d="M-10 0 C-14 -40 -30 -60 -50 -76 M10 0 C14 -40 34 -58 56 -70 M0 0 V-80" stroke="#3a2a4f" strokeWidth={10} strokeLinecap="round" fill="none" />
        <g fill="#f7b6cf"><circle cx={0} cy={-120} r={70} /><circle cx={-70} cy={-90} r={48} /><circle cx={72} cy={-96} r={50} /></g>
        <g fill="#ffd6e6" opacity={0.9}><circle cx={-20} cy={-140} r={36} /><circle cx={40} cy={-120} r={30} /></g>
        <circle cx={0} cy={-100} r={120} fill="#ffc9df" opacity={0.18} />
      </g>
      {/* Tenshukaku on Narukami Island */}
      <path d="M0 640 C140 560 300 540 460 560 C560 520 640 560 760 620 V700 H0z" fill="#3f3366" />
      <g transform="translate(470 560)" fill="#2a2147">
        <rect x={-110} y={-20} width={220} height={40} />
        <path d="M-140 -18 h280 l-30 -26 h-220z" />
        <rect x={-80} y={-80} width={160} height={40} />
        <path d="M-110 -40 h220 l-26 -24 h-168z" />
        <rect x={-55} y={-130} width={110} height={36} />
        <path d="M-80 -92 h160 l-22 -22 h-116z" />
        <path d="M-60 -130 h120 l-24 -30 h-72z" />
        <path d="M-40 -166 l40 -26 40 26z" />
        <g fill="#f3d57a"><rect x={-70} y={-12} width={10} height={14} /><rect x={-20} y={-12} width={10} height={14} /><rect x={30} y={-12} width={10} height={14} /><rect x={-30} y={-72} width={10} height={12} /><rect x={20} y={-72} width={10} height={12} /></g>
      </g>
      {/* the sea with seigaiha waves and a torii standing in it */}
      <path d="M0 680 H1440 V900 H0z" fill="#3b4d8f" />
      {seigaiha(720, '#9bb0f0')}
      {seigaiha(780, '#8aa0e6')}
      <g transform="translate(180 760)">
        <path d="M-90 -150 q90 18 180 0 l-8 16 h-164z" fill="#c9302c" />
        <rect x={-86} y={-150} width={172} height={10} fill="#2a1d1d" />
        <rect x={-74} y={-118} width={148} height={12} fill="#c9302c" />
        <rect x={-60} y={-136} width={14} height={140} fill="#c9302c" /><rect x={46} y={-136} width={14} height={140} fill="#c9302c" />
        <rect x={-6} y={-136} width={12} height={20} fill="#c9302c" />
      </g>
      {/* foreground: cliff with a stone lantern */}
      <path d="M940 900 C980 820 1080 800 1180 810 S1380 800 1440 780 V900z" fill="#2c2350" />
      <g transform="translate(1250 806)" fill="#8b85a8">
        <rect x={-10} y={-40} width={20} height={40} /><rect x={-26} y={-48} width={52} height={10} /><rect x={-18} y={-74} width={36} height={26} />
        <path d="M-32 -74 h64 l-32 -22z" /><rect x={-8} y={-66} width={16} height={12} fill="#ffe08a" />
      </g>
    </>
  )
}

/* ── Sumeru: the great tree of Sumeru City, rainforest canopy, glowing mushrooms ──────────── */
function Sumeru() {
  const leaf = (x: number, y: number, r: number, s: number, fill: string) => (
    <path key={`${x}${y}`} d="M0 0 C40 -30 120 -30 170 0 C120 30 40 30 0 0z M0 0 L170 0" fill={fill} stroke="#2f5a2a" strokeWidth={2} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
  )
  return (
    <>
      {/* light shafts through the canopy */}
      <g fill="#fffbe0" opacity={0.25}>
        <path d="M560 0 L640 0 L540 900 L420 900z" /><path d="M820 0 L880 0 L1000 900 L900 900z" />
      </g>
      {/* the great tree holding Sumeru City */}
      <g transform="translate(720 760)">
        <path d="M-90 0 C-80 -160 -120 -280 -60 -380 h120 C120 -280 80 -160 90 0z" fill="#7b5a3c" />
        <path d="M-60 -380 C-200 -420 -320 -380 -400 -320 M60 -380 C200 -430 320 -390 410 -330 M0 -380 V-470" stroke="#7b5a3c" strokeWidth={26} fill="none" strokeLinecap="round" />
        <g fill="#5d9a3c"><ellipse cx={0} cy={-520} rx={330} ry={110} /><ellipse cx={-320} cy={-400} rx={190} ry={80} /><ellipse cx={330} cy={-410} rx={200} ry={80} /></g>
        <g fill="#7fbf4e" opacity={0.85}><ellipse cx={-60} cy={-560} rx={180} ry={60} /><ellipse cx={170} cy={-500} rx={120} ry={45} /></g>
        {/* city platforms with domed roofs among the branches */}
        <g fill="#efe1c0">
          <rect x={-200} y={-350} width={120} height={36} rx={6} /><path d="M-170 -350 a30 30 0 0 1 60 0z" fill="#d9b45a" />
          <rect x={90} y={-330} width={130} height={36} rx={6} /><path d="M125 -330 a30 30 0 0 1 60 0z" fill="#3f9a8a" />
          <rect x={-40} y={-440} width={80} height={30} rx={6} /><path d="M-25 -440 a25 25 0 0 1 50 0z" fill="#d9b45a" />
        </g>
      </g>
      {/* forest floor */}
      <path d="M0 700 C260 670 480 700 720 690 S1200 670 1440 690 V900 H0z" fill="#3f7d3a" />
      <path d="M0 790 C320 760 640 800 960 780 S1300 770 1440 780 V900 H0z" fill="#2f6430" />
      {/* glowing mushrooms */}
      {[[260, 790], [1180, 780], [1300, 800]].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <rect x={-5} y={-28} width={10} height={28} fill="#e8f3d0" />
          <path d="M-26 -26 a26 20 0 0 1 52 0z" fill="#b6f06a" />
          <circle cx={0} cy={-32} r={40} fill="#d3f59c" opacity={0.25} className="anim-glint" style={{ animationDuration: '3.5s' }} />
        </g>
      ))}
      {/* big leaves framing the scene */}
      {leaf(-30, 120, 25, 1.6, '#4f8f3a')}
      {leaf(-20, 300, 10, 1.3, '#6aa848')}
      {leaf(1470, 160, 160, 1.6, '#4f8f3a')}
      {leaf(1470, 360, 175, 1.2, '#6aa848')}
      {leaf(40, 880, -30, 1.4, '#3f7d36')}
      {leaf(1420, 880, -150, 1.4, '#3f7d36')}
      {/* padisarah flowers */}
      {[520, 900].map((x) => (
        <g key={x} transform={`translate(${x} 800)`}>
          <path d="M0 0 v-40" stroke="#2f5a2a" strokeWidth={3} />
          <g fill="#c7a6f0">{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-52} rx={5} ry={11} transform={`rotate(${a} 0 -42)`} />)}</g>
          <circle cx={0} cy={-42} r={3} fill="#fff2a8" />
        </g>
      ))}
    </>
  )
}

/* ── Fontaine: the Court of Fontaine above its great waterfall, canals, Belle Époque arches ── */
function Fontaine() {
  return (
    <>
      <circle cx={1150} cy={170} r={66} fill="#ffffff" opacity={0.8} />
      <g fill="#ffffff" opacity={0.7}><ellipse cx={300} cy={150} rx={150} ry={26} /><ellipse cx={1000} cy={120} rx={120} ry={22} /></g>
      {/* the plateau city with Palais Mermonia's dome and the opera's spires */}
      <path d="M360 520 C420 430 520 400 720 396 S1020 430 1080 520z" fill="#a9c6e0" />
      <g transform="translate(720 400)" fill="#e9eef6" stroke="#7d93b8" strokeWidth={2}>
        <rect x={-200} y={-60} width={400} height={60} />
        <g fill="#9fb8d9">{[-170, -120, -70, 70, 120, 170].map((x) => <path key={x} d="M0 0 v-30 a12 12 0 0 1 24 0 v30z" transform={`translate(${x - 12} 0)`} />)}</g>
        <rect x={-80} y={-130} width={160} height={70} />
        <path d="M-70 -130 a70 70 0 0 1 140 0z" fill="#5f8fc6" />
        <path d="M0 -200 v-40" /><circle cx={0} cy={-244} r={6} fill="#d8b04c" />
        <rect x={-180} y={-140} width={34} height={80} /><path d="M-184 -140 l21 -60 21 60z" fill="#5f8fc6" />
        <rect x={146} y={-140} width={34} height={80} /><path d="M142 -140 l21 -60 21 60z" fill="#5f8fc6" />
        {/* clock face */}
        <circle cx={0} cy={-90} r={18} fill="#fff8e6" /><path d="M0 -90 v-12 M0 -90 l8 5" stroke="#5f6f8f" />
      </g>
      {/* the waterfall pouring off the plateau */}
      <g>
        <path d="M560 520 C570 600 560 680 540 760 H900 C880 680 870 600 880 520z" fill="#cfe8fb" opacity={0.9} />
        <g stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.85}>
          {[600, 660, 720, 780, 840].map((x, i) => <path key={x} d={`M${x} 530 V${720 + (i % 2) * 30}`} strokeDasharray="30 22" className="anim-glint" style={{ animationDuration: `${2 + i * 0.4}s` }} />)}
        </g>
      </g>
      {/* aqueduct arches either side */}
      <g fill="#dfe7f2" stroke="#8ea3c3" strokeWidth={2}>
        <path d="M0 560 H480 V620 H0z" /><path d="M960 560 H1440 V620 H960z" />
      </g>
      <g fill="#7fa0c8">{[40, 140, 240, 340, 1000, 1100, 1200, 1300].map((x) => <path key={x} d="M0 0 a36 36 0 0 1 72 0 v40 h-72z" transform={`translate(${x} 610)`} />)}</g>
      {/* the lake */}
      <path d="M0 650 H1440 V900 H0z" fill="#3f86c8" />
      <path d="M0 700 C300 690 600 710 900 700 S1300 690 1440 700 V900 H0z" fill="#3474b6" />
      <g stroke="#cfe8fb" strokeWidth={3} strokeLinecap="round" opacity={0.7}>
        <path d="M120 740 h90M420 780 h140M760 760 h80M1080 790 h130M1290 740 h70" />
        <ellipse cx={720} cy={770} rx={190} ry={12} fill="none" />
      </g>
      {/* wrought-iron railing in front */}
      <g stroke="#2a3f66" strokeWidth={4} fill="none">
        <path d="M0 846 H1440" />
        {Array.from({ length: 25 }, (_, i) => <path key={i} d={`M${i * 60} 846 V900 M${i * 60 + 30} 860 q0 -18 0 -24 a8 8 0 0 1 16 0`} />)}
      </g>
    </>
  )
}

/* ── Natlan: the volcano, flat-topped mesas, tribal patterns and fire ─────────────────────── */
function Natlan() {
  return (
    <>
      <circle cx={260} cy={170} r={84} fill="#ffe1a6" opacity={0.85} />
      {/* volcano with its lava glow */}
      <path d="M440 640 L640 300 Q720 270 800 300 L1000 640z" fill="#6b3226" />
      <path d="M640 300 Q720 270 800 300 L760 330 Q720 316 680 330z" fill="#f27a2a" />
      <path d="M700 320 C690 400 720 460 700 560 M740 322 C760 420 730 480 760 600" stroke="#ff9a3c" strokeWidth={8} fill="none" opacity={0.85} />
      <g fill="#7a4a42" opacity={0.6}>
        <ellipse cx={720} cy={220} rx={70} ry={34} /><ellipse cx={780} cy={160} rx={60} ry={30} /><ellipse cx={700} cy={110} rx={46} ry={24} />
      </g>
      <circle cx={720} cy={290} r={110} fill="#ff8a3a" opacity={0.18} className="anim-glint" style={{ animationDuration: '4s' }} />
      {/* mesas */}
      <path d="M0 640 V470 h80 l30 -30 h160 l30 30 h40 V640z" fill="#b5603a" />
      <path d="M1100 640 V450 h40 l30 -40 h180 l30 40 h60 V640z" fill="#b5603a" />
      <g stroke="#8a3f26" strokeWidth={3} opacity={0.7}><path d="M0 520 H340M0 570 H340M1100 500 H1440M1100 560 H1440" /></g>
      {/* plains */}
      <path d="M0 630 C280 610 520 640 760 630 S1200 610 1440 630 V900 H0z" fill="#d98a48" />
      <path d="M0 720 C300 700 620 730 940 715 S1300 700 1440 712 V900 H0z" fill="#b8643a" />
      {/* tribal zigzag band */}
      <g fill="none" stroke="#f6d08a" strokeWidth={4} opacity={0.8}>
        <path d={`M0 760 ${Array.from({ length: 37 }, (_, i) => `L${i * 40 + 20} ${i % 2 ? 760 : 744}`).join(' ')}`} />
        <path d={`M0 780 ${Array.from({ length: 37 }, (_, i) => `L${i * 40 + 20} ${i % 2 ? 780 : 796}`).join(' ')}`} stroke="#5e1d14" />
      </g>
      {/* totems with flame bowls */}
      {[180, 1260].map((x) => (
        <g key={x} transform={`translate(${x} 860)`}>
          <rect x={-18} y={-120} width={36} height={120} fill="#5e2a1c" />
          <g fill="#f6d08a"><rect x={-12} y={-100} width={24} height={6} /><rect x={-12} y={-60} width={24} height={6} /><path d="M-8 -84 h16 l-8 10z" /></g>
          <path d="M-30 -120 h60 l-10 -16 h-40z" fill="#3b1a12" />
          <path d="M0 -136 c-14 -14 -8 -30 0 -46 c8 16 14 32 0 46z" fill="#ff8a3a" className="anim-glint" style={{ animationDuration: '1.6s' }} />
        </g>
      ))}
      <path d="M0 860 C360 840 720 870 1080 850 S1360 846 1440 850 V900 H0z" fill="#7a3422" />
    </>
  )
}

/* ── Plane of Euthymia: the endless violet void where Ei meditates ─────────────────────────── */
function Euthymia() {
  return (
    <>
      <circle cx={720} cy={230} r={150} fill="#f2e6ff" opacity={0.85} />
      <circle cx={720} cy={230} r={240} fill="#d9c4ff" opacity={0.15} />
      <g fill="#ffffff">{[[160, 120], [380, 80], [1120, 110], [1300, 220], [240, 320], [980, 60], [600, 420], [1240, 400]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2 + (i % 3)} className="anim-glint" style={{ animationDuration: `${2 + i * 0.5}s` }} />)}</g>
      {/* floating isle with the lone sakura */}
      <g transform="translate(720 560)">
        <path d="M-200 0 h400 q-60 80 -200 110 q-140 -30 -200 -110z" fill="#3a2a6e" />
        <path d="M-200 0 h400 v-12 h-400z" fill="#7a63b8" />
        <path d="M0 -10 C-6 -60 -24 -90 -60 -110 M0 -10 C10 -70 40 -90 70 -100 M0 -10 V-120" stroke="#2a1d4a" strokeWidth={9} fill="none" strokeLinecap="round" />
        <g fill="#e7b8ff"><circle cx={0} cy={-160} r={64} /><circle cx={-70} cy={-120} r={44} /><circle cx={74} cy={-128} r={46} /></g>
        <g fill="#f6dcff" opacity={0.85}><circle cx={-20} cy={-180} r={32} /><circle cx={40} cy={-150} r={26} /></g>
      </g>
      {/* still mirror sea */}
      <path d="M0 700 H1440 V900 H0z" fill="#2a1f55" />
      <g fill="none" stroke="#b48cf0" strokeWidth={2} opacity={0.6}>
        <ellipse cx={720} cy={760} rx={260} ry={18} /><ellipse cx={720} cy={760} rx={420} ry={30} /><ellipse cx={720} cy={760} rx={600} ry={44} />
      </g>
      <g transform="translate(720 230)" opacity={0.25}>
        {[0, 120, 240].map((a) => <path key={a} d="M0 -56a24 24 0 1 1 -1 48c-24 0 -42 15 -48 36 -9 -42 15 -84 49 -84z" fill="#6a43b8" transform={`rotate(${a})`} />)}
      </g>
    </>
  )
}

const SCENES = { mondstadt: Mondstadt, liyue: Liyue, inazuma: Inazuma, sumeru: Sumeru, fontaine: Fontaine, natlan: Natlan, euthymia: Euthymia }

export function RegionScene({ region }: { region: keyof typeof SCENES }) {
  const Scene = SCENES[region]
  return <Scene />
}
