import type { Level } from './kanji'

export interface Pattern {
  id: string
  level: Level
  title: string
  explain: string          // concept card: at most 3 sentences
  sentences: [string, string][]   // [markup, translation]; markup format in engine/sentence.ts
}

export const GRAMMAR: Pattern[] = [
  // ── N5 ──
  { id: 'wa', level: 'N5', title: 'A は B です', explain: 'は (dibaca "wa") menandai topik kalimat. です di akhir membuatnya sopan: "A adalah B".', sentences: [
    ['わたし *は 学生{がくせい} です', 'Saya adalah pelajar.'],
    ['これ *は 本{ほん} です', 'Ini buku.'],
    ['田中{たなか}さん *は 先生{せんせい} です', 'Tanaka-san adalah guru.'],
    ['今日{きょう} *は 月曜日{げつようび} です', 'Hari ini hari Senin.'],
  ] },
  { id: 'ka', level: 'N5', title: '〜か (pertanyaan)', explain: 'Tambahkan か di akhir kalimat sopan untuk bertanya. Urutan kata tidak berubah.', sentences: [
    ['あなた は 学生{がくせい} です *か', 'Apakah kamu pelajar?'],
    ['これ は 何{なん} です *か', 'Ini apa?'],
    ['トイレ は どこ です *か', 'Toiletnya di mana?'],
    ['コーヒー を 飲{の}みます *か', 'Mau minum kopi?'],
  ] },
  { id: 'no', level: 'N5', title: 'A の B', explain: 'の menghubungkan dua kata benda: A の B = "B milik/tentang A". Urutannya terbalik dari bahasa Indonesia.', sentences: [
    ['これ は わたし *の 本{ほん} です', 'Ini buku saya.'],
    ['日本語{にほんご} *の 先生{せんせい} です', 'Dia guru bahasa Jepang.'],
    ['友{とも}だち *の 車{くるま} です', 'Itu mobil teman.'],
    ['あれ は だれ *の かさ です か', 'Itu payung siapa?'],
  ] },
  { id: 'mo', level: 'N5', title: '〜も (juga)', explain: 'も menggantikan は, が, atau を dan berarti "juga".', sentences: [
    ['わたし *も 学生{がくせい} です', 'Saya juga pelajar.'],
    ['これ *も 百円{ひゃくえん} です', 'Ini juga seratus yen.'],
    ['あした *も 来{き}ます', 'Besok juga datang.'],
    ['パン *も 食{た}べます', 'Saya makan roti juga.'],
  ] },
  { id: 'wo', level: 'N5', title: '〜を (objek)', explain: 'を (dibaca "o") menandai objek yang dikenai kata kerja. Kata kerjanya selalu di akhir.', sentences: [
    ['水{みず} *を 飲{の}みます', 'Saya minum air.'],
    ['本{ほん} *を 読{よ}みます', 'Saya membaca buku.'],
    ['毎朝{まいあさ} パン *を 食{た}べます', 'Setiap pagi saya makan roti.'],
    ['テレビ *を 見{み}ます', 'Saya menonton TV.'],
  ] },
  { id: 'ni', level: 'N5', title: '〜に (waktu / tujuan)', explain: 'に menandai waktu yang spesifik (jam, hari) dan tujuan gerakan atau penerima.', sentences: [
    ['七時{しちじ} *に 起{お}きます', 'Saya bangun jam tujuh.'],
    ['日曜日{にちようび} *に 映画{えいが} を 見{み}ます', 'Hari Minggu saya menonton film.'],
    ['学校{がっこう} *に 行{い}きます', 'Saya pergi ke sekolah.'],
    ['友{とも}だち *に 電話{でんわ} を かけます', 'Saya menelepon teman.'],
  ] },
  { id: 'de', level: 'N5', title: '〜で (tempat / alat)', explain: 'で menandai tempat terjadinya kegiatan, atau alat/cara melakukannya.', sentences: [
    ['図書館{としょかん} *で 勉強{べんきょう} します', 'Saya belajar di perpustakaan.'],
    ['バス *で 学校{がっこう} へ 行{い}きます', 'Saya pergi ke sekolah naik bus.'],
    ['はし *で ご飯{はん} を 食{た}べます', 'Saya makan nasi dengan sumpit.'],
    ['日本語{にほんご} *で 話{はな}します', 'Saya berbicara dalam bahasa Jepang.'],
  ] },
  { id: 'e', level: 'N5', title: '〜へ (arah)', explain: 'へ (dibaca "e") menandai arah tujuan, mirip に. Dipakai dengan 行きます, 来ます, 帰ります.', sentences: [
    ['日本{にほん} *へ 行{い}きます', 'Saya pergi ke Jepang.'],
    ['うち *へ 帰{かえ}ります', 'Saya pulang ke rumah.'],
    ['どこ *へ 行{い}きます か', 'Pergi ke mana?'],
    ['来年{らいねん} 東京{とうきょう} *へ 行{い}きます', 'Tahun depan saya pergi ke Tokyo.'],
  ] },
  { id: 'to', level: 'N5', title: '〜と (dengan / dan)', explain: 'と berarti "bersama" untuk orang, atau "dan" untuk daftar kata benda yang lengkap.', sentences: [
    ['友{とも}だち *と 映画{えいが} を 見{み}ます', 'Saya menonton film dengan teman.'],
    ['パン *と 牛乳{ぎゅうにゅう} を 買{か}います', 'Saya membeli roti dan susu.'],
    ['母{はは} *と 話{はな}しました', 'Saya berbicara dengan ibu.'],
    ['だれ *と 行{い}きます か', 'Pergi dengan siapa?'],
  ] },
  { id: 'aru-iru', level: 'N5', title: '〜が あります / います', explain: 'あります = ada (benda mati, tumbuhan). います = ada (manusia, hewan). Tempatnya ditandai に.', sentences: [
    ['机{つくえ} の 上{うえ} に 本{ほん} が *あります', 'Ada buku di atas meja.'],
    ['公園{こうえん} に 子{こ}ども が *います', 'Ada anak-anak di taman.'],
    ['部屋{へや} に ねこ が *います', 'Ada kucing di kamar.'],
    ['駅{えき} の 近{ちか}く に 銀行{ぎんこう} が *あります', 'Ada bank di dekat stasiun.'],
  ] },
  { id: 'masen', level: 'N5', title: '〜ません (tidak …)', explain: 'Ganti ます dengan ません untuk bentuk negatif sopan.', sentences: [
    ['肉{にく} を *食{た}べません', 'Saya tidak makan daging.'],
    ['あした は 学校{がっこう} へ *行{い}きません', 'Besok saya tidak pergi ke sekolah.'],
    ['お酒{さけ} を *飲{の}みません', 'Saya tidak minum alkohol.'],
    ['日曜日{にちようび} は *働{はたら}きません', 'Hari Minggu saya tidak bekerja.'],
  ] },
  { id: 'mashita', level: 'N5', title: '〜ました (sudah …)', explain: 'Ganti ます dengan ました untuk lampau sopan. Negatifnya ませんでした.', sentences: [
    ['きのう 映画{えいが} を *見{み}ました', 'Kemarin saya menonton film.'],
    ['けさ パン を *食{た}べました', 'Tadi pagi saya makan roti.'],
    ['先週{せんしゅう} 京都{きょうと} へ *行{い}きました', 'Minggu lalu saya pergi ke Kyoto.'],
    ['日本語{にほんご} を *勉強{べんきょう}しました', 'Saya belajar bahasa Jepang.'],
  ] },
  { id: 'tai', level: 'N5', title: '〜たいです (ingin …)', explain: 'Bentuk ます tanpa ます + たいです = "ingin melakukan". Objeknya boleh を atau が.', sentences: [
    ['日本{にほん} へ *行{い}きたい です', 'Saya ingin pergi ke Jepang.'],
    ['すし を *食{た}べたい です', 'Saya ingin makan sushi.'],
    ['新{あたら}しい くつ を *買{か}いたい です', 'Saya ingin membeli sepatu baru.'],
    ['何{なに} を *飲{の}みたい です か', 'Ingin minum apa?'],
  ] },
  { id: 'te-kudasai', level: 'N5', title: '〜てください (tolong …)', explain: 'Bentuk て + ください = permintaan sopan "tolong lakukan".', sentences: [
    ['ここ に 名前{なまえ} を *書{か}いてください', 'Tolong tulis nama di sini.'],
    ['ちょっと *待{ま}ってください', 'Tolong tunggu sebentar.'],
    ['ゆっくり *話{はな}してください', 'Tolong bicara pelan-pelan.'],
    ['窓{まど} を *開{あ}けてください', 'Tolong buka jendelanya.'],
  ] },
  { id: 'te-imasu', level: 'N5', title: '〜ています (sedang …)', explain: 'Bentuk て + います = sedang berlangsung, atau keadaan yang berlanjut.', sentences: [
    ['いま 雨{あめ} が *降{ふ}っています', 'Sekarang sedang hujan.'],
    ['弟{おとうと} は テレビ を *見{み}ています', 'Adik laki-laki sedang menonton TV.'],
    ['母{はは} は 料理{りょうり} を *作{つく}っています', 'Ibu sedang memasak.'],
    ['何{なに} を *しています か', 'Sedang apa?'],
  ] },
  { id: 'mashou', level: 'N5', title: '〜ましょう (ayo …)', explain: 'Ganti ます dengan ましょう untuk mengajak. 〜ませんか lebih halus: "maukah …?"', sentences: [
    ['いっしょに *帰{かえ}りましょう', 'Ayo pulang bersama.'],
    ['少{すこ}し *休{やす}みましょう', 'Ayo istirahat sebentar.'],
    ['昼{ひる}ご飯{はん} を *食{た}べましょう', 'Ayo makan siang.'],
    ['駅{えき} で *会{あ}いましょう', 'Ayo bertemu di stasiun.'],
  ] },
  { id: 'kara', level: 'N5', title: '〜から (karena)', explain: 'Alasan + から + hasil. Berbeda dari bahasa Indonesia, alasannya datang lebih dulu.', sentences: [
    ['暑{あつ}い *から 窓{まど} を 開{あ}けます', 'Karena panas, saya buka jendela.'],
    ['時間{じかん} が ない *から タクシー で 行{い}きます', 'Karena tidak ada waktu, saya naik taksi.'],
    ['おいしい *から もう 一{ひと}つ 食{た}べます', 'Karena enak, saya makan satu lagi.'],
    ['あした テスト が ある *から 勉強{べんきょう} します', 'Karena besok ada tes, saya belajar.'],
  ] },
  { id: 'ga-suki', level: 'N5', title: '〜が 好きです', explain: 'Hal yang disukai ditandai が, bukan を. Sama juga untuk 上手, 下手, dan わかります.', sentences: [
    ['わたし は 音楽{おんがく} *が 好{す}き です', 'Saya suka musik.'],
    ['アニメ *が 好{す}き です か', 'Suka anime?'],
    ['兄{あに} は サッカー *が 好{す}き です', 'Kakak laki-laki saya suka sepak bola.'],
    ['甘{あま}い もの *が 好{す}き です', 'Saya suka makanan manis.'],
  ] },
  { id: 'kunai', level: 'N5', title: 'Kata sifat い: 〜くないです', explain: 'Untuk negatif, ganti い terakhir dengan くない. Pengecualian: いい menjadi よくない.', sentences: [
    ['この ラーメン は *高{たか}くない です', 'Ramen ini tidak mahal.'],
    ['今日{きょう} は *寒{さむ}くない です', 'Hari ini tidak dingin.'],
    ['その 本{ほん} は *おもしろくない です', 'Buku itu tidak menarik.'],
    ['部屋{へや} は *広{ひろ}くない です', 'Kamarnya tidak luas.'],
  ] },
  { id: 'yori', level: 'N5', title: 'A は B より 〜', explain: 'より = "daripada". A は B より [sifat] = A lebih … daripada B.', sentences: [
    ['電車{でんしゃ} は バス *より 速{はや}い です', 'Kereta lebih cepat daripada bus.'],
    ['夏{なつ} は 冬{ふゆ} *より 暑{あつ}い です', 'Musim panas lebih panas daripada musim dingin.'],
    ['犬{いぬ} *より ねこ の ほう が 好{す}き です', 'Saya lebih suka kucing daripada anjing.'],
    ['東京{とうきょう} は 大阪{おおさか} *より 大{おお}きい です', 'Tokyo lebih besar daripada Osaka.'],
  ] },
  // ── N4 ──
  { id: 'ta-koto', level: 'N4', title: '〜たことがあります', explain: 'Bentuk た + ことがあります = "pernah". Negatifnya ことがありません (belum pernah).', sentences: [
    ['日本{にほん} へ *行{い}ったことがあります', 'Saya pernah pergi ke Jepang.'],
    ['すし を *食{た}べたことがあります か', 'Pernah makan sushi?'],
    ['富士山{ふじさん} に *登{のぼ}ったことがありません', 'Saya belum pernah mendaki Gunung Fuji.'],
  ] },
  { id: 'temo-ii', level: 'N4', title: '〜てもいいです', explain: 'Bentuk て + もいいです = "boleh". Tambah か untuk meminta izin.', sentences: [
    ['ここ で 写真{しゃしん} を *撮{と}ってもいいです か', 'Bolehkah memotret di sini?'],
    ['窓{まど} を *開{あ}けてもいいです か', 'Bolehkah saya membuka jendela?'],
    ['もう *帰{かえ}ってもいいです よ', 'Sudah boleh pulang, lho.'],
  ] },
  { id: 'nakereba', level: 'N4', title: '〜なければなりません', explain: 'Bentuk ない tanpa い + ければなりません = "harus". Dalam percakapan sering disingkat 〜なきゃ.', sentences: [
    ['あした 早{はや}く *起{お}きなければなりません', 'Besok saya harus bangun pagi.'],
    ['薬{くすり} を *飲{の}まなければなりません', 'Saya harus minum obat.'],
    ['宿題{しゅくだい} を *出{だ}さなければなりません', 'Saya harus mengumpulkan PR.'],
  ] },
  { id: 'sou', level: 'N4', title: '〜そうです (kelihatannya)', explain: 'Kata sifat tanpa い (atau bentuk ます tanpa ます) + そうです = "kelihatannya". Pengecualian: いい menjadi よさそう.', sentences: [
    ['この ケーキ は *おいしそうです', 'Kue ini kelihatannya enak.'],
    ['雨{あめ} が *降{ふ}りそうです', 'Kelihatannya akan hujan.'],
    ['田中{たなか}さん は *元気{げんき}そうです', 'Tanaka-san kelihatan sehat.'],
  ] },
  { id: 'tsumori', level: 'N4', title: '〜つもりです', explain: 'Kata kerja bentuk kamus (atau ない) + つもりです = "berniat / berencana".', sentences: [
    ['来年{らいねん} 日本{にほん} へ 行{い}く *つもりです', 'Tahun depan saya berencana pergi ke Jepang.'],
    ['週末{しゅうまつ} は 家{いえ} で 休{やす}む *つもりです', 'Akhir pekan saya berniat istirahat di rumah.'],
    ['もう タバコ は 吸{す}わない *つもりです', 'Saya berniat tidak merokok lagi.'],
  ] },
  { id: 'nagara', level: 'N4', title: '〜ながら (sambil)', explain: 'Bentuk ます tanpa ます + ながら = "sambil". Kegiatan utamanya di akhir kalimat.', sentences: [
    ['音楽{おんがく} を *聞{き}きながら 勉強{べんきょう} します', 'Saya belajar sambil mendengarkan musik.'],
    ['*歩{ある}きながら 話{はな}しましょう', 'Mari bicara sambil berjalan.'],
    ['テレビ を *見{み}ながら ご飯{はん} を 食{た}べます', 'Saya makan sambil menonton TV.'],
  ] },
  { id: 'tara', level: 'N4', title: '〜たら (kalau / setelah)', explain: 'Bentuk た + ら = "kalau …" atau "setelah …". Sangat umum dalam percakapan.', sentences: [
    ['雨{あめ} が *降{ふ}ったら 行{い}きません', 'Kalau hujan, saya tidak pergi.'],
    ['駅{えき} に *着{つ}いたら 電話{でんわ} して ください', 'Kalau sudah sampai di stasiun, tolong telepon.'],
    ['お金{かね} が *あったら 車{くるま} を 買{か}いたい です', 'Kalau punya uang, saya ingin membeli mobil.'],
  ] },
  { id: 'tame', level: 'N4', title: '〜ために (untuk / demi)', explain: 'Kata kerja bentuk kamus atau kata benda + の + ために = tujuan, "untuk / demi".', sentences: [
    ['日本{にほん} で 働{はたら}く *ために 日本語{にほんご} を 勉強{べんきょう} します', 'Saya belajar bahasa Jepang untuk bekerja di Jepang.'],
    ['健康{けんこう} の *ために 毎日{まいにち} 歩{ある}きます', 'Demi kesehatan, saya berjalan setiap hari.'],
    ['家{いえ} を 買{か}う *ために お金{かね} を ためて います', 'Saya menabung untuk membeli rumah.'],
  ] },
  { id: 'te-shimau', level: 'N4', title: '〜てしまいました', explain: 'Bentuk て + しまいました = terlanjur atau tidak sengaja, sering bernada menyesal.', sentences: [
    ['さいふ を *なくしてしまいました', 'Dompet saya hilang.'],
    ['宿題{しゅくだい} を *忘{わす}れてしまいました', 'Saya lupa PR.'],
    ['ケーキ を 全部{ぜんぶ} *食{た}べてしまいました', 'Saya terlanjur makan semua kuenya.'],
  ] },
  { id: 'to-omou', level: 'N4', title: '〜と思います', explain: 'Bentuk biasa + と思います = "saya pikir / menurut saya". Untuk kata benda dan sifat な, tambahkan だ.', sentences: [
    ['あした は 雨{あめ} が 降{ふ}る *と思います', 'Saya pikir besok akan hujan.'],
    ['この 映画{えいが} は おもしろい *と思います', 'Menurut saya film ini menarik.'],
    ['田中{たなか}さん は 来{こ}ない *と思います', 'Saya pikir Tanaka-san tidak datang.'],
  ] },
  // ── N3 ──
  { id: 'you-ni-suru', level: 'N3', title: '〜ようにする', explain: 'Kata kerja + ようにする = berusaha membiasakan sesuatu. ようにしている menunjukkan kebiasaan yang sedang dijaga.', sentences: [
    ['毎日{まいにち} 野菜{やさい} を 食{た}べる *ようにしています', 'Saya berusaha makan sayur setiap hari.'],
    ['遅刻{ちこく} しない *ようにします', 'Saya akan berusaha tidak terlambat.'],
    ['寝{ね}る 前{まえ} に スマホ を 見{み}ない *ようにしている', 'Saya berusaha tidak melihat HP sebelum tidur.'],
  ] },
  { id: 'koto-ni-suru', level: 'N3', title: '〜ことにする', explain: 'Kata kerja + ことにする = memutuskan sendiri. ことになる = diputuskan (oleh keadaan atau orang lain).', sentences: [
    ['来年{らいねん} 留学{りゅうがく}する *ことにしました', 'Saya memutuskan belajar ke luar negeri tahun depan.'],
    ['今日{きょう} は 早{はや}く 寝{ね}る *ことにする', 'Hari ini aku putuskan tidur cepat.'],
    ['タバコ を やめる *ことにしました', 'Saya memutuskan berhenti merokok.'],
  ] },
  { id: 'bakari', level: 'N3', title: '〜たばかり / 〜ばかり', explain: 'Bentuk た + ばかり = baru saja. Kata benda + ばかり = melulu, hanya itu-itu saja.', sentences: [
    ['日本{にほん} に 来{き}た *ばかり です', 'Saya baru saja datang ke Jepang.'],
    ['昼{ひる}ご飯{はん} を 食{た}べた *ばかり です', 'Saya baru saja makan siang.'],
    ['弟{おとうと} は ゲーム *ばかり している', 'Adik saya main game melulu.'],
  ] },
  { id: 'rashii', level: 'N3', title: '〜らしい', explain: 'Bentuk biasa + らしい = "katanya / kabarnya", berdasarkan informasi yang didengar.', sentences: [
    ['あの 店{みせ} は おいしい *らしい です', 'Katanya toko itu enak.'],
    ['明日{あした} は 雨{あめ} *らしい', 'Katanya besok hujan.'],
    ['田中{たなか}さん は 結婚{けっこん}した *らしい', 'Kabarnya Tanaka-san sudah menikah.'],
  ] },
  { id: 'you-ni', level: 'N3', title: '〜ように (agar)', explain: 'Kata kerja bentuk kamus/ない + ように = "agar / supaya". Sering dengan kata kerja potensial atau tak disengaja.', sentences: [
    ['忘{わす}れない *ように メモ します', 'Saya mencatat agar tidak lupa.'],
    ['聞{き}こえる *ように 大{おお}きい 声{こえ} で 話{はな}して ください', 'Tolong bicara keras agar terdengar.'],
    ['風邪{かぜ} を ひかない *ように 気{き} を つけて', 'Hati-hati agar tidak masuk angin.'],
  ] },
  { id: 'okage', level: 'N3', title: '〜おかげで', explain: 'X のおかげで = berkat X (hasil baik). Lawannya せいで untuk hasil buruk.', sentences: [
    ['先生{せんせい} の *おかげで 合格{ごうかく}できました', 'Berkat guru, saya bisa lulus.'],
    ['薬{くすり} の *おかげで よく なりました', 'Berkat obat, saya membaik.'],
    ['友{とも}だち が 手伝{てつだ}って くれた *おかげで 早{はや}く 終{お}わった', 'Berkat bantuan teman, cepat selesai.'],
  ] },
  { id: 'sei-de', level: 'N3', title: '〜せいで', explain: 'X のせいで = gara-gara X (hasil buruk, menyalahkan).', sentences: [
    ['雨{あめ} の *せいで 試合{しあい} が 中止{ちゅうし}に なった', 'Gara-gara hujan, pertandingan dibatalkan.'],
    ['寝坊{ねぼう}した *せいで 遅刻{ちこく}した', 'Gara-gara kesiangan, saya terlambat.'],
    ['君{きみ} の *せいで 怒{おこ}られた', 'Gara-gara kamu, aku dimarahi.'],
  ] },
  { id: 'ni-yotte', level: 'N3', title: '〜によって', explain: 'によって = oleh (pelaku pasif), akibat, atau "tergantung pada".', sentences: [
    ['この 絵{え} は ピカソ *によって 描{か}かれた', 'Lukisan ini dilukis oleh Picasso.'],
    ['人{ひと} *によって 考{かんが}え方{かた} が 違{ちが}う', 'Cara berpikir berbeda tergantung orangnya.'],
    ['地震{じしん} *によって 家{いえ} が 壊{こわ}れた', 'Rumah rusak akibat gempa.'],
  ] },
  { id: 'wake-dewa-nai', level: 'N3', title: '〜わけではない', explain: 'わけではない = "bukan berarti…". Menyangkal sebagian, lebih halus daripada "tidak".', sentences: [
    ['嫌{きら}いな *わけではない', 'Bukan berarti saya benci.'],
    ['全部{ぜんぶ} 分{わ}かる *わけではない', 'Bukan berarti saya paham semuanya.'],
    ['お金{かね} が ない *わけではない', 'Bukan berarti saya tidak punya uang.'],
  ] },
  { id: 'hazu', level: 'N3', title: '〜はずだ', explain: 'はずだ = "seharusnya", keyakinan berdasarkan alasan logis.', sentences: [
    ['彼{かれ} は もう 着{つ}いた *はずだ', 'Dia seharusnya sudah tiba.'],
    ['鍵{かぎ} は ここ に ある *はずです', 'Kuncinya seharusnya ada di sini.'],
    ['今日{きょう} は 休{やす}み の *はずだ', 'Hari ini seharusnya libur.'],
  ] },
  { id: 'saseru', level: 'N3', title: '〜させる (kausatif)', explain: 'Kausatif させる = menyuruh atau membiarkan seseorang melakukan sesuatu. Yang disuruh ditandai に.', sentences: [
    ['母{はは} は 弟{おとうと} に 野菜{やさい} を *食{た}べさせた', 'Ibu menyuruh adik makan sayur.'],
    ['先生{せんせい} は 学生{がくせい} に 作文{さくぶん} を *書{か}かせた', 'Guru menyuruh murid menulis karangan.'],
    ['子{こ}ども を 公園{こうえん} で *遊{あそ}ばせる', 'Membiarkan anak bermain di taman.'],
  ] },
  { id: 'rareru', level: 'N3', title: '〜られる (pasif)', explain: 'Pasif られる = dikenai tindakan. Pelakunya ditandai に, sering untuk hal yang merugikan.', sentences: [
    ['先生{せんせい} に *褒{ほ}められた', 'Saya dipuji guru.'],
    ['電車{でんしゃ} で 足{あし} を *踏{ふ}まれた', 'Kaki saya diinjak di kereta.'],
    ['犬{いぬ} に *噛{か}まれた', 'Saya digigit anjing.'],
  ] },
  // ── N2 ──
  { id: 'ni-totte', level: 'N2', title: '〜にとって', explain: 'X にとって = "bagi X", sudut pandang yang menilai.', sentences: [
    ['私{わたし} *にとって 家族{かぞく} は 一番{いちばん} 大切{たいせつ}だ', 'Bagi saya, keluarga paling penting.'],
    ['学生{がくせい} *にとって この 本{ほん} は 高{たか}い', 'Bagi pelajar, buku ini mahal.'],
    ['子{こ}ども *にとって 遊{あそ}び は 勉強{べんきょう}だ', 'Bagi anak-anak, bermain adalah belajar.'],
  ] },
  { id: 'wake-ni-wa-ikanai', level: 'N2', title: '〜わけにはいかない', explain: 'わけにはいかない = tidak bisa (karena alasan moral atau sosial, bukan kemampuan).', sentences: [
    ['約束{やくそく}した から 行{い}かない *わけにはいかない', 'Karena sudah janji, saya tidak bisa tidak pergi.'],
    ['仕事{しごと} が ある ので 休{やす}む *わけにはいかない', 'Ada pekerjaan, jadi saya tidak bisa libur.'],
    ['秘密{ひみつ} を 話{はな}す *わけにはいかない', 'Saya tidak bisa membocorkan rahasia.'],
  ] },
  { id: 'ni-chigainai', level: 'N2', title: '〜に違いない', explain: 'に違いない = "pasti", keyakinan kuat dari dugaan pembicara.', sentences: [
    ['彼{かれ} が 犯人{はんにん} *に違{ちが}いない', 'Dia pasti pelakunya.'],
    ['この 料理{りょうり} は おいしい *に違{ちが}いない', 'Masakan ini pasti enak.'],
    ['電気{でんき} が ついて いる から 家{いえ} に いる *に違{ちが}いない', 'Lampunya menyala, dia pasti di rumah.'],
  ] },
  { id: 'monono', level: 'N2', title: '〜ものの', explain: 'ものの = "meskipun…, (tetapi)". Hasilnya berlawanan dengan harapan.', sentences: [
    ['買{か}った *ものの 一度{いちど} も 使{つか}って いない', 'Meski sudah dibeli, belum pernah dipakai sekali pun.'],
    ['頑張{がんば}った *ものの 合格{ごうかく}できなかった', 'Meski sudah berusaha, saya tidak lulus.'],
    ['約束{やくそく}した *ものの 行{い}けなかった', 'Meski sudah janji, saya tidak bisa pergi.'],
  ] },
  { id: 'bakarika', level: 'N2', title: '〜ばかりか', explain: 'A ばかりか B も = "bukan hanya A, bahkan B juga".', sentences: [
    ['彼{かれ} は 英語{えいご} *ばかりか 中国語{ちゅうごくご} も 話{はな}せる', 'Dia bukan hanya bisa bahasa Inggris, bahkan Mandarin juga.'],
    ['雨{あめ} *ばかりか 風{かぜ} も 強{つよ}く なった', 'Bukan hanya hujan, angin pun makin kencang.'],
    ['遅刻{ちこく}した *ばかりか 宿題{しゅくだい} も 忘{わす}れた', 'Bukan hanya terlambat, PR pun lupa.'],
  ] },
  { id: 'shidai', level: 'N2', title: '〜次第', explain: 'Bentuk ます tanpa ます + 次第 = "begitu… (segera)". Gaya formal untuk janji tindakan.', sentences: [
    ['着{つ}き *次第{しだい} 連絡{れんらく}します', 'Begitu tiba, saya akan menghubungi.'],
    ['準備{じゅんび} が でき *次第{しだい} 出発{しゅっぱつ}します', 'Begitu siap, kami berangkat.'],
    ['結果{けっか} が 分{わ}かり *次第{しだい} お知{し}らせします', 'Begitu hasilnya diketahui, akan saya kabari.'],
  ] },
  { id: 'osore', level: 'N2', title: '〜おそれがある', explain: 'おそれがある = "dikhawatirkan / ada risiko", sering di berita dan peringatan.', sentences: [
    ['台風{たいふう} が 来{く}る *おそれがある', 'Dikhawatirkan topan akan datang.'],
    ['薬{くすり} を 飲{の}みすぎる と 体{からだ} に 悪{わる}い *おそれがある', 'Minum obat berlebihan berisiko buruk bagi tubuh.'],
    ['大雨{おおあめ} で 川{かわ} が あふれる *おそれがある', 'Dikhawatirkan sungai meluap karena hujan lebat.'],
  ] },
  { id: 'kikkake', level: 'N2', title: '〜をきっかけに', explain: 'X をきっかけに = "berawal dari X", pemicu sebuah perubahan.', sentences: [
    ['留学{りゅうがく} *をきっかけに 料理{りょうり} を 始{はじ}めた', 'Berawal dari kuliah di luar negeri, saya mulai memasak.'],
    ['アニメ *をきっかけに 日本語{にほんご} に 興味{きょうみ} を 持{も}った', 'Berawal dari anime, saya tertarik pada bahasa Jepang.'],
    ['病気{びょうき} *をきっかけに タバコ を やめた', 'Berawal dari sakit, saya berhenti merokok.'],
  ] },
  { id: 'kara-koso', level: 'N2', title: '〜からこそ', explain: 'からこそ = "justru karena…", menekankan alasan.', sentences: [
    ['好{す}き だ *からこそ 厳{きび}しく する', 'Justru karena sayang, saya bersikap tegas.'],
    ['難{むずか}しい *からこそ やる 価値{かち} が ある', 'Justru karena sulit, layak dilakukan.'],
    ['友{とも}だち だ *からこそ 本当{ほんとう} の こと を 言{い}う', 'Justru karena teman, saya berkata jujur.'],
  ] },
  { id: 'kanenai', level: 'N2', title: '〜かねない', explain: 'Bentuk ます tanpa ます + かねない = "bisa-bisa (terjadi hal buruk)".', sentences: [
    ['そんな 運転{うんてん} を したら 事故{じこ} を 起{お}こし *かねない', 'Mengemudi seperti itu bisa-bisa menyebabkan kecelakaan.'],
    ['無理{むり} を すると 病気{びょうき} に なり *かねない', 'Kalau memaksakan diri, bisa-bisa jatuh sakit.'],
    ['彼{かれ} なら 言{い}い *かねない', 'Kalau dia, bisa-bisa saja mengatakannya.'],
  ] },
  // ── N1 ──
  { id: 'zu-ni-wa-irarenai', level: 'N1', title: '〜ずにはいられない', explain: 'Bentuk ない tanpa ない + ずにはいられない = "tidak bisa menahan diri untuk…". する menjadi せず.', sentences: [
    ['その 話{はなし} を 聞{き}いて 泣{な}か *ずにはいられなかった', 'Mendengar cerita itu, saya tak bisa menahan tangis.'],
    ['彼{かれ} の 努力{どりょく} に 感動{かんどう}せ *ずにはいられない', 'Saya tak bisa tidak terharu oleh usahanya.'],
    ['おかしくて 笑{わら}わ *ずにはいられなかった', 'Begitu lucunya sampai tak bisa menahan tawa.'],
  ] },
  { id: 'wo-motte', level: 'N1', title: '〜をもって', explain: 'をもって = "dengan (sarana/sikap)" atau "per (batas waktu)". Gaya resmi.', sentences: [
    ['本日{ほんじつ} *をもって 営業{えいぎょう} を 終了{しゅうりょう}します', 'Per hari ini, kami menutup usaha.'],
    ['書面{しょめん} *をもって お知{し}らせします', 'Kami beritahukan secara tertulis.'],
    ['自信{じしん} *をもって 発表{はっぴょう}した', 'Ia mempresentasikan dengan percaya diri.'],
  ] },
  { id: 'naradewa', level: 'N1', title: '〜ならではの', explain: 'X ならではの Y = Y yang khas X, hanya bisa didapat dari X.', sentences: [
    ['これ は 京都{きょうと} *ならではの 景色{けしき} だ', 'Ini pemandangan khas Kyoto.'],
    ['子{こ}ども *ならではの 発想{はっそう} だ', 'Itu ide yang khas anak-anak.'],
    ['手作{てづく}り *ならではの 味{あじ} が する', 'Rasanya khas buatan tangan.'],
  ] },
  { id: 'nimo-hodo', level: 'N1', title: '〜にもほどがある', explain: 'にもほどがある = "…juga ada batasnya!", kritik keras karena keterlaluan.', sentences: [
    ['冗談{じょうだん} *にもほどがある', 'Bercanda juga ada batasnya!'],
    ['わがまま *にもほどがある', 'Egois juga ada batasnya.'],
    ['遅刻{ちこく} *にもほどがある', 'Terlambat juga ada batasnya.'],
  ] },
  { id: 'to-wa-ie', level: 'N1', title: '〜とはいえ', explain: 'とはいえ = "meskipun demikian / walaupun". Mengakui fakta lalu menyampaikan hal yang berlawanan.', sentences: [
    ['春{はる} *とはいえ まだ 寒{さむ}い', 'Meski sudah musim semi, masih dingin.'],
    ['安{やす}い *とはいえ 必要{ひつよう}ない 物{もの} は 買{か}わない', 'Meski murah, saya tidak membeli barang yang tidak perlu.'],
    ['冗談{じょうだん} *とはいえ 言{い}いすぎ だ', 'Meski bercanda, itu keterlaluan.'],
  ] },
  { id: 'ni-kakawarazu', level: 'N1', title: '〜にかかわらず', explain: 'にかかわらず = "tanpa memandang / tidak peduli", sering dengan pasangan berlawanan seperti 有無.', sentences: [
    ['年齢{ねんれい} *にかかわらず 参加{さんか}できます', 'Bisa ikut tanpa memandang usia.'],
    ['天気{てんき} *にかかわらず 試合{しあい} は 行{おこな}われる', 'Pertandingan tetap diadakan apa pun cuacanya.'],
    ['経験{けいけん} の 有無{うむ} *にかかわらず 応募{おうぼ}できる', 'Bisa melamar, ada atau tidak ada pengalaman.'],
  ] },
  { id: 'tomo-naru-to', level: 'N1', title: '〜ともなると', explain: 'X ともなると = "kalau sudah (sampai tingkat) X", lalu hal yang wajar terjadi.', sentences: [
    ['社長{しゃちょう} *ともなると 忙{いそが}しい', 'Kalau sudah jadi direktur, pasti sibuk.'],
    ['大学生{だいがくせい} *ともなると 自分{じぶん} で 考{かんが}える べき だ', 'Kalau sudah mahasiswa, harus berpikir sendiri.'],
    ['冬{ふゆ} *ともなると この 道{みち} は 雪{ゆき} で 通{とお}れない', 'Kalau sudah musim dingin, jalan ini tak bisa dilewati karena salju.'],
  ] },
  { id: 'ga-saigo', level: 'N1', title: '〜たが最後', explain: 'Bentuk た + が最後 = "begitu… (maka tamatlah / tak bisa kembali)".', sentences: [
    ['彼{かれ} は 寝{ね}た *が最後{さいご} 何{なに} が あって も 起{お}きない', 'Begitu tidur, apa pun yang terjadi dia tidak bangun.'],
    ['この ゲーム を 始{はじ}めた *が最後{さいご} 止{や}められない', 'Begitu mulai game ini, tidak bisa berhenti.'],
    ['秘密{ひみつ} を 知{し}られた *が最後{さいご} だ', 'Begitu rahasianya ketahuan, tamatlah.'],
  ] },
  { id: 'majiki', level: 'N1', title: '〜まじき', explain: 'X にあるまじき = "tidak pantas bagi X". Gaya tulisan yang tegas.', sentences: [
    ['それ は 教師{きょうし} に ある *まじき 行為{こうい} だ', 'Itu tindakan yang tidak pantas bagi seorang guru.'],
    ['許{ゆる}す *まじき 犯罪{はんざい} だ', 'Itu kejahatan yang tak termaafkan.'],
    ['政治家{せいじか} に ある *まじき 発言{はつげん} だ', 'Itu ucapan yang tidak pantas bagi politisi.'],
  ] },
  { id: 'wo-yoso-ni', level: 'N1', title: '〜をよそに', explain: 'X をよそに = "mengabaikan X", bertindak tanpa memedulikan kekhawatiran atau tentangan.', sentences: [
    ['親{おや} の 心配{しんぱい} *をよそに 彼{かれ} は 旅{たび} に 出{で}た', 'Mengabaikan kekhawatiran orang tuanya, ia pergi berkelana.'],
    ['周囲{しゅうい} の 反対{はんたい} *をよそに 二人{ふたり} は 結婚{けっこん}した', 'Mengabaikan penentangan sekitar, mereka berdua menikah.'],
    ['試験{しけん} *をよそに ゲーム ばかり している', 'Mengabaikan ujian, ia main game terus.'],
  ] },
]

export const patternById = new Map(GRAMMAR.map((p) => [`grammar:${p.id}`, p]))
