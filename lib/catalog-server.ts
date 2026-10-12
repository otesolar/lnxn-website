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
 * otherwise the baked-in fallback. Never throws — getLiveProducts() catches
 * its own failures and returns [] so this can fall back to the baked-in
 * catalog and the site keeps working.
 */
export async function getCatalog(): Promise<Product[]> {
  if (!isWooConfigured()) return fallbackProducts;
  const live = await getLiveProducts();
  if (live.length === 0) return fallbackProducts;
  return augmentProducts(live);
}
