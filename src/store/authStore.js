import { create } from 'zustand'

const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load auth from storage', e)
  }
  return { user: null, isAuthenticated: false }
}

const saveAuthToStorage = (state) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save auth to storage', e)
  }
}

const initialState = loadAuthFromStorage()

export const useAuthStore = create((set) => ({
  user: initialState.user,
  isAuthenticated: initialState.isAuthenticated,
  login: (user) => {
    const newState = { user, isAuthenticated: true }
    saveAuthToStorage(newState)
    set(newState)
  },
  logout: () => {
    const newState = { user: null, isAuthenticated: false }
    saveAuthToStorage(newState)
    set(newState)
  },
}))

