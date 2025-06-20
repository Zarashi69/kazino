'use client'
import { useState } from 'react'
import { useUserStore } from '@/stores/user'
import { motion, AnimatePresence } from 'framer-motion'

const SECTORS = [1, 2, 3, 5, 10]

export default function WheelGame() {
  const user = useUserStore(s => s.user)
  const updateBalance = useUserStore(s => s.updateBalance)
  const addTransaction = useUserStore(s => s.addTransaction)
  const [bet, setBet] = useState(50)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{win: boolean, mult: number} | null>(null)
  const [history, setHistory] = useState<{win: boolean, mult: number}[]>([])
  const [popup, setPopup] = useState<string | null>(null)
  const [angle, setAngle] = useState(0)

  function play() {
    if (!user || user.balance < bet || spinning) return
    setSpinning(true)
    updateBalance(-bet, 'Колесо (ставка)', 'other')
    const mult = SECTORS[Math.floor(Math.random() * SECTORS.length)]
    const win = mult > 1
    const newAngle = angle + 1440 + Math.floor(Math.random() * 360)
    setAngle(newAngle)
    setTimeout(() => {
      if (win) {
        updateBalance(bet * mult, 'Колесо (выигрыш)', 'win')
        addTransaction({ id: crypto.randomUUID(), type: 'win', amount: bet * mult, date: new Date().toISOString(), desc: `Колесо x${mult}` })
        setPopup('Выигрыш! x'+mult+' (+'+(bet*mult)+' ₴)')
      } else {
        addTransaction({ id: crypto.randomUUID(), type: 'lose', amount: -bet, date: new Date().toISOString(), desc: `Колесо x${mult}` })
        setPopup('Не повезло!')
      }
      setResult({ win, mult })
      setHistory(h => [{ win, mult }, ...h.slice(0, 9)])
      setSpinning(false)
      setTimeout(() => setPopup(null), 1500)
    }, 1800)
  }

  function reset() {
    setResult(null)
    setSpinning(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-xl neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-8 shadow-2xl z-10 flex flex-col items-center mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-6">
          <div>
            <div className="text-2xl font-bold neon-text mb-1">Колесо фортуны</div>
            <div className="text-neon-blue text-lg mb-2">Баланс: <span className="text-neon-green font-mono">{user?.balance.toLocaleString('ru-RU')} ₴</span></div>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} max={user?.balance || 100} value={bet} onChange={e => setBet(Number(e.target.value))} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none w-28 text-center" disabled={spinning} />
          </div>
        </div>
        <div className="flex flex-col items-center mb-6 w-full">
          <div className="relative w-48 h-48 flex items-center justify-center mb-4">
            <motion.div animate={{ rotate: spinning ? angle : 0 }} transition={{ duration: spinning ? 1.8 : 0.5, ease: 'easeInOut' }} className="w-48 h-48 rounded-full border-4 border-neon-blue shadow-2xl bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] flex items-center justify-center relative">
              {SECTORS.map((m, i) => (
                <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${i * 72}deg) translate(0, -90px)` }}>
                  <span className={`block text-2xl font-bold ${m === 10 ? 'text-neon-yellow' : m === 5 ? 'text-neon-green' : m === 3 ? 'text-neon-blue' : 'text-neon-pink'} drop-shadow-lg`}>x{m}</span>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#1a003a] neon-border neon-glow flex items-center justify-center text-3xl font-bold text-neon-blue shadow-xl">🎡</div>
            </motion.div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-8 h-8 flex items-center justify-center">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-neon-yellow" />
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className="neon-btn px-8 py-3 text-lg font-bold mt-2 shadow-lg" onClick={play} disabled={spinning || !!result}>
            Крутить
          </motion.button>
        </div>
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`mt-2 text-2xl font-bold ${result.win ? 'text-neon-green' : 'text-neon-pink'}`}>
              {result.win ? `Выигрыш: x${result.mult} (+${bet * result.mult} ₴)` : `Выпало: x${result.mult}`}
            </motion.div>
          )}
        </AnimatePresence>
        {result && (
          <button className="neon-btn px-8 py-3 text-lg font-bold mt-6" onClick={reset}>Сыграть ещё</button>
        )}
        <div className="w-full mt-6">
          <div className="text-lg font-semibold neon-text mb-2">История последних игр</div>
          <div className="flex gap-2 flex-wrap">
            {history.length === 0 && <span className="text-neon-blue">Нет истории</span>}
            {history.map((h, i) => (
              <span key={i} className={`px-3 py-1 rounded-xl font-mono ${h.win ? 'bg-neon-green/30 text-neon-green' : 'bg-neon-pink/30 text-neon-pink'}`}>x{h.mult} {h.win ? `+${bet * h.mult}` : '—'}</span>
            ))}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {popup && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a003a]/95 neon-border neon-glow rounded-2xl px-8 py-6 text-3xl font-bold z-50 text-center shadow-2xl text-neon-yellow animate-pulse">
            {popup}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
} 