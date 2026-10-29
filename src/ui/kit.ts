export const card = 'g-panel p-5'
export const btn = 'g-btn'
export const shuffle = <T,>(xs: readonly T[]) => xs.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map(([, x]) => x)
export const sample = <T,>(xs: readonly T[], n: number) => shuffle(xs).slice(0, n)
