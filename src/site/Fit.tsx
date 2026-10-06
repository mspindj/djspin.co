import { useLayoutEffect, useRef, type ReactNode } from 'react'

/**
 * Línea de cartel ajustada al ancho exacto de su columna. El tamaño de CSS es el de reserva
 * (sin JS se ve casi igual); aquí se mide y se afina. Tamaño de fuente, una vez y al cambiar el ancho:
 * no está atado al scroll.
 */
export default function Fit({ children, className, max = 2000 }: { children: ReactNode; className?: string; max?: number }) {
  const outer = useRef<HTMLSpanElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const o = outer.current, i = inner.current
    if (!o || !i) return
    let last = 0
    const fit = () => {
      const cw = o.clientWidth
      if (!cw) return // oculto por media query
      const fs = parseFloat(getComputedStyle(o).fontSize)
      const iw = i.getBoundingClientRect().width
      if (!iw || !fs) return
      const next = Math.min(max, Math.floor(((cw / (iw / fs)) * 100)) / 100)
      if (Math.abs(next - last) < 0.25 && Math.abs(next - fs) < 0.25) return
      last = next
      o.style.fontSize = `${next}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(o)
    let alive = true
    document.fonts?.ready.then(() => { if (alive) fit() })
    return () => { alive = false; ro.disconnect() }
  }, [children, max])

  return (
    <span ref={outer} className={`pc-fit${className ? ` ${className}` : ''}`}>
      <span ref={inner} className="pc-fit__in">{children}</span>
    </span>
  )
}
