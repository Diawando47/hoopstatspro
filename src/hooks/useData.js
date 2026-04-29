// ─── Hooks métier ─────────────────────────────────────
// Toutes les requêtes Dexie sont ici, pas dans les composants.

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

// ── Players ───────────────────────────────────────────
export function usePlayers() {
  return useLiveQuery(() => db.players.toArray(), [], [])
}

export function usePlayer(id) {
  return useLiveQuery(() => id ? db.players.get(Number(id)) : null, [id])
}

export async function addPlayer(data) {
  return db.players.add(data)
}

export async function updatePlayer(id, data) {
  return db.players.update(id, data)
}

export async function deletePlayer(id) {
  await db.stats.where('playerId').equals(id).delete()
  return db.players.delete(id)
}

// ── Matches ───────────────────────────────────────────
export function useMatches() {
  return useLiveQuery(
    () => db.matches.orderBy('date').reverse().toArray(),
    [],
    []
  )
}

export function useMatch(id) {
  return useLiveQuery(() => id ? db.matches.get(Number(id)) : null, [id])
}

export async function addMatch(data) {
  return db.matches.add(data)
}

export async function deleteMatch(id) {
  await db.stats.where('matchId').equals(id).delete()
  return db.matches.delete(id)
}

// ── Stats ─────────────────────────────────────────────
export function useMatchStats(matchId) {
  return useLiveQuery(
    () => matchId ? db.stats.where('matchId').equals(Number(matchId)).toArray() : [],
    [matchId],
    []
  )
}

export function useAllStats() {
  return useLiveQuery(() => db.stats.toArray(), [], [])
}

export async function upsertStat(data) {
  // Remplace si existe déjà pour ce joueur/match
  const existing = await db.stats
    .where({ matchId: data.matchId, playerId: data.playerId })
    .first()
  if (existing) {
    return db.stats.update(existing.id, data)
  }
  return db.stats.add(data)
}

export async function deleteStat(id) {
  return db.stats.delete(id)
}
