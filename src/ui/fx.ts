import { useSyncExternalStore } from 'react'
import { Capacitor } from '@capacitor/core'
import { pref, setPref } from './speak'

/*
 * Visual effects level. "lite" keeps the scenery but freezes its moving parts, uses fewer particles,
 * keeps small chibi still and drops the glass blur: phones scroll smoothly. Default: lite in the APK
 * and on devices with few CPU cores, full elsewhere.
 */
export type Fx = 'full' | 'lite'

const fallback = (): Fx => (Capacitor.isNativePlatform() || (navigator.hardwareConcurrency ?? 8) <= 4 ? 'lite' : 'full')
let current: Fx = pref<Fx>('fx', fallback())
const subs = new Set<() => void>()

export const applyFx = () => { document.documentElement.dataset.fx = current }

export function setFx(fx: Fx) {
  current = fx
  setPref('fx', fx)
  applyFx()
  subs.forEach((f) => f())
}

export const useFx = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f) } }, () => current)
