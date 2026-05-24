import React, { createContext, useContext, useEffect, useState } from 'react'
import { clearStoredSession, getStoredSession, setStoredSession } from '../services/session'

const SessionContext = createContext(null)

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession())

  useEffect(() => {
    const syncSession = () => {
      setSession(getStoredSession())
    }

    window.addEventListener('storage', syncSession)
    window.addEventListener('auth:updated', syncSession)
    window.addEventListener('auth:cleared', syncSession)

    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('auth:updated', syncSession)
      window.removeEventListener('auth:cleared', syncSession)
    }
  }, [])

  const login = ({ token, user }) => {
    setStoredSession({ token, user })
    setSession({ token, user })
    window.dispatchEvent(new Event('auth:updated'))
  }

  const logout = () => {
    clearStoredSession()
    setSession({ token: null, user: null })
    window.dispatchEvent(new Event('auth:cleared'))
  }

  const value = {
    token: session.token,
    user: session.user,
    isAuthenticated: Boolean(session.token),
    login,
    logout,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used inside a SessionProvider')
  }

  return context
}