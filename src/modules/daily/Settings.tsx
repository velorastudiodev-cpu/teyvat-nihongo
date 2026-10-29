import { useRef, useState } from 'react'
import { exportAll, importAll } from '../../engine/backup'
import { btn, card } from '../../ui/kit'
import { disableReminder, enableReminder, reminderHour } from '../../ui/reminder'
import { toast } from '../../ui/toast'
import { pref, setPref } from '../../ui/speak'

/** Backup/restore and reminders. */
export function Settings() {
  const file = useRef<HTMLInputElement>(null)
  const [hour, setHour] = useState(reminderHour())
  const [pick, setPick] = useState(hour >= 0 ? hour : 19)
  const [msg, setMsg] = useState<string>()
  const [sfxOn, setSfxOn] = useState(pref<string>('sfx', 'on') !== 'off')

  const download = async () => {
    const data = await exportAll()
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `teyvat-nihongo-${data.exportedAt.slice(0, 10)}.json` })
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup diunduh', '💾')
  }
  const restore = async (f?: File) => {
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (!confirm('Semua progres di perangkat ini akan diganti dengan isi backup. Lanjutkan?')) return
      const r = await importAll(data)
      setMsg(`Berhasil dipulihkan: ${r.items} item SRS.`)
      toast('Progres dipulihkan', '💾')
    } catch (e) {
      setMsg(e instanceof SyntaxError ? 'File bukan JSON yang valid.' : (e as Error).message)
    }
  }

  return (
    <section className={`${card} space-y-4`}>
      <h2 className="font-display text-xl font-extrabold">Data & pengaturan</h2>
      <div className="space-y-2">
        <p className="font-bold">💾 Backup progres</p>
        <p className="text-sm opacity-70">Semua data tersimpan di browser ini saja. Unduh backup JSON (termasuk chibi yang kamu upload) untuk dipindah ke perangkat lain.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className={`${btn} bg-anemo text-white`}>Export JSON</button>
          <button onClick={() => file.current?.click()} className={`${btn} bg-paper`}>Import JSON…</button>
          <input ref={file} type="file" accept="application/json,.json" className="sr-only" aria-label="file backup" onChange={(e) => { restore(e.target.files?.[0]); e.target.value = '' }} />
        </div>
        {msg && <p className="text-sm font-bold">{msg}</p>}
      </div>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" checked={sfxOn} onChange={(e) => { setPref('sfx', e.target.checked ? 'on' : 'off'); setSfxOn(e.target.checked) }} className="h-5 w-5 accent-[var(--color-anemo)]" />
        🔊 Efek suara (SFX) jawaban
      </label>
      <div className="space-y-2">
        <p className="font-bold">🔔 Pengingat dari companion</p>
        <p className="text-sm opacity-70">Notifikasi sekali sehari setelah jam pilihanmu kalau belum belajar. Karena tanpa server, pengingat hanya muncul selama aplikasi (atau PWA yang di-install) masih terbuka atau berjalan di latar belakang.</p>
        <div className="flex flex-wrap items-center gap-2">
          <select value={pick} onChange={(e) => setPick(Number(e.target.value))} className="rounded-full border-[3px] border-ink bg-paper px-3 py-1.5" aria-label="jam pengingat">
            {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
          </select>
          <button className={`${btn} bg-torii text-white`} onClick={async () => {
            const r = await enableReminder(pick)
            if (r === 'granted') { setHour(pick); toast(`Pengingat aktif jam ${pick}:00`, '🔔') }
            else setMsg(r === 'unsupported' ? 'Browser ini tidak mendukung notifikasi.' : 'Izin notifikasi ditolak.')
          }}>{hour >= 0 ? 'Simpan jam' : 'Aktifkan'}</button>
          {hour >= 0 && <button className={`${btn} bg-paper`} onClick={() => { disableReminder(); setHour(-1) }}>Matikan</button>}
          <span className="text-sm">{hour >= 0 ? `aktif · ${String(hour).padStart(2, '0')}:00` : 'mati'}</span>
        </div>
      </div>
    </section>
  )
}
