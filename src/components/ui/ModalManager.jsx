import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '../../store/useUIStore'
import MatchForm  from '../match/MatchForm'
import PlayerForm from '../player/PlayerForm'
import StatForm   from '../stats/StatForm'

export default function ModalManager() {
  const { modal, closeModal } = useUIStore()

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.75)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: .95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              width: '100%',
              maxWidth: 520,
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: 24,
            }}
          >
            {modal.type === 'match'  && <MatchForm  data={modal.data} />}
            {modal.type === 'player' && <PlayerForm data={modal.data} />}
            {modal.type === 'stat'   && <StatForm   data={modal.data} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
