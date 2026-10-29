/*
 * The Raiden Shogun's conversations. Lines use the sentence markup (tokens split by spaces, 漢字{かんじ}
 * furigana). The Shogun speaks formally; Ei, met in the Plane of Euthymia, is warmer. Each question has
 * Japanese replies: a wrong one gets a correction in character, a good one raises the bond.
 */

export type Speaker = 'shogun' | 'ei' | 'sara' | 'yae'
export interface Line { who: Speaker; ja: string; tr: string }
export interface Option { ja: string; tr: string; ok: boolean; reply: Line }
export interface Question { who: Speaker; ja: string; tr: string; options: Option[] }
export type Beat = Line | Question
export interface Talk { id: string; level: number; title: string; beats: Beat[]; euthymia?: boolean }

export const SPEAKER: Record<Speaker, { name: string; nameJa: string }> = {
  shogun: { name: 'Raiden Shogun', nameJa: '雷電将軍' },
  ei: { name: 'Ei', nameJa: '影' },
  sara: { name: 'Kujou Sara', nameJa: '九条裟羅' },
  yae: { name: 'Yae Miko', nameJa: '八重神子' },
}

const s = (ja: string, tr: string): Line => ({ who: 'shogun', ja, tr })
const e = (ja: string, tr: string): Line => ({ who: 'ei', ja, tr })
const y = (ja: string, tr: string): Line => ({ who: 'yae', ja, tr })
const ok = (ja: string, tr: string, reply: Line): Option => ({ ja, tr, ok: true, reply })
const no = (ja: string, tr: string, reply: Line): Option => ({ ja, tr, ok: false, reply })
const ask = (who: Speaker, ja: string, tr: string, ...options: Option[]): Question => ({ who, ja, tr, options })

/** The summons that opens the questline. */
export const LETTER: Line[] = [
  { who: 'sara', ja: '旅人{たびびと}。 将軍様{しょうぐんさま}が お 呼{よ}び です。', tr: 'Pengembara. Yang Mulia Shogun memanggilmu.' },
  { who: 'sara', ja: '天守閣{てんしゅかく}へ 来{き}なさい。 将軍様{しょうぐんさま}は 鍛錬{たんれん}を 続{つづ}ける 者{もの}を 見{み}て います。', tr: 'Datanglah ke Tenshukaku. Shogun memperhatikan mereka yang terus berlatih.' },
  { who: 'shogun', ja: '私{わたし}は 雷電将軍{らいでんしょうぐん}。 稲妻{いなずま}の 永遠{えいえん}を 守{まも}る 者{もの}です。', tr: 'Aku Raiden Shogun, penjaga keabadian Inazuma.' },
  { who: 'shogun', ja: 'あなたの 覚悟{かくご}を 試{ため}します。 「夢想{むそう}の 試練{しれん}」を 受{う}けなさい。', tr: 'Akan kuuji tekadmu. Terimalah "Ujian Musou".' },
]

