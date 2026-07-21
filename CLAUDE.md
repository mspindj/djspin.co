# CLAUDE.md — djspin.co

## Stack técnico
- **Framework:** React 19 + Vite 8 + TypeScript 6
- **Styling:** Tailwind CSS 4 (vía @tailwindcss/vite plugin, usa `@theme` para tokens)
- **Animaciones:** CSS keyframes (hero) + IntersectionObserver (scroll reveal). NO GSAP
- **i18n:** React Context + JSON files (src/i18n/es.json, en.json). Sin librería externa
- **Contacto:** Resend API vía Vercel serverless function (api/contact.ts)
- **Deploy:** Vercel (auto-deploy desde GitHub main) → djspin.co
- **Repo:** git@github.com:mspindj/djspin.co.git

## Comandos frecuentes
```bash
npm run dev          # Dev server en localhost:5173
npm run build        # Build producción (tsc + vite build)
npx vite preview     # Preview del build
git push             # Auto-deploya en Vercel
```

## Convenciones del proyecto
- **Componentes:** Un archivo por sección (Hero.tsx, Music.tsx, Story.tsx, etc.)
- **Colores:** CSS custom properties en `@theme` de globals.css, referenciados como `text-text-primary`, `bg-bg-secondary`, etc.
- **Tipografía:** Archivo Black para display/logo, Inter para body (Inter vía Google Fonts CDN, Archivo Black self-hosted)
- **Imágenes:** En public/images/, nombres con prefijo `spin-` (spin-hero.jpeg, spin-booth.jpeg, etc.)
- **Logo:** public/images/spin-logo.png (blanco con transparencia, ~5.7MB, pendiente optimizar)
- **Traducciones:** Toda string visible al usuario va en es.json/en.json, nunca hardcodeada
- **Español:** Usar siempre tildes, eñes y caracteres correctos. Pasar por /humanizalo antes de escribir contenido

## Decisiones de arquitectura

### GSAP removido, usar CSS + IntersectionObserver
GSAP ScrollTrigger no funciona en preview headless de Vercel/Claude Preview. Las animaciones de scroll se implementan con IntersectionObserver nativo que agrega clases CSS `.will-animate` → `.animated`. El hero usa CSS `@keyframes fadeUp`.

### Scroll animations solo en children, no en sections
Si se aplica opacity:0 a una sección entera vía JS y el IntersectionObserver no dispara (headless, prefers-reduced-motion), todo el contenido queda invisible. Las secciones siempre son visibles; solo los cards/grids hijos usan el hook `useScrollAnimation({ children: true })`.

### Tailwind 4 con @theme (no tailwind.config.ts)
Tailwind 4 usa `@theme` en CSS para definir tokens en lugar del archivo tailwind.config.ts. Los colores custom se definen como `--color-bg-primary`, `--color-accent`, etc. en globals.css.

### Single Page App (no router)
Todas las secciones están en App.tsx como una sola página con anchor links. Smooth scroll vía JS en Navbar. No hay React Router.

### Vercel serverless para contacto
La API de contacto (api/contact.ts) usa @vercel/node types y llama a Resend. La env var `RESEND_API_KEY` debe estar configurada en Vercel.

## Errores conocidos a evitar
- **NO usar `gsap.set()` para initial state.** Deja elementos invisibles si la animación no dispara.
- **NO aplicar useScrollAnimation a `<section>` directamente.** Solo a divs internos con `children: true`.
- **Tailwind 4:** No existe `tailwind.config.ts`, toda la configuración va en CSS con `@theme`.
- **Preview tool:** No soporta scroll ni IntersectionObserver. Verificar con `preview_snapshot` (accessibility tree) en lugar de screenshots para contenido below-the-fold.
- **Git push:** Requiere SSH key configurada en GitHub. HTTPS no funciona sin token.
- **Contenido en español:** Siempre usar tildes y caracteres correctos (á, é, í, ó, ú, ñ, ü). Pasar el contenido por /humanizalo para que suene natural y no a IA.

## Estado actual del proyecto
- Sitio completo y deployado en Vercel
- Dominio djspin.co configurado (DNS apuntando a Vercel)
- Logo Spin blanco integrado en nav, hero y footer
- Playlist Deepsidency de SoundCloud embebida en sección Música
- Formulario de contacto conectado a Resend
- Bilingüe ES/EN funcional con toggle en navbar
- **Pendiente:** Agregar favicon con logo Spin

## Jornada 2026-06-01 — Sesión 1 de rediseño profundo

### Goal del rediseño (acordado con Miguel)
3 metas balanceadas: bookings + audiencia musical + EPK digital. Orden de impacto:
1. Fix logo + jerarquía CTA  ✅ hecho
2. Player nativo de tracks (Sesión 2)
3. Social proof de venues  ✅ hecho (marquee)
4. Bio rica con timeline + venues por ciudad (Sesión 2)

### Cambios ejecutados Sesión 1
- **Optimización masiva de imágenes**: 50MB → 2.2MB (23× más liviano)
  - WebP via `cwebp -q 82 -resize 1920 0`. Logo en lossless 800w (5.5MB→14KB)
  - Originales backupeados en `public/images/.originals/`
  - Refs en código actualizadas vía sed (Hero, Story, Gallery, Music, Navbar, Footer)
