import { db } from '../../data/db'
import { HIRAGANA, KATAKANA, isBasic, kanaId, type Kana, type Script } from '../../data/kana'
import { sample } from '../../ui/kit'
import { STAGES, STAGE_INFO, stageIndex } from '../../data/curriculum'

export const LESSON_SIZE = 5
export const scriptKana = (s: Script) => (s === 'hiragana' ? HIRAGANA : KATAKANA)

/** Next unlearned kana of a script, in teaching order, never mixing two groups in one lesson. */
export async function nextLesson(script: Script): Promise<Kana[]> {
  const all = scriptKana(script)
  const known = new Set(await db.items.where('kind').equals('kana').primaryKeys())
  const todo = all.filter((k) => !known.has(kanaId(k)))
  return todo.filter((k) => k.group === todo[0]?.group).slice(0, LESSON_SIZE)
}

/** Finishing a kana stage moves the user on, but only inside the same region (region changes need a Gate Exam). */
export async function advanceIfComplete() {
  const p = await db.profile.get('me')
  if (!p?.stage || (p.stage !== 'hiragana' && p.stage !== 'katakana')) return
  if ((await nextLesson(p.stage)).length) return
  const next = STAGES[stageIndex(p.stage) + 1]
  if (STAGE_INFO[next].regions[0] === STAGE_INFO[p.stage].regions[0]) await db.profile.update('me', { stage: next })
}

/** Wrong options from the same script and tier (basic vs dakuten/yōon), so the answer can't be guessed by shape. */
export const distractors = (k: Kana, n = 3) =>
  sample(scriptKana(k.script).filter((x) => x.romaji !== k.romaji && isBasic(x) === isBasic(k)), n)
