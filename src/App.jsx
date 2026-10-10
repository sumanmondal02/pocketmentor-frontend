import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import NotePage from './pages/NotePage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/notes/:id" element={<NotePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}