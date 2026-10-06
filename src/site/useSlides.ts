import { useEffect, type RefObject } from 'react'

/**
 * Titulares que se deslizan en horizontal con el scroll. Solo transform.
 * Cada [data-slide="n"] se mueve n vw entre que su padre entra y sale de la pantalla,
 * y pasa por su posición compuesta (0) justo al cruzar el centro.
 */
export function useSlides(root: RefObject<HTMLElement | null>, on: boolean, dep: unknown) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-slide]'))
    if (!on) {
      items.forEach((it) => { it.style.transform = '' })
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      for (const it of items) {
        const host = it.parentElement
        if (!host) continue
        const r = host.getBoundingClientRect()
        if (r.bottom < -80 || r.top > vh + 80) continue
        const pr = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        const k = Number(it.dataset.slide) || 0
        // 'in': llega deslizando y queda en su sitio al cruzar el centro (retícula quieta arriba).
        const v = it.dataset.slideMode === 'in' ? Math.max(0, Math.min(1, pr)) : Math.max(-1, Math.min(1, pr))
        it.style.transform = `translate3d(${(v * k).toFixed(3)}vw,0,0)`
      }
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    update()
    return () => {
      window.removeEventListener('scroll', req)
      window.removeEventListener('resize', req)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [root, on, dep])
}
