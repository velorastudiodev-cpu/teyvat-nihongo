import type { Element, Region } from '../../characters'

export type Realm = Region | 'euthymia' | 'narukami'

/** What each region feels like: its title, archon, element and a line of Japanese for the banner. */
export const REALMS: Record<Realm, { name: string; nameJa: string; title: string; archon: string; element: Element; motto: { ja: string; tr: string } }> = {
  mondstadt: { name: 'Mondstadt', nameJa: 'モンド', title: 'Kota Kebebasan', archon: 'Barbatos', element: 'anemo', motto: { ja: '風とともに、自由を。', tr: 'Bersama angin, raihlah kebebasan.' } },
  liyue: { name: 'Liyue', nameJa: '璃月', title: 'Pelabuhan Kontrak', archon: 'Morax', element: 'geo', motto: { ja: '契約は必ず守る。', tr: 'Kontrak pasti ditepati.' } },
  inazuma: { name: 'Inazuma', nameJa: '稲妻', title: 'Negeri Keabadian', archon: 'Raiden Shogun', element: 'electro', motto: { ja: '雷鳴とともに、永遠を。', tr: 'Bersama gemuruh petir, menuju keabadian.' } },
  sumeru: { name: 'Sumeru', nameJa: 'スメール', title: 'Negeri Kebijaksanaan', archon: 'Kusanali', element: 'dendro', motto: { ja: '知恵は分かち合うもの。', tr: 'Kebijaksanaan itu untuk dibagi.' } },
  fontaine: { name: 'Fontaine', nameJa: 'フォンテーヌ', title: 'Negeri Keadilan', archon: 'Focalors', element: 'hydro', motto: { ja: '正義の水は流れ続ける。', tr: 'Air keadilan terus mengalir.' } },
  natlan: { name: 'Natlan', nameJa: 'ナタ', title: 'Negeri Api', archon: 'Mavuika', element: 'pyro', motto: { ja: '炎は決して消えない。', tr: 'Api tak akan pernah padam.' } },
  narukami: { name: 'Kuil Narukami', nameJa: '鳴神大社', title: 'Malam Ikrar Keabadian', archon: 'Yae Miko', element: 'electro', motto: { ja: '永遠の契りを、ここに。', tr: 'Ikrar keabadian, di sini.' } },
  euthymia: { name: 'Alam Euthymia', nameJa: '一心浄土', title: 'Ruang Meditasi Ei', archon: 'Ei', element: 'electro', motto: { ja: '永遠は、ここに。', tr: 'Keabadian ada di sini.' } },
}
