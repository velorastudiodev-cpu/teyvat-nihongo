import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { KANJI, LEVELS, VOCAB, type Level } from '../../data/kanji'
import { isMastered } from '../../engine/srs/srs'
import { btn, card } from '../../ui/kit'
import { levelOpen } from './content'

/** Shared hub for kanji and vocabulary: lessons, writing practice, games, SRS state per item. */
export function KanjiHub({ kind }: { kind: 'kanji' | 'vocab' }) {
  const [level, setLevel] = useState<Level>('N5')
  const profile = useLiveQuery(() => db.profile.get('me'))
  const items = useLiveQuery(() => db.items.where('kind').equals(kind).toArray(), [kind]) ?? []
  const byId = new Map(items.map((i) => [i.id, i]))
  const open = levelOpen(level, profile?.stage)
  const list = kind === 'kanji'
    ? KANJI.filter((k) => k.level === level).map((k) => ({ id: `kanji:${k.char}`, big: k.char, small: k.meaning }))
    : VOCAB.filter((w) => w.level === level).map((w) => ({ id: `vocab:${w.word}`, big: w.word, small: w.reading }))
  const learned = list.filter((x) => byId.has(x.id)).length

  return (
    <main className="space-y-5 py-4">
      <h1 className="font-display text-3xl font-extrabold">{kind === 'kanji' ? 'Kanji' : 'Kosakata'}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {LEVELS.map((l) => (
          <button key={l} onClick={() => setLevel(l)} className={`${btn} ${l === level ? 'bg-ink text-paper' : 'bg-paper'}`}>
            {levelOpen(l, profile?.stage) ? '' : '🔒 '}{l}
          </button>
        ))}
        <span className="ml-auto text-sm"><b>{learned}</b> / {list.length} dipelajari</span>
      </div>

      {open ? (
        <div className="flex flex-wrap gap-2">
          <Link to={`/${kind}/learn/${level}`} className={`${btn} bg-torii text-white`}>Pelajaran baru →</Link>
          <Link to="/review" className={`${btn} bg-geo`}>Review</Link>
          {kind === 'kanji' && <>
            <Link to="/games/stroke-duel" className={`${btn} bg-anemo text-white`}>✍️ Stroke Duel</Link>
            <Link to="/games/radical-forge" className={`${btn} bg-paper`}>⚒️ Radical Forge</Link>
          </>}
        </div>
      ) : (
        <p className={`${card} text-sm`}>
          🔒 {level} terbuka setelah kamu sampai di tahap {level}
          {level === 'N5' ? ' (selesaikan hiragana & katakana dulu).' : ' (lulus Gate Exam region sebelumnya).'}
        </p>
      )}

      <section className={`${card} grid gap-1.5 ${kind === 'kanji' ? 'grid-cols-5 sm:grid-cols-10' : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6'}`}>
        {list.map((x) => {
          const it = byId.get(x.id)
          const tone = !it ? 'bg-paper text-ink/60' : isMastered(it) ? 'bg-anemo text-white' : 'bg-geo'
          const inner = <>
            <span lang="ja" className={`block font-bold ${kind === 'kanji' ? 'text-2xl' : 'text-lg'}`}>{x.big}</span>
            <span lang={kind === 'vocab' ? 'ja' : undefined} className="block truncate text-[10px]">{x.small}</span>
          </>
          return kind === 'kanji'
            ? <Link key={x.id} to={`/write/${x.big}`} title="Latihan menulis" className={`rounded-xl px-1 py-1.5 text-center transition-transform hover:-translate-y-0.5 ${tone}`}>{inner}</Link>
            : <div key={x.id} className={`rounded-xl px-1 py-1.5 text-center ${tone}`}>{inner}</div>
        })}
      </section>
    </main>
  )
}
