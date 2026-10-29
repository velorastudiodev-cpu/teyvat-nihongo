# Teyvat Nihongo 🗾

Aplikasi belajar bahasa Jepang N5 → N1 bergaya game. Hanya untuk penggunaan pribadi dan non-komersial. Karakter Genshin Impact adalah IP milik HoYoverse; semua chibi digambar ulang sebagai SVG orisinal.

**Isi aplikasi:** Placement Test → Skill Map 6 region dengan Gate Exam; kana, 2.211 kanji, dan 7.896 kosakata (N5–N1); 62 pola grammar; 14 bacaan; latihan mendengar dan berbicara; 13 mini-game; SRS (FSRS); Daily Commission, gacha, friendship, Weekly Boss, Domain Run; JLPT Mock Test; Insight Dashboard; PWA offline; export/import JSON. Riwayat lengkap per milestone ada di `CHANGELOG.md`.

```bash
npm install
npm run dev     # http://localhost:5173
npm test
```

**Ganti gambar chibi:** buka halaman Karakter, pilih karakter, lalu klik *Upload* di tiap ekspresi (tersimpan di browser). Cara lain: taruh `idle.svg`, `happy.svg`, `sad.svg`, dan `sleep.svg` di `public/chibi/<id>/`.

**Membangun ulang data kanji/kosakata** (unduh KanjiVG, KANJIDIC2, daftar JLPT):

```bash
python3 -I scripts/build_kanji_data.py /tmp/kanji-cache
```

Data turunan KanjiVG (`src/data/strokes.json`) berlisensi CC BY-SA 3.0, dan data KANJIDIC2 berlisensi CC BY-SA 4.0 (EDRDG).
