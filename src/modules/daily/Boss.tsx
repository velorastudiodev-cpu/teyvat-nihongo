import { useEffect, useState } from 'react'
import { Hearts, Icon, type IconName } from '../../ui/Icon'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../../data/db'
import { claim } from '../../engine/game/economy'
import { weekId } from '../../engine/game/rules'
import { today } from '../../engine/srs/srs'
import { getCharacter } from '../../characters'
import { Buddy } from '../../ui/Buddy'
import { btn, card } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { useGameEnd } from '../../games/hooks'
import { ItemQuestion } from '../Review'
import { weeklyBoss } from '../../engine/game/weekly'
import { weekPool, type Q } from './pools'

const BOSS_HP = 300
export const BOSS_REWARD = 300

export function Boss() {
  const week = weekId(today())
  const boss = weeklyBoss()
  const profile = useLiveQuery(() => db.profile.get('me'))
  const beaten = useLiveQuery(() => db.unlocks.get(`boss:${week}`), [week])
  const [pool, setPool] = useState<Q[]>()
  const [n, setN] = useState(0)
  const [hp, setHp] = useState(BOSS_HP)
  const [lives, setLives] = useState<number>()
  const [hit, setHit] = useState<number>()
  const [reward, setReward] = useState<number>()
  useEffect(() => { weekPool(week).then(setPool) }, [week])

  const buff = getCharacter(profile?.companionId ?? '')?.buff
  const dmgMult = buff?.game === 'weekly-boss' && buff.effect === 'damageMult' ? buff.value : 1
  const maxLives = 3 + (buff?.game === 'weekly-boss' && buff.effect === 'extraLife' ? buff.value : 0)
  const over = lives !== undefined && (hp <= 0 || lives <= 0)
  useGameEnd('weekly-boss:endless', over, BOSS_HP - Math.max(0, hp))

  if (!pool || !profile) return null
  if (lives === undefined) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-4 text-center`}>
      <BossAvatar boss={boss} />
      <h1 className="font-display text-3xl font-extrabold">{boss.name}</h1>
      <p className="italic opacity-70">"{boss.taunt}"</p>
      <p>Soal campuran dari materi minggu ini. Setiap jawaban benar menyerang boss, setiap salah kamu kehilangan 1 nyawa ({maxLives} nyawa).</p>
      <p className="font-display font-bold">{beaten ? <><Icon name="check" className="h-4 w-4 text-anemo" /> Sudah dikalahkan minggu ini (boleh latihan lagi, tanpa hadiah)</> : <>Hadiah: <Icon name="gem" className="h-4 w-4 text-geo" /> {BOSS_REWARD}</>}</p>
      <button className={`${btn} w-full bg-primary text-white`} onClick={() => setLives(maxLives)}><Icon name="swords" className="h-4 w-4" /> Tantang!</button>
    </main>
  )
  if (over) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood={hp <= 0 ? 'happy' : 'sad'} size={120} /></div>
      <p className="font-display text-3xl font-extrabold">{hp <= 0 ? `${boss.name} kalah!` : 'Kamu tumbang… coba lagi!'}</p>
      {reward ? <p className="font-display text-xl text-geo">+{reward} <Icon name="gem" className="h-5 w-5" /></p> : null}
      <Link to="/daily" className={`${btn} inline-block bg-primary text-white`}>Kembali ke Harian</Link>
    </main>
  )

  return (
    <div className="space-y-2">
      <div className={`${card} mx-auto mt-2 flex max-w-lg items-center gap-3`}>
        <motion.div animate={hit ? { x: [0, -10, 10, -6, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'] } : {}} key={n}><BossAvatar boss={boss} small /></motion.div>
        <div className="flex-1">
          <p className="font-display font-bold">{boss.name}</p>
          <div className="h-4 overflow-hidden rounded-full bg-paper-deep"><motion.div className="h-full bg-primary" animate={{ width: `${(Math.max(0, hp) / BOSS_HP) * 100}%` }} /></div>
          <p className="text-sm">HP {Math.max(0, hp)} / {BOSS_HP} · <Hearts lives={lives} />{hit ? <span className="ml-2 font-bold text-wrong">-{hit}</span> : null}</p>
        </div>
      </div>
      <ItemQuestion key={n} item={pool[n % pool.length]} title={`Serangan ${n + 1}`} onDone={(right, ms) => {
        if (right) {
          const dmg = Math.round((20 + Math.max(0, 10 - ms / 1000)) * dmgMult)
          setHp(hp - dmg); setHit(dmg); sfx.pop()
          if (hp > 0 && hp - dmg <= 0) claim(`boss:${week}`, BOSS_REWARD).then(setReward)
        }
        else { setLives((l) => (l ?? 1) - 1); setHit(undefined) }
        setN(n + 1)
      }} />
    </div>
  )
}

function BossAvatar({ boss, small }: { boss: { icon: IconName; color: string }; small?: boolean }) {
  return (
    <div className={`relative mx-auto flex items-center justify-center rounded-full text-white shadow-lg ring-2 ring-gold ring-offset-2 ring-offset-paper ${small ? 'h-16 w-16' : 'h-28 w-28'}`}
      style={{ background: `radial-gradient(circle at 50% 35%, ${boss.color}, #1c2030 85%)` }}>
      <Icon name="mask" className={small ? 'h-9 w-9' : 'h-16 w-16'} />
      <Icon name={boss.icon} className={`absolute -right-1 -bottom-1 rounded-full bg-night p-1 ${small ? 'h-6 w-6' : 'h-9 w-9'}`} />
    </div>
  )
}
