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

  it('every character is drawn, each with all 4 expression asset slots', () => {
    const drawn = characters.filter((c) => DESIGNS[c.id])
    expect(drawn).toHaveLength(characters.length)
    for (const c of drawn) expect(Object.keys(c.assets).sort()).toEqual(['happy', 'idle', 'sad', 'sleep'])
  })
})
