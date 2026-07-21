import { useLang } from '../context/LanguageContext'

// Venues reales tomados de la bio (story.bio_3).
// Agrupados por ciudad. Si se agregan más, mantener el orden geográfico.
const venuesByCity = [
  { city: 'Bogotá', venues: ['Baum', 'Billares Londres', 'Octava', 'Radio Berlín', 'Hotel W'] },
  { city: 'Barcelona', venues: ['City Hall', 'Macarena', 'Hotel W'] },
  { city: 'Ibiza', venues: ['Ibiza Global Radio'] },
  { city: 'CDMX', venues: ['AM', 'DJ World Conference'] },
]

// Aplanado para el marquee
const allVenues = venuesByCity.flatMap(({ city, venues }) =>
  venues.map(v => ({ name: v, city }))
)

export default function VenueMarquee() {
  const { t } = useLang()

  return (
    <section
      id="played-at"
      aria-label={t.venues.aria}
      className="py-20 md:py-24 px-6 border-y border-border-subtle bg-bg-primary relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-accent mb-3">
            {t.venues.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.08em]">
            {t.venues.title}
          </h2>
        </div>

        {/* Marquee row 1 — left */}
        <div
          className="relative flex overflow-hidden mask-fade"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          }}
        >
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {[...allVenues, ...allVenues].map((v, i) => (
              <VenueItem key={`m1-${i}`} name={v.name} city={v.city} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VenueItem({ name, city }: { name: string; city: string }) {
  return (
    <div className="flex items-center gap-6 px-8 group">
      <span className="font-display text-2xl md:text-3xl tracking-[0.04em] text-text-primary/80 group-hover:text-accent transition-colors duration-500">
        {name}
      </span>
      <span className="text-[10px] tracking-[0.25em] uppercase text-text-muted">
        {city}
      </span>
      <span className="text-accent/40 text-2xl select-none">◆</span>
    </div>
  )
}
