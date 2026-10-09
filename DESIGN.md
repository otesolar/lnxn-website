# LNXN — Premium Website Rebuild: Design Direction

## Brand (locked — from owner)
- **Identity:** LNXN, tagline "Timeless. Bold. You"
- **Colors:** Black `#000000` · White `#FFFFFF` · Bronze-gold `#B28027` (sampled from the triangle mark)
- **Wordmark:** Montserrat (per owner). Pair with a refined serif or keep all-Montserrat with wide tracking for headlines — decision: all-Montserrat, weights 400/600/800, uppercase + letter-spacing for display type. Clean, bold, timeless.
- **Marks:** gold triangle (product/icon mark), white triangle-eye + LNXN lockup (hero/footer)

## Design language
Dark-first, editorial streetwear. Full-bleed black sections, gold used sparingly (accents, rules, CTAs on black). Generous whitespace, oversized display type, cinematic product imagery. No plugin chrome — no wishlist/compare/quick-view clutter. Motion: subtle reveals, smooth hover states, sticky product storytelling.

## Pages (phase 1)
1. **Home** — full-screen hero (lockup + tagline + motion), collection marquee (Core / Heritage), featured products, brand story band, bestsellers grid, newsletter + footer
2. **Shop** — filterable grid (Men / Women / Kids · Tees / Hoodies / Crews), sort, clean cards with hover second-image
3. **Product** — gallery, size selector, price, story blurb per line (Core vs Heritage), related products
4. **Our Story / About** — brand narrative ("Timeless. Bold. You")
5. **Lookbook** — editorial grid using product photography
6. **Cart drawer** — slide-over, quantity editing
7. **Checkout** — phase 1: handoff to existing WooCommerce checkout (payments/orders unchanged). Phase 2: full headless checkout.

## Data
- Catalog: `data/catalog.json` — 21 real products, real prices ($22.99–$52), pulled from the live WooCommerce Store API on 2026-10-08
- Product images: `public/products/` — downloading from thelnxn.com (all variants)
- Brand marks: `public/brand/` — `lnxn-mark-gold.png`, `lnxn-lockup.png`

## Stack
- Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel
- Commerce backend: **decision pending** — recommended: headless WooCommerce (Store API) so products/orders/payments stay put; alternative: full migration off WordPress

## Non-goals for phase 1
- Account system, reviews, multi-currency, blog — can follow once the storefront is live
