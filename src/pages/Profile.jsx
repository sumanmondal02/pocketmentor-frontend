import { useEffect, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import api, { errMsg } from '../api'
import { useAuth } from '../AuthContext'
import Loader from '../components/Loader'

export default function Profile() {
  const { logout, updateUser } = useAuth()
  const [p, setP] = useState(null)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/profile').then((r) => { setP(r.data); setName(r.data.name) }).catch((e) => setError(errMsg(e)))
  }, [])

  const save = async (e) => {
    e.preventDefault(); setMsg(''); setError('')
    try {
      const { data } = await api.put('/api/profile', { name })
      setP(data); updateUser({ name: data.name, email: data.email }); setMsg('Saved')
    } catch (err) { setError(errMsg(err)) }
  }

  if (!p) return error ? <p className="text-coral font-semibold">{error}</p> : <Loader />
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="card p-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-butter border-2 border-ink flex items-center justify-center font-display text-2xl font-bold">
          {p.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold truncate">{p.name}</p>
          <p className="text-muted truncate">{p.email}</p>
          <p className="text-xs text-muted">Member since {new Date(p.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sky rounded-2xl border-2 border-ink p-4 text-center"><p className="text-3xl font-display font-bold">{p.notes}</p><p className="text-sm">Notes</p></div>
        <div className="bg-mint rounded-2xl border-2 border-ink p-4 text-center"><p className="text-3xl font-display font-bold">{p.attempts}</p><p className="text-sm">Quizzes taken</p></div>
      </div>
      <form onSubmit={save} className="card p-6 space-y-3">
        <h2 className="font-semibold text-lg">Edit profile</h2>
        <label className="text-sm font-semibold" htmlFor="nm">Name</label>
        <input id="nm" className="field" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} required />
        {msg && <p className="text-sm text-green-700 font-semibold">{msg}</p>}
        {error && <p className="text-sm text-coral font-semibold">{error}</p>}
        <button className="btn btn-yellow">Save</button>
      </form>
      <button onClick={logout} className="btn btn-ghost"><FiLogOut /> Logout</button>
    </div>
  )
}