import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export default api
