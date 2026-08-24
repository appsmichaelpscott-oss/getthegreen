# FL Deals — Daily Automated Refresh Setup

This is a **one-time setup**. Once it's done, the site updates itself every
day at ~10am ET, forever, with nobody logging in or clicking anything.

## What you're setting up, in plain terms

Right now your site is a file you drag onto Netlify. There's no "clock"
anywhere that can run a scraper on a schedule — a static file just sits
there until you manually replace it. GitHub Actions IS that clock: it's a
free feature of GitHub that runs code on a timer. So the one-time step is
moving your site's code from "a file I drag onto Netlify" to "a folder on
GitHub that Netlify watches" — after that, the timer handles everything.

## Step 1 — Create a free GitHub account

Go to github.com, sign up. Free tier covers everything here — you will
never hit a paywall for this project's scale.

## Step 2 — Create a new repository

- Click the **+** in the top right → **New repository**
- Name it something like `fl-deals`
- Keep it **Private** (no reason for this to be public)
- Don't add a README/gitignore yet — just create it empty

## Step 3 — Get your site's files into that repo

Simplest path, no command line needed:
1. On the new repo's GitHub page, click **uploading an existing file**
2. Drag in the entire unzipped package at once — this keeps the folder
   structure intact (`site/`, `scraper/`, `brand/`, `.github/workflows/`,
   and `README.md`, all at the top level of the repo)
3. **Important:** `.github` must sit at the very top level of the repo,
   directly alongside `site` and `scraper` — not nested inside `scraper`.
   GitHub Actions only looks for workflows at `<repo root>/.github/workflows/`.
   This means your file manager's hidden files need to be visible before
   you drag (Cmd+Shift+. on Mac, "Show hidden items" in Windows Explorer),
   or `.github` won't get selected/dragged at all since it's a dot-folder

## Step 4 — Point Netlify at this repo instead of drag-and-drop

- In Netlify: **Site settings → Build & deploy → Link site to Git**
- Choose GitHub, authorize it, pick your new `fl-deals` repo
- Build settings: no build command needed (it's a static HTML file) —
  set the **publish directory** to the repo root (`/`) or wherever
  `fl-deals-preview.html` lives
- From now on, any time that file changes in the repo (including the
  automated daily commit), Netlify redeploys automatically within a minute

## Step 5 — Let it run

That's it. The workflow fires daily at 14:00 UTC (10am ET). It scrapes,
merges the results into `site/fl-deals-preview.html` inside the repo,
commits the change, and Netlify redeploys. You do nothing.

To confirm it's alive: GitHub repo → **Actions** tab → you'll see a run
history with green checkmarks (or red X's if something needs attention).

## What happens on a bad day (a brand's site is down, changes its markup, etc.)

`update-site.js` is written to **never wipe good data with bad data** — if
a brand's scrape fails on a given day, that brand just keeps showing
yesterday's last-known-good deals instead of going blank or broken. You'll
see it in the Actions run log as a brand marked "pending" with a reason,
but the live site keeps looking normal to visitors.

## What's still manual (not solved by this automation)

| Brand | Why it's not automated | What it needs |
|---|---|---|
| MUV, The Flowery | Blocked by `robots.txt` | The Resend email fallback pipeline — separate project, not built yet |
| Fluent | Pricing is inside an image, not text | OCR — a different tool entirely |
| Cookies Florida | Deals are per-location, not one central page | A loop over each store's URL — a small future addition |
| Insa, FINO Cannabis | Source data itself is thin/stale | Nothing fixes this but the brand publishing more |

Discount tiers (Discounts tab), dispensary counts (Locations tab), and card
fee info (Card Info tab) are **not** part of this daily automation — those
change far less often than deals do and were manually verified in a recent
pass. Worth a periodic manual re-check (monthly, not daily), not a daily
scrape.

## Selector tuning — expect this on day one

Every selector in `brands.config.js` and `brands-static.config.js` is a
best guess (see the notes at the top of each file for why). The **first**
scheduled run will likely mark 2-4 brands "pending" because a guessed
selector didn't match the live page. That's normal, not a failure of the
system — open the Actions log, see which brand and why, open that brand's
real page, inspect the deal card, and adjust that one selector in the repo.
Every other brand keeps working while you fix one at a time.

## Later: swapping GitHub Actions' commit-to-HTML for Supabase

Right now the workflow edits the HTML file directly and commits it — simple
and requires nothing beyond GitHub. Once the planned Supabase migration
happens, replace the "Merge results into the live site file" step with a
Supabase upsert instead, and the site fetches deals from Supabase at
runtime rather than having them baked into the HTML. Nothing else in this
pipeline changes — same scrapers, same schedule, just a different last step.
