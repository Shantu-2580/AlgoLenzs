import { useState } from 'react'
import { adminLogin } from '../utils/api'

const AUTH_KEY = 'algolens-admin-auth'

export default function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(AUTH_KEY) === 'true'
  })
  const [error, setError] = useState('')

  const login = async (password) => {
    try {
      await adminLogin(password)
      window.localStorage.setItem(AUTH_KEY, 'true')
      setAuthenticated(true)
      setError('')
      return true
    } catch (err) {
      const message = err?.response?.data?.error || 'Incorrect password'
      setError(message)
      return false
    }
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
