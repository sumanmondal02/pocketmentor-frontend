import { useEffect, useRef, useState } from 'react'
import Loader from '../components/Loader'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiZap, FiLayers, FiHelpCircle } from 'react-icons/fi'
import api, { errMsg } from '../api'

export default function NotePage() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [content, setContent] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef(null)

  const load = async () => {
    try {
      const [n, c] = await Promise.all([api.get(`/api/notes/${id}`), api.get(`/api/notes/${id}/content`)])
      setNote(n.data); setContent(c.data)
    } catch (e) { setError(errMsg(e)) }
  }

  const stop = () => clearInterval(timer.current)
  const check = async () => {
    try {
      const { data } = await api.get(`/api/notes/${id}/status`)
      if (data.status === 'PROCESSING') { setProcessing(true); return true }
      stop(); setProcessing(false)
      if (data.status === 'FAILED') setError(data.error || 'Generation failed')
      else await load()
    } catch (e) { stop(); setProcessing(false); setError(errMsg(e)) }
    return false
  }
  const poll = () => { stop(); timer.current = setInterval(check, 3000) }

  useEffect(() => {
    load()
    check().then((p) => { if (p) poll() })
    return stop
  }, [id])

  const generate = async () => {
    setError('')
    try { await api.post(`/api/notes/${id}/generate`); setProcessing(true); poll() }
    catch (e) { setError(errMsg(e)) }
  }

  if (!note) return error ? <p className="text-coral font-semibold">{error}</p> : <Loader />
  const ready = !!content?.summary

  return (
    <div className="space-y-6">
      <Link to="/home" className="inline-flex items-center gap-1 text-sm font-semibold"><FiArrowLeft /> Back to notes</Link>
      <div className="card p-6 space-y-4">
        <h1 className="text-2xl font-bold break-words">{note.title}</h1>
        {error && <p className="text-sm text-coral font-semibold">{error}</p>}
        {processing ? (
          <div className="text-center space-y-3 py-4">
            <img src="/mascot.png" alt="" className="h-24 mx-auto animate-bounce" />
            <h2 className="text-xl font-semibold">Preparing your study material</h2>
            <div className="indet max-w-sm mx-auto" />
            <p className="text-sm text-muted">This can take a minute or two. You can leave this page and come back, and it keeps working.</p>
          </div>
        ) : (
          <>
            <button onClick={generate} className="btn btn-yellow">
              <FiZap />{ready ? 'Regenerate with AI' : 'Generate summary, flashcards & quiz'}
            </button>
            {ready && <p className="text-xs text-muted">Regenerating replaces the old flashcards and quiz.</p>}
          </>
        )}
      </div>

      {ready && !processing && (
        <>
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-2">60-second summary</h2>
            <p className="whitespace-pre-line">{content.summary}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {content.topics.map((t) => <span key={t} className="chip bg-lavender">{t}</span>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={`/notes/${id}/flashcards`} className="btn btn-teal"><FiLayers /> Flashcards</Link>
            {content.quizId && <Link to={`/quiz/${content.quizId}`} className="btn btn-coral"><FiHelpCircle /> Take the quiz</Link>}
          </div>
        </>
      )}
    </div>
  )
}