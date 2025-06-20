'use client'
import { useEffect, useState } from 'react'
import { Particles, initParticlesEngine } from '@tsparticles/react'
import { loadFull } from 'tsparticles'

export default function NeonParticles() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine)
    }).then(() => setInit(true))
  }, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          color: { value: ['#ff00cc', '#00eaff', '#39ff14', '#fff700', '#a259ff'] },
          shape: { type: 'circle' },
          opacity: { value: 0.25 },
          size: { value: 3 },
          move: { enable: true, speed: 1.2, direction: 'none', random: true, straight: false, outModes: { default: 'out' } },
          shadow: { enable: true, color: '#ff00cc', blur: 8 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
          modes: { repulse: { distance: 80, duration: 0.4 } },
        },
        detectRetina: true,
      }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
} 