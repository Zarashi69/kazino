'use client'
import { useUserStore } from '@/stores/user'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NeonThemeSwitcher from './ui/neon-theme-switcher'

export default function HeaderBar() {
  const user = useUserStore(s => s.user)
  const applyPromo = useUserStore(s => s.applyPromo)
  const router = useRouter()
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo] = useState('')
  const [promoResult, setPromoResult] = useState<string | null>(null)

  function handlePromo() {
    if (promo.trim()) {
      const ok = applyPromo(promo.trim())
      setPromoResult(ok ? 'Промокод активирован! +1000 ₴' : 'Промокод не найден или уже использован')
      if (ok) setPromo('')
    }
  }

  return (
    <header className="sticky top-0 left-0 w-full z-50 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-2 sm:py-3 bg-[#0f0026]/80 backdrop-blur-md neon-border neon-glow shadow-lg gap-1 sm:gap-0 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0" onClick={() => router.push('/') }>
        <span className="text-xl sm:text-2xl neon-text">🎲</span>
        <span className="font-bold text-base sm:text-xl md:text-2xl neon-text flicker truncate">Казино Даниила</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto w-full sm:w-auto py-1 sm:py-0 min-w-0 justify-center sm:justify-end">
        <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg md:text-xl min-w-0">
          <span className="text-neon-blue">Баланс:</span>
          <span className="text-neon-green font-mono font-bold truncate">{user ? user.balance.toLocaleString() : '—'} ₴</span>
        </div>
        <button className="neon-btn px-3 sm:px-5 py-1 sm:py-2 text-sm sm:text-lg font-bold" onClick={() => router.push('/play/crash')}>Старт</button>
        <button className="neon-btn px-3 sm:px-5 py-1 sm:py-2 text-sm sm:text-lg font-bold" onClick={() => router.push('/profile')}>Профиль</button>
        <button className="neon-btn px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg font-bold flex items-center gap-1 sm:gap-2" onClick={() => setPromoOpen(true)} title="Промокод">
          <span className="text-lg sm:text-xl">🎁</span>
        </button>
        <NeonThemeSwitcher />
      </div>
      <AnimatePresence>
        {promoOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="neon-border neon-glow bg-[#1a003a]/95 rounded-3xl p-8 flex flex-col items-center gap-4 min-w-[320px] max-w-xs">
              <div className="text-2xl font-bold neon-text mb-2">Промокод</div>
              <input value={promo} onChange={e => setPromo(e.target.value)} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none w-full text-center text-lg" placeholder="Введите промокод" />
              <button className="neon-btn px-6 py-2 text-lg font-bold w-full" onClick={handlePromo}>Активировать</button>
              {promoResult && <div className={`mt-2 text-center text-lg font-bold ${promoResult.includes('активирован') ? 'text-neon-green' : 'text-neon-pink'}`}>{promoResult}</div>}
              <button className="text-neon-blue underline mt-2" onClick={() => { setPromoOpen(false); setPromoResult(null); }}>Закрыть</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 