import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { Icon, type IconName } from '../ui/Icon'

interface Entry { to: string; name: string; desc: string; glyph?: string; icon?: IconName; extra?: string }

function Section({ title, items }: { title: string; items: Entry[] }) {
  return (
    <section className="space-y-2">
      <h2 className="g-heading text-xs tracking-[.2em] text-paper uppercase drop-shadow">{title}</h2>
      <div className="g-panel p-2">
        <ul className="grid sm:grid-cols-2">
          {items.map((m) => (
            <li key={m.to}>
              <Link to={m.to} className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-soft/70">
                <span className="g-chip h-12 w-12 shrink-0">
                  {m.glyph ? <span lang="ja" className="text-2xl font-bold">{m.glyph}</span> : <Icon name={m.icon!} className="h-6 w-6" />}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block font-display text-lg leading-tight">{m.name}</b>
                  <span className="block text-sm leading-snug opacity-70">{m.desc}</span>
                </span>
                {m.extra ? <span className="whitespace-pre-line text-right text-xs font-bold opacity-70">{m.extra}</span> : <Icon name="chevronRight" className="h-5 w-5 opacity-40" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function LearnHub() {
  const due = useLiveQuery(() => db.items.where('due').below(Date.now()).count(), []) ?? 0
  return (
    <div className="mx-auto max-w-3xl space-y-5 py-4">
      <Link to="/review" className="g-panel flex items-center gap-4 p-4">
        <span className="g-chip h-14 w-14"><Icon name="replay" className="h-7 w-7" /></span>
        <span className="flex-1">
          <b className="block font-display text-xl">Review SRS</b>
          <span className="text-sm opacity-75">{due ? `${due} kartu menunggu. Kerjakan dulu sebelum materi baru.` : 'Belum ada kartu jatuh tempo. Lanjut materi baru!'}</span>
        </span>
        {due > 0 && <span className="rounded-full bg-primary px-3 py-1 font-display font-black text-white">{due}</span>}
      </Link>
      <Section title="Materi inti" items={[
        { to: '/kana', glyph: 'あ', name: 'Kana', desc: 'Hiragana & katakana, mnemonic, latihan menulis' },
        { to: '/kanji', glyph: '漢', name: 'Kanji', desc: 'Urutan goresan, arti, bacaan ON/KUN' },
        { to: '/vocab', glyph: '語', name: 'Kosakata', desc: 'Kartu kata dengan suara' },
        { to: '/grammar', glyph: '文', name: 'Grammar', desc: 'Satu pola, contoh, 5 latihan' },
      ]} />
      <Section title="Keterampilan" items={[
        { to: '/reading', glyph: '読', name: 'Membaca', desc: 'Teks bertingkat, tap kata untuk arti' },
        { to: '/listening', glyph: '聴', name: 'Mendengar', desc: 'Dengar lalu pilih, dikte, 0.75×–1.25×' },
        { to: '/speaking', glyph: '話', name: 'Berbicara', desc: 'Shadowing, baca kanji, game suara' },
      ]} />
      <Section title="Buntu?" items={[
        { to: '/hexenzirkel', icon: 'sparkle', name: 'Hexenzirkel', desc: 'Pesta teh para penyihir: rencana, ramalan kartu rawan, dongeng pengingat' },
      ]} />
      <Section title="Perjalanan" items={[
        { to: '/map', icon: 'map', name: 'Peta Teyvat', desc: 'Region, tahap, dan Gate Exam' },
        { to: '/exam', icon: 'exam', name: 'JLPT Mock Test', desc: 'Simulasi ujian dengan timer per bagian' },
      ]} />
    </div>
  )
}

const GAMES: (Entry & { id: string; skill: string })[] = [
  { to: '/games/kana-rain', icon: 'rain', name: 'Kana Rain', desc: 'Ketik romaji sebelum kana jatuh', skill: 'Kana', id: 'kana-rain' },
  { to: '/games/memory-match', icon: 'cards', name: 'Memory Match', desc: 'Pasangkan kana dan romaji', skill: 'Kana', id: 'memory-match' },
  { to: '/games/stroke-duel', icon: 'brush', name: 'Stroke Duel', desc: 'Tulis kanji lebih cepat dari lawan', skill: 'Kanji', id: 'stroke-duel' },
  { to: '/games/radical-forge', icon: 'hammer', name: 'Radical Forge', desc: 'Tempa kanji dari komponennya', skill: 'Kanji', id: 'radical-forge' },
  { to: '/games/particle-shooter', icon: 'target', name: 'Particle Shooter', desc: 'Tembak partikel yang tepat', skill: 'Grammar', id: 'particle-shooter' },
  { to: '/games/sentence-builder', icon: 'blocks', name: 'Sentence Builder', desc: 'Susun blok jadi kalimat', skill: 'Grammar', id: 'sentence-builder' },
  { to: '/games/fill-blank-rush', icon: 'bolt', name: 'Fill-Blank Rush', desc: '60 detik isi bagian kosong', skill: 'Campuran', id: 'fill-blank-rush' },
  { to: '/games/listening-echo', icon: 'headphones', name: 'Listening Echo', desc: 'Dengar, pilih kalimatnya', skill: 'Mendengar', id: 'listening-echo' },
  { to: '/games/voice-fill', icon: 'mic', name: 'Voice Fill', desc: 'Ucapkan kata yang hilang', skill: 'Berbicara', id: 'voice-fill' },
  { to: '/games/speed-speak', icon: 'echo', name: 'Speed Speak', desc: 'Ucapkan kata secepat mungkin', skill: 'Berbicara', id: 'speed-speak' },
]

export function GamesHub() {
  const scores = useLiveQuery(() => db.scores.toArray(), []) ?? []
  const best = (id: string) => Math.max(0, ...scores.filter((s) => s.id.startsWith(`${id}:`)).map((s) => s.best))
  const skills = [...new Set(GAMES.map((g) => g.skill))]
  return (
    <div className="mx-auto max-w-3xl space-y-5 py-4">
      <Section title="Dunia Teyvat" items={[
        { to: '/fatui', icon: 'snowmask', name: 'Organisasi Fatui', desc: 'Duel para Harbinger dan kontrak Pantalone & Arlecchino' },
        { to: '/abyss', icon: 'abyss', name: 'Ancaman Abyss', desc: 'Lima Pendosa Khaenri\'ah memangsa kelalaian belajarmu' },
        { to: '/celestia', icon: 'halo', name: 'Celestia', desc: 'Tatanan Empat Bayangan: berkat bagi yang taat' },
        { to: '/snezhnaya', icon: 'cryo', name: 'Snezhnaya', desc: 'Negeri Tsaritsa di akhir perjalanan; Nod-Krai di gerbangnya' },
      ]} />
      <Section title="Event" items={[
        { to: '/daily', icon: 'scroll', name: 'Commission Harian', desc: '4 misi kecil setiap hari, hadiah Kirameki' },
        { to: '/boss', icon: 'mask', name: 'Weekly Boss', desc: 'Lawan Harbinger dengan materi minggu ini' },
        { to: '/domain', icon: 'spiral', name: 'Domain Run', desc: 'Naik lantai sejauh mungkin, pilih berkah' },
        { to: '/revenge', icon: 'swords', name: 'Revenge Quest', desc: 'Balas kesalahan lamamu' },
      ]} />
      {skills.map((skill) => (
        <Section key={skill} title={`Mini-game · ${skill}`} items={GAMES.filter((g) => g.skill === skill).map((g) => ({ ...g, extra: best(g.id) ? `rekor\n${best(g.id)}` : undefined }))} />
      ))}
      <p className="text-center text-sm text-paper drop-shadow">Setiap game punya mode <b>Daily</b> (materimu + review SRS) dan <b>Endless</b> (main sepuasnya).</p>
    </div>
  )
}
