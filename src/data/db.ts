import Dexie, { type EntityTable } from 'dexie'
import type { Card } from 'ts-fsrs'
import type { Expression } from '../characters'
import type { Stage, Target } from './curriculum'
import type { Realm } from '../ui/region/regions'

export interface Profile {
  id: 'me'
  companionId: string
  createdAt: number
  onboardedAt?: number
  target?: Target
  targetDate?: string        // ISO date (YYYY-MM-DD)
  minutesPerDay?: number
  placement?: Stage          // where the placement test put the user
  stage?: Stage              // current stage; only moves forward via gate exams
  kirameki?: number
  pity?: number              // pulls since the last character
  pulls?: number
  freezes?: number           // streak freezes in stock
  freezeWeek?: string        // week id of the last free freeze
  theme?: string             // legacy cosmetic theme (superseded by realm)
  realm?: 'auto' | Realm   // screen theme; 'auto' follows your region
  outfit?: string
  raiden?: RaidenBond
}

/** The Raiden Shogun's questline (see engine/raiden). */
export interface RaidenBond {
  letter?: number            // when her letter arrived (reaching Inazuma, or the secret)
  trial?: number             // when the Musou trial was passed
  bond: number               // bond points; levels at engine/raiden BOND_LEVELS
  talks: string[]            // ids of finished conversations
  lastTalk?: string          // date of the last daily conversation
  ei?: number                // when Ei was met in the Plane of Euthymia
  taps?: number              // secret: taps on the Inazuma sigil
  dango?: number             // dango given
  vow?: number               // the last secret: the shrine ceremony with Ei
}

/** One SRS item: a kana, kanji, word or grammar pattern. */
export interface SrsItem {
  id: string                 // e.g. "kana:あ", "kanji:日", "vocab:食べる", "grammar:〜てください"
  kind: 'kana' | 'kanji' | 'vocab' | 'grammar'
  stage: Stage
  card: Card                 // ts-fsrs state
  due: number                // copy of card.due as epoch ms, for indexing
}

export interface ReviewLog { id?: number; itemId: string; rating: number; at: number; ms: number }
export interface Mistake { id?: number; itemId: string; answer: string; expected: string; at: number; fixed: boolean }
export interface Owned { charId: string; friendship: number; obtainedAt: number }
export interface DayLog { date: string; xp: number; reviews: number; correct: number; newItems: number; minutes: number; games?: Record<string, number>; frozen?: boolean }
/** One-off things: claimed rewards, owned cosmetics, achievements. id = "<kind>:<key>" */
export interface Unlock { id: string; at: number }
export interface ExamResult {
  id?: number; kind: 'mock' | 'gate'; level: string; at: number; passed: boolean
  sections: { name: string; right: number; total: number }[]
  tags: Record<string, [number, number]>   // tag → [right, total]
}
export interface Score { id: string; best: number; at: number }   // id = "<game>:<mode>"
/** User-uploaded chibi art, id = "<charId>:<expression>". */
export interface Art { id: `${string}:${Expression}`; blob: Blob; at?: number }   // at = upload time

export const db = new Dexie('teyvat-nihongo') as Dexie & {
  profile: EntityTable<Profile, 'id'>
  items: EntityTable<SrsItem, 'id'>
  reviews: EntityTable<ReviewLog, 'id'>
  mistakes: EntityTable<Mistake, 'id'>
  owned: EntityTable<Owned, 'charId'>
  days: EntityTable<DayLog, 'date'>
  art: EntityTable<Art, 'id'>
  scores: EntityTable<Score, 'id'>
  unlocks: EntityTable<Unlock, 'id'>
  exams: EntityTable<ExamResult, 'id'>
}

db.version(1).stores({
  profile: 'id',
  items: 'id, kind, level, due',
  reviews: '++id, itemId, at',
  mistakes: '++id, itemId, at, fixed',
  owned: 'charId',
  days: 'date',
})
db.version(2).stores({ items: 'id, kind, stage, due', art: 'id' })
db.version(3).stores({ scores: 'id' })
db.version(4).stores({ unlocks: 'id' })
db.version(5).stores({ exams: '++id, kind, level, at' })

const STARTERS = ['paimon', 'klee', 'venti', 'amber', 'diluc']

/** First launch: create the profile and give the Mondstadt starters. */
db.on('populate', (tx) => {
  const now = Date.now()
  tx.table('profile').add({ id: 'me', companionId: 'paimon', createdAt: now, kirameki: 160, pity: 0, freezes: 1 })
  tx.table('owned').bulkAdd(STARTERS.map((charId) => ({ charId, friendship: 0, obtainedAt: now })))
})
