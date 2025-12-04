import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GodzillaHead from "./GodzillaHead";
import AtomicBeam from "./AtomicBeam";
import api from "../api";

// timings in milliseconds – tweak these to change the vibe
const RISE_DURATION = 600;              // how long the rise motion feels
const GODZILLA_TO_BEAM_DELAY = 400;     // wait after rise/aim before beam shows
const BEAM_TO_VAPORIZE_DELAY = 500;     // how long beam is visible before kill
const VAPORIZE_ANIM_DURATION = 500;     // fade/shrink animation length

// phases: 'idle' -> 'rising' -> 'aiming' -> 'beam' -> 'vaporize' -> 'done'
export default function TaskItem({ task, onCompleted }) {
  const [phase, setPhase] = useState("idle");
  const [locked, setLocked] = useState(false); // prevent double click

  const handleComplete = () => {
    if (locked || phase !== "idle") return;
    setLocked(true);

    // 1) Godzilla starts rising behind the box
    setPhase("rising");

    // 2) Once rise is “mostly done”, tilt to aim down at the text
    setTimeout(() => {
      setPhase("aiming");
    }, RISE_DURATION);

    // 3) Small dramatic pause, then show beam
    setTimeout(() => {
      setPhase("beam");
    }, RISE_DURATION + GODZILLA_TO_BEAM_DELAY);

    // 4) After beam has been on a bit, start vaporizing the task
    setTimeout(() => {
      setPhase("vaporize");
    }, RISE_DURATION + GODZILLA_TO_BEAM_DELAY + BEAM_TO_VAPORIZE_DELAY);

    // 5) After vaporization animation, update backend & notify parent
    setTimeout(async () => {
      try {
        await api.patch(`tasks/${task.id}/`, { completed: true });
      } catch (e) {
        console.error(e);
      } finally {
        setPhase("done");
        onCompleted(task.id, task.category);
      }
    }, RISE_DURATION + GODZILLA_TO_BEAM_DELAY + BEAM_TO_VAPORIZE_DELAY + VAPORIZE_ANIM_DURATION);
  };

  const isVaporizing = phase === "vaporize";
  const showGodzilla = phase !== "idle" && phase !== "done";
  const showBeam = phase === "beam" || phase === "vaporize";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="task-item"
          initial={{ opacity: 1, scale: 1 }}
          animate={
            isVaporizing
              ? { opacity: 0, scale: 0.5 }
              : { opacity: 1, scale: 1 }
          }
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: VAPORIZE_ANIM_DURATION / 1000 }}
        >
          <div className="task-item-inner">
            <input
              type="checkbox"
              onChange={handleComplete}
              className="task-checkbox"
              disabled={phase !== "idle"}
            />
            <span className="task-text">{task.title}</span>
          </div>

          {showGodzilla && (
            <motion.div
              className="godzilla-wrapper"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={
                phase === "rising"
                  ? { opacity: 1, y: -20, scale: 1.2, rotate: 0 }
                  : phase === "aiming"
                  ? { opacity: 1, y: -20, scale: 1.2, rotate: -12 }
                  : { opacity: 1, y: -20, scale: 1.2, rotate: -8 } // beam + vaporize
              }
              transition={{ duration: RISE_DURATION / 1000, ease: "easeOut" }}
            >
              {/* flip={false} if your original SVG faces left */}
              <GodzillaHead glowColor="#00E5FF" size={110} flip={false} />
              {showBeam && <AtomicBeam color="#00E5FF" />}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
