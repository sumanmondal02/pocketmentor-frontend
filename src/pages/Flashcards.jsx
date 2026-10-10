import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiRotateCw } from 'react-icons/fi'
import api, { errMsg } from '../api'
  import Loader from '../components/Loader'

export default function Flashcards() {
  const { id } = useParams()
  const [cards, setCards] = useState(null)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/notes/${id}/flashcards`).then((r) => setCards(r.data)).catch((e) => setError(errMsg(e)))
  }, [id])

  const go = (d) => { setFlipped(false); setI((x) => Math.min(Math.max(x + d, 0), cards.length - 1)) }

  useEffect(() => {
    if (!cards?.length) return
    const k = (e) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f) }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [cards])

  if (!cards) return error ? <p className="text-coral font-semibold">{error}</p> : <Loader />
  if (cards.length === 0) return <p>No flashcards yet. <Link className="underline font-bold" to={`/notes/${id}`}>Generate them first</Link>.</p>
  const c = cards[i]

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link to={`/notes/${id}`} className="inline-flex items-center gap-1 text-sm font-semibold"><FiArrowLeft /> Back to note</Link>
      <p className="text-center font-display font-semibold">{i + 1} / {cards.length}{c.topic && <span className="chip bg-lavender ml-2">{c.topic}</span>}</p>
      <div className="flip h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`flip-inner ${flipped ? 'on' : ''}`}>
          <div className="flip-face bg-sky">{c.question}</div>
          <div className="flip-face flip-back bg-butter">{c.answer}</div>
        </div>
      </div>
      <p className="text-center text-sm text-muted">Click the card or press Space to flip. Use the arrow keys to move.</p>
      <div className="flex justify-center gap-3">
        <button className="btn btn-ghost" disabled={i === 0} onClick={() => go(-1)}><FiArrowLeft /> Prev</button>
        <button className="btn btn-coral" onClick={() => setFlipped(!flipped)}><FiRotateCw /> Flip</button>
        <button className="btn btn-teal" disabled={i === cards.length - 1} onClick={() => go(1)}>Next <FiArrowRight /></button>
      </div>
    </div>
  )
}