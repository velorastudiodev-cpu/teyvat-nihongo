import { STAGES, stageIndex, stageItems, type Stage, type Target } from '../../data/curriculum'

/** Minutes one new item costs over its life: first lesson + the reviews it spawns. */
export const MIN_PER_NEW_ITEM = 1.6
const MAX_PUSH = 1.25          // when behind, ask for at most 25% more than the daily minutes allow
const DAY = 86_400_000

export interface PaceInput {
  stage: Stage                 // current stage (from placement / gate exams)
  target: Target
  minutesPerDay: number
  learned: number              // items already introduced from `stage` up to `target`
  targetDate?: string          // YYYY-MM-DD
  recent?: { newItems: number; reviews: number; correct: number }[]   // last days, oldest first
  today?: Date
}

export interface PacePlan {
  remaining: number
  newPerDay: number
  status: 'free' | 'on-track' | 'behind' | 'brake'
  accuracy?: number
  finish: Date                 // projection with today's plan
  finishActual?: Date          // projection from real pace of the last days
  requiredPerDay?: number      // what the target date needs
}

/** Stages still to learn, from the current one through the target (inclusive). */
export const stagesToTarget = (stage: Stage, target: Target) =>
  STAGES.slice(stageIndex(stage), stageIndex(target) + 1)

export function plan(i: PaceInput): PacePlan {
  const today = i.today ?? new Date()
  const remaining = Math.max(0, stagesToTarget(i.stage, i.target).reduce((n, s) => n + stageItems(s), 0) - i.learned)
  const capacity = Math.max(1, Math.round(i.minutesPerDay / MIN_PER_NEW_ITEM))

  let newPerDay = capacity
  let status: PacePlan['status'] = 'free'
  let requiredPerDay: number | undefined
  if (i.targetDate) {
    const daysLeft = Math.max(1, Math.ceil((Date.parse(i.targetDate) - today.getTime()) / DAY))
    requiredPerDay = Math.ceil(remaining / daysLeft)
    status = requiredPerDay > capacity ? 'behind' : 'on-track'
    newPerDay = Math.min(Math.max(requiredPerDay, 1), Math.round(capacity * MAX_PUSH))
  }

  // Moving fast but forgetting: brake new material until accuracy recovers.
  const recent = i.recent ?? []
  const reviews = recent.reduce((n, d) => n + d.reviews, 0)
  const accuracy = reviews >= 20 ? recent.reduce((n, d) => n + d.correct, 0) / reviews : undefined
  if (accuracy !== undefined && accuracy < 0.8) {
    newPerDay = Math.max(1, Math.round(newPerDay * (accuracy < 0.7 ? 0.5 : 0.7)))
    status = 'brake'
  }

  const days = (perDay: number) => new Date(today.getTime() + Math.ceil(remaining / perDay) * DAY)
  const actual = recent.length >= 3 ? recent.reduce((n, d) => n + d.newItems, 0) / recent.length : 0
  return {
    remaining, newPerDay, status, accuracy, requiredPerDay,
    finish: days(newPerDay),
    finishActual: actual > 0 ? days(actual) : undefined,
  }
}
