import React, { createContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import api from '@/lib/api'
import { env } from '@/env'
import { useNavigate } from 'react-router-dom'
import { User } from '@/types/global'

interface AuthContextType {
  user: User | null
  permissions: string[]
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<string | undefined>
  logout: () => Promise<void>
  refetchUser: () => Promise<void>
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Function to fetch user data if authenticated
  const fetchUser = async () => {
    // TODO: handle permissions later
    setPermissions([])
    const token = localStorage.getItem('access_token')
    if (!token) {
      setUser(null)
      setLoading(false)
      navigate('/auth')
      return
    }

    try {
      const response = await api.get('/api/v1/auth/me/', { withCredentials: true })
      setUser(response.data)
    } catch (error) {
      console.error(error)
      setUser(null)
      localStorage.removeItem('access_token')
      navigate('/auth')
    } finally {
      setLoading(false)
    }
  }

  // Check if user is authenticated on initial render
  useEffect(() => {
    fetchUser()
  }, [])

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${env.API_URL}/api/v1/auth/login/`, { username, password }, { withCredentials: true })
      // Assuming response includes user data and backend sets HTTP-only cookies
      if (response.status == 200) {
        localStorage.setItem('access_token', response.data.access)
        setUser(response.data.user) // Store user data in state
        navigate('/', { replace: true })
      }
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.'
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.detail || 'An error occurred during the login process.'
        return errorMessage
      } else {
        console.error(error)
      }
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    try {
      await axios.post(`${env.API_URL}/api/v1/auth/logout/`, {}, { withCredentials: true })
      localStorage.removeItem('access_token')
      navigate('/auth')
      setUser(null) // Clear user data
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isAuthenticated: !!user,
        login,
        logout,
        refetchUser: fetchUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
