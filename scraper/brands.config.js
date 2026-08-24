// brands.config.js
//
// One entry per brand that needs a HEADLESS BROWSER (not a plain fetch)
// because the deals only exist after JS runs. This is the config for
// brands that were previously "pending" in DEALS_DATA specifically
// because of JS-rendering, not robots.txt or image-only pricing —
// see the project brief's brand-by-brand notes for why each one needs
// this approach vs. the email fallback.
//
// selector: CSS selector that matches EACH individual deal card/row on
//   the rendered page, once JS has finished running.
// nameSelector / expiresSelector: selectors RELATIVE TO the deal card
//   for the deal name and any expiration/date text. Leave expiresSelector
//   null if the site doesn't show one — the scraper will just write
//   "Current" for that field.
// waitFor: a selector to wait for before reading the page, so we don't
//   scrape before the deals have actually rendered.
//
// IMPORTANT: these selectors are best-guess starting points based on
// what's publicly visible on each brand's site structure. Real sites
// change their markup without notice — the FIRST time you run this
// against each brand, check the output against the live page by eye,
// and adjust the selector for that brand if it comes back empty.

export const BRANDS = [
  {
    id: "sunnyside",
    name: "Sunnyside",
    url: "https://www.sunnyside.shop/page/promos-and-deals-sunnyside-florida",
    waitFor: "[class*='deal'], [class*='promo'], [class*='special']",
    selector: "[class*='deal-card'], [class*='promo-card'], [class*='special-card']",
    nameSelector: "[class*='title'], h3, h4",
    expiresSelector: "[class*='date'], [class*='expir'], time",
  },
  {
    id: "mint-cannabis",
    name: "Mint Cannabis",
    url: "https://mintdeals.com/bonita-springs/deals/",
    waitFor: "[class*='deal'], [class*='card']",
    selector: "[class*='deal-card'], [class*='product-card']",
    nameSelector: "[class*='name'], [class*='title'], h3",
    expiresSelector: "[class*='valid'], [class*='date']",
  },
  {
    id: "one-plant-cannabis",
    name: "One Plant Cannabis",
    url: "https://daytonabeach.oneplantflorida.com/stores/one-plant-cannabis-brandon/specials",
    waitFor: "[class*='special'], [class*='deal']",
    selector: "[class*='special-card'], [class*='deal-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "growhealthy",
    name: "GrowHealthy",
    url: "https://growhealthy.com/stores/growhealthy-bonita-springs/specials",
    waitFor: "[class*='special'], [class*='deal'], [data-testid*='deal']",
    selector: "[class*='special-card'], [data-testid*='deal-card']",
    nameSelector: "[class*='title'], h3, h4",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "ayr-cannabis-dispensary",
    name: "AYR Cannabis Dispensary",
    url: "https://ayrdispensaries.com/florida/bonita-springs/shop/?dtche%5Bpath%5D=specials",
    // AYR runs on the Dutchie embed widget — same underlying platform as
    // several other confirmed-Dutchie brands per the master CSV notes,
    // so this selector pattern is worth reusing as a shared template
    // once it's confirmed working here.
    waitFor: "[class*='dutchie'], iframe[src*='dutchie']",
    selector: "[data-testid*='product-card'], [class*='product-card']",
    nameSelector: "[class*='name'], [data-testid*='product-name']",
    expiresSelector: null,
  },
];

// Brands intentionally NOT in this file (do not add them here):
//   - muv, the-flowery        -> blocked by robots.txt, use the email
//                                fallback pipeline instead. Scraping
//                                around a robots.txt exclusion is out
//                                of scope regardless of feasibility.
//   - fluent                  -> pricing is inside an image graphic;
//                                needs OCR, a separate tool from this.
//   - cookies-florida         -> deals are per-location, not JS-blocked;
//                                needs a location-URL loop, not headless
//                                rendering. Different fix, see scrape.js
//                                notes.
//   - insa, fino-cannabis     -> source data itself is thin/stale, no
//                                scraper fixes that.
