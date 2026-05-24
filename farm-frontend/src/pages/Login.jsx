import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../services/api'
import { useSession } from '../context/SessionContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useSession()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!emailRegex.test(form.email.trim())) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    return next
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    try {
      setLoading(true)
      const response = await auth.login({ email: form.email.trim(), password: form.password })
      login(response?.data || {})
      const target = location.state?.from || '/dashboard'
      navigate(target, { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left - promotional */}
        <div className="hidden lg:block">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50/30 p-2 grid place-items-center text-emerald-600 shadow-sm">🌿</div>
            <div>
              <h1 className="text-2xl font-extrabold text-emerald-200">Smart Farm</h1>
              <p className="text-sm text-slate-400">Farm Management Dashboard</p>
            </div>
          </div>

          <h2 className="mt-8 text-4xl font-black leading-tight text-white">Manage your farms, crops, and irrigation <span className="text-emerald-400">in one place.</span></h2>
          <p className="mt-6 text-slate-300 max-w-xl">Use the same account to track field data, add crops, and review your dashboard analytics.</p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-600/10 p-3 text-emerald-400">📊</div>
              <div>
                <p className="font-semibold text-white">Track Field Data</p>
                <p className="text-sm text-slate-400">Monitor soil, weather, and crop data in real-time.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-600/10 p-3 text-emerald-400">🌱</div>
              <div>
                <p className="font-semibold text-white">Manage Crops</p>
                <p className="text-sm text-slate-400">Add, update, and manage your crops effortlessly.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-600/10 p-3 text-emerald-400">💧</div>
              <div>
                <p className="font-semibold text-white">Irrigation Control</p>
                <p className="text-sm text-slate-400">Optimize irrigation schedules and save water.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right - card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-emerald-50 grid place-items-center text-emerald-600 mb-4">🌿</div>
              <h3 className="text-xl font-extrabold text-white">Welcome back</h3>
              <p className="text-sm text-slate-400">Sign in to your Smart Farm account</p>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
                {errors.email ? <small className="mt-2 block text-sm text-rose-400">{errors.email}</small> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
                {errors.password ? <small className="mt-2 block text-sm text-rose-400">{errors.password}</small> : null}
              </div>

              {apiError ? <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{apiError}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-emerald-400" />
                  Remember me
                </label>
                <Link to="#" className="text-emerald-300 hover:text-emerald-200">Forgot password?</Link>
              </div>

              <div className="pt-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-900/70 px-3 text-slate-400">or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" className="rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Google</button>
                  <button type="button" className="rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Microsoft</button>
                </div>
              </div>

              <p className="text-center text-sm text-slate-400 mt-3">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-emerald-300 hover:text-emerald-200">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
