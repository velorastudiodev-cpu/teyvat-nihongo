import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameLoop } from './useGameLoop'
import { Toaster } from './toast'
import { CornerCompanion } from './CornerCompanion'

const link = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 font-display font-bold transition-colors ${isActive ? 'bg-torii text-paper' : 'hover:bg-paper-deep'}`

// pages that already show the companion reacting, or need the whole screen
const NO_CORNER = /^\/($|games\/|review|domain|boss|revenge|onboarding|kana\/learn|kanji\/learn|vocab\/learn|grammar\/learn|speaking\/|write)/

export function Layout() {
  const profile = useGameLoop()
  const { pathname } = useLocation()
  return (
    <div className="mx-auto min-h-dvh max-w-5xl px-4 pb-16">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Lewati ke konten</a>
      <Toaster />
      <header className="flex flex-wrap items-center justify-between gap-2 py-4">
        <NavLink to="/" className="font-display text-2xl font-extrabold tracking-tight">
          <span className="text-torii">⛩</span> Teyvat Nihongo
        </NavLink>
        <nav aria-label="Menu utama" className="flex flex-wrap items-center justify-end gap-1 text-sm">
          <NavLink to="/daily" className={link}>Harian</NavLink>
          <NavLink to="/learn" className={link}>Belajar</NavLink>
          <NavLink to="/games" className={link}>Main</NavLink>
          <NavLink to="/review" className={link}>Review</NavLink>
          <NavLink to="/gacha" className={link}>Gacha</NavLink>
          <NavLink to="/characters" className={link}>Karakter</NavLink>
          <NavLink to="/profile" className={link}>Profil</NavLink>
          <NavLink to="/gacha" className="ml-1 rounded-full bg-ink px-3 py-1.5 font-display font-bold text-geo" title="Kirameki">✦ {profile?.kirameki ?? 0}</NavLink>
        </nav>
      </header>
      <motion.div id="main" key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>
        <Outlet />
      </motion.div>
      {profile && !NO_CORNER.test(pathname) && <CornerCompanion profile={profile} />}
      <footer className="mt-16 text-center text-xs opacity-60">
        Penggunaan pribadi, non-komersial. Karakter Genshin Impact © HoYoverse, chibi digambar ulang.
        Data: <a className="underline" href="https://kanjivg.tagaini.net">KanjiVG</a> (CC BY-SA 3.0, Ulrich Apel),
        {' '}<a className="underline" href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project">KANJIDIC2</a> (EDRDG, CC BY-SA 4.0),
        {' '}daftar kosakata JLPT <a className="underline" href="https://github.com/jamsinclair/open-anki-jlpt-decks">open-anki-jlpt-decks</a> (MIT).
      </footer>
    </div>
  )
}
