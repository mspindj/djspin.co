import '@fontsource-variable/big-shoulders/opsz.css'
import '@fontsource-variable/schibsted-grotesk/wght.css'
import './cartel.css'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import {
  GENRES, LINKS, LOGO, PHOTOS, RELEASES, VENUES, bandcampUrl,
  type Locale, type Photo, type ProtoProps, type Release,
} from '../content'
import BandcampFacade from '../shared/BandcampFacade'
import { useMotion } from '../shared/useMotion'
import { useLenis } from '../shared/useLenis'
import { useBookingForm } from '../shared/useBookingForm'
import Halftone from './Halftone'
import Fit from './Fit'
import { useSlides } from './useSlides'
import { UI } from './ui'

const RED = '#EB3E34'
const INK = '#141210'
const photo = (id: string): Photo => PHOTOS.find((p) => p.id === id) as Photo
const logoVar = { '--logo': `url(${LOGO})` } as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')

type Filter = 'all' | 'EP' | 'single'

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/** Marca de registro: círculo y cruz. Solo gráfica. */
function Reg({ className }: { className?: string }) {
  return (
    <svg className={`pc-reg${className ? ` ${className}` : ''}`} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="8" />
      <path d="M16 0v32M0 16h32" />
    </svg>
  )
}

/** Marcas de corte en las cuatro esquinas del pliego. */
function Crops() {
  return (
    <span className="pc-crops" aria-hidden="true">
      <i className="tl" /><i className="tr" /><i className="bl" /><i className="br" />
    </span>
  )
}

/** Tira de control de tinta: las tres tintas del sistema. */
function InkBar({ className }: { className?: string }) {
  return (
    <span className={`pc-inkbar${className ? ` ${className}` : ''}`} aria-hidden="true">
      <i /><i /><i /><i /><i />
    </span>
  )
}

function Ext({ label }: { label: string }) {
  return <><span className="pc-arrow" aria-hidden="true">↗</span><span className="pc-sr"> ({label})</span></>
}

