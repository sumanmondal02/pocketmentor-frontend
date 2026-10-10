import { Link } from 'react-router-dom'
import { FiBookOpen } from 'react-icons/fi'
import Footer from '../components/Footer'

const feats = [['Summary', 'bg-butter'], ['Flashcards', 'bg-sky'], ['Quiz', 'bg-peach'], ['Blind spots', 'bg-mint']]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <span className="flex items-center gap-2 font-display font-bold text-xl"><FiBookOpen /> Pocket Mentor</span>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/register" className="btn btn-coral btn-sm">Sign up</Link>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-5xl font-bold leading-tight">Turn your notes into real learning</h1>
          <p className="text-muted text-lg">Upload notes and get AI summaries, flashcards and quizzes. Spot the things you are confidently wrong about.</p>
          <div className="flex gap-3">
            <Link to="/register" className="btn btn-yellow">GET STARTED</Link>
            <Link to="/login" className="btn btn-ghost">LOGIN</Link>
          </div>
        </div>
        <img src="/mascot.png" alt="Pocket Mentor mascot" className="w-full max-w-sm mx-auto" />
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {feats.map(([t, c]) => (
          <div key={t} className={`${c} rounded-2xl border-2 border-ink p-5 font-display font-semibold text-lg text-center`}>{t}</div>
        ))}
      </section>
    <Footer />
    </div>
  )
}