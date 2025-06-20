import { motion } from 'framer-motion'

export default function NeonBanner() {
  return (
    <section className="relative flex flex-col items-center justify-center py-8 sm:py-16 md:py-24 px-2 sm:px-8 select-none animate-shimmer">
      {/* Неоновый светящийся фон с дополнительными SVG-элементами */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <svg width="100%" height="100%" className="blur-2xl opacity-60 animate-pulse" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff00cc" stopOpacity="1" />
              <stop offset="100%" stopColor="#1a003a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="neonBlue" cx="80%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#00eaff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1a003a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="neonGreen" cx="20%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#39ff14" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1a003a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bannerNeonLine" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#ff00cc" />
              <stop offset="100%" stopColor="#00eaff" />
            </linearGradient>
          </defs>
          <circle cx="50%" cy="50%" r="60%" fill="url(#neonGlow)" />
          <circle cx="80%" cy="20%" r="30%" fill="url(#neonBlue)" />
          <circle cx="20%" cy="80%" r="25%" fill="url(#neonGreen)" />
          <rect x="10%" y="90%" width="80%" height="3" fill="url(#bannerNeonLine)" opacity="0.18" />
        </svg>
        {/* Анимированные неоновые частицы через motion.div */}
        <motion.div
          className="absolute"
          initial={{ y: 0 }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'loop' }}
          style={{ left: '10%', top: '15%', position: 'absolute' }}
        >
          <svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="#ff00cc" opacity="0.7" /></svg>
        </motion.div>
        <motion.div
          className="absolute"
          initial={{ y: 0 }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop' }}
          style={{ left: '90%', top: '80%', position: 'absolute' }}
        >
          <svg width="12" height="12"><circle cx="6" cy="6" r="6" fill="#00eaff" opacity="0.6" /></svg>
        </motion.div>
        <motion.div
          className="absolute"
          initial={{ y: 0 }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
          style={{ left: '50%', top: '10%', position: 'absolute' }}
        >
          <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="#fff700" opacity="0.5" /></svg>
        </motion.div>
        {/* 3D-эффект: неоновый диск с perspective */}
        <svg width="100%" height="100%" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ filter: 'blur(2px)', transform: 'perspective(400px) rotateX(30deg)' }}>
          <ellipse cx="50%" cy="60%" rx="180" ry="30" fill="#00eaff" opacity="0.12" />
          <ellipse cx="50%" cy="70%" rx="120" ry="18" fill="#ff00cc" opacity="0.09" />
        </svg>
      </div>
      <motion.h1
        className="neon-text text-2xl sm:text-4xl md:text-7xl font-extrabold text-center drop-shadow-lg flicker z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Казино Даниила
      </motion.h1>
      <motion.p
        className="text-base sm:text-xl md:text-3xl text-neon-blue mt-2 sm:mt-6 mb-4 sm:mb-10 text-center z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Почувствуй азарт! Неон, 3D, анимации, призы и топовые игры
      </motion.p>
      <motion.button
        className="neon-btn px-6 sm:px-10 py-2 sm:py-4 text-lg sm:text-2xl font-bold uppercase shadow-lg z-10 group"
        whileHover={{ scale: 1.08, rotate: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
        title="Скроллить к играм"
      >
        Играть сейчас
        <span className="ml-2 text-neon-green text-base sm:text-lg animate-pulse group-hover:scale-125 transition-transform">↓</span>
      </motion.button>
      <div className="absolute left-0 bottom-0 w-full h-1 sm:h-2 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-30 blur-lg animate-pulse" />
    </section>
  )
}
