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

## Jornada 2026-07-20 — Copy con lente Hormozi + SEO

### Contexto
Sesión 1 + 1.5 estaba sin commitear pese a estar documentada como hecha. Se verificó (build, preview, DOM), se limpiaron 3 covers `.webp` huérfanas y se commiteó (`f6f5e3e`). Prod confirmado sano: el CDN de Bandcamp sirve las covers (el 0-de-16 en preview headless era solo lazy-load que no dispara sin scroll visual real, no un bloqueo).

### Decisión de fondo: Hormozi como diagnóstico, no como voz
Aplicar el *tono* de Hormozi (value-stacking con precios ficticios, garantías tipo "o te devuelvo la plata", countdown de urgencia, "serías tonto en decir que no") habría roto la estética techno/cinematográfica y espantado al público real (bookers de venues, curadores de eventos boutique, que convierten por criterio y credibilidad). Se usó el **diagnóstico** del Value Equation, no el copy:
- **Perceived Likelihood** (palanca más débil): la prueba estaba enterrada en `bio_3` como párrafo corrido. Se sacó a la superficie con un stat nuevo de alcance ("4 países · Bogotá · Barcelona · Ibiza · CDMX") y bio reescrita que lidera con lo que Spin hace por la noche, no con auto-descripción.
- **Reducir fricción/riesgo del booker**: la sección Bookings ahora abre con el primer paso de bajo compromiso ("Cuéntame el espacio, la fecha y a quién quieres en la pista. Te devuelvo una propuesta de set pensada para esa noche."), formatos disponibles (DJ set / Nowhere Traveler live, EPK y rider listos) y promesa de respuesta (<48h). Ese es el equivalente elegante de una garantía.
- **Hero**: subtitle pasó de auto-descripción ("+20 años de narrativa sonora elegante") a outcome + prueba geográfica ("Sonido que lee la noche. Más de veinte años en cabina, de Bogotá a Ibiza.").

### SEO (adelanto de Sesión 5)
- `index.html`: JSON-LD `MusicGroup` (name Spin, alternateName Miguel Espinosa, genre, foundingLocation Bogotá, member Person, 5 `sameAs`: IG/FB/YT/SoundCloud/Bandcamp). Meta description reescrita con keywords de booking + geografía. Canonical, OG completo (title/desc/image/locale es_ES + alternate en_US), Twitter summary_large_image.
- `public/og-image.jpg` (1200×630, 55KB) generada con `sips` desde `spin-hero.jpeg`. **Nota:** OG image en JPG (no WebP) por compatibilidad con FB/LinkedIn.
- `public/robots.txt` + `public/sitemap.xml` (una sola URL, es SPA de una página).

### humanizalo aplicado
- Regla de no-raya (—): el footer usaba `&mdash;` en texto visible → cambiado a `&middot;` (·). Los em-dash restantes en `src/` son comentarios de código, no texto entregado, se dejaron.
- Copy ES sin relleno, tuteo neutro, primera persona. El patrón "no X, sino Y" aparece una sola vez (posicionamiento genuino ya existente), no como tic.
- Verificado en DOM: `document.body.innerText.includes('—')` === false.

### Nueva key i18n
- `story.reach_value` / `story.reach_label` (stat de alcance)
- `contact.offer_line` / `contact.offer_response` (bloque de oferta en Bookings)

### Pendientes derivados
- **Botón "Descargar press kit"** en Bookings: se dejó fuera porque el único EPK es `docs/Spin EPK 2022.pdf` (desactualizado, fuera de `public/`). Va con Sesión 4 (EPK digital).
- **Peso muerto en repo**: los `.jpeg` originales y `cover-*.jpg` en `public/images/` siguen tracked pero ya nadie los referencia (todo usa `.webp` + CDN Bandcamp). Limpiar en algún commit de mantenimiento.
- Verificar en prod que la og-image renderiza bien al compartir el link (probar con el debugger de Facebook/LinkedIn).

