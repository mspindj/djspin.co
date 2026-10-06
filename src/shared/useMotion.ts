import { createContext, useContext } from 'react'

export type MotionState = {
  /** El sistema pide menos movimiento (prefers-reduced-motion). */
  reduced: boolean
  /** Preferencia de la persona desde el switch de movimiento. */
  userOn: boolean
  setUserOn: (on: boolean) => void
  /** Lo único que deben mirar los componentes: !reduced && userOn. */
  motionOn: boolean
  /** Siempre true en el sitio (solo cliente). Se conserva porque los componentes lo consultan. */
  ready: boolean
}

export const MotionCtx = createContext<MotionState>({ reduced: false, userOn: true, setUserOn: () => {}, motionOn: true, ready: true })
export const useMotion = () => useContext(MotionCtx)

/**
 * Registro de animaciones de UNA sola vez que ya corrieron. Al apagar y volver a encender el
 * movimiento NADA se repite. Cada elemento guarda su propio estado final, nunca una clase genérica.
 */
const played = new Set<string>()
export const hasPlayed = (key: string) => played.has(key)
export const markPlayed = (key: string) => void played.add(key)
