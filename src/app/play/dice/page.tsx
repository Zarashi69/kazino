'use client'
import { useState } from 'react'
import { useUserStore } from '@/stores/user'
import { motion, AnimatePresence } from 'framer-motion'

const DICE = ['⚀','⚁','⚂','⚃','⚄','⚅']

export default function DiceGame() {
  const user = useUserStore(s => s.user)
  const updateBalance = useUserStore(s => s.updateBalance)
  const addTransaction = useUserStore(s => s.addTransaction)
  const [bet, setBet] = useState(50)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{win: boolean, value: number} | null>(null)
  const [history, setHistory] = useState<{win: boolean, value: number}[]>([])
  const [popup, setPopup] = useState<string | null>(null)

  function play() {
    if (!user || user.balance < bet || spinning) return
    setSpinning(true)
    updateBalance(-bet, 'Кости (ставка)', 'other')
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1
      const win = value === 6
      if (win) {
        updateBalance(bet * 6, 'Кости (выигрыш)', 'win')
        addTransaction({ id: crypto.randomUUID(), type: 'win', amount: bet * 6, date: new Date().toISOString(), desc: `Кости ${value}` })
        setPopup('Джекпот! +'+(bet*6)+' ₴')
      } else {
        addTransaction({ id: crypto.randomUUID(), type: 'lose', amount: -bet, date: new Date().toISOString(), desc: `Кости ${value}` })
        setPopup('Не повезло!')
      }
      setResult({ win, value })
      setHistory(h => [{ win, value }, ...h.slice(0, 9)])
      setSpinning(false)
      setTimeout(() => setPopup(null), 1500)
    }, 900)
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
            <div className="text-2xl font-bold neon-text mb-1">Кости</div>
            <div className="text-neon-blue text-lg mb-2">Баланс: <span className="text-neon-green font-mono">{user?.balance.toLocaleString('ru-RU')} ₴</span></div>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} max={user?.balance || 100} value={bet} onChange={e => setBet(Number(e.target.value))} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none w-28 text-center" disabled={spinning} />
          </div>
        </div>
        <div className="flex flex-col items-center mb-6 w-full">
          <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className="w-32 h-32 flex items-center justify-center neon-border neon-glow bg-[#0f0026]/80 rounded-2xl text-7xl shadow-xl transition-all duration-200 mb-4" onClick={play} disabled={spinning || !!result}>
            {result ? DICE[result.value-1] : '🎲'}
          </motion.button>
        </div>
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`mt-2 text-2xl font-bold ${result.win ? 'text-neon-green' : 'text-neon-pink'}`}>
              {result.win ? `Выигрыш: +${bet * 6} ₴` : `Выпало: ${DICE[result.value-1]}`}
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
              <span key={i} className={`px-3 py-1 rounded-xl font-mono ${h.win ? 'bg-neon-green/30 text-neon-green' : 'bg-neon-pink/30 text-neon-pink'}`}>{DICE[h.value-1]} {h.win ? `+${bet * 6}` : '—'}</span>
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