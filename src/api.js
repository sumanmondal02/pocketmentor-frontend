import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const isAuthCall = err.config?.url?.includes('/api/auth/')
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const errMsg = (e) =>
  e.response?.data?.error || (e.response ? 'Request failed' : 'Cannot reach the server')

export default api