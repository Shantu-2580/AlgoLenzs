import axios from 'axios'

const resolvedBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim()

const api = axios.create({
  // Use explicit API URL when provided, else rely on Vite proxy/same-origin /api.
  baseURL: resolvedBaseUrl,
  timeout: 12000,
})

export const recognizeCode = async (payload) => {
  const { data } = await api.post('/api/recognize', payload)
  return data
}

export const getStats = async () => {
  const { data } = await api.get('/api/stats')
  return data
}

export const adminLogin = async (password) => {
  const { data } = await api.post('/api/admin/login', { password })
  return data
}

export default api
