import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { errMsg } from '../api'

export default function NotePage() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [content, setContent] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [n, c] = await Promise.all([api.get(`/api/notes/${id}`), api.get(`/api/notes/${id}/content`)])
      setNote(n.data); setContent(c.data)
    } catch (e) { setError(errMsg(e)) }
  }
  useEffect(() => { load() }, [id])

  const generate = async () => {
    setError(''); setBusy(true)
    try { await api.post(`/api/notes/${id}/generate`); await load() }
    catch (e) { setError(errMsg(e)) }
    finally { setBusy(false) }
  }

  if (!note) return <p className="text-slate-500">{error || 'Loading...'}</p>
  const ready = !!content?.summary

  const btn = 'rounded-lg px-4 py-2 text-sm font-medium'
  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-indigo-600">← All notes</Link>
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-bold">{note.title}</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button onClick={generate} disabled={busy}
                className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60`}>
          {busy ? 'Generating... this can take up to a minute' : ready ? 'Regenerate with AI' : 'Generate summary, flashcards & quiz'}
        </button>
        {ready && <p className="text-xs text-slate-500">Regenerating replaces the old flashcards and quiz.</p>}
      </div>

      {ready && (
        <>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-2">60-second summary</h3>
            <p className="text-slate-700 whitespace-pre-line">{content.summary}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {content.topics.map((t) => (
                <span key={t} className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-3 py-1">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={`/notes/${id}/flashcards`} className={`${btn} bg-white shadow text-slate-800`}>Practice flashcards</Link>
            {content.quizId && (
              <Link to={`/quiz/${content.quizId}`} className={`${btn} bg-white shadow text-slate-800`}>Take the quiz</Link>
            )}
          </div>
        </>
      )}
    </div>
  )
}