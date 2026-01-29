import { create } from 'zustand'

const loadThemeFromStorage = () => {
  try {
    const stored = localStorage.getItem('theme')
    return stored || 'dark'
  } catch (e) {
    return 'dark'
  }
}

const saveThemeToStorage = (theme) => {
  try {
    localStorage.setItem('theme', theme)
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
    }
  } catch (e) {
    console.error('Failed to save theme', e)
  }
}

// Check if viewport is mobile (< 768px)
const checkIsMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768
  }
  return false
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const theme = loadThemeFromStorage()
  saveThemeToStorage(theme)
}

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  sidebarPinned: false, // Track if user manually pinned the sidebar
  theme: loadThemeFromStorage(),
  isMobile: checkIsMobile(),
  mobileMenuOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarPinned: (pinned) => set({ sidebarPinned: pinned }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  setIsMobile: (isMobile) => set({ isMobile }),
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      saveThemeToStorage(newTheme)
      return { theme: newTheme }
    })
  },
  setTheme: (theme) => {
    saveThemeToStorage(theme)
    set({ theme })
  },
}))

