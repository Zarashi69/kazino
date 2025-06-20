'use client';
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/stores/user'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ACHIEVEMENTS = [
  { key: 'first_win', label: 'Первая победа', icon: '🎉' },
  { key: 'big_win', label: 'x10+ за раз', icon: '💎' },
  { key: 'lucky', label: 'Удачливый', icon: '🍀' },
  { key: 'crash_rocket', label: 'Ракетчик', icon: '🚀' },
  { key: 'risk_master', label: 'Мастер риска', icon: '🎯' },
  { key: 'slots_jackpot', label: 'Джекпот!', icon: '💰' },
  { key: 'promo_hunter', label: 'Промо-охотник', icon: '🎁' },
  { key: 'top_leader', label: 'Топ-3 лидерборда', icon: '🏆' },
  { key: 'admin', label: 'Админ', icon: '👑' },
  { key: 'infinity', label: 'Бесконечный баланс', icon: '♾️' },
  { key: 'night_owl', label: 'Ночной игрок', icon: '🌙' },
  { key: 'early_bird', label: 'Ранний пташка', icon: '🌅' },
  { key: 'veteran', label: 'Ветеран', icon: '🦾' },
  { key: 'collector', label: 'Коллекционер', icon: '🧲' },
  { key: 'neon_lover', label: 'Неоновый фанат', icon: '⚡' },
]

