import { useLang } from '../context/LanguageContext'

export default function Story() {
  const { t } = useLang()

  return (
    <section id="story" className="py-24 md:py-32 px-6 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg float">
              <img
                src="/images/spin-story.jpeg"
                alt="Spin - Miguel Espinosa"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 to-transparent" />
            </div>
            {/* Decorative accent line */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-accent/20 rounded-lg -z-10" />
          </div>

          {/* Text */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-2">
              {t.story.title}
            </h2>
            <p className="text-accent text-sm tracking-[0.15em] uppercase font-medium mb-8">
              {t.story.name}
            </p>

            <div className="space-y-5 text-text-secondary leading-relaxed mb-10">
              <p>{t.story.bio_1}</p>
              <p>{t.story.bio_2}</p>
              <p>{t.story.bio_3}</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: t.story.years, label: t.story.location },
                { value: t.story.genres, label: '' },
              ].map(stat => (
                <div key={stat.value} className="border-l-2 border-accent/30 pl-4">
                  <div className="font-display text-lg tracking-wide">{stat.value}</div>
                  {stat.label && (
                    <div className="text-xs text-text-muted tracking-widest uppercase mt-1">
                      {stat.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
