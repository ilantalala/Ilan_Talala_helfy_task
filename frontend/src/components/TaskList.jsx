import { useEffect, useState } from 'react'
import { useTasks } from '../context/TasksContext'
import TaskItem from './TaskItem'
import '../styles/TaskList.css'

const VISIBLE_COUNT = 3
const AUTO_ADVANCE_MS = 4000

function TaskList({ tasks, canReorder }) {
  const { reorderTasks } = useTasks()
  const total = tasks.length
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_COUNT)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    setCurrentIndex(VISIBLE_COUNT)
  }, [total])

  function goNext() {
    setTransitionEnabled(true)
    setCurrentIndex((i) => i + 1)
  }

  function goPrev() {
    setTransitionEnabled(true)
    setCurrentIndex((i) => i - 1)
  }

  function handleTransitionEnd() {
    if (currentIndex >= total + VISIBLE_COUNT) {
      setTransitionEnabled(false)
      setCurrentIndex(currentIndex - total)
    } else if (currentIndex < VISIBLE_COUNT) {
      setTransitionEnabled(false)
      setCurrentIndex(currentIndex + total)
    }
  }

  useEffect(() => {
    if (!transitionEnabled) {
      const id = requestAnimationFrame(() => setTransitionEnabled(true))
      return () => cancelAnimationFrame(id)
    }
  }, [transitionEnabled])

  useEffect(() => {
    if (total === 0 || isPaused) return
    const id = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [total, isPaused])

  function handleDragStart(e, task) {
    e.dataTransfer.setData('text/plain', String(task.id))
    setIsPaused(true)
  }

  function handleDragEnd() {
    setIsPaused(false)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e, targetTask) {
    e.preventDefault()
    const draggedId = Number(e.dataTransfer.getData('text/plain'))
    if (draggedId === targetTask.id) return

    const currentIds = tasks.map((t) => t.id)
    const fromIndex = currentIds.indexOf(draggedId)
    const toIndex = currentIds.indexOf(targetTask.id)
    if (fromIndex === -1 || toIndex === -1) return

    const reordered = [...currentIds]
    reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, draggedId)
    reorderTasks(reordered)
  }

  if (total === 0) {
    return <p className="task-list-empty">No tasks to show</p>
  }

  const headClones = tasks.slice(-VISIBLE_COUNT).map((task) => ({ task, key: `head-${task.id}` }))
  const realItems = tasks.map((task) => ({ task, key: `real-${task.id}` }))
  const tailClones = tasks.slice(0, VISIBLE_COUNT).map((task) => ({ task, key: `tail-${task.id}` }))
  const trackItems = [...headClones, ...realItems, ...tailClones]

  const itemWidthPercent = 100 / VISIBLE_COUNT
  const offsetPercent = currentIndex * itemWidthPercent

  return (
    <div
      className="task-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button onClick={goPrev} className="carousel-arrow carousel-arrow-left">‹</button>

      <div className="task-carousel-viewport">
        <div
          className="task-carousel-track"
          style={{
            transform: `translateX(-${offsetPercent}%)`,
            transition: transitionEnabled ? 'transform 0.4s ease' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {trackItems.map(({ task, key }) => {
            const draggable = canReorder && key.startsWith('real-')
            return (
              <div
                key={key}
                className={draggable ? 'task-carousel-slide draggable' : 'task-carousel-slide'}
                style={{ width: `${itemWidthPercent}%` }}
                draggable={draggable}
                onDragStart={draggable ? (e) => handleDragStart(e, task) : undefined}
                onDragEnd={draggable ? handleDragEnd : undefined}
                onDragOver={draggable ? handleDragOver : undefined}
                onDrop={draggable ? (e) => handleDrop(e, task) : undefined}
              >
                <TaskItem task={task} />
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={goNext} className="carousel-arrow carousel-arrow-right">›</button>
    </div>
  )
}

export default TaskList
