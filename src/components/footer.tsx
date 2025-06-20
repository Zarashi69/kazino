export default function Footer() {
  return (
    <footer className="w-full py-2 sm:py-4 px-2 sm:px-6 flex flex-col sm:flex-row items-center justify-between bg-[#0f0026]/80 neon-border-t neon-glow text-xs sm:text-base gap-1 sm:gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl neon-text animate-pulse">🎰</span>
        <span className="font-bold text-lg">Казино Даниила</span>
        <span className="ml-2 px-3 py-1 bg-neon-blue text-white text-xs font-bold rounded-xl neon-glow animate-pulse">v2.0</span>
      </div>
      <nav className="flex gap-6 text-neon-blue text-lg font-semibold">
        <a href="#faq" className="hover:underline">FAQ</a>
        <a href="/profile" className="hover:underline">Профиль</a>
        <a href="/admin" className="hover:underline">Админка</a>
      </nav>
      <div className="text-neon-purple text-sm">© {new Date().getFullYear()} Казино Даниила</div>
      {/* SVG неоновые частицы и разделители */}
      <svg width="100%" height="100%" className="absolute left-0 top-0 pointer-events-none opacity-40 animate-pulse">
        <circle cx="20" cy="20" r="12" fill="#ff00cc" />
        <circle cx="180" cy="40" r="8" fill="#00eaff" />
        <circle cx="80" cy="60" r="5" fill="#fff700" />
        <rect x="0" y="90" width="100%" height="2" fill="url(#footerNeonLine)" opacity="0.2" />
        <defs>
          <linearGradient id="footerNeonLine" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#ff00cc" />
            <stop offset="100%" stopColor="#00eaff" />
          </linearGradient>
        </defs>
      </svg>
      <svg width="100%" height="100%" className="absolute right-0 bottom-0 pointer-events-none opacity-30 animate-pulse">
        <circle cx="95%" cy="80" r="10" fill="#39ff14" />
        <circle cx="90%" cy="30" r="6" fill="#a259ff" />
        <rect x="0" y="0" width="100%" height="2" fill="url(#footerNeonLine2)" opacity="0.15" />
        <defs>
          <linearGradient id="footerNeonLine2" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#39ff14" />
            <stop offset="100%" stopColor="#a259ff" />
          </linearGradient>
        </defs>
      </svg>
    </footer>
  )
} 