// brands-static.config.js
//
// Brands whose deals pages return real, useful HTML on a plain fetch — NO
// headless browser needed, so these run fast and cheap in scrape-static.js.
// This is the other half of automated coverage alongside brands.config.js
// (which handles the JS-rendered brands via Playwright).
//
// Same selector idea as brands.config.js, but matched against raw HTML via
// Cheerio instead of a live rendered page.
//
// IMPORTANT — same caveat as the headless config: I don't have live network
// access to load these pages and confirm the selectors against today's real
// markup. These are built from what was manually confirmed during chat
// sessions (see DEALS_DATA history), translated into selectors. Expect to
// tune 1-3 of these the first time the workflow runs — see README.

export const STATIC_BRANDS = [
  {
    id: "trulieve",
    name: "Trulieve",
    url: "https://www.trulieve.com/discover/promotions/florida",
    selector: "[class*='promo-card'], [class*='deal-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid'], time",
  },
  {
    id: "curaleaf",
    name: "Curaleaf",
    // Curaleaf publishes discounts per-location; this is the largest single
    // FL store as a representative sample rather than a true statewide feed.
    url: "https://curaleaf.com/shop/florida/curaleaf-dispensary-tampa-south/menu/discounts",
    selector: "[class*='discount-card'], [class*='deal-card'], [data-testid*='discount']",
    nameSelector: "[class*='title'], [class*='name'], h3",
    expiresSelector: "[class*='date'], [class*='expir']",
  },
  {
    id: "surterra-wellness",
    name: "Surterra Wellness",
    url: "https://www.surterra.com/specials",
    selector: "[class*='special-card'], [class*='deal-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "green-dragon",
    name: "Green Dragon",
    url: "https://www.greendragon.com/deals",
    selector: "[class*='deal-card'], [class*='promo'], article",
    nameSelector: "[class*='title'], [class*='name'], h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "planet-13-florida",
    name: "Planet 13 Florida",
    url: "https://fl.planet13florida.com/specials",
    selector: "[class*='special-card'], [class*='deal-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "sanctuary-cannabis",
    name: "Sanctuary Cannabis",
    url: "https://sanctuarycannabis.com/menu/discounts/",
    selector: "[class*='discount-card'], [class*='deal-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "gti-florida",
    name: "Rise (GTI Florida)",
    url: "https://www.risecannabis.com/dispensaries/florida/",
    selector: "[class*='deal-card'], [class*='promo-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "goldflower-cannabis",
    name: "Goldflower",
    url: "https://goldflower.com/deals/",
    selector: "[class*='deal-card'], [class*='promo'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "jungle-boys",
    name: "Jungle Boys",
    url: "https://junglecannabis.com/florida/deals/",
    selector: "[class*='deal-card'], [class*='promo'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
  {
    id: "eden-florida",
    name: "Eden",
    url: "https://edenflorida.com/specials/",
    selector: "[class*='special-card'], [class*='deal-card'], article",
    nameSelector: "[class*='title'], h2, h3",
    expiresSelector: "[class*='date'], [class*='valid']",
  },
];

// Brands intentionally not in EITHER scraper config (still handled outside
// automation — see README "What's still manual" section):
//   - muv, the-flowery       -> robots.txt-blocked, needs the Resend email
//                                fallback pipeline
//   - fluent                 -> price is inside an image, needs OCR
//   - cookies-florida        -> per-location, needs a store-URL loop
//   - insa, fino-cannabis    -> source data itself too thin to scrape
