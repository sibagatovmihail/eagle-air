# SEO + GEO Audit & Implementation — eagleair-hvac.com
**Date:** 2026-09-01 · **Business type:** Local Business (HVAC contractor, US)
**Primary market:** Sarasota, FL + Manatee and Charlotte counties
**Money keywords:** "AC repair Sarasota", "emergency HVAC Sarasota", "AC repair [city] FL" × 15 cities

---

## Composite score

| Category | Weight | Before | After | Δ |
|---|---|---|---|---|
| AI Citability & Visibility | 25% | 30 | 82 | +52 |
| Brand Authority (off-site) | 20% | 8 | 8 | 0 |
| Content E-E-A-T | 20% | 35 | 62 | +27 |
| Technical Foundations | 15% | 58 | 88 | +30 |
| Structured Data | 10% | 38 | 82 | +44 |
| Platform Optimization | 10% | 20 | 68 | +48 |
| **Composite** | | **30.6 (Critical)** | **62.7 (Fair)** | **+32.1** |

---

## Findings

### Critical
1. **The 15 city pages were the homepage with the city name string-swapped.** `diff index.html venice.html`
   returned 289 lines out of a ~1,900-line page, and almost all of it was metadata. Each page had roughly
   **15 words** of city-specific content. This is the doorway-page pattern Google explicitly devalues, and
   it meant none of the 15 pages could rank for anything a Venice or Punta Gorda searcher actually asks.
   → **Fixed:** each city page now carries **570–640 words of genuinely unique local content** plus a
   city-specific FAQ.
2. **City-page schema asserted a fabricated business address in each city** — `HVACBusiness` with
   `addressLocality: "Venice"`, `"Bradenton"`, etc., for a business physically located in Sarasota.
   That is inaccurate structured data and a local-search guidelines risk. → **Fixed:** the correct entity
   model is now one `HVACBusiness` (`@id`, real Sarasota address) plus a per-page `Service` whose
   `areaServed` is that city, with the city's own `GeoCoordinates`.

