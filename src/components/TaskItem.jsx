import { useState } from "react";

export default function TaskItem({ task, onCompleted }) {
  const [firing, setFiring] = useState(false);
  const [textGone, setTextGone] = useState(false);

  const handleCheck = () => {
    if (firing) return;

    setFiring(true);

    // text vaporize after laser reaches it
    setTimeout(() => setTextGone(true), 400);

    // delete task after animation completes
    setTimeout(() => {
      onCompleted(task.id, task.category);
    }, 2000);
  };

  return (
    <div className="task-item">
      <div className="task-item-inner">
        {/* CHECKBOX + TURRET */}
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            className="task-checkbox"
            onChange={handleCheck}
          />

          {/* TURRET – ONLY visible when firing */}
          {firing && (
            <div className={`turret ${task.category}`}>
              <div className="turret-rod" />
              <div className="turret-head" />
            </div>
          )}

          {/* LASER – CATEGORY COLORED */}
          {firing && (
            <div className={`laser-beam ${task.category}`} />
          )}
        </div>

        {/* TASK TEXT */}
        <span className={`task-text ${textGone ? "text-vaporize" : ""}`}>
          {task.title}
        </span>
      </div>
    </div>
  );
}
