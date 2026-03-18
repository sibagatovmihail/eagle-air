# EagleAir — Project Standards

## Core Directive: 1:1 Design Fidelity

- **Strict adherence:** Implement an exact 1:1 copy of the Figma design. Do not add, remove, or "improve" any element.
- **Non-creative mode:** If it is not in the Figma design, it does not belong in the code.
- **Style source:** Use only the hex codes and tokens defined in `styles/tokens.css`. Never use framework defaults or arbitrary values.

---

## Figma MCP Integration

- Always call `get_design_context` **and** `get_variable_defs` for every new section before writing any CSS.
- Rely on the semantic layer (metadata) for spatial data — never estimate visually from screenshots.
- After rendering, compare against the Figma screenshot. Any discrepancy > 1px (equivalent rem value) must be corrected.

---

## Unit System

| Use | Rule |
|---|---|
| All sizing | `rem` (px ÷ 16) |
| 1px borders / dividers | `px` only exception |
| Viewport-relative | `dvh`, `dvw`, `svh` for hero/full-bleed |
| Never | Hard-coded `px` widths or heights |

---

## Layout Engines

- **CSS Grid** — page-level structure, multi-column grids (service cards, feature lists).
- **Flexbox** — component-level: navbars, buttons, badges, icon+text pairs.
- **Positioning** — `relative` by default; `absolute` only for overlapping layers (hero background, overlays).

---

## Container Pattern

Every section uses an inner `.container` div — never pad the section itself:

```css
.container {
  max-width: 72.5rem;          /* 1160px */
  margin-inline: auto;
  padding-inline: var(--space-lg); /* 1.5rem — safety padding on small screens */
}
```

Example: `<section class="hero"><div class="container hero__container">…</div></section>`

---

## Responsive Breakpoints

Use these four named tiers consistently across **all** stylesheets:

| Token name | Value | Context |
|---|---|---|
| Desktop | `> 64rem` (1024px) | Full layout — no overrides needed |
| Tablet landscape | `≤ 64rem` | Tighten gaps, reduce logo height slightly |
| Tablet portrait | `≤ 48rem` | Hamburger appears, desktop nav hides |
| Phone | `≤ 37.5rem` | Logo crops to icon-only, hamburger moves to far right |
| Small phone | `≤ 30rem` | Topbar text hidden |

**Never use single-step jumps.** Scale properties progressively across breakpoints. Use `clamp()` for fluid type where appropriate.

---

## Header Rules

- **Logo on phone (≤ 37.5rem):** Crop via `width: 3.9375rem; overflow: hidden` on `.navbar__logo` to show icon portion only — no extra asset needed.
- **Hamburger order:** On mobile, hamburger must be the **rightmost** element. Use `order: 2` on `.hamburger` and `order: 1` on `.btn-cta` at `≤ 37.5rem`.
- **CTA button:** Never resize at the tablet breakpoint (`≤ 48rem`). Only reduce at phone (`≤ 37.5rem`).
- **Topbar:** Collapses on scroll via `.scrolled` class; stacks vertically at `≤ 48rem`; text hidden at `≤ 30rem`.

---

## Hero Section Rules

- **Height:** `calc(100dvh - var(--header-height))` — JS sets `--header-height` on `:root` via `updateSpacer()`.
- **Gap:** The `3.75rem` (60px) gap between the text block (`.hero__text`) and the CTA buttons (`.hero__actions`) must **never** be overridden by responsive rules.
- **Button stacking breakpoint:** `≤ 37.5rem` (600px) — not at tablet width.
- **Heading scale:** At `≤ 48rem` scale to `2.5rem`; at `≤ 37.5rem` scale to `2rem`.

---

## HTML Semantics

Use semantic tags: `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<article>`.
Wrap all text elements (`<span>`, `<p>`, `h1, h2, h3, h4, h5, h6`, `<a>`) in a `<div>` cover element — apply layout/spacing styles to the cover, not the text node directly. Apply this rule to the forms as well. 

---

## Asset Handling

- **Icons and logos:** Export as SVG from Figma using `download_figma_images`.
- **Images:** Download from Figma MCP asset URLs; rename to reflect content (`hero-bg.png`, not generic names).
- **Optimization:** Strip metadata, use correct file extension (verify with `file` command).

