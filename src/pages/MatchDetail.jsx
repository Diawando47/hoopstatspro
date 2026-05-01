import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus } from 'lucide-react'
import { db } from '../db/db'
import { useUIStore } from '../store/useStore'
import {
  usePlayers, useMatchStats,
  getMVP, calcImpact, getResult, formatDate,
} from '../hooks/useStats'
import Avatar from '../components/ui/Avatar'

export default function MatchDetail() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const { openModal } = useUIStore()

  const matchId = parseInt(id)
  const match   = useLiveQuery(() => db.matches.get(matchId), [matchId])
  const players = usePlayers()
  const stats   = useMatchStats(matchId)

  if (!match) return (
    <div className="content" style={{ textAlign: 'center', paddingTop: 80, color: 'var(--muted)' }}>
      Chargement...
    </div>
  )

  const mvp         = getMVP(stats)
  const mvpPlayer   = mvp ? players.find(p => p.id === mvp.playerId) : null
  const result      = getResult(match)
  const sortedStats = [...stats].sort((a, b) => calcImpact(b) - calcImpact(a))

  return (
    <>
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-title">
            {match.teamA} <span>vs</span> {match.teamB}
          </div>
          <div className="page-sub">{formatDate(match.date)} · {match.lieu}</div>
        </motion.div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/matches')}>
            <ArrowLeft size={14} /> Retour
          </button>
          <button
            className="btn btn-primary"
            onClick={() => openModal('stat', { matchId: match.id })}
          >
            <Plus size={14} /> Stats
          </button>
        </div>
      </div>

      <div className="content">

        {/* Hero score */}
        <motion.div
          initial={{ opacity: 0, scale: .98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ padding: '24px 16px', marginBottom: 14, textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(255,107,43,.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>
                {match.teamA}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Domicile</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 900, lineHeight: 1 }}>
                <span className={result === 'V' ? 'score-w' : 'score-l'}>{match.scoreA}</span>
                <span style={{ color: 'var(--muted)', fontSize: 32, margin: '0 8px' }}>–</span>
                <span style={{ color: 'var(--muted)' }}>{match.scoreB}</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <span
                  className={`badge badge-${result === 'V' ? 'w' : result === 'D' ? 'l' : 'n'}`}
                  style={{ fontSize: 12, padding: '4px 14px' }}
                >
                  {result === 'V' ? 'VICTOIRE' : result === 'D' ? 'DÉFAITE' : 'NUL'}
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--muted)' }}>
                {match.teamB}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Visiteur</div>
            </div>
          </div>

          {/* MVP */}
          {mvpPlayer && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginTop: 18,
              background: 'rgba(240,180,41,.08)',
              border: '1px solid rgba(240,180,41,.2)',
              borderRadius: 8, padding: '8px 16px',
            }}>
              <span style={{ color: 'var(--gold)' }}>⭐</span>
              <Avatar name={mvpPlayer.name} color={mvpPlayer.color} size={28} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  MVP
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {mvpPlayer.name} · {mvp.points}pts {mvp.rebounds}reb {mvp.assists}ast
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats table */}
        {stats.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">Aucune statistique</div>
              <div className="empty-sub">Saisissez les performances des joueurs</div>
              <button
                className="btn btn-primary"
                onClick={() => openModal('stat', { matchId: match.id })}
              >
                <Plus size={14} /> Saisir les stats
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .12 }}
          >
            <div className="card-header">
              <span className="card-title">Performance Joueurs</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{stats.length} joueurs</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Joueur</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>STL</th>
                    <th>FL</th>
                    <th>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map(s => {
                    const p      = players.find(x => x.id === s.playerId)
                    if (!p) return null
                    const impact = calcImpact(s)
                    const isMVP  = mvp?.playerId === s.playerId
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={p.name} color={p.color} size={30} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>
                                {p.name}
                                {isMVP && (
                                  <span style={{ color: 'var(--gold)', marginLeft: 5 }}>⭐</span>
                                )}
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                                N°{p.number} · {p.pos}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{s.minutes}'</td>
                        <td style={{
                          fontWeight: 700,
                          color: s.points >= 20 ? 'var(--orange)' : 'var(--text)',
                        }}>
                          {s.points}
                        </td>
                        <td>{s.rebounds}</td>
                        <td>{s.assists}</td>
                        <td>{s.steals}</td>
                        <td style={{ color: s.fouls >= 4 ? 'var(--danger)' : 'var(--muted)' }}>
                          {s.fouls}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div className="progress-bar" style={{ width: 50 }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${Math.min(impact / 60 * 100, 100)}%` }}
                              />
                            </div>
                            <span style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 700, color: 'var(--orange)',
                              fontSize: 13,
                            }}>
                              {impact}
                            </span>
                          </div>
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
