import { useEffect, useState, type ReactNode } from 'react'
import type Lenis from 'lenis'
import { useMotion } from './useMotion'
import { LenisCtx } from './useLenis'

/** Lenis solo existe con movimiento encendido. Apagar el switch lo destruye (WCAG 2.2.2). */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const { motionOn, ready } = useMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (!ready || !motionOn) return
    let instance: Lenis | null = null
    let alive = true
    import('lenis').then(({ default: L }) => {
      if (!alive) return
      instance = new L({ autoRaf: true })
      setLenis(instance)
    })
    return () => {
      alive = false
      instance?.destroy()
      setLenis(null)
    }
  }, [ready, motionOn])

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>
}
