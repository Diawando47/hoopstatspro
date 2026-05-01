import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useUIStore } from '../store/useStore'
import {
  useMatches, usePlayers, useAllStats,
  calcRecord, calcPlayerAvg, getMVP,
  getResult, formatDate,
} from '../hooks/useStats'
import StatCard  from '../components/ui/StatCard'
import Avatar    from '../components/ui/Avatar'
import Sparkline from '../components/ui/Sparkline'

const fade = (i = 0) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { delay: i * 0.06   },
})

export default function Dashboard() {
  const navigate      = useNavigate()
  const { openModal } = useUIStore()
  const matches       = useMatches()
  const players       = usePlayers()
  const allStats      = useAllStats()

  const record  = useMemo(() => calcRecord(matches), [matches])
  const avgPts  = useMemo(() =>
    matches.length
      ? Math.round(matches.reduce((a, m) => a + m.scoreA, 0) / matches.length)
      : 0,
    [matches])

  const lastMatch      = matches[0]
  const lastMatchStats = useMemo(() =>
    lastMatch ? allStats.filter(s => s.matchId === lastMatch.id) : [],
    [lastMatch, allStats])
  const mvpStat   = useMemo(() => getMVP(lastMatchStats), [lastMatchStats])
  const mvpPlayer = useMemo(() =>
    mvpStat ? players.find(p => p.id === mvpStat.playerId) : null,
    [mvpStat, players])

  const topScorers = useMemo(() =>
    players
      .map(p => ({ ...p, avg: calcPlayerAvg(allStats.filter(s => s.playerId === p.id)) }))
      .filter(p => p.avg)
      .sort((a, b) => b.avg.points - a.avg.points)
      .slice(0, 3),
    [players, allStats])

  const trend = useMemo(() =>
    [...matches].reverse().slice(-7).map(m => m.scoreA),
    [matches])

  // ── Empty state ─────────────────────────────────────
  if (!matches.length) return (
    <div className="content">
      <div className="empty-state">
        <div className="empty-icon">🏀</div>
        <div className="empty-title">Bienvenue sur HoopStats</div>
        <div className="empty-sub">Commencez par enregistrer votre premier match</div>
        <button className="btn btn-primary" onClick={() => openModal('match')}>
          <Plus size={14} /> Nouveau Match
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="page-header">
        <motion.div {...fade(0)}>
          <div className="page-title">Dashboard <span>Club</span></div>
          <div className="page-sub">Saison 2024/2025</div>
        </motion.div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => openModal('match')}>
            <Plus size={14} /> Nouveau Match
          </button>
        </div>
      </div>

      <div className="content">

        {/* KPIs */}
        <motion.div className="stat-grid" style={{ marginBottom: 14 }} {...fade(1)}>
          <StatCard label="Victoires"   value={record.wins}    change={`${record.pct}% win rate`} changeType="up"   color="orange" />
          <StatCard label="Défaites"    value={record.losses}  change={`${record.total} matchs`}  changeType="down" color="gold"   />
          <StatCard label="Moy. Points" value={avgPts}         change="↑ pts/match"               changeType="up"   color="blue"  />
          <StatCard label="Joueurs"     value={players.length} change="Actifs"                    changeType="up"   color="green" />
        </motion.div>

        {/* Dernier match + Top scoreurs */}
        <motion.div className="grid-2" style={{ marginBottom: 14 }} {...fade(2)}>

          {/* Dernier match */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Dernier Match</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(`/matches/${lastMatch.id}`)}
              >
                Détails →
              </button>
            </div>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 20, padding: '6px 0',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>
                    {lastMatch.teamA}
                  </div>
                  <div
                    className={`score-cell ${getResult(lastMatch) === 'V' ? 'score-w' : 'score-l'}`}
                    style={{ fontSize: 44 }}
                  >
                    {lastMatch.scoreA}
                  </div>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>VS</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--muted)' }}>
                    {lastMatch.teamB}
                  </div>
                  <div className="score-cell" style={{ fontSize: 44, color: 'var(--muted)' }}>
                    {lastMatch.scoreB}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {formatDate(lastMatch.date)} · {lastMatch.lieu}
              </div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge badge-${getResult(lastMatch) === 'V' ? 'w' : getResult(lastMatch) === 'D' ? 'l' : 'n'}`}>
                  {getResult(lastMatch) === 'V' ? 'VICTOIRE' : getResult(lastMatch) === 'D' ? 'DÉFAITE' : 'NUL'}
                </span>
              </div>

              {/* MVP */}
              {mvpPlayer && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginTop: 12, paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                  textAlign: 'left',
                }}>
                  <Avatar name={mvpPlayer.name} color={mvpPlayer.color} size={34} />
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      ⭐ MVP
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{mvpPlayer.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {mvpStat.points}pts · {mvpStat.rebounds}reb · {mvpStat.assists}ast
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top scoreurs */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Scoreurs</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>moy./match</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topScorers.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                  Aucune stat enregistrée
                </div>
              )}
              {topScorers.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: 10,
                  background: 'rgba(255,107,43,.04)',
                  border: '1px solid rgba(255,107,43,.1)',
                  borderRadius: 10,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20, fontWeight: 900,
                    color: 'var(--orange)', width: 22,
                  }}>
                    #{i + 1}
                  </div>
                  <Avatar name={p.name} color={p.color} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 13,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {p.pos} · {p.avg.games} matchs
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>
                    {p.avg.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tendance + Historique */}
        <motion.div className="grid-1-2" {...fade(3)}>

          {/* Tendance */}
          <div className="card">
            <div className="card-header"><span className="card-title">Tendance</span></div>
            <div className="card-body">
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Points marqués</div>
              <Sparkline values={trend} height={48} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--muted)' }}>
                <span>Ancien</span><span>Récent</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 14, textAlign: 'center' }}>
                {[
                  { v: record.wins,   l: 'V', bg: 'rgba(46,204,113,.1)',  c: 'var(--success)' },
                  { v: record.losses, l: 'D', bg: 'rgba(231,76,60,.1)',   c: 'var(--danger)'  },
                  { v: record.draws,  l: 'N', bg: 'rgba(112,112,160,.1)', c: 'var(--muted)'   },
                ].map(({ v, l, bg, c }) => (
                  <div key={l} style={{ background: bg, borderRadius: 8, padding: 8 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Historique</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/matches')}>
                Voir tout →
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th><th>Adversaire</th><th>Score</th><th>Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.slice(0, 5).map(m => (
                    <tr
                      key={m.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/matches/${m.id}`)}
                    >
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{formatDate(m.date)}</td>
                      <td style={{ fontWeight: 600 }}>{m.teamB}</td>
                      <td>
                        <span className={`score-cell ${getResult(m) === 'V' ? 'score-w' : 'score-l'}`}>
                          {m.scoreA}
                        </span>
                        <span style={{ color: 'var(--muted)', margin: '0 4px' }}>–</span>
                        <span className="score-cell" style={{ color: 'var(--muted)' }}>{m.scoreB}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${getResult(m) === 'V' ? 'w' : getResult(m) === 'D' ? 'l' : 'n'}`}>
                          {getResult(m) === 'V' ? 'V' : getResult(m) === 'D' ? 'D' : 'N'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
