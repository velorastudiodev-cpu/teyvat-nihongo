/* Pure game-economy rules: dates, commissions, streaks, rank, gacha, friendship. All testable without a DB. */

export const DAY = 86_400_000
export const isoDay = (d: Date) => d.toLocaleDateString('sv')
export const addDays = (date: string, n: number) => isoDay(new Date(Date.parse(`${date}T12:00:00`) + n * DAY))
/** Monday-based week id, e.g. "2026-10-26". */
export function weekId(date: string) {
  const d = new Date(`${date}T12:00:00`)
  return addDays(date, -((d.getDay() + 6) % 7))
}

/** Small deterministic RNG so a day's commissions and a week's boss stay the same all day/week. */
export function seeded(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296 }
}

// ── Commissions ──
export interface DayStats { xp: number; reviews: number; correct: number; newItems: number; games?: Record<string, number> }
export interface Commission { id: string; title: string; target: number; progress: (d: DayStats) => number; link: string }

const plays = (d: DayStats, ids: string[]) => ids.reduce((n, id) => n + (d.games?.[id] ?? 0), 0)
const TEMPLATES: ((newPerDay: number) => Commission)[] = [
  () => ({ id: 'review', title: 'Review 30 kartu', target: 30, progress: (d) => d.reviews, link: '/review' }),
  (n) => ({ id: 'new', title: `Pelajari ${Math.max(3, Math.min(n, 10))} item baru`, target: Math.max(3, Math.min(n, 10)), progress: (d) => d.newItems, link: '/learn' }),
  () => ({ id: 'correct', title: 'Jawab benar 25 kali', target: 25, progress: (d) => d.correct, link: '/review' }),
  () => ({ id: 'xp', title: 'Kumpulkan 60 XP', target: 60, progress: (d) => d.xp, link: '/learn' }),
  () => ({ id: 'voice', title: 'Main Voice Fill atau Speed Speak 1×', target: 1, progress: (d) => plays(d, ['voice-fill', 'speed-speak']), link: '/speaking' }),
  () => ({ id: 'kana-game', title: 'Main Kana Rain atau Memory Match 1×', target: 1, progress: (d) => plays(d, ['kana-rain', 'memory-match']), link: '/games' }),
  () => ({ id: 'kanji-game', title: 'Main Stroke Duel atau Radical Forge 1×', target: 1, progress: (d) => plays(d, ['stroke-duel', 'radical-forge']), link: '/games' }),
  () => ({ id: 'grammar-game', title: 'Main game grammar 1×', target: 1, progress: (d) => plays(d, ['particle-shooter', 'sentence-builder', 'fill-blank-rush']), link: '/games' }),
  () => ({ id: 'listen', title: 'Main Listening Echo 1×', target: 1, progress: (d) => plays(d, ['listening-echo']), link: '/games/listening-echo' }),
  () => ({ id: 'domain', title: 'Selesaikan 1 Domain Run', target: 1, progress: (d) => plays(d, ['domain-run']), link: '/domain' }),
]

/** 4 commissions per day: always a review one, plus 3 picked by date. */
export function commissionsFor(date: string, newPerDay = 10): Commission[] {
  const rnd = seeded(date)
  const rest = TEMPLATES.slice(1)
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]] }   // Fisher–Yates: same order on every engine
  return [TEMPLATES[0], ...rest.slice(0, 3)].map((t) => t(newPerDay))
}
export const COMMISSION_REWARD = 40
export const COMMISSION_BONUS = 80

// ── Streak ──
export interface DayMark { date: string; xp: number; frozen?: boolean }
const active = (d?: DayMark) => !!d && (d.xp > 0 || !!d.frozen)

/** Consecutive active days ending today (or yesterday, if today isn't done yet). */
export function streak(days: DayMark[], today: string) {
  const byDate = new Map(days.map((d) => [d.date, d]))
  let date = active(byDate.get(today)) ? today : addDays(today, -1)
  let n = 0
  while (active(byDate.get(date))) { n++; date = addDays(date, -1) }
  return n
}

/** Missed days that freezes can cover, oldest first (only if there's a streak to save and enough freezes). */
export function daysToFreeze(days: DayMark[], today: string, freezes: number): string[] {
  const done = days.filter(active).map((d) => d.date).filter((d) => d < today).sort()
  const last = done.at(-1)
  if (!last) return []
  const gap: string[] = []
  for (let d = addDays(last, 1); d < today; d = addDays(d, 1)) gap.push(d)
  return gap.length && gap.length <= freezes ? gap : []
}

// ── Adventure Rank ──
export function rank(totalXp: number) {
  const ar = Math.min(60, Math.floor(Math.sqrt(totalXp / 40)) + 1)
  const floor = (ar - 1) ** 2 * 40, next = ar ** 2 * 40
  return { ar, into: totalXp - floor, need: next - floor }
}

// ── Gacha ──
export const PULL_COST = 100
export const HARD_PITY = 10        // a character at least every 10 pulls
export const RATE_5 = 0.08, RATE_4 = 0.3
export type Rarity = 3 | 4 | 5

/** One pull: 5★ = character, 4★ = theme/outfit, 3★ = sticker. Returns the new pity count. */
export function roll(pity: number, r: number): { rarity: Rarity; pity: number } {
  if (pity + 1 >= HARD_PITY || r < RATE_5) return { rarity: 5, pity: 0 }
  return { rarity: r < RATE_5 + RATE_4 ? 4 : 3, pity: pity + 1 }
}

// ── Friendship ──
export const FRIEND_LEVELS = [0, 60, 180, 360, 600, 900, 1260, 1680, 2160, 2700]
export const friendLevel = (points: number) => FRIEND_LEVELS.filter((t) => points >= t).length
