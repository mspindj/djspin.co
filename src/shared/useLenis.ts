import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export const LenisCtx = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisCtx)
