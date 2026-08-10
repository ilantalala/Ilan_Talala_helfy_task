export const tasksMap = new Map([
  [
    1,
    {
      id: 1,
      title: 'Set up project structure',
      description: 'Create backend and frontend folders, install dependencies',
      completed: true,
      createdAt: new Date('2026-08-01T09:00:00'),
      priority: 'high',
      dueDate: null,
    },
  ],
  [
    2,
    {
      id: 2,
      title: 'Design the carousel animation',
      description: 'Figure out how the sliding transform and clone padding will work',
      completed: false,
      createdAt: new Date('2026-08-05T14:30:00'),
      priority: 'medium',
      dueDate: new Date('2026-08-15'),
    },
  ],
  [
    3,
    {
      id: 3,
      title: 'Write documentation',
      description: 'Document API endpoints in the README',
      completed: false,
      createdAt: new Date('2026-08-08T11:15:00'),
      priority: 'low',
      dueDate: new Date('2026-08-12'),
    },
  ],
])

export function getNextId() {
  return tasksMap.size === 0 ? 1 : Math.max(...tasksMap.keys()) + 1
}
