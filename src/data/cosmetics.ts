import type { Region } from '../characters'
import type { IconName } from '../ui/Icon'

export const THEMES: { id: Region; name: string; vars: Record<string, string> }[] = [
  { id: 'mondstadt', name: 'Angin Mondstadt', vars: {} },
  { id: 'liyue', name: 'Pelabuhan Liyue', vars: { paper: '#fbf2df', 'paper-deep': '#efdcb5', torii: '#b8322a', anemo: '#b88a1e', geo: '#e0a526' } },
  { id: 'inazuma', name: 'Petir Inazuma', vars: { paper: '#f6f1f7', 'paper-deep': '#e4d8ea', torii: '#7a4fb0', anemo: '#4f7fb0', geo: '#e6b74a' } },
  { id: 'sumeru', name: 'Hutan Sumeru', vars: { paper: '#f2f6e8', 'paper-deep': '#dfe9c8', torii: '#c0562b', anemo: '#5f9a2c', geo: '#d9b13b' } },
  { id: 'fontaine', name: 'Air Fontaine', vars: { paper: '#eef5fa', 'paper-deep': '#d4e5f1', torii: '#2f6fb3', anemo: '#2fa3a8', geo: '#d8b04c' } },
  { id: 'natlan', name: 'Api Natlan', vars: { paper: '#fbf0e6', 'paper-deep': '#f1d9c3', torii: '#d9481f', anemo: '#2f9a7a', geo: '#f0a020' } },
]

export const OUTFITS: { id: string; name: string }[] = [
  { id: 'glasses', name: 'Kacamata Kutu Buku' },
  { id: 'scarf', name: 'Syal Musim Dingin' },
  { id: 'flowers', name: 'Mahkota Bunga Cecilia' },
  { id: 'headphones', name: 'Headphone Listening' },
  { id: 'hachimaki', name: 'Ikat Kepala Hachimaki' },
  { id: 'bow', name: 'Pita Festival' },
]

export const STICKERS: { id: string; ja: string; tr: string; color: string }[] = [
  { id: 'ganbatte', ja: 'がんばって！', tr: 'Semangat!', color: '#d1402f' },
  { id: 'sugoi', ja: 'すごい！', tr: 'Hebat!', color: '#3fae8f' },
  { id: 'yatta', ja: 'やった！', tr: 'Berhasil!', color: '#e0a526' },
  { id: 'otsukare', ja: 'おつかれ', tr: 'Kerja bagus', color: '#3d8fd6' },
  { id: 'donmai', ja: 'ドンマイ', tr: 'Tak apa-apa', color: '#9b6bd6' },
  { id: 'saikou', ja: '最高！', tr: 'Terbaik!', color: '#e0553a' },
  { id: 'naruhodo', ja: 'なるほど', tr: 'Oh, begitu', color: '#7fb23a' },
  { id: 'majide', ja: 'マジで？', tr: 'Serius?', color: '#e0553a' },
  { id: 'yabai', ja: 'やばい', tr: 'Gawat / keren banget', color: '#3b2a24' },
  { id: 'itadakimasu', ja: 'いただきます', tr: 'Selamat makan', color: '#c07a25' },
  { id: 'oyasumi', ja: 'おやすみ', tr: 'Selamat tidur', color: '#243466' },
  { id: 'arigatou', ja: 'ありがとう', tr: 'Terima kasih', color: '#3fae8f' },
]

/** Unlocked at friendship levels; each character gets two, by index. */
export const CULTURE_NOTES: string[] = [
  'いただきます diucapkan sebelum makan sebagai rasa terima kasih kepada semua yang membuat makanan itu ada.',
  'Orang Jepang jarang bilang "tidak" langsung. ちょっと… (agak…) dengan nada menggantung sering berarti "tidak bisa".',
  'やばい awalnya berarti "bahaya", tapi anak muda memakainya untuk "keren banget" juga. Lihat konteksnya!',
  'Di rumah Jepang, sepatu dilepas di genkan (pintu masuk). Sandal khusus toilet juga ada, jangan dipakai keluar!',
  'お疲れ様です (otsukaresama desu) dipakai sesama rekan kerja: arti harfiahnya "kamu sudah lelah", maksudnya "terima kasih atas kerja kerasnya".',
  'Akhiran さん aman untuk siapa saja. くん untuk anak laki-laki/junior, ちゃん untuk anak kecil atau teman akrab.',
  'Membungkuk (お辞儀) punya tingkat: 15° untuk salam biasa, 30° untuk hormat, 45° untuk minta maaf yang dalam.',
  'Di kereta Jepang, menelepon dianggap tidak sopan. Mode senyap disebut マナーモード (manner mode)!',
  'すみません bisa berarti "permisi", "maaf", sekaligus "terima kasih" (karena merepotkan). Kata serba guna!',
  'Anime sering memakai 俺 (ore) untuk "aku" yang maskulin. Dalam situasi resmi, pakailah わたし.',
  'Angka 4 (し) terdengar seperti 死 (mati) dan 9 (く) seperti 苦 (derita), jadi sering dihindari, misalnya untuk nomor kamar.',
  'Memberi tip di Jepang tidak umum, malah bisa membuat bingung. Pelayanan baik dianggap sudah termasuk.',
  'Membuang sumpit tegak di nasi mirip ritual pemakaman. Letakkan sumpit di はしおき (sandaran sumpit).',
  'Hanami (花見) adalah piknik melihat bunga sakura di musim semi, biasanya akhir Maret sampai awal April.',
  '草 (kusa, "rumput") di internet Jepang berarti tertawa, karena "www" mirip rumput!',
  'Sebelum masuk onsen, tubuh harus dibasuh dulu. Handuk tidak boleh masuk ke air.',
  'よろしくお願いします tidak punya padanan pas: "mohon bantuannya", "senang bekerja sama", "salam kenal" sekaligus.',
  'Tahun baru (お正月) adalah hari raya terbesar. Anak-anak menerima お年玉, amplop berisi uang.',
  'Konbini (コンビニ) buka 24 jam dan bisa dipakai untuk bayar tagihan, kirim paket, bahkan cetak dokumen.',
  'Kata 推し (oshi) berarti idola atau karakter favorit yang kamu dukung. 推し活 = aktivitas mendukung oshi.',
  'Saat menerima kartu nama (名刺), pegang dengan dua tangan dan baca sebentar. Jangan langsung dikantongi!',
  'ドンマイ berasal dari bahasa Inggris "don\'t mind": "tak apa, jangan dipikirkan".',
  'Jepang punya musim hujan (梅雨, tsuyu) di bulan Juni. Payung plastik transparan ada di mana-mana.',
  'Dalam bahasa Jepang, subjek sering dihilangkan. 行く？ cukup untuk "(kamu) mau pergi?"',
  'ね di akhir kalimat mencari persetujuan ("ya kan?"), sedangkan よ memberi informasi baru ("lho!").',
  'Festival musim panas (夏祭り) identik dengan yukata, kembang api (花火), dan jajanan seperti takoyaki.',
  'Kata 先輩 (senpai) dan 後輩 (kouhai) menunjukkan senior dan junior. Hierarki ini penting di sekolah dan kantor.',
  'Mengantre itu sakral di Jepang. Di stasiun bahkan ada garis tempat berdiri di peron.',
  'あけおめ adalah singkatan gaul dari あけましておめでとう (selamat tahun baru).',
  'Orang Jepang sering membawa oleh-oleh (お土産) untuk rekan kerja setelah bepergian, biasanya kue kemasan.',
]

