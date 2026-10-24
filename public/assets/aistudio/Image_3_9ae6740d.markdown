---
name: Obsidian Kinetic
colors:
  surface: '#11131c'
  surface-dim: '#11131c'
  surface-bright: '#373943'
  surface-container-lowest: '#0c0e17'
  surface-container-low: '#191b24'
  surface-container: '#1d1f29'
  surface-container-high: '#282933'
  surface-container-highest: '#32343e'
  on-surface: '#e1e1ef'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e1e1ef'
  inverse-on-surface: '#2e303a'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ddb7ff'
  on-tertiary: '#490080'
  tertiary-container: '#b76dff'
  on-tertiary-container: '#400071'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#11131c'
  on-background: '#e1e1ef'
  surface-variant: '#32343e'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies an uncompromising, high-precision dark cinematic aesthetic engineered for high-agency knowledge workers, executive operators, and modern builders. It positions productivity software not as a passive utility, but as an intelligent command interface.

### Aesthetic Ethos
- **Void & Luminescence:** The visual hierarchy is anchored in deep obsidian and midnight foundations, relying on luminance contrast and subtle photonic glows rather than heavy structural containers.
- **Restrained Glassmorphism:** Translucent surfaces, selective backdrop blurs (16px to 24px), and hairline perimeter highlights evoke precision-milled optical glass.
- **Instrument Precision:** Dense, clean data visualization, micro-indicators, and crisp typography create the tactile responsiveness of an advanced cockpit instrument.

## Colors

The palette is tuned specifically for low-light immersion, minimizing eye strain while delivering clear visual hierarchies through controlled spectral accents.

### Core Architecture
- **Base Surfaces:**
  - Canvas Deep: `#0A0B10` (void backdrop)
  - Surface Mid: `#10121B` (primary card and panel base)
  - Surface Elevated: `#161926` (dialogs, flyouts, and floating trays)
  - Surface Hover: `#1E2235` (interactive resting hover state)
- **Dividers & Strokes:**
  - Muted Slate Border: `#232738` (default subtle separation)
  - Hairline Highlight: `rgba(255, 255, 255, 0.08)` (top inner highlight for glass cards)
- **Spectral Accents:**
  - Primary (Indigo): `#6366F1` with glow variant `#818CF8`
  - Secondary (Electric Blue): `#3B82F6` with highlight `#60A5FA`
  - Tertiary (Radiant Violet): `#A855F7`
- **Text & Content Hierarchy:**
  - Primary Foreground: `#F8FAFC` (pure readability)
  - Secondary Foreground: `#94A3B8` (metadata, sublabels)
  - Tertiary Foreground: `#64748B` (keyboard shortcuts, placeholder states)
  - Ghost Foreground: `#334155` (inactive ticks, disabled text)

## Typography

The type scale combines **Plus Jakarta Sans** for structural headers with **Inter** for data layers and functional reading surfaces.

- **Headlines:** Use tight negative letter-spacing (`-0.01em` to `-0.03em`) on Plus Jakarta Sans to maintain density and punch in headlines and KPI readouts.
- **Body & Data:** Inter delivers neutral clarity across diverse data inputs, timelines, and analytical metrics.
- **Labels & Badges:** Utilize `label-sm` with slight positive tracking (`0.04em`) and uppercase styling for micro-tags, system state stamps, and operational breadcrumbs.

## Layout & Spacing

The spatial engine relies on a strict 4px/8px incremental grid with a 12-column responsive fluid grid designed for dense information architecture.

- **Desktop (1280px+):** 12 columns, 24px gutters, 48px canvas margin. Max-width constraints sit at 1440px for standard dashboards, expanding to full-bleed for timeline orchestration views.
- **Tablet (768px - 1279px):** 8 columns, 20px gutters, 32px canvas margin. Secondary sidebars collapse into quick-drawer panels.
- **Mobile (Up to 767px):** 4 columns, 16px gutters, 16px canvas margin. Multi-column dashboards collapse strictly into vertical card streams.
- **Component Padding Scale:**
  - Ultra-dense interactive elements (chips, inputs, table cells): `space-xs` (4px) to `space-sm` (8px).
  - Standard structural modules (cards, modals): `space-lg` (20px) to `space-xl` (32px).

