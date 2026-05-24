import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../context/SessionContext'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated } = useSession()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}