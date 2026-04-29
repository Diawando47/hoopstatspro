import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '../../store/useStore'

export default function Toast() {
  const { message, visible } = useToastStore()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed', bottom: 24, right: 24,
            background: 'var(--success)', color: '#fff',
            padding: '11px 18px', borderRadius: 8,
            fontSize: 13, fontWeight: 600,
            zIndex: 300,
            boxShadow: '0 4px 20px rgba(0,0,0,.4)',
            pointerEvents: 'none',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
