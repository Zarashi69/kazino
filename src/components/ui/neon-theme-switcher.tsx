'use client'
import { useEffect, useState } from 'react'
import { create } from 'zustand'

const themes = [
  { key: 'blue', label: 'Синий', color: 'var(--neon-blue)' },
  { key: 'purple', label: 'Фиолетовый', color: 'var(--neon-purple)' },
  { key: 'green', label: 'Зелёный', color: 'var(--neon-green)' },
]

type ThemeKey = 'blue' | 'purple' | 'green'

interface ThemeState {
  theme: ThemeKey
  setTheme: (theme: ThemeKey) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'blue',
  setTheme: (theme) => {
    set({ theme })
    if (typeof window !== 'undefined') localStorage.setItem('neon-theme', theme)
    document.documentElement.setAttribute('data-neon-theme', theme)
  },
}))

export default function NeonThemeSwitcher() {
  const { theme, setTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('neon-theme') as ThemeKey
    if (stored) setTheme(stored)
    setMounted(true)
  }, [setTheme])

  if (!mounted) return null

  return (
    <div className="flex gap-2 items-center">
      {themes.map(t => (
        <button
          key={t.key}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${theme === t.key ? 'border-neon-pink scale-110 neon-glow' : 'border-neon-blue'} `}
          style={{ background: t.color, boxShadow: theme === t.key ? '0 0 16px ' + t.color : undefined }}
          onClick={() => setTheme(t.key as ThemeKey)}
          aria-label={`Сменить неоновую тему на ${t.label}`}
        />
      ))}
    </div>
  )
} 