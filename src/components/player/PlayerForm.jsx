import { useState } from 'react'
import { db } from '../../db/db'
import { useUIStore, useToastStore } from '../../store/useStore'

const COLORS = ['#e74c3c','#3498db','#2ecc71','#9b59b6','#f39c12','#1abc9c','#e67e22','#3a86ff']

export default function PlayerForm() {
  const { closeModal } = useUIStore()
  const { show }       = useToastStore()
  const [form, setForm] = useState({ name: '', number: '', pos: 'PG', team: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    if (!form.name.trim()) { alert('Renseignez le nom du joueur'); return }
    setLoading(true)
    const count = await db.players.count()
    await db.players.add({
      name:   form.name.trim(),
      number: parseInt(form.number) || 0,
      pos:    form.pos,
      team:   form.team.trim() || 'Mon Équipe',
      color:  COLORS[count % COLORS.length],
    })
    setLoading(false); closeModal(); show('✅ Joueur ajouté !')
  }

  return (
    <>
      <div className="modal-title">👤 Nouveau Joueur</div>
      <div className="form-grid">
        <div className="form-group full"><label>Nom complet</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Prénom Nom" autoFocus /></div>
        <div className="form-group"><label>Numéro</label><input type="number" value={form.number} onChange={e => set('number', e.target.value)} placeholder="23" min="0" max="99" /></div>
        <div className="form-group"><label>Position</label>
          <select value={form.pos} onChange={e => set('pos', e.target.value)}>
            {['PG','SG','SF','PF','C'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group full"><label>Équipe</label><input value={form.team} onChange={e => set('team', e.target.value)} placeholder="Nom de votre équipe" /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Ajout...' : 'Ajouter'}</button>
      </div>
    </>
  )
}
