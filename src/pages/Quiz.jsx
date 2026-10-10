import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiCheck, FiX, FiAlertTriangle, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import api, { errMsg } from '../api'
import Loader from '../components/Loader'

const OPTS = [['A', 'optionA'], ['B', 'optionB'], ['C', 'optionC'], ['D', 'optionD']]
const CONF = [['SURE', "I'm sure"], ['NOT_SURE', 'Not sure'], ['GUESSING', 'Guessing']]

export default function Quiz() {
  const { id } = useParams()
  const nav = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setQuiz(null); setIdx(0); setAnswers({}); setResult(null); setError('')
    api.get(`/api/quizzes/${id}`).then((r) => setQuiz(r.data)).catch((e) => setError(errMsg(e)))
  }, [id])

  if (!quiz) return error ? <p className="text-coral font-semibold">{error}</p> : <Loader />
  if (quiz.questions.length === 0) return <p>This quiz has no questions.</p>

  const submit = async () => {
    setBusy(true); setError('')
    try {
      const body = { answers: Object.entries(answers).map(([q, v]) => ({ questionId: Number(q), selected: v.selected, confidence: v.confidence })) }
      setResult((await api.post(`/api/quizzes/${id}/submit`, body)).data)
    } catch (e) { setError(errMsg(e)) } finally { setBusy(false) }
  }

  const retake = async () => {
    setBusy(true); setError('')
    try { nav(`/quiz/${(await api.post(`/api/notes/${quiz.noteId}/retake-weak`)).data.quizId}`) }
    catch (e) { setError(errMsg(e)) } finally { setBusy(false) }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="card p-6 text-center space-y-1">
          <h1 className="text-4xl font-bold">{result.score} / {result.total}</h1>
          <p className="text-muted">Your score</p>
          {result.blindSpotCount > 0 && (
            <p className="chip bg-peach inline-flex items-center gap-1"><FiAlertTriangle /> {result.blindSpotCount} blind spot{result.blindSpotCount > 1 ? 's' : ''}: sure but wrong</p>
          )}
        </div>
        {result.items.map((it) => (
          <div key={it.questionId} className={`card p-5 space-y-2 ${it.blindSpot ? 'border-coral border-2' : ''}`}>
            <p className="font-bold flex gap-2">
              {it.correct ? <FiCheck className="text-green-600 mt-1 shrink-0" /> : <FiX className="text-coral mt-1 shrink-0" />}{it.text}
            </p>
            {!it.correct && <p className="text-sm">Your answer: <b>{it.selected}</b> · Correct: <b>{it.correctOption}. {it.correctText}</b></p>}
            {it.blindSpot && <p className="text-sm text-coral font-semibold">Blind spot: you were sure, but wrong. Review this topic.</p>}
            {it.explanation && <p className="text-sm text-muted">{it.explanation}</p>}
          </div>
        ))}
        {error && <p className="text-coral font-semibold">{error}</p>}
        <div className="flex flex-wrap gap-3">
          {result.score < result.total && <button onClick={retake} disabled={busy} className="btn btn-coral">Retake my weak questions</button>}
          <Link to={`/notes/${quiz.noteId}/flashcards`} className="btn btn-teal">Revise flashcards</Link>
          <Link to={`/notes/${quiz.noteId}`} className="btn btn-ghost">Back to note</Link>
          <Link to="/progress" className="btn btn-yellow">My progress</Link>
        </div>
      </div>
    )
  }

  const total = quiz.questions.length
  const q = quiz.questions[idx]
  const a = answers[q.id] || {}
  const set = (k, v) => setAnswers({ ...answers, [q.id]: { ...a, [k]: v } })
  const ready = a.selected && a.confidence
  const last = idx === total - 1

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 rounded-full bg-lavender overflow-hidden">
          <div className="h-full bg-butter border-r-2 border-ink transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold">Question {idx + 1} of {total}</span>
      </div>
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">{q.text}</h2>
        <div className="space-y-2">
          {OPTS.map(([L, key]) => (
            <button key={L} onClick={() => set('selected', L)}
              className={`w-full flex items-center gap-3 text-left rounded-xl border-2 px-3 py-2 transition ${a.selected === L ? 'bg-mint border-ink' : 'bg-white border-line hover:border-ink'}`}>
              <span className="font-display font-bold bg-lavender rounded-lg w-8 h-8 flex items-center justify-center shrink-0">{L}</span>{q[key]}
            </button>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">How confident are you?</p>
          <div className="flex flex-wrap gap-2">
            {CONF.map(([v, label]) => (
              <button key={v} onClick={() => set('confidence', v)}
                className={`btn btn-sm ${a.confidence === v ? 'btn-yellow' : 'btn-ghost'}`}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-coral font-semibold">{error}</p>}
      <div className="flex justify-between">
        <button className="btn btn-ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><FiArrowLeft /> Previous</button>
        {last
          ? <button className="btn btn-coral" disabled={Object.values(answers).filter((x) => x.selected && x.confidence).length < total || busy} onClick={submit}>{busy ? 'Submitting...' : 'Submit quiz'}</button>
          : <button className="btn btn-yellow" disabled={!ready} onClick={() => setIdx(idx + 1)}>Next <FiArrowRight /></button>}
      </div>
    </div>
  )
}