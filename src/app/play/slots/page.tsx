'use client';
import { useState } from 'react'
import { useUserStore } from '@/stores/user'
import { motion, AnimatePresence } from 'framer-motion'

const SYMBOLS = [
  { icon: '🍒', value: 2 },
  { icon: '🍋', value: 3 },
  { icon: '🔔', value: 5 },
  { icon: '💎', value: 10 },
  { icon: '7️⃣', value: 20 },
]

function getRandomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}

export default function SlotsGame() {
  const user = useUserStore(s => s.user)
  const updateBalance = useUserStore(s => s.updateBalance)
  const addTransaction = useUserStore(s => s.addTransaction)
  const [bet, setBet] = useState(50)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{icons: string[], win: number} | null>(null)
  const [history, setHistory] = useState<{icons: string[], win: number}[]>([])

  function spin() {
    if (!user || user.balance < bet || spinning) return
    setSpinning(true)
    updateBalance(-bet, 'Слот-машина (ставка)', 'other')
    setTimeout(() => {
      const reels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      const icons = reels.map(r => r.icon)
      let win = 0
      if (reels[0].icon === reels[1].icon && reels[1].icon === reels[2].icon) {
        win = bet * reels[0].value
        updateBalance(win, `Слот-машина (выигрыш ${reels[0].icon})`, 'win')
        addTransaction({ id: crypto.randomUUID(), type: 'win', amount: win, date: new Date().toISOString(), desc: `Слоты ${reels[0].icon}` })
      } else {
        addTransaction({ id: crypto.randomUUID(), type: 'lose', amount: -bet, date: new Date().toISOString(), desc: `Слоты ${icons.join('')}` })
      }
      setResult({ icons, win })
      setHistory(h => [{ icons, win }, ...h.slice(0, 9)])
      setSpinning(false)
    }, 1200)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-xl neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-8 shadow-2xl z-10 flex flex-col items-center mt-24 animate-shimmer">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-6">
          <div>
            <div className="text-2xl font-bold neon-text mb-1 drop-shadow-lg flicker">Слот-машина "Рулетка"</div>
            <div className="text-neon-blue text-lg mb-2">Баланс: <span className="text-neon-green font-mono">{user?.balance.toLocaleString('ru-RU')} ₴</span></div>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} max={user?.balance || 100} value={bet} onChange={e => setBet(Number(e.target.value))} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none w-28 text-center animate-shimmer" disabled={spinning} />
          </div>
        </div>
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="flex justify-center gap-6 mb-6 w-full">
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ rotate: spinning ? 360 : 0, scale: spinning ? 1.2 : 1, filter: spinning ? 'drop-shadow(0 0 24px #39ff14)' : 'none' }} transition={{ duration: 1, repeat: spinning ? Infinity : 0, ease: 'linear' }} className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center neon-border neon-glow bg-[#0f0026]/80 rounded-2xl text-5xl md:text-6xl shadow-xl animate-shimmer">
                {result ? result.icons[i] : '❔'}
              </motion.div>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.05 }} className="neon-btn px-12 py-5 text-2xl font-extrabold uppercase mb-4 animate-pulse shadow-2xl animate-shimmer" onClick={spin} disabled={spinning || (user?.balance ?? 0) < bet}>
            Крутить
          </motion.button>
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`mt-2 text-2xl font-bold ${result.win > 0 ? 'text-neon-green' : 'text-neon-pink'} animate-shimmer`}>
                {result.win > 0 ? `Выигрыш: +${result.win} ₴` : 'Не повезло!'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-full mt-6">
          <div className="text-lg font-semibold neon-text mb-2">История последних игр</div>
          <div className="flex gap-2 flex-wrap">
            {history.length === 0 && <span className="text-neon-blue animate-pulse">Нет истории</span>}
            {history.map((h, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.3 }} className={`px-3 py-1 rounded-xl font-mono ${h.win > 0 ? 'bg-neon-green/30 text-neon-green' : 'bg-neon-pink/30 text-neon-pink'} neon-border neon-glow animate-shimmer`}>{h.icons.join(' ')} {h.win > 0 ? `+${h.win}` : ''}</motion.span>
            ))}
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-30 blur-lg mt-8 rounded-full animate-pulse" />
      </motion.div>
    </main>
  )
} 