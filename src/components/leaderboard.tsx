"use client"
import { useUserStore } from '@/stores/user'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

const medals = ['🥇', '🥈', '🥉']
const defaultAvatar = '🦁'
const achIcons = [
  '💎', '🔥', '🎯', '👑', '🚀', '💰', '🎲', '🏆', '🧲', '🦄', '🌈', '⚡', '🎉', '🧨', '🕹️', '🧊', '🦾', '🧠', '🦸', '🧙',
]

export default function Leaderboard() {
  const users = useUserStore(state => state.users)
  // Только незабаненные, отсортированные по балансу, топ-10
  const leaders = useMemo(() =>
    users
      .filter(u => !u.isBanned)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10)
  , [users])

  if (!users.length) {
    return (
      <section className="relative z-10 py-8 sm:py-16 md:py-24 flex flex-col items-center">
        <div className="w-full max-w-md sm:max-w-2xl mx-auto flex flex-col gap-2 sm:gap-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 sm:h-20 rounded-2xl bg-[#1a003a]/60 neon-border neon-glow mb-1 sm:mb-2 shimmer" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-10 py-8 sm:py-16 md:py-24 flex flex-col items-center">
      <h2 className="neon-text text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-10 text-center drop-shadow-lg flicker">Лидерборд</h2>
      <ul className="w-full max-w-md sm:max-w-2xl mx-auto flex flex-col gap-2 sm:gap-6">
        {leaders.map((user, i) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className={`flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-6 py-2 sm:py-4 rounded-2xl neon-border neon-glow bg-[#1a003a]/80 shadow-lg relative overflow-hidden ${i < 3 ? 'flicker' : ''} animate-shimmer min-w-0`}
          >
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap min-w-0">
              <span className={`text-2xl sm:text-3xl md:text-4xl rounded-full p-0.5 sm:p-1 ${i === 0 ? 'bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400 neon-glow' : i === 1 ? 'bg-gradient-to-br from-gray-300 via-blue-300 to-purple-300 neon-glow' : i === 2 ? 'bg-gradient-to-br from-yellow-200 via-green-300 to-blue-200 neon-glow' : ''}`}>{user.avatar || defaultAvatar}</span>
              <span className="text-base sm:text-xl md:text-2xl font-bold neon-text truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px]">{user.name}</span>
              {i < 3 && <span className="text-xl sm:text-2xl ml-1 sm:ml-2 animate-pulse drop-shadow-[0_0_8px_#fff700]">{medals[i]}</span>}
              {user.achievements.map((ach, j) => (
                <span key={j} className="ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-[#fff700]/20 text-neon-yellow font-bold text-[10px] sm:text-xs neon-border neon-glow animate-pulse flex items-center gap-0.5 sm:gap-1">
                  {achIcons[j % achIcons.length]} {ach}
                </span>
              ))}
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-mono text-neon-green mt-1 sm:mt-0 whitespace-nowrap">{user.balance.toLocaleString('ru-RU')} ₴</span>
            {i < 3 && <div className={`absolute right-0 top-0 px-2 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-lg font-bold ${i === 0 ? 'bg-neon-yellow text-black' : i === 1 ? 'bg-neon-blue text-white' : 'bg-neon-pink text-white'} rounded-bl-2xl neon-glow animate-pulse`}>Топ-{i+1}</div>}
            <div className="absolute left-0 bottom-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-30 blur-lg animate-pulse" />
          </motion.li>
        ))}
      </ul>
      <div className="w-full max-w-md sm:max-w-2xl h-1 sm:h-2 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-40 blur-lg mt-4 sm:mt-10 rounded-full animate-pulse" />
      <AnimatePresence>
        {/* Здесь можно добавить popup, если текущий пользователь попал в топ-3 */}
      </AnimatePresence>
    </section>
  )
}
