/**
 * Unique product descriptions, keyed by product slug.
 *
 * Each product gets its own 1-2 sentence description in the LNXN voice.
 * The mark treatments below were verified against the product photography:
 * Core = small left-chest mark (minimal); Heritage = large centered chest
 * mark (bold); the Identity hoodie adds sleeve lettering.
 *
 * House rules: never reuse the collection blurb verbatim, never name the
 * manufacturing process, never name the blank manufacturer.
 *
 * When the WooCommerce integration goes live, a product-level description
 * set in WooCommerce takes precedence over these; this file is the fallback.
 */
const DESCRIPTIONS: Record<string, string> = {
  // ---- Men ----
  "lnxn-core-identity-hoodie-mens":
    "The signature piece. A heavyweight hoodie with the LNXN mark on the chest and bold LNXN lettering down the sleeve — the full statement, made for every day.",
  "men-lnxn-core-hoodie":
    "Understated by design. A heavyweight fleece hoodie with a single small LNXN mark on the chest — clean, quiet, and built for daily wear.",
  "men-lnxn-heritage-hoodie":
    "A nod to the classics, worn bold. The timeless heavyweight hoodie with the large LNXN mark centered on the chest — familiar from the first wear.",
  "lnxn-core-tee-mens":
    "The essential tee. Clean-cut with a small LNXN mark on the chest — soft, sharp, and made to go with everything.",
  "men-lnxn-heritage-tee":
    "The classic, amplified. Our timeless tee with the large LNXN mark front and center — a bold take on the everyday essential.",
  "men-lnxn-core-crew":
    "Quiet confidence. A heavyweight crewneck with the small LNXN chest mark — minimal outside, brushed-soft inside.",
  "lnxn-heritage-crew-mens":
    "Old-school spirit, new-standard build. The classic crewneck with the large centered LNXN mark — timeless silhouette, considered details.",

  // ---- Women ----
  "lnxn-core-identity-hoodie-womens-edition":
    "The signature piece, cut for her. A heavyweight hoodie with the LNXN chest mark and bold sleeve lettering — the full statement, tailored fit.",
  "lnxn-core-hoodie":
    "Understated by design. A heavyweight fleece hoodie with the small LNXN chest mark — clean lines, soft feel, made for daily wear.",
  "lnxn-heritage-hoodie":
    "A nod to the classics, worn bold. The timeless hoodie with the large centered LNXN mark — familiar from the first wear.",
  "lnxn-core-tee":
    "The essential tee, refined. Clean-cut with the small LNXN chest mark — soft drape, sharp look, endless wear.",
  "lnxn-heritage-tee":
    "The classic, amplified. Our timeless tee with the large LNXN mark front and center — bold, effortless, everyday.",
  "lnxn-core-crew":
    "Quiet confidence. A heavyweight crewneck with the small LNXN chest mark — minimal, soft, and made to last.",
  "lnxn-heritage-crew":
    "Old-school spirit, new-standard build. The classic crewneck with the large centered LNXN mark — timeless and considered.",
  "lnxn-heritage-cropped-hoodie":
    "Heritage attitude, cropped cut. The classic hoodie reworked with a shorter body and the large centered LNXN mark — same timeless energy, sharper silhouette.",

  // ---- Kids ----
  "lnxn-core-hoodie-kids":
    "Small size, same standard. A heavyweight kids' hoodie with the small LNXN chest mark — soft, durable, and made for everyday adventures.",
  "lnxn-heritage-kids-hoodie":
    "The classic, sized down. A kids' heavyweight hoodie with the large centered LNXN mark — timeless style for the next generation.",
  "lnxn-core-tee-kids":
    "The everyday essential for kids. A clean-cut tee with the small LNXN chest mark — soft, tough, and ready for anything.",
  "lnxn-heritage-tee-kids":
    "Big mark, little legend. A kids' tee with the large centered LNXN mark — the timeless classic for the next generation.",
  "lnxn-core-crew-kids":
    "Quiet confidence, kid-sized. A heavyweight kids' crewneck with the small LNXN chest mark — minimal and made to last.",
  "lnxn-heritage-crew-kids":
    "Old-school spirit for the young. A kids' crewneck with the large centered LNXN mark — classic style, built to play.",
};

export function getProductDescription(slug: string): string | undefined {
  return DESCRIPTIONS[slug];
}
