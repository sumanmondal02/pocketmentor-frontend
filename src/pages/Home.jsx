import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errMsg } from '../api'

export default function Home() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('text')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/notes')
      setNotes(data)
    } catch (e) { setError(errMsg(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      if (mode === 'text') {
        await api.post('/api/notes/text', { title, text })
      } else {
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

  const tab = (m) => `px-4 py-1.5 rounded-lg text-sm ${mode === m ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`
  const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="space-y-8">
      <form onSubmit={add} className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add notes</h2>
        <div className="flex gap-2">
          <button type="button" className={tab('text')} onClick={() => setMode('text')}>Paste text</button>
          <button type="button" className={tab('pdf')} onClick={() => setMode('pdf')}>Upload PDF</button>
        </div>
        <input className={input} placeholder="Title (optional)" value={title} maxLength={200}
               onChange={(e) => setTitle(e.target.value)} />
        {mode === 'text' ? (
          <textarea className={input} rows={7} placeholder="Paste your class notes here..."
                    value={text} onChange={(e) => setText(e.target.value)} required />
        ) : (
          <input type="file" accept="application/pdf" required
                 onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="rounded-lg bg-indigo-600 text-white px-5 py-2 font-medium hover:bg-indigo-700 disabled:opacity-60">
          {busy ? 'Saving...' : 'Save note'}
        </button>
      </form>

      <section>
        <h2 className="text-lg font-semibold mb-3">Your notes</h2>
        {loading ? <p className="text-slate-500">Loading...</p>
          : notes.length === 0 ? <p className="text-slate-500">No notes yet. Add one above.</p>
          : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <Link to={`/notes/${n.id}`} className="flex-1">
                    <p className="font-medium text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500">
                      {n.sourceType} · {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </Link>
                  <button onClick={() => remove(n.id)} className="text-sm text-red-600 hover:underline ml-4">Delete</button>
                </li>
              ))}
            </ul>
          )}
      </section>
    </div>
  )
}