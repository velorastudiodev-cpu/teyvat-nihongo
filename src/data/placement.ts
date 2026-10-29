import type { Stage } from './curriculum'

export interface Question { prompt: string; ask: string; choices: string[]; answer: string }

/** 6 questions per stage; the first listed choice is never assumed correct, `answer` is. */
export const PLACEMENT: Record<Stage, Question[]> = {
  hiragana: [
    { prompt: 'き', ask: 'Bagaimana dibacanya?', choices: ['ki', 'sa', 'chi', 'ni'], answer: 'ki' },
    { prompt: 'ぬ', ask: 'Bagaimana dibacanya?', choices: ['me', 'nu', 'ne', 'ro'], answer: 'nu' },
    { prompt: 'ゆ', ask: 'Bagaimana dibacanya?', choices: ['yo', 'yu', 'ru', 'ha'], answer: 'yu' },
    { prompt: 'れ', ask: 'Bagaimana dibacanya?', choices: ['wa', 'ne', 're', 'ru'], answer: 're' },
    { prompt: 'sa', ask: 'Hiragana yang benar?', choices: ['ち', 'さ', 'き', 'そ'], answer: 'さ' },
    { prompt: 'ぴゃ', ask: 'Bagaimana dibacanya?', choices: ['bya', 'pya', 'hya', 'pyo'], answer: 'pya' },
  ],
  katakana: [
    { prompt: 'ソ', ask: 'Bagaimana dibacanya?', choices: ['n', 'shi', 'so', 'tsu'], answer: 'so' },
    { prompt: 'シ', ask: 'Bagaimana dibacanya?', choices: ['tsu', 'shi', 'so', 'n'], answer: 'shi' },
    { prompt: 'ヌ', ask: 'Bagaimana dibacanya?', choices: ['su', 'fu', 'nu', 'ma'], answer: 'nu' },
    { prompt: 'ケ', ask: 'Bagaimana dibacanya?', choices: ['ku', 'ke', 'ta', 'ri'], answer: 'ke' },
    { prompt: 'コーヒー', ask: 'Bagaimana dibacanya?', choices: ['kōhī', 'kōchī', 'yōhī', 'kēki'], answer: 'kōhī' },
    { prompt: 'me', ask: 'Katakana yang benar?', choices: ['ナ', 'ヌ', 'メ', 'ノ'], answer: 'メ' },
  ],
  N5: [
    { prompt: '水', ask: 'Cara baca?', choices: ['みず', 'かわ', 'みせ', 'すし'], answer: 'みず' },
    { prompt: 'わたし（　）がくせいです。', ask: 'Partikel yang tepat?', choices: ['を', 'は', 'に', 'で'], answer: 'は' },
    { prompt: 'たべます', ask: 'Artinya?', choices: ['minum', 'makan', 'tidur', 'melihat'], answer: 'makan' },
    { prompt: '明日', ask: 'Cara baca?', choices: ['きのう', 'きょう', 'あした', 'あさって'], answer: 'あした' },
    { prompt: 'いま なんじ ですか。', ask: 'Artinya?', choices: ['Sekarang jam berapa?', 'Ini apa?', 'Di mana toilet?', 'Berapa harganya?'], answer: 'Sekarang jam berapa?' },
    { prompt: 'コーヒーを（　）。', ask: 'Pilihan yang tepat?', choices: ['ねます', 'のみます', 'いきます', 'あいます'], answer: 'のみます' },
  ],
  N4: [
    { prompt: '雨が降り（　）です。', ask: '"Kelihatannya akan hujan"', choices: ['そう', 'よう', 'らしい', 'みたい'], answer: 'そう' },
    { prompt: '日本へ行った（　）があります。', ask: 'Pilihan yang tepat?', choices: ['もの', 'こと', 'ところ', 'はず'], answer: 'こと' },
    { prompt: '運動', ask: 'Cara baca?', choices: ['うんどう', 'うんど', 'うどう', 'どうろ'], answer: 'うんどう' },
    { prompt: 'さいふを なくして しまった。', ask: 'Nuansa 〜てしまった?', choices: ['terlanjur / tidak sengaja', 'sedang dilakukan', 'ingin melakukan', 'belum pernah'], answer: 'terlanjur / tidak sengaja' },
    { prompt: '先生に本を（　）。', ask: '"Saya diberi buku oleh guru" (sopan)', choices: ['くださいました', 'いただきました', 'さしあげました', 'あげました'], answer: 'いただきました' },
    { prompt: '急ぐ', ask: 'Artinya?', choices: ['bergegas', 'beristirahat', 'menunggu', 'berhenti'], answer: 'bergegas' },
  ],
  N3: [
    { prompt: '雨（　）、試合は行われた。', ask: '"Meskipun hujan…"', choices: ['によって', 'について', 'にもかかわらず', 'に対して'], answer: 'にもかかわらず' },
    { prompt: '経験', ask: 'Cara baca?', choices: ['けいけん', 'けんけい', 'きょうけん', 'けいげん'], answer: 'けいけん' },
    { prompt: 'あの人が犯人のわけがない。', ask: 'Nuansa 〜わけがない?', choices: ['tidak mungkin', 'pasti', 'sebaiknya', 'katanya'], answer: 'tidak mungkin' },
    { prompt: '留守', ask: 'Cara baca?', choices: ['るす', 'りゅうしゅ', 'とめもり', 'るしゅ'], answer: 'るす' },
    { prompt: '彼は知っている（　）、教えてくれない。', ask: '"Padahal dia tahu…" (nada kesal)', choices: ['くせに', 'おかげで', 'ために', 'ように'], answer: 'くせに' },
    { prompt: '準備', ask: 'Cara baca?', choices: ['じゅんび', 'じゅんぴ', 'しゅんび', 'じゅうび'], answer: 'じゅんび' },
  ],
  N2: [
    { prompt: '会社の命令だから、行かざるを得ない。', ask: 'Nuansa 〜ざるを得ない?', choices: ['mau tidak mau harus', 'tidak boleh', 'tidak perlu', 'ingin sekali'], answer: 'mau tidak mau harus' },
    { prompt: '把握', ask: 'Cara baca?', choices: ['はあく', 'はく', 'ばあく', 'はおく'], answer: 'はあく' },
    { prompt: '実力（　）、やる気はある。', ask: '"Terlepas dari kemampuannya…"', choices: ['はともかく', 'に限って', 'からこそ', 'ばかりか'], answer: 'はともかく' },
    { prompt: '頻繁', ask: 'Cara baca?', choices: ['ひんぱん', 'ひんばん', 'びんぱん', 'ひんはん'], answer: 'ひんぱん' },
    { prompt: '安全に越したことはない。', ask: 'Artinya?', choices: ['Tidak ada yang lebih baik dari aman', 'Keamanan sudah terlewati', 'Aman itu berlebihan', 'Tidak peduli keamanan'], answer: 'Tidak ada yang lebih baik dari aman' },
    { prompt: '懸念', ask: 'Artinya?', choices: ['kekhawatiran', 'harapan', 'kenangan', 'keputusan'], answer: 'kekhawatiran' },
  ],
  N1: [
    { prompt: '遡る', ask: 'Cara baca?', choices: ['さかのぼる', 'さからう', 'ためらう', 'あやまる'], answer: 'さかのぼる' },
    { prompt: '被害者の話に同情を禁じ得ない。', ask: 'Nuansa 〜を禁じ得ない?', choices: ['tak bisa menahan (perasaan)', 'dilarang', 'tidak perlu', 'pura-pura'], answer: 'tak bisa menahan (perasaan)' },
    { prompt: '漸く', ask: 'Cara baca?', choices: ['ようやく', 'しばらく', 'ようよう', 'ざんく'], answer: 'ようやく' },
    { prompt: '泣き出さんばかりの顔をしていた。', ask: 'Nuansa 〜んばかり?', choices: ['seolah-olah hampir', 'hanya saja', 'karena itu', 'tidak pernah'], answer: 'seolah-olah hampir' },
    { prompt: '今年はいいことずくめだ。', ask: 'Nuansa 〜ずくめ?', choices: ['penuh dengan', 'kekurangan', 'sedikit', 'kecuali'], answer: 'penuh dengan' },
    { prompt: '杜撰', ask: 'Cara baca?', choices: ['ずさん', 'とせん', 'ずせん', 'もりさん'], answer: 'ずさん' },
  ],
}
