import { NextResponse } from "next/server";
import { calculateStripeTax } from "@/lib/stripe-tax";
import { getTaxRates, calculateWooTax } from "@/lib/woo";

/**
 * Diagnostic: tests Stripe Tax API and WooCommerce rates.
 * Does NOT expose any key values.
 */
export async function GET() {
  const out: Record<string, unknown> = {};

  // 1. Stripe Tax check
  const keySet = !!process.env.STRIPE_SECRET_KEY;
  out.stripeKeySet = keySet;
  if (keySet) {
    const result = await calculateStripeTax(
      [{ amountCents: 10000, reference: "test-1" }],
      {
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        address1: "123 Main St",
        city: "Winnipeg",
        state: "Manitoba",
        postcode: "R3Y 0E5",
        country: "CA",
      },
    );
    out.stripe = result
      ? { totalTaxCents: result.totalTaxCents, breakdown: result.breakdown }
      : { error: "Stripe Tax API call failed (see server logs)" };
  }

  // 2. WooCommerce rates check (Manitoba, $100 subtotal)
  try {
    const rates = await getTaxRates();
    out.wooRatesCount = rates.length;
    out.wooRatesSample = rates.slice(0, 3).map((r) => ({
      country: r.country,
      state: r.state,
      rate: r.rate,
      name: r.name,
      priority: r.priority,
    }));
    const breakdown = calculateWooTax(rates, 10000, "CA", "Manitoba");
    out.wooManitoba = breakdown;
  } catch (e) {
    out.wooError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(out);
}
