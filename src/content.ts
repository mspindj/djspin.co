// ÚNICO origen del contenido del sitio, ES y EN: copy en ./content/{es,en}.json, catálogo, venues, fotos y enlaces.
// Nada de cifras, fechas, shows, prensa o citas inventadas.
import es from './content/es.json'
import en from './content/en.json'

export type Locale = 'es' | 'en'
export type Copy = typeof es
export const copy: Record<Locale, Copy> = { es, en }

/** Props que recibe el sitio desde App.tsx. */
export type ProtoProps = { locale: Locale; setLocale: (l: Locale) => void; t: Copy }

// ---------------------------------------------------------------------------------------------
// Catálogo real de mspin.bandcamp.com: 3 EP + 13 sencillos. Portadas locales en /covers (700 px).
// `vivid` y `deep` salen de cada portada (cuantización con PIL), no son decisión de diseño.
// `albumId` es el id numérico de Bandcamp (data-tralbum): solo los EP lo tienen verificado.
// Fecha de salida verificada solo en los tres EP. Los sencillos NO tienen año: no inventarlo.
export type Release = {
  slug: string
  title: string
  type: 'EP' | 'single'
  path: string
  cover: string
  vivid: string
  deep: string
  albumId?: string
  released?: string
}

export const RELEASES: Release[] = [
  { slug: 'into-your-spell-ep', title: 'Into Your Spell EP', type: 'EP', path: 'album/into-your-spell-ep', cover: '/covers/into-your-spell-ep.jpg', vivid: '#cb8f48', deep: '#12060d', albumId: '633052668', released: '2024-12-20' },
  { slug: 'dont-know-yet-ep', title: "Don't Know Yet EP", type: 'EP', path: 'album/dont-know-yet-ep', cover: '/covers/dont-know-yet-ep.jpg', vivid: '#be1815', deep: '#3f1b18', albumId: '1463701055', released: '2024-11-22' },
  { slug: 'play-tha-bass-ep', title: 'Play Tha Bass EP', type: 'EP', path: 'album/play-tha-bass-ep', cover: '/covers/play-tha-bass-ep.jpg', vivid: '#a92b1d', deep: '#1c1b28', albumId: '2536298805', released: '2024-10-16' },
  { slug: 'some-other-things', title: 'Some Other Things', type: 'single', path: 'track/some-other-things', cover: '/covers/some-other-things.jpg', vivid: '#e34e42', deep: '#1e335e' },
  { slug: 'deeper-shade-of-love', title: 'Deeper Shade Of Love', type: 'single', path: 'track/deeper-shade-of-love', cover: '/covers/deeper-shade-of-love.jpg', vivid: '#e9423c', deep: '#2d3058' },
  { slug: 'majestic-guardian', title: 'Majestic Guardian', type: 'single', path: 'track/majestic-guardian', cover: '/covers/majestic-guardian.jpg', vivid: '#e59b77', deep: '#121835' },
  { slug: 'sin-on-sin', title: 'Sin On Sin', type: 'single', path: 'track/sin-on-sin', cover: '/covers/sin-on-sin.jpg', vivid: '#2e4f7a', deep: '#10121b' },
  { slug: 'in-the-trap', title: 'In The Trap', type: 'single', path: 'track/in-the-trap', cover: '/covers/in-the-trap.jpg', vivid: '#70453e', deep: '#041816' },
  { slug: 'know-it-all', title: 'Know It All', type: 'single', path: 'track/know-it-all', cover: '/covers/know-it-all.jpg', vivid: '#902052', deep: '#0a092e' },
  { slug: 'path-of-reason-and-sense', title: 'Path Of Reason And Sense', type: 'single', path: 'track/path-of-reason-and-sense', cover: '/covers/path-of-reason-and-sense.jpg', vivid: '#67c9af', deep: '#223832' },
  { slug: 'wider-truth', title: 'Wider Truth', type: 'single', path: 'track/wider-truth', cover: '/covers/wider-truth.jpg', vivid: '#63a292', deep: '#2c4844' },
  { slug: 'higher-demands', title: 'Higher Demands', type: 'single', path: 'track/higher-demands', cover: '/covers/higher-demands.jpg', vivid: '#39a081', deep: '#282e35' },
  { slug: 'deep-shine', title: 'Deep Shine', type: 'single', path: 'track/deep-shine', cover: '/covers/deep-shine.jpg', vivid: '#64ad85', deep: '#161f22' },
  { slug: 'maeria', title: 'Maeria', type: 'single', path: 'track/maeria', cover: '/covers/maeria.jpg', vivid: '#63cdb2', deep: '#283735' },
  { slug: 'fall-dilution', title: 'Fall Dilution', type: 'single', path: 'track/fall-dilution', cover: '/covers/fall-dilution.jpg', vivid: '#7ec8b3', deep: '#303f3f' },
  { slug: 'fearless-freedom', title: 'Fearless Freedom', type: 'single', path: 'track/fearless-freedom', cover: '/covers/fearless-freedom.jpg', vivid: '#69ad90', deep: '#1a2723' },
]

