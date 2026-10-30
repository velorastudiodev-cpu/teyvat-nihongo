import { db } from '../../data/db'
import { characters } from '../../characters'
import { DESIGNS } from '../../characters/designs'
import { OUTFITS, STICKERS, THEMES } from '../../data/cosmetics'
import { today } from '../srs/srs'
import { earn, spend } from './economy'
import { PULL_COST, roll, seeded, weekId, type Rarity } from './rules'

export interface Reward { rarity: Rarity; kind: 'character' | 'theme' | 'outfit' | 'sticker'; id: string; name: string; dupe?: number }

// a character "has art" when it has a drawn SVG or bundled illustrations; silhouettes come only once those run out
const hasArt = (c: (typeof characters)[number]) => !!DESIGNS[c.id] || c.assets.idle.endsWith('.webp')

/** This week's featured character: one with art that you don't own yet, if any. */
export async function featured() {
  const owned = new Set(await db.owned.toCollection().primaryKeys())
  const pool = characters.filter((c) => !owned.has(c.id))
  const drawn = pool.filter(hasArt)
  const list = drawn.length ? drawn : pool
  return list.length ? list[Math.floor(seeded(weekId(today()))() * list.length)] : undefined
}

const pickOne = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

/** Spend Kirameki and pull `times`. Duplicates turn into a small Kirameki refund. */
export async function pull(times: number): Promise<Reward[] | undefined> {
  if (!(await spend(PULL_COST * times))) return
  const feat = await featured()
  const out: Reward[] = []
  let pity = (await db.profile.get('me'))?.pity ?? 0
  for (let i = 0; i < times; i++) {
    const r = roll(pity, Math.random())
    pity = r.pity
    if (r.rarity === 5) {
      const owned = new Set(await db.owned.toCollection().primaryKeys())
      const free = characters.filter((c) => !owned.has(c.id))
      const drawn = free.filter(hasArt)
      const c = feat && !owned.has(feat.id) && Math.random() < 0.5 ? feat : pickOne(drawn.length ? drawn : free)
      if (c) { await db.owned.add({ charId: c.id, friendship: 0, obtainedAt: Date.now() }); out.push({ rarity: 5, kind: 'character', id: c.id, name: c.name }) }
      else out.push({ rarity: 5, kind: 'character', id: 'paimon', name: 'Starglitter', dupe: 60 })
    } else {
      const have = new Set(await db.unlocks.where('id').startsWith('cos:').primaryKeys())
      const pool: { kind: Reward['kind']; id: string; name: string }[] = r.rarity === 4
        ? [...THEMES.slice(1).map((t) => ({ kind: 'theme' as const, id: t.id, name: t.name })), ...OUTFITS.map((o) => ({ kind: 'outfit' as const, id: o.id, name: o.name }))]
        : STICKERS.map((s) => ({ kind: 'sticker' as const, id: s.id, name: s.ja }))
      const got = pickOne(pool)
      const key = `cos:${got.kind}:${got.id}`
      if (have.has(key)) out.push({ rarity: r.rarity, ...got, dupe: r.rarity === 4 ? 20 : 5 })
      else { await db.unlocks.add({ id: key, at: Date.now() }); out.push({ rarity: r.rarity, ...got }) }
    }
  }
  const refund = out.reduce((n, r) => n + (r.dupe ?? 0), 0)
  const p = await db.profile.get('me')
  await db.profile.update('me', { pity, pulls: (p?.pulls ?? 0) + times })
  if (refund) await earn(refund)
  return out
}
