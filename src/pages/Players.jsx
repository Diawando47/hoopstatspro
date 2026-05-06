import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useUIStore, useToastStore } from '../store/useStore'
import { usePlayers, useAllStats, calcPlayerAvg } from '../hooks/useStats'
import Avatar from '../components/ui/Avatar'
import { db } from '../db/db'

export default function Players() {
  const { openModal } = useUIStore()
  const { show }      = useToastStore()
  const players       = usePlayers()
  const allStats      = useAllStats()

  const playersWithAvg = useMemo(() =>
    players.map(p => ({
      ...p,
      avg: calcPlayerAvg(allStats.filter(s => s.playerId === p.id)),
    })),
    [players, allStats]
  )

  async function handleDelete(p) {
    if (!confirm(`Supprimer ${p.name} ? Ses statistiques seront aussi supprimées.`)) return
    try {
      await db.stats.where('playerId').equals(p.id).delete()
      await db.players.delete(p.id)
      show(`🗑️ ${p.name} supprimé`)
    } catch (err) {
      alert(`Erreur lors de la suppression : ${err.message}`)
    }
  }

  return (
    <>
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-title">Gestion des <span>Joueurs</span></div>
          <div className="page-sub">
            {players.length} joueur{players.length > 1 ? 's' : ''} actif{players.length > 1 ? 's' : ''}
          </div>
        </motion.div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => openModal('player')}>
            <Plus size={14} /> Ajouter Joueur
          </button>
        </div>
      </div>

      <div className="content">
        {players.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-title">Aucun joueur</div>
              <div className="empty-sub">Ajoutez vos joueurs pour commencer à saisir des stats</div>
              <button className="btn btn-primary" onClick={() => openModal('player')}>
                <Plus size={14} /> Ajouter un joueur
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className="grid-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {playersWithAvg.map(p => (
              <motion.div
                key={p.id}
                className="card"
                variants={{
                  hidden:   { opacity: 0, y: 16 },
                  visible:  { opacity: 1, y: 0  },
                }}
                whileHover={{ y: -2, transition: { duration: .15 } }}
                style={{ position: 'relative' }}
              >
                {/* Color bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: p.color,
                  borderRadius: 'var(--radius) var(--radius) 0 0',
                }} />

                <div className="card-body">
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <Avatar name={p.name} color={p.color} size={46} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 17, fontWeight: 800,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {p.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <span className="badge badge-pos">{p.pos}</span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>N°{p.number}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '7px 8px', flexShrink: 0 }}
                      onClick={() => handleDelete(p)}
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Stats */}
                  {p.avg ? (
                    <>
                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 6, textAlign: 'center',
                        borderTop: '1px solid var(--border)', paddingTop: 12,
                      }}>
                        {[
                          { v: p.avg.points,   l: 'PTS', hi: true },
                          { v: p.avg.rebounds, l: 'REB'           },
                          { v: p.avg.assists,  l: 'AST'           },
                          { v: p.avg.games,    l: 'MAT'           },
                        ].map(({ v, l, hi }) => (
                          <div key={l}>
                            <div style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 22, fontWeight: 800,
                              color: hi ? 'var(--orange)' : 'var(--text)',
                            }}>
                              {v}
                            </div>
                            <div style={{
                              fontSize: 9, color: 'var(--muted)',
                              textTransform: 'uppercase', letterSpacing: 1,
                            }}>
                              {l}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Scoring bar */}
                      <div style={{ marginTop: 10 }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          fontSize: 10, color: 'var(--muted)', marginBottom: 4,
                        }}>
                          <span>Scoring</span>
                          <span>{p.avg.points} pts/match</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(parseFloat(p.avg.points) / 40 * 100, 100)}%`,
                              background: p.color,
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{
                      borderTop: '1px solid var(--border)', paddingTop: 12,
                      textAlign: 'center', color: 'var(--muted)', fontSize: 12,
                    }}>
                      Aucun match enregistré
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}
