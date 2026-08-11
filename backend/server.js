import express from 'express'
import cors from 'cors'
import tasksRouter from './routes/tasks.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

try {
  process.loadEnvFile('.env')
} catch {
  // no .env file present - fall back to defaults below
}

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/tasks', tasksRouter)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
