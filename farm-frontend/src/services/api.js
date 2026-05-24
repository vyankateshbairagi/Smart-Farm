import axios from 'axios'
import { clearStoredSession } from './session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach JWT token from localStorage (key: 'token') to Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (err) {
      // localStorage may not be available in some environments
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredSession()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:cleared'))
      }
    }

    return Promise.reject(error)
  }
)

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const farms = {
  create: (data) => api.post('/farms', data),
  list: () => api.get('/farms'),
  get: (id) => api.get(`/farms/${id}`),
  update: (id, data) => api.put(`/farms/${id}`, data),
  remove: (id) => api.delete(`/farms/${id}`),
}

export const crops = {
  create: (data) => api.post('/crops', data),
  listByFarm: (farmId) => api.get(`/crops/${farmId}`),
  update: (id, data) => api.put(`/crops/${id}`, data),
  remove: (id) => api.delete(`/crops/${id}`),
}

export const irrigation = {
  recommend: (data) => api.post('/irrigation/recommend', data),
}

export default api
