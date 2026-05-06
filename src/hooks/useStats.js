import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { db } from '../db/db'

// ── PURE HELPERS ───────────────────────────────────────

export function calcImpact(s) {
  return +(s.points * 1 + s.rebounds * 0.7 + s.assists * 0.8 + s.steals * 1.2).toFixed(1)
}

export function getMVP(matchStats) {
  if (!matchStats?.length) return null
  return [...matchStats].sort((a, b) => calcImpact(b) - calcImpact(a))[0]
}

/** Moyennes sur un tableau de stats */
export function calcPlayerAvg(stats) {
  if (!stats?.length) return null
  const n   = stats.length
  const avg = (key) => +(stats.reduce((a, s) => a + (s[key] || 0), 0) / n).toFixed(1)
  return {
    points:   avg('points'),
    rebounds: avg('rebounds'),
    assists:  avg('assists'),
    steals:   avg('steals'),
    fouls:    avg('fouls'),
    minutes:  avg('minutes'),
    games:    n,
  }
}

export function getResult(match) {
  if (!match) return 'N'
  if (match.scoreA > match.scoreB) return 'V'
  if (match.scoreA < match.scoreB) return 'D'
  return 'N'
}

export function calcRecord(matches) {
  if (!matches?.length) return { wins: 0, losses: 0, draws: 0, pct: 0, total: 0 }
  const wins   = matches.filter(m => getResult(m) === 'V').length
  const losses = matches.filter(m => getResult(m) === 'D').length
  const draws  = matches.filter(m => getResult(m) === 'N').length
  return { wins, losses, draws, pct: Math.round(wins / matches.length * 100), total: matches.length }
}

export function initials(name) {
  return (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function formatDate(d) {
  return format(new Date(d), 'd MMM yyyy', { locale: fr })
}

// ── LIVE QUERY HOOKS ───────────────────────────────────

export function useMatches() {
  return useLiveQuery(() => db.matches.orderBy('date').reverse().toArray(), [], [])
}

export function usePlayers() {
  return useLiveQuery(() => db.players.toArray(), [], [])
}

export function useAllStats() {
  return useLiveQuery(() => db.stats.toArray(), [], [])
}

export function useMatchStats(matchId) {
  return useLiveQuery(
    () => matchId ? db.stats.where('matchId').equals(matchId).toArray() : Promise.resolve([]),
    [matchId],
    []
  )
}

export function usePlayerStats(playerId) {
  return useLiveQuery(
    () => playerId ? db.stats.where('playerId').equals(playerId).toArray() : Promise.resolve([]),
    [playerId],
    []
  )
}

// ✅ Bug 6 — distingue "Dexie charge" de "base vraiment vide"
// Sans defaultValue, useLiveQuery retourne undefined pendant le chargement
export function useIsReady() {
  const result = useLiveQuery(() => db.matches.count(), [])
  return result !== undefined
}
