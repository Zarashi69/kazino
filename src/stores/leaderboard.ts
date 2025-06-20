import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './user'

interface LeaderboardState {
  top: User[]
  update: (users: User[]) => void
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      top: [],
      update: (users) => {
        set({ top: [...users].sort((a, b) => b.balance - a.balance).slice(0, 10) })
      },
    }),
    { name: 'casino-leaderboard-store' }
  )
) 