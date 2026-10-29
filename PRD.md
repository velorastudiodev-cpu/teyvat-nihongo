# PRD — **Teyvat Nihongo** 🗾
*Aplikasi belajar bahasa Jepang N5 → N1 yang dibuat seperti game, dengan karakter chibi Genshin Impact sebagai teman belajar.*

> Dokumen ini untuk **Claude Code**. Kerjakan per milestone (bagian 9). Setiap milestone harus bisa dijalankan dan lolos acceptance criteria sebelum lanjut ke milestone berikutnya.

> [!IMPORTANT]
> **Kebebasan improvisasi untuk Claude Code.** PRD ini adalah *kompas*, bukan *kandang*. Kamu (Claude Code) **diperbolehkan, bahkan didorong,** untuk berimprovisasi dan bekerja di luar PRD kalau menurutmu ada fitur yang bisa ditambahkan, ada celah yang bisa dimanfaatkan lebih baik, atau ada pendekatan teknis/UX yang lebih efektif untuk membuat user benar-benar fasih bahasa Jepang dan betah belajar seharian. Kamu bebas memakai PRD ini secara utuh, sebagian, atau mengubah bagian mana pun (fitur, game, stack, urutan milestone) supaya potensimu tidak terhambat. Pegangan yang tidak boleh dilanggar hanya tiga: **(1)** progres tetap bertahap dari level hasil placement menuju target, **(2)** belajar terasa interaktif seperti game, bukan dinding teks, **(3)** aplikasi selalu bisa dijalankan. Setiap improvisasi besar dicatat singkat di `CHANGELOG.md`: apa yang diubah dan kenapa itu lebih baik.

---

## 1. Visi & Prinsip
| Prinsip | Artinya di aplikasi |
|---|---|
| **Perjalanan, bukan template** | Target user (misal N1) adalah *tujuan akhir*, **bukan** level awal. Semua user mulai dari placement test, lalu naik level per level (N5→N4→…). Kecepatan belajar menyesuaikan target tanggal dan menit belajar per hari. |
| **Main dulu, baca belakangan** | Tidak ada halaman berisi teks panjang atau PDF. Setiap konsep diajarkan lewat interaksi singkat (≤ 60 detik), langsung dilanjutkan dengan latihan. |
| **Bisa dibuka seharian** | Ada konten harian (commission) dan mode tanpa batas (endless), jadi selalu ada yang bisa dimainkan. |
| **Lengkap** | Kana, kanji, kosakata, tata bahasa, membaca, mendengar, berbicara, dan simulasi ujian JLPT. |
| **Karakter yang hidup** | Banyak chibi Genshin yang menjadi sensei, teman, dan hadiah koleksi. |

**User:** 1 orang (pemilik aplikasi), wibu, level awal N5 (bisa jadi masih nol).

---

## 2. Progres Adaptif (fitur inti)
1. **Onboarding:** isi target level (N4–N1), target tanggal (opsional), dan menit belajar per hari.
2. **Placement Test** (±10 menit, soal adaptif): menentukan level awal sebenarnya. Contoh: kalau user sudah hafal hiragana, materi hiragana dilewati.
3. **Skill Map per region** (level dibuka bertahap):
   | Region | Level | Sensei utama |
   |---|---|---|
   | Mondstadt | Kana + N5 | Paimon (pemandu), Klee, Venti |
   | Liyue | N4 | Zhongli, Xiangling, Hu Tao |
   | Inazuma | N3 | Raiden Shogun, Yae Miko, Ayaka |
   | Sumeru | N2 | Nahida, Alhaitham, Tighnari |
   | Fontaine / Natlan | N1 | Furina, Neuvillette, Mavuika |
4. **Gate Exam (Boss Region):** ujian kecil gaya JLPT. Harus lulus ≥ 70% untuk membuka region berikutnya.
5. **Pace Engine:** menghitung estimasi tanggal lulus berdasarkan target dan performa nyata. Jumlah pelajaran baru vs. review harian diatur ulang setiap hari. Kalau user tertinggal, beban dinaikkan sedikit; kalau user terlalu cepat tapi akurasi turun, materi baru direm.
6. **SRS (FSRS)** untuk semua item: kana, kanji, kosakata, dan pola grammar. Kesalahan otomatis dicatat ke **Mistake Journal** dan dijadwalkan ulang.

---

## 3. Modul Belajar
| Modul | Isi | Cara belajar interaktif |
|---|---|---|
| Hiragana & Katakana | 46+46 huruf dasar, dakuten, yōon, huruf kecil っ | Kartu dengan audio dan mnemonic bergambar, latihan menulis urutan goresan di canvas |
| Kanji | ±2.136 kanji (Jōyō), dikelompokkan per level JLPT | Urutan goresan (KanjiVG), radikal, onyomi/kunyomi, 2–3 contoh kosakata |
| Kosakata | Per level JLPT, dengan contoh kalimat dan audio | Swipe card, pilih gambar, dengar lalu pilih |
| Grammar | Pola tata bahasa per level | 1 kartu konsep (≤ 3 kalimat) + 5 latihan menyusun kalimat |
| Reading | Teks pendek bertingkat dengan furigana yang bisa di-toggle | Tap kata untuk lihat arti, kuis di akhir |
| Listening | Audio TTS ja-JP dengan kecepatan 0.75×/1×/1.25× | Dengar lalu pilih, dikte |
| Speaking | Lihat bagian 4 | — |
| JLPT Mock Test | Format resmi: 文字語彙 / 文法読解 / 聴解, dengan timer | Skor per bagian dan analisis kelemahan |