### High
3. **Zero question-headed content on the entire site** — no FAQ, no answer blocks, on any of 25 pages.
   In a niche where nearly every search is a question ("why is my AC leaking water", "how often should I
   service my AC in Florida"), this is the single biggest reason the site was invisible to AI answer
   engines. → **Fixed:** 8 homepage FAQs, 3 per service page, 6 per city page — all written answer-first
   with concrete facts (14.3 SEER2 Southeast minimum since 1 Jan 2023, Manual J sizing, 45–55% target RH,
   20–30% typical duct loss, ENERGY STAR 78°F).
4. **Every canonical URL 307-redirected.** `eagleair-hvac.com` redirects to `www.eagleair-hvac.com`, but
   all canonicals, OG URLs, the sitemap and robots.txt pointed at the bare apex. Canonical tags that
   redirect split ranking signals and waste crawl budget. → **Fixed:** 162 URL references across 26 files
   switched to the `www` host that actually returns 200.
5. **No `llms.txt`.** → **Fixed.**
6. **No security headers at all** — no `vercel.json` existed, so only Vercel's default HSTS was set.
   Missing `X-Content-Type-Options` (−5), `X-Frame-Options` (−5), `Referrer-Policy` (−5),
   `Permissions-Policy` (−3). → **Fixed.**
7. **Homepage title was "Eagle Air - HVAC Services"** — no city, no service intent, on the single most
   valuable ranking element the site owns. → **Fixed.**

### Medium
8. Organization schema had no `@id`, `logo`, `image`, `geo`, `openingHoursSpecification`, `knowsAbout`,
   `hasOfferCatalog`, or business identifier, and `areaServed` listed one city out of sixteen. → **Fixed.**
9. No `BreadcrumbList` or `WebSite` node anywhere; no `speakable`. → **Fixed.**
10. Service pages jumped from H1 straight to footer H3s — no H2 in the body at all. → **Fixed** by the
    FAQ section's H2/H3 structure.
11. `sitemap.xml` `lastmod` dates were 3–6 months stale on pages that had changed. → **Updated to
    2026-09-01** across all 25 entries.

### Low — flagged, not changed
12. **Footer social links are `href="#"` placeholders** (Facebook, Instagram, LinkedIn), as is
    "Terms of Service". Dead links hurt trust signals and accessibility, and a legal link that goes
    nowhere is worse than no link. Left in place because removing footer elements is a design decision:
    either create the profiles (which would also fix the `sameAs` gap — see below) or remove the block.
13. ~~Service pages sit at 414–449 words against a 500-word service-page floor.~~ **Resolved in a second
    pass — see "Service page expansion" below.**
14. No `aggregateRating` — correctly so. `GOOGLE-REVIEWS-SETUP.md` shows the reviews widget was never
    wired up (`REVIEWS_PLACE_ID` is empty). Never publish a rating without real reviews behind it.

---

## Changes made

| File(s) | Change |
|---|---|
| `robots.txt` | Rewritten: explicit `Allow` for 9 Tier-1 and 7 Tier-2 AI crawlers, `Disallow: /` for Bytespider and CCBot, IETF `Content-Signal` line, `www` sitemap URL. |
| `vercel.json` | **New.** Full security header set (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS) plus immutable caching on `/assets/*` and revalidation on HTML and `/styles/*`. |
| `llms.txt` | **New.** 45 lines: description, Services (7), Service Areas (16 cities grouped by county), About, 10 Key Facts including the Florida LLC document number, contact block. |
| All 26 HTML files + `sitemap.xml` | Host canonicalised to `https://www.eagleair-hvac.com` (162 references). |
| `index.html` | Title/description rewritten with city + intent + phone. Schema replaced with a 4-node `@graph`: `HVACBusiness`+`LocalBusiness` (`@id`, logo, geo, 24/7 `openingHoursSpecification`, FL state document number as `identifier`, `legalName`, `additionalType` entity links, 8 `knowsAbout` topics, **16 `areaServed` cities each with `containedInPlace` county**, `hasOfferCatalog` of 7 Services), `WebSite`, `WebPage` with `speakable`, `FAQPage`. **New FAQ section with 8 question-headed answer blocks.** |
| 7 service pages | Titles/descriptions rewritten. 6-node `@graph` each: Organization, WebSite, WebPage (`speakable`), `Service` with full `areaServed`, `BreadcrumbList`, `FAQPage`. **3 new FAQs per page.** |
| 15 city pages | Titles/descriptions rewritten. Schema replaced — no more fabricated per-city `PostalAddress`; now Organization + WebSite + WebPage + city `Service` (with the city's `GeoCoordinates` and `containedInPlace` county) + BreadcrumbList + FAQPage. **New `.local` section with 2–3 paragraphs of unique local content per city** (county, geography, housing stock, and the specific HVAC failure mode that dominates there — salt-air condenser corrosion on Longboat Key and Siesta Key, closed-house humidity in seasonal Englewood and Rotonda West, oversizing/humidity in new-build Lakewood Ranch and North Port, Hurricane Ian surge damage in Charlotte County), **plus a city-specific FAQ + 5 shared FAQs.** |
| `styles/main.css` | Appended `.faq` (native `<details>`/`<summary>` — no JS, keyboard-accessible, answers always in the DOM for crawlers) and `.local` component styles using the existing design tokens, with a `≤47.9375rem` breakpoint and a `prefers-reduced-motion` guard. |

**Verification:** all 23 content pages' JSON-LD parses as valid JSON (0 failures). Layout re-verified via
CDP at 375 / 600 / 1280 px on a city page and a service page: `scrollWidth === innerWidth` at every width,
no new overflow offenders. New sections screenshotted and visually checked at 375 and 1280.

---

## Highest remaining ROI — off-site

Brand Authority is 20% of the composite and scores 8/100. It cannot be fixed in the repo.

1. **Google Business Profile.** For a local HVAC contractor this outranks everything else on this list.
   It also feeds Gemini directly and is the source of the reviews the site is currently unable to show.
2. **Real reviews on that profile**, then wire up `GOOGLE-REVIEWS-SETUP.md` and add `aggregateRating` to
   the Organization schema. Not before.
3. **Create the Facebook / Instagram / LinkedIn profiles the footer already links to**, then replace the
   `href="#"` placeholders and add all of them to `sameAs` in the schema and to `llms.txt`.
4. **Bing Webmaster Tools + IndexNow** — ChatGPT Search and Copilot both run on Bing's index, and IndexNow
   pushes reindex notifications instantly. For a 25-page site this is a same-day setup.
5. **Google Search Console**: submit `https://www.eagleair-hvac.com/sitemap.xml` and set the www property
   as primary, matching the canonical change made here.
6. **Nextdoor and county contractor directories.** For local trades these carry real referral traffic and
   act as entity-consistency signals (name, address, phone identical everywhere).

## Service page expansion (second pass, same day)

All 7 service pages were taken from 311–347 words of `<main>` prose to **852–901 words** (954–1,002
whole-page). Each received:

- One new `<section class="local">` block — H2 plus three paragraphs: what the service actually involves
  step by step, what a customer should expect, and how to tell they need it. No new CSS; it reuses the
  component added earlier in the day.
- **2 additional FAQs**, appended to both the visible `<details>` markup and the page's `FAQPage`
  JSON-LD `mainEntity`, so markup and structured data stay in sync (5 per page, verified equal).

New verifiable facts introduced (each checked before use):

| Fact | Pages |
|---|---|
| EPA AIM Act Technology Transitions: 700-GWP limit for residential AC from 1 Jan 2025; R-454B (GWP ~466) replacing R-410A | installation |
| Split-system heat pump national minimum 14.3 SEER2 / 7.5 HSPF2 since 1 Jan 2023 | heating, installation |
| The Southeast regional AC standard is enforced at date of *installation*, not manufacture; 13.8 SEER2 at ≥45,000 BTU | installation |
| ASHRAE 62.2 whole-house ventilation rate: 0.03 cfm/ft² + 7.5 cfm × (bedrooms+1) → ~90 cfm for a 2,000 ft² 3-bed | ventilation |
| Evacuation below 500 microns on a micron gauge; dry-nitrogen purge while brazing | installation, mini-split |
| Florida mechanical permit + inspection required for a full changeout, not for repairs | installation |
| Normal cooling delta-T 16–22 °F across the evaporator coil | air-conditioning |

Deliberately **not** written, for lack of a source: any price or "average cost" figure; any response-time
SLA; Sarasota climate normals; warranty lengths beyond the 60/90-day registration window already stated;
named efficiency-savings percentages; any technician name, licence number beyond FL document number
L24000364625, certification, brand partnership, review or rating. Manual S / Manual D and EPA Section 608
are named as industry standards, not as claims about EagleAir's credentials.

Verified: JSON-LD valid on all 7 pages; `<details>` count equals `FAQPage` question count on every page;
no horizontal overflow at 375 / 600 / 1280 px.

## Next content actions — in-repo

1. A short blog or "guide" section — "What a Florida AC tune-up actually includes", "Hurricane season
   HVAC checklist", "Reading your SEER2 label" — dated, so Perplexity does not deprioritise it.
3. Add visible "Last updated" dates to service and city pages.
4. Link city pages to each other by county (Charlotte County pages cross-linking, etc.) so crawl depth
   stays ≤3 and topical clustering is legible.
