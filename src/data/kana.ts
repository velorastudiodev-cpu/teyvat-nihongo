import { toHiragana, toKatakana } from 'wanakana'

export type Script = 'hiragana' | 'katakana'
export interface Kana { char: string; romaji: string; script: Script; group: string; mnemonic?: string }

// Lesson groups in teaching order; the romaji builds both scripts.
const GROUPS: [string, string[]][] = [
  ['a', ['a', 'i', 'u', 'e', 'o']], ['ka', ['ka', 'ki', 'ku', 'ke', 'ko']], ['sa', ['sa', 'shi', 'su', 'se', 'so']],
  ['ta', ['ta', 'chi', 'tsu', 'te', 'to']], ['na', ['na', 'ni', 'nu', 'ne', 'no']], ['ha', ['ha', 'hi', 'fu', 'he', 'ho']],
  ['ma', ['ma', 'mi', 'mu', 'me', 'mo']], ['ya', ['ya', 'yu', 'yo']], ['ra', ['ra', 'ri', 'ru', 're', 'ro']], ['wa', ['wa', 'wo', 'n']],
  ['dakuten 1', ['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo']],
  ['dakuten 2', ['da', 'di', 'du', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po']],
  ['yōon 1', ['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho', 'cha', 'chu', 'cho', 'nya', 'nyu', 'nyo']],
  ['yōon 2', ['hya', 'hyu', 'hyo', 'mya', 'myu', 'myo', 'rya', 'ryu', 'ryo']],
  ['yōon 3', ['gya', 'gyu', 'gyo', 'ja', 'ju', 'jo', 'bya', 'byu', 'byo', 'pya', 'pyu', 'pyo']],
]

// Hepburn display for the ぢ/づ rows (typed as di/du).
const DISPLAY: Record<string, string> = { di: 'ji', du: 'zu' }

const MNEMONIC: Record<Script, Record<string, string>> = {
  hiragana: {
    a: 'Pedang menusuk kain bundar: "Aaa!"', i: 'Dua ikan berenang sejajar: "i-kan"', u: 'Orang membungkuk memegang perut: "Uuh…"',
    e: 'Burung eksotis dengan ekor meliuk: "Eh?"', o: 'Mirip あ tapi ada bola kecil di kanan: "Oh, bolanya!"',
    ka: 'Kapak mengayun dengan percikan: "Ka!"', ki: 'Kunci dengan dua gerigi: "key"', ku: 'Paruh ayam: "kukuruyuk"',
    ke: 'Tiang di samping tong bir (keg)', ko: 'Dua cacing menggulung seperti koil',
    sa: 'Sendok dengan saus menetes ke bawah', shi: 'Kail pancing: "shhh, ikannya datang"', su: 'Sedotan melingkar di gelas: sruput "su"',
    se: 'Mulut terbuka lebar dengan dua gigi: "se-nyum"', so: 'Benang zigzag menjahit sol sepatu',
    ta: 'Huruf "t" dan "a" berdampingan', chi: 'Anak kecil (chibi) menoleh ke kanan', tsu: 'Satu gelombang tsunami',
    te: 'Tangan terulur (te = 手, tangan)', to: 'Jari kaki (toe) tertusuk duri',
    na: 'Salib dan pita: "nah!"', ni: 'Tiang + 二 (ni = dua)', nu: 'Mi keriting (noodle) dengan sumpit',
    ne: 'Kucing (neko) dengan ekor melingkar', no: 'Tanda larangan: "no!"',
    ha: 'Tiang dan orang tertawa: "haha"', hi: 'Senyum lebar: "hihi"', fu: 'Gunung Fuji yang diterpa angin',
    he: 'Bukit kecil: "heh, gampang didaki"', ho: 'Sinterklas dengan tiang: "ho-ho-ho"',
    ma: 'Mama dengan simpul rambut', mi: 'Mi yang dililit garpu', mu: 'Sapi melenguh: "muu"',
    me: 'Mata (目, me) dengan air mata', mo: 'Kail dengan dua umpan: ikan lebih banyak (more)',
    ya: 'Yak dengan tanduk', yu: 'Ikan berenang di kolam: "yuk!"', yo: 'Yo-yo yang tergantung pada tali',
    ra: 'Rapper dengan topi miring', ri: 'Dua alur sungai (river)', ru: 'Jalan berkelok berakhir lingkaran: rute (ru-te)',
    re: 'Pelari keluar garis: re-kor!', ro: 'Mirip る tanpa lingkaran: road yang belum selesai',
    wa: 'Mirip ね tanpa ekor: "wah, ekornya hilang!"', wo: 'Orang terpeleset: "wo-oh!" (dipakai sebagai partikel)', n: 'Seperti huruf "n" tulisan tangan',
  },
  katakana: {
    a: 'Kapak (axe) yang tajam', i: 'Mirip 亻 (orang) berdiri', u: 'Seperti う tapi bersudut, dengan topi',
    e: 'Lift (elevator) dari lantai bawah ke atas', o: 'Orang mengangkat tangan: "Oh!"',
    ka: 'か tanpa titik', ki: 'Kunci dengan dua gigi tegak', ku: 'Cakar tajam (kuku)', ke: 'Huruf K yang miring', ko: 'Sudut kotak (corner)',
    sa: 'Pedang (saber) dengan dua pegangan', shi: 'Wajah tersenyum, goresan miring dari bawah ke atas (bandingkan ツ)',
    su: 'Superman terbang menyamping', se: 'Mirip せ', so: 'Jarum menjahit dari atas ke bawah (bandingkan ン)',
    ta: 'Mirip た yang dipotong', chi: 'Cheerleader dengan tongkat', tsu: 'Tsunami dari atas: goresan turun (bandingkan シ)',
    te: 'Tiang telegram', to: 'Tiang totem dengan satu cabang',
    na: 'Salib miring', ni: '二 = dua garis', nu: 'Sumpit mengambil mi (noodle)', ne: 'Rumah kecil di sarang (nest)', no: 'Satu garis: "no!"',
    ha: 'Dua garis terbuka seperti tawa: "ha!"', hi: 'Hidung dilihat dari samping', fu: 'Kerudung (hood) yang menutupi',
    he: 'Sama persis dengan へ', ho: 'Salib suci (holy) dengan dua tetes',
    ma: 'Spatula mama', mi: 'Tiga garis: mi(ttsu) = tiga', mu: 'Hidung sapi: "muu"', me: 'Mata tersilang: X', mo: 'Rak dengan dua papan (more)',
    ya: 'Tanduk yak', yu: 'Huruf U terbalik: "you"', yo: 'Tiga kaki pose yoga',
    ra: 'Rapper bertopi', ri: 'Mirip り', ru: 'Dua akar (root)', re: 'Lengan yang menekuk', ro: 'Kotak penghalang jalan (road block)',
    wa: 'Mulut terbuka: "wah!"', wo: 'Jarang dipakai: partikel "o"', n: 'Goresan dari bawah ke atas (bandingkan ソ)',
  },
}

const build = (script: Script): Kana[] =>
  GROUPS.flatMap(([group, romajis]) => romajis.map((r) => ({
    char: script === 'hiragana' ? toHiragana(r) : toKatakana(r),
    romaji: DISPLAY[r] ?? r,
    script,
    group,
    mnemonic: MNEMONIC[script][r],
  })))

export const HIRAGANA = build('hiragana')
export const KATAKANA = build('katakana')
export const KANA = [...HIRAGANA, ...KATAKANA]
export const kanaId = (k: Kana) => `kana:${k.char}`
export const kanaById = new Map(KANA.map((k) => [kanaId(k), k]))
export const isBasic = (k: Kana) => !/dakuten|yōon/.test(k.group)

/** Accepts any romaji spelling wanakana understands (si/shi, tu/tsu, o for を…). */
export function romajiMatches(input: string, k: Kana) {
  const typed = input.trim().toLowerCase()
  if (!typed) return false
  const asKana = k.script === 'hiragana' ? toHiragana(typed) : toKatakana(typed)
  return asKana === k.char || typed === k.romaji || (k.romaji === 'wo' && typed === 'o')
}
