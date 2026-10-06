import { useCallback, useEffect, useState } from 'react'
import { copy, type Locale } from './content'
import { MotionProvider } from './shared/motion'
import SmoothScroll from './shared/SmoothScroll'
import Site from './site'

const LANG_KEY = 'spin-lang'

// Orden: ?lang= en la URL, lo que la persona eligió antes, y español por defecto.
function readLocale(): Locale {
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'es' || q === 'en') return q
  try {
    const s = localStorage.getItem(LANG_KEY)
    if (s === 'es' || s === 'en') return s
  } catch { /* sin almacenamiento */ }
  return 'es'
}

export default function App() {
  const [locale, setLocaleState] = useState<Locale>(readLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try { localStorage.setItem(LANG_KEY, l) } catch { /* sin almacenamiento */ }
  }, [])

  useEffect(() => { document.documentElement.lang = locale }, [locale])

  return (
    <MotionProvider>
      <SmoothScroll>
        <Site locale={locale} setLocale={setLocale} t={copy[locale]} />
      </SmoothScroll>
    </MotionProvider>
  )
}