---

## 4. Fitur Suara (tanpa chat dengan AI)
Menggunakan **Web Speech API `SpeechRecognition` (lang `ja-JP`)**, didukung di Chrome/Edge.

- **Voice Fill:** muncul kalimat acak berisi 1–3 bagian kosong, contoh `わたしは＿＿＿をたべます`. User harus *mengucapkan* kalimat lengkap atau hanya kata yang hilang. Hasil transkrip dinormalisasi ke kana (pakai `wanakana` + `kuroshiro`) lalu dicocokkan dengan jawaban yang benar (toleransi fuzzy ±1 mora).
- **Speed Speak:** kata muncul satu per satu dan harus diucapkan sebelum timer habis (ada combo).
- **Shadowing:** dengar kalimat → ucapkan ulang → skor kecocokan + highlight bagian yang salah.
- **Kanji Read-Aloud:** kanji muncul tanpa furigana, user membacanya dengan suara.
- **Fallback:** kalau mic atau API tidak tersedia, mode ketik kana tetap bisa dipakai.

---

## 5. Mini-Games
Semua game bisa dimainkan di mode **Daily** (soal dari materi yang sedang dipelajari + review SRS) dan mode **Endless** (main sepuasnya, ada high score).

| Game | Mekanik | Skill |
|---|---|---|
| **Kana Rain** | Kana berjatuhan, ketik romaji sebelum menyentuh tanah | Kana |
| **Memory Match** | Pasangkan kana↔romaji atau kanji↔arti | Kana/Kanji |
| **Stroke Duel** | Gambar kanji di canvas, dinilai urutan dan arah goresannya, adu waktu dengan chibi | Kanji |
| **Radical Forge** | Gabungkan radikal untuk membentuk kanji | Kanji |
| **Particle Shooter** | Tembak partikel yang benar (は/が/を/に/で…) | Grammar |
| **Sentence Builder** | Drag & drop blok kata menjadi kalimat yang benar | Grammar |
| **Fill-the-Blank Rush** | Isi bagian kosong dalam 60 detik, ada combo multiplier | Semua |
| **Listening Echo** | Dengar audio, pilih kalimat atau gambar yang cocok | Listening |
| **Voice Fill / Speed Speak** | Lihat bagian 4 | Speaking |
| **Domain Run** | Mode roguelite endless: soal campuran makin sulit, ada 3 nyawa dan buff dari karakter | Semua |
| **Weekly Boss** | Boss mingguan (misal "Signora Grammar"), soal campuran dari materi minggu itu | Review |

---

## 6. Gamifikasi & Karakter Chibi
- **Daily Commissions:** 4 tugas harian, contoh "Review 30 kartu", "Main Voice Fill 1×", "Pelajari 5 kanji baru".
- **Mata uang `Kirameki ✦`** didapat dari belajar. Bisa dipakai untuk **gacha kosmetik** (tidak ada uang asli). Isi gacha: chibi baru, outfit, tema UI, dan stiker. Ada pity system.
- **Koleksi 30+ chibi** (Mondstadt sampai Natlan). Setiap chibi punya:
  - **Friendship level:** naik kalau karakter itu dipakai sebagai companion. Level yang naik membuka voice line dan "Culture Note" (tips budaya atau slang Jepang).
  - **Passive buff kecil di game**, contoh: Zhongli = +1 nyawa di Domain Run, Klee = skor ×1.2 di Kana Rain.
  - **Reaksi animasi:** senang saat jawaban benar, menyemangati saat salah, tidur kalau aplikasi dibiarkan idle.
- **Companion di layar:** chibi aktif menemani di pojok layar dan berganti ekspresi sesuai situasi.
- **Streak + Streak Freeze**, Adventure Rank (XP), achievements, dan kalender belajar (heatmap).

---

## 7. Improvisasi Tambahan (dampak besar)
1. **Anime Line of the Day:** kalimat dari situasi anime yang umum ("お前はもう死んでいる" dan sejenisnya), dilengkapi breakdown grammar.
2. **Mistake Journal → "Revenge Quest":** soal yang pernah salah muncul kembali sebagai quest khusus dengan hadiah lebih besar.
3. **Mode Furigana Bertahap:** furigana otomatis hilang untuk kanji yang sudah dikuasai (berdasarkan stabilitas SRS).
4. **Focus Session (Pomodoro):** 25 menit belajar, chibi "beristirahat" saat jeda.
5. **PWA offline + notifikasi pengingat** yang disampaikan lewat karakter, contoh "Paimon lapar, ayo review!".
6. **Insight Dashboard:** akurasi per skill, item yang paling sering dilupakan, dan proyeksi kapan target JLPT tercapai.
7. **Export/Import progress** dalam bentuk JSON untuk backup.

