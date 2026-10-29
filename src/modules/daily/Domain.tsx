import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../../data/db'
import { claim } from '../../engine/game/economy'
import { today } from '../../engine/srs/srs'
import { getCharacter } from '../../characters'
import { btn, card, sample } from '../../ui/kit'
import { sfx } from '../../ui/sfx'
import { toast } from '../../ui/toastBus'
import { useDeadline } from '../../ui/useDeadline'
import { GameOver } from '../../games/common'
import { useGameEnd } from '../../games/hooks'
import { ItemQuestion } from '../Review'
import { learnedPool, type Q } from './pools'

type Blessing = { id: 'life' | 'shield' | 'score' | 'time'; name: string; desc: string }
const BLESSINGS: Blessing[] = [
  { id: 'life', name: '💚 Berkah Barbatos', desc: '+1 nyawa' },
  { id: 'shield', name: '🛡️ Perisai Jade', desc: 'Abaikan 1 jawaban salah' },
  { id: 'score', name: '🔥 Semangat Pyro', desc: 'Skor ×1,5 untuk 5 lantai' },
  { id: 'time', name: '⏳ Waktu Electro', desc: '+5 detik per soal' },
]
const REWARDED_RUNS = 3
const limitAt = (floor: number, bonus: number) => Math.max(6, Math.round(15 - floor * 0.3)) + bonus

export function Domain() {
  const profile = useLiveQuery(() => db.profile.get('me'))
  const [pool, setPool] = useState<(Q & { stability: number })[]>()
  const [run, setRun] = useState(0)
  useEffect(() => { learnedPool().then(setPool) }, [run])
  if (!pool || !profile) return null
  return <Run key={run} pool={pool} buff={getCharacter(profile.companionId)?.buff} onExit={() => setRun(run + 1)} />
}

function Run({ pool, buff, onExit }: { pool: (Q & { stability: number })[]; buff?: { game: string; effect: string; value: number; desc: string }; onExit: () => void }) {
  const mine = buff?.game === 'domain-run' ? buff : undefined
  const [floor, setFloor] = useState(1)
  const [lives, setLives] = useState(3 + (mine?.effect === 'extraLife' ? mine.value : 0))
  const [shield, setShield] = useState(mine?.effect === 'comboShield' ? 1 : 0)
  const [score, setScore] = useState(0)
  const [boostUntil, setBoostUntil] = useState(0)
  const [bonusTime, setBonusTime] = useState(0)
  const [choice, setChoice] = useState<Blessing[]>()
  const [reward, setReward] = useState<number>()
  const over = lives <= 0
  const { best, result } = useGameEnd('domain-run:endless', over, floor - 1)
  const limit = limitAt(floor, bonusTime)
  const timer = useDeadline(limit, () => done(false))
  const left = Math.ceil(timer.left)

  // later floors draw from the weakest items, early floors from anything
  const [item, setItem] = useState(() => pool[Math.floor(Math.random() * pool.length)])

  async function payOut(floors: number) {
    for (let k = 0; k < REWARDED_RUNS; k++) { const got = await claim(`domain:${today()}:${k}`, Math.min(100, floors * 4)); if (got) return setReward(got) }
    setReward(0)
  }

  function done(right: boolean) {
    if (over || choice) return
    timer.stop()
    let livesAfter = lives
    if (right) {
      const mult = (floor <= boostUntil ? 1.5 : 1) * (mine?.effect === 'scoreMult' ? mine.value : 1)
      setScore((s) => s + Math.round(10 * floor ** 0.5 * mult))
    } else if (shield) { setShield(shield - 1); toast('Perisai menahan serangan!', '🛡️') }
    else { livesAfter--; sfx.bad() }
    const next = floor + 1
    if (mine?.effect === 'heal' && next % 10 === 0) { livesAfter++; toast('Barbara menyembuhkanmu!', '💧') }
    setLives(livesAfter)
    const hardest = pool.slice(0, Math.max(5, Math.ceil(pool.length * Math.max(0.2, 1 - next / 40))))
    setItem(sample(next > 10 ? hardest : pool, 1)[0])
    setFloor(next)
    if (livesAfter <= 0) payOut(floor)
    else if (next % 5 === 0) setChoice(sample(BLESSINGS, 3))
    else timer.start(limitAt(next, bonusTime))
  }
  const bless = (b: Blessing) => {
    if (b.id === 'life') setLives((l) => l + 1)
    if (b.id === 'shield') setShield((s) => s + 1)
    if (b.id === 'score') setBoostUntil(floor + 5)
    if (b.id === 'time') setBonusTime((t) => t + 5)
    sfx.win(); setChoice(undefined); timer.start(limit + (b.id === 'time' ? 5 : 0))
  }

  if (over) return result ? (
    <div>
      <GameOver score={floor - 1} unit="lantai" newBest={result.newBest} best={best} onExit={onExit} />
      {reward !== undefined && <p className="mt-2 text-center font-display font-bold">{reward ? `+${reward} ✦ Kirameki` : `Hadiah Kirameki hanya untuk ${REWARDED_RUNS} run pertama setiap hari`}</p>}
    </div>
  ) : null
  return (
    <div className="space-y-2">
      <div className={`${card} mx-auto mt-2 flex max-w-lg flex-wrap items-center justify-between gap-2 font-display font-bold`}>
        <span>🌀 Lantai {floor}</span>
        <span>{'❤️'.repeat(lives)}{shield ? ` 🛡️×${shield}` : ''}</span>
        <span>Skor {score}{floor <= boostUntil && ' 🔥'}</span>
        <span className={left <= 3 ? 'text-torii' : ''}>⏱ {left}s</span>
      </div>
      {choice ? (
        <motion.main initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${card} mx-auto max-w-lg space-y-3 text-center`}>
          <p className="font-display text-2xl font-extrabold">Pilih berkah</p>
          {choice.map((b) => (
            <button key={b.id} onClick={() => bless(b)} className={`${btn} block w-full bg-paper text-left`}>{b.name} <span className="font-sans font-normal opacity-70">· {b.desc}</span></button>
          ))}
        </motion.main>
      ) : <ItemQuestion key={floor} item={item} title={`Lantai ${floor}`} onDone={(right) => done(right)} />}
      {mine && <p className="text-center text-xs opacity-60">Buff companion: {mine.desc}</p>}
    </div>
  )
}
