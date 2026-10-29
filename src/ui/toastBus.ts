export type Toast = { id: number; text: string; icon: string }

let listeners: ((t: Toast) => void)[] = []
let seq = 0

export const toast = (text: string, icon = '✦') => listeners.forEach((l) => l({ id: ++seq, text, icon }))

export function onToast(l: (t: Toast) => void) {
  listeners.push(l)
  return () => { listeners = listeners.filter((x) => x !== l) }
}
