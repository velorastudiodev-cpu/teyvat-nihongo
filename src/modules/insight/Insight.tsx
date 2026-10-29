import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { State } from 'ts-fsrs'
import { db } from '../../data/db'
import { kanaById } from '../../data/kana'
import { kanjiById, wordById } from '../../data/kanji'
import { patternById } from '../../data/grammar'
import { addDays, DAY } from '../../engine/game/rules'
import { today } from '../../engine/srs/srs'
import { card } from '../../ui/kit'
import { PaceCard } from '../../ui/PaceCard'

const KINDS = [['kana', 'Kana'], ['kanji', 'Kanji'], ['vocab', 'Kosakata'], ['grammar', 'Grammar']] as const
const label = (id: string) => kanaById.get(id)?.char ?? kanjiById.get(id)?.char ?? wordById.get(id)?.word ?? patternById.get(id)?.title ?? id
const meaning = (id: string) => kanaById.get(id)?.romaji ?? kanjiById.get(id)?.meaning ?? wordById.get(id)?.meaning ?? patternById.get(id)?.explain.split('.')[0] ?? ''

export function Insight() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const data = useLiveQuery(async () => {
    const since = Date.now() - 30 * DAY
    const [items, reviews, days, mistakes, exams, mocks] = await Promise.all([
      db.items.toArray(), db.reviews.where('at').above(since).toArray(), db.days.toArray(),
      db.mistakes.toArray(), db.exams.orderBy('at').reverse().limit(5).toArray(), db.scores.where('id').startsWith('mock:').toArray(),
    ])
    return { items, reviews, days, mistakes, exams, mocks }
  }, [])
  if (!data || !profile) return null
  const { items, reviews, days, mistakes, exams, mocks } = data

  const acc = KINDS.map(([k, name]) => {
    const rs = reviews.filter((r) => r.itemId.startsWith(`${k}:`))
    return { name, n: rs.length, pct: rs.length ? Math.round((rs.filter((r) => r.rating > 1).length / rs.length) * 100) : undefined }
  })
  const allAcc = reviews.length ? Math.round((reviews.filter((r) => r.rating > 1).length / reviews.length) * 100) : undefined
  const date = today()
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(date, i - 13)).map((d) => ({ d, n: days.find((x) => x.date === d)?.reviews ?? 0 }))
  const maxDay = Math.max(1, ...last14.map((x) => x.n))
  const missCount = new Map<string, number>()
  for (const m of mistakes) missCount.set(m.itemId, (missCount.get(m.itemId) ?? 0) + 1)
  const forgotten = items.map((i) => ({ id: i.id, kind: i.kind, score: i.card.lapses * 2 + (missCount.get(i.id) ?? 0) }))
    .filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 10)
  const states = { baru: items.filter((i) => i.card.state === State.Learning || i.card.state === State.New).length, review: items.filter((i) => i.card.state === State.Review).length, ulang: items.filter((i) => i.card.state === State.Relearning).length }
  const due = items.filter((i) => i.due <= Date.now()).length

  return (
    <main className="space-y-5 py-4">
      <h1 className="font-display text-3xl font-extrabold">Insight</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="item dipelajari" value={items.length} />
        <Tile label="akurasi 30 hari" value={allAcc === undefined ? '—' : `${allAcc}%`} />
        <Tile label="jatuh tempo sekarang" value={due} />
        <Tile label="kartu matang (review)" value={states.review} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className={card}>
          <h2 className="font-display text-xl font-extrabold">Akurasi per skill</h2>
          <p className="text-xs opacity-60">Review 30 hari terakhir; jawaban benar = bukan "Again"</p>
          <div className="mt-3 space-y-3">
            {acc.map((a) => (
              <div key={a.name} className="group" title={`${a.name}: ${a.pct ?? '—'}% dari ${a.n} review`}>
                <div className="flex justify-between text-sm"><span className="font-bold">{a.name}</span><span>{a.pct === undefined ? 'belum ada review' : `${a.pct}% · ${a.n} review`}</span></div>
                <div className="mt-1 h-3 rounded bg-paper-deep">
                  <div className="h-full rounded-r bg-anemo transition-[filter] group-hover:brightness-110" style={{ width: `${a.pct ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-xl font-extrabold">Review per hari</h2>
          <p className="text-xs opacity-60">14 hari terakhir · maks. {maxDay}</p>
          <div className="mt-3 flex h-36 items-end gap-[2px] border-b border-ink/20">
            {last14.map((x) => (
              <div key={x.d} className="group relative flex h-full flex-1 items-end">
                <div className={`w-full rounded-t ${x.d === date ? 'bg-torii' : 'bg-anemo'}`} style={{ height: `${(x.n / maxDay) * 100}%`, minHeight: x.n ? 3 : 0 }} />
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-0.5 text-xs text-paper group-hover:block">{x.d.slice(5)}: {x.n}</span>
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs opacity-60"><span>{last14[0].d.slice(5)}</span><span>hari ini</span></div>
          <details className="mt-2 text-sm"><summary className="cursor-pointer opacity-70">Lihat tabel</summary>
            <table className="mt-1 w-full text-left"><tbody>{last14.map((x) => <tr key={x.d}><td>{x.d}</td><td className="text-right">{x.n}</td></tr>)}</tbody></table>
          </details>
        </section>

        <section className={card}>
          <h2 className="font-display text-xl font-extrabold">Paling sering dilupakan</h2>
          {forgotten.length ? (
            <ol className="mt-2 space-y-1">
              {forgotten.map((f, n) => (
                <li key={f.id} className="flex items-center justify-between gap-2">
                  <span><b className="mr-2 opacity-50">{n + 1}</b><span lang="ja" className="text-lg font-bold">{label(f.id)}</span> <span className="text-sm opacity-70">{meaning(f.id)}</span></span>
                  {f.kind === 'kanji' || f.kind === 'kana' ? <Link to={`/write/${label(f.id)}`} className="text-sm underline">tulis</Link> : null}
                </li>
              ))}
            </ol>
          ) : <p className="mt-2 text-sm opacity-70">Belum ada. Kesalahan dan "lupa" di SRS akan muncul di sini.</p>}
          <Link to="/revenge" className="mt-2 inline-block text-sm font-bold underline">⚔️ Revenge Quest →</Link>
        </section>

        <section className={`${card} space-y-3`}>
          <h2 className="font-display text-xl font-extrabold">Proyeksi target</h2>
          <PaceCard profile={profile} />
          <p className="text-sm">Mock test terbaik: {mocks.length ? mocks.map((m) => `${m.id.slice(5)} ${m.best}%`).join(' · ') : 'belum pernah'} · <Link to="/exam" className="font-bold underline">coba mock test</Link></p>
          {exams.length > 0 && <p className="text-sm opacity-70">Ujian terakhir: {exams.map((e) => `${e.kind === 'gate' ? 'Gate' : 'Mock'} ${e.level} ${e.passed ? '✅' : '❌'}`).join(' · ')}</p>}
        </section>
      </div>
    </main>
  )
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={`${card} text-center`}>
      <p className="font-display text-3xl font-extrabold">{value}</p>
      <p className="text-sm opacity-70">{label}</p>
    </div>
  )
}
