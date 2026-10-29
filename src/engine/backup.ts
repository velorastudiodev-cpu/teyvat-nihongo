import { db, type SrsItem } from '../data/db'

export const BACKUP_APP = 'teyvat-nihongo'
const TABLES = ['profile', 'items', 'reviews', 'mistakes', 'owned', 'days', 'scores', 'unlocks', 'exams', 'art'] as const

async function blobToDataUrl(b: Blob) {
  const bytes = new Uint8Array(await b.arrayBuffer())
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return `data:${b.type || 'application/octet-stream'};base64,${btoa(bin)}`
}
function dataUrlToBlob(url: string) {
  const [head, b64] = url.split(',')
  const bin = atob(b64)
  return new Blob([Uint8Array.from(bin, (c) => c.charCodeAt(0))], { type: head.slice(5).split(';')[0] })
}

/** Everything in one JSON document, uploaded chibi art included. */
export async function exportAll() {
  const tables: Record<string, unknown[]> = {}
  for (const t of TABLES) tables[t] = await db.table(t).toArray()
  tables.art = await Promise.all((tables.art as { id: string; blob: Blob }[]).map(async (a) => ({ id: a.id, blob: await blobToDataUrl(a.blob) })))
  return { app: BACKUP_APP, schema: db.verno, exportedAt: new Date().toISOString(), tables }
}

/** Replaces all progress with a backup. Throws with a readable message if the file isn't ours. */
export async function importAll(data: unknown) {
  const d = data as { app?: string; tables?: Record<string, unknown[]> }
  if (d?.app !== BACKUP_APP || typeof d.tables !== 'object') throw new Error('Ini bukan file backup Teyvat Nihongo.')
  for (const t of TABLES) if (d.tables[t] !== undefined && !Array.isArray(d.tables[t])) throw new Error(`Tabel "${t}" di backup rusak.`)
  if (!(d.tables.profile ?? []).length) throw new Error('Backup tidak berisi profil.')
  const items = (d.tables.items ?? []) as SrsItem[]
  for (const it of items) {   // JSON turns Dates into strings; ts-fsrs needs Dates back
    it.card.due = new Date(it.card.due)
    if (it.card.last_review) it.card.last_review = new Date(it.card.last_review)
  }
  const art = ((d.tables.art ?? []) as { id: string; blob: string }[]).map((a) => ({ id: a.id, blob: dataUrlToBlob(a.blob) }))
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) {
      await db.table(t).clear()
      await db.table(t).bulkPut(t === 'art' ? art : t === 'items' ? items : (d.tables![t] ?? []))
    }
  })
  return { items: items.length }
}
