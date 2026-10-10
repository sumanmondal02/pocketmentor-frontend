import { Navigate, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">Pocket Mentor</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/progress" className="text-slate-600 hover:text-indigo-600">Progress</Link>
            <span className="text-slate-500 hidden sm:inline">{user.name}</span>
            <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}