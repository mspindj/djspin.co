import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const images = [
  { src: '/images/spin-booth.jpeg', alt: 'Spin DJ booth' },
  { src: '/images/spin-booth-2.jpeg', alt: 'Spin live set' },
  { src: '/images/spin-crowd.jpeg', alt: 'Crowd at Spin set' },
  { src: '/images/spin-graffiti.jpeg', alt: 'Spin portrait' },
  { src: '/images/spin-graffiti-2.jpeg', alt: 'Spin portrait closeup' },
  { src: '/images/spin-story-2.jpeg', alt: 'Spin casual' },
]

export default function Gallery() {
  const { t } = useLang()
  const gridRef = useScrollAnimation<HTMLDivElement>({ children: true, stagger: 0.08 })
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      <section id="gallery" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-4">
              {t.gallery.title}
            </h2>
            <p className="text-text-secondary">{t.gallery.subtitle}</p>
          </div>

          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {images.map((img) => (
              <button
                key={img.src}
                onClick={() => setLightbox(img.src)}
                className="relative overflow-hidden rounded-lg aspect-[4/3] group cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-bg-primary/0 group-hover:bg-bg-primary/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="glass px-4 py-2 rounded-full text-xs tracking-widest uppercase">
                    View
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-bg-primary/95 flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
