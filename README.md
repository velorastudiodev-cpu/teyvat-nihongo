# Teyvat Nihongo 🗾

Aplikasi belajar bahasa Jepang N5 → N1 bergaya game. Hanya untuk penggunaan pribadi dan non-komersial. Karakter Genshin Impact adalah IP milik HoYoverse; semua chibi digambar ulang sebagai SVG orisinal.

**Isi aplikasi:** Placement Test → Skill Map 6 region dengan Gate Exam; kana, 2.211 kanji, dan 7.896 kosakata (N5–N1); 62 pola grammar; 14 bacaan; latihan mendengar dan berbicara; 13 mini-game; SRS (FSRS); Daily Commission, gacha, friendship, Weekly Boss, Domain Run; JLPT Mock Test; Insight Dashboard; PWA offline; export/import JSON. Riwayat lengkap per milestone ada di `CHANGELOG.md`.

## Install

### Android (APK)

1. Setiap push ke `main` menjalankan GitHub Actions (**Android APK**). Ini menjalankan lint, test, build, lalu menghasilkan APK.
2. Buka tab **Actions** → run terbaru → bagian **Artifacts** → unduh `teyvat-nihongo-apk` (zip berisi `.apk`).
   Kalau push tag `v1.0.0`, APK juga dilampirkan ke halaman **Releases**, jadi lebih mudah diunduh langsung dari HP.
3. Di HP: buka file `.apk` → izinkan "Instal aplikasi tidak dikenal" untuk browser/Files → **Instal**.
4. Saat pertama memakai latihan bicara, izinkan **mikrofon**. Suara Jepang memakai mesin TTS sistem. Kalau tidak bersuara, pasang data suara Jepang di *Setelan → Bahasa → Output teks-ke-ucapan* (Google TTS).

Semua APK ditandatangani dengan kunci yang sama (`android/app/debug.keystore`). APK baru langsung terpasang sebagai update dan progres belajar tetap aman. Progres disimpan di HP; pindahkan antar-perangkat lewat **Export/Import JSON** di Profil.

Build APK sendiri (butuh JDK 21 dan Android SDK, `ANDROID_HOME`):

```bash
npm run apk     # → android/app/build/outputs/apk/debug/app-debug.apk
```

### Desktop (PWA)
`npm run build`, lalu hosting folder `dist/` (GitHub Pages, Netlify, dll.). Buka di Chrome/Edge dan klik ikon **Instal** di address bar. Aplikasi terbuka di jendela sendiri dan tetap jalan offline.

### Development

```bash
npm install
npm run dev     # http://localhost:5173
npm test
npm run lint
```

**Ganti gambar chibi:** buka halaman Karakter, pilih karakter, lalu klik *Upload* di tiap ekspresi (tersimpan di browser). Cara lain: taruh `idle.svg`, `happy.svg`, `sad.svg`, dan `sleep.svg` di `public/chibi/<id>/`.

**Membangun ulang data kanji/kosakata** (unduh KanjiVG, KANJIDIC2, daftar JLPT):

```bash
python3 -I scripts/build_kanji_data.py /tmp/kanji-cache
```

Data turunan KanjiVG (`src/data/strokes/`) berlisensi CC BY-SA 3.0, dan data KANJIDIC2 berlisensi CC BY-SA 4.0 (EDRDG).
