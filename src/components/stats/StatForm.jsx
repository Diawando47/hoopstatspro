import { useState } from 'react'
import { db } from '../../db/db'
import { useUIStore, useToastStore } from '../../store/useStore'
import { useMatches, usePlayers, formatDate } from '../../hooks/useStats'

const FIELDS = [
  { key: 'points',   label: 'Points' },
  { key: 'rebounds', label: 'Rebonds' },
  { key: 'assists',  label: 'Passes' },
  { key: 'steals',   label: 'Interceptions' },
  { key: 'fouls',    label: 'Fautes' },
  { key: 'minutes',  label: 'Minutes' },
]

export default function StatForm() {
  const { modal, closeModal } = useUIStore()
  const { show }              = useToastStore()
  const matches = useMatches()
  const players = usePlayers()
  const [form, setForm] = useState({
    matchId:  modal?.data?.matchId ?? matches[0]?.id ?? '',
    playerId: players[0]?.id ?? '',
    points: '', rebounds: '', assists: '', steals: '', fouls: '', minutes: '',
  })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    const matchId  = parseInt(form.matchId)
    const playerId = parseInt(form.playerId)
    if (!matchId || !playerId) { alert('Sélectionnez un match et un joueur'); return }
    setLoading(true)
    const payload = {
      matchId, playerId,
      points:   parseInt(form.points)   || 0,
      rebounds: parseInt(form.rebounds) || 0,
      assists:  parseInt(form.assists)  || 0,
      steals:   parseInt(form.steals)   || 0,
      fouls:    parseInt(form.fouls)    || 0,
      minutes:  parseInt(form.minutes)  || 0,
    }
    const existing = await db.stats.where({ matchId, playerId }).first()
    if (existing) await db.stats.update(existing.id, payload)
    else          await db.stats.add(payload)
    setLoading(false); closeModal(); show('✅ Stats enregistrées !')
  }

  return (
    <>
      <div className="modal-title">📊 Saisir Stats</div>
      <div className="form-grid">
        <div className="form-group full">
          <label>Match</label>
          <select value={form.matchId} onChange={e => set('matchId', e.target.value)}>
            {matches.map(m => <option key={m.id} value={m.id}>{formatDate(m.date)} — {m.teamA} vs {m.teamB}</option>)}
          </select>
        </div>
        <div className="form-group full">
          <label>Joueur</label>
          <select value={form.playerId} onChange={e => set('playerId', e.target.value)}>
            {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.pos} — N°{p.number})</option>)}
          </select>
        </div>
        {FIELDS.map(({ key, label }) => (
          <div className="form-group" key={key}>
            <label>{label}</label>
            <input type="number" min="0" value={form[key]} onChange={e => set(key, e.target.value)} placeholder="0" />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>
    </>
  )
}
