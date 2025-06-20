import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TransactionType = 'win' | 'lose' | 'bonus' | 'promo' | 'admin' | 'other'

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  date: string
  desc: string
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  balance: number
  history: Transaction[]
  isBanned: boolean
  isAdmin: boolean
  achievements: string[]
  avatar?: string
}

interface UserState {
  user: User | null
  users: User[]
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string, role?: 'user' | 'admin') => boolean
  logout: () => void
  addTransaction: (tx: Transaction) => void
  applyPromo: (code: string) => boolean
  banUser: (userId: string) => void
  updateBalance: (amount: number, desc: string, type: TransactionType) => void
  isPromoUsed: (code: string) => boolean
  setAvatar: (avatar: string) => void
}

const PROMO_CODES: Record<string, number> = {
  'Даня': 1000,
  'Нияз гей': 10000,
  'Лего': 100000,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        {
          id: '1',
          name: 'Даня',
          email: 'danya@casino.com',
          password: '1234',
          balance: 100000,
          history: [],
          isBanned: false,
          isAdmin: true,
          achievements: ['Создатель казино'],
          avatar: '🦁',
        },
      ],
      login: (email, password) => {
        const found = get().users.find(u => u.email === email && u.password === password)
        if (found && !found.isBanned) {
          set({ user: found })
          return true
        }
        return false
      },
      register: (name, email, password, role = 'user') => {
        if (get().users.some(u => u.email === email)) return false
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password,
          balance: 100,
          history: [{ id: crypto.randomUUID(), type: 'bonus' as TransactionType, amount: 100, date: new Date().toISOString(), desc: 'Бонус за регистрацию' }],
          isBanned: false,
          isAdmin: role === 'admin',
          achievements: ['Первый вход'],
          avatar: '🦁',
        }
        set(state => ({ users: [...state.users, newUser], user: newUser }))
        return true
      },
      logout: () => set({ user: null }),
      addTransaction: (tx) => {
        set(state => {
          if (!state.user) return {}
          const updated = { ...state.user, history: [{ ...tx, type: tx.type as TransactionType }, ...state.user.history] }
          return { user: updated, users: state.users.map(u => u.id === updated.id ? updated : u) }
        })
      },
      updateBalance: (amount, desc, type) => {
        set(state => {
          if (!state.user) return {}
          const updated = {
            ...state.user,
            balance: state.user.balance + amount,
            history: [{ id: crypto.randomUUID(), type, amount, date: new Date().toISOString(), desc }, ...state.user.history],
          }
          return { user: updated, users: state.users.map(u => u.id === updated.id ? updated : u) }
        })
      },
      applyPromo: (code) => {
        if (!PROMO_CODES[code]) return false
        set(state => {
          if (!state.user) return {}
          const updated = {
            ...state.user,
            balance: state.user.balance + PROMO_CODES[code],
            history: [{ id: crypto.randomUUID(), type: 'promo' as TransactionType, amount: PROMO_CODES[code], date: new Date().toISOString(), desc: `Промокод ${code}` }, ...state.user.history],
            achievements: [...state.user.achievements, `Промокод ${code}`],
          }
          return { user: updated, users: state.users.map(u => u.id === updated.id ? updated : u) }
        })
        return true
      },
      isPromoUsed: (code) => {
        const u = get().user
        return !!u?.history.find(tx => tx.type === 'promo' && tx.desc.includes(code))
      },
      banUser: (userId) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, isBanned: true } : u),
          user: state.user?.id === userId ? { ...state.user, isBanned: true } : state.user,
        }))
      },
      setAvatar: (avatar) => {
        set(state => {
          if (!state.user) return {}
          const updated = { ...state.user, avatar }
          return { user: updated, users: state.users.map(u => u.id === updated.id ? updated : u) }
        })
      },
    }),
    { name: 'casino-user-store' }
  )
) 