- **Hero CTA invertido**: BOOKINGS ahora primary (rojo), ESCUCHAR secondary (ghost). Goal del sitio explícito en el fold.
- **Nuevo `VenueMarquee.tsx`**: marquee infinito con los 11 venues reales sacados de `story.bio_3` (Baum, Billares Londres, Octava, Radio Berlín, Hotel W Bogotá, City Hall BCN, Macarena BCN, Hotel W BCN, Ibiza Global Radio, AM CDMX, DJ World Conference). Insertado entre NowhereTraveler y Story. Animación CSS `@keyframes marquee` con `prefers-reduced-motion` honrado, pausa en hover, mask-fade en los bordes.
- **Music covers → URLs por EP**: cada release card ahora linkea a `mspin.bandcamp.com/album/<slug>` específico, no al perfil. Botón play overlay aparece en hover. Marcado `TODO @miguel` para verificar slugs reales.
- **i18n**: nuevas keys `venues.{eyebrow, title, aria}` en es/en.

### Decisiones tomadas Sesión 1
- **NO usar componentes 21st.dev SaaS** (testimonial sliders, pricing tables, feature grids con iconos lucide, animated beams). Romperían la estética techno/cinematográfica. Solo se usaron patrones de marquee, play overlay y bento-grid intent — escritos a mano con tokens propios del design system.
- **VenueMarquee con animación CSS pura**, sin lib externa. Misma decisión que el resto del proyecto (no GSAP).
- **Venues sacados de la bio existente**, no inventados. La info ya estaba en `bio_3` enterrada en párrafo.

### Bug encontrado y resuelto
- `node_modules` quedó con binarios nativos de rolldown de otra máquina post-migración mini. `npm install` limpio lo arregló. Si el build falla con `MODULE_NOT_FOUND` en `rolldown/dist/shared/binding-*.mjs`, reinstalar.

### Roadmap restante (Sesiones 2-5)
- **Sesión 2 — Player nativo + Story rica**
  - Embed Bandcamp por EP (iframe con preview de 30s por track) reemplazando la lista de texto plano
  - Story refactor: sticky scroll reveal cinematográfico; venues por ciudad como chips/grid; timeline visual de carrera
  - Verificar URLs reales de cada EP (Miguel pasa slugs o las saca el agente vía API de Bandcamp)
- **Sesión 3 — Agenda + Gallery con contexto**
  - Nueva sección Agenda con próximos eventos (incluso si dice "TBA — Apply for residency")
  - Gallery: cada foto con caption (venue + fecha + evento). Lightbox con metadata.
- **Sesión 4 — EPK digital completo**
  - Reemplazar `docs/Spin EPK 2022.pdf` con sección web dedicada
  - Bio rica, fotos hi-res descargables (con botón "Download press kit"), tech rider, riders de stage, contacto management
- **Sesión 5 — Pulido + perf + SEO**
  - Open Graph images, meta tags por idioma, sitemap.xml, JSON-LD MusicGroup
  - Auditoría Lighthouse, accessibility pass (focus rings, ARIA), tests de prefers-reduced-motion

### Pendientes derivados Sesión 1
- Logo PNG en `.originals/` se puede borrar después de validar que .webp funciona en producción
- `images/.originals/` (50MB) NO debe commitearse a git — agregar a .gitignore ✅ hecho

### Mini-iteración 1.5 — Discografía completa (mismo día)

Miguel pasó `mspin.bandcamp.com` como fuente. Resultado:

- **Scrapeado el catálogo completo** vía WebFetch: 16 releases reales (3 EPs + 13 singles), con título, slug `/album/...` o `/track/...`, y coverId del CDN de Bandcamp.
- **`Music.tsx` eliminado**. Reemplazado por `Discography.tsx` que:
  - Lista los 16 releases en grilla 2/3/4 columnas (mobile/tablet/desktop)
  - Filtros con chips: Todo (16) / EPs (3) / Singles (13) con conteo y estado activo
  - Cada card linkea al release específico (`mspin.bandcamp.com/album/...` o `/track/...`)
  - EPs ordenados primero, con badge `EP` rojo en esquina top-left de la cover
  - Hover: play button rojo con glow + scale-up de la cover
  - Covers servidas directo del CDN de Bandcamp en tamaño `_10` (1200x1200 retina)
  - Mantiene el CTA al final que lleva al perfil completo
- **Bandcamp CDN pattern documentado**: `https://f4.bcbits.com/img/<coverId>_<size>.jpg`. Sizes: `_2` (350px), `_5` (700px), `_10` (1200px), `_16` (1500px).
- **Tracklist hardcodeado eliminado** (esos 6 títulos eran subset de los singles reales, ahora redundantes).
- **Bug del Navbar**: "Nowhere Traveler" wrappeaba en widths 768-1024 colapsando el layout. Fix: subir breakpoint del desktop nav de `md:` a `lg:`, hamburger visible hasta `lg:`. Agregado `whitespace-nowrap` por las dudas.

### Convención nueva: scrapear vs hardcodear catálogos
Cuando el catálogo de Bandcamp/Soundcloud cambie, NO actualizar a mano:
1. Re-scrapear `https://mspin.bandcamp.com/` con WebFetch pidiendo JSON
2. Para covers/años faltantes, parallel-fetch de cada release individual
3. Pegar el array resultante en `releases` de `Discography.tsx`
4. Verificar build → preview → DOM eval del contador (`#music [role="tab"]`)
