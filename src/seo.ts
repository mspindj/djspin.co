// Cabecera por idioma. La usa scripts/prerender.mjs al compilar: cada idioma sale con su dirección,
// su título, su descripción y los hreflang. El bloque equivalente de index.html (entre las marcas
// seo:start y seo:end) solo se ve en `npm run dev`.
import type { Locale } from './content'
import { LINKS } from './content'

export const ORIGIN = 'https://djspin.co'
export const pathFor = (l: Locale) => (l === 'en' ? '/en' : '/')
export const localeFromPath = (pathname: string): Locale => (/^\/en(\/|$)/.test(pathname) ? 'en' : 'es')

type Seo = { title: string; description: string; share: string; shareTitle: string; ogLocale: string; imageAlt: string; schema: string; keywords: string }
const SEO: Record<Locale, Seo> = {
  es: {
    title: 'Spin, DJ y curador sonoro | House, Deep, Progressive | Bogotá',
    description: 'Spin (Miguel Espinosa), DJ y curador sonoro con más de 20 años en cabina. House, deep y progressive para clubs y eventos boutique en Bogotá, Barcelona, Ibiza y Ciudad de México. Bookings, Deepsidency y Nowhere Traveler Live.',
    share: 'Sonido que lee la noche. Más de 20 años en cabina, de Bogotá a Ibiza. Bookings, Deepsidency y Nowhere Traveler Live.',
    shareTitle: 'Spin, DJ y curador sonoro | House, Deep, Progressive',
    ogLocale: 'es_ES',
    imageAlt: 'Spin, DJ y curador sonoro',
    schema: 'DJ y curador sonoro con más de 20 años en la escena electrónica. House, deep y progressive para clubs y eventos boutique.',
    keywords: 'Spin DJ, booking DJ Bogotá, DJ para eventos, Deepsidency, Nowhere Traveler, house, deep house, progressive, melodic techno, DJ house Colombia, curador sonoro, electronic music Colombia',
  },
  en: {
    title: 'Spin, DJ and sound curator | House, Deep, Progressive | Bogotá',
    description: 'Spin (Miguel Espinosa), DJ and sound curator with over 20 years behind the decks. House, deep and progressive for clubs and boutique events in Bogotá, Barcelona, Ibiza and Mexico City. Bookings, Deepsidency and Nowhere Traveler Live.',
    share: 'Sound that reads the room. Over 20 years behind the decks, from Bogotá to Ibiza. Bookings, Deepsidency and Nowhere Traveler Live.',
    shareTitle: 'Spin, DJ and sound curator | House, Deep, Progressive',
    ogLocale: 'en_US',
    imageAlt: 'Spin, DJ and sound curator',
    schema: 'DJ and sound curator with over 20 years in the electronic scene. House, deep and progressive for clubs and boutique events.',
    keywords: 'Spin DJ, DJ booking Bogotá, DJ for events, Deepsidency, Nowhere Traveler, house, deep house, progressive, melodic techno, house DJ Colombia, sound curator, electronic music Colombia',
  },
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export const titleFor = (l: Locale) => SEO[l].title

/** Bloque de <head> para un idioma. */
export function headFor(l: Locale): string {
  const s = SEO[l]
  const other: Locale = l === 'es' ? 'en' : 'es'
  const url = ORIGIN + pathFor(l)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: 'Spin',
    alternateName: 'Miguel Espinosa',
    url,
    image: `${ORIGIN}/og-image.jpg`,
    description: s.schema,
    genre: ['House', 'Deep House', 'Progressive House', 'Melodic Techno'],
    foundingLocation: { '@type': 'Place', name: 'Bogotá, Colombia' },
    member: { '@type': 'Person', name: 'Miguel Espinosa' },
    sameAs: [LINKS.instagram, LINKS.facebook, LINKS.youtube, LINKS.soundcloud, LINKS.bandcamp.replace(/\/$/, '')],
  }
  return [
    `<meta name="description" content="${esc(s.description)}" />`,
    `<meta name="keywords" content="${esc(s.keywords)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${ORIGIN}${pathFor('es')}" />`,
    `<link rel="alternate" hreflang="en" href="${ORIGIN}${pathFor('en')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor('es')}" />`,
    `<meta property="og:title" content="${esc(s.shareTitle)}" />`,
    `<meta property="og:description" content="${esc(s.share)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="Spin" />`,
    `<meta property="og:locale" content="${s.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${SEO[other].ogLocale}" />`,
    `<meta property="og:image" content="${ORIGIN}/og-image.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(s.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(s.shareTitle)}" />`,
    `<meta name="twitter:description" content="${esc(s.share)}" />`,
    `<meta name="twitter:image" content="${ORIGIN}/og-image.jpg" />`,
    `<title>${esc(s.title)}</title>`,
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}
