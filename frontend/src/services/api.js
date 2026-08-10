const API_BASE = 'http://localhost:4000/api/tasks'

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || `Request failed with status ${response.status}`)
  }
  if (response.status === 204) {
    return null
  }
  return response.json()
}

export async function fetchTasks() {
  const response = await fetch(API_BASE)
  return handleResponse(response)
}

export async function createTask(task) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  return handleResponse(response)
}

export async function updateTask(id, updates) {
  const response = await fetch(`${API_BASE}/${id}`, 
    {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  return handleResponse(response)
}

export async function deleteTask(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

export async function toggleTask(id) {
  const response = await fetch(`${API_BASE}/${id}/toggle`,
    {
    method: 'PATCH',
  })
  return handleResponse(response)
}

export async function reorderTasks(orderedIds) {
  const response = await fetch(`${API_BASE}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  })
  return handleResponse(response)
}
