import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Profile } from '../../data/db'
import { REGIONS } from '../../characters'
import { Icon } from '../Icon'
import { REALMS, type Realm } from './regions'
import { RegionScene } from './scenes'
import { useHomeRegion } from './useRealm'

/**
 * Choose the scenery: "Otomatis" follows your journey; any region you have reached (or won as a Wish
 * theme) can be pinned, and the Plane of Euthymia once you have met Ei.
 */
export function RealmPicker({ profile }: { profile: Profile }) {
  const home = useHomeRegion(profile)
  const owned = useLiveQuery(() => db.unlocks.where('id').startsWith('cos:theme:').primaryKeys(), []) ?? []
  const reached = REGIONS.findIndex((r) => r.id === home)
  const open = (r: Realm) => r === 'euthymia' ? !!profile.raiden?.ei : r === 'narukami' ? !!profile.raiden?.vow : REGIONS.findIndex((x) => x.id === r) <= reached || owned.includes(`cos:theme:${r}`)
  const chosen = profile.realm ?? 'auto'
  const all: Realm[] = [...REGIONS.map((r) => r.id), 'euthymia', 'narukami']
  const pick = (realm: Profile['realm']) => db.profile.update('me', { realm })
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button onClick={() => pick('auto')} className={`relative flex h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border bg-gradient-to-br from-soft to-paper font-display font-bold ${chosen === 'auto' ? 'border-primary ring-2 ring-primary' : 'border-gold/60'}`}>
        <Icon name="compass" className="h-6 w-6 text-primary" /> Otomatis
        <span className="text-[10px] font-normal opacity-70">ikut region: {REALMS[home].name}</span>
      </button>
      {all.filter((r) => (r !== 'euthymia' && r !== 'narukami') || open(r)).map((r) => {
        const ok = open(r)
        return (
          <button key={r} data-region={r} disabled={!ok} onClick={() => pick(r)}
            className={`relative h-20 cursor-pointer overflow-hidden rounded-2xl border text-left disabled:cursor-not-allowed ${chosen === r ? 'border-primary ring-2 ring-primary' : 'border-gold/60'}`}
            style={{ background: 'linear-gradient(180deg, var(--r-sky-1), var(--r-sky-2))' }}>
            <svg viewBox="0 300 1440 600" preserveAspectRatio="xMidYMid slice" className={`absolute inset-0 h-full w-full ${ok ? '' : 'grayscale'}`} aria-hidden><RegionScene region={r} /></svg>
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-night/75 px-2 py-1 text-xs font-bold text-paper">
              {!ok && <Icon name="lock" className="h-3 w-3" />}{REALMS[r].name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
