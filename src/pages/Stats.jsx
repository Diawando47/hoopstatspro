import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useReportStore } from '../store/useStore'
import { usePlayers, useAllStats, calcPlayerAvg } from '../hooks/useStats'
import Avatar from '../components/ui/Avatar'

const TABS = [
  { key: 'points',   label: 'Points'        },
  { key: 'rebounds', label: 'Rebonds'       },
  { key: 'assists',  label: 'Passes'        },
  { key: 'steals',   label: 'Interceptions' },
]

const medalColor = (i) => {
  if (i === 0) return 'var(--gold)'
  if (i === 1) return '#bdc3c7'
  if (i === 2) return '#cd7f32'
  return 'var(--muted)'
}

export default function Stats() {
  const { statsTab, setStatsTab } = useReportStore()
  const players  = usePlayers()
  const allStats = useAllStats()

  const ranked = useMemo(() =>
    players
      .map(p => ({
        ...p,
        avg: calcPlayerAvg(allStats.filter(s => s.playerId === p.id)),
      }))
      .filter(p => p.avg)
      .sort((a, b) => parseFloat(b.avg[statsTab]) - parseFloat(a.avg[statsTab])),
    [players, allStats, statsTab]
  )

  const maxVal = ranked.length ? parseFloat(ranked[0].avg[statsTab]) : 1

  return (
    <>
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-title">Stats <span>Saison</span></div>
          <div className="page-sub">
            Moyennes · {ranked.length} joueur{ranked.length > 1 ? 's' : ''} avec stats
          </div>
        </motion.div>
      </div>

      <div className="content">
        <div className="tabs">
          {TABS.map(t => (
            <div
              key={t.key}
              className={`tab${statsTab === t.key ? ' active' : ''}`}
              onClick={() => setStatsTab(t.key)}
            >
              {t.label}
            </div>
          ))}
        </div>

        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Joueur</th>
                  <th>Pos.</th>
                  <th>PTS</th>
                  <th>REB</th>
                  <th>AST</th>
                  <th>STL</th>
                  <th>Matchs</th>
                  <th>Perf.</th>
                </tr>
              </thead>
              <tbody>
                {ranked.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}
                    >
                      Aucune statistique enregistrée.
                    </td>
                  </tr>
                )}
                {ranked.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0  }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22, fontWeight: 900,
                        color: medalColor(i),
                      }}>
                        {i + 1}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={p.name} color={p.color} size={32} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>N°{p.number}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-pos">{p.pos}</span></td>
                    <td style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18, fontWeight: 800,
                      color: 'var(--orange)',
                    }}>
                      {p.avg.points}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.avg.rebounds}</td>
                    <td style={{ fontWeight: 600 }}>{p.avg.assists}</td>
                    <td>{p.avg.steals}</td>
                    <td style={{ color: 'var(--muted)' }}>{p.avg.games}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="progress-bar" style={{ width: 70 }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(
                                parseFloat(p.avg[statsTab]) / maxVal * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--muted)', minWidth: 30 }}>
                          {p.avg[statsTab]}/m
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </>
  )
}
