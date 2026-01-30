import { useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'

export function ThemeProvider({ children }) {
  const { theme } = useUIStore()

  useEffect(() => {
    // Apply theme to html element whenever it changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [theme])

  return <>{children}</>
}




