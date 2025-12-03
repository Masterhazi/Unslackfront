
import { motion } from 'framer-motion'

export default function AtomicBeam({ color = '#00E5FF' }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        height: '6px',
        width: '180px',
        background: color,
        transformOrigin: 'left center',
        borderRadius: '6px',
        boxShadow: `0 0 18px ${color}, 0 0 28px ${color}`,
      }}
    />
  )
}
