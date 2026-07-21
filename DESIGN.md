# DESIGN.md — Spin Antigravity Design System 2026

## Stitch Project
- **Project:** Spin DJ Website 2026
- **Project ID:** `15786543283567023913`
- **Design System Asset:** `assets/9045527143196801622`
- **Theme:** Dark mode, accent #EB3E34, corners ROUND_FOUR
- **Fonts:** Space Grotesk (display/headlines), Inter (body/labels)
- **Creative Direction:** "The Kinetic Noir"

## Stitch Creative Direction (Auto-Generated)

> **"The Kinetic Noir"** — This design system mirrors the energy of a high-end club environment: dark, atmospheric, and punctuated by intense flashes of light. We move away from "template" layouts in favor of an **Editorial Bento** approach. By utilizing intentional asymmetry, layered glass textures, and expansive typography, we create an experience that feels less like a website and more like a premium digital lookbook.

### Key Stitch Rules
- **No-Line Rule:** No traditional dividers or solid 1px borders for sectioning. Use tonal transitions (background shifts) to define section boundaries.
- **Glass & Gradient Rule:** Ambient gradients using accent red-orange as blurred radial gradient (5-10% opacity) behind key content blocks. CTAs use subtle linear gradients, not flat fills.
- **Surface Hierarchy:** Treat UI as stacked semi-transparent plates — base layer (darkest + grain), mid layer (bento boxes with blur), top layer (active elements/modals).
- **Texture:** Persistent low-opacity film grain across entire UI for cinematic quality.
- **Typography as Identity:** Display text with extra-wide tracking (10-15%) mimicking high-fashion mastheads.

### Stitch Material Colors
| Token | Value |
|---|---|
| `background` | `#131318` |
| `surface` | `#131318` |
| `surface-container-low` | `#1b1b20` |
| `surface-container` | `#1f1f25` |
| `surface-container-high` | `#2a292f` |
| `surface-bright` | `#39383e` |
| `primary` | `#ffb4aa` |
| `primary-container` | `#ff5447` |
| `on-primary` | `#690004` |
| `on-surface` | `#e4e1e9` |
| `outline` | `#ab8984` |
| `outline-variant` | `#5c403c` |

---

## 1. Color Tokens

### Backgrounds
| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#0A0A0F` | Main page background |
| `bg-secondary` | `#12121A` | Alternating section backgrounds |
| `bg-surface` | `rgba(255,255,255, 0.04)` | Glass card fill |

### Accent
| Token | Value | Usage |
|---|---|---|
| `accent` | `#EB3E34` | Primary CTAs, highlights, active states |
| `accent-hover` | `#D42F25` | Hover state for accent elements |
| `accent-glow` | `rgba(235,62,52, 0.3)` | Glow shadow behind CTAs |

### Text
| Token | Value | Usage |
|---|---|---|
| `text-primary` | `#F7F7F7` | Headlines, body text |
| `text-secondary` | `rgba(247,247,247, 0.6)` | Subtitles, descriptions |
| `text-muted` | `rgba(247,247,247, 0.35)` | Labels, captions, metadata |

### Borders
| Token | Value | Usage |
|---|---|---|
| `border-subtle` | `rgba(255,255,255, 0.06)` | Dividers, list borders |
| `glass-border` | `rgba(255,255,255, 0.08)` | Glass card borders |

---

## 2. Typography

### Font Stack
- **Display:** Archivo Black (self-hosted woff2) — headlines, logo, section titles
- **Body:** Inter 300-700 (Google Fonts CDN) — body, labels, UI text

### Scale
| Element | Size | Weight | Tracking | Style |
|---|---|---|---|---|
| Section title | `4xl`/`5xl` (36-48px) | Archivo Black 400 | `0.08em` | — |
| Hero tagline | `lg`/`xl` (18-20px) | Inter 300 | `0.2em` | uppercase |
| Body text | `base`/`lg` (16-18px) | Inter 400 | normal | — |
| Label/caption | `xs` (12px) | Inter 500 | `0.15-0.2em` | uppercase |
| Stat value | `lg` (18px) | Archivo Black 400 | `0.05em` | — |

### 2026 Elevation: Editorial Typography
- Hero wordmark: Push to `8xl`+ (96px+) with `0.12em` tracking for dramatic impact
- Section titles: Consider variable weight animation on scroll entry
- Labels: Tighter, more condensed — experiment with `0.25em` tracking at 10px

