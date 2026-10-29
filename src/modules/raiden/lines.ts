import type { Profile } from '../../data/db'
import { bondLevel } from '../../engine/raiden'

type Said = { ja: string; tr: string }
const BY_HOUR = (h: number) => (h >= 5 && h < 11 ? 0 : h < 17 ? 1 : h < 22 ? 2 : 3)

const SHOGUN: Said[] = [
  { ja: 'おはようございます。今日も鍛錬を始めましょう。', tr: 'Selamat pagi. Mari mulai latihan hari ini.' },
  { ja: '休憩も大切です。でも、怠けてはいけません。', tr: 'Istirahat itu penting. Tapi jangan bermalas-malasan.' },
  { ja: '今日の鍛錬はどうでしたか。', tr: 'Bagaimana latihanmu hari ini?' },
  { ja: 'もう遅いです。早く寝なさい。', tr: 'Sudah larut. Cepat tidur.' },
]
const EI: Said[] = [
  { ja: 'おはようございます。今日も一緒に頑張りましょうね。', tr: 'Selamat pagi. Hari ini pun ayo berusaha bersama, ya.' },
  { ja: 'お団子、一緒に食べませんか。', tr: 'Mau makan dango bersama?' },
  { ja: 'おかえりなさい。待っていましたよ。', tr: 'Selamat datang kembali. Aku sudah menunggumu.' },
  { ja: 'おやすみなさい。また明日、会いましょう。', tr: 'Selamat tidur. Sampai jumpa besok.' },
]
const PROMISED: Said[] = [
  { ja: 'おはよう。今日も、あなたの隣にいます。', tr: 'Pagi. Hari ini pun aku ada di sampingmu.' },
  { ja: 'あなたと過ごす時間が、私の永遠です。', tr: 'Waktu bersamamu adalah keabadianku.' },
  { ja: 'おかえり。今日のこと、聞かせてください。', tr: 'Selamat datang. Ceritakan harimu padaku.' },
  { ja: 'おやすみ。夢でも会いましょうね。', tr: 'Selamat tidur. Sampai bertemu di mimpi, ya.' },
]
export const EI_LINES: Said[] = [
  { ja: '影と呼んでください。', tr: 'Panggil aku Ei.' },
  { ja: '甘いものは、心を穏やかにします。', tr: 'Makanan manis menenangkan hati.' },
  { ja: '一緒なら、永遠も怖くありません。', tr: 'Kalau bersama, keabadian pun tidak menakutkan.' },
]

/** Her greeting on the home screen, by time of day, once the bond reaches level 2 and she is your companion. */
export function greetingFor(p?: Profile, hour = new Date().getHours()): Said | undefined {
  const r = p?.raiden
  if (p?.companionId !== 'raiden' || !r?.trial || bondLevel(r.bond) < 2) return
  const set = bondLevel(r.bond) >= 10 ? PROMISED : r.ei ? EI : SHOGUN
  return set[BY_HOUR(hour)]
}

/** Who your companion is right now: the Raiden Shogun becomes Ei once you have met her. */
export function companionVoice(p: Profile | undefined, c: { id: string; name: string; lines: Said[] }) {
  if (c.id === 'raiden' && p?.raiden?.ei) return { name: bondLevel(p.raiden.bond) >= 10 ? 'Ei · 影' : 'Ei', lines: [...EI_LINES, ...(bondLevel(p.raiden.bond) >= 10 ? PROMISED : [])] }
  return { name: c.name, lines: c.lines }
}
