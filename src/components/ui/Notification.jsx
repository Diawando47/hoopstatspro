import { useUIStore } from '../../store/useUIStore'
import { AnimatePresence, motion } from 'framer-motion'

export default function Notification() {
  const { notification } = useUIStore()

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key="notif"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: notification.type === 'error' ? 'var(--danger)' : 'var(--success)',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 300,
            pointerEvents: 'none',
            boxShadow: '0 4px 24px rgba(0,0,0,.4)',
          }}
        >
          {notification.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
