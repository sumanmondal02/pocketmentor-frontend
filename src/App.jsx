import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import Landing from './pages/Landing'
import Home from './pages/Home'
import NotePage from './pages/NotePage'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import Progress from './pages/Progress'
import History from './pages/History'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function Guest({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/home" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Guest><Landing /></Guest>} />
      <Route path="/login" element={<Guest><AuthPage mode="login" /></Guest>} />
      <Route path="/register" element={<Guest><AuthPage mode="register" /></Guest>} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/notes/:id" element={<NotePage />} />
        <Route path="/notes/:id/flashcards" element={<Flashcards />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/history" element={<History />} />
        <Route path="/notes" element={<Navigate to="/history" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}