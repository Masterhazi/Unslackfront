
import { useState } from 'react'
import TaskItem from './TaskItem'

export default function TaskColumn({
  label,
  subtitle,
  color,
  categoryKey,
  tasks,
  onAddTask,
  onTaskCompleted,
}) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    onAddTask(categoryKey, title)
    setInput('')
  }

  return (
    <div className="task-card" style={{ boxShadow: `0 0 14px ${color}`, borderColor: color }}>
      <h2 className="task-title">
        {label}
        {subtitle && <span className="task-subtitle"> {subtitle}</span>}
      </h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task"
        />
        <button type="submit">Add</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 && <div className="empty-msg">No tasks yet.</div>}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onCompleted={onTaskCompleted} />
        ))}
      </div>
    </div>
  )
}
