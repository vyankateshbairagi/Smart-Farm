import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../services/api'
import { useSession } from '../context/SessionContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useSession()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!emailRegex.test(form.email.trim())) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password'
    else if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    return next
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setApiError('')

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      setLoading(true)
      const response = await auth.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      login(response?.data || {})
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/15 via-slate-900 to-amber-500/10 p-8 shadow-2xl shadow-black/25 ring-1 ring-inset ring-white/5">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Get started</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Create a workspace for your farm operations.</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Register once, then use the dashboard to manage land details, crop records, and irrigation guidance.</p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 ring-1 ring-inset ring-white/5 sm:p-8">
        <h2 className="text-2xl font-bold text-white">Register</h2>
        <p className="mt-2 text-sm text-slate-400">Create your account in a few steps.</p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">Name</label>
            <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
            {errors.name ? <small className="mt-2 block text-sm text-rose-400">{errors.name}</small> : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
            {errors.email ? <small className="mt-2 block text-sm text-rose-400">{errors.email}</small> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
            {errors.password ? <small className="mt-2 block text-sm text-rose-400">{errors.password}</small> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
            <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Re-enter password"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
            {errors.confirmPassword ? <small className="mt-2 block text-sm text-rose-400">{errors.confirmPassword}</small> : null}
          </div>

          {apiError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{apiError}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
