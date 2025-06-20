import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PromoState {
  codes: { [code: string]: number }
  activate: (code: string) => number | null
}

export const usePromoStore = create<PromoState>()(
  persist(
    (set, get) => ({
      codes: { 'Даня': 1000 },
      activate: (code) => {
        if (get().codes[code]) {
          return get().codes[code]
        }
        return null
      },
    }),
    { name: 'casino-promo-store' }
  )
) 