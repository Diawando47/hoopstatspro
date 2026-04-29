// ─── Logique métier pure ──────────────────────────────
// Fonctions sans effet de bord — faciles à tester.

export function getResult(match) {
  if (!match) return null
  if (match.scoreA > match.scoreB) return 'V'
  if (match.scoreA < match.scoreB) return 'D'
  return 'N'
}

export function calcMVP(matchStats) {
  if (!matchStats?.length) return null
  return matchStats
    .map(s => ({
      ...s,
      impact: +(s.points * 1 + s.rebounds * 0.7 + s.assists * 0.8 + s.steals * 1.2).toFixed(1),
    }))
    .sort((a, b) => b.impact - a.impact)[0]
}

export function playerAverages(stats) {
  if (!stats?.length) return null
  const n = stats.length
  const sum = (key) => stats.reduce((acc, s) => acc + (s[key] || 0), 0)
  return {
    games:    n,
    points:   +(sum('points')   / n).toFixed(1),
    rebounds: +(sum('rebounds') / n).toFixed(1),
    assists:  +(sum('assists')  / n).toFixed(1),
    steals:   +(sum('steals')   / n).toFixed(1),
    fouls:    +(sum('fouls')    / n).toFixed(1),
    minutes:  +(sum('minutes')  / n).toFixed(1),
  }
}

export function teamRecord(matches) {
  if (!matches?.length) return { wins: 0, losses: 0, draws: 0, pct: 0 }
  const wins   = matches.filter(m => getResult(m) === 'V').length
  const losses = matches.filter(m => getResult(m) === 'D').length
  const draws  = matches.filter(m => getResult(m) === 'N').length
  return { wins, losses, draws, pct: Math.round(wins / matches.length * 100) }
}

export function initials(name = '') {
  return name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function avatarColors() {
  return ['#e74c3c','#3498db','#2ecc71','#9b59b6','#f39c12','#1abc9c','#e67e22','#16a085','#8e44ad']
}

// Construit le prompt IA selon le type de rapport
export function buildAIPrompt(type, { matches, players, stats, id } = {}) {
  const rec = teamRecord(matches)

  const playerAvgStr = players.map(p => {
    const ps = stats.filter(s => s.playerId === p.id)
    const avg = playerAverages(ps)
    return avg ? `${p.name}: ${avg.points}pts ${avg.rebounds}reb ${avg.assists}ast (${avg.games} matchs)` : null
  }).filter(Boolean).join(' | ')

  switch (type) {
    case 'season':
      return `Tu es analyste pour un club de basketball professionnel.
Données saison Bulls FC :
- Bilan : ${rec.wins}V / ${rec.losses}D / ${rec.draws}N (${rec.pct}% victoires)
- Matchs : ${matches.map(m => `${m.teamA} ${m.scoreA}-${m.scoreB} ${m.teamB}`).join(', ')}
- Moyennes joueurs : ${playerAvgStr}
Génère un rapport de coach structuré (4 paragraphes) : bilan saison, points forts collectifs, axes d'amélioration, recommandations tactiques. Sois direct, précis, avec données chiffrées.`

    case 'mvp': {
      return `Analyste basketball. Moyennes joueurs cette saison : ${playerAvgStr}.
Matchs : ${matches.map(m => `${m.scoreA}-${m.scoreB} vs ${m.teamB}`).join(', ')}.
Identifie le MVP de la saison avec justification chiffrée en 2-3 paragraphes. Compare les candidats.`
    }

    case 'trend':
      return `Coach basketball. Résultats chronologiques : ${[...matches].reverse().map(m => `${m.scoreA}-${m.scoreB} vs ${m.teamB} (${getResult(m)})`).join(', ')}.
Analyse la forme récente, identifie les patterns et donne 3 recommandations concrètes et actionnables.`

    case 'lastmatch': {
      const m = matches[0]
      const ms = stats.filter(s => s.matchId === m?.id)
      const mvp = calcMVP(ms)
      const mvpP = players.find(p => p.id === mvp?.playerId)
      return `Coach basketball. Match : ${m?.teamA} ${m?.scoreA} - ${m?.scoreB} ${m?.teamB}.
Stats : ${ms.map(s => { const p = players.find(x => x.id === s.playerId); return p ? `${p.name} ${s.points}pts ${s.rebounds}reb ${s.assists}ast ${s.steals}stl ${s.fouls}fl ${s.minutes}min` : null }).filter(Boolean).join(' | ')}.
MVP : ${mvpP?.name}. Rapport post-match : analyse collective, performances individuelles remarquables, 3 points d'amélioration pour le prochain match.`
    }

    case 'match': {
      const m = matches.find(x => x.id === Number(id))
      const ms = stats.filter(s => s.matchId === Number(id))
      const mvp = calcMVP(ms)
      const mvpP = players.find(p => p.id === mvp?.playerId)
      return `Coach basketball. Match du ${formatDate(m?.date)} : ${m?.teamA} ${m?.scoreA} - ${m?.scoreB} ${m?.teamB} à ${m?.lieu}.
Stats joueurs : ${ms.map(s => { const p = players.find(x => x.id === s.playerId); return p ? `${p.name} ${s.points}pts ${s.rebounds}reb ${s.assists}ast ${s.steals}stl ${s.fouls}fl ${s.minutes}min` : null }).filter(Boolean).join(' | ')}.
MVP calculé : ${mvpP?.name} (impact score ${mvp?.impact}). Analyse complète 3 paragraphes : résumé collectif, MVP justifié, 3 points clés.`
    }

    case 'player': {
      const p = players.find(x => x.id === Number(id))
      const ps = stats.filter(s => s.playerId === Number(id))
      const avg = playerAverages(ps)
      return `Analyste basketball. Bilan joueur : ${p?.name} (${p?.position}, №${p?.number}).
Moyennes saison (${avg?.games} matchs) : ${avg?.points}pts ${avg?.rebounds}reb ${avg?.assists}ast ${avg?.steals}stl.
Match par match : ${ps.map(s => { const m = matches.find(x => x.id === s.matchId); return m ? `vs ${m.teamB}: ${s.points}pts ${s.rebounds}reb ${s.assists}ast` : null }).filter(Boolean).join(' | ')}.
Analyse individuelle : style de jeu, évolution sur la saison, points forts, axes d'amélioration, recommandations coaching.`
    }

    default: return ''
  }
}
