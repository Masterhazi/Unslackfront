import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import api from './api'
import TaskColumn from './components/TaskColumn'

// Register doughnut chart components
ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = {
  do: 'rgba(255, 71, 71, 0.9)',
  schedule: 'rgba(0, 210, 106, 0.9)',
  delegate: 'rgba(255, 191, 0, 0.9)',
  eliminate: 'rgba(74, 140, 255, 0.9)',
}

function groupTasks(tasks) {
  const grouped = { do: [], schedule: [], delegate: [], eliminate: [] }
  tasks.forEach((t) => {
    if (!t.completed && grouped[t.category]) grouped[t.category].push(t)
  })
  return grouped
}

function App() {
  const [tasksByCategory, setTasksByCategory] = useState({
    do: [],
    schedule: [],
    delegate: [],
    eliminate: [],
  })
  const [analytics, setAnalytics] = useState({
    do: 0,
    schedule: 0,
    delegate: 0,
    eliminate: 0,
  })

  const loadTasks = async () => {
    try {
      const res = await api.get('tasks/')
      const grouped = groupTasks(res.data)
      setTasksByCategory(grouped)
    } catch (e) {
      console.error(e)
    }
  }

const [fadeInChart, setFadeInChart] = useState(false);




const loadAnalytics = async () => {
  try {
    const res = await api.get('analytics/');
    const data = res.data;

    const totalNow = data.do + data.schedule + data.delegate + data.eliminate;

    // detect transition from 0 → 1
    setJustStarted((prev) => (prev === false && totalNow === 1 ? true : prev));
    if (totalNow === 1 && analytics.do + analytics.schedule + analytics.delegate + analytics.eliminate === 0) {
    // fade chart in softly
    setFadeInChart(true);
  }
    setAnalytics(data);
  } catch (e) {
    console.error(e);
  }
}


  useEffect(() => {
    loadTasks()
    loadAnalytics()
  }, [])

  const handleAddTask = async (category, title) => {
    try {
      const res = await api.post('tasks/', { title, category })
      const newTask = res.data
      setTasksByCategory((prev) => ({
        ...prev,
        [category]: [newTask, ...prev[category]],
      }))
      loadAnalytics()
    } catch (e) {
      console.error(e)
    }
  }

  const handleTaskCompleted = async (id, category) => {
    try {
      await api.delete(`tasks/${id}/`)

      setTasksByCategory((prev) => ({
        ...prev,
        [category]: prev[category].filter((t) => t.id !== id),
      }))

      loadAnalytics()
    } catch (e) {
      console.error(e)
    }
  }

  const totalTasks =
    analytics.do + analytics.schedule + analytics.delegate + analytics.eliminate

  // 🍩 DOUGHNUT CHART DATA
  const chartData = {
    labels: ['Do', 'Schedule', 'Delegate', 'Eliminate'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          analytics.do,
          analytics.schedule,
          analytics.delegate,
          analytics.eliminate,
        ],
        backgroundColor: [
          COLORS.do,
          COLORS.schedule,
          COLORS.delegate,
          COLORS.eliminate,
        ],
        borderColor: '#ffffff22',
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  }


  const [justStarted, setJustStarted] = useState(false);

  // 🍩 DOUGHNUT CHART OPTIONS
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: { size: 14 },
        },
      },
    },
    cutout: '55%', // doughnut thickness
  }

  return (
    <div className="app-root">
      <div className="bg-wrapper">
        <span className="bg-word w1">Eisenhower</span>
        <span className="bg-word w2">declutter</span>
        <span className="bg-word w3">priority</span>
        <span className="bg-word w4">time</span>
        <span className="bg-word w5">focus</span>
      </div>

      <div className="page-container">
        <header>
          <h1>Task Analytics</h1>
        </header>

        <section className="analytics-card">
          {totalTasks === 0 ? (
            // --------------------- EMPTY STATE ------------------------
            <div className="ghost-donut-wrapper">
              <div className="ghost-donut"></div>
              <p className="ghost-msg">Add your first task</p>
            </div>
          ) : (
            <>
              {/* ------------------ DOUGHNUT WITH SPIN ------------------ */}
              <div className={`doughnut-spin-wrapper ${justStarted ? "spin-once" : ""}`}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>

              <div className="analytics-summary">
                <p>Total Tasks: <span>{totalTasks}</span></p>
              </div>
            </>
          )}
        </section>
        


        <section className="grid-2x2">
          <TaskColumn
            label="DO"
            subtitle="(urgent & important)"
            color={COLORS.do}
            categoryKey="do"
            tasks={tasksByCategory.do}
            onAddTask={handleAddTask}
            onTaskCompleted={handleTaskCompleted}
          />
          <TaskColumn
            label="SCHEDULE"
            subtitle="(plan about it)"
            color={COLORS.schedule}
            categoryKey="schedule"
            tasks={tasksByCategory.schedule}
            onAddTask={handleAddTask}
            onTaskCompleted={handleTaskCompleted}
          />
          <TaskColumn
            label="DELEGATE"
            subtitle="(think about it)"
            color={COLORS.delegate}
            categoryKey="delegate"
            tasks={tasksByCategory.delegate}
            onAddTask={handleAddTask}
            onTaskCompleted={handleTaskCompleted}
          />
          <TaskColumn
            label="ELIMINATE"
            subtitle="(get rid of it)"
            color={COLORS.eliminate}
            categoryKey="eliminate"
            tasks={tasksByCategory.eliminate}
            onAddTask={handleAddTask}
            onTaskCompleted={handleTaskCompleted}
          />
        </section>
      </div>
    </div>
  )
}

export default App
