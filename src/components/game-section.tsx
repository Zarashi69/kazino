import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const games = [
  {
    key: 'crash',
    title: 'Ракетка',
    desc: 'Crash-игра: успей забрать выигрыш до взрыва!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#00eaff" strokeWidth="4" /><path d="M24 8 L32 40" stroke="#ff00cc" strokeWidth="4" strokeLinecap="round" /><circle cx="24" cy="24" r="6" fill="#ff00cc" /></svg>
    ),
  },
  {
    key: 'slots',
    title: 'Рулетка',
    desc: 'Слот-машина: крути барабаны и лови джекпот!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="24" rx="8" stroke="#39ff14" strokeWidth="4" /><circle cx="16" cy="24" r="4" fill="#fff700" /><circle cx="24" cy="24" r="4" fill="#ff00cc" /><circle cx="32" cy="24" r="4" fill="#00eaff" /></svg>
    ),
  },
  {
    key: 'risk',
    title: 'Стрелка',
    desc: 'Риск-игра: угадай, где больше — и удвой баланс!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 40 L24 8" stroke="#fff700" strokeWidth="4" strokeLinecap="round" /><polygon points="24,4 20,12 28,12" fill="#fff700" /><rect x="20" y="20" width="8" height="16" rx="4" fill="#a259ff" /></svg>
    ),
  },
  {
    key: 'coin',
    title: 'Монетка',
    desc: 'Орел или решка — угадай и удвой баланс!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#fff700" strokeWidth="4" /><circle cx="24" cy="24" r="14" fill="#ff00cc" opacity="0.7" /><text x="50%" y="54%" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">₿</text></svg>
    ),
  },
  {
    key: 'dice',
    title: 'Кости',
    desc: 'Брось кости — если выпадет 6, получи x6!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="8" stroke="#39ff14" strokeWidth="4" /><circle cx="16" cy="16" r="3" fill="#fff700" /><circle cx="32" cy="32" r="3" fill="#ff00cc" /><circle cx="24" cy="24" r="3" fill="#00eaff" /></svg>
    ),
  },
  {
    key: 'wheel',
    title: 'Колесо фортуны',
    desc: 'Крути колесо — выиграй до x10!',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#a259ff" strokeWidth="4" /><path d="M24 4 L24 44" stroke="#fff700" strokeWidth="3" /><path d="M4 24 L44 24" stroke="#00eaff" strokeWidth="3" /><circle cx="24" cy="24" r="8" fill="#ff00cc" opacity="0.7" /></svg>
    ),
  },
]

export default function GameSection() {
  const router = useRouter();
  return (
    <section id="games" className="relative z-10 py-16 md:py-24 flex flex-col items-center">
      <h2 className="neon-text text-3xl md:text-5xl font-bold mb-10 text-center">Игры</h2>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game, i) => (
          <motion.div
            key={game.key}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-8 shadow-2xl flex flex-col items-center hover:scale-105 transition-all duration-200 group overflow-hidden animate-shimmer"
          >
            <div className="absolute -top-4 right-4 px-4 py-1 bg-neon-blue text-white text-xs font-bold rounded-b-xl neon-glow animate-pulse">NEW</div>
            <div className="mb-4">{game.icon}</div>
            <div className="text-2xl font-bold neon-text mb-2 drop-shadow-lg flicker">{game.title}</div>
            <div className="text-neon-blue text-lg mb-4 text-center">{game.desc}</div>
            <button
              className="neon-btn px-8 py-3 text-lg font-bold mt-auto shadow-lg group-hover:scale-110 transition"
              onClick={() => router.push(`/play/${game.key}`)}
            >
              Играть
            </button>
            <div className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-40 blur-lg animate-pulse" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
