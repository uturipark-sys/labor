import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [attorney, setAttorney] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(r => { setUser(r.data.user); setAttorney(r.data.attorney) })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', r.data.token)
    setUser(r.data.user)
    return r.data
  }

  const register = async (data) => {
    const r = await api.post('/auth/register', data)
    localStorage.setItem('token', r.data.token)
    setUser(r.data.user)
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setAttorney(null)
  }

  const refreshMe = async () => {
    const r = await api.get('/auth/me')
    setUser(r.data.user)
    setAttorney(r.data.attorney)
  }

  return (
    <AuthContext.Provider value={{ user, attorney, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
