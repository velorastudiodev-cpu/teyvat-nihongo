import { describe, expect, it } from 'vitest'
import { characters, REGIONS } from '.'
import { DESIGNS } from './designs'

describe('characters.json', () => {
  it('registers 30+ characters with unique ids in known regions', () => {
    expect(characters.length).toBeGreaterThanOrEqual(30)
    expect(new Set(characters.map((c) => c.id)).size).toBe(characters.length)
    const regions = REGIONS.map((r) => r.id)
    for (const c of characters) expect(regions).toContain(c.region)
  })

  it('every character has all 4 expression slots; the original roster is drawn or illustrated', () => {
    for (const c of characters) expect(Object.keys(c.assets).sort()).toEqual(['happy', 'idle', 'sad', 'sleep'])
    const art = characters.filter((c) => DESIGNS[c.id] || c.assets.idle.endsWith('.webp'))
    expect(art.length).toBeGreaterThanOrEqual(34)   // newer characters show a silhouette until their art is added
  })
})
