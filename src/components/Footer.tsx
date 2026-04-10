import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="py-12 px-6 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#home" className="hover:opacity-80 transition-opacity">
          <img src="/images/spin-logo.png" alt="Spin" className="h-6 w-auto opacity-50 hover:opacity-80 transition-opacity" />
        </a>

        <div className="flex items-center gap-6">
          {[
            { href: '#music', label: t.nav.music },
            { href: '#story', label: t.nav.story },
            { href: '#gallery', label: t.nav.gallery },
            { href: '#contact', label: t.nav.contact },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.12em] uppercase text-text-muted hover:text-text-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Spin &mdash; {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
