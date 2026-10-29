import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { kanaId, type Script } from '../../data/kana'
import { isMastered, today } from '../../engine/srs/srs'
import { usePacePlan } from '../../ui/usePacePlan'
import { speak } from '../../ui/speak'
import { btn, card } from '../../ui/kit'
import { scriptKana } from './progress'

export function KanaHub() {
  const [script, setScript] = useState<Script>('hiragana')
  const navigate = useNavigate()
  const profile = useLiveQuery(() => db.profile.get('me'))
  const items = useLiveQuery(() => db.items.where('kind').equals('kana').toArray(), []) ?? []
  const due = useLiveQuery(() => db.items.where('due').belowOrEqual(Date.now()).count(), []) ?? 0
  const day = useLiveQuery(() => db.days.get(today()), [])
  const plan = usePacePlan(profile)
  const byId = new Map(items.map((i) => [i.id, i]))
  const kana = scriptKana(script)
  const learned = kana.filter((k) => byId.has(kanaId(k))).length

  return (
    <main className="space-y-5 py-4">
      <h1 className="font-display text-3xl font-extrabold">Hiragana & Katakana</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={card}>
          <p className="font-display font-bold">Pelajaran baru</p>
          <p className="text-sm opacity-70">Hari ini {day?.newItems ?? 0}{plan ? ` / ${plan.newPerDay}` : ''} item baru</p>
          <Link to={`/kana/learn/${script}`} className={`${btn} mt-3 inline-block bg-torii text-white`}>Belajar {script} →</Link>
        </div>
        <div className={card}>
          <p className="font-display font-bold">Review SRS</p>
          <p className="text-sm opacity-70">{due} kartu jatuh tempo</p>
          <Link to="/review" className={`${btn} mt-3 inline-block ${due ? 'bg-geo' : 'bg-paper'}`}>Mulai review →</Link>
        </div>
        <div className={card}>
          <p className="font-display font-bold">Main game</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/games/kana-rain" className={`${btn} bg-anemo text-white`}>Kana Rain</Link>
            <Link to="/games/memory-match" className={`${btn} bg-paper`}>Memory</Link>
            <Link to="/write/あ" className={`${btn} bg-paper`}>✍️ Tulis</Link>
          </div>
        </div>
      </div>

      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {(['hiragana', 'katakana'] as const).map((s) => (
              <button key={s} onClick={() => setScript(s)} className={`${btn} ${s === script ? 'bg-ink text-paper' : 'bg-paper'}`}>{s}</button>
            ))}
          </div>
          <p className="text-sm"><b>{learned}</b> / {kana.length} dipelajari · <span className="text-anemo">■</span> kuat <span className="text-geo">■</span> belajar</p>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
          {kana.map((k) => {
            const it = byId.get(kanaId(k))
            const tone = !it ? 'bg-paper text-ink/50' : isMastered(it) ? 'bg-anemo text-white' : 'bg-geo text-ink'
            return (
              <button key={k.char} onClick={() => speak(k.char)} onDoubleClick={() => navigate(`/write/${k.char}`)} title={`${k.mnemonic ?? ''} (klik ganda: latihan menulis)`}
                className={`cursor-pointer rounded-xl py-1.5 text-center transition-transform hover:-translate-y-0.5 ${tone}`}>
                <span lang="ja" className="block text-2xl font-bold">{k.char}</span>
                <span className="text-xs">{k.romaji}</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
