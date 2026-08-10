import { createContext, useContext, useEffect, useState } from 'react'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks as reorderTasksRequest,
} from '../services/api'

const TasksContext = createContext(null)
const TASKS_STORAGE_KEY = 'tasks-cache'

function getCachedTasks() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(getCachedTasks)
  const [loading, setLoading] = useState(() => getCachedTasks().length === 0)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  async function addTask(taskData) {
    setError(null)
    try {
      const newTask = await createTask(taskData)
      setTasks((prev) => [...prev, newTask])
    } catch (err) {
      setError(err.message)
    }
  }

  async function editTask(id, updates) {
    setError(null)
    try {
      const updated = await updateTask(id, updates)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeTask(id) {
    setError(null)
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleTaskCompletion(id) {
    setError(null)
    try {
      const updated = await toggleTask(id)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function reorderTasks(orderedIds) {
    setError(null)
    try {
      const updated = await reorderTasksRequest(orderedIds)
      setTasks(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  const value = {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    toggleTaskCompletion,
    reorderTasks,
  }

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}
