"use client";

import React from 'react';
import NeonBanner from '@/components/neon-banner'
import GameSection from '@/components/game-section'
import Leaderboard from '@/components/leaderboard'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0026] via-[#1a003a] to-[#0a001a] relative overflow-x-hidden">
      <NeonBanner />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
        <GameSection />
        <Leaderboard />
        <FAQ />
        <Footer />
      </motion.div>
      {/* Эффекты частиц, неоновые линии и т.д. будут добавлены глобально */}
    </main>
  )
}
