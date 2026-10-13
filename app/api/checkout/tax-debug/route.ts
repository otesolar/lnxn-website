import { NextResponse } from "next/server";
import { calculateStripeTax } from "@/lib/stripe-tax";

/**
 * Diagnostic: tests Stripe Tax API connectivity.
 * Returns whether the key is set and if a test calculation succeeds.
 * Does NOT expose the key value.
 */
export async function GET() {
  const keySet = !!process.env.STRIPE_SECRET_KEY;
  if (!keySet) {
    return NextResponse.json({ keySet: false, error: "STRIPE_SECRET_KEY not set" });
  }

  // Test with a dummy Manitoba address and $100 item.
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

  if (!result) {
    return NextResponse.json({
      keySet: true,
      success: false,
      error: "Stripe Tax API call failed (see server logs)",
    });
  }

  return NextResponse.json({
    keySet: true,
    success: true,
    totalTaxCents: result.totalTaxCents,
    breakdown: result.breakdown,
  });
}
