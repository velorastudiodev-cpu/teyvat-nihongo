import type { Element } from '../characters'
import type { IconName } from '../ui/Icon'

/*
 * Lore for the Fatui, the Five Sinners of Khaenri'ah and the Four Shades, summarised from community
 * lore write-ups (Archon Quest and character stories), and what each one does in this app. Japanese lines
 * are original to this app. Figures are shown as emblems, not portraits.
 */

export type Said = { ja: string; tr: string }

/* ── Fatui ─────────────────────────────────────────────────────────────────────────────────── */

export const FATUI = {
  about: 'Fatui adalah pasukan Snezhnaya yang melayani Tsaritsa, Archon Cryo. Mereka dipimpin sebelas Harbinger yang masing-masing punya motif sendiri; tujuan besarnya menantang tatanan Prinsip Langit (Celestia).',
}

export interface Duel { hp: number; lives: number; seconds?: number; twist: string; rule: 'foul-legacy' | 'equal-exchange' | 'recruit' | 'discipline' | 'segments' | 'honor' | 'jester'; reward: number }
export interface Harbinger {
  id: string; seat: string; name: string; alias: string; element?: Element
  status: 'aktif' | 'mantan' | 'gugur' | 'kosong'; fact: string
  duel?: Duel; taunt?: Said; defeat?: Said
}