---

## 8. Spesifikasi Teknis
| Area | Pilihan |
|---|---|
| Framework | **Vite + React + TypeScript**, Tailwind CSS, Framer Motion (animasi) |
| State/Storage | Zustand + **Dexie (IndexedDB)**, local-first, tanpa backend |
| SRS | `ts-fsrs` |
| Jepang | `wanakana`, `kuroshiro` + `kuromoji` (kana conversion/tokenize) |
| Data | KanjiVG (stroke), KANJIDIC2, JMdict, Tatoeba (contoh kalimat). Semua lisensi CC-BY-SA, cantumkan atribusi |
| Audio | `speechSynthesis` ja-JP (TTS), `SpeechRecognition` ja-JP (STT) |
| Canvas | Stroke recognition sederhana: bandingkan arah dan urutan goresan dengan path KanjiVG |
| PWA | `vite-plugin-pwa` |
| Test | Vitest (logic SRS, pace engine, voice matcher) |

**Folder inti:** `src/{modules,games,characters,engine/{srs,pace,voice},data,ui}`
**Data karakter:** `characters.json` → `{id, name, region, element, buff, lines[], assets{idle,happy,sad,sleep}}`

**Arah desain UI:** palet terang dan hangat (krem kertas, merah torii, hijau anemo sebagai aksen). Hindari gradient ungu dan glassmorphism. Tipografi: Noto Sans JP + display font yang playful. Animasi terasa *snappy*, dan setiap jawaban selalu diberi feedback berupa suara + gerakan.

### 8.1 Chibi Karakter — digambar sendiri oleh Claude Code
- **Claude Code menggambar semua chibi sendiri** sebagai **SVG buatan sendiri** (React component atau file `.svg`), dengan kreasi dan gaya visualnya sendiri. **Dilarang** menyalin, men-trace, atau mengunduh art resmi maupun fan-art orang lain.
- Setiap chibi harus tetap **langsung dikenali** sebagai karakternya lewat ciri khas: palet warna, gaya rambut, aksesori ikonik (topi Klee, topi pemakaman Hu Tao, kipas Yae Miko, mahkota Nahida), simbol elemen, dan kepribadian.
- **Gaya konsisten:** proporsi kepala:badan = 1:1, outline tebal membulat, shading flat 2 tone, mata besar ekspresif.
- **Minimal 4 ekspresi per karakter:** `idle`, `happy`, `sad/encourage`, `sleep`, plus animasi ringan (bernapas, berkedip, melompat) memakai CSS/Framer Motion.
- Target **30+ karakter**. Kerjakan bertahap: 5 karakter Mondstadt di M0, sisanya dicicil per region.
- Sistem aset tetap *pluggable* (`public/chibi/<id>/`), jadi user bisa mengganti gambar sendiri kapan saja.

> [!WARNING]
> Karakter Genshin tetap IP milik HoYoverse, termasuk kalau digambar ulang. Aplikasi ini **khusus penggunaan pribadi, non-komersial, dan tidak dipublikasikan.**

---

## 9. Milestones untuk Claude Code
| # | Deliverable | Acceptance criteria |
|---|---|---|
| M0 | Setup project, routing, Dexie schema, sistem karakter + 5 chibi SVG pertama | `npm run dev` berjalan, 30+ karakter terdaftar di JSON, 5 chibi Mondstadt tampil dengan 4 ekspresi |
| M1 | Onboarding, Placement Test, Skill Map, Pace Engine | Target N1 tetap mulai dari level hasil placement; estimasi tanggal tampil |
| M2 | Modul Kana lengkap + Kana Rain + Memory Match + SRS | 92 kana bisa dipelajari, direview, dan dimainkan |
| M3 | Kanji + kosakata N5–N4, Stroke Duel, Radical Forge | Urutan goresan tervalidasi; kanji masuk ke SRS |
| M4 | Grammar, Reading, Listening, Particle Shooter, Sentence Builder, Fill-Blank Rush | Tiap modul punya ≥ 1 game + kuis |
| M5 | Fitur suara: Voice Fill, Speed Speak, Shadowing, Kanji Read-Aloud | Ucapan ja-JP dikenali, blank dinilai benar/salah, fallback ketik tersedia |
| M6 | Gamifikasi: commissions, Kirameki, gacha, friendship, buff, streak, Weekly Boss, Domain Run | Siklus harian lengkap bisa dimainkan end-to-end |
| M7 | JLPT Mock Test, Gate Exam, Insight Dashboard, PWA offline, export/import | Lulus Gate Exam membuka region berikutnya; aplikasi bisa dipakai offline |
| M8 | Data N3 → N1 + polish (animasi, suara SFX, aksesibilitas) | Semua region terisi konten |

---

## 10. Di Luar Scope
Akun/login, backend/cloud sync, multiplayer, pembayaran, chatbot AI percakapan, dan rilis publik.
