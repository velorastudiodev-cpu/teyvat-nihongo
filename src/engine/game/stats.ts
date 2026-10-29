import { db } from '../../data/db'
import { ACHIEVEMENTS, ACHIEVEMENT_REWARD, type Stats } from '../../data/cosmetics'
import { today } from '../srs/srs'
import { claim } from './economy'
import { friendLevel, rank, streak } from './rules'

export async function computeStats(): Promise<Stats> {
  const [items, days, owned, profile, bossWins, domain] = await Promise.all([
    db.items.toArray(), db.days.toArray(), db.owned.toArray(), db.profile.get('me'),
    db.unlocks.where('id').startsWith('boss:').count(), db.scores.get('domain-run:endless'),
  ])
  const count = (k: string) => items.filter((i) => i.kind === k).length
  return {
    kana: count('kana'), kanji: count('kanji'), vocab: count('vocab'), grammar: count('grammar'),
    streak: streak(days, today()),
    ar: rank(days.reduce((n, d) => n + d.xp, 0)).ar,
    chars: owned.length,
    maxFriend: Math.max(1, ...owned.map((o) => friendLevel(o.friendship))),
    pulls: profile?.pulls ?? 0,
    bossWins,
    domainBest: domain?.best ?? 0,
  }
}

/** Unlocks every achievement whose condition now holds; returns the newly earned ones. */
export async function checkAchievements() {
  const stats = await computeStats()
  const earned = []
  for (const a of ACHIEVEMENTS) if (a.check(stats) && (await claim(`ach:${a.id}`, ACHIEVEMENT_REWARD))) earned.push(a)
  return earned
}
