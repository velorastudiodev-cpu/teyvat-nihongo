import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/db'
import { kanaId } from '../../data/kana'
import { learn } from '../../engine/srs/srs'
import { advanceIfComplete, LESSON_SIZE, nextLesson } from './progress'

async function learnAll(script: 'hiragana' | 'katakana') {
  let lessons = 0
  for (let ks = await nextLesson(script); ks.length; ks = await nextLesson(script)) {
    expect(ks.length).toBeLessThanOrEqual(LESSON_SIZE)
    expect(new Set(ks.map((k) => k.group)).size).toBe(1)
    await learn(ks.map((k) => ({ id: kanaId(k), kind: 'kana' as const, stage: script })))
    await advanceIfComplete()
    lessons++
  }
  return lessons
}

describe('kana lessons', () => {
  beforeEach(async () => {
    await db.delete(); await db.open()
    await db.profile.update('me', { stage: 'hiragana', target: 'N1' })
  })

  it('every kana is reachable through lessons, and finishing hiragana unlocks katakana but not N4', async () => {
    expect(await learnAll('hiragana')).toBeGreaterThan(20)
    expect((await db.profile.get('me'))?.stage).toBe('katakana')
    await learnAll('katakana')
    expect(await db.items.count()).toBe(208)
    expect((await db.profile.get('me'))?.stage).toBe('N5')
  })
})
