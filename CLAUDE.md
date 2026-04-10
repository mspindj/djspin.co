# CLAUDE.md — djspin.co

## Stack Tecnico
- **Framework:** React 19 + Vite 8 + TypeScript 6
- **Styling:** Tailwind CSS 4 (via @tailwindcss/vite plugin, usa `@theme` para tokens)
- **Animaciones:** CSS keyframes (hero) + IntersectionObserver (scroll reveal) — NO GSAP
- **i18n:** React Context + JSON files (src/i18n/es.json, en.json) — sin libreria externa
- **Contacto:** Resend API via Vercel serverless function (api/contact.ts)
- **Deploy:** Vercel (auto-deploy desde GitHub main) → djspin.co
- **Repo:** git@github.com:mspindj/djspin.co.git

## Comandos Frecuentes
```bash
npm run dev          # Dev server en localhost:5173
npm run build        # Build produccion (tsc + vite build)
npx vite preview     # Preview del build
git push             # Auto-deploya en Vercel
```

## Convenciones del Proyecto
- **Componentes:** Un archivo por seccion (Hero.tsx, Music.tsx, Story.tsx, etc.)
- **Colores:** Definidos como CSS custom properties en `@theme` de globals.css, referenciados como `text-text-primary`, `bg-bg-secondary`, etc.
- **Tipografia:** Archivo Black para display/logo, Inter para body (Inter via Google Fonts CDN, Archivo Black self-hosted)
- **Imagenes:** En public/images/, nombres con prefijo `spin-` (spin-hero.jpeg, spin-booth.jpeg, etc.)
- **Logo:** public/images/spin-logo.png (blanco con transparencia, ~5.7MB — pendiente optimizar)
- **Traducciones:** Toda string visible al usuario va en es.json/en.json, nunca hardcodeada

## Decisiones de Arquitectura

### GSAP removido — usar CSS + IntersectionObserver
**Razon:** GSAP ScrollTrigger no funciona en preview headless de Vercel/Claude Preview. Las animaciones de scroll se implementan con IntersectionObserver nativo que agrega clases CSS `.will-animate` → `.animated`. El hero usa CSS `@keyframes fadeUp` directamente.

### Scroll animations solo en children, no en sections
**Razon:** Si se aplica opacity:0 a una seccion entera via JS y el IntersectionObserver no dispara (headless, prefers-reduced-motion), todo el contenido queda invisible. Las secciones siempre son visibles; solo los cards/grids hijos usan el hook `useScrollAnimation({ children: true })`.

### Tailwind 4 con @theme (no tailwind.config.ts)
Tailwind 4 usa `@theme` en CSS para definir tokens en lugar del archivo tailwind.config.ts. Los colores custom se definen como `--color-bg-primary`, `--color-accent`, etc. en globals.css.

### Single Page App (no router)
Todas las secciones estan en App.tsx como una sola pagina con anchor links. Smooth scroll via JS en Navbar. No hay React Router.

### Vercel serverless para contacto
La API de contacto (api/contact.ts) usa @vercel/node types y llama a Resend directamente. La env var `RESEND_API_KEY` debe estar configurada en Vercel.

## Errores Conocidos a Evitar
- **NO usar `gsap.set()` para initial state** — deja elementos invisibles si la animacion no dispara
- **NO aplicar useScrollAnimation a `<section>` directamente** — solo a divs internos con `children: true`
- **Tailwind 4:** No existe `tailwind.config.ts`, toda la configuracion va en CSS con `@theme`
- **Preview tool:** No soporta scroll ni IntersectionObserver — verificar con `preview_snapshot` (accessibility tree) en lugar de screenshots para contenido below-the-fold
- **Git push:** Requiere SSH key configurada en GitHub — HTTPS no funciona sin token

## Estado Actual del Proyecto
- Sitio completo y deployado en Vercel
- Dominio djspin.co configurado (DNS apuntando a Vercel)
- Logo Spin blanco integrado en nav, hero y footer
- Playlist Deepsidency de SoundCloud embebida en seccion Musica
- Formulario de contacto conectado a Resend
- Bilingue ES/EN funcional con toggle en navbar
- **Pendiente:** Optimizar logo PNG (5.7MB → WebP o SVG)
- **Pendiente:** Agregar favicon con logo Spin
