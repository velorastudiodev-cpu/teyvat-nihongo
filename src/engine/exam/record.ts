import { db } from '../../data/db'
import { grade, type ExamSpec, type Question } from './exam'

export type Answers = Record<string, string>

/** Save the attempt and push wrong items into the Mistake Journal. */
export async function recordExam(spec: ExamSpec, answers: Answers) {
  const g = grade(spec, answers)
  await db.exams.add({ kind: spec.kind, level: spec.level, at: Date.now(), passed: g.passed, sections: g.sections, tags: g.tags })
  const wrong: Question[] = spec.sections.flatMap((s) => s.questions.filter((q, i) => answers[`${s.id}:${i}`] !== q.answer))
  await db.mistakes.bulkAdd(wrong.filter((q) => q.itemId).map((q) => ({ itemId: q.itemId!, answer: '', expected: q.answer, at: Date.now(), fixed: false })))
  if (spec.kind === 'mock') {
    const pct = Math.round(g.ratio * 100), id = `mock:${spec.level}`
    if (pct > ((await db.scores.get(id))?.best ?? -1)) await db.scores.put({ id, best: pct, at: Date.now() })
  }
  return g
}
