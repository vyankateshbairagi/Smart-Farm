import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'

const linkClass =
  'rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white'

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useSession()

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-400/20">
            🌾
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Smart Farm</span>
            <span className="block text-xs text-slate-400">Farm management dashboard</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={linkClass}>
                Dashboard
              </Link>
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:inline-flex">
                {user?.name || 'Signed in'}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
