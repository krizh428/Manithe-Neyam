# Project UI Components & Theme Documentation
## Manitheneyam Home Website — Frontend Architecture, UI Component System, Light/Dark Theme & Animation/Transition Engine

> **Document Status:** Verified Against Live Codebase  
> **Target System:** Manitheneyam Charitable Trust Official Web Application  
> **Primary Source Directory:** `src/` & `server/`  
> **Last Analysis Timestamp:** October 2026  

---

## 1. Project Overview

The **Manitheneyam Home Website** is a dual-language (Tamil & English) web application dedicated to showcasing the social service initiatives, home branches (Children's Home, Women & Child Development Center, Senior Citizens Home), public transparency documents (80G, 12AA, CSR), and administrative controls for the Manitheneyam Charitable Trust.

The frontend is constructed using a high-performance modern Single-Page Application (SPA) architecture with strict TypeScript checking, zero external bloated UI component kits (100% custom-crafted accessible components), responsive fluid layout grids, a centralized theme engine with runtime CSS custom property swapping, and an animation engine combining GSAP ScrollTrigger and Framer Motion.

---

## 2. Technology & Library Inventory

| Category | Technology / Library | Version (package.json) | Purpose & Usage in Project |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `^19.2.8` | UI view layer, custom hooks, context state management |
| **Runtime & DOM** | React DOM | `^19.2.8` | React DOM reconciliation engine |
| **Language** | TypeScript | `~6.0.2` (dev) | Static typing, interface definitions (`src/types/index.ts`) |
| **Build Tool & Bundler** | Vite | `^8.3.0` | Ultra-fast HMR dev server and production Rollup bundling |
| **Vite React Plugin** | `@vitejs/plugin-react` | `^6.1.1` | Fast Refresh and JSX transformation |
| **Styling Engine** | Tailwind CSS | `^4.3.3` | Utility-first styling via modern v4 `@theme` engine |
| **Vite Tailwind Plugin** | `@tailwindcss/vite` | `^4.3.3` | Direct Vite integration for Tailwind v4 engine |
| **Class Utilities** | `clsx` & `tailwind-merge` | `^2.1.1` & `^3.7.0` | Conditional class composition and deduplication |
| **Routing** | React Router DOM | `^7.18.4` | Client-side routing (`/`, `/admin`, `/admin/login`, `/admin/:tab`) |
| **Animation (GSAP)** | GSAP (`gsap`) | `^3.15.0` | High-fidelity scroll animations, timelines, ScrollTrigger plugins (`src/animations/index.ts`) |
| **Animation (Motion)** | Framer Motion | `^13.4.0` | Layout transitions, modals enter/exit (`AnimatePresence`), hover physics |
| **Iconography** | Lucide React | `^1.47.0` | Scalable vector SVG icons used across navigation, badges, cards, and admin UI |
| **Particle Physics** | Canvas Confetti | `^1.9.4` | Celebratory micro-interaction on form donation submission |
| **Linter** | Oxlint | `^1.81.0` | High-performance Rust-based static code analysis |
| **Backend Framework** | Express 5 / Node.js | Server root (`server/`) | REST API backend for document management, authentication, content CMS |
| **Database** | MongoDB Atlas / Mongoose | Backend | Cloud persistence for dynamic announcements, documents, and content |
| **Media Storage** | Cloudinary / Multer | Backend | Cloud-based media storage and multipart file upload handling |

---

## 3. Design System & Styling Architecture

### 3.1 Styling Methodology
The project utilizes **Tailwind CSS v4** combined with **Vanilla CSS Custom Properties** (`src/index.css`).  
Tailwind v4 features are configured using the `@theme` directive in `src/index.css` rather than an obsolete `tailwind.config.js`.

### 3.2 Typography Scale & Fonts
Imported from Google Fonts in `src/index.css` (lines 1–3):
1. **English Sans-Serif:** `Inter` (weights: 300, 400, 500, 600, 700, 800)  
   - CSS Variable: `--font-english: 'Inter', system-ui, -apple-system, sans-serif;`
2. **Tamil Sans-Serif:** `Mukta Malar` (weights: 300, 400, 500, 600, 700, 800)  
   - CSS Variable: `--font-tamil: 'Mukta Malar', system-ui, -apple-system, sans-serif;`
3. **Display / Script Accent:** `Kaushan Script` and `Pacifico`  
   - Class: `.font-brush { font-family: 'Kaushan Script', 'Pacifico', cursive; }`

### 3.3 Spacing & Radius Scale
Defined in `:root` (`src/index.css:70-74`):
- `--radius-sm: 8px`
- `--radius-md: 12px`
- `--radius-lg: 16px`
- `--radius-xl: 20px`

### 3.4 Shadow Levels
- **Light Theme:**
  - `--card-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06)`
  - `--card-shadow-hover: 0 10px 30px -4px rgba(15, 23, 42, 0.12)`
  - `--card-shadow-soft: 0 2px 12px -2px rgba(15, 23, 42, 0.05)`
- **Dark Theme:**
  - `--card-shadow: 0 4px 25px -2px rgba(0, 0, 0, 0.5)`
  - `--card-shadow-hover: 0 10px 32px -4px rgba(0, 0, 0, 0.6)`
  - `--card-shadow-soft: 0 2px 14px -2px rgba(0, 0, 0, 0.4)`

---

## 4. Light Theme Documentation

The Light Theme represents a clean, high-contrast, professional palette with crisp slate and deep navy typography over neutral off-white surfaces.

### 4.1 Color Token Values (Source: `src/index.css:9-74`)
- **Backgrounds:**
  - Main Background (`--bg-primary`): `#FFFFFF`
  - Secondary Background (`--bg-secondary`): `#F8FAFC` (Slate 50)
  - Card Background (`--bg-card`): `#FFFFFF`
  - Light Accent Background (`--bg-accent-light`): `#F1F5F9` (Slate 100)
- **Typography:**
  - Primary Headings / Text (`--text-primary`): `#0F172A` (Slate 900)
  - Body Copy (`--text-body`): `#334155` (Slate 700)
  - Secondary Subtitles (`--text-secondary`): `#64748B` (Slate 500)
  - Muted Captions (`--text-muted`): `#64748B` (Slate 500)
- **Brand & Action Tones:**
  - Primary Brand (`--brand-primary`): `#0F172A` (Deep Navy)
  - Brand Hover (`--brand-hover`): `#1E293B` (Slate 800)
  - Brand Light (`--brand-light`): `#334155`
  - Brand Highlight Background (`--brand-bg`): `#E2E8F0` (Slate 200)
  - Text on Primary Buttons (`--on-primary`): `#FFFFFF`
  - Section Heading Accent (`--heading-accent`): `#0F172A`
- **Borders & Separators:**
  - Default Border (`--border-color`): `#E2E8F0` (Slate 200)
  - Subtle Border (`--border-light`): `#F1F5F9` (Slate 100)
  - Strong Border (`--border-strong`): `#0F172A`
- **Card Content Specifics:**
  - Card Heading (`--card-heading`): `#0F172A`
  - Card Text (`--card-text`): `#334155`
  - Card Secondary Text (`--card-text-secondary`): `#64748B`
  - Card Muted Metadata (`--card-text-muted`): `#94A3B8`
- **Footer Styling:**
  - Footer Background (`--footer-bg`): `#0F172A`
  - Footer Headings (`--footer-heading`): `#FFFFFF`
  - Footer Body Text (`--footer-text`): `#CBD5E1` (Slate 300)
  - Footer Link (`--footer-link`): `#E2E8F0`
  - Footer Link Hover (`--footer-link-hover`): `#FFFFFF`
- **Donation & Heart Accent:**
  - Heart Color (`--heart`): `#EF4444` (Red 500)
  - Heart Hover (`--heart-hover`): `#DC2626` (Red 600)
- **Scrollbar:**
  - Track: `#F8FAFC`
  - Thumb: `#CBD5E1`

---

## 5. Dark Theme Documentation

The Dark Theme does **not** simply invert colors; it implements a hand-tailored, luxurious **Midnight Navy & Royal Gold** theme architecture.

### 5.1 Color Token Values (Source: `src/index.css:76-129`)
- **Backgrounds:**
  - Main Background (`--bg-primary`): `#071A2B` (Deep Abyssal Navy)
  - Secondary Background (`--bg-secondary`): `#0B1F33` (Midnight Slate Navy)
  - Card Background (`--bg-card`): `#0D263D` (Subtle Elevated Blue-Navy)
  - Accent / Elevated Light (`--bg-accent-light`): `#102D46`
- **Typography:**
  - Primary Headings / Text (`--text-primary`): `#FFFFFF` (Pure Crisp White)
  - Body Copy (`--text-body`): `#E2E8F0` (Slate 200)
  - Secondary Subtitles (`--text-secondary`): `#CBD5E1` (Slate 300)
  - Muted Captions (`--text-muted`): `#94A3B8` (Slate 400)
- **Brand & Action Tones:**
  - Primary Brand (`--brand-primary`): `#D4AF37` (Prestigious Royal Gold)
  - Brand Hover (`--brand-hover`): `#F4D35E` (Warm Bright Gold)
  - Brand Light (`--brand-light`): `#B8860B` (Dark Goldenrod)
  - Brand Highlight Background (`--brand-bg`): `#123B5A` (Rich Cobalt-Navy Tint)
  - Text on Primary Buttons (`--on-primary`): `#071A2B` (Navy text for guaranteed WCAG AAA contrast over Royal Gold)
  - Section Heading Accent (`--heading-accent`): `#D4AF37`
- **Borders & Separators:**
  - Default Border (`--border-color`): `#1E405C` (Slate Navy Tint)
  - Subtle Border (`--border-light`): `#16324A`
  - Strong Border (`--border-strong`): `#D4AF37` (Royal Gold Outline)
- **Card Content Specifics:**
  - Card Heading (`--card-heading`): `#D4AF37`
  - Card Text (`--card-text`): `#E2E8F0`
  - Card Secondary Text (`--card-text-secondary`): `#CBD5E1`
  - Card Muted Metadata (`--card-text-muted`): `#94A3B8`
- **Footer Styling:**
  - Footer Background (`--footer-bg`): `#061522` (Abyssal Navy)
  - Footer Headings (`--footer-heading`): `#D4AF37` (Royal Gold)
  - Footer Body Text (`--footer-text`): `#FFFFFF`
  - Footer Link (`--footer-link`): `#D4AF37`
  - Footer Link Hover (`--footer-link-hover`): `#F4D35E`
- **Donation & Heart Accent:**
  - Heart Color (`--heart`): `#EF4444` (Vibrant Red is intentionally preserved across all themes for humanitarian recognition)
  - Heart Hover (`--heart-hover`): `#DC2626`
- **Scrollbar:**
  - Track: `#071A2B`
  - Thumb: `#1E405C`

---

## 6. Theme Switching Mechanism

### 6.1 Architecture Overview
The theme switching engine is managed through React Context, localStorage persistence, and system media query observers.

```
User Action (ThemeToggle.tsx) / System Preference Event
                        │
                        ▼
            ThemeContext.tsx (Provider)
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
localStorage ('theme')          DOM Attribute Mutation
('light'|'dark'|'system')       document.documentElement
                                ├─ data-theme="dark" (or removed)
                                └─ class="dark" (or removed)
                                                │
                                                ▼
                                    CSS Custom Properties in
                                    src/index.css (:root vs [data-theme="dark"])
```

### 6.2 Key Code Components
1. **`ThemeContext.tsx` (`src/context/ThemeContext.tsx`):**
   - States: `theme` (`'light' | 'dark' | 'system'`), `activeTheme` (`'light' | 'dark'`).
   - Initialization:
     ```typescript
     const [theme, setThemeState] = useState<Theme>(() => {
       const saved = localStorage.getItem('theme');
       return (saved as Theme) || 'system';
     });
     ```
   - System Detection:
     ```typescript
     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
     ```
   - Real-time OS Listener:
     ```typescript
     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
     const handleChange = () => applyTheme('system');
     mediaQuery.addEventListener('change', handleChange);
     ```
   - DOM Attribute Update:
     ```typescript
     if (resolvedTheme === 'dark') {
       root.setAttribute('data-theme', 'dark');
       root.classList.add('dark');
     } else {
       root.removeAttribute('data-theme');
       root.classList.remove('dark');
     }
     ```
2. **Interactive Switch (`src/components/Theme/ThemeToggle.tsx`):**
   - Custom rounded pill switch button (`h-7 w-14 p-1 rounded-full`)
   - Day background: `#73C0F4` with embedded Lucide `Sun` (`#FFD600`) and `Cloud` (`#FFFFFF`).
   - Night background: `#15234B` with embedded Lucide `Moon` (`#F6F1D5`) and 3 `Star` icons.
   - Sliding Thumb: Smooth spring cubic-bezier translation (`translate-x-0` to `translate-x-7`).

### 6.3 Subtree Theme Override (`.theme-light`)
In `src/sections/VisionMission.tsx:225` and `src/sections/Contact.tsx:309`, the `.theme-light` class is applied to the root section wrapper.  
**Why this exists:**  
Humanitarian legal credentials, QR bank payment codes, and the official trust oath require consistent, white-paper contrast regardless of user night mode. `src/index.css:176-210` rebinds all CSS variables to the light palette inside any container with the `.theme-light` class.

---

## 7. UI Component Catalog

### 7.1 Buttons
- **`AnimatedButton` (`src/components/Animated/AnimatedButton.tsx`):**
  - **Purpose:** Primary call-to-action button with micro-magnetic pull physics and sheen wave highlight.
  - **Variants:**
    - `primary`: Solid brand fill (`bg-brand-primary text-on-primary hover:bg-brand-hover`).
    - `secondary`: Ghost bordered (`bg-theme-bg text-theme-text border border-theme-border hover:border-brand-primary/60`).
    - `ghost`: Transparent with hover surface fill (`bg-transparent hover:bg-theme-bg/80`).
    - `heart`: Special donation button with red border hover effect (`hover:border-red-400`).
  - **Properties:** `withSweep: boolean` (renders sweeping diagonal gradient sheen), `onClick`, standard HTML button props.
  - **States:** Interactive hover pulls position by ±3px based on cursor delta; active scale down to `0.98`.
- **Admin Primary Button (`src/admin/ui.tsx:11-12`):**
  - Class: `inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-on-primary text-sm font-semibold hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors`
- **Admin Ghost Button (`src/admin/ui.tsx:14-15`):**
  - Class: `inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-border text-theme-text text-sm font-medium hover:bg-theme-secondary disabled:opacity-50 transition-colors`
- **Floating Support Button (`src/components/Common/FloatingSupport.tsx`):**
  - Bottom-left fixed floating pill button with heartbeat pulsing red icon, invoking the `SupportModal`.
- **Floating WhatsApp Button (`src/components/Common/FloatingWhatsApp.tsx`):**
  - Bottom-right fixed circular button (`#25D366`) with pinging radar pulse and tooltip.

### 7.2 Badges & Indicators
- **Tax & Legal Badges (`SupportModal.tsx:176-185`, `PublicDocuments.tsx`):**
  - Pills: `px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-theme-text`.
  - Badges for `12AA`, `80G`, `CSR Facility`.
- **Cover Photo Badge (`src/admin/ui.tsx:315-317`):**
  - `px-1.5 py-0.5 rounded bg-brand-primary text-on-primary text-[10px] font-semibold`.
- **Number Sequence Badge (`src/admin/ui.tsx:319-321`):**
  - `w-5 h-5 rounded bg-black/60 text-white text-[10px] font-semibold flex items-center justify-center`.
- **Section Eyebrow Badge (`src/components/Common/SectionHeading.tsx`):**
  - Pill badge holding subtitle or Tamil translation with subtle border glow.

### 7.3 Cards
- **`SpotlightCard` (`src/components/Animated/SpotlightCard.tsx`):**
  - Dynamic mouse-following radial gradient flashlight illumination on hover (`radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ...)`)
  - GSAP `fadeUp` entry animation with configurable trigger distance and delay.
- **`AnimatedCard` (`src/components/Animated/AnimatedCard.tsx`):**
  - Reusable card container with border hover highlights and transition effects.
- **`TalentServiceCard` (`src/components/Cards/TalentServiceCard.tsx`):**
  - Specialized interactive showcase for the 12 core children and elder talent services (nutrition, healthcare, education, sports, arts, counseling).
- **`SectionCard` (`src/admin/ui.tsx:243-255`):**
  - Administrative panel card (`bg-theme-card border border-theme-border rounded-2xl shadow-sm p-5`).
- **`AccordionItem` (`src/admin/ui.tsx:201-241`):**
  - Expandable content card with thumbnail preview, title, subtitle, collapse arrow, delete action, and Framer Motion height animation.

### 7.4 Form Controls & Inputs
- **Public Donation Form (`src/components/Modals/SupportModal.tsx`):**
  - Category radio selection buttons with active indicator (`bg-brand-primary text-on-primary`).
  - Inputs (`w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:ring-2 focus:ring-brand-primary`).
  - Error shake alert container with Lucide `AlertCircle`.
  - One-click clipboard copy buttons for IFSC, Account Number, and UPI phone numbers.
- **Admin Form Suite (`src/admin/ui.tsx`):**
  - `TextField`: Input field with label, optional hint, type options.
  - `AreaField`: Multi-line textarea.
  - `LinesField`: Smart line-break-delimited list editor with automatic blank-line deduplication on blur.
  - `SelectField`: Accessible styled dropdown select.
  - `ImageField`: Single-image preview with device file upload to Cloudinary and link-paste fallback.
  - `MultiImageField`: Gallery manager with drag-reordering arrows, cover image designation (`Star`), and deletion.
  - `Bilingual`: Side-by-side grid container (`grid grid-cols-1 md:grid-cols-2 gap-4`) for parallel Tamil/English editing.

### 7.5 Navigation
- **`Navbar` (`src/components/Navbar/Navbar.tsx`):**
  - Fixed top sticky header with backdrop blur and dynamic shadow on scroll (`window.scrollY > 20`).
  - Logo with circular emblem and dual-language typography.
  - Animated Desktop Navigation with `SlidingPill` (`src/components/Navbar/SlidingPill.tsx`) highlighting the active scroll-spied section.
  - Language toggle button (`IconTranslate.tsx`).
  - Dark/Light Theme toggle switch (`ThemeToggle.tsx`).
  - Admin gateway button with `ShieldCheck` status indicator.
  - Mobile hamburger trigger activating `MobileMenu.tsx`.
- **`Footer` (`src/components/Footer/Footer.tsx`):**
  - 12-column responsive layout with brand description, quick navigation links, branch addresses, emergency contacts, legal registration, and developer credits.

### 7.6 Modals & Overlays
- **`SupportModal` (`src/components/Modals/SupportModal.tsx`):**
  - Backdrop overlay with blur, ESC key dismissal, tab switching between Inquiry Form and Official Bank Transfer details, and confetti cannon on successful pledge.
- **`LocationModal` (`src/components/Modals/LocationModal.tsx`):**
  - Deep-dive modal exploring details, facilities, inmate demographics, and map coordinates for the 3 trust branches.
- **`LightboxModal` (`src/components/Lightbox/LightboxModal.tsx`):**
  - Fullscreen photo viewer with keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`).
- **`AnnouncementPopup` (`src/components/Announcement/AnnouncementPopup.tsx`):**
  - Dismissible alert dialog highlighting urgent needs or festival announcements published by trust administrators.

---

## 8. Animations, Transitions & Micro-Interactions Architecture

The project features a layered animation architecture combining **GSAP v3 (with ScrollTrigger)** for scroll-driven choreographies, **Framer Motion v13** for component layout animations, and **CSS Keyframe Animations & Transitions** for continuous ambient micro-motion.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PROJECT ANIMATION ECOSYSTEM                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼───────────────────────────┐
      ▼                            ▼                           ▼
1. GSAP & ScrollTrigger    2. Framer Motion            3. CSS3 & Keyframes
   (src/animations/)       (src/components/Animated/)  (src/index.css)
   ├─ fadeUp & fadeIn      ├─ AnimatePresence Modals   ├─ Theme Switch Transition
   ├─ textReveal           ├─ SlidingPill Nav Pill     ├─ baby-rise-float (Wave)
   ├─ imageReveal          ├─ Accordion Expand/Collapse├─ baby-glow-rise (Breathing)
   ├─ animateCounter       └─ PageTransitions          ├─ cornerFloatTR/BL
   ├─ parallax (Scrub)                                 ├─ blue-glitch-slice-1/2
   ├─ animateGrowthTree                                ├─ char-jitter (Matrix)
   └─ Magnetic Pull Cursor                             └─ subtle-shake (Validation)
```

### 8.1 GSAP Global Configuration & Easing Curves (`src/animations/config.ts`)
ScrollTrigger is registered once globally upon browser initialization.
- **Standardized Easing Constants:**
  - `EASING.smooth`: `'power2.out'` (Standard organic deceleration)
  - `EASING.medium`: `'power3.out'` (Medium deceleration curve)
  - `EASING.cinematic`: `'power4.out'` (Cinematic, dramatic ease-out)
  - `EASING.expo`: `'expo.out'` (Ultra-sharp exponential deceleration)
  - `EASING.circ`: `'circ.out'` (Circular curve)
  - `EASING.elastic`: `'elastic.out(1, 0.75)'` (Physics-based elastic bounce)
- **Timing Scale:**
  - `TIMING.fast`: `0.35s` (Quick micro-interactions)
  - `TIMING.normal`: `0.6s` (Standard component entries)
  - `TIMING.slow`: `0.9s` (Cinematic reveals)
  - `TIMING.stagger`: `0.1s` (List item stagger delay)
  - `TIMING.cardStagger`: `0.12s` (Grid card stagger delay)

### 8.2 Core GSAP Animation Modules (`src/animations/`)
1. **`fadeUp` (`src/animations/fadeUp.ts`):**
   - **Usage:** Section titles, cards, and content blocks.
   - **Mechanics:** Elements start hidden at `opacity: 0, y: distance` (default 36px) and glide into place when scrolled into viewport view (`start: 'top 85%'`).
2. **`textReveal` (`src/animations/textReveal.ts`):**
   - **Usage:** Hero headlines, vision/mission statements, section headings.
   - **Mechanics:** Targets elements tagged with `[data-reveal-part]`, triggering sequential staggered translation (`y: 35 -> 0`) at `0.08s` intervals with `EASING.cinematic`.
3. **`imageReveal` (`src/animations/imageReveal.ts`):**
   - **Usage:** Founder portrait, gallery preview photos, branch photos.
   - **Mechanics:** Cinematic clip-path curtain unveiling (`inset(100% 0% 0% 0%)` -> `inset(0% 0% 0% 0%)`) accompanied by an organic counter-scale zoom from `1.12` to `1.0`.
4. **`animateCounter` (`src/animations/counterAnimation.ts`):**
   - **Usage:** Trust impact statistics (e.g. 500+ inmates, 25+ years of service, 100% free care).
   - **Mechanics:** GSAP scrolls an integer variable from `0` to the target number using an easing curve when the statistics row crosses `top 85%` of the viewport.
5. **`parallax` (`src/animations/parallax.ts`):**
   - **Usage:** Ambient background shapes, floating SVG leaves, subtle backdrop textures.
   - **Mechanics:** Coupled directly to the user's scrollbar via `scrub: true`, translating vertically (`y: -distance/2` to `y: distance/2`) at variable speeds.
6. **`animateGrowthTree` (`src/animations/growthTree.ts` & `src/components/Animated/GrowthTreeVisual.tsx`):**
   - **Usage:** Interactive genealogy growth tree visualizing the 3 branches stemming from the Manitheneyam seed.
   - **Mechanics:** SVG branch paths calculate `getTotalLength()` and unveil dynamically via `strokeDasharray` and `strokeDashoffset` from 100% to 0; nodes bloom outward with `ease: 'back.out(1.4)'`.

### 8.3 Interactive Component Physics & Micro-Interactions

| Component | File Path | Interaction & Animation Mechanics |
| :--- | :--- | :--- |
| **`AnimatedButton`** | `src/components/Animated/AnimatedButton.tsx` | **Magnetic Cursor Pull:** Listens to `onMouseMove` to calculate cursor offset relative to button center, gently pulling the button by up to ±3px. **Sheen Wave Sweep:** On hover, a diagonal translucent gradient (`from-transparent via-white/18 to-transparent`) translates across the full width in `1000ms`. |
| **`SpotlightCard`** | `src/components/Animated/SpotlightCard.tsx` | **Flashlight Radial Glow:** Tracks `clientX`/`clientY` within card bounding box, writing `--mouse-x` and `--mouse-y` CSS variables. An absolute radial gradient (`radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ...)`) fades in on hover. |
| **`CustomCursor`** | `src/components/Animated/CustomCursor.tsx` | **Dual-Ring Spring Follower:** Small sharp center dot tracks mouse coordinates with zero lag, while an outer spring ring follows with GSAP smooth interpolation. Automatically scales up and inverts contrast when hovering over buttons, links, or cards. |
| **`CharacterGlitchText`** | `src/components/Animated/CharacterGlitchText.tsx` | **Cyber Matrix Jitter & Split:** Uses dual CSS pseudo-elements (`::before` and `::after`) with offset polygon clip-paths, combined with timed JavaScript character substitution scrambling text momentarily before snapping back. |
| **`SlidingPill`** | `src/components/Navbar/SlidingPill.tsx` | **Shared Layout Spring:** Built with Framer Motion `layoutId="activePill"`. As the user scrolls across sections, the background highlight pill smoothly glides between navigation links with spring physics. |
| **`FloatingWhatsApp`** | `src/components/Common/FloatingWhatsApp.tsx` | **Radar Ripple Wave:** Outer circular badge emits an infinite expanding radar pulse wave (`animate-ping`) to draw subtle visual attention without obstructing content. |
| **`SupportModal` Confetti** | `src/components/Modals/SupportModal.tsx` | **Particle Physics Explosion:** When a user completes a donation inquiry pledge, `canvas-confetti` fires 80 particles across a 70° spread from coordinates `y: 0.6`. |
| **`Preloader`** | `src/components/Common/Preloader.tsx` | **Cinematic Intro Timeline:** GSAP timeline sequences brand emblem fade-in, dual-language subtitle typewriter reveals, loading progress bar scale-up, and an exit slide transition into the main canvas. |
| **`PageTransition`** | `src/components/Animated/PageTransition.tsx` | **Route Change Transitions:** Wraps React Router routes with Framer Motion `AnimatePresence`, gently cross-fading opacity between public pages and the `/admin` portal. |

### 8.4 CSS Keyframe Animations & Transitions (`src/index.css`)

The project uses hand-crafted CSS keyframe animations defined in `src/index.css` for performance-critical continuous loops:

1. **Global Theme Switch Transition (`src/index.css:220`):**
   ```css
   html {
     transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
   }
   ```
   Ensures that switching between Light and Dark themes produces a silky smooth 300ms cross-dissolve instead of a jarring flash.

2. **Baby Image Smooth Floating & Rising (`@keyframes baby-rise-float`):**
   ```css
   @keyframes baby-rise-float {
     0%, 100% {
       transform: translateY(8px) scale(0.985);
       filter: drop-shadow(0 16px 28px rgba(15, 23, 42, 0.11)) drop-shadow(0 0 18px rgba(212, 175, 55, 0.12));
     }
     50% {
       transform: translateY(-26px) scale(1.035);
       filter: drop-shadow(0 34px 52px rgba(15, 23, 42, 0.18)) drop-shadow(0 0 38px rgba(212, 175, 55, 0.28));
     }
   }
   .animate-baby-float {
     animation: baby-rise-float 4.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
   }
   ```
   Used on the hero baby illustration to create an ethereal, calm, breathing levitation.

3. **Baby Aura Glow Breathing (`@keyframes baby-glow-rise`):**
   ```css
   @keyframes baby-glow-rise {
     0%, 100% { opacity: 0.48; transform: translateY(6px) scale(0.94); }
     50% { opacity: 0.95; transform: translateY(-20px) scale(1.12); }
   }
   .animate-baby-glow {
     animation: baby-glow-rise 4.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
   }
   ```

4. **Talent Service Card Wave (`@keyframes cornerFloatTR` & `cornerFloatBL`):**
   - Organic corner wave keyframes oscillating between `translate(0, 0) scale(1)` and `translate(±5px, ∓5px) scale(1.02)` across 6.0s–6.8s cycles.

5. **Cyber Glitch Slices (`@keyframes blue-glitch-slice-1` & `blue-glitch-slice-2`):**
   - High-speed 0.35s stepped keyframe slices moving horizontal polygon clip-paths across the text bounding box.

6. **Form Validation Shake Alert (`@keyframes subtle-shake`):**
   ```css
   @keyframes subtle-shake {
     0%, 100% { transform: translateX(0); }
     20%, 60% { transform: translateX(-4px); }
     40%, 80% { transform: translateX(4px); }
   }
   .animate-shake {
     animation: subtle-shake 0.4s ease-in-out;
   }
   ```
   Triggers in `SupportModal` when required fields (name, phone) are submitted blank.

7. **Animated Nav Link Underline (`.nav-link::after`):**
   - Underline pseudo-element scale transformation (`transform: scaleX(0)` -> `scaleX(1)` with `transform-origin: center`) over 250ms ease on hover and active route state.

### 8.5 Motion Accessibility (`prefers-reduced-motion`)
The application respects user operating system motion preferences:
- In `src/animations/config.ts`, `prefersReducedMotion()` disables GSAP transforms, setting `opacity: 1, y: 0` immediately.
- In `src/index.css:767-775`, media query rules force all CSS animations to `0.01ms`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 9. Component Inventory & Comparison Tables

### Table A: Component Inventory
| Component | Purpose | Source File Path | Technology / Library | Variants / Props |
| :--- | :--- | :--- | :--- | :--- |
| `AnimatedButton` | Primary action button with magnetic cursor pull & light sheen | `src/components/Animated/AnimatedButton.tsx` | React, GSAP, CSS | `primary`, `secondary`, `ghost`, `heart`, `withSweep` |
| `SpotlightCard` | Flashlight hover illumination card with scroll fade-in | `src/components/Animated/SpotlightCard.tsx` | React, GSAP ScrollTrigger | `spotlightColor`, `delay`, `distance`, `index` |
| `TalentServiceCard` | Service visual card with icon tilt and details | `src/components/Cards/TalentServiceCard.tsx` | React, Framer Motion | `service`, `isTamil`, `index` |
| `ThemeToggle` | Day/Night toggle switch with sun/moon vector graphics | `src/components/Theme/ThemeToggle.tsx` | React, Lucide Icons, ThemeContext | No props (context-driven) |
| `Navbar` | Sticky header with scroll-spy pill, lang & theme toggles | `src/components/Navbar/Navbar.tsx` | React, GSAP, Lucide Icons | `activeSection`, `onOpenSupport`, `onOpenAdmin` |
| `Footer` | Comprehensive multi-column responsive trust footer | `src/components/Footer/Footer.tsx` | React, GSAP ScrollTrigger | No props (context-driven) |
| `SupportModal` | Dual-tab donation inquiry & bank transfer modal | `src/components/Modals/SupportModal.tsx` | React, Framer Motion, Confetti | `isOpen`, `onClose` |
| `LocationModal` | Branch information modal with facility highlights | `src/components/Modals/LocationModal.tsx` | React, Framer Motion | `location`, `isOpen`, `onClose` |
| `LightboxModal` | Fullscreen gallery media viewer | `src/components/Lightbox/LightboxModal.tsx` | React, Framer Motion | `images`, `currentIndex`, `isOpen`, `onClose` |
| `AnnouncementPopup` | Urgent trust announcements and event notices | `src/components/Announcement/AnnouncementPopup.tsx` | React, Framer Motion | `ready` |
| `Preloader` | Brand introduction screen with dual-language greeting | `src/components/Common/Preloader.tsx` | React, GSAP Timeline | `onComplete`, `onTransitionToTree` |
| `OrganizationTreeIntro` | Interactive interactive genealogical growth tree of trust homes | `src/components/Animated/OrganizationTreeIntro.tsx` | React, GSAP, SVG | `isOpen`, `isReplay`, `onComplete` |
| `ScrollProgress` | Top-edge reading progress indicator bar | `src/components/Common/ScrollProgress.tsx` | React, Framer Motion | Fixed top bar |
| `BackToTop` | Scroll-to-top button with circular scroll-meter border | `src/components/Common/BackToTop.tsx` | React, Lucide `ArrowUp` | Appears after 400px scroll |
| `FloatingSupport` | Persistent quick-donation trigger pill | `src/components/Common/FloatingSupport.tsx` | React, Lucide `Heart` | `onClick` |
| `FloatingWhatsApp` | Immediate chat channel with trust coordinator | `src/components/Common/FloatingWhatsApp.tsx` | React, Lucide Icons | Fixed bottom-right |
| `TextField` | Admin text input control | `src/admin/ui.tsx` | React | `label`, `value`, `onChange`, `hint`, `type` |
| `AreaField` | Admin multi-line text input | `src/admin/ui.tsx` | React | `label`, `value`, `onChange`, `rows`, `hint` |
| `LinesField` | Admin newline-separated string array editor | `src/admin/ui.tsx` | React | `label`, `value`, `onChange`, `rows`, `hint` |
| `SelectField` | Admin select dropdown control | `src/admin/ui.tsx` | React | `label`, `value`, `options`, `onChange` |
| `ImageField` | Single-image upload and URL preview | `src/admin/ui.tsx` | React, Lucide `ImagePlus` | `label`, `value`, `onChange` |
| `MultiImageField` | Multi-image reorderable photo gallery field | `src/admin/ui.tsx` | React, Lucide Icons | `label`, `value`, `onChange`, `max` |
| `AccordionItem` | Collapsible section card | `src/admin/ui.tsx` | React, Framer Motion | `title`, `subtitle`, `image`, `open`, `onToggle`, `onDelete` |

---

### Table B: Light vs. Dark Theme Comparison
| UI Element | Light Theme Implementation | Dark Theme Implementation | Source Token / Variable |
| :--- | :--- | :--- | :--- |
| **Page Root Canvas** | Pure White (`#FFFFFF`) | Deep Abyssal Navy (`#071A2B`) | `--bg-primary` / `--color-theme-bg` |
| **Secondary Background** | Soft Slate (`#F8FAFC`) | Midnight Slate Navy (`#0B1F33`) | `--bg-secondary` / `--color-theme-secondary` |
| **Card Canvas** | Pure White (`#FFFFFF`) | Elevated Dark Blue (`#0D263D`) | `--bg-card` / `--color-theme-card` |
| **Primary Typography** | Deep Slate 900 (`#0F172A`) | Pure White (`#FFFFFF`) | `--text-primary` / `--color-theme-text` |
| **Body Copy** | Slate 700 (`#334155`) | Light Slate 200 (`#E2E8F0`) | `--text-body` / `--color-theme-text-body` |
| **Muted Metadata** | Slate 500 (`#64748B`) | Slate 400 (`#94A3B8`) | `--text-muted` / `--color-theme-text-muted` |
| **Primary Brand Token** | Deep Navy (`#0F172A`) | Royal Gold (`#D4AF37`) | `--brand-primary` / `--color-brand-primary` |
| **Brand Hover State** | Slate 800 (`#1E293B`) | Warm Gold (`#F4D35E`) | `--brand-hover` / `--color-brand-hover` |
| **Text on Primary Button** | Pure White (`#FFFFFF`) | Dark Navy (`#071A2B`) [WCAG Contrast] | `--on-primary` / `--color-on-primary` |
| **Borders** | Light Gray Slate (`#E2E8F0`) | Slate Navy Rim (`#1E405C`) | `--border-color` / `--color-theme-border` |
| **Footer Canvas** | Deep Navy (`#0F172A`) | Ultra Abyssal Navy (`#061522`) | `--footer-bg` / `--color-theme-footer` |
| **Footer Heading** | White (`#FFFFFF`) | Royal Gold (`#D4AF37`) | `--footer-heading` / `--color-theme-footer-heading` |
| **Heart / Donation Accent** | Crimson Red (`#EF4444`) | Crimson Red (`#EF4444`) [Consistent] | `--heart` / `--color-heart` |
| **Card Shadow** | `rgba(15, 23, 42, 0.06)` | `rgba(0, 0, 0, 0.5)` deep ambient | `--card-shadow` / `--shadow-card` |

---

### Table C: Design Tokens Reference
| Token Name | Light Theme Value | Dark Theme Value | Usage Locations |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#FFFFFF` | `#071A2B` | Root page background, modal backdrop base |
| `--bg-secondary` | `#F8FAFC` | `#0B1F33` | Alternating section backgrounds, table headers |
| `--bg-card` | `#FFFFFF` | `#0D263D` | Content cards, dialog boxes, form cards |
| `--bg-accent-light` | `#F1F5F9` | `#102D46` | Chip backgrounds, subtle hover containers |
| `--text-primary` | `#0F172A` | `#FFFFFF` | Main headings (`h1`, `h2`, `h3`), hero text |
| `--text-body` | `#334155` | `#E2E8F0` | Paragraph text, descriptions, list items |
| `--text-secondary` | `#64748B` | `#CBD5E1` | Secondary captions, subtitle labels |
| `--text-muted` | `#64748B` | `#94A3B8` | Footnotes, timestamp metadata, hints |
| `--brand-primary` | `#0F172A` | `#D4AF37` | Primary buttons, active nav pills, key highlights |
| `--brand-hover` | `#1E293B` | `#F4D35E` | Button hover states, interactive link hover |
| `--brand-light` | `#334155` | `#B8860B` | Subtle badges, tertiary accent accents |
| `--brand-bg` | `#E2E8F0` | `#123B5A` | Brand tinted containers, active radio options |
| `--on-primary` | `#FFFFFF` | `#071A2B` | Text color when drawn inside `--brand-primary` |
| `--heading-accent` | `#0F172A` | `#D4AF37` | Section title accent text, decorative highlights |
| `--border-color` | `#E2E8F0` | `#1E405C` | Default card borders, divider rules, input outlines |
| `--border-light` | `#F1F5F9` | `#16324A` | Secondary soft dividers |
| `--border-strong` | `#0F172A` | `#D4AF37` | Focused card highlights, active tab borders |
| `--card-heading` | `#0F172A` | `#D4AF37` | Card titles |
| `--card-text` | `#334155` | `#E2E8F0` | Card body paragraphs |
| `--footer-bg` | `#0F172A` | `#061522` | Footer wrapper background |
| `--footer-heading` | `#FFFFFF` | `#D4AF37` | Footer block titles |
| `--footer-text` | `#CBD5E1` | `#FFFFFF` | Footer paragraphs, branch addresses |
| `--footer-link` | `#E2E8F0` | `#D4AF37` | Footer navigation anchor links |
| `--footer-link-hover` | `#FFFFFF` | `#F4D35E` | Footer anchor hover state |
| `--heart` | `#EF4444` | `#EF4444` | Donation icons, pulsing volunteer triggers |
| `--heart-hover` | `#DC2626` | `#DC2626` | Heart button hover state |
| `--scrollbar-track` | `#F8FAFC` | `#071A2B` | Browser scrollbar track |
| `--scrollbar-thumb` | `#CBD5E1` | `#1E405C` | Browser scrollbar thumb |

---

### Table D: Interactive States
| Component | Default State | Hover State | Focus State | Active State | Disabled State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`AnimatedButton` (Primary)** | `bg-brand-primary text-on-primary` | `bg-brand-hover shadow-hover` + magnetic 3px pull + sweep sheen | `focus-visible:ring-2 focus-visible:ring-brand-primary` | `scale-[0.98]` | `opacity-50 cursor-not-allowed` |
| **`AnimatedButton` (Secondary)**| `bg-theme-bg text-theme-text border border-theme-border` | `border-brand-primary/60 text-brand-primary` | `focus-visible:ring-2 ring-brand-primary` | `scale-[0.98]` | `opacity-50 cursor-not-allowed` |
| **`ThemeToggle`** | Daylight blue (`#73C0F4`) or Midnight navy (`#15234B`) | `scale-105` | `focus:ring-2 focus:ring-brand-primary` | `scale-95` | N/A |
| **Form Inputs (`inputClass`)** | `border-theme-border bg-theme-bg text-theme-text` | Subtle border darkening | `focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary` | N/A | `opacity-60 bg-theme-secondary` |
| **`AccordionItem`** | Single row summary with chevron | Elevation border shadow | `outline-none` | Chevron rotates 180° | N/A |
| **Nav Links (`Navbar.tsx`)** | `text-theme-text` | `text-brand-primary -translate-y-0.5` | `focus-visible:ring-2` | Active item displays `SlidingPill` | N/A |
| **Copy Button (`SupportModal.tsx`)** | Neutral border + copy icon | Green/Emerald tint | `focus:ring-2` | Shows checkmark + "Copied" text | `opacity-50` |

---

### Table E: Complete Animation & Transition Registry
| Animation / Effect | Primary Technology | Trigger / Event | Duration / Timing | Visual Effect & Easing | Source Code Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Global Theme Transition** | CSS Transition | Theme Toggle / System Mode | `300ms ease` | Cross-dissolve background, text, borders, and shadows | `src/index.css:220` |
| **Scroll Section Reveal (`fadeUp`)** | GSAP ScrollTrigger | Viewport scroll (`top 85%`) | `0.75s` | `opacity: 0, y: 36` to `y: 0` (`EASING.medium`) | `src/animations/fadeUp.ts` |
| **Text Line Reveal (`textReveal`)** | GSAP ScrollTrigger | Viewport scroll (`top 85%`) | `0.85s` (stagger `0.08s`) | Lines stagger upward (`y: 35 -> 0`, `EASING.cinematic`) | `src/animations/textReveal.ts` |
| **Curtain Photo Reveal (`imageReveal`)** | GSAP ScrollTrigger | Viewport scroll (`top 85%`) | `1.1s` | Curtain `clipPath` opens as image scales from `1.12` to `1.0` | `src/animations/imageReveal.ts` |
| **Statistic Counter (`animateCounter`)** | GSAP ScrollTrigger | Scroll into view (`top 85%`) | `2.0s` | Numbers scroll incrementally from 0 to target metric | `src/animations/counterAnimation.ts` |
| **Background Parallax (`parallax`)** | GSAP ScrollTrigger | Continuous scroll | `scrub: true` | Background element translates along Y-axis proportional to scroll | `src/animations/parallax.ts` |
| **Growth Tree Drawing (`growthTree`)** | GSAP Timeline | Scroll into view (`top 80%`) | `1.2s` branches, `0.75s` nodes | SVG branch stroke dash draws out; nodes bloom (`back.out`) | `src/animations/growthTree.ts` |
| **Baby Levitation Wave** | CSS Keyframes | Continuous loop | `4.4s cubic-bezier(0.4,0,0.2,1)` | Vertical float `translateY(8px)` -> `-26px` with drop-shadow | `src/index.css:733-758` |
| **Baby Glow Breathing** | CSS Keyframes | Continuous loop | `4.4s cubic-bezier(0.4,0,0.2,1)` | Radial aura expands (`scale: 0.94 -> 1.12`, `opacity: 0.48 -> 0.95`) | `src/index.css:744-763` |
| **Card Corner Wave** | CSS Keyframes | Continuous loop | `6.0s` & `6.8s` | Corner background ripples move ±5px with slight scale | `src/index.css:562-586` |
| **Magnetic Button Pull** | GSAP / DOM transform | Mouse hover move | Real-time tracking | Button physically pulls ±3px toward the cursor position | `src/components/Animated/AnimatedButton.tsx` |
| **Button Hover Sheen Sweep** | CSS Transition | Mouse enter button | `1000ms ease-in-out` | Diagonal white 18% sheen ribbon sweeps across button | `src/components/Animated/AnimatedButton.tsx:63` |
| **Flashlight Spotlight Glow** | CSS Custom Properties | Mouse move over card | Real-time (`--mouse-x/y`) | Dynamic 400px radial light follows cursor across card surface | `src/components/Animated/SpotlightCard.tsx` |
| **Cyber Glitch Text** | CSS Keyframes + JS | Random interval / Hover | `0.35s` stepped slices | Dual-color offset polygon slicing with character substitution | `src/index.css:597-683`, `CharacterGlitchText.tsx` |
| **Character Jitter** | CSS Keyframes | Glitch active | `0.15s` alternate | Matrix text micro-skew (±1°) and translation jitter | `src/index.css:717-721` |
| **Form Error Shake Alert** | CSS Keyframes | Form validation failure | `0.4s ease-in-out` | Container shakes horizontally (±4px) 3 times | `src/index.css:551-559`, `SupportModal.tsx` |
| **Nav Pill Glide (`SlidingPill`)** | Framer Motion | Scroll Spy Section Change | Spring physics (`layoutId`) | Pill background slides smoothly between active navigation links | `src/components/Navbar/SlidingPill.tsx` |
| **Modal Enter & Exit** | Framer Motion | Open / Close Modal | `250ms easeOut` | Backdrop blur fades; modal scales up `0.95 -> 1.0` | `src/components/Modals/SupportModal.tsx` |
| **Accordion Height Transition** | Framer Motion | Accordion Header Click | `220ms easeOut` | Container smoothly animates `height: 0 -> auto` | `src/admin/ui.tsx:227-239` |
| **Page Route Transitions** | Framer Motion | Route change (`/`, `/admin`) | `300ms easeInOut` | Fades out old route and slides new page content smoothly | `src/components/Animated/PageTransition.tsx` |
| **Celebratory Confetti** | Canvas Confetti (Canvas) | Donation submit success | Particle decay (~2.5s) | 80 colored confetti particles blast outward | `src/components/Modals/SupportModal.tsx:72` |
| **Radar Ring Pulse** | Tailwind Animation | Continuous loop | `animate-ping` (1s) | Expanding transparent circular ripple around WhatsApp icon | `src/components/Common/FloatingWhatsApp.tsx` |

---

## 10. Responsive Design & Accessibility (a11y)

### 10.1 Breakpoints
The website adheres to standard Tailwind breakpoints:
- `sm`: `640px` (Mobile landscape, 2-column grids)
- `md`: `768px` (Tablet layouts, side-by-side bilingual editors)
- `lg`: `1024px` (Desktop navigation becomes visible, hamburger collapses)
- `xl`: `1280px` (Widescreen container adjustments, larger typography scale)
- `2xl`: `1536px` (Maximum layout constraints)

### 10.2 Motion Sensitivity (`prefers-reduced-motion`)
The project contains an accessibility check in `src/animations/index.ts`:
```typescript
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```
When enabled in the user's OS:
1. `AnimatedButton` disables cursor magnetic pull and sheen animation.
2. GSAP scroll triggers and entrance transforms are bypassed.
3. Custom cursor is disabled in favor of standard system pointers.
4. CSS animations duration is forced to `0.01ms`.

### 10.3 Contrast & Readability
- In Dark Mode, text placed upon solid Royal Gold fills (`--brand-primary`) explicitly uses `--on-primary: #071A2B` (deep dark navy), preventing the low-contrast failure of white-on-gold.
- High-priority legal and financial sections (`Contact` and `VisionMission`) are locked to `.theme-light` so bank account numbers, IFSC codes, and official seals remain readable in bright outdoor conditions.

---

## 11. Verified Implementation Gaps & Inconsistencies

During the comprehensive analysis of the existing source code, the following findings and minor inconsistencies were verified:

1. **Subtree Re-binding Duplication (`src/index.css`):**
   - Lines 8–74 define `:root, .theme-light`, while lines 176–210 re-declare the individual `--color-theme-*` mappings for `.theme-light`. This redundancy was intentionally created to overcome Tailwind v4's root token caching mechanism.
2. **Fixed Colors in Certain Section Badges:**
   - In `src/sections/Contact.tsx:22-26`, constant values `NAVY = '#14215E'`, `ICON_GRADIENT`, and `BAR_GRADIENT` are hardcoded rather than linked to `--brand-primary`. This ensures the donation and UPI presentation maintains uniform branding, but limits programmatic color overriding.
3. **No External Headless Component Library:**
   - The application relies entirely on custom components without Radix UI or Headless UI. While this eliminates bundle overhead, keyboard focus trapping inside `SupportModal` and `LocationModal` is handled via basic event listeners (`Escape` key) rather than a complete ARIA-compliant focus trap.

---

## 12. Recommendations for Future Extensions

1. **Automated ARIA Focus Trapping:** Implement `@floating-ui/react` or a native `dialog.showModal()` refactor for `SupportModal` and `LocationModal` to enhance screen reader compliance.
2. **Standardized Status Tokens:** Move status colors (e.g., emerald for active/copied, red for error, amber for cover photo) from inline Tailwind classes (`text-emerald-500`, `text-red-500`) into centralized design tokens (`--color-success`, `--color-danger`, `--color-warning`).
3. **System Theme Transition Smoothing:** Consider adding a temporary `.disable-transitions` class on `document.documentElement` during rapid theme toggling to prevent transition stutter across complex SVG trees.

---

## 13. Verification & Summary

### Verified Core Source Files:
- **Styling & Tokens:** `src/index.css` (776 lines)
- **Theme Engine:** `src/context/ThemeContext.tsx` (71 lines), `src/components/Theme/ThemeToggle.tsx` (58 lines)
- **Animation System:** `src/animations/index.ts`, `src/animations/config.ts`, `fadeUp.ts`, `imageReveal.ts`, `textReveal.ts`, `growthTree.ts`, `parallax.ts`, `counterAnimation.ts`
- **Animated Components:** `src/components/Animated/` (13 files including `AnimatedButton.tsx`, `SpotlightCard.tsx`, `CustomCursor.tsx`, `CharacterGlitchText.tsx`, `GrowthTreeVisual.tsx`, `PageTransition.tsx`)
- **Admin System:** `src/admin/ui.tsx` (386 lines), `src/admin/AdminDashboard.tsx`, `src/admin/DocumentsManager.tsx`
- **Application Shell:** `src/App.tsx` (242 lines), `src/components/Navbar/Navbar.tsx` (274 lines), `src/components/Footer/Footer.tsx` (240 lines)
- **Modals & Overlays:** `src/components/Modals/SupportModal.tsx` (468 lines), `LocationModal.tsx`, `LightboxModal.tsx`
- **Sections:** `src/sections/` (12 section modules)

*All documented values, CSS properties, color hex codes, class names, animation curves, and architectural decisions have been verified directly against the project source code.*
