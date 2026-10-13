/**
 * Stripe Tax calculation for headless checkout.
 *
 * WooCommerce's Stripe Tax plugin only runs during the normal checkout flow,
 * which our API bypasses — so we call Stripe's Tax Calculations API directly
 * from the backend. Card data is never involved; this is tax-only.
 *
 * Requires STRIPE_SECRET_KEY in the environment. If unset or the API fails,
 * returns null and the caller should proceed without tax (logged server-side).
 */
import type { CustomerInfo } from "./woo";

const STRIPE_API = "https://api.stripe.com/v1";
/** Stripe tax code for general tangible goods (apparel). */
const TAX_CODE_APPAREL = "txcd_99999999";

/** Map province/state names to ISO codes (Stripe needs codes, not names). */
const STATE_CODES: Record<string, string> = {
  // Canada
  alberta: "AB",
  "british columbia": "BC",
  manitoba: "MB",
  "new brunswick": "NB",
  "newfoundland and labrador": "NL",
  newfoundland: "NL",
  "nova scotia": "NS",
  "northwest territories": "NT",
  nunavut: "NU",
  ontario: "ON",
  "prince edward island": "PE",
  quebec: "QC",
  saskatchewan: "SK",
  yukon: "YT",
  // US (common)
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM",
  "new york": "NY", "north carolina": "NC", "north dakota": "ND", ohio: "OH",
  oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX",
  utah: "UT", vermont: "VT", virginia: "VA", washington: "WA",
  "west virginia": "WV", wisconsin: "WI", wyoming: "WY",
  "district of columbia": "DC",
};

function toStateCode(state: string): string {
  const t = state.trim();
  if (/^[A-Za-z]{2}$/.test(t)) return t.toUpperCase();
  return STATE_CODES[t.toLowerCase()] ?? t;
}

export interface StripeLineItem {
  /** Amount in cents, e.g. 2499 for $24.99. */
  amountCents: number;
  reference: string;
}

export interface TaxResult {
  /** Total tax in cents. */
  totalTaxCents: number;
  breakdown: { label: string; amountCents: number }[];
}

export async function calculateStripeTax(
  items: StripeLineItem[],
  customer: CustomerInfo,
  currency: string = "cad",
): Promise<TaxResult | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn("STRIPE_SECRET_KEY not set; skipping tax calculation.");
    return null;
  }
  if (items.length === 0) return null;

  const params = new URLSearchParams();
  params.append("currency", currency.toLowerCase());
  params.append("customer_details[address_source]", "shipping");
  params.append("customer_details[address][line1]", customer.address1);
  if (customer.address2) {
    params.append("customer_details[address][line2]", customer.address2);
  }
  params.append("customer_details[address][city]", customer.city);
  params.append("customer_details[address][state]", toStateCode(customer.state));
  params.append("customer_details[address][postal_code]", customer.postcode);
  params.append("customer_details[address][country]", customer.country);

  items.forEach((item, i) => {
    params.append(`line_items[${i}][amount]`, String(item.amountCents));
    params.append(`line_items[${i}][reference]`, item.reference);
    params.append(`line_items[${i}][tax_code]`, TAX_CODE_APPAREL);
  });

  let res: Response;
  try {
    res = await fetch(`${STRIPE_API}/tax/calculations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch (err) {
    console.error(
      "Stripe Tax API network failure:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`Stripe Tax API failed (HTTP ${res.status}):`, body.slice(0, 300));
    return null;
  }

  const data = (await res.json()) as {
    tax_amount_exclusive?: number;
    tax_breakdown?: {
      amount?: number;
      tax_rate_details?: { display_name?: string };
    }[];
  };

  const breakdown = (data.tax_breakdown ?? []).map((b) => ({
    label: b.tax_rate_details?.display_name || "Tax",
    amountCents: b.amount ?? 0,
  }));

  return {
    totalTaxCents: data.tax_amount_exclusive ?? 0,
    breakdown,
  };
}
