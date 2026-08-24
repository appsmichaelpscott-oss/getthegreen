// scrape-static.js
//
// Fast path scraper for brands that don't need a headless browser — a plain
// HTTP fetch returns real, parseable HTML. Runs in seconds, not minutes.
// Writes deals-data-static.json in the same shape scrape.js (the headless
// one) writes deals-data.json, so run-all.js can merge them.

import { writeFile } from "node:fs/promises";
import * as cheerio from "cheerio";
import { STATIC_BRANDS } from "./brands-static.config.js";

const MAX_DEALS_PER_BRAND = 6;
const TIMEOUT_MS = 15_000;

async function scrapeBrand(brand) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(brand.url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        id: brand.id,
        result: { status: "pending", note: `HTTP ${res.status} — site may be blocking automated requests or the page moved.` },
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const cards = $(brand.selector);

    if (!cards.length) {
      return {
        id: brand.id,
        result: {
          status: "pending",
          note: `Fetched fine but selector "${brand.selector}" matched nothing — markup likely changed, or this brand actually needs JS rendering now. Re-check by eye and update brands-static.config.js.`,
        },
      };
    }

    const deals = [];
    cards.slice(0, MAX_DEALS_PER_BRAND).each((_, el) => {
      const card = $(el);
      const name = brand.nameSelector ? card.find(brand.nameSelector).first().text().trim() : card.text().trim().slice(0, 120);
      const expires = brand.expiresSelector ? card.find(brand.expiresSelector).first().text().trim() : "Current";
      if (name) deals.push({ name, expires: expires || "Current" });
    });

    if (!deals.length) {
      return { id: brand.id, result: { status: "pending", note: "Cards matched but no deal text extracted — nameSelector likely needs adjusting." } };
    }

    return { id: brand.id, result: { status: "live", deals } };
  } catch (err) {
    return { id: brand.id, result: { status: "pending", note: `Fetch failed: ${err.message}` } };
  }
}

async function main() {
  const output = {};
  for (const brand of STATIC_BRANDS) {
    process.stdout.write(`Fetching ${brand.name}... `);
    const { id, result } = await scrapeBrand(brand);
    output[id] = result;
    console.log(result.status === "live" ? `✅ ${result.deals.length} deals` : `⚠️  ${result.status}`);
  }

  await writeFile(new URL("./deals-data-static.json", import.meta.url), JSON.stringify(output, null, 2));
  console.log(`\nWrote ${Object.keys(output).length} brand(s) to deals-data-static.json`);
}

main();