/** Seat order; duels unlock from the Eleventh upward, ending with the Jester. */
export const HARBINGERS: Harbinger[] = [
  { id: 'tartaglia', seat: '11', name: 'Tartaglia', alias: 'Childe', element: 'hydro', status: 'aktif',
    fact: 'Jatuh ke celah Abyss saat kecil dan dilatih bertarung oleh Skirk, murid Surtalogi. Hidup untuk pertarungan.',
    duel: { hp: 260, lives: 3, rule: 'foul-legacy', twist: 'Foul Legacy: di bawah setengah HP, jawaban salah memakan 2 nyawa.', reward: 200 },
    taunt: { ja: 'さあ、勝負しようか！', tr: 'Ayo, kita bertarung!' }, defeat: { ja: 'はは、いい勝負だった！', tr: 'Haha, pertarungan yang bagus!' } },
  { id: 'tenth', seat: '10', name: '—', alias: 'Kursi kosong', status: 'kosong', fact: 'Belum ada informasi tentang kursi kesepuluh.' },
  { id: 'pantalone', seat: '9', name: 'Pantalone', alias: 'Regrator', status: 'aktif',
    fact: 'Mengurus perekonomian Snezhnaya dan terobsesi pada pertukaran setara.',
    duel: { hp: 280, lives: 3, rule: 'equal-exchange', twist: 'Pertukaran setara: benar +3 Kirameki, salah −5 Kirameki.', reward: 220 },
    taunt: { ja: 'すべては等価交換だ。', tr: 'Semuanya adalah pertukaran setara.' }, defeat: { ja: '……高くついたな。', tr: '…Mahal juga harganya.' } },
  { id: 'signora', seat: '8', name: 'La Signora', alias: 'Fair Lady', element: 'cryo', status: 'gugur',
    fact: 'Berasal dari Mondstadt dan pernah belajar di Sumeru. Kini hanya bergema sebagai Weekly Boss.' },
  { id: 'sandrone', seat: '7', name: 'Sandrone', alias: 'Marionette', status: 'gugur',
    fact: 'Ahli boneka mesin. Mengorbankan nyawanya saat berhadapan dengan Dottore.' },
  { id: 'scaramouche', seat: '6', name: 'Scaramouche', alias: 'Balladeer', element: 'electro', status: 'mantan',
    fact: 'Boneka prototipe ciptaan Raiden Shogun yang dibiarkan hidup. Kini tidak lagi bersama Fatui.' },
  { id: 'pulcinella', seat: '5', name: 'Pulcinella', alias: 'Rooster', status: 'aktif',
    fact: 'Wali kota ibu kota Snezhnaya, rajin merekrut orang-orang berbakat.',
    duel: { hp: 300, lives: 3, seconds: 10, rule: 'recruit', twist: 'Ujian rekrutmen: hanya 10 detik per soal.', reward: 250 },
    taunt: { ja: '君のような才能は、ぜひ欲しいね。', tr: 'Bakat sepertimu, sungguh ingin kumiliki.' }, defeat: { ja: '見事だ。ますます欲しくなった。', tr: 'Hebat. Aku makin menginginkanmu.' } },
  { id: 'arlecchino', seat: '4', name: 'Arlecchino', alias: 'Knave', element: 'pyro', status: 'aktif',
    fact: 'Memimpin House of the Hearth yang membesarkan anak-anak yatim menjadi agen. Anak-anaknya memanggilnya "Father".',
    duel: { hp: 340, lives: 2, rule: 'discipline', twist: 'Disiplin Hearth House: hanya 2 nyawa, tapi serangan ×1,2.', reward: 280 },
    taunt: { ja: '規律を守れない子は、いらない。', tr: 'Anak yang tak bisa menjaga disiplin, tak kubutuhkan.' }, defeat: { ja: '……よく育ったわね。', tr: '…Kau tumbuh dengan baik.' } },
  { id: 'columbina', seat: '3', name: 'Columbina', alias: 'Damselette', status: 'mantan',
    fact: 'Terungkap sebagai dewi Bulan Beku dan telah meninggalkan Fatui.' },
  { id: 'dottore', seat: '2', name: 'Il Dottore', alias: 'Doctor', status: 'aktif',
    fact: 'Ilmuwan yang bereksperimen pada manusia; pernah menobatkan dirinya dewa palsu di Nod-Krai. Punya banyak "segmen" dirinya.',
    duel: { hp: 360, lives: 3, rule: 'segments', twist: 'Segmen: saat HP habis pertama kali, ia bangkit lagi dengan 40% HP.', reward: 320 },
    taunt: { ja: '実験を始めよう。', tr: 'Mari mulai eksperimennya.' }, defeat: { ja: '興味深いデータだ。', tr: 'Data yang menarik.' } },
  { id: 'capitano', seat: '1', name: 'Il Capitano', alias: 'Captain', status: 'aktif',
    fact: 'Harbinger Pertama, dikenal karena kehormatannya di medan perang.',
    duel: { hp: 450, lives: 3, rule: 'honor', twist: 'Duel terhormat: tanpa batas waktu, tapi HP-nya sangat besar.', reward: 380 },
    taunt: { ja: '名誉ある戦いを。', tr: 'Mari bertarung dengan terhormat.' }, defeat: { ja: '見事だ。誇りに思え。', tr: 'Luar biasa. Banggalah.' } },
  { id: 'pierro', seat: 'Jester', name: 'Pierro', alias: 'Jester', status: 'aktif',
    fact: 'Pemimpin para Harbinger. Berasal dari Khaenri\'ah yang runtuh, menanggung kutukan keabadian dari Ronova, dan memberontak pada tatanan langit.',
    duel: { hp: 500, lives: 3, seconds: 12, rule: 'jester', twist: 'Sang Jester: 12 detik per soal, dan bangkit sekali dengan 30% HP.', reward: 500 },
    taunt: { ja: '天理に抗う覚悟はあるか。', tr: 'Apakah kau siap melawan Prinsip Langit?' }, defeat: { ja: '……その知恵、覚えておこう。', tr: '…Kebijaksanaan itu akan kuingat.' } },
]

export const LOAN = { amount: 300, xpToRepay: 300, days: 7, penalty: 400 }
export const OATH = { days: 7, xpPerDay: 20, reward: 500 }

/* ── The Five Sinners of Khaenri'ah and the Abyss ─────────────────────────────────────────── */