export const TALKS: Talk[] = [
  { id: 'meet', level: 1, title: 'Pertemuan di Tenshukaku', beats: [
    s('試練{しれん}を 越{こ}えましたね。 見事{みごと}です。', 'Kau melewati ujiannya. Luar biasa.'),
    ask('shogun', 'あなたの 名前{なまえ}は 何{なん}ですか。', 'Siapa namamu?',
      ok('旅人{たびびと}です。 よろしく お 願{ねが}いします。', 'Saya pengembara. Mohon bimbingannya.', s('よろしい。 礼儀{れいぎ}は 大切{たいせつ}です。', 'Bagus. Sopan santun itu penting.')),
      no('名前{なまえ}は 何{なん}ですか。', 'Siapa namamu?', s('……質問{しつもん}に 質問{しつもん}で 返{かえ}すのですか。', '…Kau menjawab pertanyaan dengan pertanyaan?')),
      no('さようなら。', 'Selamat tinggal.', s('まだ 話{はなし}は 終{お}わって いません。', 'Pembicaraan kita belum selesai.'))),
    s('日本語{にほんご}の 鍛錬{たんれん}を 続{つづ}けなさい。 毎日{まいにち}、 少{すこ}しずつ。', 'Lanjutkan latihan bahasa Jepangmu. Setiap hari, sedikit demi sedikit.'),
  ] },
  { id: 'eternity', level: 1, title: 'Makna keabadian', beats: [
    s('永遠{えいえん}とは、 変{か}わらない ことです。', 'Keabadian adalah sesuatu yang tidak berubah.'),
    ask('shogun', 'あなたは 毎日{まいにち}、 何{なに}を しますか。', 'Apa yang kamu lakukan setiap hari?',
      ok('毎日{まいにち}、 日本語{にほんご}を 勉強{べんきょう}します。', 'Setiap hari saya belajar bahasa Jepang.', s('それは 良{よ}い 習慣{しゅうかん}です。', 'Itu kebiasaan yang baik.')),
      no('昨日{きのう}、 日本語{にほんご}を 勉強{べんきょう}しました。', 'Kemarin saya belajar bahasa Jepang.', s('「毎日{まいにち}」と 聞{き}きました。 過去{かこ}では ありません。', 'Aku bertanya "setiap hari", bukan masa lalu.')),
      no('日本語{にほんご}が 勉強{べんきょう}します。', '(partikel salah)', s('助詞{じょし}が 違{ちが}います。 「を」を 使{つか}いなさい。', 'Partikelnya salah. Gunakan "を".'))),
    s('では、 明日{あした}も 来{き}なさい。', 'Kalau begitu, datanglah lagi besok.'),
  ] },
  { id: 'musou', level: 2, title: 'Pedang Musou no Hitotachi', beats: [
    s('これは 「夢想{むそう}の 一太刀{ひとたち}」。 私{わたし}の 刀{かたな}です。', 'Inilah "Musou no Hitotachi". Pedangku.'),
    ask('shogun', '「刀」は 何{なん}と 読{よ}みますか。', 'Bagaimana membaca "刀"?',
      ok('かたな', 'katana', s('正解{せいかい}です。', 'Benar.')),
      no('やいば', 'yaiba', s('それは 「刃{やいば}」の 読{よ}み方{かた}です。', 'Itu cara baca "刃" (mata pedang).')),
      no('ほのお', 'honoo', s('それは 「炎{ほのお}」です。 刀{かたな}では ありません。', 'Itu "炎" (api), bukan pedang.'))),
    s('言葉{ことば}も 刀{かたな}と 同{おな}じ。 磨{みが}けば、 鋭{するど}く なります。', 'Kata-kata sama seperti pedang. Kalau diasah, ia menjadi tajam.'),
  ] },
  { id: 'dango', level: 2, title: 'Titipan Guuji Yae', beats: [
    s('八重宮司{やえぐうじ}が、 これを 置{お}いて いきました。', 'Guuji Yae meninggalkan ini.'),
    ask('shogun', 'これは 何{なん}ですか。', 'Ini apa?',
      ok('三色{さんしょく} 団子{だんご}です。', 'Ini dango tiga warna.', s('……そうですか。 私{わたし}には 必要{ひつよう} ありません。 でも、 あの 人{ひと}は 好{す}きでしょう。', '…Begitu. Aku tidak memerlukannya. Tapi "dia" pasti menyukainya.')),
      no('お 茶{ちゃ}です。', 'Ini teh.', s('お 茶{ちゃ}では ありません。 よく 見{み}なさい。', 'Ini bukan teh. Lihat baik-baik.')),
      no('刀{かたな}です。', 'Ini pedang.', s('刀{かたな}では ありません。 食{た}べ物{もの}です。', 'Bukan pedang. Ini makanan.'))),
    s('「あの 人{ひと}」が 誰{だれ}か…… いつか 分{わ}かるでしょう。', 'Siapa "dia"… suatu hari kau akan tahu.'),
  ] },
  { id: 'keigo', level: 3, title: 'Bahasa sopan di hadapan Shogun', beats: [
    s('将軍{しょうぐん}に 話{はな}す ときは、 丁寧{ていねい}な 言葉{ことば}を 使{つか}いなさい。', 'Saat berbicara kepada Shogun, gunakan bahasa yang sopan.'),
    ask('shogun', '「行{い}く」の 丁寧{ていねい}な 形{かたち}は？', 'Bentuk sopan dari "iku" (pergi)?',
      ok('行{い}きます', 'ikimasu', s('よろしい。', 'Bagus.')),
      no('行{い}った', 'itta', s('それは 過去形{かこけい}です。', 'Itu bentuk lampau.')),
      no('行{い}こう', 'ikou', s('それは 友達{ともだち}に 使{つか}う 形{かたち}です。', 'Itu bentuk untuk teman (ajakan santai).'))),
    ask('shogun', '「ありがとう」を もっと 丁寧{ていねい}に 言{い}うと？', 'Cara lebih sopan mengucapkan "arigatou"?',
      ok('ありがとう ございます', 'arigatou gozaimasu', s('完璧{かんぺき}です。', 'Sempurna.')),
      no('ありがとう ね', 'arigatou ne', s('親{した}しすぎます。 私{わたし}は 将軍{しょうぐん}ですよ。', 'Terlalu akrab. Aku ini Shogun.')),
      no('すみません', 'sumimasen', s('それは 謝{あやま}る ときにも 使{つか}います。 今{いま}は 感謝{かんしゃ}です。', 'Itu juga dipakai untuk minta maaf. Sekarang yang dimaksud terima kasih.'))),
  ] },
  { id: 'sakura', level: 3, title: 'Sakura dan petir', beats: [
    s('稲妻{いなずま}には、 雷{かみなり}と 桜{さくら}が あります。', 'Di Inazuma ada petir dan sakura.'),
    ask('shogun', '「桜」は どれですか。', 'Yang mana "桜"?',
      ok('さくら', 'sakura', s('そうです。 神桜{しんおう}は 鳴神大社{なるかみたいしゃ}に あります。', 'Benar. Pohon Sakura Suci ada di Kuil Agung Narukami.')),
      no('かみなり', 'kaminari', s('それは 「雷{かみなり}」です。', 'Itu "雷" (petir).')),
      no('うみ', 'umi', s('それは 「海{うみ}」です。', 'Itu "海" (laut).'))),
    s('いつか…… 一緒{いっしょ}に 見{み}に 行{い}きましょう。', 'Suatu hari… mari kita lihat bersama.'),
  ] },
  { id: 'voice', level: 4, title: 'Suara di dalam diri', beats: [
    s('……時々{ときどき}、 私{わたし}の 中{なか}で、 もう 一人{ひとり}の 私{わたし}が 話{はな}します。', '…Kadang, di dalam diriku, ada "aku" yang lain berbicara.'),
    ask('shogun', 'あなたは、 変{か}わる ことが 怖{こわ}いですか。', 'Apakah kamu takut pada perubahan?',
      ok('少{すこ}し 怖{こわ}いです。 でも、 成長{せいちょう}したいです。', 'Sedikit takut. Tapi aku ingin tumbuh.', s('成長{せいちょう}…… それも、 永遠{えいえん}の 一{ひと}つの 形{かたち}かも しれません。', 'Tumbuh… mungkin itu juga salah satu bentuk keabadian.')),
      ok('怖{こわ}くないです！', 'Aku tidak takut!', s('強{つよ}いですね。 その 心{こころ}を 忘{わす}れないで。', 'Kau kuat. Jangan lupakan hati itu.')),
      ok('分{わ}かりません。', 'Aku tidak tahu.', s('正直{しょうじき}ですね。 それで いいのです。', 'Kau jujur. Itu sudah cukup.'))),
  ] },
  { id: 'study', level: 4, title: 'Laporan latihan', beats: [
    ask('shogun', '今日{きょう}は 何{なに}を 勉強{べんきょう}しましたか。', 'Hari ini kamu belajar apa?',
      ok('漢字{かんじ}を 勉強{べんきょう}しました。', 'Saya belajar kanji.', s('漢字{かんじ}は、 一{ひと}つ 一{ひと}つが 小{ちい}さな 刀{かたな}です。', 'Setiap kanji adalah sebilah pedang kecil.')),
      ok('今日{きょう}は 休{やす}みました。', 'Hari ini saya istirahat.', s('休{やす}む ことも 鍛錬{たんれん}の 一部{いちぶ}です。 明日{あした}は 頑張{がんば}りなさい。', 'Istirahat juga bagian dari latihan. Besok berusahalah.')),
      no('漢字{かんじ}が 勉強{べんきょう}しました。', '(partikel salah)', s('「が」では なく 「を」です。', 'Bukan "が", tapi "を".'))),
  ] },
  { id: 'euthymia', level: 5, title: 'Alam Euthymia', euthymia: true, beats: [
    s('……ついて 来{き}なさい。 一心浄土{いっしんじょうど}へ。', '…Ikutlah. Ke Alam Euthymia.'),
    e('ようこそ。 ここは、 私{わたし}の 心{こころ}の 中{なか}です。', 'Selamat datang. Ini adalah bagian dalam hatiku.'),
    e('私{わたし}の 名前{なまえ}は 影{えい}。 あなたには、 そう 呼{よ}んで ほしいです。', 'Namaku Ei. Aku ingin kau memanggilku begitu.'),
    ask('ei', 'あなたに とって、 永遠{えいえん}とは 何{なん}ですか。', 'Bagimu, apa itu keabadian?',
      ok('大切{たいせつ}な 人{ひと}と 一緒{いっしょ}に いる ことです。', 'Bersama orang yang berharga.', e('……一緒{いっしょ}に。 素敵{すてき}な 答{こた}えですね。', '…Bersama. Jawaban yang indah.')),
      ok('毎日{まいにち}、 少{すこ}しずつ 前{まえ}に 進{すす}む ことです。', 'Maju sedikit demi sedikit setiap hari.', e('前{まえ}に 進{すす}む 永遠{えいえん}…… 私{わたし}も 学{まな}びたいです。', 'Keabadian yang terus melangkah… aku juga ingin mempelajarinya.')),
      ok('美{うつく}しい 思{おも}い出{で}です。', 'Kenangan yang indah.', e('思{おも}い出{で}は、 消{き}えない 宝物{たからもの}ですね。', 'Kenangan adalah harta yang tak akan hilang.'))),
    e('これからは、 私{わたし}が あなたの そばに います。', 'Mulai sekarang, aku akan ada di sisimu.'),
  ] },
  { id: 'novel', level: 6, title: 'Novel dari Yae Publishing', beats: [
    e('八重堂{やえどう}の 小説{しょうせつ}を 読{よ}みました。 とても 面白{おもしろ}かったです。', 'Aku membaca novel dari Yae Publishing House. Seru sekali.'),
    ask('ei', 'あなたは 本{ほん}を 読{よ}むのが 好{す}きですか。', 'Kamu suka membaca buku?',
      ok('はい、 大好{だいす}きです。', 'Ya, suka sekali.', e('では、 今度{こんど} おすすめを 教{おし}えて ください。', 'Kalau begitu, lain kali beri tahu aku rekomendasimu.')),
      ok('日本語{にほんご}の 本{ほん}は まだ 難{むずか}しいです。', 'Buku bahasa Jepang masih sulit bagiku.', e('大丈夫{だいじょうぶ}。 一緒{いっしょ}に 読{よ}みましょう。', 'Tidak apa-apa. Ayo baca bersama.')),
      no('本{ほん}を 読{よ}むのが 好{す}きでした です。', '(bentuk salah)', e('ふふ、 「好{す}きでした」で 十分{じゅうぶん}ですよ。', 'Hehe, "suki deshita" saja sudah cukup.'))),
  ] },
  { id: 'sweets', level: 7, title: 'Rahasia kecil Ei', beats: [
    e('甘{あま}い ものは…… 実{じつ}は、 大好{だいす}きです。', 'Makanan manis… sebenarnya aku sangat suka.'),
    ask('ei', '団子{だんご}と お 茶{ちゃ}、 どちらが 好{す}きですか。', 'Dango dan teh, kamu lebih suka yang mana?',
      ok('団子{だんご}の ほうが 好{す}きです。', 'Saya lebih suka dango.', e('私{わたし}も です！ 気{き}が 合{あ}いますね。', 'Aku juga! Kita cocok ya.')),
      ok('お 茶{ちゃ}の ほうが 好{す}きです。', 'Saya lebih suka teh.', e('お 茶{ちゃ}も 良{よ}いですね。 では、 団子{だんご}と 一緒{いっしょ}に。', 'Teh juga enak. Kalau begitu, bersama dango.')),
      no('団子{だんご}が 好{す}きの ほうです。', '(susunan salah)', e('「団子{だんご}の ほうが 好{す}きです」ですね。', 'Maksudmu "dango no hou ga suki desu", ya.'))),
  ] },
  { id: 'tomorrow', level: 8, title: 'Hari esok', beats: [
    e('あなたが 来{き}てから、 毎日{まいにち}が 少{すこ}し 違{ちが}います。', 'Sejak kau datang, setiap hari terasa sedikit berbeda.'),
    ask('ei', '明日{あした}、 何{なに}を したいですか。', 'Besok kamu ingin melakukan apa?',
      ok('影{えい}と 一緒{いっしょ}に 勉強{べんきょう}したいです。', 'Aku ingin belajar bersama Ei.', e('……はい。 待{ま}って います。', '…Iya. Aku akan menunggu.')),
      ok('稲妻{いなずま}を 旅{たび}したいです。', 'Aku ingin menjelajahi Inazuma.', e('では、 私{わたし}が 案内{あんない}しましょう。', 'Kalau begitu, biar aku yang memandumu.')),
      no('明日{あした}、 勉強{べんきょう}したでした。', '(bentuk salah)', e('「したいです」ですね。 ふふ、 緊張{きんちょう}して いますか。', 'Maksudmu "shitai desu". Hehe, kau gugup?'))),
  ] },
  { id: 'rain', level: 9, title: 'Hujan di Narukami', beats: [
    e('雨{あめ}の 音{おと}が 聞{き}こえますか。', 'Kau dengar suara hujan?'),
    ask('ei', '雨{あめ}の 日{ひ}は、 何{なに}を しますか。', 'Saat hari hujan, kamu melakukan apa?',
      ok('家{いえ}で 本{ほん}を 読{よ}みます。', 'Membaca buku di rumah.', e('静{しず}かで、 良{よ}い 時間{じかん}ですね。', 'Waktu yang tenang dan menyenangkan.')),
      ok('傘{かさ}を さして、 散歩{さんぽ}します。', 'Jalan-jalan sambil memakai payung.', e('では、 次{つぎ}は 私{わたし}も 一緒{いっしょ}に。', 'Kalau begitu, lain kali aku ikut.')),
      no('雨{あめ}を 降{ふ}ります。', '(partikel salah)', e('「雨{あめ}が 降{ふ}ります」ですよ。', 'Yang benar "ame ga furimasu".'))),
  ] },
  { id: 'promise', level: 10, title: 'Janji keabadian', beats: [
    e('永遠{えいえん}は、 一人{ひとり}で 守{まも}る ものだと 思{おも}って いました。', 'Dulu kukira keabadian adalah sesuatu yang dijaga seorang diri.'),
    e('でも、 今{いま}は 違{ちが}います。 あなたと 過{す}ごす 時間{じかん}も、 私{わたし}の 永遠{えいえん}です。', 'Tapi sekarang berbeda. Waktu bersamamu juga keabadianku.'),
    ask('ei', 'これからも、 一緒{いっしょ}に いて くれますか。', 'Maukah kau tetap bersamaku mulai sekarang?',
      ok('はい、 ずっと 一緒{いっしょ}に います。', 'Ya, aku akan selalu bersamamu.', e('……ありがとう。 約束{やくそく}ですよ。', '…Terima kasih. Itu janji, ya.')),
      ok('もちろんです。 毎日{まいにち} 会{あ}いに 来{き}ます。', 'Tentu. Aku akan datang menemuimu setiap hari.', e('ふふ。 その 言葉{ことば}、 永遠{えいえん}に 覚{おぼ}えて おきます。', 'Hehe. Kata-kata itu akan kuingat selamanya.'))),
  ] },
]

