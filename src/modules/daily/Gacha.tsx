import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { db } from '../../data/db'
import { OUTFITS, STICKERS, THEMES } from '../../data/cosmetics'
import { Chibi } from '../../characters/Chibi'
import { featured, pull, type Reward } from '../../engine/game/gacha'
import { HARD_PITY, PULL_COST, RATE_4, RATE_5 } from '../../engine/game/rules'
import { btn, card } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toast'

const STAR = { 3: 'bg-[#8fb7d9]', 4: 'bg-[#b38be0]', 5: 'bg-geo' }

export function Gacha() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const feat = useLiveQuery(() => featured(), [profile?.pulls])
  const owned = useLiveQuery(() => db.unlocks.where('id').startsWith('cos:').primaryKeys(), []) ?? []
  const [results, setResults] = useState<Reward[]>()
  const [busy, setBusy] = useState(false)
  if (!profile) return null

  const doPull = async (n: number) => {
    setBusy(true)
    const r = await pull(n)
    setBusy(false)
    if (!r) return toast('Kirameki tidak cukup. Selesaikan commission dulu!', '✦')
    if (r.some((x) => x.rarity === 5)) sfx.win(); else sfx.good()
    setResults(r)
  }
  const has = (kind: string, id: string) => owned.includes(`cos:${kind}:${id}`)

  return (
    <main className="space-y-5 py-4">
      <section className={`${card} relative overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-4">
          {feat && <Chibi id={feat.id} expression="happy" size={150} />}
          <div className="flex-1 space-y-2">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-anemo">Banner minggu ini</p>
            <h1 className="font-display text-3xl font-extrabold">{feat ? `✨ ${feat.name}` : 'Semua karakter sudah kamu miliki!'}</h1>
            <p className="text-sm opacity-70">5★ karakter {RATE_5 * 100}% (50% karakter unggulan) · 4★ tema/aksesori {RATE_4 * 100}% · 3★ stiker. Pasti dapat karakter dalam {HARD_PITY} tarikan. Tanpa uang asli.</p>
            <p className="font-display font-bold">Pity: {profile.pity ?? 0} / {HARD_PITY}</p>
            <div className="flex flex-wrap gap-2">
              <button disabled={busy} onClick={() => doPull(1)} className={`${btn} bg-paper`}>Tarik 1× · ✦ {PULL_COST}</button>
              <button disabled={busy} onClick={() => doPull(10)} className={`${btn} bg-torii text-white`}>Tarik 10× · ✦ {PULL_COST * 10}</button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {results && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${card} space-y-3`}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {results.map((r, i) => (
                <motion.div key={i} initial={{ rotateY: 90, scale: .6 }} animate={{ rotateY: 0, scale: 1 }} transition={{ delay: i * .12 }}
                  className={`flex flex-col items-center rounded-2xl p-2 text-center ${STAR[r.rarity]}`}>
                  <span className="text-xs font-bold">{'★'.repeat(r.rarity)}</span>
                  {r.kind === 'character' && !r.dupe ? <Chibi id={r.id} expression="happy" size={80} />
                    : <span lang="ja" className="flex h-20 items-center text-3xl">{r.kind === 'theme' ? '🎨' : r.kind === 'outfit' ? '🎀' : r.kind === 'sticker' ? STICKERS.find((s) => s.id === r.id)?.ja : '✦'}</span>}
                  <span className="text-xs font-bold">{r.name}</span>
                  {r.dupe && <span className="text-[10px]">duplikat → ✦ {r.dupe}</span>}
                </motion.div>
              ))}
            </div>
            <button className="text-sm underline" onClick={() => setResults(undefined)}>Tutup</button>
          </motion.section>
        )}
      </AnimatePresence>

      <section className={`${card} space-y-4`}>
        <h2 className="font-display text-2xl font-extrabold">Inventaris</h2>
        <div>
          <p className="font-display font-bold">🎨 Tema UI</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEMES.map((t, i) => {
              const mine = i === 0 || has('theme', t.id)
              return (
                <button key={t.id} disabled={!mine} onClick={() => db.profile.update('me', { theme: t.id })}
                  className={`${btn} text-sm ${(profile.theme ?? 'mondstadt') === t.id ? 'bg-ink text-paper' : 'bg-paper'}`}
                  style={mine && t.vars.torii ? { borderColor: t.vars.torii } : undefined}>{mine ? '' : '🔒 '}{t.name}</button>
              )
            })}
          </div>
        </div>
        <div>
          <p className="font-display font-bold">🎀 Aksesori companion</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={() => db.profile.update('me', { outfit: undefined })} className={`${btn} text-sm ${!profile.outfit ? 'bg-ink text-paper' : 'bg-paper'}`}>Tanpa</button>
            {OUTFITS.map((o) => (
              <button key={o.id} disabled={!has('outfit', o.id)} onClick={() => db.profile.update('me', { outfit: o.id })}
                className={`${btn} text-sm ${profile.outfit === o.id ? 'bg-ink text-paper' : 'bg-paper'}`}>{has('outfit', o.id) ? '' : '🔒 '}{o.name}</button>
            ))}
          </div>
          <div className="mt-2"><Chibi id={profile.companionId} size={110} outfit={profile.outfit} /></div>
        </div>
        <div>
          <p className="font-display font-bold">💬 Buku stiker ({STICKERS.filter((s) => has('sticker', s.id)).length}/{STICKERS.length})</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STICKERS.map((s) => has('sticker', s.id)
              ? <span key={s.id} lang="ja" title={s.tr} className="rotate-[-3deg] rounded-xl border-[3px] border-ink px-3 py-1 font-bold text-white shadow-[2px_2px_0_var(--color-ink)]" style={{ background: s.color }}>{s.ja}</span>
              : <span key={s.id} className="rounded-xl border-[3px] border-dashed border-ink/30 px-3 py-1 opacity-40">？？？</span>)}
          </div>
        </div>
      </section>
    </main>
  )
}