---

## 3. Glassmorphism

### Standard Glass (`.glass`)
```css
backdrop-filter: blur(16px);
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.08);
```
**Used on:** Release cards, tracklist container, pillar cards, gallery hover overlay, contact form

### Strong Glass (`.glass-strong`)
```css
backdrop-filter: blur(24px);
background: rgba(10, 10, 15, 0.8);
border: 1px solid rgba(255, 255, 255, 0.08);
```
**Used on:** Navbar on scroll, mobile menu panel

### 2026 Elevation: Layered Glass
- Add secondary glass layer at lower blur (8px) behind primary for depth
- Experiment with colored glass tints: `rgba(235,62,52, 0.02)` for accent-adjacent cards
- Gradient borders: Replace solid borders with `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))` on featured cards

---

## 4. Shadows & Effects

### Float (`.float`)
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
```
**Hover state:** `transform: translateY(-8px)`, shadow deepened to `0 28px 70px rgba(0,0,0,0.5)`

### Glow (`.glow-hover`)
```css
/* On hover */
box-shadow: 0 0 40px rgba(235, 62, 52, 0.25);
```
**Used on:** Primary CTA buttons

### Card Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### 2026 Elevation
- **Ambient glow:** Soft radial gradients behind key sections at 3-5% opacity
- **Film grain overlay:** CSS noise texture via SVG filter or pseudo-element with grain pattern at 2-4% opacity
- **Gradient border glow:** Animated gradient border on focused inputs: `border-image: linear-gradient(var(--angle), #EB3E34, transparent) 1`

---

## 5. Animation Patterns

### Hero Entrance — `@keyframes fadeUp`
```css
from { opacity: 0; transform: translateY(30px); }
to { opacity: 1; transform: translateY(0); }
```
- Duration: 1s, ease-out
- Stagger: 0.2s increments per element (logo, tagline, subtitle, CTAs)

### Scroll Reveal — IntersectionObserver
```css
.will-animate {
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.will-animate.animated {
  opacity: 1; transform: translateY(0);
}
```
- Applied only to **children** of grid containers (never sections)
- Stagger: 0.08-0.12s delay between siblings

### Scroll Indicator — `@keyframes scroll-bounce`
```css
0%, 100% { transform: translateY(0); opacity: 1; }
50% { transform: translateY(10px); opacity: 0.5; }
```

### Parallax
- Hero background: `translateY(scrollY * 0.3)` with `scale(1.1)` base
- Uses `will-change: transform` and passive scroll listener

### 2026 Elevation
- **Scroll-driven animations:** Replace JS parallax with CSS `animation-timeline: scroll()` where supported
- **Spring physics:** Replace linear easing with `cubic-bezier(0.34, 1.56, 0.64, 1)` for elastic feel on card hover
- **Magnetic cursor:** Subtle pull effect on CTAs — buttons shift 2-4px toward cursor on mousemove
- **Stagger choreography:** Cascade reveals from center-out or directional (left-to-right) instead of uniform top-to-bottom
- **View transitions:** For language toggle, use View Transition API for seamless text swap

### Accessibility
- All animations respect `prefers-reduced-motion: reduce`
- Parallax and bounce animations fully disabled
- Float hover transform removed
- Transitions reduced to instant

---

## 6. Component Patterns

### Primary CTA (Filled)
```css
px-8 py-3 bg-accent hover:bg-accent-hover
text-white text-sm font-medium tracking-[0.15em] uppercase
transition-all duration-300 glow-hover
```

### Secondary CTA (Ghost)
```css
px-8 py-3 border border-text-muted
text-text-secondary hover:text-text-primary hover:border-text-primary
text-sm font-medium tracking-[0.15em] uppercase
transition-all duration-300
```

### External Link CTA (Border Accent)
```css
px-6 py-3 border border-accent text-accent
hover:bg-accent hover:text-white
text-sm font-medium tracking-[0.15em] uppercase
transition-all duration-300
```
Includes arrow icon (↗)

### Glass Card
```css
.glass rounded-lg p-6 .float
```
Content: image/cover + title + metadata

### Genre Tag Pill
```css
text-xs tracking-[0.1em] uppercase text-text-muted
border border-border-subtle rounded-full px-3 py-1
```

### Form Input
```css
w-full bg-bg-surface border border-border-subtle rounded
px-4 py-3 text-text-primary placeholder-text-muted
focus:outline-none focus:border-accent transition-colors
```

### Nav Link
```css
text-sm font-medium tracking-[0.15em] uppercase
text-text-secondary hover:text-text-primary
transition-colors duration-300
```

---

## 7. Layout & Spacing

### Grid System
- **Max width:** 1152px (`max-w-6xl`)
- **Horizontal padding:** 24px (`px-6`)
- **Section vertical padding:** 96px mobile (`py-24`), 128px desktop (`py-32`)

### Grid Patterns
| Section | Columns | Gap |
|---|---|---|
| Releases | 1 → 3 | `gap-6` |
| Tracklist | 1 → 2 | `gap-3` |
| Deepsidency | 1 → 2 | `gap-12 lg:gap-20` |
| Pillars | 1 → 3 | `gap-6` |
| Story | 1 → 2 | `gap-12 lg:gap-20` |
| Gallery | 2 → 3 | `gap-3 md:gap-4` |
| Form fields | 1 → 2 | `gap-6` |

### 2026 Elevation: Bento Grids
- Replace uniform 3-column release grid with asymmetric bento: featured release large (2x2), others smaller
- Gallery: Mix aspect ratios (4:3, 1:1, 16:9) in bento layout for editorial feel
- Consider CSS `subgrid` for aligned content within bento cells

---

## 8. Imagery & Photography

### Treatment
- **Hero:** B&W EPK photo, `background-size: cover`, `background-position: center 30%`
- **Overlay:** Gradient `from-bg-primary/70 via-bg-primary/50 to-bg-primary`
- **Story photo:** Color, rounded-lg, gradient overlay bottom, decorative offset accent border
- **Gallery:** Color, aspect-ratio 4:3, scale 1.1 on hover, dark overlay with glass pill
- **Release covers:** Square aspect, rounded-md, scale 1.05 on hover

### 2026 Elevation
- Add subtle duotone filter on gallery hover (accent color blend)
- Parallax on story section photo (slower scroll rate)
- Consider WebP + `<picture>` element with art-directed responsive crops

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Single column, stacked layouts, hamburger menu, py-24 |
| Tablet | 768px+ (`md:`) | 2-3 column grids, expanded nav hidden, py-32 |
| Desktop | 1024px+ (`lg:`) | Full 2-column layouts for Deepsidency/Story |
| Wide | 1440px+ | Content stays at max-w-6xl, centered |

### Mobile-Specific
- Hero logo: h-28 (vs h-40 desktop)
- Nav: Hamburger with animated bars, slide-down glass-strong panel
- Gallery: 2 columns instead of 3
- Form: Single column for name/email fields

---

## 10. 2026 Trend Integration Checklist

| Trend | Status | Where to Apply |
|---|---|---|
| Bento grid layouts | Planned | Music releases, Gallery |
| Film grain texture | Planned | Global background overlay |
| Ambient gradients | Partial | Nowhere Traveler section has radial gradient |
| Scroll-driven animations | Planned | Hero parallax, section reveals |
| Micro-interactions (magnetic cursor) | Planned | CTA buttons |
| Variable font animation | Planned | Nav links hover |
| Layered depth | Partial | Glass + shadows already layered |
| Editorial typography | Planned | Hero wordmark size increase |
| Gradient borders | Planned | Featured release card, focused inputs |
| View transitions | Planned | Language toggle |

---

## 11. File Reference

### Design tokens source
`src/styles/globals.css` — `@theme {}` block

### Components
| File | Section |
|---|---|
| `src/components/Navbar.tsx` | Sticky nav |
| `src/components/Hero.tsx` | Hero |
| `src/components/Music.tsx` | Music |
| `src/components/Deepsidency.tsx` | Deepsidency |
| `src/components/NowhereTraveler.tsx` | Nowhere Traveler |
| `src/components/Story.tsx` | Story |
| `src/components/Gallery.tsx` | Gallery |
| `src/components/Contact.tsx` | Contact |
| `src/components/Footer.tsx` | Footer |

### Animation utilities
- `src/hooks/useScrollAnimation.ts` — IntersectionObserver hook
- `src/styles/globals.css` — CSS keyframes, glass, float, glow classes
