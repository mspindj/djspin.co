import { useCallback, useEffect, useState } from 'react'
import { copy, type Locale } from './content'
import { MotionProvider } from './shared/motion'
import SmoothScroll from './shared/SmoothScroll'
import { localeFromPath, pathFor, titleFor } from './seo'
import Site from './site'

// El idioma lo decide la dirección: "/" es español y "/en" es inglés.
// "?lang=en" es la forma vieja: se respeta y se corrige la dirección.
function readLocale(): Locale {
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'es' || q === 'en') return q
  return localeFromPath(location.pathname)
}

export default function App({ initialLocale }: { initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? readLocale())

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    if (localeFromPath(location.pathname) !== l) history.pushState(null, '', pathFor(l) + location.hash)
  }, [])

  useEffect(() => {
    // Dirección vieja con ?lang=: se deja la limpia sin recargar.
    if (new URLSearchParams(location.search).has('lang')) history.replaceState(null, '', pathFor(readLocale()) + location.hash)
    const onPop = () => setLocaleState(localeFromPath(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = titleFor(locale)
  }, [locale])

  return (
    <MotionProvider>
      <SmoothScroll>
        <Site locale={locale} setLocale={setLocale} t={copy[locale]} />
      </SmoothScroll>
    </MotionProvider>
  )
}
