
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GodzillaHead from './GodzillaHead'
import AtomicBeam from './AtomicBeam'
import api from '../api'

export default function TaskItem({ task, onCompleted }) {
  const [isFiring, setIsFiring] = useState(false)
  const [isGone, setIsGone] = useState(false)

  const handleComplete = async () => {
    if (isFiring || isGone) return
    setIsFiring(true)

    setTimeout(() => {
      setIsGone(true)
    }, 250)

    setTimeout(async () => {
      try {
        await api.patch(`tasks/${task.id}/`, { completed: true })
      } catch (e) {
        console.error(e)
      } finally {
        onCompleted(task.id, task.category)
      }
    }, 500)
  }

  return (
    <AnimatePresence>
      {!isGone && (
        <motion.div
          className="task-item"
          initial={{ opacity: 1, scale: 1 }}
          animate={isFiring ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="task-item-inner">
            <input
              type="checkbox"
              onChange={handleComplete}
              className="task-checkbox"
            />
            <span className="task-text">{task.title}</span>
          </div>

          {isFiring && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="godzilla-wrapper"
            >
              <GodzillaHead color="#00E5FF" />
              <AtomicBeam color="#00E5FF" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
