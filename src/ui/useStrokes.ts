import { useEffect, useState } from 'react'
import { loadStrokes, type StrokeSet } from '../data/kanji'

export function useStrokes(char: string) {
  const [set, setSet] = useState<StrokeSet>()
  useEffect(() => { loadStrokes(char).then(setSet) }, [char])
  return set
}
