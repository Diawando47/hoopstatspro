import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUIStore } from './store/useStore'

import Sidebar    from './components/layout/Sidebar'
import BottomNav  from './components/layout/BottomNav'
import TopBar     from './components/layout/TopBar'
import Toast      from './components/ui/Toast'
import Modal      from './components/ui/Modal'
import MatchForm  from './components/match/MatchForm'
import PlayerForm from './components/player/PlayerForm'
import StatForm   from './components/stats/StatForm'

import Dashboard   from './pages/Dashboard'
import Matches     from './pages/Matches'
import MatchDetail from './pages/MatchDetail'
import Players     from './pages/Players'
import Stats       from './pages/Stats'
import Reports     from './pages/Reports'
import NotFound    from './pages/NotFound'

// ── Hook : détecte si on est sur mobile ───────────────
function useIsMobile() {
  // ✅ Bug 4 corrigé — matchMedia pour la valeur initiale, cohérent avec le listener
  const mq = window.matchMedia('(max-width: 768px)')
  const [isMobile, setIsMobile] = useState(() => mq.matches)

  useEffect(() => {
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

// ── Modal router ───────────────────────────────────────
function ModalRouter() {
  const { modal } = useUIStore()
  if (!modal) return null

  const forms = {
    match:  <MatchForm />,
    player: <PlayerForm />,
    stat:   <StatForm />,
  }

  return <Modal>{forms[modal.type] ?? null}</Modal>
}

// ── App ────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile()

  // Capture l'événement PWA "Ajouter à l'écran d'accueil"
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      window._pwaPrompt = e
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  return (
    <div className="app-layout">
      {/* Sidebar : desktop seulement */}
      {!isMobile && <Sidebar />}

      {/* Contenu principal */}
      <main className="main-content">
        {/* TopBar logo — mobile seulement */}
        {isMobile && <TopBar />}
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/matches"     element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/players"     element={<Players />} />
          <Route path="/stats"       element={<Stats />} />
          <Route path="/reports"     element={<Reports />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </main>

      {/* Bottom nav : mobile seulement */}
      {isMobile && <BottomNav />}

      {/* Globaux */}
      <ModalRouter />
      <Toast />
    </div>
  )
}
