import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../data/db'
import { claim, earn } from '../../engine/game/economy'
import { today } from '../../engine/srs/srs'
import { Buddy } from '../../ui/Buddy'
import { btn, card } from '../../ui/kit'
import { toast } from '../../ui/toastBus'
import { ItemQuestion } from '../Review'
import type { Q } from './pools'

const PER_FIX = 10
const BONUS = 50
const kindOf = (id: string) => id.split(':')[0] as Q['kind']

/** Mistake Journal → quest: items you got wrong come back; beating them pays double. */
export function Revenge() {
  const [queue, setQueue] = useState<Q[]>()
  const [fixed, setFixed] = useState(0)
  const [n, setN] = useState(0)
  useEffect(() => { (async () => {
    const open = (await db.mistakes.toArray()).filter((m) => !m.fixed).reverse()
    const ids = [...new Set(open.map((m) => m.itemId))].slice(0, 10)
    setQueue(ids.map((id) => ({ id, kind: kindOf(id) })))
  })() }, [])

  if (!queue) return null
  if (n >= queue.length) return (
    <main className={`${card} mx-auto mt-6 max-w-lg space-y-3 text-center`}>
      <div className="flex justify-center"><Buddy mood="happy" size={120} /></div>
      <p className="font-display text-3xl font-extrabold">{queue.length ? `${fixed} / ${queue.length} dibalas!` : 'Mistake Journal kosong'}</p>
      <p>{queue.length ? 'Kesalahan yang terbalas dihapus dari jurnal. Yang belum akan menunggu di Revenge Quest berikutnya.' : 'Belum ada kesalahan untuk dibalas.'}</p>
      <Link to="/daily" className={`${btn} inline-block bg-primary text-white`}>Kembali ke Harian</Link>
    </main>
  )
  return <ItemQuestion key={n} item={queue[n]} title={`Revenge Quest · ${n + 1}/${queue.length}`} onDone={async (right) => {
    if (right) {
      const id = queue[n].id
      await db.mistakes.filter((m) => m.itemId === id && !m.fixed).modify({ fixed: true })
      const got = await earn(PER_FIX)
      toast(`Balas dendam berhasil! +${got} Kirameki`, 'swords')
      if (fixed + 1 === 5) { const b = await claim(`revenge:${today()}`, BONUS); if (b) toast(`Bonus Revenge +${b} Kirameki`, 'trophy') }
      setFixed(fixed + 1)
    }
    setN(n + 1)
  }} />
}