export const ABYSS = {
  about: 'Lima ratus tahun lalu Khaenri\'ah runtuh dalam Cataclysm. Lima tokoh terhormatnya, yang seharusnya menghentikan Raja Irmin, justru masing-masing merebut seperenam kekuatan penghancur dunia dari saudara Traveler, lalu dikenal sebagai Lima Pendosa. Di aplikasi ini, setiap Pendosa menyerap kekuatan Abyss dari satu jenis kelalaian belajar. Makin lama dibiarkan, makin dalam korupsinya.',
}

export type SinnerId = 'vedrfolnir' | 'hroptatyr' | 'rhinedottir' | 'surtalogi' | 'rerir'
export interface Sinner {
  id: SinnerId; name: string; title: string; attribute: string; icon: IconName; fact: string
  feeds: string; unit: string; thresholds: [number, number, number]; purify: { text: string; to: string }; voice: Said
}

export const SINNERS: Sinner[] = [
  { id: 'vedrfolnir', name: 'Vedrfolnir', title: 'Sang Visioner', attribute: 'Waktu', icon: 'hourglass',
    fact: 'Kakak Dainsleif dan penasihat Raja Irmin yang nubuatnya tak pernah salah. Dibutakan dan dipenjara, lalu tertarik ke Abyss; suaranya mendorong berdirinya Abyss Order.',
    feeds: 'kartu review yang terlambat', unit: 'kartu', thresholds: [15, 40, 80], purify: { text: 'Kerjakan review', to: '/review' },
    voice: { ja: '時は、待ってはくれない……', tr: 'Waktu tidak akan menunggumu…' } },
  { id: 'hroptatyr', name: 'Hroptatyr', title: 'Sang Bijak', attribute: 'Akal', icon: 'book',
    fact: 'Presiden Universitas Magistrorum dan Kepala Penyihir Kerajaan. Merebut seperenam kekuatan itu demi pengetahuan tanpa batas.',
    feeds: 'kesalahan yang belum dibalas', unit: 'kesalahan', thresholds: [10, 25, 50], purify: { text: 'Revenge Quest', to: '/revenge' },
    voice: { ja: '知恵なき者よ、その誤りを差し出せ。', tr: 'Wahai yang tak berilmu, serahkan kesalahanmu.' } },
  { id: 'rhinedottir', name: 'Rhinedottir', title: '"Gold"', attribute: 'Kehidupan', icon: 'sprout',
    fact: 'Alkemis Hexenzirkel penguasa Art of Khemia, pencipta Albedo, Durin, dan monster-monster Cataclysm. Kini menyatu dengan Naberius.',
    feeds: 'hari-hari tanpa belajar (7 hari terakhir)', unit: 'hari', thresholds: [2, 3, 5], purify: { text: 'Belajar hari ini', to: '/' },
    voice: { ja: '怠けた日々は、美しい素材になるわ。', tr: 'Hari-hari malasmu akan jadi bahan yang indah.' } },
  { id: 'surtalogi', name: 'Surtalogi', title: '"Foul"', attribute: 'Kehampaan', icon: 'spiral',
    fact: 'Lahir di penjara dan berlatih pedang bersama Dainsleif. Mengembara di luar Teyvat mencari lawan sepadan, lalu mengangkat Skirk sebagai murid.',
    feeds: 'hari tanpa materi baru (7 hari terakhir)', unit: 'hari', thresholds: [4, 6, 7], purify: { text: 'Pelajari materi baru', to: '/' },
    voice: { ja: '止まった者に、価値はない。', tr: 'Yang berhenti, tak ada nilainya.' } },
  { id: 'rerir', name: 'Rerir', title: 'Rächer of Solnari', attribute: 'Kematian', icon: 'crescent',
    fact: 'Agen rahasia Dinasti Gerhana yang memburu keturunan Dinasti Bulan Merah. Jatuh cinta pada targetnya, Tholindis, lalu berpaling ke Abyss untuk mencarinya.',
    feeds: 'kartu yang berkali-kali terlupa (lupa ≥3×)', unit: 'kartu', thresholds: [5, 15, 30], purify: { text: 'Buka Abyss Rift', to: '/abyss/rift/rerir' },
    voice: { ja: '忘れられたものは、俺が狩る。', tr: 'Yang terlupakan, akulah yang memburunya.' } },
]

