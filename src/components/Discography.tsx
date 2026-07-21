import { useState, useMemo } from 'react'
import { useLang } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// Catálogo completo extraído de mspin.bandcamp.com (junio 2026).
// Para regenerar: scrapear https://mspin.bandcamp.com/music
// Covers servidas vía Bandcamp CDN (f4.bcbits.com) en tamaño _10 (1200x1200).
type ReleaseType = 'EP' | 'single'
interface Release {
  title: string
  type: ReleaseType
  slug: string      // /album/<slug> o /track/<slug>
  coverId: string   // aXXXXXX — Bandcamp CDN image id
  albumId?: string  // id numérico de Bandcamp para el embed (data-tralbum). Solo EPs por ahora.
}

const releases: Release[] = [
  // EPs primero — son el cuerpo principal del catálogo
  { title: 'Into Your Spell EP',  type: 'EP',     slug: 'album/into-your-spell-ep',   coverId: 'a1081458528', albumId: '633052668' },
  { title: "Don't Know Yet EP",   type: 'EP',     slug: 'album/dont-know-yet-ep',     coverId: 'a3722064224', albumId: '1463701055' },
  { title: 'Play Tha Bass EP',    type: 'EP',     slug: 'album/play-tha-bass-ep',     coverId: 'a3441425956', albumId: '2536298805' },
  // Singles — orden similar al de Bandcamp
  { title: 'Some Other Things',       type: 'single', slug: 'track/some-other-things',       coverId: 'a0659005967' },
  { title: 'Deeper Shade Of Love',    type: 'single', slug: 'track/deeper-shade-of-love',    coverId: 'a1630000820' },
  { title: 'Majestic Guardian',       type: 'single', slug: 'track/majestic-guardian',       coverId: 'a3005558070' },
  { title: 'Sin On Sin',              type: 'single', slug: 'track/sin-on-sin',              coverId: 'a4260359831' },
  { title: 'In The Trap',             type: 'single', slug: 'track/in-the-trap',             coverId: 'a3453421474' },
  { title: 'Know It All',             type: 'single', slug: 'track/know-it-all',             coverId: 'a3108443082' },
  { title: 'Path Of Reason And Sense', type: 'single', slug: 'track/path-of-reason-and-sense', coverId: 'a1251143378' },
  { title: 'Wider Truth',             type: 'single', slug: 'track/wider-truth',             coverId: 'a0405793260' },
  { title: 'Higher Demands',          type: 'single', slug: 'track/higher-demands',          coverId: 'a0346369713' },
  { title: 'Deep Shine',              type: 'single', slug: 'track/deep-shine',              coverId: 'a1169690174' },
  { title: 'Maeria',                  type: 'single', slug: 'track/maeria',                  coverId: 'a0981653090' },
  { title: 'Fall Dilution',           type: 'single', slug: 'track/fall-dilution',           coverId: 'a0551348366' },
  { title: 'Fearless Freedom',        type: 'single', slug: 'track/fearless-freedom',        coverId: 'a1130369802' },
]

type Filter = 'all' | 'EP' | 'single'

export default function Discography() {
  const { t } = useLang()
  const [filter, setFilter] = useState<Filter>('all')
  const gridRef = useScrollAnimation<HTMLDivElement>({ children: true, stagger: 0.06 })

  // EP destacado para el player embebido (el más reciente con albumId).
  const featured = releases.find(r => r.type === 'EP' && r.albumId)

  const filtered = useMemo(() => {
    if (filter === 'all') return releases
    return releases.filter(r => r.type === filter)
  }, [filter])

  const counts = useMemo(() => ({
    all: releases.length,
    EP: releases.filter(r => r.type === 'EP').length,
    single: releases.filter(r => r.type === 'single').length,
  }), [])

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all',    label: t.music.filter_all,     count: counts.all },
    { id: 'EP',     label: t.music.filter_eps,     count: counts.EP },
    { id: 'single', label: t.music.filter_singles, count: counts.single },
  ]

  return (
    <section id="music" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-accent mb-3">
            {t.music.eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-4">
            {t.music.title}
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            {t.music.subtitle}
          </p>
        </div>

        {/* Featured player — escuchar sin salir del sitio. EP más reciente. */}
        {featured?.albumId && (
          <div className="mb-16 max-w-3xl mx-auto">
            <p className="text-center text-xs font-medium tracking-[0.2em] uppercase text-text-muted mb-4">
              {t.music.latest}
            </p>
            <div className="rounded-lg overflow-hidden border border-border-subtle bg-bg-secondary/40 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              <iframe
                title={`${featured.title} — Spin`}
                src={`https://bandcamp.com/EmbeddedPlayer/album=${featured.albumId}/size=large/bgcol=0a0a0f/linkcol=eb3e34/tracklist=true/transparent=true/`}
                seamless
                loading="lazy"
                className="w-full block"
                style={{ border: 0, height: 470 }}
              >
                <a href={`https://mspin.bandcamp.com/${featured.slug}`}>
                  {featured.title} by Spin
                </a>
              </iframe>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div
          role="tablist"
          aria-label={t.music.filter_aria}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {filters.map(f => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={[
                  'px-5 py-2 text-xs font-medium tracking-[0.15em] uppercase rounded-full border transition-all duration-300',
                  active
                    ? 'bg-accent border-accent text-white shadow-[0_0_24px_rgba(235,62,52,0.25)]'
                    : 'border-border-subtle text-text-muted hover:text-text-primary hover:border-text-secondary',
                ].join(' ')}
              >
                {f.label}
                <span className={`ml-2 text-[10px] ${active ? 'text-white/70' : 'text-text-muted'}`}>
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Releases grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filtered.map(release => (
            <ReleaseCard key={release.slug} release={release} epLabel={t.music.tag_ep} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <a
            href="https://mspin.bandcamp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-white text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300"
          >
            {t.music.support}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function ReleaseCard({ release, epLabel }: { release: Release; epLabel: string }) {
  const cover = `https://f4.bcbits.com/img/${release.coverId}_10.jpg`
  const url = `https://mspin.bandcamp.com/${release.slug}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block"
    >
      {/* Cover */}
      <div className="aspect-square overflow-hidden rounded-md bg-bg-secondary relative">
        <img
          src={cover}
          alt={release.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* EP badge */}
        {release.type === 'EP' && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-white text-[10px] tracking-[0.15em] uppercase font-medium rounded-sm">
            {epLabel}
          </span>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(235,62,52,0.45)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
        {release.title}
      </h3>
    </a>
  )
}
