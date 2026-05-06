import { useState, useEffect } from 'react'
import { db } from '../../db/db'
import { useUIStore, useToastStore } from '../../store/useStore'
import { useMatches, usePlayers, formatDate } from '../../hooks/useStats'

const FIELDS = [
  { key: 'points',   label: 'Points',          min: 0, max: 200 },
  { key: 'rebounds', label: 'Rebonds',         min: 0, max: 50  },
  { key: 'assists',  label: 'Passes décisives', min: 0, max: 50  },
  { key: 'steals',   label: 'Interceptions',   min: 0, max: 20  },
  { key: 'fouls',    label: 'Fautes',          min: 0, max: 6   },
  { key: 'minutes',  label: 'Minutes jouées',  min: 0, max: 48  },
]

export default function StatForm() {
  const { modal, closeModal } = useUIStore()
  const { show }              = useToastStore()
  const matches = useMatches()
  const players = usePlayers()

  // ✅ Tous les IDs sont des strings pour correspondre à value={m.id.toString()}
  const [matchId,  setMatchId]  = useState('')
  const [playerId, setPlayerId] = useState('')
  const [nums, setNums] = useState({
    points: '', rebounds: '', assists: '',
    steals: '', fouls:    '', minutes: '',
  })
  const [loading, setLoading] = useState(false)

  // Extrait le matchId passé via modal.data UNE SEULE FOIS à l'ouverture
  const modalMatchId = modal?.data?.matchId ? String(modal.data.matchId) : null

  // ✅ Bug 2 corrigé — dépendances stables : on extrait modalMatchId en dehors
  useEffect(() => {
    if (matches.length === 0) return
    const target = modalMatchId ?? String(matches[0].id)
    setMatchId(target)
  }, [matches.length, modalMatchId])

  useEffect(() => {
    if (players.length === 0) return
    setPlayerId(String(players[0].id))
  }, [players.length])

  async function submit() {
    const mId = parseInt(matchId)
    const pId = parseInt(playerId)
    if (!mId || !pId) { alert('Sélectionnez un match et un joueur'); return }

    // ✅ Amélioration 8 — validation des limites
    if ((parseInt(nums.fouls)   || 0) > 6)  { alert('Maximum 6 fautes'); return }
    if ((parseInt(nums.minutes) || 0) > 48) { alert('Maximum 48 minutes'); return }

    setLoading(true)
    try {
      const payload = {
        matchId:  mId,
        playerId: pId,
        points:   parseInt(nums.points)   || 0,
        rebounds: parseInt(nums.rebounds) || 0,
        assists:  parseInt(nums.assists)  || 0,
        steals:   parseInt(nums.steals)   || 0,
        fouls:    parseInt(nums.fouls)    || 0,
        minutes:  parseInt(nums.minutes)  || 0,
      }
      const existing = await db.stats.where({ matchId: mId, playerId: pId }).first()
      if (existing) await db.stats.update(existing.id, payload)
      else          await db.stats.add(payload)
      closeModal()
      show('✅ Stats enregistrées !')
    } catch (err) {
      alert(`Erreur : ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!matches.length || !players.length) return (
    <>
      <div className="modal-title">📊 Saisir Stats</div>
      <div style={{ color: 'var(--muted)', fontSize: 13, padding: '16px 0', lineHeight: 1.6 }}>
        ⚠️ Vous devez d'abord créer au moins un <strong>match</strong> et un <strong>joueur</strong>.
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={closeModal}>Fermer</button>
      </div>
    </>
  )

  return (
    <>
      <div className="modal-title">📊 Saisir Stats</div>
      <div className="form-grid">

        <div className="form-group full">
          <label>Match</label>
          <select value={matchId} onChange={e => setMatchId(e.target.value)}>
            {matches.map(m => (
              <option key={m.id} value={String(m.id)}>
                {formatDate(m.date)} — {m.teamA} vs {m.teamB}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full">
          <label>Joueur</label>
          <select value={playerId} onChange={e => setPlayerId(e.target.value)}>
            {players.map(p => (
              <option key={p.id} value={String(p.id)}>
                {p.name} ({p.pos} — N°{p.number})
              </option>
            ))}
          </select>
        </div>

        {FIELDS.map(({ key, label, min, max }) => (
          <div className="form-group" key={key}>
            <label>{label}</label>
            <input
              type="number"
              min={min}
              max={max}
              value={nums[key]}
              onChange={e => setNums(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </>
  )
}
