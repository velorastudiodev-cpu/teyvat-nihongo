import { useRef, useState } from 'react'
import { Icon } from '../../ui/Icon'
import { exportAll, importAll } from '../../engine/backup'
import { btn, card } from '../../ui/kit'
import { disableReminder, enableReminder, reminderHour } from '../../ui/reminder'
import { toast } from '../../ui/toastBus'
import { pref, setPref } from '../../ui/speak'
import { setFx, useFx } from '../../ui/fx'

const APK_URL = 'https://github.com/velorastudiodev-cpu/teyvat-nihongo/releases/latest/download/teyvat-nihongo.apk'

/** Backup/restore and reminders. */
export function Settings() {
  const file = useRef<HTMLInputElement>(null)
  const [hour, setHour] = useState(reminderHour())
  const [pick, setPick] = useState(hour >= 0 ? hour : 19)
  const [msg, setMsg] = useState<string>()
  const [sfxOn, setSfxOn] = useState(pref<string>('sfx', 'on') !== 'off')
  const fx = useFx()

  const download = async () => {
    const data = await exportAll()
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `teyvat-nihongo-${data.exportedAt.slice(0, 10)}.json` })
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup diunduh', 'save')
  }
  const restore = async (f?: File) => {
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (!confirm('Semua progres di perangkat ini akan diganti dengan isi backup. Lanjutkan?')) return
      const r = await importAll(data)
      setMsg(`Berhasil dipulihkan: ${r.items} item SRS.`)
      toast('Progres dipulihkan', 'save')
    } catch (e) {
      setMsg(e instanceof SyntaxError ? 'File bukan JSON yang valid.' : (e as Error).message)
    }
  }

  return (
    <section className={`${card} space-y-4`}>
      <h2 className="font-display text-xl font-extrabold">Data & pengaturan</h2>
      <div className="space-y-2">
        <p className="font-bold"><Icon name="save" className="mr-1 h-4 w-4 text-primary" />Backup progres</p>
        <p className="text-sm opacity-70">Semua data tersimpan di browser ini saja. Unduh backup JSON (termasuk chibi yang kamu upload) untuk dipindah ke perangkat lain.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className={`${btn} bg-deep text-white`}>Export JSON</button>
          <button onClick={() => file.current?.click()} className={`${btn} bg-paper`}>Import JSON…</button>
          <input ref={file} type="file" accept="application/json,.json" className="sr-only" aria-label="file backup" onChange={(e) => { restore(e.target.files?.[0]); e.target.value = '' }} />
        </div>
        {msg && <p className="text-sm font-bold">{msg}</p>}
      </div>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" checked={sfxOn} onChange={(e) => { setPref('sfx', e.target.checked ? 'on' : 'off'); setSfxOn(e.target.checked) }} className="h-5 w-5 accent-[var(--color-anemo)]" />
        <Icon name="speaker" className="mr-1 h-4 w-4" />Efek suara (SFX) jawaban
      </label>
      <div className="space-y-1">
        <p className="font-bold"><Icon name="download" className="mr-1 h-4 w-4 text-primary" />Versi Android terbaru</p>
        <p className="text-sm opacity-70">Setiap update di GitHub otomatis jadi APK baru. Pasang di atas versi lama; progres tetap aman.</p>
        <a href={APK_URL} target="_blank" rel="noopener" className={`${btn} bg-deep text-white`}><Icon name="download" /> Unduh APK terbaru</a>
      </div>
      <div className="space-y-2">
        <p className="font-bold"><Icon name="sparkle" className="mr-1 h-4 w-4 text-primary" />Efek visual</p>
        <div className="flex flex-wrap gap-2">
          {([['lite', 'Ringan', 'Paling lancar di HP: latar diam, partikel sedikit'], ['full', 'Penuh', 'Kincir berputar, kilat, kaca buram, lebih banyak partikel']] as const).map(([id, name, desc]) => (
            <button key={id} onClick={() => setFx(id)} className={`${btn} flex-col items-start text-left ${fx === id ? 'bg-primary text-white' : 'bg-paper'}`}>
              <span>{name}</span><span className="text-xs font-normal opacity-80">{desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-bold"><Icon name="bell" className="mr-1 h-4 w-4 text-primary" />Pengingat dari companion</p>
        <p className="text-sm opacity-70">Notifikasi sekali sehari setelah jam pilihanmu kalau belum belajar. Karena tanpa server, pengingat hanya muncul selama aplikasi (atau PWA yang di-install) masih terbuka atau berjalan di latar belakang.</p>
        <div className="flex flex-wrap items-center gap-2">
          <select value={pick} onChange={(e) => setPick(Number(e.target.value))} className="rounded-full border-2 border-gold/70 bg-paper px-3 py-1.5" aria-label="jam pengingat">
            {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
          </select>
          <button className={`${btn} bg-primary text-white`} onClick={async () => {
            const r = await enableReminder(pick)
            if (r === 'granted') { setHour(pick); toast(`Pengingat aktif jam ${pick}:00`, 'bell') }
            else setMsg(r === 'unsupported' ? 'Browser ini tidak mendukung notifikasi.' : 'Izin notifikasi ditolak.')
          }}>{hour >= 0 ? 'Simpan jam' : 'Aktifkan'}</button>
          {hour >= 0 && <button className={`${btn} bg-paper`} onClick={() => { disableReminder(); setHour(-1) }}>Matikan</button>}
          <span className="text-sm">{hour >= 0 ? `aktif · ${String(hour).padStart(2, '0')}:00` : 'mati'}</span>
        </div>
      </div>
    </section>
  )
}
