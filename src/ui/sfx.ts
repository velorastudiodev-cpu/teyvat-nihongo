import { pref } from './speak'

let ctx: AudioContext | undefined

function tone(freq: number, dur: number, type: OscillatorType = 'sine', delay = 0, vol = 0.12) {
  if (pref<string>('sfx', 'on') === 'off') return
  ctx ??= new AudioContext()
  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + dur)
}

export const sfx = {
  good: () => { tone(660, .09); tone(990, .14, 'sine', .08) },
  bad: () => tone(160, .22, 'square', 0, .06),
  pop: () => tone(1200, .06, 'triangle'),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .15, 'triangle', i * .09)),
}
