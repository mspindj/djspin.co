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
- **Pendiente:** Optimizar logo PNG (5.7MB → WebP o SVG)
- **Pendiente:** Agregar favicon con logo Spin
