import { useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onScroll = () => {
      if (bgRef.current) {
        const scroll = window.scrollY
        bgRef.current.style.transform = `translateY(${scroll * 0.3}px) scale(1.1)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: 'url(/images/spin-hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          willChange: 'transform',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/50 to-bg-primary" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="mb-6 animate-[fadeUp_1s_ease-out_0.2s_both]">
          <img
            src="/images/spin-logo.png"
            alt="Spin"
            className="h-28 md:h-40 w-auto mx-auto"
          />
        </h1>

        <p className="text-lg md:text-xl tracking-[0.2em] uppercase text-text-secondary font-light mb-3 animate-[fadeUp_1s_ease-out_0.4s_both]">
          {t.hero.tagline}
        </p>

        <p className="text-base md:text-lg text-text-muted mb-12 animate-[fadeUp_1s_ease-out_0.6s_both]">
          {t.hero.subtitle}
        </p>

        <div className="flex items-center justify-center gap-4 animate-[fadeUp_1s_ease-out_0.8s_both]">
          <button
            onClick={() => scrollTo('#music')}
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 glow-hover"
          >
            {t.hero.cta_listen}
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="px-8 py-3 border border-text-muted text-text-secondary hover:text-text-primary hover:border-text-primary text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300"
          >
            {t.hero.cta_bookings}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </div>
    </section>
  )
}
