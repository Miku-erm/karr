---
name: Kritik Karar Narrative Engineering
colors:
  surface: '#15130e'
  surface-dim: '#15130e'
  surface-bright: '#3b3932'
  surface-container-lowest: '#100e09'
  surface-container-low: '#1d1b16'
  surface-container: '#211f19'
  surface-container-high: '#2c2a24'
  surface-container-highest: '#37352e'
  on-surface: '#e8e2d8'
  on-surface-variant: '#c5c6ce'
  inverse-surface: '#e8e2d8'
  inverse-on-surface: '#33302a'
  outline: '#8f9098'
  outline-variant: '#45474d'
  surface-tint: '#bac6e6'
  primary: '#bac6e6'
  on-primary: '#243049'
  primary-container: '#101d35'
  on-primary-container: '#7985a2'
  inverse-primary: '#525e7a'
  secondary: '#ffb870'
  on-secondary: '#4a2800'
  secondary-container: '#a35f02'
  on-secondary-container: '#fff2e9'
  tertiary: '#89d4cd'
  on-tertiary: '#003734'
  tertiary-container: '#002220'
  on-tertiary-container: '#46918c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#bac6e6'
  on-primary-fixed: '#0e1b33'
  on-primary-fixed-variant: '#3a4761'
  secondary-fixed: '#ffdcbe'
  secondary-fixed-dim: '#ffb870'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#693c00'
  tertiary-fixed: '#a5f0e9'
  tertiary-fixed-dim: '#89d4cd'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504c'
  background: '#15130e'
  on-background: '#e8e2d8'
  surface-variant: '#37352e'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system defines an interactive engineering simulation disguised as a cinematic, playable architectural novel. The experience is tailored for software engineers, engineering leads, and technical decision-makers tasked with resolving complex production outages under extreme operational friction.

The aesthetic fuses **Editorial Precision** with **Atmospheric High-Stakes Sci-Fi / Systems Telemetry**. The user is not a spectator; they are the on-call engineer at dawn. The interface evokes the tension of a critical production post-mortem, balancing calm analytical lucidity with urgent system degradation. Visual elements draw heavily from prestige digital publishing (generous typographic scale, deliberate hierarchy) underpinned by structural terminal monitors and diagnostic overlays. 

Interactions feel definitive, tactile, and consequential. Visual feedback is restrained—every amber flash, border pulse, or telemetry shift indicates a structural trade-off between latency, consistency, testing, and legal compliance.

## Colors

The palette is engineered exclusively for an immersive dark-mode mobile experience, eliminating eye strain during long-form reading while maintaining sharp contrast for operational data:

- **Primary Canvas & Chrome (`#101D35`):** The foundational void. Used for app chrome, background canvas, ambient backdrops, and deep layer depths.
- **Surface Elevation (`#172846`):** The primary container and interactive panel tone. Lifts narrative cards, telemetry trays, and interactive blocks off the backdrop.
- **Neutral Foreground (`#F7F1E7`):** Warm Ivory provides an editorial, book-like legibility against the navy spectrum, softer on the retina than pure `#FFFFFF`.
- **Secondary Alert & Consequence (`#F5A34A`):** Amber serves as the high-tension vector. Applied to unresolved architectural risks, active decision cards, critical telemetry drops, and ticking incident thresholds.
- **Tertiary Advisory (`#5CA6A0`):** Muted Teal signals synthetic assistance, calm architectural guidance, post-incident root cause analysis, and the docked AI Tutor.
- **Structural Borders & Overlays:** Borders use `rgba(247, 241, 231, 0.12)` for standard containers, and `rgba(245, 163, 74, 0.35)` for elevated, state-dependent choices.

## Typography

The typographic tension mirrors the narrative core: **Newsreader** delivers the contemplative depth of a printed novel for chapter intros, ambient vignettes, and dramatic incident beats; **Plus Jakarta Sans** provides humanist clarity for long passages and options; **JetBrains Mono** anchors the systems reality—timestamps, latency stats, error codes, and compliance checks.

- Chapter titles and narrative pauses rely strictly on `headline-*` roles. Use italic variants of Newsreader sparingly to denote internal engineer monologues or emergency PA transcripts.
- Interactive choices and architectural tradeoffs use `body-md` paired with `label-lg` actions to ensure immediate comprehension under cognitive load.
- Diagnostic telemetry, code diffs, database state transitions, and incident logs must be rendered in `label-md` or `label-sm` with tabular numerals enabled.

## Layout & Spacing

The layout is built around a mobile-first 390px baseline container that scales fluidly up to 480px on larger handhelds, centering cleanly within an atmospheric viewport frame on tablet and desktop viewports.