## Elevation & Depth

Depth in this system avoids generic heavy drop shadows, relying instead on translucent layering, subtle directional ambient luminescence, and razor-sharp border tiers.

### Surface Tiers
- **Tier 0 (Base Canvas):** `#0A0B10` with zero blur or elevation.
- **Tier 1 (Cards & Groups):** `rgba(16, 18, 27, 0.75)` with `16px` backdrop-filter blur, enclosed by a 1px solid border of `#232738`.
- **Tier 2 (Floating Popovers & Navbars):** `rgba(22, 25, 38, 0.85)` with `24px` backdrop-filter blur, 1px border of `rgba(255, 255, 255, 0.08)`, and an ambient drop shadow: `0 12px 32px -4px rgba(0, 0, 0, 0.5)`.
- **Tier 3 (AI Focus & Active Overlays):** Same as Tier 2, complemented by a soft radial bloom: `0 0 24px -2px rgba(99, 102, 241, 0.18)` to signify active contextual processing.

### Specular Edge Effect
Cards and elevated surfaces incorporate an inset top highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.07)` to simulate chamfered glass catching light from an overhead source.

## Shapes

The interface balances sharp industrial geometry with soft ergonomics.

- **Base Radius (0.25rem / 4px):** Applied to micro-indicators, inline code tags, tooltips, and checkboxes.
- **Card & Input Radius (`rounded-lg`, 0.5rem / 8px):** Standard for form inputs, table containers, task nodes, and interface modules.
- **Dialog & Panel Radius (`rounded-xl`, 0.75rem / 12px):** Applied to core modals, large panels, and command palettes.
- **Pill Radius (Full / 9999px):** Strictly reserved for dynamic status badges, AI query chips, and active user avatars.

## Components

### Buttons
- **Primary:** Solid indigo gradient background (`linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)`), pure white text, 8px border-radius, accompanied by a subtle interactive glow on hover (`box-shadow: 0 0 16px rgba(99, 102, 241, 0.4)`).
- **Secondary:** Surface Mid background (`#10121B`), 1px solid `#232738` border, `#F8FAFC` text. On hover, background shifts to `#161926` with border accentuating to `rgba(255, 255, 255, 0.16)`.
- **Ghost:** Transparent background, `#94A3B8` text, transitioning to `#F8FAFC` text and `rgba(255, 255, 255, 0.04)` fill on hover.

### Chips & Status Badges
- Built using full pill roundedness.
- Active AI / Live State: Tinted translucent background (`rgba(59, 130, 246, 0.12)`), 1px border (`rgba(59, 130, 246, 0.3)`), electric blue text (`#60A5FA`), and a 6px glowing indicator dot pulsing at `opacity: 0.8`.

### Input Fields & Command Bars
- Background: `#0A0B10` with a 1px border of `#232738`.
- Focus State: Border transitions to `#6366F1` with an outer micro-glow (`box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15)`).
- Text: Crisp 14px Inter with placeholder text at `#64748B`. Integrated keyboard shortcut hints displayed as muted right-aligned badges (`#161926` fill, `#94A3B8` label).

### Cards & Dashboards
- Glass-backed canvas utilizing 16px backdrop blur over dark foundations.
- Hairline top edge highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.06)`).
- Structured internal padding using `space-lg` (20px).

### Form Elements (Checkboxes & Radios)
- 16x16px footprint with 4px border radius for checkboxes.
- Border: 1.5px solid `#232738`. Checked state transitions to a solid `#6366F1` fill carrying an animated micro-checkmark in `#FFFFFF`.

### High-Precision Metric Badges & Sparklines
- Metric Readout: `headline-md` Plus Jakarta Sans with a tabular numeral layout (`font-variant-numeric: tabular-nums`).
- Integrated vector sparklines utilizing 1.5px stroke width (`#3B82F6` or `#A855F7`) with vertical gradient fills fading to `rgba(59, 130, 246, 0)`.