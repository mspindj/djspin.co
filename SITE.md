# SITE.md — djspin.co

## Overview
Single-page artist portfolio for **Spin** (Miguel Espinosa), DJ and sonic curator based in Bogota, Colombia. 20+ years in electronic music. Dark luxury aesthetic ("Antigravity Design"). Bilingual ES/EN. Deployed on Vercel at djspin.co.

## Architecture
- **Type:** SPA (Single Page Application) — no router
- **Sections:** 7 content sections + sticky nav + footer
- **Navigation:** Anchor links with smooth scroll
- **i18n:** ES/EN toggle persisted in localStorage
- **Responsive:** Mobile-first, breakpoints at 375px, 768px, 1024px, 1440px

---

## Global Components

### Navbar
- **Position:** Fixed top, z-50
- **Style:** Transparent on top, glassmorphism (`glass-strong`) after 50px scroll
- **Content:** Logo (spin-logo.png, h-8) left | Nav links center | Lang toggle + hamburger right
- **Links:** Inicio, Musica, Deepsidency, Nowhere Traveler, Historia, Galeria, Contacto
- **Mobile:** Hamburger icon with animated bars, slide-down glassmorphism panel
- **Lang toggle:** Button showing opposite language ("EN" when in ES, "ES" when in EN)

### Footer
- **Style:** Border-top subtle, minimal
- **Content:** Logo (opacity 50%) | Quick links (Music, Story, Gallery, Contact) | Copyright year

---

## Sections (in scroll order)

