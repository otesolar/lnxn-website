# thelnxn.com Cutover Kit — DRAFT (nothing live, nothing pushed)

Prepared 2026-10-09. All files here are drafts. Nothing has been deployed,
committed, or pushed — they activate only after you approve the plan.

## What's in this folder

- `redirects.csv` — the exact 301 map: 21 old product URLs → new URLs,
  plus the shop root and 3 category pages (25 rows). Built from the live
  WooCommerce Store API permalinks on 2026-10-09, so every old URL is real.
- `next-redirects-snippet.ts` — the same map as a drop-in `redirects()`
  config for `next.config.ts`, plus a catch-all so no old `/shop-2/…`
  link ever 404s.
- `sitemap-draft.xml` — home, shop, story, lookbook + all 21 products,
  ready to serve at `https://thelnxn.com/sitemap.xml`.
- `robots-draft.txt` — allow-all + sitemap pointer.
- This checklist.

## The plan (headless WooCommerce — pending your approval)

**Still your call:** keep WordPress/WooCommerce as the engine (recommended)
or leave WordPress entirely. Everything below assumes the recommended path.

### Steps I can do for you (say "go")
1. Wire the 301 redirects into the Next.js config.
2. Add sitemap.xml + robots.txt generation to the site.
3. Add product structured data (JSON-LD) so Google shows price/availability.
4. Switch the catalog from baked-in files to live WooCommerce reads —
   new/changed products then appear on the site automatically.
5. Build the checkout handoff (cart transfers to your WooCommerce checkout).

### Steps only you can do
6. **Vercel:** add `thelnxn.com` as a custom domain in the project dashboard.
7. **Your domain registrar:** point the apex A-record to `76.76.21.21`
   (Vercel). Your current setup redirects www → apex, so that keeps working.
   (I couldn't identify your registrar from here — this happens in whichever
   account you bought the domain from.)
8. **Your web host:** move WordPress to a subdomain like `wp.thelnxn.com`
   so it keeps running as the product/order engine behind the new site.
9. **Google Search Console:** re-verify the domain and submit the new sitemap.

### Rollback
If anything misbehaves, flip the apex A-record back to your host's IP —
the old site comes back within minutes.

## Decisions still open
- Canonical domain: `thelnxn.com` (apex) is confirmed as canonical —
  `www` already 301s to it, and all product permalinks use it.
- Checkout: handoff to WooCommerce (pragmatic) vs fully on-site (more work).
- Whether product URLs keep the clean `/product/<slug>` form (recommended).
