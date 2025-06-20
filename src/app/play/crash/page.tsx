'use client';
import { useState, useRef, useEffect } from 'react'
import { useUserStore } from '@/stores/user'
import { motion, AnimatePresence } from 'framer-motion'

const CRASH_MAX = 10
const CRASH_MIN = 1.1
const CRASH_SPEED = 0.015

function getRandomCrash() {
  // Крашится между 1.1 и 10
  return +(Math.random() * (CRASH_MAX - CRASH_MIN) + CRASH_MIN).toFixed(2)
}

export default function CrashGame() {
  const user = useUserStore(s => s.user)
  const updateBalance = useUserStore(s => s.updateBalance)
  const addTransaction = useUserStore(s => s.addTransaction)
  const [bet, setBet] = useState(100)
  const [crashAt, setCrashAt] = useState(getRandomCrash())
  const [mult, setMult] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [cashed, setCashed] = useState(false)
  const [exploded, setExploded] = useState(false)
  const [started, setStarted] = useState(false)
  const [history, setHistory] = useState<{mult: number, win: boolean}[]>([])
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [])

  function startGame() {
    if (!user || user.balance < bet || playing) return
    setStarted(true)
    setPlaying(true)
    setCashed(false)
    setExploded(false)
    setMult(1)
    setCrashAt(getRandomCrash())
    setTimeout(() => {
      interval.current = setInterval(() => {
        setMult(prev => {
          const next = +(prev + CRASH_SPEED).toFixed(2)
          if (next >= crashAt) {
            clearInterval(interval.current!);
            setExploded(true)
            setPlaying(false)
            setHistory(h => [{ mult: crashAt, win: false }, ...h.slice(0, 9)])
            addTransaction({ id: crypto.randomUUID(), type: 'lose', amount: 0, date: new Date().toISOString(), desc: `Crash x${crashAt}` })
          }
          return next
        })
      }, 30)
      updateBalance(-bet, 'Crash-игра (ставка)', 'other')
    }, 100)
  }

  function cashOut() {
    if (!playing || cashed) return
    clearInterval(interval.current!)
    setPlaying(false)
    setCashed(true)
    setHistory(h => [{ mult, win: true }, ...h.slice(0, 9)])
    const win = Math.floor(bet * mult)
    updateBalance(win, 'Crash-игра (выигрыш)', 'win')
    addTransaction({ id: crypto.randomUUID(), type: 'win', amount: win, date: new Date().toISOString(), desc: `Crash x${mult}` })
  }

  function reset() {
    setMult(1)
    setCashed(false)
    setExploded(false)
    setPlaying(false)
    setStarted(false)
    setCrashAt(getRandomCrash())
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] relative overflow-hidden">
      {/* SVG неоновые линии и частицы */}
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none z-0">
        <defs>
          <radialGradient id="crashGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff00cc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a003a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="60%" r="300" fill="url(#crashGlow)" />
        <rect x="20%" y="40%" width="60%" height="2" fill="#00eaff" opacity="0.12" />
        <rect x="10%" y="80%" width="80%" height="1.5" fill="#fff700" opacity="0.09" />
      </svg>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-2xl neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-8 shadow-2xl z-10 flex flex-col items-center mt-24 animate-shimmer">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-6">
          <div>
            <div className="text-2xl font-bold neon-text mb-1 drop-shadow-lg flicker">Crash-игра "Ракетка"</div>
            <div className="text-neon-blue text-lg mb-2">Баланс: <span className="text-neon-green font-mono">{user?.balance.toLocaleString('ru-RU')} ₴</span></div>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} max={user?.balance || 100} value={bet} onChange={e => setBet(Number(e.target.value))} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none w-28 text-center animate-shimmer" disabled={playing || started} />
          </div>
        </div>
        {!started && (
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.05 }} className="neon-btn px-12 py-5 text-2xl font-extrabold uppercase mb-8 animate-pulse shadow-2xl animate-shimmer" onClick={startGame} disabled={playing || (user?.balance ?? 0) < bet}>
            Старт
          </motion.button>
        )}
        {started && (
          <div className="relative flex flex-col items-center justify-center w-full h-64 mb-8">
            <motion.div animate={{ scale: playing ? 1.2 : 1, rotate: playing ? 2 : 0 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }} className="text-6xl font-extrabold neon-text drop-shadow-lg flicker animate-shimmer">
              x{mult.toFixed(2)}
            </motion.div>
            <AnimatePresence>
              {exploded && (
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-neon-pink font-extrabold drop-shadow-2xl animate-shimmer">
                  💥 КРАШ!
                </motion.div>
              )}
              {cashed && (
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-neon-green font-extrabold drop-shadow-2xl animate-shimmer">
                  🤑 ЗАБРАЛ!
                </motion.div>
              )}
            </AnimatePresence>
            <motion.svg width="80" height="80" className="absolute bottom-0 left-1/2 -translate-x-1/2" animate={{ y: playing ? -180 * (mult / CRASH_MAX) : 0, filter: playing ? 'drop-shadow(0 0 24px #00eaff)' : 'none' }} transition={{ type: 'spring', stiffness: 60, damping: 10 }}>
              <g filter="url(#glow)">
                <rect x="35" y="40" width="10" height="30" rx="5" fill="#00eaff" />
                <polygon points="40,10 30,40 50,40" fill="#ff00cc" />
                <ellipse cx="40" cy="70" rx="8" ry="6" fill="#fff700" opacity="0.7" />
                <rect x="39" y="70" width="2" height="40" fill="#00eaff" opacity="0.4" />
              </g>
              <defs>
                <filter id="glow" x="0" y="0" width="80" height="80">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </motion.svg>
          </div>
        )}
        {started && (
          <div className="flex gap-4 mb-4">
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.05 }} className="neon-btn px-6 py-2 text-lg font-semibold uppercase animate-shimmer" onClick={cashOut} disabled={!playing || cashed || exploded}>Забрать</motion.button>
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.05 }} className="neon-btn px-6 py-2 text-lg font-semibold uppercase animate-shimmer" onClick={reset} disabled={playing}>Сброс</motion.button>
          </div>
        )}
        <div className="w-full mt-6">
          <div className="text-lg font-semibold neon-text mb-2">История последних игр</div>
          <div className="flex gap-2 flex-wrap">
            {history.length === 0 && <span className="text-neon-blue animate-pulse">Нет истории</span>}
            {history.map((h, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.3 }} className={`px-3 py-1 rounded-xl font-mono ${h.win ? 'bg-neon-green/30 text-neon-green' : 'bg-neon-pink/30 text-neon-pink'} neon-border neon-glow animate-shimmer`}>x{h.mult}</motion.span>
            ))}
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-30 blur-lg mt-8 rounded-full animate-pulse" />
      </motion.div>
    </main>
  )
} 