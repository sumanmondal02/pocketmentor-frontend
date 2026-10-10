const tips = ['Warming up your study desk...', 'Fetching your notes...', 'Almost there, hang tight!']

export default function Loader({ text }) {
  const t = text || tips[Math.floor(Math.random() * tips.length)]
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <img src="/mascot.png" alt="" className="h-20 animate-bounce" />
      <p className="font-display font-semibold text-lg">{t}</p>
      <div className="indet w-48" />
      <p className="text-sm text-muted">Please wait a moment</p>
    </div>
  )
}