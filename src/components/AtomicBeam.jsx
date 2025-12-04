import { motion } from "framer-motion";

export default function AtomicBeam({ color = "#00E5FF" }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
      }}
      style={{
        height: "8px",
        width: "220px",
        background: color,
        transformOrigin: "left center",
        borderRadius: "8px",
        boxShadow: `0 0 25px ${color}, 0 0 40px ${color}`,
      }}
    />
  );
}
