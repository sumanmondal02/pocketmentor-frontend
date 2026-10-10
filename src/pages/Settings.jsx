import { useState } from 'react'
import api, { errMsg } from '../api'

export default function Settings() {
  const [reduce, setReduce] = useState(localStorage.getItem('reduceMotion') === '1')
  const [cur, setCur] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const toggle = () => {
    const v = !reduce
    setReduce(v)
    localStorage.setItem('reduceMotion', v ? '1' : '0')
    document.documentElement.classList.toggle('reduce-motion', v)
  }

  const change = async (e) => {
    e.preventDefault(); setMsg(''); setError('')
    try {
      await api.put('/api/profile/password', { current: cur, password: pw })
      setMsg('Password updated'); setCur(''); setPw('')
    } catch (err) { setError(errMsg(err)) }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="card p-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Reduce animations</p>
          <p className="text-sm text-muted">Turns off button, card flip and loader motion. Saved on this device.</p>
        </div>
        <button role="switch" aria-checked={reduce} onClick={toggle}
          className={`w-14 h-8 rounded-full border-2 border-ink p-0.5 transition ${reduce ? 'bg-mint' : 'bg-white'}`}>
          <span className={`block h-6 w-6 rounded-full bg-ink transition-transform ${reduce ? 'translate-x-6' : ''}`} />
        </button>
      </div>
      <form onSubmit={change} className="card p-6 space-y-3">
        <h2 className="font-semibold text-lg">Change password</h2>
        <input className="field" type="password" placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} required />
        <input className="field" type="password" placeholder="New password (8+ characters)" minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} required />
        {msg && <p className="text-sm text-green-700 font-semibold">{msg}</p>}
        {error && <p className="text-sm text-coral font-semibold">{error}</p>}
        <button className="btn btn-yellow">Update password</button>
      </form>
    </div>
  )
}