### 1. Hero (`#home`)
- **Layout:** Full viewport (100vh), centered content
- **Background:** EPK B&W photo (`spin-hero.jpeg`) with parallax (0.3x scroll rate), scale 1.1
- **Overlay:** Gradient from bg-primary/70 via bg-primary/50 to bg-primary (solid bottom)
- **Content:**
  - Logo image (`spin-logo.png`, h-28 md:h-40)
  - Tagline: "House. Deep. Progressive." (tracking-wide, uppercase)
  - Subtitle: "+20 anos de narrativa sonora elegante desde Bogota"
  - Two CTAs: "Escuchar" (accent bg, scrolls to #music) + "Bookings" (ghost border, scrolls to #contact)
- **Animation:** CSS `@keyframes fadeUp` with staggered delays (0.2s, 0.4s, 0.6s, 0.8s)
- **Scroll indicator:** Bouncing chevron at bottom center

### 2. Music (`#music`)
- **Layout:** Centered, max-w-6xl
- **Header:** Title + subtitle centered
- **Releases grid:** 3 columns (1 on mobile), glassmorphism cards with float hover
  - Into Your Spell EP (2023) — cover art
  - Don't Know Yet EP (2022) — cover art
  - Play Tha Bass EP (2021) — cover art
  - Each card links to Bandcamp, image with scale hover
- **Track list:** Glass card, 2 columns, 6 tracks with numbered index (01-06)
  - Some Other Things, Deeper Shade Of Love, Majestic Guardian, Sin On Sin, Path of Reason and Sense, Wider Truth
- **CTA:** "Apoyar en Bandcamp" border button with external link icon
- **Animation:** Staggered entrance on card children via IntersectionObserver

### 3. Deepsidency (`#deepsidency`)
- **Background:** bg-secondary
- **Layout:** 2 columns (stack on mobile) — text left, embed right
- **Left column:**
  - Accent label: "Serie mensual de sets curados"
  - Title: "Deepsidency"
  - Description paragraph + audience quote (italic, muted)
  - CTA: "Escuchar en SoundCloud" (accent bg + external icon)
- **Right column:**
  - SoundCloud playlist iframe embed (450px height) in glass card
  - Genre tags: Melodic House, Indie Dance, Progressive House, Deep House, Organic House (pill badges)
- **Animation:** Staggered children on right column

### 4. Nowhere Traveler (`#nowhere`)
- **Background:** Subtle radial gradient accents (accent color at 20% and 80% x-position, very low opacity)
- **Layout:** Centered, max-w-6xl
- **Header:** Title "Nowhere Traveler" + "Live" badge (accent border pill)
- **Subtitle:** Italic, secondary text
- **Body:**
  - Description paragraph centered
  - Blockquote with accent left border
- **Pillars:** 3 glass cards with icons (geometric Unicode)
  - Sonic: sound exploration
  - Performative: live performance
  - Visual: visual art integration
- **CTA:** "nowheretraveler.com" ghost button linking to external site

### 5. Story (`#story`)
- **Background:** bg-secondary
- **Layout:** 2 columns — photo left, text right (stack on mobile)
- **Left column:** EPK photo (`spin-story.jpeg`) in rounded container with float, gradient overlay bottom, decorative accent border element offset behind
- **Right column:**
  - Title: "Historia" / "Story"
  - Subtitle: "Miguel Espinosa a.k.a. Spin" (accent colored)
  - Bio: 3 paragraphs (first person, clubs history, artistic vision)
  - Stats: "+20 anos" with location, genres listed — accent left borders

### 6. Gallery (`#gallery`)
- **Layout:** Centered, max-w-6xl
- **Header:** Title + subtitle centered
- **Grid:** 2 cols mobile, 3 cols desktop, gap-3/gap-4
- **Images (6):** spin-booth, spin-booth-2, spin-crowd, spin-graffiti, spin-graffiti-2, spin-story-2
  - Aspect ratio 4:3
  - Hover: scale 1.1 + dark overlay + glass "View" pill
  - Click: Opens lightbox
- **Lightbox:** Full-screen overlay (bg-primary/95), close button top-right, image max 85vh
- **Animation:** Staggered grid children via IntersectionObserver

### 7. Contact (`#contact`)
- **Background:** bg-secondary
- **Layout:** Centered, max-w-2xl
- **Header:** Title + subtitle centered
- **Form (glass card):**
  - Name + Email (2 cols on desktop)
  - Subject dropdown: Booking, Press, Curaduria sonora, Other
  - Message textarea (5 rows)
  - Submit button (full width, accent bg, uppercase tracking)
  - Status messages: sending spinner, success (green), error (red)
- **API:** POST /api/contact → Vercel serverless → Resend → mspindj@gmail.com
- **Social links:** Instagram, Facebook, YouTube, SoundCloud (SVG icons, muted → accent on hover)

---

## Design System Summary
- **Theme:** Dark luxury, "Antigravity Design"
- **Colors:** Ultra-dark backgrounds (#0A0A0F, #12121A), light text (#F7F7F7), red accent (#EB3E34)
- **Typography:** Archivo Black (display), Inter (body)
- **Effects:** Glassmorphism (blur 16/24px), float hover (-8px + shadow), glow (accent shadow)
- **Animations:** fadeUp keyframes, scroll-bounce indicator, IntersectionObserver reveal, parallax hero
- **Spacing:** py-24 md:py-32 per section, px-6 padding, max-w-6xl containers

---

## Assets
- `/images/spin-hero.jpeg` — Hero background (B&W EPK)
- `/images/spin-logo.png` — Logo white on transparent (~5.7MB, needs optimization)
- `/images/spin-story.jpeg` — Bio section photo
- `/images/spin-story-2.jpeg` — Gallery photo
- `/images/spin-booth.jpeg` — DJ booth photo
- `/images/spin-booth-2.jpeg` — Live set photo
- `/images/spin-crowd.jpeg` — Crowd photo
- `/images/spin-graffiti.jpeg` — Portrait photo
- `/images/spin-graffiti-2.jpeg` — Portrait closeup
- `/images/cover-into-your-spell.jpg` — EP cover art
- `/images/cover-dont-know-yet.jpg` — EP cover art
- `/images/cover-play-tha-bass.jpg` — EP cover art
- `/fonts/ArchivoBlack-Regular.woff2` — Display font
