import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { kanjiById } from '../data/kanji'
import { KANA } from '../data/kana'
import { btn, card } from '../ui/kit'
import { speak } from '../ui/speak'
import { StrokeOrder, StrokePad } from '../ui/strokes'

/** Free writing practice for any kana or kanji, with or without the guide. */
export function Write() {
  const char = useParams().char ?? 'あ'
  const [ghost, setGhost] = useState(true)
  const [round, setRound] = useState(0)
  const [result, setResult] = useState<number>()
  const k = kanjiById.get(`kanji:${char}`)
  const kana = KANA.find((x) => x.char === char)
  return (
    <main className={`${card} mx-auto mt-4 max-w-xl space-y-4 text-center`}>
      <h1 className="font-display text-2xl font-extrabold">Latihan menulis <span lang="ja">{char}</span>
        <span className="ml-2 text-base font-normal">{k?.meaning ?? kana?.romaji}</span></h1>
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div><StrokeOrder char={char} size={140} /><p className="text-xs opacity-60">tap untuk putar ulang</p></div>
        <StrokePad key={`${char}${round}${ghost}`} char={char} ghost={ghost} onDone={({ mistakes }) => { setResult(mistakes); speak(k?.on[0] ?? char) }} />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button className={`${btn} bg-paper`} onClick={() => setGhost(!ghost)}>{ghost ? 'Tanpa panduan' : 'Dengan panduan'}</button>
        <button className={`${btn} bg-torii text-white`} onClick={() => { setResult(undefined); setRound(round + 1) }}>Ulangi</button>
        <Link to={k ? '/kanji' : '/kana'} className={`${btn} bg-paper`}>Kembali</Link>
      </div>
      {result !== undefined && <p className="font-display font-bold">{result === 0 ? 'Sempurna! ✨' : `${result} kesalahan, coba lagi tanpa panduan!`}</p>}
    </main>
  )
}
