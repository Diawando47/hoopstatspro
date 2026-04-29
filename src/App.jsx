import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUIStore } from './store/useStore'

import Sidebar    from './components/layout/Sidebar'
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

function ModalRouter() {
  const { modal, closeModal } = useUIStore()
  if (!modal) return null

  const forms = {
    match:  <MatchForm />,
    player: <PlayerForm />,
    stat:   <StatForm />,
  }

  return (
    <Modal>
      {forms[modal.type] ?? null}
    </Modal>
  )
}

export default function App() {
  // PWA install prompt — capture l'événement natif du navigateur
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
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/matches"     element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/players"     element={<Players />} />
          <Route path="/stats"       element={<Stats />} />
          <Route path="/reports"     element={<Reports />} />
        </Routes>
      </main>
      <ModalRouter />
      <Toast />
    </div>
  )
}
