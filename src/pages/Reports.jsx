import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReportStore } from '../store/useStore'
import { useMatches, usePlayers, useAllStats, formatDate } from '../hooks/useStats'
import {
  callGemini,
  buildSeasonPrompt, buildMVPPrompt, buildTrendPrompt,
  buildMatchPrompt,  buildPlayerPrompt,
} from '../services/geminiApi'

const LABELS = {
  season:    '📊 Rapport Saison',
  mvp:       '⭐ Analyse MVP',
  trend:     '📈 Tendances',
  lastmatch: '🏀 Dernier Match',
  match:     '📋 Rapport Match',
  player:    '👤 Bilan Joueur',
}

export default function Reports() {
  const { loading, content, type, setLoading, setReport, clearReport } = useReportStore()
  const matches  = useMatches()
  const players  = usePlayers()
  const allStats = useAllStats()

  // ✅ Bug 1 — IDs en string, pré-sélection automatique au chargement
  const [selMatch,  setSelMatch]  = useState('')
  const [selPlayer, setSelPlayer] = useState('')

  useEffect(() => {
    if (matches.length > 0 && !selMatch) setSelMatch(String(matches[0].id))
  }, [matches])

  useEffect(() => {
    if (players.length > 0 && !selPlayer) setSelPlayer(String(players[0].id))
  }, [players])

  async function generate(reportType, id = null) {
    clearReport()
    setLoading(true)
    try {
      const ctx = { matches, players, stats: allStats }
      let prompt = ''

      if (reportType === 'season')    prompt = buildSeasonPrompt(ctx)
      if (reportType === 'mvp')       prompt = buildMVPPrompt(ctx)
      if (reportType === 'trend')     prompt = buildTrendPrompt(ctx)
      if (reportType === 'lastmatch') prompt = buildMatchPrompt({ ...ctx, match: matches[0] })
      if (reportType === 'match') {
        const match = matches.find(m => String(m.id) === String(id))
        if (!match) { setReport('Match introuvable.', 'error'); return }
        prompt = buildMatchPrompt({ ...ctx, match })
      }
      if (reportType === 'player') {
        const player = players.find(p => String(p.id) === String(id))
        if (!player) { setReport('Joueur introuvable.', 'error'); return }
        prompt = buildPlayerPrompt({ ...ctx, player })
      }

      if (!prompt) { setReport('Données insuffisantes.', 'error'); return }

      const text = await callGemini(prompt)
      setReport(text, reportType)
    } catch (err) {
      setReport(`Erreur : ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatted = content
    ? content.split('\n\n').filter(Boolean)
        .map(p => p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))
    : []

  const noData = !matches.length

  return (
    <>
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-title">Rapports <span>IA</span></div>
          <div className="page-sub">Analyses propulsées par Gemini Flash 2.0</div>
        </motion.div>
      </div>

      <div className="content">

        {/* Clé API manquante */}
        {!import.meta.env.VITE_GEMINI_API_KEY && (
          <div style={{
            background: 'rgba(240,180,41,.08)',
            border: '1px solid rgba(240,180,41,.3)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            marginBottom: 14,
            fontSize: 13,
            lineHeight: 1.6,
          }}>
            <strong style={{ color: 'var(--gold)' }}>⚠️ Clé API manquante</strong>
            <span style={{ color: 'var(--muted)', marginLeft: 8 }}>
              Ajoutez <code style={{ background: 'var(--card)', padding: '1px 6px', borderRadius: 4 }}>
                VITE_GEMINI_API_KEY=votre_cle
              </code> dans votre fichier <code style={{ background: 'var(--card)', padding: '1px 6px', borderRadius: 4 }}>.env</code>
              {' — '}clé gratuite sur{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer"
                style={{ color: 'var(--orange)' }}>
                aistudio.google.com
              </a>
            </span>
          </div>
        )}

        {/* Boutons rapides */}
        <motion.div
          className="ai-box"
          style={{ marginBottom: 14 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="ai-box-header">🤖 Analyse rapide</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
            Rapports de coach intelligents basés sur vos données réelles.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { type: 'season',    label: '📊 Saison'       },
              { type: 'mvp',       label: '⭐ MVP'           },
              { type: 'trend',     label: '📈 Tendances'     },
              { type: 'lastmatch', label: '🏀 Dernier Match' },
            ].map(btn => (
              <button
                key={btn.type}
                className={`btn btn-sm ${btn.type === 'season' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => generate(btn.type)}
                disabled={loading || noData}
              >
                {btn.label}
              </button>
            ))}
          </div>
          {noData && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
              ⚠️ Enregistrez au moins un match pour activer les rapports.
            </div>
          )}
        </motion.div>

        {/* Loader */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="ai-box"
              style={{ marginBottom: 14 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="ai-box-header">Génération en cours...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="dots-loader"><span /><span /><span /></div>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Gemini analyse vos données...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultat */}
        <AnimatePresence>
          {content && !loading && (
            <motion.div
              className="ai-box"
              style={{ marginBottom: 14 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="ai-box-header">
                {LABELS[type] ?? '🤖 Rapport IA'}
                <button
                  onClick={clearReport}
                  style={{
                    marginLeft: 'auto', background: 'none',
                    border: 'none', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: 12,
                  }}
                >
                  Effacer ✕
                </button>
              </div>
              <div className="ai-content">
                {formatted.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards match + joueur */}
        <div className="grid-2">

          {/* Rapport match */}
          <motion.div
            className="card" style={{ padding: 18 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .1 }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>📋</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              Rapport de Match
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
              Résumé complet : performances, MVP, points clés.
            </div>
            <select
              value={selMatch}
              onChange={e => setSelMatch(e.target.value)}
              style={{ marginBottom: 10 }}
            >
              {matches.length === 0 && <option value="">Aucun match</option>}
              {matches.map(m => (
                <option key={m.id} value={String(m.id)}>
                  {formatDate(m.date)} — {m.teamA} {m.scoreA}-{m.scoreB} {m.teamB}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => generate('match', selMatch)}
              disabled={!selMatch || loading || noData}
            >
              Générer →
            </button>
          </motion.div>

          {/* Bilan joueur */}
          <motion.div
            className="card" style={{ padding: 18 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15 }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>👤</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              Bilan Joueur
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
              Analyse individuelle, progression, recommandations.
            </div>
            <select
              value={selPlayer}
              onChange={e => setSelPlayer(e.target.value)}
              style={{ marginBottom: 10 }}
            >
              {players.length === 0 && <option value="">Aucun joueur</option>}
              {players.map(p => (
                <option key={p.id} value={String(p.id)}>
                  {p.name} ({p.pos} — N°{p.number})
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => generate('player', selPlayer)}
              disabled={!selPlayer || loading || !players.length}
            >
              Générer →
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
