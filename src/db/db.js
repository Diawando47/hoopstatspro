import Dexie from 'dexie'

// ── Schema IndexedDB ───────────────────────────────────
export const db = new Dexie('HoopStatsDB')

db.version(1).stores({
  players: '++id, team',
  matches: '++id, date',
  stats:   '++id, matchId, playerId, [matchId+playerId]',
})
