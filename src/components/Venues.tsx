import { useLang } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// Venues reales tomados de la bio (story.bio_3), agrupados por ciudad.
// Formato EPK: prueba escaneable para bookers. Si se agregan más, mantener orden geográfico.
const venuesByCity = [
  { city: 'Bogotá', venues: ['Baum', 'Billares Londres', 'Octava', 'Radio Berlín', 'Hotel W'] },
  { city: 'Barcelona', venues: ['City Hall', 'Macarena', 'Hotel W'] },
  { city: 'Ibiza', venues: ['Ibiza Global Radio'] },
  { city: 'Ciudad de México', venues: ['AM', 'DJ World Conference'] },
]

export default function Venues() {
  const { t } = useLang()
  const gridRef = useScrollAnimation<HTMLDivElement>({ children: true, stagger: 0.08 })

  return (
    <section
      id="played-at"
      aria-label={t.venues.aria}
      className="py-20 md:py-28 px-6 border-y border-border-subtle bg-bg-primary"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-accent mb-3">
            {t.venues.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.08em]">
            {t.venues.title}
          </h2>
        </div>

        {/* Grid por ciudad */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {venuesByCity.map(({ city, venues }) => (
            <div key={city}>
              <h3 className="font-display text-lg md:text-xl tracking-[0.06em] text-text-primary mb-2">
                {city}
              </h3>
              <div className="w-8 h-px bg-accent/50 mb-5" />
              <ul className="space-y-3">
                {venues.map(v => (
                  <li
                    key={v}
                    className="text-sm text-text-secondary tracking-wide hover:text-text-primary transition-colors duration-300"
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
