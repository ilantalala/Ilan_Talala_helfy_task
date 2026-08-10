import { useState } from 'react'
import { useTasks } from '../context/TasksContext'
import TaskForm from './TaskForm'
import '../styles/TaskItem.css'

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function formatDueDate(dueDate) {
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(task.dueDate) < today
}

function TaskItem({ task }) {
  const { editTask, removeTask, toggleTaskCompletion } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  if (isEditing) {
    return (
      <div className="task-item">
        <TaskForm
          initialValues={task}
          submitLabel="Save"
          onCancel={() => setIsEditing(false)}
          onSubmit={(data) => {
            editTask(task.id, data)
            setIsEditing(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className={`task-item priority-${task.priority}`}>
      <div className="task-item-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
        />
        <h3 className={task.completed ? 'task-title completed' : 'task-title'}>
          {task.title}
        </h3>
        <span className={`priority-badge priority-badge-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      {task.dueDate && (
        <span className={isOverdue(task) ? 'due-date overdue' : 'due-date'}>
          Due {formatDueDate(task.dueDate)}
        </span>
      )}

      <div className="task-item-actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>

        {isConfirmingDelete ? (
          <span className="delete-confirm">
            Are you sure?
            <button onClick={() => removeTask(task.id)}>Yes</button>
            <button onClick={() => setIsConfirmingDelete(false)}>Cancel</button>
          </span>
        ) : (
          <button onClick={() => setIsConfirmingDelete(true)}>Delete</button>
        )}
      </div>
    </div>
  )
}

export default TaskItem
