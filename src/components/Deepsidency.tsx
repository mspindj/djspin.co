import { useLang } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Deepsidency() {
  const { t } = useLang()
  const cardsRef = useScrollAnimation<HTMLDivElement>({ children: true, stagger: 0.1 })

  return (
    <section id="deepsidency" className="py-24 md:py-32 px-6 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text */}
          <div>
            <p className="text-accent text-xs tracking-[0.2em] uppercase font-medium mb-4">
              {t.deepsidency.subtitle}
            </p>
            <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-8">
              {t.deepsidency.title}
            </h2>

            <div className="space-y-5 text-text-secondary leading-relaxed mb-8">
              <p>{t.deepsidency.description}</p>
              <p className="text-text-muted italic">{t.deepsidency.audience}</p>
            </div>

            <a
              href="https://soundcloud.com/mspin/sets/deepsidency"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 glow-hover"
            >
              {t.deepsidency.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>

          {/* Playlist embed + tags */}
          <div ref={cardsRef} className="space-y-6">
            <div className="glass rounded-lg p-4">
              <iframe
                width="100%"
                height="450"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2034528036&color=%23eb3e34&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true"
                title="Deepsidency - Spin"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['Melodic House', 'Indie Dance', 'Progressive House', 'Deep House', 'Organic House'].map(tag => (
                <span
                  key={tag}
                  className="text-xs tracking-[0.1em] uppercase text-text-muted border border-border-subtle rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
