# Changelog

## M0 — Fondasi
- Vite + React + TypeScript, Tailwind v4, Framer Motion, React Router, Dexie (IndexedDB), ts-fsrs, Vitest.
- `src/data/characters.json`: 34 karakter (Mondstadt → Natlan) dengan buff, voice line (ja + terjemahan), dan slot aset 4 ekspresi.
- 5 chibi Mondstadt digambar sendiri sebagai SVG (Paimon, Klee, Venti, Amber, Diluc): idle, happy, sad/encourage, sleep, plus animasi kedip, napas, lompat, melayang, dan tidur.
- Schema Dexie v1: `profile`, `items` (kartu SRS), `reviews`, `mistakes`, `owned`, `days`. Saat pertama dibuka, Paimon jadi companion dan 5 karakter starter langsung dimiliki.

### Improvisasi
- **Aset pluggable tanpa konfigurasi:** `<Chibi>` mencoba `public/chibi/<id>/<ekspresi>.svg` dulu, lalu otomatis kembali ke SVG bawaan. Karakter yang belum digambar tampil sebagai siluet "?" berwarna elemen, sehingga terasa seperti koleksi yang belum terbuka.
- **Companion hidup dari M0:** chibi tertidur setelah 45 detik idle, dan kalau di-tap ia senang sambil mengucapkan voice line lewat TTS ja-JP. Voice line di halaman karakter juga bisa diputar.
- **Belum dipakai:** Zustand. Sejauh ini `useLiveQuery` dari Dexie sudah cukup untuk state; Zustand ditambahkan kalau nanti memang dibutuhkan.
- **Folder** `engine/`, `modules/`, dan `games/` dibuat di milestone yang memakainya, bukan sebagai folder kosong.

## Upload chibi sendiri
- Di halaman Karakter, setiap ekspresi punya tombol **Upload / Ganti / Reset**. Gambar disimpan di IndexedDB (tabel `art`, Dexie v2), jadi tetap ada setelah reload dan tanpa menyalin file ke folder proyek.
- Urutan sumber gambar: upload ekspresi itu → upload *Santai* → file `public/chibi/<id>/` → SVG bawaan → siluet. Satu gambar *Santai* sudah cukup untuk semua ekspresi. Gambar upload tetap mendapat animasi (lompat, napas, tidur) dan emoji suasana (✨ 💧 💤).
- Karakter yang belum digambar bisa dijadikan companion setelah diberi gambar.

## M1 — Onboarding, Placement Test, Skill Map, Pace Engine
- **Onboarding:** target N4–N1, menit per hari, dan target tanggal (opsional). Ada tombol "Aku masih nol" untuk langsung mulai dari hiragana.
- **Placement Test adaptif** (`engine/placement`): 4 soal per tahap (hiragana → katakana → N5 … → target). Lulus kalau benar 3–4, gagal kalau benar 0–1, dan benar 2 memicu 2 soal tambahan. Penempatan = tahap pertama yang belum lulus. Tes tidak pernah melewati target. Tersedia tombol "Tidak tahu" supaya hasil tidak tercemar tebakan.
- **Skill Map:** region terbuka bertahap. Tahap yang dilewati lewat placement ditandai, tahap berikutnya terkunci, dan node Gate Exam disiapkan untuk M7. N1 dibagi dua: Fontaine bagian 1 dan Natlan bagian 2.
- **Pace Engine** (`engine/pace`):
  - Kapasitas = menit ÷ 1,6 menit per item baru (sudah termasuk review di masa depan).
  - Kalau ada target tanggal dan user tertinggal, beban dinaikkan maksimal +25%.
  - Kalau akurasi < 80% (dari minimal 20 review), materi baru direm ×0,7, atau ×0,5 kalau akurasi < 70%.
  - Ada dua proyeksi: berdasarkan rencana dan berdasarkan performa 7 hari terakhir.
- `curriculum.ts`: jumlah item per tahap (perkiraan kumulatif N1 ≈ 2.000 kanji dan 10.000 kata).

