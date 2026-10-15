import type { Product } from "./catalog";

/** Flat-rate shipping in USD, matching the agreed LNXN shipping plan. */
export const SHIPPING_RATES = {
  /** Tees and kids items */
  TEE_KIDS: 5.99,
  /** Adult crews and hoodies */
  CREW_HOODIE: 8.99,
  /** Cropped hoodie */
  CROPPED: 10.99,
  /** Free shipping at or above this product subtotal */
  FREE_THRESHOLD: 80,
} as const;

/**
 * Calculate the flat-rate shipping for an order.
 * Highest tier wins for mixed carts. Free at/above the threshold.
 * Subtotal should be the product total before tax and shipping.
 */
export function calculateShipping(
  items: { product: Product; qty: number; unitPrice: number }[],
): number {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  if (subtotal >= SHIPPING_RATES.FREE_THRESHOLD) return 0;

  let rate: number = SHIPPING_RATES.TEE_KIDS;
  for (const { product } of items) {
    if (product.garment === "Cropped Hoodie") {
      return SHIPPING_RATES.CROPPED;
    }
    if (product.garment === "Crew" || product.garment === "Hoodie") {
      rate = SHIPPING_RATES.CREW_HOODIE;
    }
  }
  return rate;
}

/** Human-readable label for the shipping method on the WooCommerce order. */
export function shippingMethodTitle(rate: number): string {
  if (rate === 0) return "Free Shipping";
  return "Flat Rate Shipping";
}
