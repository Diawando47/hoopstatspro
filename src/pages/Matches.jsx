import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useUIStore } from '../store/useStore'
import { useMatches, getResult, formatDate } from '../hooks/useStats'

export default function Matches() {
  const navigate      = useNavigate()
  const { openModal } = useUIStore()
  const matches       = useMatches()

  return (
    <>
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-title">Gestion des <span>Matchs</span></div>
          <div className="page-sub">{matches.length} match{matches.length > 1 ? 's' : ''} enregistré{matches.length > 1 ? 's' : ''}</div>
        </motion.div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => openModal('match')}>
            <Plus size={14} /> Nouveau Match
          </button>
        </div>
      </div>

      <div className="content">
        {matches.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🏀</div>
              <div className="empty-title">Aucun match</div>
              <div className="empty-sub">Créez votre premier match pour commencer le suivi</div>
              <button className="btn btn-primary" onClick={() => openModal('match')}>
                <Plus size={14} /> Créer un match
              </button>
            </div>
          </div>
        ) : (
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Date</th><th>Domicile</th>
                    <th>Score</th><th>Visiteur</th><th>Résultat</th><th>Lieu</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => {
                    const r = getResult(m)
                    return (
                      <tr
                        key={m.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/matches/${m.id}`)}
                      >
                        <td style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 16, fontWeight: 700, color: 'var(--muted)',
                        }}>
                          {matches.length - i}
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{formatDate(m.date)}</td>
                        <td style={{ fontWeight: 600 }}>{m.teamA}</td>
                        <td>
                          <span className={`score-cell ${r === 'V' ? 'score-w' : 'score-l'}`}>{m.scoreA}</span>
                          <span style={{ color: 'var(--muted)', margin: '0 4px' }}>–</span>
                          <span className="score-cell" style={{ color: 'var(--muted)' }}>{m.scoreB}</span>
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{m.teamB}</td>
                        <td>
                          <span className={`badge badge-${r === 'V' ? 'w' : r === 'D' ? 'l' : 'n'}`}>
                            {r === 'V' ? 'Victoire' : r === 'D' ? 'Défaite' : 'Nul'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--muted)', fontSize: 12 }}>{m.lieu}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={e => { e.stopPropagation(); navigate(`/matches/${m.id}`) }}
                          >
                            →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
