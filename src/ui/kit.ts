export const card = 'rounded-3xl border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_var(--color-ink)]'
export const btn = 'cursor-pointer rounded-full border-[3px] border-ink px-5 py-2 font-display font-bold shadow-[3px_3px_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed'
export const shuffle = <T,>(xs: readonly T[]) => xs.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map(([, x]) => x)
export const sample = <T,>(xs: readonly T[], n: number) => shuffle(xs).slice(0, n)
