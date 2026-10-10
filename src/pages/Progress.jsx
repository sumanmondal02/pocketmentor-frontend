import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errMsg } from '../api'
import Loader from '../components/Loader'

const tone = { BEGINNER: 'bg-peach', LEARNING: 'bg-lavender', MASTERED: 'bg-mint' }

export default function Progress() {
  const [p, setP] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { api.get('/api/progress').then((r) => setP(r.data)).catch((e) => setError(errMsg(e))) }, [])
  if (!p) return error ? <p className="text-coral font-semibold">{error}</p> : <Loader />
  if (p.history.length === 0) return <p>No quizzes taken yet. <Link to="/home" className="underline font-bold">Go to your notes</Link>.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your progress</h1>
      <div className="grid grid-cols-3 gap-3">
        {[['Answered', p.totalAnswered, 'bg-sky'], ['Accuracy', `${p.overallAccuracy}%`, 'bg-mint'], ['Blind spots', p.blindSpotTotal, 'bg-peach']].map(([l, v, c]) => (
          <div key={l} className={`${c} rounded-2xl border-2 border-ink p-4 text-center`}>
            <p className="text-3xl font-display font-bold">{v}</p><p className="text-sm">{l}</p>
          </div>
        ))}
      </div>
      <section className="card p-5 space-y-3">
        <h2 className="font-semibold text-lg">Accuracy by topic (weakest first)</h2>
        {p.topics.map((t) => (
          <div key={t.topic} className="space-y-1">
            <div className="flex justify-between text-sm items-center">
              <span className="font-semibold">{t.topic}</span>
              <span className={`chip ${tone[t.mastery]}`}>{t.mastery} · {t.accuracy}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-line overflow-hidden"><div className="h-full bg-teal" style={{ width: `${t.accuracy}%` }} /></div>
          </div>
        ))}
      </section>
      <section className="card p-5 space-y-2">
        <h2 className="font-semibold text-lg">Quiz history</h2>
        {p.history.map((h) => (
          <div key={h.attemptId} className="flex justify-between text-sm border-b border-line pb-2">
            <span>{h.noteTitle}</span>
            <span className="font-semibold">{h.score}/{h.total} · {new Date(h.takenAt).toLocaleDateString()}</span>
          </div>
        ))}
      </section>
    </div>
  )
}