export const bandcampUrl = (r: Release) => `https://mspin.bandcamp.com/${r.path}`
/** bg y link en hex SIN #. */
export const bandcampEmbed = (albumId: string, bg: string, link: string) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=${bg}/linkcol=${link}/tracklist=true/transparent=true/`

// ---------------------------------------------------------------------------------------------
// Venues reales (de la bio original), por ciudad. Sin fechas: no hay fechas verificadas.
export const VENUES: { city: Record<Locale, string>; venues: string[] }[] = [
  { city: { es: 'Bogotá', en: 'Bogotá' }, venues: ['Baum', 'Billares Londres', 'Octava', 'Radio Berlín', 'Hotel W'] },
  { city: { es: 'Barcelona', en: 'Barcelona' }, venues: ['City Hall', 'Macarena', 'Hotel W'] },
  { city: { es: 'Ibiza', en: 'Ibiza' }, venues: ['Ibiza Global Radio'] },
  { city: { es: 'Ciudad de México', en: 'Mexico City' }, venues: ['AM', 'DJ World Conference'] },
]

/** Géneros de la serie Deepsidency, tal como están en el sitio en vivo. */
export const GENRES = ['Melodic House', 'Indie Dance', 'Progressive House', 'Deep House', 'Organic House']

export const LINKS = {
  bandcamp: 'https://mspin.bandcamp.com/',
  deepsidency: 'https://soundcloud.com/mspin/sets/deepsidency',
  nowhere: 'https://nowheretraveler.com',
  instagram: 'https://instagram.com/mspindj',
  facebook: 'https://facebook.com/mspindj',
  youtube: 'https://youtube.com/user/mspindj',
  soundcloud: 'https://soundcloud.com/mspindj',
}

// ---------------------------------------------------------------------------------------------
// Las 8 fotos que existen (EPK 2023 y sesiones de 2021). Todas a 1920 px de ancho. No hay más:
// no usar stock ni imágenes generadas como si fueran fotos de Spin. Sin crédito de fotógrafo confirmado.
export type Photo = { id: string; src: string; w: number; h: number; kind: 'club' | 'retrato'; alt: Record<Locale, string>; nota: string }
export const PHOTOS: Photo[] = [
  { id: 'hero', src: '/img/spin-hero.webp', w: 1920, h: 1141, kind: 'retrato', alt: { es: 'Spin de pie en un parqueadero oscuro, en blanco y negro', en: 'Spin standing in a dark car park, black and white' }, nota: 'B/N, casi todo negro, sujeto centrado arriba. Sirve de fondo.' },
  { id: 'booth', src: '/img/spin-booth.webp', w: 1920, h: 1280, kind: 'club', alt: { es: 'Spin en cabina con el brazo arriba frente a la pista llena de humo', en: 'Spin in the booth, arm raised, facing a smoke-filled dance floor' }, nota: 'Ojo de pez, humo cálido y luz blanca. La más fuerte del set.' },
  { id: 'booth-2', src: '/img/spin-booth-2.webp', w: 1920, h: 1280, kind: 'club', alt: { es: 'La pista vista desde la cabina, con el techo geométrico del club', en: 'The dance floor seen from the booth under the geometric club ceiling' }, nota: 'Ojo de pez, azul frío, mesa de mezcla en primer plano.' },
  { id: 'crowd', src: '/img/spin-crowd.webp', w: 1920, h: 1280, kind: 'club', alt: { es: 'Spin de espaldas frente al público bajo luces rojas', en: 'Spin from behind facing the crowd under red lights' }, nota: 'Roja saturada, sujeto de espaldas al centro.' },
  { id: 'graffiti', src: '/img/spin-graffiti.webp', w: 1920, h: 1279, kind: 'retrato', alt: { es: 'Spin sentado frente a un muro con grafiti', en: 'Spin sitting in front of a graffiti wall' }, nota: 'Color, grafiti azul y naranja. Plano abierto.' },
  { id: 'graffiti-2', src: '/img/spin-graffiti-2.webp', w: 1920, h: 1279, kind: 'retrato', alt: { es: 'Retrato de Spin frente a un muro con grafiti', en: 'Portrait of Spin in front of a graffiti wall' }, nota: 'Color, plano medio. Sujeto a la derecha.' },
  { id: 'story', src: '/img/spin-story.webp', w: 1920, h: 1279, kind: 'retrato', alt: { es: 'Spin de pie frente a un muro de concreto', en: 'Spin standing in front of a concrete wall' }, nota: 'Concreto gris, cuerpo entero, mucho aire. Buena para recortes.' },
  { id: 'story-2', src: '/img/spin-story-2.webp', w: 1920, h: 1279, kind: 'retrato', alt: { es: 'Spin de perfil frente a un muro de concreto', en: 'Spin in profile in front of a concrete wall' }, nota: 'Concreto gris, plano medio, mira a la izquierda.' },
]

/** Logo manuscrito, blanco con transparencia (800 px). Para otra tinta: úsalo como mask-image con background-color. */
export const LOGO = '/img/spin-logo.webp'

/** Lo que falta. Se diseña como hueco honesto o no se diseña: nunca se rellena con algo inventado. */
export const PENDING = [
  'Audio propio para alojar (extractos o masters): hoy el único sonido es el embed de Bandcamp y SoundCloud.',
  'Video (reel, aftermovie o grabación de un set): no hay ninguno en la carpeta.',
  'Fechas de shows, pasados o próximos: no hay ninguna verificada.',
  'Crédito de fotógrafo de las 8 fotos.',
  'Año de salida de los 13 sencillos.',
  'Logo en vector (SVG). Solo existe el PNG.',
]
