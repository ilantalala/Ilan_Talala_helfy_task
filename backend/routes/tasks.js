import express from 'express'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
} from '../controllers/taskController.js'

const router = express.Router()

router.get('/', getAllTasks)
router.post('/', createTask)
router.put('/reorder', reorderTasks)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.patch('/:id/toggle', toggleTask)

export default router
