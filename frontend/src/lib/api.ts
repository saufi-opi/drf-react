import { env } from '@/env'
import axios from 'axios'

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await axios.post(`${env.API_URL}/api/v1/auth/refresh/`, {}, { withCredentials: true })
        const { access } = response.data
        localStorage.setItem('access_token', access)
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        localStorage.removeItem('access_token')
        if (axios.isAxiosError(refreshError) && refreshError.status === 401) alert('Session Expired!')
        window.location.href = '/auth'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
