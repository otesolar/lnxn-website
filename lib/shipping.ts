import type { Product } from "./catalog";

/** Flat-rate shipping in USD, matching the agreed LNXN shipping plan. */
export const SHIPPING_RATES = {
  /** Tees and kids items */
  TEE_KIDS: 5.99,
  /** Adult crews and hoodies */
  CREW_HOODIE: 8.99,
  /** Cropped hoodie */
  CROPPED: 10.99,
  /** Added per additional item beyond the first (mirrors Printify's model) */
  ADDITIONAL_ITEM: 3.0,
  /** Free shipping at or above this product subtotal */
  FREE_THRESHOLD: 80,
} as const;

/**
 * Calculate the flat-rate shipping for an order.
 * First item at the highest applicable tier rate, $3 per additional item.
 * Free at/above the threshold. Subtotal is the product total before tax/shipping.
 */
export function calculateShipping(
  items: { product: Product; qty: number; unitPrice: number }[],
): number {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  if (subtotal >= SHIPPING_RATES.FREE_THRESHOLD) return 0;

  let highestTier: number = SHIPPING_RATES.TEE_KIDS;
  let totalUnits = 0;
  for (const { product, qty } of items) {
    totalUnits += qty;
    if (product.garment === "Cropped Hoodie") {
      highestTier = SHIPPING_RATES.CROPPED;
    } else if (
      (product.garment === "Crew" || product.garment === "Hoodie") &&
      highestTier !== SHIPPING_RATES.CROPPED
    ) {
      highestTier = SHIPPING_RATES.CREW_HOODIE;
    }
  }
  if (totalUnits === 0) return 0;
  const additionalUnits = totalUnits - 1;
  return Math.round(
    (highestTier + additionalUnits * SHIPPING_RATES.ADDITIONAL_ITEM) * 100,
  ) / 100;
}

/** Human-readable label for the shipping method on the WooCommerce order. */
export function shippingMethodTitle(rate: number): string {
  if (rate === 0) return "Free Shipping";
  return "Flat Rate Shipping";
}
