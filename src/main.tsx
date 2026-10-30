import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/800.css'
import '@fontsource/nunito/900.css'
import '@fontsource/cinzel/700.css'
import './index.css'
import './native'
import { applyFx } from './ui/fx'
import { Layout } from './ui/Layout'
import { Home } from './routes/Home'
import { Characters } from './routes/Characters'
import { Onboarding } from './routes/Onboarding'
import { SkillMap } from './routes/Map'
import { KanaHub } from './modules/kana/KanaHub'
import { Lesson } from './modules/kana/Lesson'
import { Review } from './modules/Review'
import { KanaRain } from './games/KanaRain'
import { MemoryMatch } from './games/MemoryMatch'
import { StrokeDuel } from './games/StrokeDuel'
import { RadicalForge } from './games/RadicalForge'
import { KanjiHub } from './modules/kanji/KanjiHub'
import { KanjiLesson } from './modules/kanji/KanjiLesson'
import { VocabLesson } from './modules/vocab/VocabLesson'
import { Write } from './modules/Write'
import { GrammarHub, GrammarLesson } from './modules/grammar/Grammar'
import { ReadingHub, ReadingText } from './modules/reading/Reading'
import { Listening } from './modules/listening/Listening'
import { ParticleShooter } from './games/ParticleShooter'
import { SentenceBuilderGame } from './games/SentenceBuilderGame'
import { FillBlankRush } from './games/FillBlankRush'
import { ListeningEcho } from './games/ListeningEcho'
import { GamesHub, LearnHub } from './routes/Hubs'
import { VoiceFill } from './games/VoiceFill'
import { SpeedSpeak } from './games/SpeedSpeak'
import { ReadAloud, Shadowing, SpeakingHub } from './modules/speaking/Speaking'
import { Daily } from './modules/daily/Daily'
import { Gacha } from './modules/daily/Gacha'
import { ProfilePage } from './modules/daily/Profile'
import { Boss } from './modules/daily/Boss'
import { Domain } from './modules/daily/Domain'
import { Revenge } from './modules/daily/Revenge'
import { GateExam, MockTest } from './modules/exam/ExamPages'
import { Insight } from './modules/insight/Insight'
import { RaidenLetter, RaidenPage, RaidenTalk, RaidenTrial, RaidenVow } from './modules/raiden/RaidenPage'
import { AbyssPage, AbyssRift, CelestiaPage, FatuiDuel, FatuiPage, NewGate } from './modules/world/WorldPages'
import { HexenDrill, HexenPage, SnezhnayaPage } from './modules/world/NorthPages'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/onboarding', element: <Onboarding /> },
      { path: '/map', element: <SkillMap /> },
      { path: '/kana', element: <KanaHub /> },
      { path: '/kana/learn/:script', element: <NewGate><Lesson /></NewGate> },
      { path: '/review', element: <Review /> },
      { path: '/kanji', element: <KanjiHub kind="kanji" /> },
      { path: '/kanji/learn/:level', element: <NewGate><KanjiLesson /></NewGate> },
      { path: '/vocab', element: <KanjiHub kind="vocab" /> },
      { path: '/vocab/learn/:level', element: <NewGate><VocabLesson /></NewGate> },
      { path: '/write/:char', element: <Write /> },
      { path: '/learn', element: <LearnHub /> },
      { path: '/games', element: <GamesHub /> },
      { path: '/grammar', element: <GrammarHub /> },
      { path: '/grammar/learn/:id', element: <NewGate><GrammarLesson /></NewGate> },
      { path: '/reading', element: <ReadingHub /> },
      { path: '/reading/:id', element: <ReadingText /> },
      { path: '/listening', element: <Listening /> },
      { path: '/games/particle-shooter', element: <ParticleShooter /> },
      { path: '/games/sentence-builder', element: <SentenceBuilderGame /> },
      { path: '/games/fill-blank-rush', element: <FillBlankRush /> },
      { path: '/games/listening-echo', element: <ListeningEcho /> },
      { path: '/games/voice-fill', element: <VoiceFill /> },
      { path: '/games/speed-speak', element: <SpeedSpeak /> },
      { path: '/speaking', element: <SpeakingHub /> },
      { path: '/daily', element: <Daily /> },
      { path: '/gacha', element: <Gacha /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/boss', element: <Boss /> },
      { path: '/domain', element: <Domain /> },
      { path: '/revenge', element: <Revenge /> },
      { path: '/exam', element: <MockTest /> },
      { path: '/gate', element: <GateExam /> },
      { path: '/insight', element: <Insight /> },
      { path: '/speaking/shadowing', element: <Shadowing /> },
      { path: '/speaking/read-aloud', element: <ReadAloud /> },
      { path: '/games/stroke-duel', element: <StrokeDuel /> },
      { path: '/games/radical-forge', element: <RadicalForge /> },
      { path: '/games/kana-rain', element: <KanaRain /> },
      { path: '/games/memory-match', element: <MemoryMatch /> },
      { path: '/characters/:id?', element: <Characters /> },
      { path: '/raiden', element: <RaidenPage /> },
      { path: '/fatui', element: <FatuiPage /> },
      { path: '/fatui/duel/:id', element: <FatuiDuel /> },
      { path: '/abyss', element: <AbyssPage /> },
      { path: '/abyss/rift/:id', element: <AbyssRift /> },
      { path: '/celestia', element: <CelestiaPage /> },
      { path: '/snezhnaya', element: <SnezhnayaPage /> },
      { path: '/hexenzirkel', element: <HexenPage /> },
      { path: '/hexenzirkel/drill/:witch', element: <HexenDrill /> },
      { path: '/raiden/letter', element: <RaidenLetter /> },
      { path: '/raiden/talk', element: <RaidenTalk /> },
      { path: '/raiden/vow', element: <RaidenVow /> },
      { path: '/raiden/trial', element: <RaidenTrial /> },
      { path: '*', element: <p className="g-panel mt-6 p-8 font-display text-2xl">Jalan ini belum dibuka… <span lang="ja">迷子？</span></p> },
    ],
  },
])

applyFx()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
)
