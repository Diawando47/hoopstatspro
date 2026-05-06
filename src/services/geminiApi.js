import { getResult, calcPlayerAvg, getMVP, formatDate } from '../hooks/useStats'

// ── CONFIG ─────────────────────────────────────────────
// Clé API Gemini — gratuite sur https://aistudio.google.com/apikey
// À mettre dans .env : VITE_GEMINI_API_KEY=votre_cle
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// ── APPEL API ──────────────────────────────────────────
export async function callGemini(prompt) {
  // ✅ Bug 3 corrigé — clé et URL lues au moment de l'appel, pas au chargement du module
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? ''

  if (!apiKey) {
    throw new Error(
      'Clé API Gemini manquante. Ajoutez VITE_GEMINI_API_KEY dans votre fichier .env'
    )
  }

  const url = `${BASE_URL}?key=${apiKey}`

  // ✅ Amélioration 10 — timeout 15s pour éviter spinner infini
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)

  const res = await fetch(url, {
    signal: controller.signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:     0.7,
        maxOutputTokens: 1024,
      },
    }),
  })
  clearTimeout(timer)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
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
Bilan saison : ${wins}V / ${losses}D / ${draws}N (${pct}% de victoires sur ${matches.length} matchs).
Résultats : ${matches.map(m => `${m.teamA} ${m.scoreA}-${m.scoreB} ${m.teamB}`).join(' | ')}.
Meilleur scoreur : ${topScorer?.name ?? 'N/A'} (${topScorer?.avg?.points ?? '?'} pts/match en moy.).
Génère un rapport de coach en 3-4 paragraphes : bilan, points forts collectifs, axes d'amélioration, recommandations tactiques. Utilise les chiffres. Sois direct et professionnel.`
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
  return `Coach basketball. Résultats récents (du plus ancien au plus récent) : ${[...matches].reverse().map(m => `${m.scoreA}-${m.scoreB} vs ${m.teamB} (${getResult(m)})`).join(' | ')}.
Analyse la tendance de forme, identifie les patterns, donne 3 recommandations concrètes pour améliorer les performances.`
}

export function buildMatchPrompt({ match, stats, players }) {
  if (!match) return ''
  const ms        = stats.filter(s => s.matchId === match.id)
  const mvp       = getMVP(ms)
  const mvpPlayer = mvp ? players.find(p => p.id === mvp.playerId) : null

  const statsLine = ms.map(s => {
    const p = players.find(x => x.id === s.playerId)
    return p
      ? `${p.name} : ${s.points}pts ${s.rebounds}reb ${s.assists}ast ${s.steals}stl ${s.fouls}fl ${s.minutes}min`
      : null
  }).filter(Boolean).join(' | ')

  return `Coach basketball. Rapport post-match :
${match.teamA} ${match.scoreA} - ${match.scoreB} ${match.teamB} le ${formatDate(match.date)} à ${match.lieu}.
Performances : ${statsLine || 'Aucune stat saisie'}.
MVP : ${mvpPlayer?.name ?? 'N/A'}.
Génère un rapport : résumé collectif (1 para.), performances individuelles notables (1 para.), 3 points clés pour le prochain match.`
}

export function buildPlayerPrompt({ player, stats, matches }) {
  if (!player) return ''
  const ps  = stats.filter(s => s.playerId === player.id)
  const avg = calcPlayerAvg(ps)

  const detail = ps.map(s => {
    const m = matches.find(x => x.id === s.matchId)
    return m ? `vs ${m.teamB} : ${s.points}pts ${s.rebounds}reb ${s.assists}ast` : null
  }).filter(Boolean).join(' | ')

  return `Analyste basketball. Bilan joueur :
${player.name} (${player.pos}, N°${player.number}) — ${avg?.games ?? 0} matchs.
Moyennes : ${avg?.points ?? 0}pts ${avg?.rebounds ?? 0}reb ${avg?.assists ?? 0}ast ${avg?.steals ?? 0}stl.
Détail par match : ${detail || 'Aucun match enregistré'}.
Analyse individuelle : style de jeu, performances remarquables, points forts, axes d'amélioration, recommandations concrètes.`
}
