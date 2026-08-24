// scrape.js
//
// Headless-browser scraper for the JS-rendered FL Deals brands.
// Run with:  npm install   (first time only)
//            npm run scrape
//
// Output: deals-data.json — same shape as the DEALS_DATA object in the
// site's HTML, so it can be pasted straight in or (once Supabase is
// wired up) piped into an upsert instead.
//
// Run a single brand while you're tuning a selector:
//   node scrape.js --only=sunnyside

import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { BRANDS } from "./brands.config.js";

const ONLY = process.argv
  .find((arg) => arg.startsWith("--only="))
  ?.split("=")[1];

const TIMEOUT_MS = 20_000;
const MAX_DEALS_PER_BRAND = 6;

async function scrapeBrand(browser, brand) {
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  });

  try {
    await page.goto(brand.url, { waitUntil: "networkidle", timeout: TIMEOUT_MS });

    // Age gate handling: most of these brands show a 18+/21+ confirmation
    // overlay before anything else renders. Try a handful of common button
    // labels — harmless no-op if none match.
    const ageGateLabels = ["Yes", "I'm 21+", "Enter", "Confirm", "Agree"];
    for (const label of ageGateLabels) {
      const btn = page.getByRole("button", { name: label, exact: false });
      if (await btn.count()) {
        await btn.first().click({ timeout: 2000 }).catch(() => {});
        break;
      }
    }

    await page
      .waitForSelector(brand.waitFor, { timeout: TIMEOUT_MS })
      .catch(() => {
        // Don't hard-fail the whole run over one brand's selector going
        // stale — record it as pending and move on. See the console
        // warning below.
      });

    const cards = await page.$$(brand.selector);

    if (!cards.length) {
      await page.close();
      return {
        id: brand.id,
        result: {
          status: "pending",
          note: `Headless render succeeded but selector "${brand.selector}" matched nothing — the site's markup likely changed. Re-check by eye and update brands.config.js for this brand.`,
        },
      };
    }

    const deals = [];
    for (const card of cards.slice(0, MAX_DEALS_PER_BRAND)) {
      const name = brand.nameSelector
        ? (await card.$eval(brand.nameSelector, (el) => el.textContent?.trim()).catch(() => null))
        : (await card.textContent())?.trim().slice(0, 120);

      const expires = brand.expiresSelector
        ? (await card
            .$eval(brand.expiresSelector, (el) => el.textContent?.trim())
            .catch(() => null))
        : "Current";

      if (name) deals.push({ name, expires: expires || "Current" });
    }

    await page.close();

    if (!deals.length) {
      return {
        id: brand.id,
        result: {
          status: "pending",
          note: `Cards matched but no deal text could be extracted — nameSelector likely needs adjusting for this brand.`,
        },
      };
    }

    return { id: brand.id, result: { status: "live", deals } };
  } catch (err) {
    await page.close().catch(() => {});
    return {
      id: brand.id,
      result: {
        status: "pending",
        note: `Scrape failed: ${err.message}. Re-run with --only=${brand.id} to debug in isolation.`,
      },
    };
  }
}

async function main() {
  const targets = ONLY ? BRANDS.filter((b) => b.id === ONLY) : BRANDS;
  if (!targets.length) {
    console.error(`No brand matches "${ONLY}". Check brands.config.js for valid ids.`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const output = {};

  for (const brand of targets) {
    process.stdout.write(`Scraping ${brand.name}... `);
    const { id, result } = await scrapeBrand(browser, brand);
    output[id] = result;
    console.log(result.status === "live" ? `✅ ${result.deals.length} deals` : `⚠️  ${result.status}`);
  }

  await browser.close();

  const outPath = new URL("./deals-data.json", import.meta.url);
  await writeFile(outPath, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${Object.keys(output).length} brand(s) to deals-data.json`);
  console.log("Merge this into DEALS_DATA in the site HTML (or the Supabase upsert once that's wired up).");
}

main();
