import type { Locale } from '../content'

/** Microcopy de interfaz del sistema (no es copy de marca). Listado en MICROCOPY.md. */
export const UI: Record<Locale, {
  skip: string; menu: string; close: string; motion: string; on: string; off: string
  lang: string; navMain: string; navSocial: string; single: string; newTab: string
  playerNote: string; colNo: string; colTitle: string; colFormat: string; colLink: string
  released: string; top: string; credit: string
}> = {
  es: {
    skip: 'Saltar al contenido', menu: 'Menú', close: 'Cerrar', motion: 'Movimiento', on: 'Sí', off: 'No',
    lang: 'Idioma', navMain: 'Principal', navSocial: 'Redes', single: 'Single', newTab: 'abre en otra pestaña',
    playerNote: 'El player de Bandcamp se carga cuando lo pides.',
    colNo: 'N.º', colTitle: 'Título', colFormat: 'Formato', colLink: 'Enlace',
    released: 'Publicado', top: 'Volver arriba', credit: 'Diseño y desarrollo:',
  },
  en: {
    skip: 'Skip to content', menu: 'Menu', close: 'Close', motion: 'Motion', on: 'On', off: 'Off',
    lang: 'Language', navMain: 'Main', navSocial: 'Social', single: 'Single', newTab: 'opens in a new tab',
    playerNote: 'The Bandcamp player loads when you ask for it.',
    colNo: 'No.', colTitle: 'Title', colFormat: 'Format', colLink: 'Link',
    released: 'Released', top: 'Back to top', credit: 'Design and development:',
  },
}