/* ── The Four Shades and Celestia ─────────────────────────────────────────────────────────── */

export const CELESTIA = {
  about: 'Prinsip Langit (Heavenly Principles) turun ke Teyvat, mengalahkan para penguasa lama, lalu menempatkan Empat Bayangan untuk menjaga tatanan. Celestia, pulau melayang di langit, adalah takhta mereka. Di aplikasi ini, Empat Bayangan menjaga tatanan belajarmu: yang taat diberkati setiap minggu, yang melanggar akan didatangi Bayangan yang sesuai.',
}

export type ShadeId = 'ronova' | 'istaroth' | 'naberius' | 'asmoday'
export interface Shade {
  id: ShadeId; name: string; title: string; principle: string; icon: IconName; fact: string
  rule: string; punishment: { name: string; text: string }; blessing: { name: string; text: string }
  descend: Said; bless: Said
}

export const SHADES: Shade[] = [
  { id: 'ronova', name: 'Ronova', title: 'Bayangan Kematian', principle: 'Kematian', icon: 'crescent',
    fact: 'Penguasa kematian. Menetapkan aturan di Natlan dan menjatuhkan kutukan keabadian pada rakyat Khaenri\'ah.',
    rule: 'Jangan menebak asal: 5 jawaban salah beruntun, masing-masing kurang dari 1,5 detik.',
    punishment: { name: 'Kutukan Ronova', text: 'XP −50% selama 24 jam' }, blessing: { name: 'Ketenangan Ronova', text: 'XP +15% selama 7 hari' },
    descend: { ja: '偽りの答えに、命は宿らない。', tr: 'Jawaban palsu tidak memiliki kehidupan.' }, bless: { ja: '静かに学ぶ者に、安らぎを。', tr: 'Ketenangan bagi yang belajar dengan tekun.' } },
  { id: 'istaroth', name: 'Istaroth', title: 'Bayangan Waktu', principle: 'Waktu', icon: 'hourglass',
    fact: 'Penguasa waktu yang dipuja di Enkanomiya. Saat Cataclysm, ia mengalihkan perhatian saudara Traveler dari Khaenri\'ah.',
    rule: 'Jangan biarkan review menumpuk: ≥20 kartu terlambat lebih dari 3 hari.',
    punishment: { name: 'Waktu yang Membeku', text: 'Hadiah Kirameki −50% sampai tumpukannya di bawah 20' }, blessing: { name: 'Anugerah Waktu', text: '+1 Streak Freeze' },
    descend: { ja: '積もった時は、やがてあなたを埋める。', tr: 'Waktu yang menumpuk, kelak akan menguburmu.' }, bless: { ja: 'あなたの時に、少しの余白を。', tr: 'Sedikit ruang lega bagi waktumu.' } },
  { id: 'naberius', name: 'Naberius', title: 'Bayangan Kehidupan', principle: 'Kehidupan', icon: 'sprout',
    fact: 'Penguasa kehidupan. Menyatu dengan Rhinedottir, yang memakai kekuatannya untuk menciptakan kehidupan buatan.',
    rule: 'Jangan menjejalkan materi: materi baru sehari lebih dari 3× takaranmu (minimal 40).',
    punishment: { name: 'Batas Kehidupan', text: 'Pelajaran baru dikunci sampai besok; review tetap boleh' }, blessing: { name: 'Napas Kehidupan', text: 'Friendship ×2 selama 7 hari' },
    descend: { ja: '急ぎすぎた命は、根を張らない。', tr: 'Kehidupan yang terlalu terburu-buru tak akan berakar.' }, bless: { ja: '育つ命に、祝福を。', tr: 'Berkat bagi kehidupan yang tumbuh.' } },
  { id: 'asmoday', name: 'Asmoday', title: 'Bayangan Ruang', principle: 'Ruang', icon: 'compass',
    fact: 'Penguasa ruang, "Dewa Tak Dikenal" yang memisahkan si kembar Traveler di awal kisah.',
    rule: 'Jangan memutar balik waktu dan ruang: jam perangkat dimundurkan untuk mengakali streak.',
    punishment: { name: 'Pemisahan', text: 'Hadiah Kirameki ×0 dan berkat dicabut selama 3 hari' }, blessing: { name: 'Ruang Lapang', text: 'Kirameki +20% selama 7 hari' },
    descend: { ja: '天理の秩序を乱す者よ、引き離されよ。', tr: 'Wahai pengacau tatanan Prinsip Langit, terpisahlah.' }, bless: { ja: '広き空間を、あなたに。', tr: 'Ruang yang lapang untukmu.' } },
]

