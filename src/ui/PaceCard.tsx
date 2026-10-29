import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Profile } from '../data/db'
import { plan, stagesToTarget } from '../engine/pace/pace'

const fmt = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const MESSAGE = {
  free: 'Santai tapi pasti. Tambah menit per hari kalau mau lebih cepat.',
  'on-track': 'Sesuai jadwal! Pertahankan ritmenya.',
  behind: 'Target tanggalnya ketat. Beban harian dinaikkan sedikit, tapi mungkin perlu menambah menit atau menggeser tanggal.',
  brake: 'Akurasi turun. Materi baru direm dulu supaya review-mu kuat.',
}

export function usePacePlan(profile?: Profile) {
  const { stage, target, minutesPerDay, targetDate } = profile ?? {}
  const data = useLiveQuery(async () => {
    if (!stage || !target) return
    const learned = await db.items.where('stage').anyOf(stagesToTarget(stage, target)).count()
    const recent = await db.days.orderBy('date').reverse().limit(7).toArray()
    return { learned, recent: recent.reverse() }
  }, [stage, target])
  if (!stage || !target || !minutesPerDay || !data) return
  return plan({ stage, target, minutesPerDay, targetDate, ...data })
}

export function PaceCard({ profile }: { profile: Profile }) {
  const p = usePacePlan(profile)
  const { target, minutesPerDay } = profile
  if (!p || !minutesPerDay) return null
  return (
    <div className="rounded-3xl border-[3px] border-ink bg-white p-5 shadow-[4px_4px_0_var(--color-ink)]">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-anemo">Estimasi lulus {target}</p>
      <p className="font-display text-3xl font-extrabold">{fmt(p.finish)}</p>
      {p.finishActual && <p className="text-sm">Dari performa 7 hari terakhir: <b>{fmt(p.finishActual)}</b></p>}
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat label="item baru/hari" value={p.newPerDay} />
        <Stat label="item tersisa" value={p.remaining.toLocaleString('id-ID')} />
        <Stat label="menit/hari" value={minutesPerDay} />
      </dl>
      {p.requiredPerDay !== undefined && profile.targetDate && (
        <p className="mt-2 text-sm">Target {fmt(new Date(profile.targetDate))} butuh ±{p.requiredPerDay} item/hari.</p>
      )}
      <p className={`mt-2 text-sm font-bold ${p.status === 'behind' || p.status === 'brake' ? 'text-torii' : 'text-anemo'}`}>{MESSAGE[p.status]}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-paper p-2">
      <dd className="font-display text-2xl font-extrabold">{value}</dd>
      <dt className="text-xs opacity-70">{label}</dt>
    </div>
  )
}
