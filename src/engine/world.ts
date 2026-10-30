import { drainAbyss, refreshAbyss } from './abyss'
import { watchOrder } from './celestia'
import { settleContracts } from './fatui'

/**
 * The world turning: re-read the Five Sinners, let the Shades check the order, take the day's Abyss
 * drain and settle Fatui contracts. Runs at most every 20 s; drains and settlements happen once a day.
 */
let last = 0
export async function worldUpkeep(minGapMs = 20_000) {
  if (Date.now() - last < minGapMs) return { rising: [], drained: 0, contracts: [] as string[] }
  last = Date.now()
  const rising = await refreshAbyss()
  await watchOrder()
  const drained = await drainAbyss()
  const contracts = await settleContracts()
  return { rising, drained, contracts }
}
