import { useState } from 'react'

const AUTH_KEY = 'algolens-admin-auth'
const ADMIN_PASSWORD = 'admin123'

export default function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(AUTH_KEY) === 'true'
  })
  const [error, setError] = useState('')

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      window.localStorage.setItem(AUTH_KEY, 'true')
      setAuthenticated(true)
      setError('')
      return true
    }
    setError('Incorrect password')
    return false
  }

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY)
    setAuthenticated(false)
  }

  return {
    authenticated,
    error,
    login,
    logout,
    clearError: () => setError(''),
  }
}
