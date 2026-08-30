// update-site.js
//
// Runs after scrape.js (headless) and scrape-static.js (plain fetch) have
// both written their JSON output. Merges the two, then finds and replaces
// the DEALS_DATA object inside the site's HTML file in place — same file,
// same DEALS_DATA shape, just with today's numbers.
//
// Only overwrites brands that actually came back "live" from today's run.
// Brands that failed today keep YESTERDAY'S data untouched rather than
// getting wiped to a blank/pending state — a temporary site hiccup on one
// brand's page shouldn't erase a deal that was working fine yesterday.
//
// Usage: node update-site.js path/to/site.html

import { readFile, writeFile } from "node:fs/promises";

const SITE_PATH = process.argv[2];
if (!SITE_PATH) {
  console.error("Usage: node update-site.js path/to/site.html");
  process.exit(1);
}

async function loadJsonIfExists(path) {
  try {
    return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  const [headless, staticData] = await Promise.all([
    loadJsonIfExists("./deals-data.json"),
    loadJsonIfExists("./deals-data-static.json"),
  ]);
  const fresh = { ...headless, ...staticData };

  const html = await readFile(SITE_PATH, "utf8");
  const match = html.match(/const DEALS_DATA = (\{[\s\S]*?\n\};)/);
  if (!match) {
    console.error("Could not find DEALS_DATA in the site HTML — is this the right file?");
    process.exit(1);
  }

  // eslint-disable-next-line no-eval
  const current = eval(`(${match[1].slice(0, -1)})`); // strip trailing semicolon for eval

  let updatedCount = 0;
  let keptStaleCount = 0;
  for (const [id, result] of Object.entries(fresh)) {
    if (result.status === "live" && result.deals?.length) {
      current[id] = result;
      updatedCount++;
    } else if (current[id]) {
      keptStaleCount++;
      // leave current[id] as-is — yesterday's data survives a bad scrape
    } else {
      current[id] = result; // no prior data at all, take whatever we got (even pending)
    }
  }

  const todayStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York" });
  const newBlock =
    `// Re-pulled: ${todayStr} (automated daily run). Brands marked "live" below\n` +
    `// were freshly re-verified this pass. Brands whose scrape failed today kept\n` +
    `// their last successfully-scraped data rather than being wiped blank.\n` +
    `const DEALS_DATA = ${JSON.stringify(current, null, 2)};`;

  let updatedHtml = html.replace(
    /(\/\/ Re-pulled:[\s\S]*?)?const DEALS_DATA = \{[\s\S]*?\n\};/,
    () => newBlock // function replacer avoids $-pattern corruption from dollar amounts like "$150" in deal data
  );

  // Also stamp the header's "Updated ..." display with the real date/time
  // this run actually happened, in ET, so visitors can see it's Sep 3 at
  // 10am rather than just a vague "updated today".
  const lastUpdatedStr = formatLastUpdated(new Date());
  updatedHtml = updatedHtml.replace(
    /const LAST_UPDATED = "[^"]*";/,
    () => `const LAST_UPDATED = "${lastUpdatedStr}";`
  );

  await writeFile(SITE_PATH, updatedHtml);
  console.log(`Updated ${updatedCount} brand(s), kept ${keptStaleCount} brand(s) on yesterday's data after a failed scrape.`);
  console.log(`Stamped LAST_UPDATED as: ${lastUpdatedStr}`);
}

function formatLastUpdated(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  const dayPeriod = get("dayPeriod").toLowerCase(); // "am" / "pm"
  return `${get("month")} ${get("day")} · ${get("hour")}:${get("minute")}${dayPeriod} ET`;
}

main();
