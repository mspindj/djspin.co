// Entrada del prerender (scripts/prerender.mjs). No se carga en el navegador.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import type { Locale } from './content'
import { headFor, pathFor } from './seo'

export const locales: Locale[] = ['es', 'en']
export const render = (locale: Locale) => renderToString(<StrictMode><App initialLocale={locale} /></StrictMode>)
export { headFor, pathFor }
