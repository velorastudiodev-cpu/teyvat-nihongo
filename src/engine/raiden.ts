import { db, type DayLog, type Profile, type RaidenBond } from '../data/db'
import { stageIndex } from '../data/curriculum'
import { DAILY, TALKS, type Talk } from '../modules/raiden/talks'
import { earn, spend } from './game/economy'
import { streak } from './game/rules'
import { today } from './srs/srs'

/*
 * The Raiden Shogun questline.
 *   hidden → letter (reach Inazuma, or the secret: a 7-day streak and three taps on Inazuma's sigil)
 *   → trial (pass the Musou trial: she joins you) → bond levels 1–10 through daily talks and gifts
 *   → level 5 opens the Plane of Euthymia, where you meet Ei; level 10 is the promise of eternity.
 */

export const BOND_LEVELS = [0, 30, 80, 150, 240, 350, 480, 640, 830, 1050]
export const bondLevel = (bond: number) => BOND_LEVELS.filter((t) => bond >= t).length
export const EUTHYMIA_LEVEL = 5
export const SECRET_STREAK = 7
export const SECRET_TAPS = 3
export const TRIAL_PASS = 6
export const TRIAL_SIZE = 8
export const TRIAL_REWARD = 300
export const DANGO_PRICE = 60
export const DANGO_BOND = 25
export const TALK_BOND = 10          // per good answer, plus the same for finishing
export const STUDY_BOND_MAX = 20     // studying with her as companion, credited at the day's talk

export const REWARDS: { level: number; title: string; desc: string }[] = [
  { level: 1, title: 'Pengikut Shogun', desc: 'Raiden Shogun bergabung, bisa jadi companion, dan +300 Kirameki' },
  { level: 2, title: 'Sapaan khusus', desc: 'Raiden menyapamu sesuai waktu (pagi, siang, malam)' },
  { level: 3, title: 'Murid Tenshukaku', desc: 'Pelajaran keigo dari Shogun' },
  { level: 5, title: 'Tamu Alam Euthymia', desc: 'Bertemu Ei, membuka tema Alam Euthymia, dan Ei bisa menemanimu' },
  { level: 7, title: 'Teman Minum Teh Ei', desc: 'Ei membagikan rahasia kecilnya' },
  { level: 10, title: 'Janji Keabadian', desc: 'Ei menjadi pendamping abadimu, dengan sapaan dan bingkai emas khusus' },
]

export type RaidenPhase = 'hidden' | 'letter' | 'bond'
export const phaseOf = (r?: RaidenBond): RaidenPhase => (!r?.letter ? 'hidden' : !r.trial ? 'letter' : 'bond')
export const metEi = (p?: Profile) => !!p?.raiden?.ei
export const titleOf = (r?: RaidenBond) => [...REWARDS].reverse().find((x) => r?.trial && bondLevel(r.bond) >= x.level)?.title

const fresh = (): RaidenBond => ({ bond: 0, talks: [] })
async function patch(f: (r: RaidenBond) => Partial<RaidenBond>) {
  const p = await db.profile.get('me')
  const r = p?.raiden ?? fresh()
  await db.profile.update('me', { raiden: { ...r, ...f(r) } })
}

/** Reaching Inazuma (stage N3 or later) sends the Shogun's letter. Returns true if it just arrived. */
export async function checkLetter() {
  const p = await db.profile.get('me')
  if (!p?.stage || p.raiden?.letter || stageIndex(p.stage) < stageIndex('N3')) return false
  await patch(() => ({ letter: Date.now() }))
  return true
}

/** The secret: three taps on Inazuma's sigil on the map, with a 7-day streak. */
export async function tapSigil(): Promise<'letter' | 'hint' | 'count' | 'none'> {
  const p = await db.profile.get('me')
  if (!p || p.raiden?.letter) return 'none'
  const taps = (p.raiden?.taps ?? 0) + 1
  await patch(() => ({ taps }))
  if (taps < SECRET_TAPS) return 'count'
  const days: DayLog[] = await db.days.toArray()
  if (streak(days, today()) < SECRET_STREAK) { await patch(() => ({ taps: 0 })); return 'hint' }
  await patch(() => ({ letter: Date.now() }))
  return 'letter'
}