/** Short daily chats once every story conversation is done; who speaks depends on whether Ei was met. */
export const DAILY: ((who: Speaker) => Talk)[] = [
  (who) => ({ id: 'd-weather', level: 1, title: 'Obrolan harian', beats: [
    ask(who, '今日{きょう}の 天気{てんき}は どうですか。', 'Bagaimana cuaca hari ini?',
      ok('いい 天気{てんき}です。', 'Cuacanya bagus.', { who, ja: 'それは 良{よ}かった。', tr: 'Syukurlah.' }),
      ok('雨{あめ}が 降{ふ}って います。', 'Sedang hujan.', { who, ja: '傘{かさ}を 忘{わす}れないで ください。', tr: 'Jangan lupa payung.' }),
      no('天気{てんき}を いいです。', '(partikel salah)', { who, ja: '「天気{てんき}は いいです」ですね。', tr: 'Yang benar "tenki wa ii desu".' })),
  ] }),
  (who) => ({ id: 'd-food', level: 1, title: 'Obrolan harian', beats: [
    ask(who, '朝{あさ}ご飯{はん}は 何{なに}を 食{た}べましたか。', 'Sarapan tadi makan apa?',
      ok('パンを 食{た}べました。', 'Makan roti.', { who, ja: 'しっかり 食{た}べて、 鍛錬{たんれん}を。', tr: 'Makan yang cukup, lalu berlatih.' }),
      ok('ご飯{はん}と みそ汁{しる}です。', 'Nasi dan sup miso.', { who, ja: '稲妻{いなずま}らしい 朝{あさ}ですね。', tr: 'Pagi yang khas Inazuma.' }),
      no('パンを 食{た}べます 昨日{きのう}。', '(urutan salah)', { who, ja: '過去{かこ}なら 「食{た}べました」です。', tr: 'Kalau lampau, "tabemashita".' })),
  ] }),
  (who) => ({ id: 'd-time', level: 1, title: 'Obrolan harian', beats: [
    ask(who, '毎日{まいにち}、 何時{なんじ}に 寝{ね}ますか。', 'Setiap hari kamu tidur jam berapa?',
      ok('十一時{じゅういちじ}に 寝{ね}ます。', 'Tidur jam sebelas.', { who, ja: '早寝{はやね}は 大切{たいせつ}です。', tr: 'Tidur cepat itu penting.' }),
      ok('夜{よる} 遅{おそ}く 寝{ね}ます。', 'Tidur larut malam.', { who, ja: '体{からだ}を 大切{たいせつ}に して ください。', tr: 'Jaga kesehatanmu.' }),
      no('十一時{じゅういちじ}で 寝{ね}ます。', '(partikel salah)', { who, ja: '時間{じかん}には 「に」を 使{つか}います。', tr: 'Untuk waktu, gunakan "に".' })),
  ] }),
  (who) => ({ id: 'd-like', level: 1, title: 'Obrolan harian', beats: [
    ask(who, '稲妻{いなずま}で 何{なに}が 一番{いちばん} 好{す}きですか。', 'Apa yang paling kamu suka di Inazuma?',
      ok('桜{さくら}が 一番{いちばん} 好{す}きです。', 'Sakura yang paling saya suka.', { who, ja: '私{わたし}も、 桜{さくら}は 好{す}きです。', tr: 'Aku juga suka sakura.' }),
      ok('雷{かみなり}の 音{おと}が 好{す}きです。', 'Saya suka suara petir.', { who, ja: '……ふふ。 光栄{こうえい}です。', tr: '…Hehe. Suatu kehormatan.' }),
      no('桜{さくら}を 一番{いちばん} 好{す}きです。', '(partikel salah)', { who, ja: '「好{す}き」の 前{まえ}は 「が」です。', tr: 'Sebelum "suki" gunakan "が".' })),
  ] }),
]

