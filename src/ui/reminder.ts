import { db } from '../data/db'
import { getCharacter } from '../characters'
import { today } from '../engine/srs/srs'
import { pref, setPref } from './speak'

/*
 * Character reminders. Without a server there is no true push, so this fires while the app
 * (or the installed PWA) is open or in the background: once a day, after the chosen hour,
 * if nothing has been studied yet.
 */
export const reminderHour = () => Number(pref('reminder-hour', '-1'))   // -1 = off

export async function enableReminder(hour: number) {
  if (!('Notification' in window)) return 'unsupported'
  const perm = await Notification.requestPermission()
  if (perm === 'granted') setPref('reminder-hour', String(hour))
  return perm
}
export const disableReminder = () => setPref('reminder-hour', '-1')

const LINES: Record<string, string> = {
  paimon: 'Paimon lapar… ayo review dulu, nanti kita makan! 🍙',
  klee: 'Klee bosan! Ayo main Kana Rain bareng Klee! 💥',
  zhongli: 'Kontrak hari ini belum dipenuhi. Mari belajar sebentar.',
  hutao: 'Hihi, kartu-kartumu sudah menunggu seperti hantu~ 👻',
}

export async function maybeRemind(now = new Date()) {
  const hour = reminderHour()
  if (hour < 0 || now.getHours() < hour || !('Notification' in window) || Notification.permission !== 'granted') return false
  const date = today(now)
  if (pref('reminder-last', '') === date) return false
  if ((await db.days.get(date))?.xp) return false
  const p = await db.profile.get('me')
  const c = getCharacter(p?.companionId ?? 'paimon')
  const due = await db.items.where('due').belowOrEqual(Date.now()).count()
  const body = LINES[c?.id ?? ''] ?? `${c?.name ?? 'Paimon'}: ayo belajar sebentar! ${due} kartu menunggu.`
  const reg = await navigator.serviceWorker?.getRegistration()
  const opts = { body, icon: '/icon-192.png', tag: 'daily-reminder' }
  if (reg) await reg.showNotification('Teyvat Nihongo', opts); else new Notification('Teyvat Nihongo', opts)
  setPref('reminder-last', date)
  return true
}
