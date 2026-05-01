import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '../../store/useStore'

export default function Modal({ children }) {
  const { modal, closeModal } = useUIStore()

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <motion.div
            className="modal"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            {/* Handle bar (mobile) */}
            <div className="modal-handle" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
