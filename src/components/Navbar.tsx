import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Navbar() {
  const { t, lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Nowhere Traveler queda como sección de la página pero NO en el menú.
  // Es el proyecto live de Miguel y vive en nowheretraveler.com.
  const links = [
    { href: '#home', label: t.nav.home },
    { href: '#music', label: t.nav.music },
    { href: '#deepsidency', label: t.nav.deepsidency },
    { href: '#story', label: t.nav.story },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#contact', label: t.nav.contact },
  ]

  const handleClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleClick('#home') }}
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src="/images/spin-logo.webp"
            alt="Spin"
            className="h-8 w-auto"
          />
        </a>

        {/* Desktop Links — breakpoint subido a lg para evitar wrap con "Nowhere Traveler" */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
              className="text-xs xl:text-sm font-medium tracking-[0.15em] uppercase text-text-secondary hover:text-text-primary transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Lang Toggle + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="text-xs font-medium tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors px-2 py-1 border border-border-subtle rounded-sm"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Hamburger — visible until lg para que coincida con el nav desktop */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-1"
            aria-label="Menu"
          >
            <span className={`block w-6 h-px bg-text-primary transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-6 h-px bg-text-primary transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-text-primary transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 glass-strong overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
              className="text-sm font-medium tracking-[0.15em] uppercase text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