export default function ProfilePage() {
  const user = useUserStore(s => s.user)
  const login = useUserStore(s => s.login)
  const register = useUserStore(s => s.register)
  const logout = useUserStore(s => s.logout)
  const applyPromo = useUserStore(s => s.applyPromo)
  const setAvatar = useUserStore(s => s.setAvatar)
  const [promo, setPromo] = useState('')
  const [promoResult, setPromoResult] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [adminCode, setAdminCode] = useState('')
  const router = useRouter()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(null)
    if (!email || !password) {
      setAuthError('Введите email и пароль')
      return
    }
    const ok = login(email, password)
    if (!ok) setAuthError('Неверный email или пароль, либо пользователь забанен')
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(null)
    if (!name || !email || !password) {
      setAuthError('Заполните все поля')
      return
    }
    if (role === 'admin' && adminCode !== 'Пидор') {
      setAuthError('Неверный секретный код для админа')
      return
    }
    const ok = register(name, email, password, role)
    if (!ok) setAuthError('Пользователь с таким email уже существует')
  }

  function handlePromo() {
    if (promo.trim()) {
      const ok = applyPromo(promo.trim())
      setPromoResult(ok ? 'Промокод активирован! +1000 ₴' : 'Промокод не найден или уже использован')
      if (ok) setPromo('')
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a]">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-md neon-border neon-glow rounded-3xl bg-[#1a003a]/90 p-8 shadow-2xl flex flex-col items-center gap-6">
          <div className="flex gap-4 mb-4">
            <button className={`neon-btn px-6 py-2 text-lg font-bold ${authMode === 'login' ? 'bg-neon-pink' : ''}`} onClick={() => setAuthMode('login')}>Вход</button>
            <button className={`neon-btn px-6 py-2 text-lg font-bold ${authMode === 'register' ? 'bg-neon-blue' : ''}`} onClick={() => setAuthMode('register')}>Регистрация</button>
          </div>
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none" />
              {authError && <div className="text-neon-pink text-center font-bold">{authError}</div>}
              <button className="neon-btn px-6 py-2 text-lg font-bold mt-2" type="submit">Войти</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Имя" className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none" />
              <select value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')} className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none">
                <option value="user">Пользователь</option>
                <option value="admin">Админ</option>
              </select>
              {role === 'admin' && (
                <input type="text" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Секретный код" className="neon-border rounded-xl px-4 py-2 bg-[#0f0026]/70 text-white outline-none" />
              )}
              {authError && <div className="text-neon-pink text-center font-bold">{authError}</div>}
              <button className="neon-btn px-6 py-2 text-lg font-bold mt-2" type="submit">Зарегистрироваться</button>
            </form>
          )}
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a]">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-xl neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-4 sm:p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="text-4xl sm:text-6xl">{user.avatar || '🦁'}</div>
          <div>
            <div className="text-xl sm:text-2xl font-bold neon-text mb-1">{user.name}</div>
            <div className="text-neon-blue text-base sm:text-lg mb-2">{user.email}</div>
            <div className="text-neon-green text-lg sm:text-xl font-mono">Баланс: {user.balance.toLocaleString('ru-RU')} ₴</div>
          </div>
        </div>
        <div className="mb-6 sm:mb-8">
          <div className="text-base sm:text-lg font-semibold neon-text mb-2">Выбери аватар</div>
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4 max-h-24 sm:max-h-32 overflow-y-auto neon-border neon-glow p-1 sm:p-2 bg-[#0f0026]/60 rounded-xl">
            {['🦁','🐯','🐲','🦊','🐸','🐵','🐼','🦄','🐺','🐻','🐮','🐷','🐰','🐔','🐙','🦖','👽','🤖','💀','👾'].map(a => (
              <button
                key={a}
                className={`text-lg sm:text-2xl md:text-3xl p-0.5 sm:p-1 md:p-2 rounded-xl border-2 ${user.avatar === a ? 'border-neon-pink neon-glow scale-110' : 'border-transparent'} bg-[#0f0026]/70 hover:scale-110 sm:hover:scale-125 transition-all duration-150`}
                onClick={() => setAvatar(a)}
                type="button"
                aria-label={`Выбрать аватар ${a}`}
              >{a}</button>
            ))}
          </div>
        </div>
        <div className="mb-6 sm:mb-8">
          <div className="text-base sm:text-lg font-semibold neon-text mb-2">Ачивки</div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <AnimatePresence>
              {user.achievements.length === 0 && <span className="text-neon-blue animate-pulse">Нет ачивок</span>}
              {user.achievements.map((ach, i) => {
                const meta = ACHIEVEMENTS.find(a => a.label === ach || a.key === ach) || { icon: '✨', label: ach }
                return (
                  <motion.div
                    key={ach + i}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl bg-[#0f0026]/80 neon-border neon-glow text-neon-yellow font-bold text-xs sm:text-base shadow-md flicker animate-shimmer flex items-center gap-1 sm:gap-2"
                  >
                    <span className="text-lg sm:text-xl md:text-2xl drop-shadow-lg">{meta.icon}</span>
                    <span>{meta.label}</span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="mb-6 sm:mb-8">
          <div className="text-base sm:text-lg font-semibold neon-text mb-2">История транзакций</div>
          <div className="max-h-32 sm:max-h-48 overflow-y-auto flex flex-col gap-1 sm:gap-2">
            {user.history.length === 0 && <span className="text-neon-blue animate-pulse">Нет транзакций</span>}
            {user.history.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }} className={`flex justify-between items-center px-2 sm:px-4 py-1 sm:py-2 rounded-xl bg-[#0f0026]/70 neon-border neon-glow shadow-md ${tx.type === 'win' ? 'text-neon-green' : tx.type === 'lose' ? 'text-neon-pink' : 'text-neon-yellow'} animate-shimmer text-xs sm:text-base`}> 
                <span className="truncate max-w-[60px] sm:max-w-[120px]">{tx.desc}</span>
                <span>{tx.amount > 0 ? '+' : ''}{tx.amount} ₴</span>
                <span className="text-xs text-neon-blue">{tx.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mb-4 sm:mb-6">
          <div className="text-base sm:text-lg font-semibold neon-text mb-2">Промокод</div>
          <div className="flex gap-1 sm:gap-2 flex-col sm:flex-row">
            <input type="text" value={promo} onChange={e => setPromo(e.target.value)} placeholder="Введите промокод" className="neon-border rounded-xl px-2 sm:px-4 py-1 sm:py-2 bg-[#0f0026]/70 text-white outline-none text-xs sm:text-base" />
            <button className="neon-btn px-2 sm:px-4 py-1 sm:py-2 font-bold text-xs sm:text-base" onClick={handlePromo}>Активировать</button>
          </div>
          {promoResult && <div className={`mt-2 text-center text-xs sm:text-lg font-bold ${promoResult.includes('активирован') ? 'text-neon-green' : 'text-neon-pink'}`}>{promoResult}</div>}
        </div>
        <button className="neon-btn w-full py-2 sm:py-3 text-xs sm:text-lg font-bold mt-2 sm:mt-4" onClick={() => { logout(); router.push('/') }}>Выйти</button>
        <button className="neon-btn w-full py-2 sm:py-3 text-xs sm:text-lg font-bold mt-2 sm:mt-4 animate-pulse" onClick={() => router.push('/')}>На главную</button>
      </motion.div>
    </main>
  )
} 