## M2 — Modul Kana, SRS, Kana Rain, Memory Match
- **Data kana** (`data/kana.ts`): 46+46 kana dasar dengan mnemonic berbahasa Indonesia, ditambah dakuten/handakuten (25+25) dan yōon (33+33), total 208. Semuanya dibangun dari romaji lewat `wanakana`, jadi tidak ada tabel yang diketik manual.
- **Pengecekan romaji** menerima ejaan alternatif (si/shi, tu/tsu, hu/fu, o untuk を, nn untuk ん).
- **SRS** (`engine/srs`, ts-fsrs): salah → Again, lambat (> 6 detik) → Hard, selain itu → Good. Setiap jawaban salah masuk Mistake Journal. Statistik harian (`days`) mengalir ke Pace Engine.
- **Pelajaran:** maksimal 5 kana per pelajaran dari grup yang sama → kartu kana + mnemonic + audio → kuis singkat (jawaban salah diulang di akhir) → masuk SRS. Menyelesaikan hiragana otomatis membuka katakana, lalu N5. Perpindahan region tetap menunggu Gate Exam.
- **Review:** 4 jenis soal acak (baca, pilih kana, ketik romaji, dengar lalu pilih). Pengecoh selalu dari tier yang sama supaya jawaban tidak bisa ditebak dari bentuk.
- **Kana Rain:** mode Daily (30 kana dari materi yang sudah dipelajari, kana jatuh tempo dihitung sebagai review SRS) dan Endless (hiragana, katakana, atau semua; makin lama makin cepat). Ada combo, 3 nyawa, high score, dan buff Klee ×1.2 kalau Klee jadi companion.
- **Memory Match:** Daily (1 papan, 6 pasang) dan Endless (pasangan sebanyak mungkin dalam 90 detik). Romaji di satu papan selalu unik.
- **Feedback** setiap jawaban: SFX WebAudio (tanpa file audio), goyang/pop dari Framer Motion, dan ekspresi companion.
- **Ditunda ke M3:** latihan menulis di canvas dengan urutan goresan. Fitur ini butuh data KanjiVG yang memang masuk M3, jadi kana dan kanji akan memakai sistem yang sama. っ kecil juga diajarkan di M3/M4 bersama kosakata, karena tidak punya bunyi romaji sendiri.

## M3 — Kanji & kosakata N5–N4, Stroke Duel, Radical Forge
- **Data** (`scripts/build_kanji_data.py`, hasil di `src/data/*.json`): 245 kanji N5–N4 dari KANJIDIC2 (on/kun, jumlah goresan), 1.373 kosakata N5–N4 (open-anki-jlpt-decks, MIT), serta urutan goresan dan komponen dari KanjiVG untuk 245 kanji + 144 kana. Field WaniKani di dataset sengaja tidak dipakai karena berhak cipta. Atribusi CC BY-SA ada di footer.
- **Arti kanji ditulis ulang dalam bahasa Indonesia** (245 arti). Arti kosakata masih berbahasa Inggris dari sumbernya; terjemahan Indonesia dicicil di M8.
- **Validasi goresan** (`engine/stroke`): setiap goresan di-resample ke 24 titik lalu dibandingkan dengan KanjiVG. Kesalahan dibedakan jadi bentuk/posisi, arah terbalik, atau urutan salah. Goresan yang benar menempel ke bentuk model; yang salah menampilkan goresan yang seharusnya. Titik-titik dihitung di skrip build, jadi logikanya bisa diuji dengan Vitest.
- **Data goresan (650 KB) dimuat terpisah** hanya saat dibutuhkan, sehingga bundle utama tetap kecil.
- **Pelajaran kanji:** animasi urutan goresan bernomor, arti, ON/KUN, komponen, 3 contoh kata ber-audio → latihan menulis dengan panduan → kuis arti/bacaan → masuk SRS.
- **Pelajaran kosakata:** kartu bisa digeser (swipe). Kata yang kanjinya sudah kamu kuasai diajarkan lebih dulu. Kuisnya arti + dengar lalu pilih.
- **Review sekarang mencakup kanji** (arti, bacaan, menulis tanpa panduan) **dan kosakata** (arti, dengar, ketik bacaan). Bacaan bisa diketik dalam romaji atau kana: Hepburn "tch", makron (ō), dan katakana diterima.
- **Latihan menulis** `/write/:char` untuk kana maupun kanji, dengan atau tanpa panduan (menutup hutang M2). Bisa dibuka dari tile kanji, kartu pelajaran kana, atau klik ganda tile kana.
- **Stroke Duel:** tulis kanji sebelum chibi lawan selesai (1,8 detik per goresan + 3 detik; Raiden +5 detik). Mode Daily 5 kanji, Endless 3 nyawa. Hasilnya dihitung sebagai review SRS kalau kanjinya jatuh tempo.
- **Radical Forge:** pilih komponen dan tempa kanji yang diminta (20 detik; Tighnari +5 detik). Kanji yang komponennya hanya goresan tunggal (九 = 丿 + 乙) dikecualikan, sehingga tersisa 169 kanji.
- **Level terkunci:** N5 terbuka setelah kana selesai atau lewat placement; N4 terbuka setelah Gate Exam (M7).
- **Jumlah item N5/N4 di Pace Engine** sekarang memakai jumlah data asli.

