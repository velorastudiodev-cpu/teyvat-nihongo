import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { db } from '../../data/db'
import { READINGS } from '../../data/readings'
import { KANJI, VOCAB, kanjiIn } from '../../data/kanji'
import { parse, textOf, type Token } from '../../engine/sentence'
import { bumpDay } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { Choice } from '../../ui/Choice'
import { btn, card } from '../../ui/kit'
import { FuriganaToggle, Sentence, useFurigana, useMasteredKanji } from '../../ui/Sentence'
import { sfx } from '../../ui/sfx'
import { speak } from '../../ui/speak'
import { levelOpen } from '../kanji/content'

export function ReadingHub() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const scores = useLiveQuery(() => db.scores.where('id').startsWith('reading:').toArray(), []) ?? []
  return (
    <main className="space-y-4 py-4">
      <h1 className="font-display text-3xl font-extrabold">Reading</h1>
      <p className="opacity-80">Teks pendek bertingkat. Tap kata untuk melihat arti, atur furigana, lalu jawab kuis di akhir.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {READINGS.map((r) => {
          const open = levelOpen(r.level, profile?.stage)
          const best = scores.find((s) => s.id === `reading:${r.id}`)?.best
          const body = <>
            <p className="text-xs font-bold text-anemo">{r.level}{best !== undefined && ` · kuis terbaik ${best}/${r.quiz.length}`}</p>
            <p className="text-2xl" lang="ja"><Sentence tokens={parse(r.title)} className="inline" /></p>
            <p className="text-sm opacity-70">{open ? r.titleId : `🔒 terbuka di tahap ${r.level}`}</p>
          </>
          return open
            ? <Link key={r.id} to={`/reading/${r.id}`} className={`${card} transition-transform hover:-translate-y-0.5`}>{body}</Link>
            : <div key={r.id} className={`${card} opacity-50`}>{body}</div>
        })}
      </div>
    </main>
  )
}

function lookup(t: Token, gloss: Record<string, string>) {
  if (gloss[t.text]) return gloss[t.text]
  const w = VOCAB.find((v) => v.word === t.text || v.reading === t.text)
  if (w) return w.meaning
  const ks = kanjiIn(t.text).map((c) => KANJI.find((k) => k.char === c)?.meaning).filter(Boolean)
  return ks.length ? ks.join(' + ') : undefined
}

export function ReadingText() {
  const r = READINGS.find((x) => x.id === useParams().id)
  const [mode, setMode] = useFurigana()
  const known = useMasteredKanji()
  const [tapped, setTapped] = useState<{ t: Token; meaning?: string }>()
  const [quiz, setQuiz] = useState<number>()
  const [right, setRight] = useState(0)
  if (!r) return <p className="p-8">Teks tidak ditemukan.</p>
  const lines = r.text.split('/').map(parse)

  if (quiz !== undefined && quiz < r.quiz.length) {
    const q = r.quiz[quiz]
    return <Choice key={quiz} title={`Kuis · ${quiz + 1}/${r.quiz.length}`} ask={q.q} prompt={<p className="text-sm opacity-60">{r.titleId}</p>}
      answer={q.a} wrong={q.wrong} onAnswer={async (ok) => {
        const score = right + (ok ? 1 : 0)
        setRight(score)
        if (quiz + 1 === r.quiz.length) {
          const prev = (await db.scores.get(`reading:${r.id}`))?.best ?? -1
          if (score > prev) await db.scores.put({ id: `reading:${r.id}`, best: score, at: Date.now() })
          await bumpDay({ xp: 10 + score * 5 })
          if (score === r.quiz.length) sfx.win()
        }
        setQuiz(quiz + 1)
      }} />
  }
  if (quiz !== undefined) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood={right === r.quiz.length ? 'happy' : 'sad'} size={120} /></div>
      <p className="font-display text-3xl font-extrabold">{right} / {r.quiz.length} benar · +{10 + right * 5} XP</p>
      <div className="flex justify-center gap-2">
        <button className={`${btn} bg-paper`} onClick={() => { setQuiz(undefined); setRight(0) }}>Baca lagi</button>
        <Link to="/reading" className={`${btn} bg-torii text-white`}>Teks lain</Link>
      </div>
    </main>
  )

  return (
    <main className="mx-auto mt-4 max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-anemo">{r.level} · {r.titleId}</p>
          <h1 className="font-display text-3xl font-extrabold"><Sentence tokens={parse(r.title)} mode={mode} known={known} /></h1>
        </div>
        <div className="flex gap-2">
          <FuriganaToggle mode={mode} setMode={setMode} />
          <button onClick={() => speak(lines.map(textOf).join(''))} className="cursor-pointer rounded-full bg-paper-deep px-3 py-1 text-sm font-bold">🔊 Semua</button>
        </div>
      </div>
      <article className={`${card} space-y-1`}>
        {lines.map((ts, i) => (
          <div key={i} className="flex items-start gap-2">
            <button onClick={() => speak(textOf(ts))} className="mt-3 cursor-pointer text-sm opacity-50 hover:opacity-100" aria-label="dengar baris ini">🔊</button>
            <Sentence tokens={ts} mode={mode} known={known} className="text-2xl" onTap={(t) => { setTapped({ t, meaning: lookup(t, r.gloss) }); speak(t.text) }} />
          </div>
        ))}
      </article>
      <AnimatePresence>
        {tapped && (
          <motion.div key={tapped.t.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="sticky bottom-3 rounded-2xl border-[3px] border-ink bg-geo/90 p-3 shadow-[3px_3px_0_var(--color-ink)]">
            <span lang="ja" className="text-2xl font-bold">{tapped.t.text}</span>
            {tapped.t.kana !== tapped.t.text && <span lang="ja" className="ml-2">（{tapped.t.kana}）</span>}
            <span className="ml-2">{tapped.meaning ?? '—'}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <button className={`${btn} w-full bg-torii text-white`} onClick={() => { setQuiz(0); setRight(0) }}>Kuis pemahaman →</button>
    </main>
  )
}
