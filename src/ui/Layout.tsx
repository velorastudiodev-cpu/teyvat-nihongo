import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { streak } from '../engine/game/rules'
import { today } from '../engine/srs/srs'
import { useGameLoop } from './useGameLoop'
import { Toaster } from './toast'
import { CornerCompanion } from './CornerCompanion'
import { Icon, type IconName } from './Icon'
import { Backdrop } from './region/Backdrop'
import { REALMS } from './region/regions'
import { useRealm, useRealmOnDocument } from './region/useRealm'
import { ShadeDescent } from '../modules/world/WorldPages'

const TABS: { to: string; label: string; icon: IconName; match: RegExp }[] = [
  { to: '/', label: 'Beranda', icon: 'home', match: /^\/$/ },
  { to: '/learn', label: 'Belajar', icon: 'book', match: /^\/(learn|kana|kanji|vocab|grammar|reading|listening|speaking|map|review|write|hexenzirkel)/ },
  { to: '/games', label: 'Main', icon: 'gamepad', match: /^\/(games|daily|boss|domain|revenge|fatui|abyss|celestia|snezhnaya)/ },
  { to: '/characters', label: 'Karakter', icon: 'users', match: /^\/(characters|gacha|raiden)/ },
  { to: '/profile', label: 'Profil', icon: 'user', match: /^\/(profile|insight|exam|gate)/ },
]

// focused activities: no tab bar, a back button instead, so nothing pulls you away mid-lesson
const FOCUS = /^\/(games\/|review|domain|boss|revenge|kana\/learn|kanji\/learn|vocab\/learn|grammar\/learn|speaking\/|write|exam|gate|reading\/|raiden\/|fatui\/duel|abyss\/rift|hexenzirkel\/drill)/
const NO_CORNER = /^\/($|games\/|review|domain|boss|revenge|onboarding|kana\/learn|kanji\/learn|vocab\/learn|grammar\/learn|speaking\/|write|raiden)/

export function Layout() {
  const profile = useGameLoop()
  const realm = useRealm(profile)
  useRealmOnDocument(realm)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const focus = FOCUS.test(pathname)
  const onboarding = pathname.startsWith('/onboarding')
  const date = today()
  const days = useLiveQuery(() => db.days.toArray(), []) ?? []
  const r = REALMS[realm]

  return (
    // overflow-x-clip: nothing may make the page wider than the phone, or Android lets you pan it sideways
    <div className="min-h-dvh overflow-x-clip">
      <Backdrop realm={realm} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-night focus:px-4 focus:py-2 focus:text-paper">Lewati ke konten</a>
      <Toaster />
      <ShadeDescent hold={focus || onboarding} />

      <header className="g-glass sticky top-0 z-40 border-x-0 border-t-0 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          {focus ? (
            <button onClick={() => (history.length > 1 ? navigate(-1) : navigate('/'))} className="flex cursor-pointer items-center gap-2 font-display font-bold text-gold-soft">
              <Icon name="arrowLeft" /> Kembali
            </button>
          ) : (
            <NavLink to="/" className="flex min-w-0 items-center gap-2.5">
              <span className="g-chip h-9 w-9 shrink-0"><Icon name={r.element === 'none' ? 'sparkle' : r.element} className="h-5 w-5" /></span>
              <span className="min-w-0 leading-tight">
                <span className="block font-title text-sm font-bold tracking-wider text-gold-soft">{r.name}</span>
                <span className="block truncate text-xs text-paper/70"><span lang="ja">{r.nameJa}</span> · {r.title}</span>
              </span>
            </NavLink>
          )}
          {profile && !onboarding && (
            <div className="flex items-center gap-2 font-display text-sm font-bold">
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[#ffb36b]" title="Streak harian">
                <Icon name="flame" className="h-4 w-4" />{streak(days, date)}
              </span>
              <NavLink to="/gacha" className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-gold-soft" title="Kirameki">
                <Icon name="gem" className="h-4 w-4" />{profile.kirameki ?? 0}
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <motion.div id="main" key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
        className={`mx-auto max-w-5xl px-4 ${focus || onboarding ? 'pb-10' : 'pb-28'}`}>
        <Outlet />
      </motion.div>

      {profile && !NO_CORNER.test(pathname) && <CornerCompanion profile={profile} />}

      {!focus && !onboarding && (
        <nav aria-label="Menu utama" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),10px)]">
          <ul className="g-glass mx-auto flex max-w-lg items-stretch justify-between rounded-[22px] px-1.5 py-1.5 shadow-2xl">
            {TABS.map((t) => {
              const active = t.match.test(pathname)
              return (
                <li key={t.to} className="flex-1">
                  <NavLink to={t.to} aria-current={active ? 'page' : undefined}
                    className={`relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-bold transition-colors ${active ? 'text-gold-soft' : 'text-paper/60 hover:text-paper'}`}>
                    {active && <motion.span layoutId="tab" className="absolute inset-0 rounded-2xl bg-white/10 ring-1 ring-gold/50" transition={{ type: 'spring', duration: .35 }} />}
                    <Icon name={t.icon} className={`relative h-6 w-6 ${active ? 'drop-shadow-[0_0_6px_var(--r-glow)]' : ''}`} />
                    <span className="relative">{t.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
