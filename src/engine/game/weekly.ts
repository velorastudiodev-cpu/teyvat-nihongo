import { BOSSES } from '../../data/cosmetics'
import { today } from '../srs/srs'
import { seeded, weekId } from './rules'

export const FREEZE_PRICE = 200

export const weeklyBoss = (date = today()) => BOSSES[Math.floor(seeded(weekId(date))() * BOSSES.length)]