/** Passing the trial: she joins (if not owned already) and the bond begins. */
export async function passTrial() {
  const p = await db.profile.get('me')
  if (p?.raiden?.trial) return
  await patch(() => ({ trial: Date.now() }))
  if (!(await db.owned.get('raiden'))) await db.owned.add({ charId: 'raiden', friendship: 0, obtainedAt: Date.now() })
  await earn(TRIAL_REWARD)
}

/** Today's conversation: the next story talk her level allows, else a short daily chat; undefined once done today. */
export function talkFor(p?: Profile): Talk | undefined {
  const r = p?.raiden
  if (!r?.trial || r.lastTalk === today()) return
  const level = bondLevel(r.bond)
  const story = TALKS.find((t) => t.level <= level && !r.talks.includes(t.id))
  if (story) return story
  const who = r.ei ? 'ei' : 'shogun'
  const n = Math.floor(Date.parse(today()) / 86_400_000)
  return DAILY[n % DAILY.length](who)
}

/** Finishes a talk: bond for good answers, a share of today's study when she is your companion. */
export async function finishTalk(talk: Talk, good: number) {
  const p = await db.profile.get('me')
  const day = await db.days.get(today())
  const study = p?.companionId === 'raiden' ? Math.min(STUDY_BOND_MAX, Math.floor((day?.xp ?? 0) / 10)) : 0
  const gained = good * TALK_BOND + TALK_BOND + study
  await patch((r) => ({
    bond: r.bond + gained,
    lastTalk: today(),
    talks: r.talks.includes(talk.id) || talk.id.startsWith('d-') ? r.talks : [...r.talks, talk.id],
    ...(talk.euthymia && !r.ei ? { ei: Date.now() } : {}),
  }))
  return { gained, study }
}

/** Dango for Ei (or the Shogun, who passes it on): once a day. */
export async function giveDango() {
  const p = await db.profile.get('me')
  const r = p?.raiden
  if (!r?.trial || r.dango === Date.parse(today())) return false
  if (!(await spend(DANGO_PRICE))) return false
  await patch((x) => ({ bond: x.bond + DANGO_BOND, dango: Date.parse(today()) }))
  return true
}

/* ── the Musou trial: Inazuma words and N5 grammar, so the secret path is passable early ── */
export interface TrialQ { ask: string; prompt: string; answer: string; choices: string[] }
export const TRIAL: TrialQ[] = [
  { ask: 'Cara baca', prompt: '雷', answer: 'かみなり', choices: ['かみなり', 'さくら', 'かたな', 'うみ'] },
  { ask: 'Cara baca', prompt: '永遠', answer: 'えいえん', choices: ['えいえん', 'えいが', 'えんそく', 'ええと'] },
  { ask: 'Cara baca', prompt: '桜', answer: 'さくら', choices: ['さくら', 'さかな', 'そら', 'はな'] },
  { ask: 'Cara baca', prompt: '将軍', answer: 'しょうぐん', choices: ['しょうぐん', 'しょうがつ', 'せんせい', 'しょくどう'] },
  { ask: 'Cara baca', prompt: '刀', answer: 'かたな', choices: ['かたな', 'ちから', 'かたち', 'たな'] },
  { ask: 'Cara baca', prompt: '稲妻', answer: 'いなずま', choices: ['いなずま', 'いなか', 'つま', 'いま'] },
  { ask: 'Artinya', prompt: '約束', answer: 'janji', choices: ['janji', 'pedang', 'hujan', 'kuil'] },
  { ask: 'Artinya', prompt: 'ありがとうございます', answer: 'terima kasih (sopan)', choices: ['terima kasih (sopan)', 'permisi', 'selamat pagi', 'maaf'] },
  { ask: 'Isi partikel', prompt: 'わたし（　）将軍です。', answer: 'は', choices: ['は', 'を', 'に', 'で'] },
  { ask: 'Isi partikel', prompt: '毎日 日本語（　）勉強します。', answer: 'を', choices: ['を', 'が', 'へ', 'と'] },
]
