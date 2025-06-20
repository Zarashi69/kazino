'use client';
import { motion } from 'framer-motion'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const user = useUserStore(s => s.user)
  const users = useUserStore(s => s.users)
  const banUser = useUserStore(s => s.banUser)
  const router = useRouter()

  if (!user || !user.isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a]">
        <div className="neon-border neon-glow bg-[#1a003a]/90 rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="text-2xl font-bold neon-text mb-2">Нет доступа</div>
          <button className="neon-btn px-6 py-2 text-lg font-bold" onClick={() => router.push('/')}>На главную</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a]">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-2xl neon-border neon-glow rounded-3xl bg-[#1a003a]/80 p-8 shadow-2xl">
        <div className="text-3xl font-bold neon-text mb-8 text-center">Админ-панель</div>
        <div className="flex flex-col gap-4">
          {users.map(u => (
            <div key={u.id} className={`flex items-center justify-between px-6 py-4 rounded-2xl neon-border bg-[#0f0026]/70 ${u.isBanned ? 'opacity-50 grayscale' : ''}`}>
              <div>
                <div className="font-bold text-xl neon-text">{u.name}</div>
                <div className="text-neon-blue text-sm">{u.email}</div>
                <div className="text-neon-green text-lg font-mono">{u.balance.toLocaleString()} ₴</div>
                {u.isAdmin && <div className="text-neon-yellow text-xs font-bold mt-1">Админ</div>}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button className={`neon-btn px-4 py-2 font-bold ${u.isBanned ? 'cursor-not-allowed opacity-60' : ''}`} onClick={() => !u.isBanned && banUser(u.id)} disabled={u.isBanned || u.isAdmin}>{u.isBanned ? 'Забанен' : 'Забанить'}</button>
                <button className="text-neon-blue underline text-sm mt-1" onClick={() => router.push('/profile?user=' + u.id)}>Профиль</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  )
} 