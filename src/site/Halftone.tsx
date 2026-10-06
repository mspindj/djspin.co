import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Locale, Photo } from '../content'
import { hasPlayed, markPlayed, useMotion } from '../shared/useMotion'

type Props = {
  /** Clave estable: registra que la entrada de tinta ya corrió. */
  id: string
  photo: Photo
  locale: Locale
  /** Color de la tinta. El lienzo es transparente: se ve el color de la sección. */
  ink: string
  /** 'dark': la tinta pinta las sombras (lienzo claro). 'light': pinta las luces (lienzo oscuro). */
  mode?: 'dark' | 'light'
  /** Paso de la trama en px CSS. */
  cell?: number
  /** Ángulo de la trama en grados. */
  angle?: number
  /** Niveles: por debajo de `lo` no hay punto, por encima de `hi` el punto es pleno. */
  lo?: number
  hi?: number
  gamma?: number
  /** Estira la luminancia entre los percentiles 2 y 98 de la foto antes de aplicar los niveles.
   *  Para fotos de club casi negras, donde la escena vive en las sombras y sin esto solo se imprime el humo. */
  auto?: boolean
  /** Fuente alterna SOLO para muestrear la trama: la misma foto en gris con contraste local
   *  (public/img/tone). El <img> visible y su alt siguen siendo la foto original. */
  tone?: string
  /** Radio máximo del punto como fracción de la celda. 0.72 (por defecto) engorda la tinta: bien
   *  para retratos. 0.56 es cobertura lineal (el punto pleno apenas toca al vecino): necesario en
   *  fotos con mucho medio tono, que con 0.72 se empastan y solo dejan ver las luces más altas. */
  dot?: number
  /** Punto de interés del recorte, 0 a 1. */
  focus?: [number, number]
  zoom?: number
  /** Viñeta de trama: fracción del ancho o alto en la que el punto se adelgaza hasta desaparecer. */
  fadeL?: number
  fadeR?: number
  fadeT?: number
  fadeB?: number
  eager?: boolean
  className?: string
}

const TAU = Math.PI * 2
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const ramp = (v: number) => { const k = clamp(v, 0, 1); return k * k * (3 - 2 * k) }

/**
 * Foto en trama de semitono, canvas 2D. Debajo queda el <img> real con su alt: es lo que se ve
 * sin JS o si el canvas falla. Se dibuja una vez y solo se redibuja con el puntero (los puntos
 * crecen cerca) y al cambiar de tamaño. Fuera de pantalla no corre nada.
 */
