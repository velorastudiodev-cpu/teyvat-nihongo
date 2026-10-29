import type { Level } from './kanji'

export interface Reading {
  id: string
  level: Level
  title: string
  titleId: string
  text: string                          // sentence markup (engine/sentence.ts); "/" starts a new line
  gloss: Record<string, string>         // plain token text → meaning, for tap-to-translate
  quiz: { q: string; a: string; wrong: string[] }[]
}

export const READINGS: Reading[] = [
  {
    id: 'ichinichi', level: 'N5', title: 'わたし の 一日{いちにち}', titleId: 'Hariku',
    text: 'わたし は 毎朝{まいあさ} 六時{ろくじ} に 起{お}きます 。 / 朝{あさ}ご飯{はん} に パン を 食{た}べます 。 / 八時{はちじ} に 電車{でんしゃ} で 学校{がっこう} へ 行{い}きます 。 / 学校{がっこう} で 日本語{にほんご} を 勉強{べんきょう}します 。 / 夜{よる} は うち で アニメ を 見{み}ます 。',
    gloss: { 毎朝: 'setiap pagi', 六時: 'jam enam', 起きます: 'bangun', 朝ご飯: 'sarapan', 電車: 'kereta', 勉強します: 'belajar', 夜: 'malam', うち: 'rumah', 見ます: 'menonton' },
    quiz: [
      { q: 'Jam berapa dia bangun?', a: 'Jam enam', wrong: ['Jam tujuh', 'Jam delapan', 'Jam sembilan'] },
      { q: 'Dia ke sekolah naik apa?', a: 'Kereta', wrong: ['Bus', 'Sepeda', 'Jalan kaki'] },
      { q: 'Apa yang dia lakukan malam hari?', a: 'Menonton anime', wrong: ['Belajar', 'Bekerja', 'Memasak'] },
    ],
  },
  {
    id: 'kazoku', level: 'N5', title: 'ぼく の 家族{かぞく}', titleId: 'Keluargaku',
    text: 'ぼく の 家族{かぞく} は 四人{よにん} です 。 / 父{ちち} と 母{はは} と 妹{いもうと} と ぼく です 。 / 父{ちち} は 会社員{かいしゃいん} です 。 / 母{はは} は 料理{りょうり} が 上手{じょうず} です 。 / 妹{いもうと} は 十{じゅっ}さい です 。 / ねこ も 一{いっ}ぴき います 。',
    gloss: { ぼく: 'aku (laki-laki)', 家族: 'keluarga', 四人: 'empat orang', 父: 'ayah (sendiri)', 母: 'ibu (sendiri)', 妹: 'adik perempuan', 会社員: 'pegawai kantor', 料理: 'masakan', 上手: 'pandai', 十さい: 'sepuluh tahun', 一ぴき: 'satu ekor' },
    quiz: [
      { q: 'Berapa orang keluarganya?', a: 'Empat', wrong: ['Tiga', 'Lima', 'Enam'] },
      { q: 'Ibunya pandai apa?', a: 'Memasak', wrong: ['Menyanyi', 'Menggambar', 'Berenang'] },
      { q: 'Berapa umur adiknya?', a: 'Sepuluh tahun', wrong: ['Empat tahun', 'Tujuh tahun', 'Dua belas tahun'] },
    ],
  },
  {
    id: 'shuumatsu', level: 'N5', title: '週末{しゅうまつ}', titleId: 'Akhir pekan',
    text: '土曜日{どようび} に 友{とも}だち と デパート へ 行{い}きました 。 / わたし は 新{あたら}しい シャツ を 買{か}いました 。 / それから 喫茶店{きっさてん} で コーヒー を 飲{の}みました 。 / 日曜日{にちようび} は 雨{あめ} でした から 、 うち で 本{ほん} を 読{よ}みました 。',
    gloss: { 土曜日: 'hari Sabtu', デパート: 'mal / toserba', 新しい: 'baru', シャツ: 'kemeja', 買いました: 'membeli', それから: 'setelah itu', 喫茶店: 'kafe', 日曜日: 'hari Minggu', 雨: 'hujan', 読みました: 'membaca' },
    quiz: [
      { q: 'Apa yang dia beli?', a: 'Kemeja baru', wrong: ['Buku', 'Sepatu', 'Kopi'] },
      { q: 'Bagaimana cuaca hari Minggu?', a: 'Hujan', wrong: ['Cerah', 'Bersalju', 'Berangin'] },
      { q: 'Apa yang dia lakukan hari Minggu?', a: 'Membaca buku di rumah', wrong: ['Pergi ke mal', 'Minum kopi di kafe', 'Menonton film'] },
    ],
  },
  {
    id: 'resutoran', level: 'N5', title: 'レストラン で', titleId: 'Di restoran',
    text: '店員{てんいん} ： いらっしゃいませ 。 何{なに}にしますか 。 / わたし ： ラーメン を ください 。 / 店員{てんいん} ： お飲{の}み物{もの} は ？ / わたし ： 水{みず}でいいです 。 / 店員{てんいん} ： はい 、 八百円{はっぴゃくえん} です 。',
    gloss: { 店員: 'pelayan', いらっしゃいませ: 'selamat datang', 何にしますか: 'mau pesan apa?', ください: 'tolong beri', お飲み物: 'minuman', 水でいいです: 'air saja cukup', 八百円: '800 yen' },
    quiz: [
      { q: 'Apa yang dia pesan?', a: 'Ramen', wrong: ['Sushi', 'Kare', 'Udon'] },
      { q: 'Minumnya apa?', a: 'Air putih', wrong: ['Teh', 'Kopi', 'Jus'] },
      { q: 'Berapa harganya?', a: '800 yen', wrong: ['600 yen', '1.000 yen', '1.800 yen'] },
    ],
  },
  {
    id: 'machi', level: 'N5', title: 'わたし の 町{まち}', titleId: 'Kotaku',
    text: 'わたし の 町{まち} は 小{ちい}さい です が 、 きれい です 。 / 駅{えき} の 前{まえ} に 大{おお}きい スーパー が あります 。 / スーパー の となり に 公園{こうえん} が あります 。 / 公園{こうえん} に は 木{き} が たくさん あります 。 / わたし は この 町{まち} が 好{す}き です 。',
    gloss: { 町: 'kota', 小さい: 'kecil', きれい: 'indah / bersih', 駅: 'stasiun', 前: 'depan', 大きい: 'besar', となり: 'sebelah', 公園: 'taman', 木: 'pohon', たくさん: 'banyak', 好き: 'suka' },
    quiz: [
      { q: 'Kotanya seperti apa?', a: 'Kecil tapi indah', wrong: ['Besar dan ramai', 'Kecil dan kotor', 'Besar tapi sepi'] },
      { q: 'Apa yang ada di depan stasiun?', a: 'Supermarket besar', wrong: ['Taman', 'Sekolah', 'Bank'] },
      { q: 'Apa yang ada di sebelah supermarket?', a: 'Taman', wrong: ['Stasiun', 'Rumah sakit', 'Kafe'] },
    ],
  },
  {
    id: 'messeeji', level: 'N5', title: 'メッセージ', titleId: 'Pesan',
    text: 'ゆき さん 、 あした の パーティー は 七時{しちじ}から です 。 / わたし の うち で します 。 / ケーキ を 作{つく}ります から 、 飲{の}み物{もの} を 買{か}ってきてください 。 / たのしみ です ね ！',
    gloss: { あした: 'besok', パーティー: 'pesta', 七時から: 'mulai jam tujuh', うち: 'rumah', 作ります: 'membuat', 飲み物: 'minuman', 買ってきてください: 'tolong belikan dan bawa', たのしみ: 'tidak sabar / menantikan' },
    quiz: [
      { q: 'Pestanya mulai jam berapa?', a: 'Jam tujuh', wrong: ['Jam enam', 'Jam delapan', 'Jam sembilan'] },
      { q: 'Di mana pestanya?', a: 'Di rumah pengirim pesan', wrong: ['Di rumah Yuki', 'Di restoran', 'Di sekolah'] },
      { q: 'Yuki diminta membawa apa?', a: 'Minuman', wrong: ['Kue', 'Hadiah', 'Makanan'] },
    ],
  },
  {
    id: 'hajimete', level: 'N4', title: 'はじめて の 日本{にほん}', titleId: 'Pertama kali ke Jepang',
    text: '去年{きょねん} はじめて 日本{にほん} へ 行{い}きました 。 / 東京{とうきょう} は 人{ひと} が 多{おお}くて 、 とても にぎやか でした 。 / 電車{でんしゃ} が 時間{じかん}どおり に 来{く}る ので 、 びっくりしました 。 / 来年{らいねん} は 京都{きょうと} へ 行{い}く つもり です 。',
    gloss: { 去年: 'tahun lalu', はじめて: 'pertama kali', 多くて: 'banyak, dan…', にぎやか: 'ramai', 時間どおり: 'tepat waktu', ので: 'karena', びっくりしました: 'terkejut', 来年: 'tahun depan', つもり: 'berencana' },
    quiz: [
      { q: 'Kapan dia pertama kali ke Jepang?', a: 'Tahun lalu', wrong: ['Tahun ini', 'Dua tahun lalu', 'Bulan lalu'] },
      { q: 'Apa yang membuatnya terkejut?', a: 'Kereta datang tepat waktu', wrong: ['Makanannya mahal', 'Orangnya sedikit', 'Cuacanya dingin'] },
      { q: 'Apa rencananya tahun depan?', a: 'Pergi ke Kyoto', wrong: ['Pindah ke Tokyo', 'Belajar di Osaka', 'Pulang kampung'] },
    ],
  },
  {
    id: 'kaze', level: 'N4', title: 'かぜ', titleId: 'Masuk angin',
    text: 'きのう から のど が 痛{いた}くて 、 熱{ねつ} も あります 。 / 病院{びょういん} へ 行{い}ったら 、 医者{いしゃ} に 「 三日{みっか} ぐらい 休{やす}んだほうがいい です よ 」 と 言{い}われました 。 / 薬{くすり} を 飲{の}んで 、 早{はや}く 寝{ね}なければなりません 。',
    gloss: { のど: 'tenggorokan', 痛くて: 'sakit, dan…', 熱: 'demam', 病院: 'rumah sakit', 行ったら: 'ketika pergi', 医者: 'dokter', 三日: 'tiga hari', 休んだほうがいい: 'sebaiknya istirahat', 言われました: 'dikatakan (kepada saya)', 薬: 'obat', 寝なければなりません: 'harus tidur' },
    quiz: [
      { q: 'Apa gejalanya?', a: 'Sakit tenggorokan dan demam', wrong: ['Sakit perut', 'Sakit kepala saja', 'Batuk dan pilek'] },
      { q: 'Apa kata dokter?', a: 'Sebaiknya istirahat sekitar tiga hari', wrong: ['Harus dirawat inap', 'Boleh langsung bekerja', 'Harus olahraga'] },
      { q: 'Apa yang harus dia lakukan?', a: 'Minum obat dan tidur cepat', wrong: ['Pergi ke sekolah', 'Makan banyak', 'Jalan-jalan'] },
    ],
  },
  {
    id: 'arubaito', level: 'N3', title: 'アルバイト', titleId: 'Kerja paruh waktu',
    text: '私{わたし} は 週{しゅう} に 三回{さんかい} 、 コンビニ で アルバイト を しています 。 / 最初{さいしょ} は 敬語{けいご} が 難{むずか}しくて 、 よく 店長{てんちょう} に 注意{ちゅうい}されました 。 / でも 毎日{まいにち} 練習{れんしゅう}する ように した ので 、 今{いま} は お客{きゃく}さん と 自然{しぜん} に 話{はな}せる ように なりました 。 / 将来{しょうらい} は 日本{にほん} の 会社{かいしゃ} で 働{はたら}きたい と 思{おも}っています 。',
    gloss: { 三回: 'tiga kali', コンビニ: 'minimarket', 敬語: 'bahasa hormat (keigo)', 店長: 'kepala toko', 注意されました: 'ditegur', 練習する: 'berlatih', 自然: 'alami', 将来: 'masa depan' },
    quiz: [
      { q: 'Berapa kali seminggu dia bekerja?', a: 'Tiga kali', wrong: ['Dua kali', 'Empat kali', 'Setiap hari'] },
      { q: 'Apa yang sulit di awal?', a: 'Bahasa hormat (keigo)', wrong: ['Menghitung uang', 'Bangun pagi', 'Membersihkan toko'] },
      { q: 'Apa cita-citanya?', a: 'Bekerja di perusahaan Jepang', wrong: ['Membuka toko sendiri', 'Menjadi guru', 'Pulang ke negaranya'] },
    ],
  },
  {
    id: 'shiki', level: 'N3', title: '日本{にほん} の 四季{しき}', titleId: 'Empat musim Jepang',
    text: '日本{にほん} に は 四{よっ}つ の 季節{きせつ} が あります 。 / 春{はる} に は 桜{さくら} が 咲{さ}き 、 多{おお}く の 人{ひと} が 花見{はなみ} を 楽{たの}しみます 。 / 夏{なつ} は 蒸{む}し暑{あつ}い です が 、 花火{はなび} 大会{たいかい} や 祭{まつ}り が あって にぎやか です 。 / 秋{あき} は 紅葉{こうよう} が きれい で 、 冬{ふゆ} は 北{きた} の 地方{ちほう} で 雪{ゆき} が たくさん 降{ふ}ります 。 / 季節{きせつ} に よって 食{た}べ物{もの} も 変{か}わる ので 、 一年中{いちねんじゅう} 楽{たの}しめます 。',
    gloss: { 季節: 'musim', 桜: 'sakura', 花見: 'piknik melihat sakura', 蒸し暑い: 'gerah', 花火: 'kembang api', 大会: 'festival, perlombaan', 紅葉: 'daun merah musim gugur', 地方: 'daerah', 一年中: 'sepanjang tahun' },
    quiz: [
      { q: 'Apa yang dilakukan banyak orang di musim semi?', a: 'Hanami (melihat sakura)', wrong: ['Bermain ski', 'Melihat daun merah', 'Berenang di laut'] },
      { q: 'Seperti apa musim panas?', a: 'Gerah tapi meriah dengan festival', wrong: ['Sejuk dan sepi', 'Bersalju', 'Hujan terus'] },
      { q: 'Kenapa Jepang bisa dinikmati sepanjang tahun?', a: 'Makanannya ikut berubah tiap musim', wrong: ['Tidak ada musim dingin', 'Selalu ada festival', 'Cuacanya selalu hangat'] },
    ],
  },
  {
    id: 'terewaaku', level: 'N2', title: 'テレワーク', titleId: 'Kerja jarak jauh',
    text: '最近{さいきん} 、 自宅{じたく} で 仕事{しごと} を する テレワーク が 広{ひろ}がっている 。 / 通勤{つうきん} 時間{じかん} が ない ため 、 家族{かぞく} と 過{す}ごす 時間{じかん} が 増{ふ}えた という 声{こえ} が 多{おお}い 。 / その 一方{いっぽう} で 、 同僚{どうりょう} と 直接{ちょくせつ} 話{はな}す 機会{きかい} が 減{へ}り 、 孤独{こどく} を 感{かん}じる 人{ひと} も 少{すく}なくない 。 / 今後{こんご} は 出社{しゅっしゃ} と テレワーク を 組{く}み合{あ}わせる 働{はたら}き方{かた} が 主流{しゅりゅう} に なる だろう 。',
    gloss: { 自宅: 'rumah sendiri', テレワーク: 'kerja jarak jauh', 広がっている: 'sedang meluas', 通勤: 'perjalanan ke kantor', 過ごす: 'menghabiskan waktu', 一方: 'di sisi lain', 同僚: 'rekan kerja', 直接: 'langsung', 孤独: 'kesepian', 出社: 'masuk kantor', 組み合わせる: 'menggabungkan', 主流: 'arus utama' },
    quiz: [
      { q: 'Apa keuntungan kerja jarak jauh menurut teks?', a: 'Waktu bersama keluarga bertambah', wrong: ['Gaji naik', 'Pekerjaan berkurang', 'Bisa pindah kota'] },
      { q: 'Apa kekurangannya?', a: 'Jarang bicara langsung dengan rekan, sehingga kesepian', wrong: ['Internet lambat', 'Harus bangun lebih pagi', 'Biaya transportasi naik'] },
      { q: 'Apa prediksi penulis?', a: 'Gabungan masuk kantor dan kerja jarak jauh jadi arus utama', wrong: ['Semua kantor akan tutup', 'Kerja jarak jauh akan dilarang', 'Semua orang kembali ke kantor'] },
    ],
  },
  {
    id: 'keigo', level: 'N2', title: '敬語{けいご} の 悩{なや}み', titleId: 'Kesulitan bahasa hormat',
    text: '日本語{にほんご} を 勉強{べんきょう}している 外国人{がいこくじん} にとって 、 敬語{けいご} は 大{おお}きな 壁{かべ} だ 。 / 尊敬語{そんけいご} と 謙譲語{けんじょうご} の 区別{くべつ} は 、 日本人{にほんじん} で さえ 間違{まちが}える こと が ある 。 / しかし 、 完璧{かんぺき} で なくて も 、 相手{あいて} を 大切{たいせつ} に しよう と する 気持{きも}ち は 伝{つた}わる もの だ 。 / 間違{まちが}い を 恐{おそ}れず に 使{つか}って みる こと が 、 上達{じょうたつ} の 近道{ちかみち} だろう 。',
    gloss: { 敬語: 'bahasa hormat', 壁: 'tembok, hambatan', 尊敬語: 'bahasa meninggikan lawan bicara', 謙譲語: 'bahasa merendahkan diri', 区別: 'perbedaan', さえ: 'bahkan', 完璧: 'sempurna', 相手: 'lawan bicara', 伝わる: 'tersampaikan', 恐れず: 'tanpa takut', 上達: 'kemajuan', 近道: 'jalan pintas' },
    quiz: [
      { q: 'Apa kata teks tentang orang Jepang sendiri?', a: 'Bahkan mereka kadang salah membedakan keigo', wrong: ['Mereka selalu sempurna', 'Mereka tidak memakai keigo', 'Mereka tidak peduli keigo'] },
      { q: 'Apa yang tetap tersampaikan walau tidak sempurna?', a: 'Niat menghargai lawan bicara', wrong: ['Tata bahasa yang benar', 'Aksen yang bagus', 'Kosakata yang sulit'] },
      { q: 'Apa saran penulis?', a: 'Coba pakai tanpa takut salah', wrong: ['Hafalkan semuanya dulu', 'Hindari keigo', 'Hanya bicara dengan teman'] },
    ],
  },
  {
    id: 'shinise', level: 'N1', title: '伝統{でんとう} と 革新{かくしん}', titleId: 'Tradisi dan inovasi',
    text: '京都{きょうと} の 老舗{しにせ} の 中{なか} に は 、 創業{そうぎょう} 数百年{すうひゃくねん} を 誇{ほこ}る 店{みせ} も 少{すく}なくない 。 / 彼{かれ}ら が 生{い}き残{のこ}って きた の は 、 伝統{でんとう} を 守{まも}る ばかり で なく 、 時代{じだい} に 合{あ}わせて 変化{へんか} を 恐{おそ}れなかった から に ほかならない 。 / 守{まも}る べき もの と 変{か}える べき もの を 見極{みきわ}める 目{め} こそ が 、 老舗{しにせ} の 真{しん} の 財産{ざいさん} と 言{い}える だろう 。',
    gloss: { 老舗: 'toko legendaris', 創業: 'pendirian usaha', 数百年: 'ratusan tahun', 誇る: 'membanggakan', 生き残って: 'bertahan hidup', 伝統: 'tradisi', 変化: 'perubahan', ほかならない: 'tidak lain adalah', 見極める: 'menilai dengan cermat', 財産: 'harta' },
    quiz: [
      { q: 'Mengapa toko-toko lama itu bisa bertahan?', a: 'Menjaga tradisi sekaligus berani berubah', wrong: ['Harganya murah', 'Tidak pernah berubah', 'Dibantu pemerintah'] },
      { q: 'Apa "harta sejati" toko legendaris menurut penulis?', a: 'Kemampuan menilai apa yang dijaga dan apa yang diubah', wrong: ['Bangunan tua', 'Resep rahasia', 'Jumlah pelanggan'] },
      { q: 'Berapa usia sebagian toko itu?', a: 'Ratusan tahun', wrong: ['Puluhan tahun', 'Ribuan tahun', 'Lima tahun'] },
    ],
  },
  {
    id: 'ai-gengo', level: 'N1', title: 'AI と 言語{げんご} 学習{がくしゅう}', titleId: 'AI dan belajar bahasa',
    text: '翻訳{ほんやく} ソフト の 精度{せいど} が 飛躍的{ひやくてき} に 向上{こうじょう}した 今日{こんにち} 、 外国語{がいこくご} を 学{まな}ぶ 意義{いぎ} を 問{と}う 声{こえ} も 聞{き}かれる 。 / だが 、 言葉{ことば} の 背後{はいご} に ある 文化{ぶんか} や 感情{かんじょう} を 汲{く}み取{と}る 力{ちから} は 、 自{みずか}ら 学{まな}んで こそ 身{み} に つく もの だ 。 / 機械{きかい} に 頼{たよ}る のみ ならず 、 それ を 学習{がくしゅう} の 道具{どうぐ} と して 使{つか}いこなす 姿勢{しせい} が 求{もと}められて いる 。',
    gloss: { 精度: 'ketepatan', 飛躍的: 'melonjak', 向上した: 'meningkat', 今日: 'dewasa ini', 意義: 'makna', 問う: 'mempertanyakan', 背後: 'latar, di balik', 汲み取る: 'menangkap (maksud)', 自ら: 'sendiri', 使いこなす: 'menguasai pemakaian', 姿勢: 'sikap' },
    quiz: [
      { q: 'Apa yang dipertanyakan sebagian orang?', a: 'Makna belajar bahasa asing', wrong: ['Harga software', 'Keamanan internet', 'Kualitas guru'] },
      { q: 'Apa yang hanya didapat dengan belajar sendiri?', a: 'Kemampuan menangkap budaya dan perasaan di balik kata', wrong: ['Kecepatan mengetik', 'Kosakata teknis', 'Sertifikat bahasa'] },
      { q: 'Sikap apa yang dibutuhkan?', a: 'Memakai mesin sebagai alat belajar', wrong: ['Berhenti memakai mesin', 'Hanya memakai mesin', 'Menunggu teknologi lebih baik'] },
    ],
  },
]
