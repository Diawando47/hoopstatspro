import Dexie from 'dexie'

// ── Schema IndexedDB ───────────────────────────────────
export const db = new Dexie('HoopStatsDB')

db.version(1).stores({
  players: '++id, name, number, team, pos, color',
  matches: '++id, date, teamA, teamB, scoreA, scoreB, lieu',
  stats:   '++id, matchId, playerId, points, rebounds, assists, steals, fouls, minutes',
})
