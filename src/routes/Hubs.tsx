import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { card } from '../ui/kit'

const MODULES = [
  { to: '/kana', icon: 'あ', name: 'Kana', desc: 'Hiragana & katakana, mnemonic, latihan menulis' },
  { to: '/kanji', icon: '漢', name: 'Kanji', desc: 'Urutan goresan, arti, bacaan ON/KUN' },
  { to: '/vocab', icon: '語', name: 'Kosakata', desc: 'Kartu swipe, dengar lalu pilih' },
  { to: '/grammar', icon: '文', name: 'Grammar', desc: 'Kartu konsep + 5 latihan menyusun kalimat' },
  { to: '/reading', icon: '読', name: 'Reading', desc: 'Teks bertingkat, furigana, tap untuk arti' },
  { to: '/listening', icon: '聴', name: 'Listening', desc: 'Dengar lalu pilih, dikte, 0.75×–1.25×' },
  { to: '/speaking', icon: '話', name: 'Speaking', desc: 'Voice Fill, Speed Speak, Shadowing, baca kanji' },
]

const GAMES = [
  { to: '/games/kana-rain', name: '☔ Kana Rain', skill: 'Kana', id: 'kana-rain' },
  { to: '/games/memory-match', name: '🃏 Memory Match', skill: 'Kana', id: 'memory-match' },
  { to: '/games/stroke-duel', name: '✍️ Stroke Duel', skill: 'Kanji', id: 'stroke-duel' },
  { to: '/games/radical-forge', name: '⚒️ Radical Forge', skill: 'Kanji', id: 'radical-forge' },
  { to: '/games/particle-shooter', name: '🎯 Particle Shooter', skill: 'Grammar', id: 'particle-shooter' },
  { to: '/games/sentence-builder', name: '🧱 Sentence Builder', skill: 'Grammar', id: 'sentence-builder' },
  { to: '/games/fill-blank-rush', name: '⚡ Fill-Blank Rush', skill: 'Semua', id: 'fill-blank-rush' },
  { to: '/games/listening-echo', name: '🎧 Listening Echo', skill: 'Listening', id: 'listening-echo' },
  { to: '/games/voice-fill', name: '🎤 Voice Fill', skill: 'Speaking', id: 'voice-fill' },
  { to: '/games/speed-speak', name: '⚡ Speed Speak', skill: 'Speaking', id: 'speed-speak' },
]

export function LearnHub() {
  return (
    <main className="space-y-4 py-4">
      <h1 className="font-display text-3xl font-extrabold">Belajar</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to} className={`${card} flex items-center gap-4 transition-transform hover:-translate-y-1`}>
            <span lang="ja" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-torii text-3xl font-bold text-white">{m.icon}</span>
            <span><b className="font-display text-xl">{m.name}</b><br /><span className="text-sm opacity-70">{m.desc}</span></span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export function GamesHub() {
  const scores = useLiveQuery(() => db.scores.toArray(), []) ?? []
  const best = (id: string) => Math.max(0, ...scores.filter((s) => s.id.startsWith(`${id}:`)).map((s) => s.best))
  return (
    <main className="space-y-4 py-4">
      <h1 className="font-display text-3xl font-extrabold">Mini-games</h1>
      <p className="opacity-80">Setiap game punya mode <b>Daily</b> (materi yang sedang dipelajari + review SRS) dan <b>Endless</b> (main sepuasnya, ada high score).</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {GAMES.map((g) => (
          <Link key={g.to} to={g.to} className={`${card} flex items-center justify-between transition-transform hover:-translate-y-1`}>
            <span><b className="font-display text-xl">{g.name}</b><br /><span className="text-sm opacity-70">{g.skill}</span></span>
            <span className="text-right text-sm"><span className="opacity-60">rekor</span><br /><b className="font-display text-2xl">{best(g.id)}</b></span>
          </Link>
        ))}
      </div>
    </main>
  )
}
