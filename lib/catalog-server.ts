// SERVER-ONLY catalog access. This module (and lib/woo.ts, which it imports)
// must never be imported from client components. Client components keep
// importing the synchronous baked-in data from "@/lib/catalog".
//
// NOTE: getCatalog lives here rather than in lib/catalog.ts on purpose —
// catalog.ts is imported by client components, and importing lib/woo.ts
// from it would ship server-only code (and the server-only guard) into the
// client bundle.
import "server-only";

import {
  products as fallbackProducts,
  augmentProducts,
  type Product,
} from "./catalog";
import { isWooConfigured, getLiveProducts } from "./woo";

/**
 * The catalog to render: live WooCommerce products when configured,
 * otherwise the baked-in fallback. Never throws — any WooCommerce error
 * falls back to the baked-in catalog so the site keeps working.
 */
export async function getCatalog(): Promise<Product[]> {
  if (!isWooConfigured()) return fallbackProducts;
  try {
    const live = await getLiveProducts();
    return augmentProducts(live);
  } catch (err) {
    console.warn(
      "WooCommerce live catalog failed, using baked-in catalog:",
      err instanceof Error ? err.message : err,
    );
    return fallbackProducts;
  }
}
