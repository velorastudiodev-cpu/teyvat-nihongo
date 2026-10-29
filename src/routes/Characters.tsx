import { useLiveQuery } from 'dexie-react-hooks'
import { Icon } from '../ui/Icon'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Chibi } from '../characters/Chibi'
import { DESIGNS } from '../characters/designs'
import { characters, ELEMENT_COLOR, EXPRESSIONS, getCharacter, REGIONS } from '../characters'
import { db, type Art } from '../data/db'
import { CULTURE_NOTES } from '../data/cosmetics'
import { FRIEND_LEVELS, friendLevel } from '../engine/game/rules'
import { speak } from '../ui/speak'
import { phaseOf } from '../engine/raiden'

const EXPR_LABEL = { idle: 'Santai', happy: 'Senang', sad: 'Menyemangati', sleep: 'Tidur' }

export function Characters() {
  const { id } = useParams()
  const profile = useLiveQuery(() => db.profile.get('me'))
  const selected = getCharacter(id ?? profile?.companionId ?? '')
  const uploaded = useLiveQuery(() => db.art.toCollection().primaryKeys(), []) ?? []
  const ownedRows = useLiveQuery(() => db.owned.toArray(), []) ?? []
  const mine = ownedRows.find((o) => o.charId === selected?.id)

  const hasArt = (c: { id: string; assets: Record<string, string> }) => !!DESIGNS[c.id] || c.assets.idle.endsWith('.webp') || uploaded.includes(`${c.id}:idle`)
  const raidenPhase = phaseOf(profile?.raiden)

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      <nav className="g-glass mx-auto flex w-fit rounded-full p-1 text-sm font-bold">
        <span className="rounded-full bg-white/15 px-4 py-1.5 text-gold-soft ring-1 ring-gold/50"><Icon name="users" className="mr-1 h-4 w-4" />Karakter</span>
        <Link to="/gacha" className="rounded-full px-4 py-1.5 text-paper/75 hover:text-paper"><Icon name="wish" className="mr-1 h-4 w-4" />Wish</Link>
      </nav>

      {selected && (
        <motion.section key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="g-panel overflow-hidden p-0">
          <div className="relative grid gap-2 p-5 sm:grid-cols-[auto_1fr] sm:items-end"
            style={{ background: `linear-gradient(135deg, ${ELEMENT_COLOR[selected.element]}33, transparent 60%)` }}>
            <div className="relative mx-auto">
              <div className="absolute inset-6 rounded-full blur-2xl" style={{ background: `${ELEMENT_COLOR[selected.element]}66` }} />
              <div className="relative"><Chibi id={selected.id} size={210} /></div>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <p className="flex items-center justify-center gap-1 text-geo sm:justify-start">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="h-4 w-4" />)}</p>
              <h2 className="font-display text-4xl leading-none font-black">{selected.name}</h2>
              <p className="flex items-center justify-center gap-2 sm:justify-start">
                <span lang="ja" className="text-lg">{selected.nameJa}</span>
                <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: ELEMENT_COLOR[selected.element] }}>
                  <Icon name={selected.element === 'none' ? 'sparkle' : selected.element} className="h-3.5 w-3.5" />{selected.element}
                </span>
                <span className="text-sm opacity-70">{REGIONS.find((r) => r.id === selected.region)?.name}</span>
              </p>
              <p className="text-sm"><b>Buff:</b> {selected.buff.desc}</p>
              <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
                {mine && hasArt(selected) && profile?.companionId !== selected.id && (
                  <button onClick={() => db.profile.update('me', { companionId: selected.id })} className="g-btn bg-primary text-white"><Icon name="users" /> Jadikan companion</button>
                )}
                {profile?.companionId === selected.id && <span className="g-btn bg-soft"><Icon name="check" /> Companion aktif</span>}
                {selected.id === 'raiden' && (
                  <Link to="/raiden" className="g-btn bg-[#2c1f52] text-[#e3d0ff]"><Icon name="tomoe" /> {raidenPhase === 'hidden' ? 'Rahasia Inazuma' : 'Ikatan Keabadian'}</Link>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3 border-t border-gold/40 p-5">
            {mine ? <Friendship charIndex={characters.indexOf(selected)} points={mine.friendship} lines={selected.lines} isCompanion={profile?.companionId === selected.id} />
              : <p className="rounded-2xl bg-paper-deep p-3 font-bold"><Icon name="lock" className="mr-1 h-4 w-4" />Belum dimiliki. Dapatkan dari <Link to="/gacha" className="underline">Wish</Link> (Kirameki dari commission){selected.id === 'raiden' ? ', atau lewat rahasia Inazuma' : ''}.</p>}
            <details className="rounded-2xl bg-paper p-3">
              <summary className="cursor-pointer font-display font-bold"><Icon name="palette" className="mr-1 h-4 w-4 text-primary" />Ekspresi & gambar sendiri</summary>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {EXPRESSIONS.map((e) => (
                  <figure key={e} className="flex flex-col items-center rounded-2xl bg-white/70 p-2">
                    <Chibi id={selected.id} expression={e} size={120} />
                    <figcaption className="font-display text-sm font-bold">{EXPR_LABEL[e]}</figcaption>
                    <ArtSlot id={`${selected.id}:${e}`} uploaded={uploaded.includes(`${selected.id}:${e}`)} />
                  </figure>
                ))}
              </div>
              <p className="mt-2 text-xs opacity-70">Upload PNG/SVG/GIF/WebP milikmu (maks. 5 MB). Gambar upload selalu didahulukan; gambar <b>Santai</b> dipakai untuk ekspresi lain yang belum di-upload. Reset mengembalikan gambar bawaan.</p>
            </details>
          </div>
        </motion.section>
      )}

      {REGIONS.map((r) => (
        <section key={r.id} data-region={r.id}>
          <h3 className="g-heading mb-2 text-sm tracking-[.2em] text-paper uppercase drop-shadow">{r.name} · {r.level}</h3>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6">
            {characters.filter((c) => c.region === r.id).map((c) => {
              const own = ownedRows.find((o) => o.charId === c.id)
              const secret = c.id === 'raiden' && !own && raidenPhase === 'hidden'
              return (
                <Link key={c.id} to={`/characters/${c.id}`}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-paper-deep shadow-md transition-transform hover:-translate-y-1 ${c.id === id ? 'border-primary ring-2 ring-primary' : 'border-gold/60'}`}>
                  <span className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(0deg, ${ELEMENT_COLOR[c.element]}55, transparent)` }} />
                  <span className={`relative ${own ? '' : 'opacity-45 grayscale'}`}><Chibi id={c.id} size={92} /></span>
                  <Icon name={c.element === 'none' ? 'sparkle' : c.element} className="absolute top-1.5 left-1.5 h-4 w-4" style={{ color: ELEMENT_COLOR[c.element] }} />
                  <span className="relative w-full bg-night/85 px-1 py-1 text-center font-display text-[11px] font-bold text-paper">
                    {own ? null : <Icon name={secret ? 'tomoe' : 'lock'} className="mr-0.5 h-3 w-3" />}{secret ? '???' : c.name}
                  </span>
                  {own && <span className="absolute top-1 right-1 flex items-center gap-0.5 rounded-full bg-white/85 px-1.5 text-[10px] font-bold text-wrong"><Icon name="heart" className="h-2.5 w-2.5" />{friendLevel(own.friendship)}</span>}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

const MAX_BYTES = 5 * 1024 * 1024

function ArtSlot({ id, uploaded }: { id: Art['id']; uploaded: boolean }) {
  const pick = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('File harus berupa gambar.')
    if (file.size > MAX_BYTES) return alert('Gambar maksimal 5 MB.')
    db.art.put({ id, blob: file, at: Date.now() })
  }
  return (
    <div className="mt-1 flex gap-1 text-xs font-bold">
      <label className="cursor-pointer rounded-full bg-white px-2.5 py-0.5 ring-1 ring-gold hover:bg-paper-deep">
        {uploaded ? 'Ganti' : 'Upload'}
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
      </label>
      {uploaded && (
        <button onClick={() => db.art.delete(id)} className="cursor-pointer rounded-full px-2.5 py-0.5 text-wrong ring-1 ring-wrong hover:bg-wrong hover:text-white">
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
    ...lines.map((l, i) => ({ at: i === 0 ? 1 : 3, node: <button onClick={() => speak(l.ja)} className="cursor-pointer text-left hover:text-wrong"><Icon name="speaker" className="mr-1 h-4 w-4 text-primary" /><span lang="ja">{l.ja}</span> <span className="opacity-60">— {l.tr}</span></button> })),
    ...notes.map((n, i) => ({ at: i === 0 ? 5 : 7, node: <span><Icon name="scroll" className="mr-1 h-4 w-4 text-primary" /><b>Culture Note:</b> {n}</span> })),
  ]
  return (
    <div className="mt-3 space-y-2">
      <p className="font-display font-bold"><Icon name="heart" className="mr-1 h-4 w-4 text-wrong" />Friendship Lv {lv}{next ? <span className="font-sans text-sm font-normal opacity-70"> · {points}/{next} (naik saat belajar dengan karakter ini sebagai companion{isCompanion ? ' (aktif)' : ''})</span> : ' · MAX'}</p>
      <ul className="space-y-1">
        {unlocks.map((u, i) => <li key={i} className={lv >= u.at ? '' : 'opacity-50'}>{lv >= u.at ? u.node : <><Icon name="lock" className="mr-1 h-3.5 w-3.5" />Terbuka di friendship Lv {u.at}</>}</li>)}
      </ul>
    </div>
  )
}
