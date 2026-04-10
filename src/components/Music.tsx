import { useLang } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const releases = [
  { title: 'Into Your Spell EP', type: 'EP', year: '2023' },
  { title: "Don't Know Yet EP", type: 'EP', year: '2022' },
  { title: 'Play Tha Bass EP', type: 'EP', year: '2021' },
]

const tracks = [
  'Some Other Things', 'Deeper Shade Of Love', 'Majestic Guardian',
  'Sin On Sin', 'Path of Reason and Sense', 'Wider Truth',
]

export default function Music() {
  const { t } = useLang()
  const cardsRef = useScrollAnimation<HTMLDivElement>({ children: true, stagger: 0.12 })

  return (
    <section id="music" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-4">
            {t.music.title}
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            {t.music.subtitle}
          </p>
        </div>

        {/* Releases Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {releases.map((release) => (
            <a
              key={release.title}
              href="https://mspin.bandcamp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass float rounded-lg p-6 group cursor-pointer"
            >
              <div className="aspect-square bg-bg-surface rounded-md mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="font-display text-2xl tracking-[0.05em] text-text-muted group-hover:text-accent transition-colors duration-300">
                    SPIN
                  </div>
                  <div className="text-xs text-text-muted mt-1 tracking-widest uppercase">
                    {release.type}
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-lg mb-1 group-hover:text-accent transition-colors duration-300">
                {release.title}
              </h3>
              <p className="text-sm text-text-muted">{release.year}</p>
            </a>
          ))}
        </div>

        {/* Track List */}
        <div className="glass rounded-lg p-8 mb-12">
          <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-text-muted mb-6">
            {t.music.latest}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tracks.map((track, i) => (
              <div
                key={track}
                className="flex items-center gap-4 py-2 border-b border-border-subtle group"
              >
                <span className="text-xs text-text-muted w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                  {track}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bandcamp CTA */}
        <div className="text-center">
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
