import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReportStore } from '../store/useStore'
import { useMatches, usePlayers, useAllStats, formatDate } from '../hooks/useStats'
import {
  callClaude,
  buildSeasonPrompt, buildMVPPrompt, buildTrendPrompt,
  buildMatchPrompt,  buildPlayerPrompt,
} from '../services/claudeApi'

const REPORT_LABELS = {
  season:    '📊 Rapport Saison',
  mvp:       '⭐ Analyse MVP',
  trend:     '📈 Tendances Équipe',
  lastmatch: '🏀 Dernier Match',
  match:     '📋 Rapport Match',
  player:    '👤 Bilan Joueur',
}

export default function Reports() {
  const { loading, content, type, setLoading, setReport, clearReport } = useReportStore()
  const matches  = useMatches()
  const players  = usePlayers()
  const allStats = useAllStats()

  const [selMatch,  setSelMatch]  = useState('')
  const [selPlayer, setSelPlayer] = useState('')

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
      if (reportType === 'match')     prompt = buildMatchPrompt({ ...ctx, match: matches.find(m => m.id === parseInt(id)) })
      if (reportType === 'player')    prompt = buildPlayerPrompt({ ...ctx, player: players.find(p => p.id === parseInt(id)) })

      if (!prompt) { setReport('Données insuffisantes pour ce rapport.', 'error'); return }

      const text = await callClaude(prompt)
      setReport(text, reportType)
    } catch (err) {
      setReport(`Erreur de connexion à l'API Claude. Vérifiez votre réseau.\n\n(${err.message})`, 'error')
    }
  }

  // Format markdown-like bold to <strong>
  const formatted = content
    ? content
        .split('\n\n')
        .filter(Boolean)
        .map(para => para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))
    : []

  return (
    <>
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-title">Rapports <span>IA</span></div>
          <div className="page-sub">Analyses intelligentes propulsées par Claude AI</div>
        </motion.div>
      </div>

      <div className="content">
        {/* Quick generate */}
        <motion.div
          className="ai-box"
          style={{ marginBottom: 20 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="ai-box-header">🤖 Analyse IA Disponible</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
            Générez des rapports de coach intelligents basés sur vos vraies données de saison.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={() => generate('season')}    disabled={loading || !matches.length}>
              📊 Rapport Saison
            </button>
            <button className="btn btn-ghost btn-sm"  onClick={() => generate('mvp')}       disabled={loading || !matches.length}>
              ⭐ Analyse MVP
            </button>
            <button className="btn btn-ghost btn-sm"  onClick={() => generate('trend')}     disabled={loading || !matches.length}>
              📈 Tendances
            </button>
            <button className="btn btn-ghost btn-sm"  onClick={() => generate('lastmatch')} disabled={loading || !matches.length}>
              🏀 Dernier Match
            </button>
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="ai-box"
              style={{ marginBottom: 20 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="ai-box-header">Génération en cours...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="dots-loader">
                  <span /><span /><span />
                </div>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Claude analyse vos données...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report output */}
        <AnimatePresence>
          {content && !loading && (
            <motion.div
              className="ai-box"
              style={{ marginBottom: 20 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="ai-box-header">
                {REPORT_LABELS[type] ?? '🤖 Rapport IA'}
                <button
                  onClick={clearReport}
                  style={{
                    marginLeft: 'auto', background: 'none', border: 'none',
                    color: 'var(--muted)', cursor: 'pointer', fontSize: 12,
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

        {/* Match & Player report cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Rapport match */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 20,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            <div style={{ fontSize: 28 }}>📋</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
              Rapport de Match
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Résumé complet : performances, MVP, stats clés, points à retenir.
            </div>
            <select
              value={selMatch}
              onChange={e => setSelMatch(e.target.value)}
            >
              <option value="">Choisir un match...</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {formatDate(m.date)} — {m.teamA} {m.scoreA}-{m.scoreB} {m.teamB}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => generate('match', selMatch)}
              disabled={!selMatch || loading}
            >
              Générer →
            </button>
          </motion.div>

          {/* Bilan joueur */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 20,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            <div style={{ fontSize: 28 }}>👤</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
              Bilan Joueur
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Analyse individuelle : progression, points forts, recommandations.
            </div>
            <select
              value={selPlayer}
              onChange={e => setSelPlayer(e.target.value)}
            >
              <option value="">Choisir un joueur...</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.pos} — N°{p.number})
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => generate('player', selPlayer)}
              disabled={!selPlayer || loading}
            >
              Générer →
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