export const BOSSES: { id: string; name: string; icon: IconName; color: string; taunt: string }[] = [
  { id: 'signora', name: 'Signora si Ratu Grammar', icon: 'cryo', color: '#7cc6de', taunt: 'Partikelmu berantakan, pengembara.' },
  { id: 'scaramouche', name: 'Scaramouche sang Penguasa Kanji', icon: 'electro', color: '#9b6bd6', taunt: 'Goresanmu terlalu lambat!' },
  { id: 'dottore', name: 'Dottore si Ilmuwan Kosakata', icon: 'mask', color: '#7fb23a', taunt: 'Eksperimen hari ini: seberapa banyak kata yang kamu ingat?' },
  { id: 'childe', name: 'Childe sang Petarung Partikel', icon: 'hydro', color: '#3d8fd6', taunt: 'Ayo bertarung! Tunjukkan hasil latihanmu!' },
]

export interface Stats {
  kana: number; kanji: number; vocab: number; grammar: number
  streak: number; ar: number; chars: number; maxFriend: number; pulls: number; bossWins: number; domainBest: number
}

export const ACHIEVEMENTS: { id: string; name: string; desc: string; check: (s: Stats) => boolean }[] = [
  { id: 'first-step', name: 'Langkah Pertama', desc: 'Pelajari item pertamamu', check: (s) => s.kana + s.kanji + s.vocab + s.grammar >= 1 },
  { id: 'hiragana', name: 'Ahli Hiragana', desc: 'Pelajari 46 kana', check: (s) => s.kana >= 46 },
  { id: 'all-kana', name: 'Penguasa Kana', desc: 'Pelajari semua 208 kana', check: (s) => s.kana >= 208 },
  { id: 'kanji-10', name: 'Kuas Pertama', desc: 'Pelajari 10 kanji', check: (s) => s.kanji >= 10 },
  { id: 'kanji-79', name: 'Kaligrafer N5', desc: 'Pelajari 79 kanji', check: (s) => s.kanji >= 79 },
  { id: 'vocab-100', name: 'Kamus Berjalan', desc: 'Pelajari 100 kosakata', check: (s) => s.vocab >= 100 },
  { id: 'grammar-10', name: 'Arsitek Kalimat', desc: 'Kuasai 10 pola grammar', check: (s) => s.grammar >= 10 },
  { id: 'streak-3', name: 'Mulai Terbiasa', desc: 'Streak 3 hari', check: (s) => s.streak >= 3 },
  { id: 'streak-7', name: 'Seminggu Penuh', desc: 'Streak 7 hari', check: (s) => s.streak >= 7 },
  { id: 'streak-30', name: 'Disiplin Samurai', desc: 'Streak 30 hari', check: (s) => s.streak >= 30 },
  { id: 'ar-5', name: 'Petualang', desc: 'Capai Adventure Rank 5', check: (s) => s.ar >= 5 },
  { id: 'ar-15', name: 'Petualang Veteran', desc: 'Capai Adventure Rank 15', check: (s) => s.ar >= 15 },
  { id: 'first-pull', name: 'Harapan di Langit', desc: 'Lakukan gacha pertama', check: (s) => s.pulls >= 1 },
  { id: 'chars-10', name: 'Kolektor', desc: 'Miliki 10 karakter', check: (s) => s.chars >= 10 },
  { id: 'friend-5', name: 'Sahabat Sejati', desc: 'Friendship level 5 dengan satu karakter', check: (s) => s.maxFriend >= 5 },
  { id: 'boss-1', name: 'Penakluk Harbinger', desc: 'Kalahkan Weekly Boss', check: (s) => s.bossWins >= 1 },
  { id: 'domain-20', name: 'Penjelajah Domain', desc: 'Capai lantai 20 di Domain Run', check: (s) => s.domainBest >= 20 },
]
export const ACHIEVEMENT_REWARD = 50
