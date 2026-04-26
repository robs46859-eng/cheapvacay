# Owning and aggregating pricing data (CheapVacay / India travel)

The app can blend **curated static benchmarks** (`server/data/destinations.ts`) with **optional** Amadeus “sample” offers. This doc lists ways to build **your own** data layer and other common options so you can tune honesty and depth without locking into one vendor.

---

## 1. Roll your own aggregates (fully under your control)

| Approach | What you do | Best for |
|----------|-------------|----------|
| **Spreadsheet + periodic import** | Keep nightly meal bands, room ranges, and city-level indices in Google Sheets or Excel; run a small script to emit `destinations.ts` or a JSON file you load at deploy time. | Solo maintainer, transparent methodology, no API cost. |
| **Firestore (or any DB) as “benchmark store”** | Admin UI or internal tool writes per-destination, per-season `averageNightlyStay`, `averageMealBudget`, etc. The planner reads that instead of a static file. | When non-devs will edit numbers without a deploy. |
| **CSV in the repo** | Version-controlled CSV → build step generates TypeScript or JSON. | Auditable diffs, reviewable price changes in PRs. |
| **BigQuery (or similar)** | Append fare snapshots or hotel scrape results, aggregate with SQL to weekly medians, export to the format the planner expects. | Many sources and volume; you own the warehouse. |
| **Log what users see** (privacy-safe) | With consent and minimization, log anonymized quote inputs + outcomes to refine models. *Requires legal/privacy design.* | Improving models from real behavior. |

**Aggregate ideas:** by **route** (e.g. DEL–GOI), **month bucket**, **stay type**, **train vs flight** intent—whatever matches how you want to be honest in copy.

---

## 2. Other data / API options (besides or alongside Amadeus)

- **GDS/OTA B2B APIs** — Deeper than shopping APIs; usually contracts and certification (Sabre, Travelport, etc.).
- **Consolidator or partner feeds** — If you have a commercial relationship, they may expose CSV, FTP, or JSON with agreed refresh rates.
- **Scrape + compliance** — Only with robots/terms permission; often fragile; not recommended for core pricing without legal review.
- **Government / public stats** — CPI, tourism board stats, or rail fare tables for *directional* bands (not “book this fare”).
- **“Human in the loop”** — Curators update bands weekly from a checklist of OTA spot checks; document methodology for users.
- **User-submitted “receipts” (future)** — Logged post-trip real spend to tune benchmarks (strong privacy and abuse controls required).

The UI pattern you want is already aligned: call everything **estimates** or **samples**, and show **per-line** “benchmark” vs “sample” so users are never told they have a held booking.

---

## 3. What to wire in the codebase (next steps)

1. **Replace or enrich `server/data/destinations.ts`** from your pipeline (import script, Firestore read, or CMS).
2. **Extend `buildQuote`** to pull numbers from a `BenchmarkService` so tests can mock it.
3. **Keep** live-offer code path optional: when your own rules say “use API sample,” the same `live_sample` / `modeled` labels apply.

This keeps pricing honesty and UX copy consistent as your data source evolves.
