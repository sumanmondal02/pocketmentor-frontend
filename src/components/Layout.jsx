import { Navigate, Outlet, NavLink, Link } from 'react-router-dom'
import Footer from './Footer'
import { FiHome, FiBarChart2, FiLogOut, FiClock, FiUser, FiSettings } from 'react-icons/fi'
import { useAuth } from '../AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const cls = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold border-2 transition ${isActive ? 'bg-butter border-ink' : 'border-transparent hover:bg-white'}`
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 px-4 pt-3">
        <div className="max-w-5xl mx-auto card bg-lavender/50 backdrop-blur px-4 py-2 flex items-center gap-3">
          <Link to="/home" className="flex items-center gap-2 font-display font-bold text-xl">
            <img src="/mascot.png" alt="" className="h-9 w-9 object-contain" />
            <span className="hidden sm:inline">Pocket Mentor</span>
          </Link>
          <nav className="flex gap-1 ml-auto">
            <NavLink to="/home" className={cls}><FiHome /><span className="hidden lg:inline">Home</span></NavLink>
            <NavLink to="/history" className={cls}><FiClock /><span className="hidden lg:inline">History</span></NavLink>
            <NavLink to="/progress" className={cls}><FiBarChart2 /><span className="hidden lg:inline">Progress</span></NavLink>
            <NavLink to="/profile" className={cls}><FiUser /><span className="hidden lg:inline">Profile</span></NavLink>
            <NavLink to="/settings" className={cls}><FiSettings /><span className="hidden lg:inline">Settings</span></NavLink>
          </nav>
          <button onClick={logout} className="btn btn-ghost btn-sm"><FiLogOut /><span className="hidden sm:inline"> Logout</span></button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 pb-2"><Outlet /></main>
    <Footer />
    </div>
  )
}