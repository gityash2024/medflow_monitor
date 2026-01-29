import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize theme on app load
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem('theme')
    const theme = stored || 'dark'
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  } catch (e) {
    // Default to dark
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  }
}

// Initialize theme before rendering
initializeTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