export default function Halftone({
  id, photo, locale, ink, mode = 'dark', cell = 7, angle = 45, lo = 0.1, hi = 0.9, gamma = 1, auto = false, tone, dot = 0.72,
  focus = [0.5, 0.5], zoom = 1, fadeL = 0, fadeR = 0, fadeT = 0, fadeB = 0, eager = false, className,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inked, setInked] = useState(false)
  const { motionOn, ready } = useMotion()
  const motionRef = useRef(motionOn)
  useEffect(() => { motionRef.current = motionOn }, [motionOn])
  const [fx, fy] = focus

  useEffect(() => {
    if (!ready) return
    const host = wrap.current, img = imgRef.current, canvas = canvasRef.current
    if (!host || !img || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // De dónde se lee la luminancia: la foto visible o su versión de tono.
    const sampler: HTMLImageElement = tone ? new Image() : img
    const samplerReady = () => sampler.complete && sampler.naturalWidth > 0

    let dots = new Float32Array(0) // x, y, cobertura (0..1)
    let w = 0, h = 0, dpr = 1
    let visible = false, built = false, dead = false
    let raf = 0, resizeTimer = 0
    // Puntero suavizado: posición actual y destino, y fuerza del efecto (0..1).
    const p = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 }
    const key = `pc-ht-${id}`
    let grow = 1
    let growStart = 0

    const build = () => {
      const rect = host.getBoundingClientRect()
      w = Math.round(rect.width); h = Math.round(rect.height)
      if (w < 8 || h < 8 || !samplerReady()) return false
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)

      // Recorte tipo cover alrededor del punto de interés.
      const pw = sampler.naturalWidth, ph = sampler.naturalHeight
      const scale = Math.max(w / pw, h / ph) * zoom
      const sw = w / scale, sh = h / scale
      const sx = clamp(fx * pw - sw / 2, 0, pw - sw)
      const sy = clamp(fy * ph - sh / 2, 0, ph - sh)

      // Muestra de luminancia a baja resolución (dos muestras por celda).
      const mw = Math.max(2, Math.ceil((w / cell) * 2)), mh = Math.max(2, Math.ceil((h / cell) * 2))
      const off = document.createElement('canvas')
      off.width = mw; off.height = mh
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return false
      octx.imageSmoothingQuality = 'high'
      octx.drawImage(sampler, sx, sy, sw, sh, 0, 0, mw, mh)
      const data = octx.getImageData(0, 0, mw, mh).data

      // Niveles automáticos: percentiles 2 y 98 de la luminancia del recorte.
      let p2 = 0, span = 1
      if (auto) {
        const hist = new Uint32Array(256)
        const n = mw * mh
        for (let i = 0; i < n * 4; i += 4) hist[Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])]++
        let acc = 0, a2 = 0, a98 = 255
        for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= n * 0.02) { a2 = v; break } }
        acc = 0
        for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc >= n * 0.02) { a98 = v; break } }
        if (a98 - a2 > 24) { p2 = a2 / 255; span = (a98 - a2) / 255 }
      }

      const a = (angle * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a)
      const cx = w / 2, cy = h / 2, D = Math.hypot(w, h) / 2 + cell
      const out: number[] = []
      for (let u = -D; u <= D; u += cell) {
        for (let v = -D; v <= D; v += cell) {
          const x = cx + u * cos - v * sin, y = cy + u * sin + v * cos
          if (x < -cell || x > w + cell || y < -cell || y > h + cell) continue
          const mx = clamp(Math.round((x / w) * (mw - 1)), 0, mw - 1)
          const my = clamp(Math.round((y / h) * (mh - 1)), 0, mh - 1)
          const i = (my * mw + mx) * 4
          const raw = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
          const lum = clamp((raw - p2) / span, 0, 1)
          const d = mode === 'dark' ? 1 - lum : lum
          let t = Math.pow(clamp((d - lo) / (hi - lo), 0, 1), gamma)
          if (fadeL) t *= ramp(x / (w * fadeL))
          if (fadeR) t *= ramp((w - x) / (w * fadeR))
          if (fadeT) t *= ramp(y / (h * fadeT))
          if (fadeB) t *= ramp((h - y) / (h * fadeB))
          out.push(x, y, t)
        }
      }
      dots = new Float32Array(out)
      built = true
      return true
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = ink
      ctx.beginPath()
      const rmax = cell * dot, cap = cell * 0.8
      const R = Math.max(110, Math.min(w, h) * 0.3), R2 = R * R
      const s = p.s
      for (let i = 0; i < dots.length; i += 3) {
        const x = dots[i], y = dots[i + 1]
        let r = rmax * Math.sqrt(dots[i + 2]) * grow
        if (s > 0.002) {
          const dx = x - p.x, dy = y - p.y, d2 = dx * dx + dy * dy
          if (d2 < R2) {
            let f = 1 - Math.sqrt(d2) / R
            f = f * f * (3 - 2 * f)
            r = r * (1 + 0.9 * f * s) + f * s * cell * 0.26
          }
        }
        if (r > cap) r = cap
        if (r < 0.3) continue
        ctx.moveTo(x + r, y)
        ctx.arc(x, y, r, 0, TAU)
      }
      ctx.fill()
    }

    const tick = (now: number) => {
      raf = 0
      if (dead || !visible || !built) return
      let more = false
      if (grow < 1) {
        const k = clamp((now - growStart) / 700, 0, 1)
        grow = 1 - Math.pow(1 - k, 3)
        more = k < 1
      }
      p.x += (p.tx - p.x) * 0.22; p.y += (p.ty - p.y) * 0.22
      p.s += (p.ts - p.s) * 0.14
      if (Math.abs(p.ts - p.s) > 0.004 || Math.abs(p.tx - p.x) > 0.3 || Math.abs(p.ty - p.y) > 0.3) more = true
      else p.s = p.ts
      draw()
      if (more) raf = requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf && visible && built && !dead) raf = requestAnimationFrame(tick) }

    const first = () => {
      if (built || dead || !visible) return
      try {
        if (!build()) return
        if (motionRef.current && !hasPlayed(key)) { grow = 0; growStart = performance.now() }
        markPlayed(key)
        draw()
        setInked(true)
        kick()
      } catch {
        built = false // el <img> queda a la vista
      }
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) { if (built) kick(); else if (samplerReady()) first() }
      else if (raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { rootMargin: '120px 0px' })
    io.observe(host)

    const onLoad = () => first()
    sampler.addEventListener('load', onLoad)
    if (tone) sampler.src = tone

    const ro = new ResizeObserver(() => {
      if (!built) return
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        const r = host.getBoundingClientRect()
        if (Math.round(r.width) === w && Math.round(r.height) === h) return
        try { if (build()) { grow = 1; draw() } } catch { /* se conserva el último frame */ }
      }, 140)
    })
    ro.observe(host)

    const at = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      p.tx = e.clientX - r.left; p.ty = e.clientY - r.top
    }
    const onMove = (e: PointerEvent) => {
      if (!motionRef.current) return
      at(e)
      if (p.ts === 0 && p.s < 0.01) { p.x = p.tx; p.y = p.ty }
      p.ts = 1
      kick()
    }
    const onLeave = () => { p.ts = 0; kick() }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerdown', onMove)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointercancel', onLeave)
    const onUp = (e: PointerEvent) => { if (e.pointerType !== 'mouse') onLeave() }
    host.addEventListener('pointerup', onUp)

    return () => {
      host.removeEventListener('pointerup', onUp)
      dead = true
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      io.disconnect(); ro.disconnect()
      sampler.removeEventListener('load', onLoad)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerdown', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointercancel', onLeave)
    }
  }, [ready, id, ink, mode, cell, angle, lo, hi, gamma, auto, tone, dot, fx, fy, zoom, fadeL, fadeR, fadeT, fadeB])

  // Con el movimiento apagado el canvas queda en su frame estático: se suelta el puntero.
  useEffect(() => {
    if (!motionOn) wrap.current?.dispatchEvent(new Event('pointercancel'))
  }, [motionOn])

  return (
    <div
      ref={wrap}
      className={`pc-ht pc-ht--${mode}${inked ? ' is-inked' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--fx': `${fx * 100}%`, '--fy': `${fy * 100}%` } as CSSProperties}
    >
      <img
        ref={imgRef}
        src={photo.src}
        width={photo.w}
        height={photo.h}
        alt={photo.alt[locale]}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