## M4 — Grammar, Reading, Listening, Particle Shooter, Sentence Builder, Fill-Blank Rush
- **Konten ditulis sendiri dalam bahasa Indonesia** (tidak ada dataset terbuka yang cocok):
  - 30 pola grammar (20 N5, 10 N4), masing-masing dengan kartu konsep (maksimal 3 kalimat) dan 3–4 kalimat contoh.
  - 8 bacaan bertingkat (6 N5, 2 N4) dengan glosarium dan 3 soal pemahaman.
  - Konsistensinya dicek otomatis oleh test: satu token kunci per kalimat, dan setiap entri glosarium cocok dengan token yang bisa di-tap.
- **Markup kalimat** (`engine/sentence.ts`): `学生{がくせい}` untuk furigana (okurigana dipisah otomatis), `*` untuk token kunci. Dari satu sumber ini didapat teks, bacaan kana, furigana, bagian kosong, dan blok kata.
- **Furigana 3 mode:** semua, **otomatis** (furigana hilang untuk kanji yang stabilitas SRS-nya ≥ 7 hari; improvisasi #3 PRD), dan mati. Pilihan disimpan per browser.
- **Grammar:** kartu konsep + contoh ber-audio → 5 latihan (bergantian menyusun kalimat dan mengisi bagian kosong; jawaban salah diulang) → masuk SRS. Review SRS sekarang mencakup grammar.
- **Reading:** tap kata untuk melihat arti (dari glosarium → kamus kosakata → arti kanji), 🔊 per baris atau seluruh teks, kuis pemahaman. Skor terbaik disimpan, dan XP masuk ke log harian.
- **Listening:** kecepatan TTS 0,75×/1×/1,25× (disimpan) plus tombol 🐢 lambat. Kuis 8 soal: dengar lalu pilih arti, dan dikte. Dikte menerima kana atau romaji, mengabaikan spasi dan tanda baca, serta menerima ejaan bunyi は/へ/を ("wa", "e", "o").
- **Game baru:**
  - **Particle Shooter:** partikel melayang, tembak yang benar, 8 detik per kalimat, buff Yoimiya ×1,2.
  - **Sentence Builder:** Daily 5 kalimat, Endless time attack 120 detik.
  - **Fill-Blank Rush:** 60 detik; combo menaikkan multiplier sampai ×3 (buff Keqing ×1,2), salah = −3 detik.
  - **Listening Echo:** dengar lalu pilih kalimat Jepang yang cocok, 12 detik, 3 nyawa. Ini game untuk modul Listening.
  - Semua game mencatat review SRS untuk pola yang jatuh tempo.
- **Navigasi diringkas** jadi Beranda, Belajar, Main, Review, Peta, Karakter. Ada hub **Belajar** (6 modul) dan hub **Main** (8 game + rekor).
- **Pemetaan modul → game + kuis:**

  | Modul | Game | Kuis |
  |---|---|---|
  | Grammar | Particle Shooter, Sentence Builder | 5 latihan per pola |
  | Reading | Fill-Blank Rush | kuis pemahaman |
  | Listening | Listening Echo | kuis dengar + dikte |

- **Batasan:** Sentence Builder hanya menerima urutan kata kanonik. Bahasa Jepang kadang mengizinkan urutan lain (misalnya posisi kata waktu), jadi kalimat latihannya sengaja dipilih yang urutannya cukup baku.

## M5 — Fitur suara: Voice Fill, Speed Speak, Shadowing, Kanji Read-Aloud
- **Pengenalan suara:** Web Speech API `ja-JP` dengan 5 alternatif hasil, lewat `ui/useSpeech.ts`.
  - Mode sekali-dengar untuk Voice Fill, Shadowing, dan Read-Aloud.
  - Mode kontinu yang menyala ulang otomatis untuk Speed Speak.
  - Pesan error dalam bahasa Indonesia untuk izin mikrofon ditolak, tidak ada suara, mikrofon tidak ditemukan, dan jaringan.
- **Improvisasi: tanpa kuroshiro/kuromoji.** Kamus kuromoji sekitar 17 MB harus diunduh dulu, bertentangan dengan target offline (M7), dan memperlambat awal sesi. Gantinya, `engine/voice/match.ts` mengubah transkrip ke kana memakai:
  - bacaan kalimat target itu sendiri,
  - kamus 1.373 kosakata,
  - angka Arab → kanji (7時 → 七時),
  - bacaan kanji tunggal sebagai cadangan.

  Hasilnya instan, offline, dan bisa diuji Vitest.
- **Pencocokan berbasis mora** (きょ = 1 mora; っ, ー, dan ん dihitung). Edit distance dengan backtrace dipakai untuk menyorot bagian yang meleset.
  - Toleransi ±1 mora untuk kata ≥ 3 mora (≥ 4 mora kalau dicari di tengah ucapan, supaya きます tidak cocok dengan ちがいます). Kata pendek harus persis.
  - Semua alternatif dari recognizer dicoba, dan yang terbaik dipakai.
- **Voice Fill (game):** kalimat dengan 1–3 bagian kosong (selalu termasuk token kunci grammar). Boleh mengucapkan kalimat lengkap atau hanya kata yang hilang; tiap bagian dinilai ✓/✗ dan ditampilkan apa yang terdengar. Mode Daily 8 kalimat, Endless 3 nyawa. Hasilnya mencatat review SRS grammar.
- **Speed Speak (game):** kata muncul satu per satu dengan 5 detik per kata (Xiao +1 detik, combo Kinich ×1,2), dan mikrofon menyala terus selama permainan. Mode Daily 15 kata, Endless 3 nyawa. Mencatat review SRS kosakata.
- **Shadowing:** dengar (0,75×/1×/1,25× atau 🐢) → tirukan → skor 0–100% → token yang meleset digarisbawahi merah. Bahan dari kalimat grammar dan bacaan.
- **Kanji Read-Aloud:** kata berkanji tanpa furigana, diutamakan yang kanjinya sudah kamu pelajari. Mencatat review SRS kalau kata itu jatuh tempo.
- **Fallback ketik:** kalau API suara tidak ada atau izin mikrofon ditolak, semua latihan memakai input ketik yang langsung mengubah romaji jadi kana. Ada juga tombol "Ketik saja / Pakai suara", dan pilihannya disimpan.
- **Hub Speaking** di menu Belajar menampilkan status dukungan browser. Voice Fill dan Speed Speak masuk hub Main.
- **Pengujian:** uji end-to-end memakai recognizer tiruan untuk memeriksa alur Voice Fill, Speed Speak, Shadowing, Read-Aloud, dan fallback. Akurasi pengenalan suara sungguhan perlu dicoba manual di Chrome/Edge dengan mikrofon.

## M6 — Gamifikasi: siklus harian lengkap
- **Aturan permainan** (`engine/game/rules.ts`) adalah fungsi murni dan diuji. Logika yang memakai DB (`economy.ts`, `gacha.ts`, `stats.ts`) diuji dengan fake-indexeddb.
- **Daily Commissions:** 4 per hari. "Review 30 kartu" selalu ada; 3 lainnya dipilih acak dari 9 templat dengan seed tanggal (Fisher–Yates, jadi stabil seharian). Target "item baru" mengikuti Pace Engine.
  - Progres dihitung dari log harian yang sudah ada (review, jawaban benar, item baru, XP, game yang dimainkan), jadi tidak perlu sistem event terpisah.
  - Hadiah ✦ 40 per commission + ✦ 80 bonus kalau keempatnya selesai.
- **Kirameki ✦:** saldo awal 160. Sumbernya commission, Weekly Boss (300/minggu), Domain Run (≤ 100, untuk 3 run pertama tiap hari), Revenge Quest (10 per kesalahan + bonus 50), dan achievement (50). Buff Furina ×1,1. Saldo tampil di header.
- **Gacha** (tanpa uang asli), 100 ✦ per tarikan:
  - 5★ karakter 8%, dengan pity keras di 10 tarikan.
  - Banner berganti tiap minggu; karakter unggulan dapat 50% dari hasil 5★, dan karakter yang sudah digambar diprioritaskan.
  - 4★: 5 tema UI + 6 aksesori companion. 3★: 12 stiker frasa Jepang.
  - Duplikat dikembalikan sebagai ✦ (60/20/5).
- **Tema UI per region** (Liyue, Inazuma, Sumeru, Fontaine, Natlan) mengganti token warna di `:root`. **Aksesori** (kacamata, syal, mahkota bunga, headphone, hachimaki, pita) berupa overlay SVG, dan juga tampil di atas gambar upload.
- **Friendship:** XP yang didapat saat sebuah karakter jadi companion menambah friendship karakter itu (10 level).
  - Voice line ke-2 terbuka di Lv 3, Culture Note di Lv 5 dan Lv 7. Ada 30 Culture Note budaya/slang Jepang yang ditulis dalam bahasa Indonesia.
  - Karakter yang belum dimiliki tampil abu-abu dengan 🔒 dan tidak bisa dijadikan companion.
- **Streak + Streak Freeze:** 1 Freeze gratis per minggu (Jean +1), maksimal 3, bisa dibeli seharga 200 ✦. Saat aplikasi dibuka, hari yang terlewat otomatis ditambal kalau Freeze cukup; di kalender, hari itu ditandai biru.
- **Adventure Rank** dari total XP (AR = ⌊√(XP/40)⌋ + 1, maksimal 60). Ada 17 achievement yang dicek otomatis setiap kali progres berubah, dengan notifikasi toast. Halaman **Profil** memuat AR, heatmap 16 minggu, dan daftar achievement.
- **Weekly Boss:** satu dari 4 "Harbinger" bergantian tiap minggu (avatar emoji, bukan art resmi). Soalnya campuran dari materi minggu ini. Jawaban benar memberi damage (lebih cepat = lebih besar, buff Cyno ×1,15); jawaban salah mengurangi nyawa (buff Mavuika +1).
- **Domain Run:** roguelite tanpa akhir dengan soal campuran.
  - Waktu per soal menyusut dari 15 ke 6 detik, dan setelah lantai 10 soal diambil dari item yang paling lemah.
  - Setiap 5 lantai kamu memilih 1 dari 3 berkah (nyawa, perisai, skor ×1,5, waktu).
  - Buff karakter yang berlaku: Zhongli +1 nyawa, Barbara pulih setiap 10 lantai, Diluc perisai awal, Navia skor ×1,1.
- **Revenge Quest** (improvisasi #2 PRD): item dari Mistake Journal muncul lagi; kalau dijawab benar, kesalahannya ditandai selesai dan hadiahnya ✦ 2×.
- **`ItemQuestion`:** satu komponen soal untuk semua jenis item SRS, dipakai Review, Boss, Domain, dan Revenge. Setiap jawaban tercatat ke SRS dan Mistake Journal.
- **Companion di pojok layar** (layar ≥ 1280 px): tertidur kalau aplikasi dibiarkan idle, dan menyapa sambil mengucapkan voice line kalau di-tap. Disembunyikan di halaman yang sudah menampilkan companion bereaksi.
- **7 chibi Liyue digambar:** Zhongli, Xiangling (dengan Guoba), Hu Tao (topi + jimat), Xiao, Ganyu (tanduk), Keqing (sanggul), Qiqi (jimat di dahi). Total sekarang 12/34. Bagian tubuh bersama dipindah ke `characters/parts.tsx`.
- **Navigasi baru:** Harian, Belajar, Main, Review, Gacha, Karakter, Profil, ditambah saldo ✦. Beranda menampilkan ringkasan commission dan streak.
- **Buff yang sudah aktif:** Klee, Zhongli, Barbara, Diluc, Navia, Raiden, Tighnari, Yoimiya, Keqing, Xiao, Kinich, Cyno, Mavuika, Furina, Jean. Buff lainnya (petunjuk, replay, analisis, dsb.) masih berupa deskripsi dan menyusul bersama fitur terkait di M7/M8.

## M7 — JLPT Mock Test, Gate Exam, Insight Dashboard, PWA offline, export/import
- **Generator ujian** (`engine/exam`): soal dibangun dari konten yang ada, mengikuti format resmi JLPT. Hasilnya bisa diulang dari seed yang sama, dan setiap soal punya 4 pilihan unik (diuji).
  - **文字・語彙:** bacaan kata berkanji, penulisan kanji, arti kanji.
  - **文法・読解:** isian grammar （　）, 並べ替え (pilih susunan kalimat yang benar), dan pemahaman bacaan (teks ditampilkan di atas soal).
  - **聴解:** audio TTS, putar ulang maksimal 2×, teksnya tidak ditampilkan.
- **Mock Test:** 29 soal dengan timer per bagian (8/14/8 menit) dan navigasi soal + tanda 🚩. Tidak ada umpan balik sampai ujian selesai, seperti JLPT asli. Lulus kalau total ≥ 55% dan tiap bagian ≥ 33% (meniru aturan JLPT).
  - Laporannya memuat skor per bagian, **analisis kelemahan per skill** (yang < 60% diberi tautan "Latih →" ke modul terkait), dan pembahasan semua jawaban salah.
  - Item yang salah otomatis masuk Mistake Journal untuk Revenge Quest. Riwayat ujian disimpan di tabel `exams` (Dexie v5).
- **Gate Exam (Boss Region):** 16 soal / 15 menit, lulus ≥ 70%. Hanya terbuka di tahap terakhir sebuah region (Mondstadt di N5, Liyue di N4, dst.).
  - Lulus → tahap naik ke region berikutnya, ✦ 500 (sekali), dan sensei region itu bergabung (Liyue → Zhongli, Inazuma → Raiden, Sumeru → Nahida, Fontaine → Furina, Natlan → Mavuika).
  - Di Skill Map, node Gate jadi tombol, lalu berubah menjadi "✓ Gate lulus".
  - **Batasan:** konten ujian baru tersedia sampai N4, jadi Gate Inazuma ke atas sementara memakai soal N4 sampai data N3–N1 masuk di M8.
- **Insight Dashboard:**
  - Ringkasan angka: item dipelajari, akurasi 30 hari, jatuh tempo, kartu matang.
  - Grafik akurasi per skill (bar horizontal satu warna, dengan label nilai).
  - Grafik review per hari selama 14 hari (kolom, tooltip saat disorot, dan tabel).
  - Item yang paling sering dilupakan (lapses SRS + Mistake Journal), proyeksi target (Pace Engine), mock test terbaik, dan riwayat ujian.
- **PWA offline** (`vite-plugin-pwa`): manifest dengan ikon 192/512/maskable, dan service worker yang mem-precache semua aset (1,65 MB, termasuk data goresan KanjiVG). Google Fonts dan `/chibi/` di-cache saat dipakai.
  - Uji di build produksi: setelah sekali online, 7 halaman (termasuk latihan menulis) terbuka tanpa jaringan, dan satu pelajaran bisa diselesaikan offline.
  - **Butuh internet:** pengenalan suara Chrome (M5). TTS memakai suara bawaan perangkat.
- **Pengingat dari companion** (improvisasi #5): notifikasi sekali sehari setelah jam pilihan kalau hari itu belum belajar, contohnya "Paimon lapar… ayo review dulu!". Tanpa server tidak ada push sungguhan, jadi pengingat hanya muncul selama aplikasi/PWA terbuka atau berjalan di latar belakang. Batasan ini juga dijelaskan di UI.
- **Export/import JSON** (di halaman Profil): semua tabel, termasuk gambar chibi upload (sebagai data URL). Saat import, tanggal kartu SRS dipulihkan menjadi `Date`, file asing ditolak dengan pesan yang jelas, dan ada konfirmasi sebelum menimpa. Diuji bolak-balik dengan fake-indexeddb dan end-to-end ke browser baru.
- `npm audit` melaporkan 4 kerentanan tingkat rendah di tooling build workbox (dependensi dev `vite-plugin-pwa`), tidak ikut ke aplikasi.

## M8 — Data N3 → N1 + polish
- **Semua region terisi konten** (diperiksa oleh `src/data/regions.test.ts`): untuk setiap region/level ada kanji, kosakata, ≥ 10 pola grammar, ≥ 2 bacaan, Gate/Mock Test yang bisa dibangun, dan semua chibi region itu sudah digambar.
  - **Kanji N5–N1:** 2.211 (N3 367, N2 367, N1 1.232), lengkap dengan data goresan KanjiVG dan komponen.
  - **Kosakata N5–N1:** 7.896 kata (N3 2.078, N2 1.790, N1 2.655).
  - **Grammar:** 62 pola. Baru: N3 12, N2 10, N1 10, termasuk ～ようにする, ～せいで, ～られる/～させる, ～にとって, ～わけにはいかない, ～ずにはいられない, ～ならではの, ～をよそに.
  - **Bacaan:** 14 teks. Baru: N3 (kerja paruh waktu, empat musim), N2 (kerja jarak jauh, kesulitan keigo), N1 (tradisi vs inovasi, AI dan belajar bahasa).
- **Bahasa Indonesia:**
  - Arti ditulis untuk **semua 2.211 kanji** dan **semua 1.373 kosakata N5–N4**. Arti bahasa Inggrisnya tetap disimpan (`en`).
  - Kosakata N3–N1 (~6.500 kata) masih memakai arti bahasa Inggris dari sumber datanya dan diberi label "EN" di kartu. Menerjemahkan semuanya secara manual di luar cakupan milestone ini.
  - Terjemahan disimpan di `scripts/kanji_id.tsv` dan `scripts/vocab_id.tsv`, sehingga bisa diperbaiki atau ditambah tanpa menyentuh kode.
- **Data goresan dipecah per level** (base 0,65 MB, N3 1 MB, N2 1 MB, N1 3,9 MB) dan hanya dimuat saat dibutuhkan. Keempatnya di-precache PWA, jadi semua level bisa dipakai offline (total precache 8,5 MB).
- **Kode digeneralisasi dari N5/N4 ke N5–N1:**
  - Tab level di semua hub.
  - Generator ujian memakai materi level itu ditambah level di bawahnya.
  - Gate Exam setiap region memakai soal levelnya sendiri, tidak lagi N4.
  - Pace Engine memakai jumlah kanji/kosakata yang sebenarnya; ada test yang memastikan jumlahnya selalu cocok dengan data.
- **Ujian tidak lagi memunculkan pilihan ganda kembar:** semua pengecoh dibuat unik (diuji untuk N5–N1).
- **22 chibi sisanya digambar** (total 34/34):
  - Mondstadt: Jean, Barbara, Lisa, Kaeya (penutup mata), Mona, Sucrose (kacamata).
  - Inazuma: Raiden, Yae (telinga rubah + kipas), Ayaka, Kazuha (helai merah + daun maple), Yoimiya.
  - Sumeru: Nahida (mahkota daun), Alhaitham, Tighnari (telinga fennec), Nilou, Cyno (tudung serigala).
  - Fontaine: Furina (topi tinggi), Neuvillette, Navia.
  - Natlan: Mavuika (kacamata hitam), Kinich (dengan Ajaw), Mualani.
- **Polish dan aksesibilitas:**
  - **Keyboard:** tombol 1–4 untuk memilih jawaban di semua kuis, review, dan ujian; Enter untuk "Lanjut".
  - **Pembaca layar:** hasil benar/salah diumumkan lewat `aria-live`; ada link "Lewati ke konten" dan `aria-label` pada menu.
  - **Fokus** keyboard selalu terlihat (`:focus-visible`).
  - **Gerak:** Framer Motion mengikuti `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`), ditambah transisi halus antar halaman.
  - **SFX** bisa dimatikan di Profil.
  - **Skill Map:** region N1 (tahap terakhir) sekarang menampilkan "🎓 Ujian akhir: JLPT N1 Mock Test", bukan Gate yang terkunci selamanya.
- **Catatan ukuran:** bundle utama sekarang 2 MB (560 KB gzip) karena data kanji dan kosakata N5–N1 dibundel langsung. Untuk aplikasi offline yang di-cache sekali ini masih wajar. Kalau nanti terasa berat, data kosakata N3–N1 bisa dipisah dan dimuat saat dibutuhkan, seperti data goresan.
- **Uji end-to-end:** lulus 4 Gate berturut-turut (semua region terbuka), menulis kanji N1 dengan data goresan N1, cek kartu kosakata N5 (Indonesia) dan N3 (label EN), menjawab grammar N1 dengan keyboard, tap kata di bacaan N1, dan Mock Test N1 100%. Tidak ada error di console.

## Android APK + 0 warning lint
- **Android (Capacitor 8):** folder `android/` siap build. APK berisi seluruh aplikasi, jadi tetap jalan offline tanpa service worker (`vite build --mode android`).
  - **Suara di APK:** WebView Android tidak punya Web Speech API, jadi TTS memakai mesin suara sistem (`@capacitor-community/text-to-speech`) dan pengenalan suara memakai recognizer sistem (`@capacitor-community/speech-recognition`).
  - Recognizer sistem dibungkus dengan bentuk yang sama seperti versi browser, sehingga semua latihan bicara dan game suara tidak perlu diubah. Mode kontinu (Speed Speak) otomatis menyala ulang setelah hening.
  - **Izin mikrofon** diminta saat pertama dipakai. Kalau suara Jepang belum terpasang, aplikasi menawarkan installer TTS sekali.
  - **Tombol back Android** mundur ke halaman sebelumnya, dan keluar dari halaman pertama. Ikon launcher (adaptive) dan splash memakai torii.
  - Font Baloo 2 dibundel lokal (`@fontsource`), jadi judul tetap rapi saat offline.
- **CI:** `.github/workflows/android.yml` menjalankan lint, test, dan build APK di setiap push. Hasilnya jadi artifact, dan tag `v*` melampirkannya ke Release. `versionCode` = nomor run, dan semua build ditandatangani dengan kunci debug yang sama, jadi APK baru selalu terpasang sebagai update.
- **Lint: 81 → 0 warning.**
  - Modul chibi, hook, dan helper dipisah dari file komponen (fast refresh).
  - Semua timer game memakai `useDeadline` (berbasis tenggat; waktu habis dipicu dari callback timer, bukan dari effect).
  - Soal/opsi ronde berikutnya dibuat saat pindah ronde, tidak lagi lewat `useMemo` dengan dependency yang tidak lengkap.
  - `Math.random`/`Date.now` tidak lagi dipanggil saat render, dan `useSpeech` mengembalikan callback yang stabil.
  - Hadiah Boss/Domain diklaim di handler jawaban terakhir. Audio ujian choukai diputar saat berpindah soal.
- Uji e2e M2–M8 lulus ulang. Solver e2e diperbaiki untuk soal isian yang punya lebih dari satu jawaban benar (わたし（は/も）学生です).

## Tampilan baru bergaya Teyvat + jalan rahasia Raiden Shogun
- **Chibi baru:** set ilustrasi Paimon, Klee, Venti, Barbara, Diluc, Jean, Lisa, Mona, Zhongli, dan Raiden dari `Genshin Chibi Generate Ver/` dipakai sebagai gambar bawaan (WebP 640 px, total 3,9 MB). File asli dan gambar upload di perangkat tidak disentuh; skema database tetap sama.
- **Navigasi lebih sederhana:**
  - **Tab bawah:** 5 tab (Beranda, Belajar, Main, Karakter, Profil) menggantikan 8 tombol di atas.
  - **Mode fokus:** saat pelajaran, game, review, atau ujian, tab disembunyikan dan diganti tombol Kembali.
  - **Beranda:** menampilkan satu langkah berikutnya yang jelas (review yang menumpuk → materi tahap ini yang paling tertinggal → Gate Exam), ditambah daftar "Setelah itu", commission, dan estimasi lulus.
  - **Hub Belajar & Main:** dikelompokkan (Materi inti, Keterampilan, Perjalanan; Event dan mini-game per keterampilan).
- **Gaya UI Genshin:**
  - Panel perkamen dengan bingkai emas dan bintang di sudut, tombol pil mengilap, serta kotak dialog gelap dengan nama berwarna emas.
  - Font Nunito, dan Cinzel untuk nama region.
  - Halaman Karakter seperti layar karakter: latar warna elemen, bintang, dan tab Karakter/Wish.
- **Latar region:**
  - Setiap region punya pemandangan SVG dan partikelnya sendiri: Mondstadt (kincir angin, Katedral, pohon Windrise, benih dandelion), Liyue (Jueyun Karst, Jade Chamber, paviliun pelabuhan, lentera Lantern Rite), Inazuma (Tenshukaku, Sakura Suci, torii di laut, ombak seigaiha, kilat, mitsudomoe), Sumeru (pohon raksasa, daun hutan hujan, jamur bercahaya, partikel Dendro), Fontaine (Court of Fontaine, air terjun, lengkungan akuaduk, gelembung), Natlan (gunung api, mesa, motif suku, bara).
  - Warna tombol dan aksen ikut berubah.
  - Tema otomatis mengikuti region tempat kamu berada. Region yang sudah dicapai (atau tema dari Wish) bisa dipilih di Profil.
- **Emoji dihapus:** semua emoji diganti 70+ ikon SVG gambar sendiri, misalnya speaker, mikrofon, Kirameki (permata bintang), hati, jam pasir, lambang 7 elemen, mitsudomoe, dango, dan sakura.
- **Jalan Keabadian (Raiden Shogun):**
  - **Surat dari Tenshukaku:** tiba saat sampai di Inazuma, atau lewat rahasia: streak 7 hari, lalu ketuk lambang Inazuma di Peta 3×.
  - **Ujian Musou:** 8 soal dengan timer badai; lulus 6/8 untuk diakui. Raiden bergabung dan kamu mendapat +300 Kirameki.
  - **Ikatan Lv 1–10:** satu percakapan per hari dalam bahasa Jepang (furigana + suara). Jawaban dipilih dalam bahasa Jepang dan diuji: partikel atau bentuk yang salah dikoreksi Shogun, jawaban baik menambah ikatan. Ada 14 cerita, lalu obrolan harian.
  - **Cara menambah ikatan:** belajar dengan Raiden sebagai companion ikut menambah ikatan, dan dango bisa diberikan sekali sehari.
  - **Lv 5, Alam Euthymia:** bertemu Ei (影). Tema Alam Euthymia terbuka, dan companion berubah menjadi Ei dengan sapaan yang lebih hangat.
  - **Lv 10, Janji Keabadian:** gelar dan sapaan khusus sesuai waktu (pagi, siang, malam).
- **Tes:** 72 unit test (+6 untuk alur Raiden dan validasi semua dialog). E2E M2–M8 dan alur Raiden (rahasia → surat → ujian → percakapan → Euthymia → Ei jadi companion) lulus.
