import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import { useSession } from './context/SessionContext'

export default function App() {
  const { isAuthenticated } = useSession()

  return (
    <div className="min-h-screen text-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
