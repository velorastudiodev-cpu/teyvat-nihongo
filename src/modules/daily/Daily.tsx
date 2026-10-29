import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../../data/db'
import { BOSSES } from '../../data/cosmetics'
import { claim, MAX_FREEZES, spend } from '../../engine/game/economy'
import { COMMISSION_BONUS, COMMISSION_REWARD, commissionsFor, seeded, streak, weekId } from '../../engine/game/rules'
import { today } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { btn, card } from '../../ui/kit'
import { usePacePlan } from '../../ui/PaceCard'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toast'

export const FREEZE_PRICE = 200
export const weeklyBoss = (date = today()) => BOSSES[Math.floor(seeded(weekId(date))() * BOSSES.length)]

export function Daily() {
  const date = today()
  const profile = useLiveQuery(() => db.profile.get('me'))
  const plan = usePacePlan(profile)
  const day = useLiveQuery(() => db.days.get(date), [date])
  const days = useLiveQuery(() => db.days.toArray(), []) ?? []
  const claimed = useLiveQuery(() => db.unlocks.where('id').startsWith(`claim:${date}:`).primaryKeys(), [date]) ?? []
  const bossBeaten = useLiveQuery(() => db.unlocks.get(`boss:${weekId(date)}`), [date])
  const grudges = useLiveQuery(() => db.mistakes.filter((m) => !m.fixed).count(), [])   // booleans aren't indexable keys ?? 0
  if (!profile) return null

  const stats = day ?? { xp: 0, reviews: 0, correct: 0, newItems: 0 }
  const list = commissionsFor(date, plan?.newPerDay)
  const isClaimed = (id: string) => claimed.includes(`claim:${date}:${id}`)
  const allDone = list.every((c) => isClaimed(c.id))
  const boss = weeklyBoss(date)
  const get = async (id: string, reward: number) => {
    const got = await claim(`claim:${date}:${id}`, reward)
    if (got) { sfx.win(); toast(`+${got} Kirameki`) }
  }

  return (
    <main className="space-y-5 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Commission Harian</h1>
          <p className="opacity-70">Reset setiap tengah malam. Selesaikan keempatnya untuk bonus!</p>
        </div>
        <div className="flex gap-2 font-display font-bold">
          <span className="rounded-full bg-torii px-4 py-1.5 text-white">🔥 {streak(days, date)} hari</span>
          <span className="rounded-full bg-[#7cc6de] px-4 py-1.5" title="Streak Freeze">🧊 {profile.freezes ?? 0}</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((c) => {
          const have = Math.min(c.target, c.progress(stats))
          const done = have >= c.target
          return (
            <div key={c.id} className={`${card} space-y-2`}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-lg font-bold">{isClaimed(c.id) ? '✅ ' : ''}{c.title}</p>
                <span className="font-display font-bold text-geo">✦ {COMMISSION_REWARD}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-paper-deep">
                <motion.div className="h-full bg-anemo" animate={{ width: `${(have / c.target) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{have} / {c.target}</span>
                {isClaimed(c.id) ? <span className="opacity-60">sudah diklaim</span>
                  : done ? <button onClick={() => get(c.id, COMMISSION_REWARD)} className={`${btn} bg-geo py-1 text-sm`}>Klaim</button>
                  : <Link to={c.link} className="font-bold underline">Kerjakan →</Link>}
              </div>
            </div>
          )
        })}
      </div>

      <div className={`${card} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <Buddy mood={allDone ? 'happy' : 'idle'} size={70} />
          <p className="font-display text-lg font-bold">Bonus harian: semua commission selesai</p>
        </div>
        {isClaimed('bonus') ? <span className="font-bold opacity-60">✅ sudah diklaim</span>
          : <button disabled={!allDone} onClick={() => get('bonus', COMMISSION_BONUS)} className={`${btn} bg-torii text-white`}>Klaim ✦ {COMMISSION_BONUS}</button>}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Link to="/revenge" className={`${card} transition-transform hover:-translate-y-1`}>
          <p className="font-display text-xl font-bold">⚔️ Revenge Quest</p>
          <p className="text-sm opacity-70">{grudges ? `${grudges} kesalahan menunggu balas dendam. Hadiah ✦ 2×!` : 'Belum ada kesalahan untuk dibalas. Hebat!'}</p>
        </Link>
        <Link to="/boss" className={`${card} transition-transform hover:-translate-y-1`}>
          <p className="font-display text-xl font-bold">{boss.emoji} Weekly Boss</p>
          <p className="text-sm opacity-70">{boss.name} · {bossBeaten ? '✅ sudah dikalahkan minggu ini' : 'hadiah ✦ 300'}</p>
        </Link>
        <Link to="/domain" className={`${card} transition-transform hover:-translate-y-1`}>
          <p className="font-display text-xl font-bold">🌀 Domain Run</p>
          <p className="text-sm opacity-70">Roguelite tanpa akhir: soal campuran makin sulit, 3 nyawa, buff karakter.</p>
        </Link>
      </div>

      <div className={`${card} flex flex-wrap items-center justify-between gap-3`}>
        <p><b className="font-display">🧊 Streak Freeze</b> <span className="text-sm opacity-70">menyelamatkan streak saat kamu absen sehari. 1 gratis setiap minggu (Jean: +1), maks. {MAX_FREEZES}.</span></p>
        <button disabled={(profile.freezes ?? 0) >= MAX_FREEZES || (profile.kirameki ?? 0) < FREEZE_PRICE} className={`${btn} bg-paper`}
          onClick={async () => { if (await spend(FREEZE_PRICE)) { await db.profile.update('me', { freezes: (profile.freezes ?? 0) + 1 }); toast('Streak Freeze dibeli', '🧊') } }}>
          Beli ✦ {FREEZE_PRICE}
        </button>
      </div>
    </main>
  )
}
