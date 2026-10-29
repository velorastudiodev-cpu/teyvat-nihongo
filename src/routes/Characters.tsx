import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Chibi } from '../characters/Chibi'
import { DESIGNS } from '../characters/designs'
import { characters, ELEMENT_COLOR, EXPRESSIONS, getCharacter, REGIONS } from '../characters'
import { db, type Art } from '../data/db'
import { CULTURE_NOTES } from '../data/cosmetics'
import { FRIEND_LEVELS, friendLevel } from '../engine/game/rules'
import { speak } from '../ui/speak'

const EXPR_LABEL = { idle: 'Santai', happy: 'Senang', sad: 'Menyemangati', sleep: 'Tidur' }

export function Characters() {
  const { id } = useParams()
  const profile = useLiveQuery(() => db.profile.get('me'))
  const selected = id ? getCharacter(id) : undefined
  const uploaded = useLiveQuery(() => db.art.toCollection().primaryKeys(), []) ?? []
  const ownedRows = useLiveQuery(() => db.owned.toArray(), []) ?? []
  const mine = ownedRows.find((o) => o.charId === selected?.id)

  return (
    <main className="space-y-8 py-4">
      {selected && (
        <motion.section key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_var(--color-ink)]">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-display text-3xl font-extrabold">{selected.name}</h2>
            <span className="text-xl">{selected.nameJa}</span>
            <span className="rounded-full px-3 py-0.5 text-sm font-bold text-white" style={{ background: ELEMENT_COLOR[selected.element] }}>
              {selected.element}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EXPRESSIONS.map((e) => (
              <figure key={e} className="flex flex-col items-center rounded-2xl bg-paper p-2">
                <Chibi id={selected.id} expression={e} size={140} />
                <figcaption className="font-display text-sm font-bold">{EXPR_LABEL[e]}</figcaption>
                <ArtSlot id={`${selected.id}:${e}`} uploaded={uploaded.includes(`${selected.id}:${e}`)} />
              </figure>
            ))}
          </div>
          <p className="mt-2 text-sm opacity-70">
            Upload PNG/SVG/GIF/WebP milikmu (maks. 5 MB). Gambar <b>Santai</b> otomatis dipakai untuk ekspresi lain yang belum di-upload.
          </p>
          <p className="mt-4"><b>Buff:</b> {selected.buff.desc}</p>
          {mine ? <Friendship charIndex={characters.indexOf(selected)} points={mine.friendship} lines={selected.lines} isCompanion={profile?.companionId === selected.id} />
            : <p className="mt-3 rounded-2xl bg-paper p-3 font-bold">🔒 Belum dimiliki. Dapatkan dari <Link to="/gacha" className="underline">Gacha</Link> (Kirameki dari commission).</p>}
          {mine && (DESIGNS[selected.id] || uploaded.includes(`${selected.id}:idle`)) && profile?.companionId !== selected.id && (
            <button onClick={() => db.profile.update('me', { companionId: selected.id })}
              className="mt-4 cursor-pointer rounded-full border-[3px] border-ink bg-anemo px-5 py-1.5 font-display font-bold text-white shadow-[3px_3px_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none">
              Jadikan companion
            </button>
          )}
        </motion.section>
      )}

      {REGIONS.map((r) => (
        <section key={r.id}>
          <h3 className="mb-2 font-display text-xl font-extrabold">{r.name} <span className="text-sm font-bold opacity-60">{r.level}</span></h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {characters.filter((c) => c.region === r.id).map((c) => {
              const own = ownedRows.find((o) => o.charId === c.id)
              return (
                <Link key={c.id} to={`/characters/${c.id}`}
                  className={`flex flex-col items-center rounded-2xl border-[3px] p-1 transition-transform hover:-translate-y-1 ${c.id === id ? 'border-torii bg-white' : 'border-transparent bg-paper-deep'}`}>
                  <span className={own ? '' : 'opacity-40 grayscale'}><Chibi id={c.id} size={96} /></span>
                  <span className="font-display text-sm font-bold">{own ? '' : '🔒 '}{c.name}</span>
                  {own && <span className="text-[10px] font-bold text-torii">♥ Lv {friendLevel(own.friendship)}</span>}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}

const MAX_BYTES = 5 * 1024 * 1024

function ArtSlot({ id, uploaded }: { id: Art['id']; uploaded: boolean }) {
  const pick = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('File harus berupa gambar.')
    if (file.size > MAX_BYTES) return alert('Gambar maksimal 5 MB.')
    db.art.put({ id, blob: file })
  }
  return (
    <div className="mt-1 flex gap-1 text-xs font-bold">
      <label className="cursor-pointer rounded-full bg-white px-2.5 py-0.5 ring-2 ring-ink hover:bg-paper-deep">
        {uploaded ? 'Ganti' : 'Upload'}
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
      </label>
      {uploaded && (
        <button onClick={() => db.art.delete(id)} className="cursor-pointer rounded-full px-2.5 py-0.5 text-torii ring-2 ring-torii hover:bg-torii hover:text-white">
          Reset
        </button>
      )}
    </div>
  )
}

/** Friendship unlocks: voice line 1 at Lv1, line 2 at Lv3, culture notes at Lv5 and Lv7. */
function Friendship({ charIndex, points, lines, isCompanion }: { charIndex: number; points: number; lines: { ja: string; tr: string }[]; isCompanion: boolean }) {
  const lv = friendLevel(points)
  const next = FRIEND_LEVELS[lv]
  const notes = [CULTURE_NOTES[(charIndex * 2) % CULTURE_NOTES.length], CULTURE_NOTES[(charIndex * 2 + 1) % CULTURE_NOTES.length]]
  const unlocks = [
    ...lines.map((l, i) => ({ at: i === 0 ? 1 : 3, node: <button onClick={() => speak(l.ja)} className="cursor-pointer text-left hover:text-torii">🔊 <span lang="ja">{l.ja}</span> <span className="opacity-60">— {l.tr}</span></button> })),
    ...notes.map((n, i) => ({ at: i === 0 ? 5 : 7, node: <span>📜 <b>Culture Note:</b> {n}</span> })),
  ]
  return (
    <div className="mt-3 space-y-2">
      <p className="font-display font-bold">♥ Friendship Lv {lv}{next ? <span className="font-sans text-sm font-normal opacity-70"> · {points}/{next} (naik saat belajar dengan karakter ini sebagai companion{isCompanion ? ' ✓' : ''})</span> : ' · MAX'}</p>
      <ul className="space-y-1">
        {unlocks.map((u, i) => <li key={i} className={lv >= u.at ? '' : 'opacity-50'}>{lv >= u.at ? u.node : `🔒 Terbuka di friendship Lv ${u.at}`}</li>)}
      </ul>
    </div>
  )
}
