import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12 text-center sm:px-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/25 ring-1 ring-inset ring-white/5 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-300">The route you opened does not exist. Go back to the dashboard or sign in again.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">
            Dashboard
          </Link>
          <Link to="/login" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}