export const BLESS_MIN_DAYS = 5    // study days in the last 7 to earn the weekly blessing

/* ── Nod-Krai, Snezhnaya and the Tsaritsa ─────────────────────────────────────────────────── */

export const NODKRAI = {
  about: 'Wilayah otonom di ujung selatan Snezhnaya. Di sini mengalir kuuvahki, energi kutub biru dan merah yang lebih tua dari tujuh elemen. Frostmoon Scions memuja Kuutar, Dewi Bulan, di Pulau Hiisi; Nasha Town menjadi pusat kota; para Lightkeeper menjaga mercusuar; dan Fatui menjalankan biro eksperimen kuuvahki di Pulau Paha.',
}

export const SNEZHNAYA = {
  about: 'Negeri ketujuh, di utara jauh Teyvat: padang salju, benteng pegunungan, dan rel kereta yang menghubungkan kota-kota yang berjauhan. Ibu kotanya Snezhnograd di Everfrozen Earth, pusat Tsaritsa dan Fatui. Dibuka di Versi 7.0 (12 Agustus 2026).',
}

export const TSARITSA = {
  name: 'Tsaritsa', fullName: 'Anastasya Feodorovna Snezhnaya', title: 'Archon Cryo · Dewi Cinta',
  fact: 'Archon Cryo kedua yang memimpin Snezhnaya. Ia mendirikan Fatui, mengumpulkan Gnosis untuk melawan Prinsip Langit, dan memberi para Harbinger kebebasan mengejar makna keberadaan mereka.',
}

/** The audience with the Tsaritsa at the journey's end. */
export const AUDIENCE = {
  open: [
    { ja: 'よく 来{き}ましたね、 旅人{たびびと}。', tr: 'Kau datang juga, pengembara.' },
    { ja: '私{わたし}は この 国{くに}を 愛{あい}して います。 だからこそ、 天理{てんり}に 抗{あらが}うのです。', tr: 'Aku mencintai negeri ini. Justru karena itulah aku melawan Prinsip Langit.' },
  ] as Said[],
  ask: { ja: 'あなたは、 なぜ 言葉{ことば}を 学{まな}ぶのですか。', tr: 'Mengapa kau mempelajari bahasa?' } as Said,
  options: [
    { ja: '人{ひと}と つながる ためです。', tr: 'Untuk terhubung dengan orang lain.', reply: { ja: '……愛{あい}の ためですね。 それは、 私{わたし}の 心{こころ}と 同{おな}じです。', tr: '…Demi cinta, ya. Sama seperti hatiku.' } },
    { ja: '新{あたら}しい 世界{せかい}を 知{し}る ためです。', tr: 'Untuk mengenal dunia baru.', reply: { ja: '知{し}る ことは、 自由{じゆう}への 第一歩{だいいっぽ}です。', tr: 'Mengetahui adalah langkah pertama menuju kebebasan.' } },
    { ja: '夢{ゆめ}を かなえる ためです。', tr: 'Untuk mewujudkan mimpi.', reply: { ja: '夢{ゆめ}を 持{も}つ 者{もの}は、 凍{こご}えません。', tr: 'Mereka yang punya mimpi tak akan membeku.' } },
  ],
  close: [
    { ja: 'あなたの 努力{どりょく}に、 敬意{けいい}を。 この 国{くに}の 冬{ふゆ}も、 あなたを 歓迎{かんげい}します。', tr: 'Hormatku atas usahamu. Musim dingin negeri ini pun menyambutmu.' },
  ] as Said[],
  reward: 800,
  title: 'Tamu Istana Snezhnograd',
}

