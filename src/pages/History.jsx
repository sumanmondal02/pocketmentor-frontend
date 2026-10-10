import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlay, FiFileText, FiSearch } from 'react-icons/fi'
import api, { errMsg } from '../api'
import StatusBadge from '../components/StatusBadge'
import Loader from '../components/Loader'

const sod = (x) => { const d = new Date(x); d.setHours(0, 0, 0, 0); return d.getTime() }
const bucket = (x) => {
  const days = Math.round((sod(Date.now()) - sod(x)) / 864e5)
  return days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 7 ? 'This week' : 'Earlier'
}
const ORDER = ['Today', 'Yesterday', 'This week', 'Earlier']
const FILTERS = [['ALL', 'All'], ['READY', 'Ready'], ['PROCESSING', 'Processing'], ['FAILED', 'Failed'], ['NOT_GENERATED', 'Not generated']]

export default function History() {
  const [notes, setNotes] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [newest, setNewest] = useState(true)

  useEffect(() => { api.get('/api/notes').then((r) => setNotes(r.data)).catch((e) => setError(errMsg(e))) }, [])

  const groups = useMemo(() => {
    if (!notes) return {}
    const list = notes
      .filter((n) => (filter === 'ALL' || n.status === filter) && n.title.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (newest ? 1 : -1) * (new Date(b.createdAt) - new Date(a.createdAt)))
    return list.reduce((acc, n) => { (acc[bucket(n.createdAt)] ||= []).push(n); return acc }, {})
  }, [notes, q, filter, newest])

  if (!notes) return error ? <p className="text-coral font-semibold">{error}</p> : <Loader />
  const empty = Object.keys(groups).length === 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Your study history</h1>
        <p className="text-muted">Every note you added and the study material generated from it.</p>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-3.5 text-muted" />
          <input className="field pl-9" placeholder="Search notes..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setNewest(!newest)}>{newest ? 'Newest first' : 'Oldest first'}</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`btn btn-sm ${filter === v ? 'btn-yellow' : 'btn-ghost'}`}>{l}</button>
        ))}
      </div>
      {empty && <p className="text-muted">Nothing here. <Link to="/home" className="underline font-bold">Add notes</Link>.</p>}
      {ORDER.filter((g) => groups[g]).map((g) => (
        <section key={g} className="space-y-2">
          <h2 className="font-semibold text-muted">{g}</h2>
          {groups[g].map((n) => (
            <div key={n.id} className="card p-4 flex items-center gap-3">
              <span className="bg-lavender rounded-xl p-2"><FiFileText size={20} /></span>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{n.title}</p>
                <p className="text-xs text-muted">{new Date(n.createdAt).toLocaleString()}
                  {n.status === 'READY' && ` · ${n.flashcards} flashcards · ${n.questions} questions`}</p>
              </div>
              <StatusBadge status={n.status} />
              <Link to={`/notes/${n.id}`} className="btn btn-yellow btn-sm"><FiPlay /> {n.status === 'READY' ? 'Play' : 'Open'}</Link>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}