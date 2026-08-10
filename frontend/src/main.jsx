import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { TasksProvider } from './context/TasksContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </ThemeProvider>
  </StrictMode>,
)