/* ── The Hexenzirkel ─────────────────────────────────────────────────────────────────────── */

export const HEXENZIRKEL = {
  about: 'Perkumpulan rahasia para penyihir yang sesekali berkumpul untuk pesta teh. Saat kamu buntu, datanglah: tiap penyihir menolong dengan caranya sendiri.',
}

export type WitchId = 'alice' | 'nicole' | 'barbeloth' | 'andersdotter' | 'rhinedottir'
export interface Witch { id: WitchId; name: string; code: string; icon: IconName; color: string; fact: string; help: string; greet: Said }

export const WITCHES: Witch[] = [
  { id: 'alice', name: 'Alice', code: 'A', icon: 'compass', color: '#d1402f',
    fact: 'Pendiri dan tetua Hexenzirkel, penulis Teyvat Travel Guide, petualang, dan ibu Klee.',
    help: 'Panduan perjalanan: membaca catatan belajarmu dan menyusun rencana yang paling dibutuhkan sekarang.',
    greet: { ja: 'あら、迷子？ 地図を一緒に見ましょう。', tr: 'Wah, tersesat? Ayo lihat petanya bersama.' } },
  { id: 'nicole', name: 'Nicole Reeyn', code: 'N', icon: 'eye', color: '#7a52c4',
    fact: 'Disebut nabi yang mampu melihat rancangan besar masa depan Teyvat.',
    help: 'Ramalan: melihat kartu mana yang akan kamu lupakan berikutnya, lalu me-review-nya lebih dulu.',
    greet: { ja: 'あなたが次に忘れる言葉、見えていますよ。', tr: 'Kata yang akan kau lupakan berikutnya, sudah terlihat olehku.' } },
  { id: 'barbeloth', name: 'Barbeloth', code: 'B', icon: 'star', color: '#2f5fa8',
    fact: 'Astromancer, guru Mona dalam ilmu bintang.',
    help: 'Peta bintang kesalahan: menemukan pasangan jawaban yang sering tertukar, lalu melatih keduanya.',
    greet: { ja: '星を読むように、間違いの形を読みましょう。', tr: 'Seperti membaca bintang, mari membaca pola kesalahanmu.' } },
  { id: 'andersdotter', name: 'Andersdotter', code: 'M', icon: 'scroll', color: '#3f8f4a',
    fact: 'Penulis dongeng, dikenal lewat kisah "The Boar Princess".',
    help: 'Dongeng pengingat: mengubah kanji yang paling sulit kamu ingat menjadi cerita kecil dari bagian-bagiannya.',
    greet: { ja: '覚えにくい字には、お話をつけてあげましょう。', tr: 'Huruf yang sulit diingat, mari kita beri sebuah cerita.' } },
  { id: 'rhinedottir', name: 'Rhinedottir', code: 'R', icon: 'sprout', color: '#a8843e',
    fact: 'Alkemis "Gold", penguasa Art of Khemia, juga salah satu Lima Pendosa.',
    help: 'Transmutasi: kartu yang berkali-kali terlupa dilebur dan dipelajari ulang dari awal sebagai kartu baru.',
    greet: { ja: '壊れたものは、作り直せばいいのよ。', tr: 'Yang rusak, cukup dibuat ulang.' } },
]
