import { getResult, calcPlayerAvg, getMVP, formatDate } from '../hooks/useStats'

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL   = 'claude-sonnet-4-20250514'

// ── API CALL ───────────────────────────────────────────
export async function callClaude(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

// ── PROMPT BUILDERS ────────────────────────────────────

export function buildSeasonPrompt({ matches, players, stats }) {
  const wins   = matches.filter(m => getResult(m) === 'V').length
  const losses = matches.filter(m => getResult(m) === 'D').length
  const draws  = matches.filter(m => getResult(m) === 'N').length
  const pct    = matches.length ? Math.round(wins / matches.length * 100) : 0

  const topScorer = players
    .map(p => ({ ...p, avg: calcPlayerAvg(stats.filter(s => s.playerId === p.id)) }))
    .filter(p => p.avg)
    .sort((a, b) => b.avg.points - a.avg.points)[0]

  return `Tu es analyste pour un club de basketball professionnel.
Bilan saison Bulls FC : ${wins}V / ${losses}D / ${draws}N (${pct}% de victoires sur ${matches.length} matchs).
Résultats : ${matches.map(m => `${m.teamA} ${m.scoreA}-${m.scoreB} ${m.teamB}`).join(' | ')}.
Meilleur scoreur : ${topScorer?.name ?? 'N/A'} (${topScorer?.avg?.points ?? '?'} pts/match en moy.).
Génère un rapport de coach en 3-4 paragraphes : bilan, points forts collectifs, axes d'amélioration prioritaires, recommandations tactiques concrètes. Utilise les chiffres. Sois direct et professionnel.`
}

export function buildMVPPrompt({ matches, players, stats }) {
  const withAvg = players
    .map(p => ({ ...p, avg: calcPlayerAvg(stats.filter(s => s.playerId === p.id)) }))
    .filter(p => p.avg)

  const mvpCounts = {}
  matches.forEach(m => {
    const ms  = stats.filter(s => s.matchId === m.id)
    const mvp = getMVP(ms)
    if (mvp) {
      const p = players.find(x => x.id === mvp.playerId)
      if (p) mvpCounts[p.name] = (mvpCounts[p.name] || 0) + 1
    }
  })

  return `Analyste basketball. MVPs de la saison : ${JSON.stringify(mvpCounts)}.
Stats moyennes : ${withAvg.map(p => `${p.name} ${p.avg.points}pts ${p.avg.rebounds}reb ${p.avg.assists}ast`).join(' | ')}.
Identifie le meilleur joueur de la saison, justifie avec les données en 2-3 paragraphes.`
}

export function buildTrendPrompt({ matches }) {
  return `Coach basketball. Résultats récents : ${matches.map(m => `${m.scoreA}-${m.scoreB} vs ${m.teamB} (${getResult(m)})`).join(' | ')}.
Analyse la tendance de forme, identifie les patterns, donne 3 recommandations concrètes pour améliorer les performances.`
}

export function buildMatchPrompt({ match, stats, players }) {
  const ms = stats.filter(s => s.matchId === match.id)
  const mvp = getMVP(ms)
  const mvpPlayer = mvp ? players.find(p => p.id === mvp.playerId) : null

  const statsLine = ms.map(s => {
    const p = players.find(x => x.id === s.playerId)
    return p ? `${p.name} : ${s.points}pts ${s.rebounds}reb ${s.assists}ast ${s.steals}stl ${s.fouls}fl ${s.minutes}min` : null
  }).filter(Boolean).join(' | ')

  return `Coach basketball. Rapport post-match :
${match.teamA} ${match.scoreA} - ${match.scoreB} ${match.teamB} le ${formatDate(match.date)} à ${match.lieu}.
Performances : ${statsLine || 'Aucune stat saisie'}.
MVP : ${mvpPlayer?.name ?? 'N/A'}.
Génère un rapport : résumé collectif (1 para.), performances individuelles notables (1 para.), 3 points clés pour le prochain match.`
}

export function buildPlayerPrompt({ player, stats, matches }) {
  const ps  = stats.filter(s => s.playerId === player.id)
  const avg = calcPlayerAvg(ps)

  const detail = ps.map(s => {
    const m = matches.find(x => x.id === s.matchId)
    return m ? `vs ${m.teamB} : ${s.points}pts ${s.rebounds}reb ${s.assists}ast` : null
  }).filter(Boolean).join(' | ')

  return `Analyste basketball. Bilan joueur :
${player.name} (${player.pos}, N°${player.number}) — ${avg?.games ?? 0} matchs.
Moyennes : ${avg?.points ?? 0}pts ${avg?.rebounds ?? 0}reb ${avg?.assists ?? 0}ast ${avg?.steals ?? 0}stl.
Détail : ${detail || 'Aucun match'}.
Analyse individuelle : style de jeu, performances remarquables, points forts, axes d'amélioration, recommandations concrètes.`
}
