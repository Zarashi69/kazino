import { useState } from 'react'
import { motion } from 'framer-motion'

const faqs = [
  { q: 'Как начать играть?', a: 'Зарегистрируйтесь, получите бонус и выбирайте любую игру!' },
  { q: 'Как получить бонус?', a: 'Бонус 100 грн начисляется при регистрации. Введите промокод "Даня" для +1000 грн.' },
  { q: 'Как работает crash-игра?', a: 'Ставите сумму, ждёте роста коэффициента и забираете выигрыш до взрыва.' },
  { q: 'Что такое риск-игра?', a: 'Угадываете, где больше — удваиваете баланс или теряете ставку.' },
  { q: 'Как попасть в лидерборд?', a: 'Наберите максимальный баланс, играя в любые игры.' },
  { q: 'Как работает админ-панель?', a: 'Только для админов: бан пользователей, просмотр профилей.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="relative z-10 py-8 sm:py-16 md:py-24 flex flex-col items-center">
      <h2 className="neon-text text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-10 text-center">FAQ</h2>
      <div className="w-full max-w-md sm:max-w-2xl flex flex-col gap-2 sm:gap-4">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="relative neon-border neon-glow rounded-2xl bg-[#1a003a]/80 shadow-lg overflow-hidden group"
          >
            <button
              className="w-full text-left px-6 py-4 text-xl font-bold neon-text flex items-center justify-between focus:outline-none group-hover:underline"
              onClick={() => setOpen(open === i ? null : i)}
              title={open === i ? '' : 'Показать ответ'}
            >
              <span>{f.q}</span>
              <span className="ml-4 text-neon-blue text-2xl group-hover:scale-125 transition-transform">{open === i ? '−' : '+'}</span>
            </button>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="px-6 pb-4 text-neon-green text-lg overflow-hidden"
            >
              {open === i && <span>{f.a}</span>}
            </motion.div>
            <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-30 blur-sm animate-pulse" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
