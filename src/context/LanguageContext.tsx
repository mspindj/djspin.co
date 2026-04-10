import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import es from '../i18n/es.json'
import en from '../i18n/en.json'

type Lang = 'es' | 'en'
type Translations = typeof es

interface LanguageContextType {
  lang: Lang
  t: Translations
  toggle: () => void
}

const translations: Record<Lang, Translations> = { es, en }

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  t: es,
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('spin-lang') as Lang
    return saved === 'en' ? 'en' : 'es'
  })

  useEffect(() => {
    localStorage.setItem('spin-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang(prev => (prev === 'es' ? 'en' : 'es'))

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
