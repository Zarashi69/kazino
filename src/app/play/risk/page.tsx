'use client';
import { useState } from 'react'
import { useUserStore } from '@/stores/user'
import { motion, AnimatePresence } from 'framer-motion'

const ARROWS = [
  { dir: 'left', icon: '⬅️' },
  { dir: 'right', icon: '➡️' },
]

export default function RiskGame() {
  const user = useUserStore(s => s.user)
  const updateBalance = useUserStore(s => s.updateBalance)
  const addTransaction = useUserStore(s => s.addTransaction)
  const [bet, setBet] = useState(50)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{win: boolean, choice: string, correct: string} | null>(null)
  const [history, setHistory] = useState<{win: boolean, choice: string, correct: string}[]>([])

  function play(choice: string) {
    if (!user || user.balance < bet || spinning) return
    setSpinning(true)
    updateBalance(-bet, 'Риск-игра (ставка)', 'other')
    setTimeout(() => {
      const correct = Math.random() < 0.5 ? 'left' : 'right'
      const win = choice === correct
      if (win) {
        updateBalance(bet * 2, 'Риск-игра (выигрыш)', 'win')
        addTransaction({ id: crypto.randomUUID(), type: 'win', amount: bet * 2, date: new Date().toISOString(), desc: `Стрелка ${choice}` })
      } else {
        addTransaction({ id: crypto.randomUUID(), type: 'lose', amount: -bet, date: new Date().toISOString(), desc: `Стрелка ${choice}` })
      }
      setResult({ win, choice, correct })
      setHistory(h => [{ win, choice, correct }, ...h.slice(0, 9)])
      setSpinning(false)
    }, 900)
  }

  function reset() {
    setResult(null)
    setSpinning(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-xl neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-8 shadow-2xl z-10 flex flex-col items-center mt-24 animate-shimmer">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-6">
          <div>
            <div className="text-2xl font-bold neon-text mb-1 drop-shadow-lg flicker">Риск-игра "Стрелка"</div>
            <div className="text-neon-blue text-lg mb-2">Баланс: <span className="text-neon-green font-mono">{user?.balance.toLocaleString('ru-RU')} ₴</span></div>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} max={user?.balance || 100} value={bet} onChange={e => setBet(Number(e.target.value))} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none w-28 text-center animate-shimmer" disabled={spinning} />
          </div>
        </div>
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="flex justify-center gap-16 mb-6 w-full">
            {ARROWS.map(a => (
              <motion.button key={a.dir} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center neon-border neon-glow bg-[#0f0026]/80 rounded-2xl text-6xl md:text-7xl shadow-xl transition-all duration-200 animate-shimmer" onClick={() => play(a.dir)} disabled={spinning || !!result}>
                {a.icon}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`mt-2 text-2xl font-bold ${result.win ? 'text-neon-green' : 'text-neon-pink'} animate-shimmer`}>
                {result.win ? `Выигрыш: +${bet * 2} ₴` : `Проигрыш! Было: ${ARROWS.find(a => a.dir === result.correct)?.icon}`}
              </motion.div>
            )}
          </AnimatePresence>
          {result && (
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.05 }} className="neon-btn px-8 py-3 text-lg font-bold mt-6 animate-shimmer" onClick={reset}>Сыграть ещё</motion.button>
          )}
        </div>
        <div className="w-full mt-6">
          <div className="text-lg font-semibold neon-text mb-2">История последних игр</div>
          <div className="flex gap-2 flex-wrap">
            {history.length === 0 && <span className="text-neon-blue animate-pulse">Нет истории</span>}
            {history.map((h, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.3 }} className={`px-3 py-1 rounded-xl font-mono ${h.win ? 'bg-neon-green/30 text-neon-green' : 'bg-neon-pink/30 text-neon-pink'} neon-border neon-glow animate-shimmer`}>{ARROWS.find(a => a.dir === h.choice)?.icon} {h.win ? `+${bet * 2}` : '—'}</motion.span>
            ))}
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-30 blur-lg mt-8 rounded-full animate-pulse" />
      </motion.div>
    </main>
  )
} 