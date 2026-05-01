import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '../../store/useStore'

export default function Toast() {
  const { message, visible } = useToastStore()

  return (
    <div className="toast-wrap">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: .95 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{    opacity: 0, y: 12, scale: .95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              background: 'var(--success)',
              color: '#fff',
              padding: '11px 20px',
              borderRadius: 10,
              fontSize: 13, fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,.4)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
