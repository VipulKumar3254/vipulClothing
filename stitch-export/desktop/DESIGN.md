---
name: Modern Editorial Atelier
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#45483f'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#75786e'
  outline-variant: '#c5c8bc'
  surface-tint: '#546341'
  primary: '#142005'
  on-primary: '#ffffff'
  primary-container: '#283618'
  on-primary-container: '#8fa078'
  inverse-primary: '#bbcda3'
  secondary: '#745b22'
  on-secondary: '#ffffff'
  secondary-container: '#ffdb96'
  on-secondary-container: '#795f26'
  tertiary: '#182000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c3607'
  on-tertiary-container: '#93a066'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e9bd'
  primary-fixed-dim: '#bbcda3'
  on-primary-fixed: '#121f05'
  on-primary-fixed-variant: '#3d4b2b'
  secondary-fixed: '#ffdea1'
  secondary-fixed-dim: '#e4c27f'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5a430b'
  tertiary-fixed: '#dbe9a9'
  tertiary-fixed-dim: '#bfcd8f'
  on-tertiary-fixed: '#171e00'
  on-tertiary-fixed-variant: '#404b1b'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  price-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
  space-3xl: 6rem
---

## Brand & Style

This design system establishes an elevated, editorial-first luxury commerce presence. Balancing high-fashion print sensibilities with tactile modern e-commerce utility, it evokes architectural poise, curated restraint, and warm hospitality.

### Visual Style
- **Aesthetic:** Editorial Minimalism merged with Warm Naturalist Modernism.
- **Atmosphere:** Expansive breathing room, serene parchment undertones, structured framing, razor-sharp hairline dividers, and deliberate micro-typography.
- **Personality:** Decisive, refined, cultured, and effortless. Avoids synthetic neon tropes in favor of organic deep earth tones, warm brass, and deep tailored blacks.

## Colors

The color system relies on natural textural harmony rather than stark synthetic white:

- **Canvas & Backdrops:** Warm parchment canvas (`#FBF9F5`) delivers a tactile magazine-paper feel, complemented by pristine pure white (`#FFFFFF`) for elevated product display cards and modular pop-outs.
- **Primary Olive (`#283618`):** Deep botanical evergreen used for key brand focal points, high-priority buttons, active states, and grounding anchors.
- **Neutral Charcoal (`#18181B`):** Deep carbon black used for crisp typography, high-fashion borders, and authoritative structural headers.
- **Brass & Ochre Accent (`#C2A262`):** A restrained warm metallic tone used for curated collection badges, editorial labels, subtle hover interactions, and highlight moments.
- **Subtle Linework (`#E5E2DA`):** Delicately muted 1px border lines defining grids, cards, and navigation elements without creating visual noise.

## Typography

Typography is treated with high-fashion discipline:

- **Editorial Headlines (`Playfair Display`):** Reserved for seasonal hero narratives, campaign launches, and prominent category highlights. Brings classic luxury masthead stature.
- **Interface & Utility (`Inter`):** Delivers clean readability for product titles, transactional pricing, filter systems, and long-form descriptions.
- **Editorial Micro-Caps (`label-caps`):** Rendered strictly in uppercase with wide letter-spacing (`0.12em`) for category paths, badges, timestamps, and table headers to evoke high-end lookbooks.

## Layout & Spacing

A 12-column responsive grid underpins all layouts, anchored by a max-width container of `1440px`.

- **Desktop (1024px+):** 12 columns with 24px–32px gutters and 48px outer page padding. Sections enjoy generous vertical gaps (`space-2xl` to `space-3xl`) to establish catalog grandeur.
- **Tablet (768px–1023px):** 8 columns, 16px gutters, 24px margins. Product grids reflow into 2 or 3 columns.
- **Mobile (< 767px):** 4 columns, 12px gutters, 16px margins. Product listings format either in a dual 2-column card matrix or a full-bleed swipeable horizontal reel.

## Elevation & Depth

Visual hierarchy is maintained via fine perimeter outlines and soft ambient occlusion rather than heavy drop shadows:

- **Surface Layering:** The primary canvas is warm parchment (`#FBF9F5`). Elevated product tiles, drawers, and modal panels use pure white (`#FFFFFF`) to naturally lift content off the background.
- **Hairline Framing:** Crisp 1px borders in `#E5E2DA` wrap product cards, header bars, and collection blocks, giving the impression of an architectural print sheet.
- **Ambient Shadow System:**
  - *Resting Card:* `0 2px 8px -2px rgba(24, 24, 27, 0.04), 0 1px 2px -1px rgba(24, 24, 27, 0.03)`
  - *Floating Hover / Dropdown:* `0 12px 28px -6px rgba(24, 24, 27, 0.08), 0 4px 10px -2px rgba(24, 24, 27, 0.03)`
  - *Sticky Header / Bottom Sheet:* `0 4px 20px -2px rgba(40, 54, 24, 0.05)`

## Shapes

The geometric approach is tailored, crisp, and intentional:

- **Standard Elements (Cards, Inputs, Modals):** Soft `4px` corner radii (`roundedness: 1`) to preserve structure and tailoring.
- **Pill Badges & Circular Actions:** Badges (e.g., "NEW SEASON", "LIMITED EDITION") and circular carousel paddles utilize full pill rounding (`9999px`) to create an elegant contrast against architectural rectangular image containers.

## Components

### Buttons
- **Primary Button:** Solid deep olive (`#283618`) background, white text (`#FFFFFF`), `14px` medium weight, uppercase with slight tracking (`0.06em`). Height: 48px with 24px horizontal padding. Hover shifts to `#1c2611`.
- **Editorial Secondary Button:** Crisp white background with 1px border (`#18181B`), text in `#18181B`. Hover inverts to solid charcoal `#18181B` with white text.
- **Underlined Text Action:** Raw text link with a permanent or animated 1px bottom border in brass (`#C2A262`) with 4px padding offset.

### Product Cards
- **Structure:** Pure white card surface with a 1px border (`#E5E2DA`) and 4px radius. 
- **Imagery:** 3:4 or 4:5 vertical portrait aspect ratio with an uncropped image container, featuring an off-center floating pill badge (e.g., `OFFER`, `PRE-ORDER`).
- **Typography Block:** Set below the image with generous padding (`16px`). Displays capitalized category label (`label-caps`), title in clean `body-md`, and bold contrast pricing (`price-lg`).

### Input Fields & Search
- **Search Header:** 44px height, warm background (`#F4F1EA`), borderless or 1px subtle border (`#E5E2DA`), embedded magnifying icon, and placeholder in `#71717A`.
- **Form Controls:** 48px height, pristine white surface, 1px border (`#D6D1C6`). Active focus state adopts a 1.5px outline in deep olive green (`#283618`).

### Chips & Filters
- **Pill Badges:** 26px height, rounded `9999px`, 12px horizontal padding. Background `#F4F1EA` with `#18181B` text. Selected state turns into deep olive green (`#283618`) with white text.

### Navigation Bar & Footer
- **Navigation:** Crisp top bar framed by a 1px baseline border. Centered serif or balanced wordmark, clean uppercase menu links (`label-caps`) with 32px gap, and minimal stroke icon actions for search, profile, and bag.
- **Footer:** Grounded charcoal black (`#18181B`) background with off-white muted text (`#A1A1AA`), brass accents, four structured link columns, and a clean newsletter sign-up strip.