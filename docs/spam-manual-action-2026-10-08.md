# Search Console: "aggressive spam techniques" (affects all pages), 2026-10-08

## What we found
- **Not cloaking.** `curl` with a browser UA and with a Googlebot UA returns byte-identical HTML.
- **Doorway / scaled content.** 15 city pages (`venice.html`, `bradenton.html`, ...) were the homepage template with a
  small local block: ~80 % of their lines are identical between any two city pages, ~46 % identical to the
  homepage, each ~1,500 words. The 09-01 audit already recorded that they began as string-swapped copies of the homepage.
- **Claims that were not true**, all on the homepage: "15 years" (hero, meta description, About heading and text,
  `llms.txt`; the LLC document number L24000364625 dates the company to 2024), "500+ Happy Customers" (no reviews
  exist), "20+ Areas Served" (the site lists 15).

## What changed
1. The 15 city pages are consolidated into `service-areas.html`, which keeps the per-area notes as plain cards.
   `vercel.json` 301-redirects every old URL to `/service-areas.html`. The pages are removed from `sitemap.xml`,
   `llms.txt` and every internal link (footer, homepage areas block, guides, inline mentions), the ItemList schema URLs
   and the FAQ copy that referred to "a page for each area".
2. The "15 years", "500+" and "20+" claims are removed. The About stats now show verifiable numbers
   (7 services, 3 counties, 15 areas, 24/7).
3. The 15 city HTML files themselves must be deleted from the repo (see ship notes).

## Reconsideration request (paste into Search Console → Manual actions → Request review)
> We found the cause on our own site. Fifteen city pages were built from one template with only a short local
> section changed, which made them near-duplicates of each other and of the homepage. We deleted all 15 pages,
> merged their useful local notes into one service-areas page, and set 301 redirects from the old URLs to it.
> We also removed marketing claims we could not support (years in business, customer count) and corrected the
> number of areas served. The site now has 15 distinct pages: the homepage, 7 service pages, 3 guides, the service
> areas page, a guides index, business information and the privacy policy. We checked that Googlebot and regular
> visitors receive identical content. We will add new pages only when each has its own substantial, verifiable content.

## Still open
- Google Business Profile (Critical #1 of the 09-19 audit) is the real trust signal; spam reviewers also look for it.
- Real figures for the About stats and the owner's actual start year, if the owner wants to claim experience.
