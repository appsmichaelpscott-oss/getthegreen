// scrape-multilocation.js
//
// For brands whose deals are scattered across many individual store
// pages (Cookies Florida, Sunburn) instead of one central page. Visits
// EVERY location for a brand, then merges whatever deals it finds into
// one combined list — same output shape as scrape.js / scrape-static.js,
// so update-site.js can merge all three without any changes.
//
// Run with: node scrape-multilocation.js
// Debug one brand only: node scrape-multilocation.js --only=sunburn

import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { MULTILOCATION_BRANDS } from "./brands-multilocation.config.js";

const ONLY = process.argv
  .find((arg) => arg.startsWith("--only="))
  ?.split("=")[1];

const TIMEOUT_MS = 20_000;
const MAX_DEALS_PER_LOCATION = 4;
const MAX_DEALS_PER_BRAND = 8; // combined cap after merging all locations

async function scrapeOneLocation(browser, brand, location) {
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  });

  try {
    await page.goto(location.url, { waitUntil: "networkidle", timeout: TIMEOUT_MS });

    if (brand.ageGate) {
      const ageGateLabels = ["Yes", "I'm 21+", "Enter", "Confirm", "Agree", "I agree"];
      for (const label of ageGateLabels) {
        const btn = page.getByRole("button", { name: label, exact: false });
        if (await btn.count()) {
          await btn.first().click({ timeout: 2000 }).catch(() => {});
          break;
        }
      }
    }

    await page
      .waitForSelector(brand.waitFor, { timeout: TIMEOUT_MS })
      .catch(() => {});

    const cards = await page.$$(brand.selector);
    const deals = [];

    for (const card of cards.slice(0, MAX_DEALS_PER_LOCATION)) {
      const name = await card
        .$eval(brand.nameSelector, (el) => el.textContent?.trim())
        .catch(() => null);
      if (name) deals.push({ name: `${name} (${location.city})`, expires: "Current" });
    }

    await page.close();
    return { location: location.city, deals, ok: true };
  } catch (err) {
    await page.close().catch(() => {});
    return { location: location.city, deals: [], ok: false, error: err.message };
  }
}

async function scrapeBrand(browser, brand) {
  const results = [];
  for (const location of brand.locations) {
    process.stdout.write(`  ${location.city}... `);
    const result = await scrapeOneLocation(browser, brand, location);
    console.log(result.ok ? `✅ ${result.deals.length} deals` : `⚠️  ${result.error}`);
    results.push(result);
  }

  const allDeals = results.flatMap((r) => r.deals).slice(0, MAX_DEALS_PER_BRAND);
  const workingLocations = results.filter((r) => r.ok && r.deals.length).length;

  if (!allDeals.length) {
    return {
      status: "pending",
      note: `Visited all ${brand.locations.length} locations, none returned readable deals — selectors likely need tuning for this brand's markup. Check brands-multilocation.config.js.`,
    };
  }

  return {
    status: "live",
    deals: allDeals,
    note: `Combined from ${workingLocations}/${brand.locations.length} locations that returned deals.`,
  };
}

async function main() {
  const targets = ONLY
    ? MULTILOCATION_BRANDS.filter((b) => b.id === ONLY)
    : MULTILOCATION_BRANDS;

  if (!targets.length) {
    console.error(`No brand matches "${ONLY}". Valid ids: ${MULTILOCATION_BRANDS.map(b => b.id).join(", ")}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const output = {};

  for (const brand of targets) {
    console.log(`\nScraping ${brand.name} (${brand.locations.length} locations)...`);
    output[brand.id] = await scrapeBrand(browser, brand);
    console.log(`${brand.name}: ${output[brand.id].status}`);
  }

  await browser.close();

  const outPath = new URL("./deals-data-multilocation.json", import.meta.url);
  await writeFile(outPath, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${Object.keys(output).length} brand(s) to deals-data-multilocation.json`);
}

main();
