import { useLang } from '../context/LanguageContext'

export default function NowhereTraveler() {
  const { t } = useLang()

  const pillars = [
    { icon: '◉', title: t.nowhere.pillar_sonic },
    { icon: '◎', title: t.nowhere.pillar_performative },
    { icon: '◈', title: t.nowhere.pillar_visual },
  ]

  return (
    <section id="nowhere" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(235,62,52,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(235,62,52,0.15) 0%, transparent 50%)',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em]">
              {t.nowhere.title}
            </h2>
            <span className="text-xs tracking-[0.2em] uppercase text-accent border border-accent rounded-full px-3 py-1">
              {t.nowhere.badge}
            </span>
          </div>
          <p className="text-lg text-text-secondary italic">
            {t.nowhere.subtitle}
          </p>
        </div>

        {/* Description + Quote */}
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-text-secondary leading-relaxed text-center mb-8">
            {t.nowhere.description}
          </p>
          <blockquote className="border-l-2 border-accent pl-6 py-2">
            <p className="text-text-primary italic text-lg">
              {t.nowhere.quote}
            </p>
          </blockquote>
        </div>

        {/* Pillars */}
        <div className="mb-8">
          <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-text-muted mb-8 text-center">
            {t.nowhere.pillars_title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div key={i} className="glass rounded-lg p-6 float">
                <span className="text-accent text-2xl block mb-4">{pillar.icon}</span>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pillar.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