---

## Anti-Pattern Guardrails

- No creative additions — no social icons, hover effects, or features absent from Figma.
- No `px` widths/heights (except 1px borders).
- No Tailwind defaults or framework color palettes.
- No `overflow: hidden` on `<body>` or `<html>` — use it only on specific components that require clipping.

---

## CSS Architecture

Before writing styles, map out which CSS files exist and which are actually `<link>`ed in HTML. Designate one aggregator file (e.g. `main.css`) for all sections that don't have a dedicated file. Never create a new stylesheet per feature — append to the aggregator instead.

**Checklist for every project:**
- List all CSS files and confirm which are loaded.
- Any file not in a `<link>` tag is dead — do not write styles there.
- The aggregator file takes all miscellaneous section styles (cards, forms, modals, banners, trust blocks, etc.).
- Dedicated files stay scoped: one file per structural component (header, hero, footer).

---

## SEO Meta Template

Every page `<head>` must contain the full set before any `<link rel="stylesheet">`:

```html
<meta name="robots" content="index, follow">
<meta name="theme-color" content="[primary brand color]">
<link rel="icon" type="image/png" href="assets/[icon].png">
<link rel="apple-touch-icon" href="assets/[icon].png">
<link rel="dns-prefetch" href="//[any third-party API domain]">
<meta name="description" content="[150–160 chars, primary keyword + location/value prop]">
<link rel="canonical" href="https://[domain]/[page].html">
<meta property="og:type" content="website">
<meta property="og:title" content="[same as <title>]">
<meta property="og:description" content="[same as description]">
<meta property="og:url" content="https://[domain]/[page].html">
<meta property="og:image" content="https://[domain]/assets/images/[og-image].png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[same as title]">
<meta name="twitter:description" content="[same as description]">
<meta name="twitter:image" content="https://[domain]/assets/images/[og-image].png">
```

Sitemap priorities: homepage `1.0` · category/service pages `0.7–0.8` · detail/location pages `0.6–0.8`. All entries include `<lastmod>` and `<changefreq>`.

---

## JSON-LD Schemas

Every page type gets a schema matched to its content. Use the most specific applicable `@type`.

**Homepage / main brand page** — use `Organization` or the most specific business type (e.g. `LocalBusiness`, `MedicalBusiness`, `Store`):
```json
{ "@context":"https://schema.org","@type":"[BusinessType]",
  "name":"[Brand]","url":"https://[domain]/","telephone":"[phone]",
  "address":{"@type":"PostalAddress","addressLocality":"[City]","addressRegion":"[State]","addressCountry":"[CC]"} }
```

**Service / feature pages** — use `Service`, linking back to the provider:
```json
{ "@context":"https://schema.org","@type":"Service","name":"[Service Name]",
  "provider":{"@type":"[BusinessType]","name":"[Brand]","url":"https://[domain]/"},
  "areaServed":{"@type":"City","name":"[City]"},"url":"https://[domain]/[page].html" }
```

**Location / area pages** — always use the actual city in `addressLocality`. Never copy-paste from another page without updating location-specific fields:
```json
{ "@context":"https://schema.org","@type":"LocalBusiness","name":"[Brand] — [City]",
  "url":"https://[domain]/[city-slug].html",
  "address":{"@type":"PostalAddress","addressLocality":"[This Page's City]","addressRegion":"[State]","addressCountry":"[CC]"} }
```

---

## Contact Form

- **Submission:** Always fetch-based (`fetch` + `FormData` or JSON body). Do not rely on native `action=` POST — it causes full page reload and prevents custom success handling.
- **`enctype`:** Do not set it unless the API explicitly requires multipart. Most form APIs (Web3Forms, Formspree, etc.) parse `application/x-www-form-urlencoded` by default; setting `enctype="multipart/form-data"` breaks them.
- **Reset on success:** Call `form.reset()` then manually restore any custom-styled controls (dropdowns, toggles, hidden inputs) that `reset()` doesn't reach.
- **Success feedback:** Use a centered overlay modal, not an inline message. Dismiss on: confirm button click, backdrop click, Escape key. All modal styles live in the aggregator CSS file — never in a file that isn't linked.
