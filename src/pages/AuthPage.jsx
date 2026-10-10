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
      nav('/')
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-bold text-indigo-600">Pocket Mentor</h1>
        <p className="text-slate-500 text-sm">
          {isRegister ? 'Create your account' : 'Sign in to continue'}
        </p>

        {isRegister && (
          <input className={input} placeholder="Name" value={form.name} onChange={set('name')} required />
        )}
        <input className={input} type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        <input className={input} type="password" placeholder="Password (min 8 characters)"
               value={form.password} onChange={set('password')} required minLength={isRegister ? 8 : 1} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={busy}
                className="w-full rounded-lg bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-60">
          {busy ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>

        <p className="text-sm text-center text-slate-500">
          {isRegister ? 'Already have an account? ' : 'New here? '}
          <Link className="text-indigo-600 font-medium" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>
      </form>
    </div>
  )
}