export type Pt = [number, number]

const N = 24
const TOLERANCE = 13       // mean distance on KanjiVG's 109×109 grid

export function resample(pts: Pt[], n = N): Pt[] {
  if (pts.length < 2) return Array.from({ length: n }, () => pts[0] ?? [0, 0])
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  const total = seg.reduce((a, b) => a + b, 0) || 1
  const out: Pt[] = [pts[0]]
  let acc = 0, j = 0
  for (let k = 1; k < n; k++) {
    const target = (total * k) / (n - 1)
    while (j < seg.length - 1 && acc + seg[j] < target) acc += seg[j++]
    const t = seg[j] ? (target - acc) / seg[j] : 0
    const [a, b] = [pts[j], pts[j + 1]]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

const meanDist = (a: Pt[], b: Pt[]) => a.reduce((s, p, i) => s + Math.hypot(p[0] - b[i][0], p[1] - b[i][1]), 0) / a.length

export type Verdict = { ok: true } | { ok: false; reason: 'direction' | 'order' | 'shape' }

/** Judges stroke number `index` of a character: right shape, right place, right direction, right order. */
export function judgeStroke(user: Pt[], refs: Pt[][], index: number): Verdict {
  const u = resample(user)
  const fits = (ref: Pt[]) => meanDist(u, ref) < TOLERANCE
  if (fits(refs[index])) return { ok: true }
  if (meanDist([...u].reverse(), refs[index]) < TOLERANCE) return { ok: false, reason: 'direction' }
  if (refs.some((r, j) => j !== index && fits(r))) return { ok: false, reason: 'order' }
  return { ok: false, reason: 'shape' }
}

export const REASON = {
  direction: 'Arah goresannya terbalik',
  order: 'Urutan goresannya salah',
  shape: 'Bentuk atau posisinya belum pas',
}
