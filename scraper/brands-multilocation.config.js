// brands-multilocation.config.js
//
// Brands whose deals live scattered across many individual store pages
// instead of one central page. Same headless-browser approach as
// brands.config.js, but this scraper visits EVERY location for a brand
// and merges whatever deals it finds into one combined list for that
// brand — matching how the site treats each brand as a single entity.
//
// Every URL below was pulled directly from each brand's own site during
// this session (not guessed) — Cookies Florida's location list came from
// cookiesflorida.co/areas-we-serve/, and Sunburn's complete 15-location
// list with exact URLs came straight from sunburncannabis.com's own
// location picker. The URL PATTERN is real and verified; the SELECTORS
// (which HTML elements hold the deal name/price) are still best-guesses
// same as every other brand in this project — expect to tune 1-2 on the
// first real run, per the main README.

export const MULTILOCATION_BRANDS = [
  {
    id: "cookies-florida",
    name: "Cookies Florida",
    // Dutchie/Dovetail-powered WordPress site with an age-gate popup —
    // needs headless rendering, not plain fetch.
    ageGate: true,
    waitFor: "[class*='deal'], [class*='product']",
    selector: "[class*='deal-card'], [class*='product-card'], article",
    nameSelector: "[class*='title'], [class*='name'], h2, h3",
    priceSelector: "[class*='price']",
    locations: [
      { city: "Bradenton", url: "https://cookiesflorida.co/bradenton/weed-deals/" },
      { city: "Brooksville", url: "https://cookiesflorida.co/brooksville/weed-deals/" },
      { city: "Deland", url: "https://cookiesflorida.co/deland/weed-deals/" },
      { city: "Fort Myers", url: "https://cookiesflorida.co/fort-myers/weed-deals/" },
      { city: "Gainesville", url: "https://cookiesflorida.co/gainesville/weed-deals/" },
      { city: "Jacksonville", url: "https://cookiesflorida.co/jacksonville/weed-deals/" },
      { city: "Miami", url: "https://cookiesflorida.co/miami/weed-deals/" },
      { city: "North Miami Beach", url: "https://cookiesflorida.co/north-miami-beach/weed-deals/" },
      { city: "Orange Park", url: "https://cookiesflorida.co/orange-park/weed-deals/" },
      { city: "Orlando", url: "https://cookiesflorida.co/orlando/weed-deals/" },
      { city: "Palm Bay", url: "https://cookiesflorida.co/palm-bay/weed-deals/" },
      { city: "Pensacola", url: "https://cookiesflorida.co/pensacola/weed-deals/" },
      { city: "Port St. Lucie", url: "https://cookiesflorida.co/port-st-lucie/weed-deals/" },
      { city: "Tampa", url: "https://cookiesflorida.co/tampa/weed-deals/" },
      { city: "North Tampa", url: "https://cookiesflorida.co/north-tampa/weed-deals/" },
      { city: "Aventura", url: "https://cookiesflorida.co/aventura/weed-deals/" },
      // NOTE: "Orange Blossom" was listed as a location name by Cookies
      // themselves but its city-slug wasn't confirmed during this
      // session — worth checking cookiesflorida.co/locations/ directly
      // and adding it here if it's a real, separate store.
    ],
  },
  {
    id: "sunburn",
    name: "Sunburn",
    // Runs on a white-label ecommerce platform (dispensary.shop) —
    // treat as needing headless rendering same as the others; no
    // confirmed age-gate seen, but likely present given the industry.
    ageGate: true,
    waitFor: "[class*='deal'], [class*='product'], [class*='menu-item']",
    selector: "[class*='deal-card'], [class*='product-card'], [class*='menu-item']",
    nameSelector: "[class*='title'], [class*='name'], h2, h3",
    priceSelector: "[class*='price']",
    locations: [
      { city: "Pensacola", url: "https://sunburn-pensacola.dispensary.shop/med/menu" },
      { city: "Panama City Beach", url: "https://sunburn-panamacitybeach.dispensary.shop/med/menu" },
      { city: "Tallahassee", url: "https://sunburn-tallahassee.dispensary.shop/med/menu" },
      { city: "Jacksonville Beach", url: "https://sunburn-jacksonvillebeach.dispensary.shop/med/menu" },
      { city: "Jacksonville Five Points", url: "https://sunburn-jacksonvillefivepoints.dispensary.shop/med/menu" },
      { city: "Jacksonville Mandarin", url: "https://sunburn-jacksonvillemandarin.dispensary.shop/med/menu" },
      { city: "Orlando", url: "https://sunburn-orlando.dispensary.shop/med/menu" },
      { city: "St. Petersburg", url: "https://sunburn-stpetersburg.dispensary.shop/med/menu" },
      { city: "Indialantic", url: "https://sunburn-indialantic.dispensary.shop/med/menu" },
      { city: "Sarasota", url: "https://sunburn-sarasota.dispensary.shop/med/menu" },
      { city: "Stuart", url: "https://sunburn-stuart.dispensary.shop/med/menu" },
      { city: "West Palm Beach", url: "https://sunburn-westpalmbeach.dispensary.shop/med/menu" },
      { city: "Fort Lauderdale", url: "https://sunburn-ftlauderdale.dispensary.shop/med/menu" },
      { city: "Cape Coral", url: "https://sunburn-capecoral.dispensary.shop/med/menu" },
      { city: "Miami Beach", url: "https://sunburn-southbeachmiami.dispensary.shop/med/menu" },
    ],
  },
];
