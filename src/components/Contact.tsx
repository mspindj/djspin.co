import { useState, type FormEvent } from 'react'
import { useLang } from '../context/LanguageContext'

const socials = [
  { name: 'Instagram', url: 'https://instagram.com/mspindj', icon: 'M7.8 2h8.4C19 2 22 5 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C5 22 2 19 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z' },
  { name: 'Facebook', url: 'https://facebook.com/mspindj', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { name: 'YouTube', url: 'https://youtube.com/user/mspindj', icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
  { name: 'SoundCloud', url: 'https://soundcloud.com/mspindj', icon: 'M1 18v-3m3 3v-5m3 5V9m3 9V6m3 12V9m3 3v6m3-8v8m3-11v11' },
]

export default function Contact() {
  const { t } = useLang()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 px-6 bg-bg-secondary">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] mb-4">
            {t.contact.title}
          </h2>
          <p className="text-text-secondary">{t.contact.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs tracking-[0.15em] uppercase text-text-muted mb-2">
                {t.contact.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-bg-surface border border-border-subtle rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-text-muted mb-2">
                {t.contact.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-bg-surface border border-border-subtle rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs tracking-[0.15em] uppercase text-text-muted mb-2">
              {t.contact.subject}
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="w-full bg-bg-surface border border-border-subtle rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
            >
              <option value="booking">{t.contact.subject_booking}</option>
              <option value="press">{t.contact.subject_press}</option>
              <option value="other">{t.contact.subject_other}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs tracking-[0.15em] uppercase text-text-muted mb-2">
              {t.contact.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full bg-bg-surface border border-border-subtle rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-8 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 glow-hover"
          >
            {status === 'sending' ? t.contact.sending : t.contact.send}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-sm text-center">{t.contact.success}</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm text-center">{t.contact.error}</p>
          )}
        </form>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mt-12">
          {socials.map(social => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors duration-300"
              aria-label={social.name}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={social.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
