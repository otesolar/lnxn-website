# LNXN Website — Premium Rebuild

Fresh from-scratch rebuild of [thelnxn.com](https://thelnxn.com). Same branding:
black / white / bronze-gold `#B28027`, triangle mark + LNXN lockup, Montserrat.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- Catalog: `data/catalog.json` — 21 real products, real prices, pulled from the
  live WooCommerce Store API on 2026-10-08
- Product images: `public/products/` (242 images, downloaded from thelnxn.com)
- Brand marks: `public/brand/` (`lnxn-mark-gold.png`, `lnxn-lockup.png`)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route | Description |
|---|---|
| `/` | Hero, collections, bestsellers, story band, kids band |
| `/shop` | Filterable grid (Men/Women/Kids · Core/Heritage · Tees/Hoodies/Crews), sort |
| `/product/[slug]` | Gallery, size/qty, add to cart, details accordions, related |
| `/story` | Brand narrative — Timeless. Bold. You. |
| `/lookbook` | Editorial image grid |

Cart is a slide-over drawer persisted to `localStorage`. Checkout currently
hands off to the existing WooCommerce checkout (`thelnxn.com/checkout`).

## Commerce backend — decision pending

Recommended: run this storefront **headless over the existing WooCommerce**
via the Store API (catalog, cart, checkout stay in WooCommerce — no migration,
no downtime). Alternative: leave WordPress entirely (migrate products,
payments, orders). See `DESIGN.md` for the full design direction.