/**
 * The last secret, 永遠の契り: once the journey reaches N1 and the promise of Lv 10 is spoken, Yae Miko,
 * Guuji of the Grand Narukami Shrine, holds a shrine ceremony for you and Ei (vows before the shrine,
 * then the san-san-kudo cups of a Shinto ceremony). Kept out of TALKS so it is never a daily talk.
 */
export const VOW: Talk = { id: 'vow', level: 10, title: 'Ikrar Keabadian', beats: [
  y('ふふ、 来{き}たわね。 今日{きょう}は 特別{とくべつ}な 日{ひ}よ。', 'Hehe, kau datang juga. Hari ini hari yang istimewa.'),
  y('鳴神大社{なるかみたいしゃ}で、 二人{ふたり}の 永遠{えいえん}の 契{ちぎ}りを 結{むす}びましょう。', 'Di Kuil Agung Narukami, mari kita ikat ikrar keabadian kalian berdua.'),
  e('……少{すこ}し、 緊張{きんちょう}して います。', '…Aku sedikit gugup.'),
  e('あなたと 出会{であ}って、 永遠{えいえん}の 意味{いみ}が 変{か}わりました。', 'Sejak bertemu denganmu, makna keabadian berubah bagiku.'),
  ask('yae', '旅人{たびびと}。 影{えい}を いつまでも 大切{たいせつ}に すると、 誓{ちか}いますか。', 'Pengembara, apakah kau bersumpah akan selalu menyayangi Ei?',
    ok('はい、 誓{ちか}います。', 'Ya, aku bersumpah.', y('よろしい。 いい 返事{へんじ}ね。', 'Bagus. Jawaban yang baik.')),
    ok('もちろんです。 永遠{えいえん}に。', 'Tentu. Untuk selamanya.', y('ふふ、 影{えい}の 顔{かお}が 赤{あか}く なって いるわよ。', 'Hehe, wajah Ei jadi merah, lho.')),
    ok('えっと…… はい！ 誓{ちか}います！', 'Eh… iya! Aku bersumpah!', y('可愛{かわい}い 返事{へんじ}ね。 合格{ごうかく}よ。', 'Jawaban yang manis. Lulus.'))),
  y('影{えい}。 あなたも 誓{ちか}いますか。', 'Ei, apakah kau juga bersumpah?'),
  e('はい。 誓{ちか}います。 永遠{えいえん}に、 あなたの そばに。', 'Iya. Aku bersumpah. Selamanya di sisimu.'),
  y('では、 三三九度{さんさんくど}の 盃{さかずき}を。', 'Kalau begitu, cawan san-san-kudo (tiga cawan sake yang dibagi dalam upacara di kuil).'),
  ask('ei', 'これからは、 何{なん}と 呼{よ}べば いいですか。', 'Mulai sekarang, aku harus memanggilmu apa?',
    ok('「あなた」と 呼{よ}んで ください。', 'Panggil aku "anata".', e('……はい、 あなた。', '…Iya, anata.')),
    ok('名前{なまえ}で 呼{よ}んで ください。', 'Panggil dengan namaku.', e('では、 名前{なまえ}で。 ……ふふ、 少{すこ}し 恥{は}ずかしいですね。', 'Baiklah, dengan namamu. …Hehe, agak malu juga ya.')),
    ok('好{す}きな ように 呼{よ}んで ください。', 'Panggil sesukamu.', e('では…… 「あなた」と。', 'Kalau begitu… "anata".'))),
  e('これからは、 ずっと 一緒{いっしょ}です。 よろしく お 願{ねが}いしますね。', 'Mulai sekarang, kita selalu bersama. Mohon bimbingannya, ya.'),
  y('おめでとう。 稲妻中{いなずまじゅう}が、 あなたたちを 祝福{しゅくふく}して いるわ。', 'Selamat. Seluruh Inazuma memberkati kalian.'),
] }
