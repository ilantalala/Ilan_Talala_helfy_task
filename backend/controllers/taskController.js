import { tasksMap, getNextId } from '../data/tasks.js'

const VALID_PRIORITIES = ['low', 'medium', 'high']

function isValidDueDate(dueDate) {
  return dueDate === undefined || dueDate === null || dueDate === '' || !isNaN(new Date(dueDate).getTime())
}

export function getAllTasks(req, res) {
  res.status(200).json(Array.from(tasksMap.values()))
}

export function createTask(req, res) {
  const { title, description, priority, dueDate } = req.body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' })
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }
  if (!isValidDueDate(dueDate)) {
    return res.status(400).json({ error: 'dueDate must be a valid date' })
  }

  const newTask = {
    id: getNextId(),
    title: title.trim(),
    description: typeof description === 'string' ? description : '',
    completed: false,
    createdAt: new Date(),
    priority: priority || 'medium',
    dueDate: dueDate ? new Date(dueDate) : null,
  }

  tasksMap.set(newTask.id, newTask)
  res.status(201).json(newTask)
}

export function updateTask(req, res) {
  const id = Number(req.params.id)
  const task = tasksMap.get(id)

  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  const { title, description, priority, completed, dueDate } = req.body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' })
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }
  if (!isValidDueDate(dueDate)) {
    return res.status(400).json({ error: 'dueDate must be a valid date' })
  }

  task.title = title.trim()
  if (description !== undefined) task.description = description
  if (priority !== undefined) task.priority = priority
  if (completed !== undefined) task.completed = Boolean(completed)
  if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null

  res.status(200).json(task)
}

export function reorderTasks(req, res) {
  const { orderedIds } = req.body

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array of task ids' })
  }

  const currentIds = Array.from(tasksMap.keys())
  const isSameSet =
    orderedIds.length === currentIds.length && currentIds.every((id) => orderedIds.includes(id))

  if (!isSameSet) {
    return res.status(400).json({ error: 'orderedIds must contain exactly the current task ids' })
  }

  const reordered = orderedIds.map((id) => [id, tasksMap.get(id)])
  tasksMap.clear()
  for (const [id, task] of reordered) {
    tasksMap.set(id, task)
  }

  res.status(200).json(Array.from(tasksMap.values()))
}

export function deleteTask(req, res) {
  const id = Number(req.params.id)

  if (!tasksMap.has(id)) {
    return res.status(404).json({ error: 'Task not found' })
  }

  tasksMap.delete(id)
  res.status(204).send()
}

export function toggleTask(req, res) {
  const id = Number(req.params.id)
  const task = tasksMap.get(id)

  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  task.completed = !task.completed
  res.status(200).json(task)
}
