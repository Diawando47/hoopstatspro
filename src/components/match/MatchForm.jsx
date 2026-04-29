import { useState } from 'react'
import { db } from '../../db/db'
import { useUIStore, useToastStore } from '../../store/useStore'
import { format } from 'date-fns'

export default function MatchForm() {
  const { closeModal } = useUIStore()
  const { show }       = useToastStore()
  const today = format(new Date(), 'yyyy-MM-dd')

  const [form, setForm] = useState({
    teamA: 'Bulls FC', teamB: '',
    scoreA: '', scoreB: '',
    date: today, lieu: '',
  })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit() {
    if (!form.teamB.trim()) { alert("Renseignez l'équipe adversaire"); return }
    setLoading(true)
    await db.matches.add({
      teamA:  form.teamA.trim() || 'Bulls FC',
      teamB:  form.teamB.trim(),
      scoreA: parseInt(form.scoreA) || 0,
      scoreB: parseInt(form.scoreB) || 0,
      date:   form.date,
      lieu:   form.lieu.trim() || 'Salle locale',
    })
    setLoading(false)
    closeModal()
    show('✅ Match enregistré !')
  }

  return (
    <>
      <div className="modal-title">🏀 Nouveau Match</div>
      <div className="form-grid">
        <div className="form-group">
          <label>Équipe A (domicile)</label>
          <input value={form.teamA} onChange={e => set('teamA', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Équipe B (visiteur)</label>
          <input value={form.teamB} onChange={e => set('teamB', e.target.value)} placeholder="Adversaire..." autoFocus />
        </div>
        <div className="form-group">
          <label>Score A</label>
          <input type="number" value={form.scoreA} onChange={e => set('scoreA', e.target.value)} placeholder="0" min="0" />
        </div>
        <div className="form-group">
          <label>Score B</label>
          <input type="number" value={form.scoreB} onChange={e => set('scoreB', e.target.value)} placeholder="0" min="0" />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Lieu</label>
          <input value={form.lieu} onChange={e => set('lieu', e.target.value)} placeholder="Salle..." />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </>
  )
}