- **Column Structure:** Fluid 4-column system for mobile viewports with an active `1rem` (16px) margin and `1rem` gutter. On viewports exceeding 768px, the content container is constrained to a centered 480px column to preserve the focused intimacy of a handheld gamebook.
- **Rhythm & Touch Safety:** Vertical rhythm follows an 8px grid baseline (`space-sm`, `space-md`, `space-lg`, `space-xl`). All interactive choice surfaces enforce a minimum tap target height of 48px, with `space-md` gaps between divergent decisions to prevent mis-clicks during critical path moments.
- **Safe Area Insets:** Fixed header chrome and the sticky AI Tutor dock respect viewport environment safe areas (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`), padded using `space-md`.

## Elevation & Depth

Visual hierarchy uses tonal surface layering combined with low-contrast glass borders and precise ambient color diffusion:

- **Level 0 (Backdrop Base - `#101D35`):** Full viewport canvas, containing subtle background radial gradients of midnight blue (`#172846` at 40% opacity) positioned in the upper periphery.
- **Level 1 (Card & Content Surface - `#172846`):** Standard narrative containers and incident telemetry bars. Raised using a single pixel outline (`rgba(247, 241, 231, 0.12)`) and a muted, ambient shadow (`0 8px 24px -4px rgba(8, 14, 26, 0.60)`).
- **Level 2 (Active Decisions & Persistent AI Drawer):** Floating options and the bottom tutor drawer use an elevated midnight fill overlaid with subtle directional gradient shading (`linear-gradient(180deg, rgba(23, 40, 70, 0.95) 0%, #101D35 100%)`). Shadows expand to `0 12px 32px -4px rgba(8, 14, 26, 0.85)`.
- **Urgency & Status Glows:** Amber-highlighted components project a localized atmospheric halo (`0 0 20px rgba(245, 163, 74, 0.18)`). Muted teal surfaces project an architectural focus halo (`0 0 16px rgba(92, 166, 160, 0.20)`).

## Shapes

The design system employs a disciplined, balanced geometry (`roundedness: 2` / 0.5rem base radius). This avoids both the clinical chill of sharp razor corners and the casual playfulness of hyper-rounded pill interfaces, reinforcing a deliberate, mission-critical tool feeling.

- **Standard Cards, Panels, and Choice Trays:** Default to `0.5rem` (`rounded`).
- **Telemetry Indicators & Badges:** Use `0.25rem` (`rounded-sm`) for compact visual rigidity resembling hardware displays.
- **Persistent Bottom Drawer & Modals:** Top edges utilize `1rem` (`rounded-lg`) to clearly mark containment and sheet docking.
- **Dividers:** Fine 1px hairline rules with gradient fade-outs on each lateral end.

## Components

### 1. Narrative & Story Cards
- **Structure:** Level 1 background `#172846`, bordered with `rgba(247, 241, 231, 0.12)`. Padding is `space-lg`.
- **Header Elements:** Chapter timestamp badge in `JetBrains Mono` (`label-sm`), featuring an accent dot (`#F5A34A` for ongoing incident, `#5CA6A0` for resolved/pedagogical phase).
- **Typography:** Chapter titles in Newsreader (`headline-md`), body content in Plus Jakarta Sans (`body-md`) with high typographic contrast against `#F7F1E7`.

### 2. Interactive Decision Cards (Option A vs Option B)
- **Geometry & Target:** Minimum height of 64px, padding `space-md` across all axis.
- **Resting State:** `#172846` fill, 1px border `rgba(247, 241, 231, 0.14)`. Clear tactile prefix letter tag ("A" or "B") encased in a 24x24px rounded square with `JetBrains Mono` lettering.
- **Focused / Selected State:** Amber border (`#F5A34A`), deep amber tinted background overlay (`rgba(245, 163, 74, 0.08)`), and an amber ambient shadow glow.
- **Consequence Indicator:** Short metadata label at the card bottom indicating immediate system exposure (e.g., "Risk: High DB Lock Contention").

### 3. AI Tutor Persistent Drawer / Dock
- **Positioning:** Fixed to the viewport footer, elevated over the narrative flow with a translucent backdrop blur (`backdrop-filter: blur(12px)`).
- **Accent Scheme:** Highlighted with a 2px top border in Muted Teal (`#5CA6A0`) and an architectural icon indicator.
- **Content Mode:** Displays brief Socratic prompts ("Neden failover yerine circuit breaker?") with an expandable panel detailing underlying software engineering patterns without revealing the immediate solution.

### 4. Incident Telemetry & Health Ribbon
- **Layout:** Horizontal compact status array pinned below the chapter chrome or inside transition points.
- **Metrics Displayed:** Three concurrent monitors:
  1. *Database Integrity* (Percentage or ACID lock count)
  2. *Queue Backlog* (Message count with threshold bar)
  3. *Critical Services* (Triage status: Online / Degraded / Failover)
- **Formatting:** Data points use `label-md` in `JetBrains Mono`. Statuses toggle between `#5CA6A0` (stable), `#F5A34A` (degraded/warning), and soft crimson (`#E05252`) for active data corruption.

### 5. Debriefing & Lesson Analysis Cards
- **Format:** Modular post-chapter summaries compartmentalized into three clear engineering pillars:
  - **Mimari (Architecture):** Microservice isolation, retry storms, idempotency.
  - **Test & Doğrulama (Verification):** Shadow writes, chaos testing, synthetic monitoring.
  - **KVKK / Yasal Uyumluluk (Legal & Data Privacy):** Patient records, audit trail persistence, encrypted transit limits.
- **Design:** Each card category features an icon stamp, a crisp border accent in Muted Teal, and bulleted tradeoffs.

### 6. Tactile Segmented Selectors
- **Container:** Dark inset capsule (`#101D35`) with `space-xs` inner padding and `0.5rem` border radius.
- **Options:** Subdued text (`rgba(247, 241, 231, 0.6)`) that transitions to full `#F7F1E7` text on an active elevated tile (`#172846` with 1px border and low-opacity ambient drop shadow).