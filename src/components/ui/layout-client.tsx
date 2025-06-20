'use client'
import HeaderBar from '@/components/header-bar'
import NeonParticles from '@/components/ui/neon-particles'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderBar />
      <NeonParticles />
      {children}
      <div id="portal-root" />
    </>
  )
} 