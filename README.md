# Get the Green — Full Project Package

Everything from the last two sessions, packaged in one place. Rebranded
from "FL Deals" — the site file itself still says FL Deals internally for
now; see "What's NOT done yet" below.

**Corrected version** — if you already uploaded an earlier copy of this
package where `.github` was sitting inside `scraper/`, that was a mistake
on my part: GitHub Actions only recognizes workflows at the repo's true
top level. This version fixes that (and a second bug it uncovered — the
workflow's site-file path pointed to the wrong folder). Delete whatever
you uploaded before and start fresh from this version.

## What's in here

```
get-the-green/
├── .github/
│   └── workflows/
│       └── daily-refresh.yml      ← runs everything daily, automatically, no login
├── site/
│   └── fl-deals-preview.html      ← the actual working site (currently v42)
├── scraper/
│   ├── README.md                  ← full setup walkthrough: GitHub + Netlify + daily automation
│   ├── package.json
│   ├── brands.config.js           ← headless-browser scraper config (5 JS-rendered brands)
│   ├── brands-static.config.js    ← plain-fetch scraper config (10 brands)
│   ├── scrape.js                  ← headless scraper (Playwright)
│   ├── scrape-static.js           ← fast plain-fetch scraper
│   └── update-site.js             ← merges scraper results into the site HTML
└── brand/
    ├── midjourney-prompts.md      ← logo direction prompts, labeled, ready to run
    ├── gtg-icon.svg               ← my first logo attempt (icon only) — fallback/reference
    ├── gtg-lockup.svg             ← my first logo attempt (full lockup) — fallback/reference
    └── preview.html               ← renders the fallback logo at real size, open in a browser
```

**`.github` must stay at this exact top level** — directly alongside
`site`, `scraper`, and `brand` — never nested inside any of those folders.
It's a hidden folder on both Mac and Windows, so make hidden files visible
in your file manager before dragging the package contents into GitHub, or
it silently won't get selected.

## Start here, in order

1. **Read `scraper/README.md` first.** That's the full walkthrough for
   getting the site off manual Netlify drag-and-drop and onto GitHub, so
   the daily scraper can actually run itself.
2. **Upload everything at once**, keeping the folder structure exactly as
   shown above. Confirm on GitHub afterward that `.github` shows up as a
   top-level folder in the repo, not buried inside `scraper`.
3. **Trigger the first run manually** — repo → Actions tab → "Daily deal
   refresh" workflow → "Run workflow" button — rather than waiting for the
   next scheduled time. This lets us catch and fix any selector issues
   together instead of waiting up to 24 hours between attempts.
4. **Run the Midjourney prompts in `brand/midjourney-prompts.md`** whenever
   you get a chance. Send back whatever you like best.
5. **Once you have real logo art back from Midjourney,** hand it over and
   the actual site swap happens — replacing "FL DEALS" in the browser tab
   title, the header pill, and the footer credit line.

## What's NOT done yet (on purpose — waiting on you)

- **The rebrand itself.** The site file in here still reads "FL Deals"
  everywhere — title tag, header pill, footer. That wasn't touched yet so
  it can happen alongside the real logo, in one clean pass.
- **Netlify hasn't been reconnected yet.** Once the repo is confirmed
  correct, Netlify's Site Settings → Build & Deploy needs to be pointed
  at this GitHub repo instead of manual drag-and-drop uploads, with the
  publish directory set to `site/`.
- **First scraper run hasn't happened.** Selectors in `brands.config.js`
  and `brands-static.config.js` are best-guesses (documented in each
  file) — expect to tune 2-4 of them by hand after the first real run.
- **Amazon Associates tag** is still a placeholder in the live site,
  pending approval.

## Quick reference: what's automated vs. still manual

| Task | Status |
|---|---|
| Deal scraping for 15 of 22 brands | Automated once GitHub + Netlify setup is done |
| MUV, The Flowery (robots.txt-blocked) | Still manual — needs the Resend email pipeline (not built) |
| Fluent (image-based pricing) | Still manual — needs OCR (not built) |
| Cookies Florida (per-location deals) | Still manual — needs a store-URL loop (not built) |
| Discount tiers, location counts, card fees | Manual, periodic re-check — these change slowly, not worth daily automation |
| Video ad popup (30-min countdown) | Built, placeholder video zone — needs real Mantis zone tag once you sign up |
| Sponsored brand placement (Premium + Featured) | Built, using mock data — needs real Supabase-backed data eventually |
