import { FiLinkedin, FiGithub, FiLock, FiHeart, FiCode } from 'react-icons/fi'

const LINKEDIN = 'https://www.linkedin.com/in/sumanmondal02'
const GITHUB = 'https://github.com/sumanmondal02'

const icon = 'h-9 w-9 rounded-full border-2 border-ink bg-white flex items-center justify-center shadow-[0_3px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-butter'

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-2">
      <div className="max-w-5xl mx-auto card bg-lavender/50 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-butter border-2 border-ink flex items-center justify-center shrink-0"><FiCode size={20} /></span>
          <div className="leading-tight">
            <p className="font-display font-semibold">
              Made with <FiHeart className="inline text-coral -mt-1" /> by Suman Mondal
            </p>
            <p className="text-xs text-muted pt-1">© {new Date().getFullYear()} Pocket Mentor</p>
          </div>
        </div>

        <p className="chip bg-mint text-sm !inline-flex !flex-row items-center gap-1.5 whitespace-nowrap">
            <FiLock size={13} className="shrink-0" />
            <span>Private notes · Encrypted passwords</span>
        </p>

        <div className="flex items-center gap-2">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={icon}><FiLinkedin size={18} /></a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={icon}><FiGithub size={18} /></a>
        </div>
      </div>
    </footer>
  )
}