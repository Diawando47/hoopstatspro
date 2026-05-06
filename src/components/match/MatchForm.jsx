import { useState } from 'react'
import { db } from '../../db/db'
import { useUIStore, useToastStore } from '../../store/useStore'
import { format } from 'date-fns'

export default function MatchForm() {
  const { closeModal } = useUIStore()
  const { show }       = useToastStore()
  const [form, setForm] = useState({
    teamA: localStorage.getItem('hoopstats_teamname') || '',
    teamB: '', scoreA: '', scoreB: '',
    date: format(new Date(), 'yyyy-MM-dd'), lieu: '',
  })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    if (!form.teamA.trim() || !form.teamB.trim()) { alert("Renseignez les deux équipes"); return }
    setLoading(true)
    try {
      localStorage.setItem('hoopstats_teamname', form.teamA.trim())
      await db.matches.add({
        teamA:  form.teamA.trim(),
        teamB:  form.teamB.trim(),
        scoreA: parseInt(form.scoreA) || 0,
        scoreB: parseInt(form.scoreB) || 0,
        date:   form.date,
        lieu:   form.lieu.trim() || 'Salle locale',
      })
      closeModal()
      show('✅ Match enregistré !')
    } catch (err) {
      alert(`Erreur : ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="modal-title">🏀 Nouveau Match</div>
      <div className="form-grid">
        <div className="form-group full"><label>Équipe domicile</label><input value={form.teamA} onChange={e => set('teamA', e.target.value)} placeholder="Votre équipe" autoFocus /></div>
        <div className="form-group full"><label>Équipe visiteur</label><input value={form.teamB} onChange={e => set('teamB', e.target.value)} placeholder="Adversaire" /></div>
        <div className="form-group"><label>Score domicile</label><input type="number" value={form.scoreA} onChange={e => set('scoreA', e.target.value)} placeholder="0" min="0" /></div>
        <div className="form-group"><label>Score visiteur</label><input type="number" value={form.scoreB} onChange={e => set('scoreB', e.target.value)} placeholder="0" min="0" /></div>
        <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        <div className="form-group"><label>Lieu</label><input value={form.lieu} onChange={e => set('lieu', e.target.value)} placeholder="Salle..." /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>
    </>
  )
}
