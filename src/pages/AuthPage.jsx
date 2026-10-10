import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { errMsg } from '../api'

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { login, register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isRegister) await register(form)
      else await login({ email: form.email, password: form.password })
      nav('/home')
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  // const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  const [show, setShow] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 gap-6 items-center max-w-3xl w-full">
        <div className="hidden md:block text-center">
          <img src="/mascot.png" alt="" className="mx-auto max-w-xs" />
          <p className="font-display text-2xl mt-2">Small steps, big progress</p>
        </div>
        <form onSubmit={submit} className="card p-8 space-y-4">
          <h1 className="text-3xl font-bold">{isRegister ? 'Create Account' : 'Welcome Back!'}</h1>
          {isRegister && <input className="field" placeholder="Full name" value={form.name} onChange={set('name')} required />}
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
          <div className="relative">
            <input className="field pr-12" type={show ? 'text' : 'password'} placeholder="Password (min 8 characters)"
                   value={form.password} onChange={set('password')} required minLength={isRegister ? 8 : 1} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-sm text-muted">{show ? 'Hide' : 'Show'}</button>
          </div>
          {error && <p className="text-sm text-coral font-semibold">{error}</p>}
          <button disabled={busy} className={`btn w-full ${isRegister ? 'btn-coral' : 'btn-yellow'}`}>
            {busy ? 'Please wait...' : isRegister ? 'SIGN UP' : 'LOGIN'}
          </button>
          {busy && <p className="text-xs text-muted text-center">First request may take up to a minute while the server wakes up.</p>}
          <p className="text-sm text-center text-muted">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <Link className="font-bold text-ink underline" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Sign up'}</Link>
          </p>
        </form>
      </div>
    </div>
  )}