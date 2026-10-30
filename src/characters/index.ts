import data from '../data/characters.json'

export const EXPRESSIONS = ['idle', 'happy', 'sad', 'sleep'] as const
export type Expression = (typeof EXPRESSIONS)[number]
export type Region = 'mondstadt' | 'liyue' | 'inazuma' | 'sumeru' | 'fontaine' | 'natlan' | 'nodkrai' | 'snezhnaya'
export type Element = 'none' | 'anemo' | 'geo' | 'electro' | 'dendro' | 'hydro' | 'pyro' | 'cryo'

export interface Character {
  id: string
  name: string
  nameJa: string
  region: Region
  element: Element
  buff: { game: string; effect: string; value: number; desc: string }
  lines: { ja: string; tr: string }[]
  assets: Record<Expression, string>
}

export const characters = data as Character[]
export const getCharacter = (id: string) => characters.find((c) => c.id === id)

export const REGIONS: { id: Region; name: string; level: string }[] = [
  { id: 'mondstadt', name: 'Mondstadt', level: 'Kana + N5' },
  { id: 'liyue', name: 'Liyue', level: 'N4' },
  { id: 'inazuma', name: 'Inazuma', level: 'N3' },
  { id: 'sumeru', name: 'Sumeru', level: 'N2' },
  { id: 'fontaine', name: 'Fontaine', level: 'N1' },
  { id: 'natlan', name: 'Natlan', level: 'N1' },
  { id: 'nodkrai', name: 'Nod-Krai', level: 'N1' },
  { id: 'snezhnaya', name: 'Snezhnaya', level: 'Akhir · Mock N1' },
]

export const ELEMENT_COLOR: Record<Element, string> = {
  none: '#8a8fb5', anemo: '#3fae8f', geo: '#e0a526', electro: '#9b6bd6',
  dendro: '#7fb23a', hydro: '#3d8fd6', pyro: '#e0553a', cryo: '#7cc6de',
}