## Jornada 2026-07-20 — Sesión 2: player nativo + Story rica

### Corrección al roadmap (premisa obsoleta)
El roadmap de Sesión 2 pedía "embed Bandcamp por EP reemplazando la lista de texto plano". Esa premisa era de antes de la mini-iteración 1.5: ya no hay lista de texto plano, hay la grilla `Discography` de 16 releases. Meter 16 iframes de Bandcamp habría sido pesadísimo y roto la estética. Decisión: **no reemplazar la grilla**, agregar un **player destacado** (un solo embed del EP más reciente) arriba de los filtros para escuchar sin salir del sitio.

### Album IDs de Bandcamp (para embeds)
El embed necesita el id numérico del álbum, NO el slug ni el coverId. Se saca del HTML crudo (curl), del atributo `data-tralbum` (`&quot;id&quot;:NNNN`) o del `EmbeddedPlayer/v=2/album=NNNN`. WebFetch NO sirve (convierte a markdown y pierde el JSON). IDs confirmados:
- Into Your Spell EP (dic 2024): `633052668`  ← destacado en el player
- Don't Know Yet EP (nov 2024): `1463701055`
- Play Tha Bass EP (oct 2024): `2536298805`
Guardados como `albumId?` en los 3 EPs de `releases` en `Discography.tsx`. El destacado es `releases.find(EP && albumId)`.

### Embed Bandcamp: patrón y theming
`https://bandcamp.com/EmbeddedPlayer/album=<ID>/size=large/bgcol=0a0a0f/linkcol=eb3e34/tracklist=true/transparent=true/`
- `bgcol`/`linkcol` en hex SIN `#`. bg = bg-primary (`0a0a0f`), link = accent (`eb3e34`).
- iframe con `loading="lazy"`, `height: 470` para large con tracklist, `<a>` de fallback adentro.
- Endpoints verificados HTTP 200 vía curl (los 3).

### Venues: marquee → grid por ciudad (decisión de Miguel)
Se **retiró `VenueMarquee.tsx`** y se creó `Venues.tsx`: grid de 4 columnas por ciudad (Bogotá / Barcelona / Ibiza / Ciudad de México) con los venues como lista + divisor accent. Más útil para un booker (formato EPK escaneable) que la banda animada. Razón: el marquee iba justo antes de Story; sumar un grid de venues habría duplicado los 11 venues dos veces seguidas. Actualizado `App.tsx` (import + uso).

### Story rica
- **bio_3 reescrita**: ya no lista los venues (ahora están en el grid `Venues`). Pasó a una línea de trayectoria que complementa el grid sin duplicar ("de cabinas underground en Bogotá a clubs y radios en Barcelona, Ibiza y Ciudad de México").
- **Sticky image**: en Story la columna de imagen es `lg:sticky lg:top-28` mientras la bio hace scroll (desktop). CSS puro, sin JS, seguro en headless. El grid pasó de `items-center` a `items-start` (requisito de sticky).

### Timeline de carrera: DIFERIDO (falta data real)
El roadmap pedía "timeline visual de carrera" pero no hay fechas de hitos documentadas. Inventar viola la regla de no fabricar datos. **Pendiente de Miguel**: pasar hitos con año (cuándo empezó a pinchar, primera residencia, mudanza a Barcelona, fecha de Ibiza Global Radio, primeros releases, etc.) para construirlo en una próxima sesión.

### Pendientes derivados Sesión 2
- **CSS muerto**: `@keyframes marquee`, `.animate-marquee`, `.mask-fade` en `globals.css` quedaron sin uso tras borrar el marquee. Limpiar en mantenimiento (se dejó para no tocar el `@theme` sin necesidad).
- **Timeline** pendiente de data (ver arriba).
- Considerar más adelante: al filtrar por Singles, el player destacado (que es un EP) sigue visible arriba. Es coherente (siempre muestra el release insignia) pero si molesta, condicionar a `filter !== 'single'`.