export default function Cartel({ locale, setLocale, t }: ProtoProps) {
  const ui = UI[locale]
  const root = useRef<HTMLDivElement>(null)
  const { motionOn, userOn, setUserOn, reduced, ready } = useMotion()
  const lenis = useLenis()
  const [tone, setTone] = useState<'red' | 'paper' | 'ink'>('red')
  const [menu, setMenu] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const menuPanel = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const { errors, status, onSubmit, note } = useBookingForm(locale, t)
  const fid = useId()
  const narrow = useMedia('(max-width: 760px)')

  useSlides(root, ready && motionOn, locale)

  // La barra toma la tinta del pliego que tiene debajo.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const secs = Array.from(el.querySelectorAll<HTMLElement>('[data-tone]'))
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setTone((e.target as HTMLElement).dataset.tone as 'red' | 'paper' | 'ink')
      }
    }, { rootMargin: '-30px 0px -96% 0px' })
    secs.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Anclas: con Lenis se desliza, sin Lenis salta. El foco siempre llega al destino.
  const onAnchor = useCallback((e: MouseEvent<HTMLElement>) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!a) return
    const target = document.getElementById(a.getAttribute('href')!.slice(1))
    if (!target) return
    e.preventDefault()
    setMenu(false)
    const y = target.id === 'pc-top' ? 0 : Math.round(target.getBoundingClientRect().top + window.scrollY) + 1
    if (lenis) lenis.scrollTo(y)
    else window.scrollTo(0, y)
    target.focus({ preventScroll: true })
    history.replaceState(null, '', `#${target.id}`)
  }, [lenis])

  // Menú móvil: Esc cierra, el foco queda dentro y vuelve al botón.
  useEffect(() => {
    if (!menu) return
    const panel = menuPanel.current
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu(false); return }
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
    const btn = menuBtn.current
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      lenis?.start()
      btn?.focus()
    }
  }, [menu, lenis])

  // Si la pantalla crece con el menú abierto, se cierra.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1001px)')
    const on = () => { if (mq.matches) setMenu(false) }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const words = t.hero.tagline.split(' ')
  const featured = RELEASES[0]
  const rows = useMemo(
    () => RELEASES.map((r, i) => ({ r, n: i + 1 })).filter(({ r }) => filter === 'all' || r.type === filter),
    [filter],
  )
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'es' ? 'es-CO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(`${iso}T00:00:00Z`))
  const typeLabel = (r: Release) => (r.type === 'EP' ? t.music.tag_ep : ui.single)

  const nav: { href: string; label: string }[] = [
    { href: '#pc-musica', label: t.nav.music },
    { href: '#pc-historia', label: t.nav.story },
    { href: '#pc-deepsidency', label: t.nav.deepsidency },
    { href: '#pc-nowhere', label: t.nav.nowhere },
  ]
  const social: { href: string; label: string }[] = [
    { href: LINKS.bandcamp, label: 'Bandcamp' },
    { href: LINKS.soundcloud, label: 'SoundCloud' },
    { href: LINKS.instagram, label: 'Instagram' },
    { href: LINKS.youtube, label: 'YouTube' },
    { href: LINKS.facebook, label: 'Facebook' },
  ]

  const langToggle = (
    <div className="pc-lang" role="group" aria-label={ui.lang}>
      {(['es', 'en'] as Locale[]).map((l) => (
        <button key={l} type="button" aria-pressed={locale === l} lang={l} onClick={() => setLocale(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
  const motionSwitch = reduced ? null : (
    <button type="button" className="pc-motion" role="switch" aria-checked={userOn} onClick={() => setUserOn(!userOn)}>
      <span>{ui.motion}</span>
      <span className="pc-motion__dot" aria-hidden="true" />
      <span className="pc-motion__state" aria-hidden="true">{userOn ? ui.on : ui.off}</span>
    </button>
  )

  const subjects: [string, string][] = [
    ['booking', t.contact.subject_booking],
    ['press', t.contact.subject_press],
    ['brand', t.contact.subject_brand],
    ['other', t.contact.subject_other],
  ]

  return (
    <div className="pc" ref={root} data-bar={tone} data-menu={menu ? 'open' : undefined} style={logoVar} onClick={onAnchor}>
      <a className="pc-skip" href="#pc-main">{ui.skip}</a>

      <header className="pc-bar">
        <a className="pc-bar__logo" href="#pc-top" aria-label="Spin">
          <span className="pc-logo" aria-hidden="true" />
        </a>
        <nav className="pc-nav" aria-label={ui.navMain}>
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="pc-bar__tools">
          {motionSwitch}
          {langToggle}
          <a className="pc-bar__cta" href="#pc-bookings">{t.hero.cta_bookings}</a>
          <button
            ref={menuBtn}
            type="button"
            className="pc-menubtn"
            aria-expanded={menu}
            aria-controls="pc-menu"
            onClick={() => setMenu(true)}
          >
            {ui.menu}
          </button>
        </div>
      </header>

      {menu && (
        <div className="pc-menu" id="pc-menu" role="dialog" aria-modal="true" aria-label={ui.menu} ref={menuPanel}>
          <div className="pc-menu__top">
            <button type="button" className="pc-menu__close" onClick={() => setMenu(false)}>{ui.close}</button>
          </div>
          <nav aria-label={ui.navMain}>
            {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
            <a href="#pc-bookings">{t.hero.cta_bookings}</a>
          </nav>
          <div className="pc-menu__tools">
            {langToggle}
            {motionSwitch}
          </div>
        </div>
      )}

      <main id="pc-main" tabIndex={-1}>
        {/* ------------------------------------------------------------------ Cartel */}
        <section className="pc-hero" id="pc-top" data-tone="red" tabIndex={-1}>
          <Crops />
          <div className="pc-hero__fig">
            <Halftone
              id="hero" photo={photo('story')} locale={locale} ink={INK} mode="dark"
              cell={narrow ? 4.5 : 6} lo={0.45} hi={0.93} gamma={0.9}
              focus={narrow ? [0.285, 0.2] : [0.285, 0.4]} zoom={narrow ? 2.7 : 1.3}
              fadeL={narrow ? 0.3 : 0.26} fadeB={narrow ? 0.22 : 0} eager
            />
          </div>

          <div className="pc-hero__info">
            <p className="pc-hero__sub">{t.hero.subtitle}</p>
            <div className="pc-hero__cta">
              <a className="pc-btn pc-btn--solid" href="#pc-bookings">{t.hero.cta_bookings}</a>
              <a className="pc-btn" href="#pc-musica">{t.hero.cta_listen}</a>
            </div>
          </div>

          <h1 className="pc-hero__title">
            <span className="pc-hero__logo">
              <span className="pc-logo" aria-hidden="true" />
              <span className="pc-sr">Spin. </span>
            </span>
            <span className="pc-hero__lines pc-hero__lines--wide">
              <Fit>{words[0]}</Fit>
              <Fit>{words.slice(1).join(' ')}</Fit>
            </span>
            <span className="pc-hero__lines pc-hero__lines--tall">
              {words.map((w) => <Fit key={w}>{w}</Fit>)}
            </span>
          </h1>

          <Reg className="pc-hero__reg" />
          <InkBar className="pc-hero__inkbar" />
        </section>

        {/* ------------------------------------------------------------------ Orillo */}
        <div className="pc-band" data-tone="ink">
          <p className="pc-band__line pc-band__line--a">
            <span data-slide="-16">
              <span>{t.story.genres}</span>
              {[0, 1, 2, 3].map((i) => <span key={i} aria-hidden="true">{t.story.genres}</span>)}
            </span>
          </p>
          <p className="pc-band__line pc-band__line--b">
            <span data-slide="16">
              <span>{t.story.reach_label}</span>
              {[0, 1, 2, 3].map((i) => <span key={i} aria-hidden="true">{t.story.reach_label}</span>)}
            </span>
          </p>
        </div>

        {/* ------------------------------------------------------------------ Música */}
        <section className="pc-sec pc-music" id="pc-musica" data-tone="paper" tabIndex={-1} aria-labelledby="pc-h-musica">
          <div className="pc-music__head">
            <h2 className="pc-h2 pc-h2--giant" id="pc-h-musica"><span data-slide="9" data-slide-mode="in">{t.music.title}</span></h2>
            <a className="pc-link pc-music__all" href={LINKS.bandcamp} target="_blank" rel="noopener noreferrer">
              {t.music.support} <Ext label={ui.newTab} />
            </a>
          </div>

          <article className="pc-feat" aria-labelledby="pc-h-feat">
            <div className="pc-feat__cover">
              <BandcampFacade release={featured} bg="141210" link="EB3E34" className="pc-player" height={640}>
                <img src={featured.cover} width={700} height={700} alt={featured.title} loading="lazy" decoding="async" />
                <span className="pc-player__cta">
                  <span className="pc-player__play" aria-hidden="true" />
                  <span className="pc-player__txt">{t.hero.cta_listen}</span>
                </span>
              </BandcampFacade>
              <Reg className="pc-feat__reg" />
            </div>
            <div className="pc-feat__body">
              <h3 className="pc-feat__title" id="pc-h-feat">
                <span className="pc-feat__latest">{t.music.latest}</span>
                <span className="pc-feat__name">{featured.title}</span>
              </h3>
              <dl className="pc-feat__meta">
                <div><dt>{ui.colFormat}</dt><dd>{typeLabel(featured)}</dd></div>
                {featured.released && <div><dt>{ui.released}</dt><dd>{fmtDate(featured.released)}</dd></div>}
              </dl>
              <div className="pc-feat__foot">
                <p className="pc-feat__note">{ui.playerNote}</p>
                <a className="pc-link" href={bandcampUrl(featured)} target="_blank" rel="noopener noreferrer">
                  {t.music.listen_on} Bandcamp <Ext label={ui.newTab} />
                </a>
              </div>
            </div>
          </article>

          <div className="pc-index">
            <div className="pc-index__bar">
              <div className="pc-filter" role="group" aria-label={t.music.filter_aria}>
                {([['all', t.music.filter_all], ['EP', t.music.filter_eps], ['single', t.music.filter_singles]] as [Filter, string][]).map(([k, label]) => (
                  <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
                ))}
              </div>
              <p className="pc-index__count" aria-live="polite">{pad(rows.length)} / {pad(RELEASES.length)}</p>
            </div>
            <div className="pc-index__cols" aria-hidden="true">
              <span>{ui.colNo}</span><span /><span>{ui.colTitle}</span><span>{ui.colFormat}</span><span>{ui.colLink}</span>
            </div>
            <ol className="pc-rows">
              {rows.map(({ r, n }) => (
                <li key={r.slug} className="pc-row">
                  <span className="pc-row__n" aria-hidden="true">{pad(n)}</span>
                  <span className="pc-row__cover">
                    <img src={r.cover} width={700} height={700} alt="" loading="lazy" decoding="async" />
                  </span>
                  <a className="pc-row__title" href={bandcampUrl(r)} target="_blank" rel="noopener noreferrer">
                    {r.title}<span className="pc-sr">, {typeLabel(r)} ({ui.newTab})</span>
                  </a>
                  <span className="pc-row__type" aria-hidden="true">
                    {typeLabel(r)}{r.released ? ` ${r.released.slice(0, 4)}` : ''}
                  </span>
                  <span className="pc-row__go" aria-hidden="true">{t.music.listen_on} Bandcamp <span className="pc-arrow">↗</span></span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------------ Cartel de gira */}
        <section className="pc-sec pc-tour" id="pc-cabinas" data-tone="red" tabIndex={-1} aria-labelledby="pc-h-cabinas">
          <Crops />
          <div className="pc-tour__head">
            <h2 className="pc-h2 pc-tour__title" id="pc-h-cabinas">{t.venues.title}</h2>
            <div className="pc-tour__photo">
              <Halftone
                id="tour" photo={photo('booth-2')} locale={locale} ink={INK} mode="dark"
                tone="/img/tone/booth-2.webp" dot={0.56} cell={4} lo={0.06} hi={0.96} gamma={1.25} focus={[0.5, 0.56]}
              />
            </div>
          </div>
          <ul className="pc-cities" aria-label={t.venues.aria}>
            {VENUES.map((v, i) => (
              <li key={v.city.es} className="pc-city">
                <h3 className="pc-city__name"><span data-slide={i % 2 ? '14' : '7'} data-slide-mode="in">{v.city[locale]}</span></h3>
                <ul className="pc-city__venues">
                  {v.venues.map((name) => <li key={name}>{name}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------------ Historia */}
        <section className="pc-sec pc-story" id="pc-historia" data-tone="paper" tabIndex={-1} aria-labelledby="pc-h-historia">
          <header className="pc-story__head">
            <h2 className="pc-h2 pc-h2--giant" id="pc-h-historia"><span data-slide="9" data-slide-mode="in">{t.story.title}</span></h2>
            <p className="pc-story__name">{t.story.name}</p>
          </header>
          <div className="pc-story__grid">
            <figure className="pc-story__photo">
              <Halftone
                id="story" photo={photo('story-2')} locale={locale} ink={INK} mode="dark"
                cell={6} lo={0.36} hi={0.92} gamma={0.9} focus={[0.3, 0.42]}
              />
            </figure>
            <p className="pc-story__lead">{t.story.bio_1}</p>
            <div className="pc-story__txt">
              <p className="pc-story__p pc-story__p--a">{t.story.bio_2}</p>
              <p className="pc-story__p">{t.story.bio_3}</p>
            </div>
            <figure className="pc-story__photo2">
              <Halftone
                id="story-b" photo={photo('graffiti-2')} locale={locale} ink={RED} mode="dark"
                cell={5} lo={0.2} hi={0.88} gamma={1.1} focus={[0.66, 0.36]} zoom={1.15}
              />
            </figure>
          </div>
          <dl className="pc-facts">
            <div><dt>{t.story.years}</dt><dd>{t.story.genres}</dd></div>
            <div><dt>{t.story.reach_value}</dt><dd>{t.story.reach_label}</dd></div>
            <div><dt>{t.story.location}</dt><dd>{t.story.name}</dd></div>
          </dl>
        </section>

        {/* ------------------------------------------------------------------ Deepsidency */}
        <section className="pc-sec pc-deep" id="pc-deepsidency" data-tone="ink" tabIndex={-1} aria-labelledby="pc-h-deep">
          <h2 className="pc-h2 pc-deep__title" id="pc-h-deep"><span data-slide="7" data-slide-mode="in"><Fit>{t.deepsidency.title}</Fit></span></h2>
          <div className="pc-deep__grid">
            <figure className="pc-deep__photo">
              <Halftone
                id="deep" photo={photo('booth')} locale={locale} ink={RED} mode="light"
                tone="/img/tone/booth.webp" dot={0.56} cell={5} lo={0.06} hi={0.96} gamma={1.2} focus={[0.6, 0.48]} zoom={1.12}
              />
            </figure>
            <div className="pc-deep__body">
              <p className="pc-deep__sub">{t.deepsidency.subtitle}</p>
              <p className="pc-deep__p">{t.deepsidency.description}</p>
              <p className="pc-deep__aud">{t.deepsidency.audience}</p>
              <ul className="pc-tags">
                {GENRES.map((g) => <li key={g}>{g}</li>)}
              </ul>
              <a className="pc-btn pc-btn--solid" href={LINKS.deepsidency} target="_blank" rel="noopener noreferrer">
                {t.deepsidency.cta} <Ext label={ui.newTab} />
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ Nowhere Traveler */}
        <section className="pc-sec pc-nw" id="pc-nowhere" data-tone="red" tabIndex={-1} aria-labelledby="pc-h-nw">
          <div className="pc-nw__left">
            <h2 className="pc-h2 pc-nw__title" id="pc-h-nw">
              {t.nowhere.title} <span className="pc-stamp">{t.nowhere.badge}</span>
            </h2>
            <p className="pc-nw__sub">{t.nowhere.subtitle}</p>
          </div>
          <div className="pc-nw__right">
            <p>{t.nowhere.description}</p>
            <a className="pc-link pc-link--big" href={LINKS.nowhere} target="_blank" rel="noopener noreferrer">
              nowheretraveler.com <Ext label={ui.newTab} />
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------------ Bookings */}
        <section className="pc-sec pc-book" id="pc-bookings" data-tone="paper" tabIndex={-1} aria-labelledby="pc-h-book">
          <div className="pc-coupon">
            <div className="pc-coupon__stub">
              <h2 className="pc-h2 pc-coupon__title" id="pc-h-book"><Fit>{t.contact.title}</Fit></h2>
              <p className="pc-coupon__sub">{t.contact.subtitle}</p>
              <p className="pc-coupon__offer">{t.contact.offer_line}</p>
              <p className="pc-coupon__resp">{t.contact.offer_response}</p>
              <Reg className="pc-coupon__reg" />
              <InkBar className="pc-coupon__inkbar" />
            </div>
            <span className="pc-coupon__perf" aria-hidden="true" />
            <form className="pc-form" noValidate onSubmit={onSubmit}>
              <div className="pc-field">
                <label htmlFor={`${fid}-name`}>{t.contact.name}</label>
                <input
                  id={`${fid}-name`} name="name" type="text" autoComplete="name" required
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? `${fid}-name-e` : undefined}
                />
                {errors.name && <p className="pc-err" id={`${fid}-name-e`}>{errors.name}</p>}
              </div>
              <div className="pc-field">
                <label htmlFor={`${fid}-email`}>{t.contact.email}</label>
                <input
                  id={`${fid}-email`} name="email" type="email" autoComplete="email" required
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? `${fid}-email-e` : undefined}
                />
                {errors.email && <p className="pc-err" id={`${fid}-email-e`}>{errors.email}</p>}
              </div>
              <fieldset className="pc-field pc-field--wide pc-subject">
                <legend>{t.contact.subject}</legend>
                <div className="pc-subject__opts">
                  {subjects.map(([value, label], i) => (
                    <label key={value}>
                      <input type="radio" name="subject" value={value} defaultChecked={i === 0} />
                      <span className="pc-subject__box" aria-hidden="true" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="pc-field pc-field--wide">
                <label htmlFor={`${fid}-msg`}>{t.contact.message}</label>
                <textarea
                  id={`${fid}-msg`} name="message" rows={4} required
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? `${fid}-msg-e` : undefined}
                />
                {errors.message && <p className="pc-err" id={`${fid}-msg-e`}>{errors.message}</p>}
              </div>
              <div className="pc-form__foot pc-field--wide">
                <button type="submit" className="pc-btn pc-btn--solid pc-btn--xl" disabled={status === 'sending'}>{t.contact.send}</button>
                <p className="pc-form__status" role="status" data-status={status}>{note}</p>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ Pie */}
      <footer className="pc-foot" data-tone="ink">
        <Crops />
        <div className="pc-foot__logo"><span className="pc-logo" role="img" aria-label="Spin" /></div>
        <nav className="pc-foot__social" aria-label={ui.navSocial}>
          <ul>
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer"><span className="pc-foot__name">{s.label}</span> <Ext label={ui.newTab} /></a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pc-foot__base">
          <div className="pc-foot__legal">
            <p>© {new Date().getFullYear()} Spin. {t.footer.rights}. {t.story.location}.</p>
            <p>
              {ui.credit}{' '}
              <a className="pc-link" href={`https://maitoagency.com/${locale}`} target="_blank" rel="noopener noreferrer">
                Maito Agency <span className="pc-arrow" aria-hidden="true">↗</span>
                <span className="pc-sr"> ({ui.newTab})</span>
              </a>
            </p>
          </div>
          <Reg />
          <a className="pc-link" href="#pc-top">{ui.top} <span className="pc-arrow" aria-hidden="true">↑</span></a>
        </div>
      </footer>

      <span className="pc-grain" aria-hidden="true" />
    </div>
  )
}
