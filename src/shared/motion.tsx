import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MotionCtx } from './useMotion'

const KEY = 'spin-motion'
const QUERY = '(prefers-reduced-motion: reduce)'

const readUserOn = () => {
  try { return sessionStorage.getItem(KEY) !== 'off' } catch { return true }
}

/** Las dos preferencias se leen al montar, sin esperar un efecto. En el prerender (sin window) el movimiento queda encendido. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  const [userOn, setUserOnState] = useState(readUserOn)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const setUserOn = useCallback((on: boolean) => {
    setUserOnState(on)
    try { sessionStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* sin almacenamiento */ }
  }, [])

  const motionOn = !reduced && userOn

  // Gancho para CSS: [data-motion="off"] apaga transiciones no esenciales.
  useEffect(() => { document.documentElement.dataset.motion = motionOn ? 'on' : 'off' }, [motionOn])

  const value = useMemo(() => ({ reduced, userOn, setUserOn, motionOn, ready: true }), [reduced, userOn, setUserOn, motionOn])
  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>
}
