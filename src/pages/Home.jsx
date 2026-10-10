import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUploadCloud, FiPlay, FiGrid, FiFileText, FiTrash2 } from 'react-icons/fi'
import api, { errMsg } from '../api'
import StatusBadge from '../components/StatusBadge'
import Loader from '../components/Loader'
import { useAuth } from '../AuthContext'

export default function Home() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('text')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try { setNotes((await api.get('/api/notes')).data) }
    catch (e) { setError(errMsg(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'pdf' && !file) return setError('Please choose a file')
    setBusy(true)
    try {
      if (mode === 'text') await api.post('/api/notes/text', { title, text })
      else {
        const fd = new FormData()
        fd.append('file', file)
        if (title) fd.append('title', title)
        await api.post('/api/notes/upload', fd)
      }
      setTitle(''); setText(''); setFile(null)
      await load()
    } catch (err) { setError(errMsg(err)) }
    finally { setBusy(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this note?')) return
    try { await api.delete(`/api/notes/${id}`); await load() }
    catch (e) { setError(errMsg(e)) }
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const big = '!rounded-3xl py-6 text-lg flex-col'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Hi {user.name}!</h1>
        <p className="text-muted">Turn your notes into organized learning material.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <button onClick={() => scrollTo('add')} className={`btn btn-yellow ${big}`}>
          <FiUploadCloud size={28} />START<span className="text-sm font-normal">Add new notes</span></button>
        <button onClick={() => notes[0] ? nav(`/notes/${notes[0].id}`) : scrollTo('add')} className={`btn btn-coral ${big}`}>
          <FiPlay size={28} />PLAY<span className="text-sm font-normal">Practise latest note</span></button>
        <button onClick={() => scrollTo('list')} className={`btn btn-teal ${big}`}>
          <FiGrid size={28} />MENU<span className="text-sm font-normal">View my notes</span></button>
      </div>

      <form id="add" onSubmit={add} className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add notes</h2>
        <div className="flex gap-2">
          <button type="button" className={`btn btn-sm ${mode === 'text' ? 'btn-yellow' : 'btn-ghost'}`} onClick={() => setMode('text')}>Paste text</button>
          <button type="button" className={`btn btn-sm ${mode === 'pdf' ? 'btn-yellow' : 'btn-ghost'}`} onClick={() => setMode('pdf')}>Upload file</button>
        </div>
        <input className="field" placeholder="Title (optional)" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} />
        {mode === 'text' ? (
          <textarea className="field" rows={7} placeholder="Paste your class notes here..." value={text} onChange={(e) => setText(e.target.value)} required />
        ) : (
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-ink/40 rounded-2xl p-8 cursor-pointer bg-lavender/40 hover:bg-lavender transition">
            <FiUploadCloud size={36} />
            <span className="font-display font-semibold text-center break-all">{file ? file.name : 'Click to choose a PDF or TXT file'}</span>
            <span className="text-xs text-muted">PDF or TXT only, up to 10 MB</span>
            <input type="file" accept="application/pdf,.txt,text/plain" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>
        )}
        {error && <p className="text-sm text-coral font-semibold">{error}</p>}
        <button disabled={busy} className="btn btn-yellow">{busy ? 'Saving...' : 'Save note'}</button>
      </form>

      <section id="list">
        <h2 className="text-xl font-semibold mb-3">My Notes</h2>
        {loading ? <Loader />
          : notes.length === 0 ? <p className="text-muted">No notes yet. Add one above.</p>
          : <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="card p-4 flex items-center gap-3">
                  <span className="bg-lavender rounded-xl p-2"><FiFileText size={20} /></span>
                  <Link to={`/notes/${n.id}`} className="flex-1 min-w-0">
                    <p className="font-bold truncate">{n.title}</p>
                    <p className="text-xs text-muted">{n.sourceType} · {new Date(n.createdAt).toLocaleString()}
                      {n.status === 'READY' && ` · ${n.flashcards} flashcards · ${n.questions} questions`}</p>
                  </Link>
                  <StatusBadge status={n.status} />
                  <button onClick={() => remove(n.id)} aria-label="Delete note" className="text-coral p-2"><FiTrash2 size={18} /></button>
                </li>
              ))}
            </ul>}
      </section>
    </div>
  )
}