import { useState } from 'react'
import '../styles/TaskForm.css'

const PRIORITIES = ['low', 'medium', 'high']

function toDateInputValue(dueDate) {
  return dueDate ? dueDate.slice(0, 10) : ''
}

function TaskForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [priority, setPriority] = useState(initialValues?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(toDateInputValue(initialValues?.dueDate))
  const [validationError, setValidationError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (title.trim() === '') {
      setValidationError('Title is required')
      return
    }
    setValidationError('')
    onSubmit({ title: title.trim(), description, priority, dueDate: dueDate || null })
    setTitle(initialValues?.title ?? '')
    setDescription(initialValues?.description ?? '')
    setPriority(initialValues?.priority ?? 'medium')
    setDueDate(toDateInputValue(initialValues?.dueDate))
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        type="date"
        className="due-date-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      {validationError && <p className="form-error">{validationError}</p>}
      <div className="form-actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default TaskForm
