import { createContext, useContext, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const authenticate = async (path, payload) => {
    const { data } = await api.post(`/api/auth/${path}`, payload)
    localStorage.setItem('token', data.token)
    const u = { name: data.name, email: data.email }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }
  const updateUser = (u) => { 
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u) 
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login: (p) => authenticate('login', p),
      register: (p) => authenticate('register', p),
      updateUser,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}