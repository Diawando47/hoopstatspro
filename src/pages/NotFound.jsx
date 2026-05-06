import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="content" style={{ textAlign: 'center', paddingTop: 80 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏀</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32, fontWeight: 900,
          color: 'var(--text)', marginBottom: 8,
        }}>
          Page introuvable
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
          Cette page n'existe pas ou a été déplacée.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          ← Retour au Dashboard
        </button>
      </motion.div>
    </div>
  )
}
