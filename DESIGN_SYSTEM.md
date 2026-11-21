# HRShakti — Master Design System & Visual Foundation

**Brand:** HRShakti  
**Tagline:** People. Knowledge. Possibilities.  
**Status:** Preparation Foundation (Unapplied — Active site appearance preserved)

---

## 1. Existing Architecture & Preservation Scope

- **Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React icons, and an Express 4 REST backend (`server.ts`) serving seeded HR community data with cookie/bearer session authentication (`hrshakti_session`).
- **Active Theme Wiring**: `ThemeContext` toggles `document.documentElement.dataset.theme` between `"light"` and `"dark"` and persists preference in `localStorage("hrshakti-theme")`, respecting OS `prefers-color-scheme`.
- **Preservation Status**: All existing routes, public pages, workspace screens, API endpoints, and the current visual stylesheet (`src/index.css`) remain completely untouched. New tokens live in isolated files (`src/styles/design-tokens.css` and `src/styles/designTokens.ts`) ready for phased rollout starting with Dark Theme in the next phase.

---

## 2. Brand & Semantic Colour System

### Core Brand Palette

| Token | Role | Hex |
|---|---|---|
| `color/brand/navy` | Deep Navy — authority, brand identity, structural anchors | `#142D4E` |
| `color/brand/teal` | Teal — primary interactive accent, CTAs, active navigation | `#168C83` |
| `color/text/primary` | Charcoal (Light base primary text) | `#242B35` |
| `color/text/secondary` | Slate (Light base secondary text) | `#64748B` |
| `color/text/muted` | Grey (Light base muted metadata) | `#94A3B8` |
| `color/border/default` | Light Grey (Light base hairline dividers) | `#E7EDF2` |

### Dark Theme Tokens (`[data-ds-theme="dark"]`)

| Category | Token | Value |
|---|---|---|
| Background | `--ds-background` / `--ds-background-subtle` | `#101923` / `#0D151E` |
| Surfaces | `--ds-surface` / `--ds-surface-elevated` / `--ds-surface-muted` | `#172330` / `#1D2B39` / `#131E2A` |
| Typography | `--ds-text-primary` / `--ds-text-secondary` / `--ds-text-muted` | `#F1F5F9` / `#A7B3C2` / `#7F8D9D` |
| Borders | `--ds-border` / `--ds-border-strong` | `#2B3A49` / `#394B5E` |
| Interactive | `--ds-interactive` / `--ds-interactive-hover` / `--ds-interactive-text` | `#168C83` / `#1AA399` / `#2FC4B8` |
| Focus Ring | `--ds-focus-ring` | `rgba(47, 196, 184, 0.40)` |
| Status | Success / Warning / Error / Info | `#2BB67D` / `#E0A63E` / `#EF6B6B` / `#5FA0E0` |
| Status Surface | Success / Warning / Error / Info Bg | `#132B24` / `#2B2314` / `#2F191C` / `#152538` |

### Light Theme Tokens (`[data-ds-theme="light"]`)

| Category | Token | Value |
|---|---|---|
| Background | `--ds-background` / `--ds-background-subtle` | `#F5F7FA` / `#EEF2F6` |
| Surfaces | `--ds-surface` / `--ds-surface-elevated` / `--ds-surface-muted` | `#FFFFFF` / `#FFFFFF` / `#F8FAFC` |
| Typography | `--ds-text-primary` / `--ds-text-secondary` / `--ds-text-muted` | `#242B35` / `#64748B` / `#94A3B8` |
| Borders | `--ds-border` / `--ds-border-strong` | `#E7EDF2` / `#CBD5E1` |
| Interactive | `--ds-interactive` / `--ds-interactive-hover` / `--ds-interactive-text` | `#168C83` / `#12756D` / `#11736B` |
| Focus Ring | `--ds-focus-ring` | `rgba(22, 140, 131, 0.35)` |
| Status | Success / Warning / Error / Info | `#16845B` / `#C58A28` / `#D94A4A` / `#3976B8` |
| Status Surface | Success / Warning / Error / Info Bg | `#EAF6EF` / `#FFF6E5` / `#FDECEC` / `#EDF4FC` |

---

## 3. Typography & 4px Spacing System

- **Primary Font Family**: `Inter` (`400`, `500`, `600`, `700`). Declared in tokens now; Google Fonts stylesheet loading swaps in during Phase 2 rollout.
- **Type Scale**:
  - `Display Large`: `48px / 56px` (Public heroes)
  - `Display Medium`: `40px / 48px`
  - `H1`: `32px / 40px`
  - `H2`: `24px / 32px`
  - `H3`: `20px / 28px`
  - `H4`: `16px / 24px`
  - `Body Large`: `16px / 26px`
  - `Body`: `14px / 22px`
  - `Body Small`: `13px / 20px`
  - `Label`: `12px / 16px`
- **4px Spacing Scale**: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px`.
- **Radius Scale**: `radius/sm` (`4px`), `radius/md` (`8px` buttons/inputs), `radius/lg` (`12px` cards), `radius/full` (`9999px` avatars/badges).

---

## 4. Layout Foundation & Breakpoints

- **Public Website**: `1200px–1280px` max content width, generous section pacing, responsive navigation drawer.
- **Dashboard / Workspace**: `248px` expanded sidebar (`76px` collapsed), `68px` top bar, `32px` desktop page padding.
- **Breakpoints**: Mobile `< 768px`, Tablet `768px–1023px`, Desktop `>= 1024px`.

---

## 5. Component Design Language & Accessibility

- **Buttons**: `40–44px` height, `8px` radius; variants `Primary` (`#168C83` fill), `Secondary` (`1px` `--ds-border-strong`), `Tertiary/Ghost`, `Destructive` (`--ds-error`); states `Default`, `Hover`, `Focus`, `Active`, `Disabled`, `Loading`.
- **Cards**: `12px` radius, `1px solid var(--ds-border)`, `--ds-shadow-sm` / `--ds-shadow-md` (single elevation), `20–24px` internal padding.
- **Inputs**: `42–44px` height, `8px` radius, clear labels, focus ring (`--ds-focus-ring`), error border + descriptive message (`--ds-error`), disabled and filled states.
- **Iconography**: `lucide-react` outline icons strictly at `16px`, `18px`, `20px`, `24px`, `32px`. No emoji icons.
- **WCAG 2.2 AA**: Minimum 4.5:1 text contrast, visible keyboard focus indicators, semantic landmarks, non-color-only status indicators (always paired with icon or text label), and `>= 44px` touch targets on interactive controls.
