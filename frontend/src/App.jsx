import { useState } from 'react'
import { useTasks } from './context/TasksContext'
import { useTheme } from './context/ThemeContext'
import './styles/App.css'
import TaskForm from './components/TaskForm'
import TaskFilter from './components/TaskFilter'
import TaskList from './components/TaskList'

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

function App() {
  const { tasks, loading, error, addTask } = useTasks()
  const { theme, toggleTheme } = useTheme()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('default')

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'completed' && !task.completed) return false
    if (activeFilter === 'pending' && task.completed) return false
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(query)
      const matchesDescription = task.description.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDescription) return false
    }
    return true
  })

  const canReorder = activeFilter === 'all' && searchQuery.trim() === '' && sortOption === 'default'

  if (sortOption === 'newest') {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortOption === 'oldest') {
    filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortOption === 'priority') {
    filteredTasks.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
  } else if (sortOption === 'title') {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title))
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Task Manager</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <TaskForm submitLabel="Add Task" onSubmit={addTask} />

      {error && <p className="app-error">{error}</p>}

      <div className="controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Default order</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">Priority (high to low)</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      <TaskFilter activeFilter={activeFilter} onChange={setActiveFilter} />

      {loading ? (
        <p className="app-loading">Loading tasks...</p>
      ) : (
        <TaskList tasks={filteredTasks} canReorder={canReorder} />
      )}
    </div>
  )
}

export default App
