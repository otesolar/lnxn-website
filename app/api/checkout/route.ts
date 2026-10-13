import { NextResponse } from "next/server";
import {
  isWooConfigured,
  findVariationForSize,
  createPendingOrder,
  findOrCreateCustomer,
  getWooPrice,
  getTaxRates,
  calculateWooTax,
  type OrderLine,
  type CustomerInfo,
  type OrderTaxLine,
} from "@/lib/woo";

interface CheckoutItem {
  id: number;
  size: string;
  color?: string;
  qty: number;
}

function isValidItem(item: unknown): item is CheckoutItem {
  if (typeof item !== "object" || item === null) return false;
  const { id, size, color, qty } = item as Record<string, unknown>;
  return (
    typeof id === "number" &&
    Number.isInteger(id) &&
    id > 0 &&
    typeof size === "string" &&
    size.trim().length > 0 &&
    size.trim().length <= 10 &&
    (color === undefined ||
      (typeof color === "string" &&
        color.trim().length > 0 &&
        color.trim().length <= 40)) &&
    typeof qty === "number" &&
    Number.isInteger(qty) &&
    qty > 0 &&
    qty <= 99
  );
}

function isNonEmptyString(v: unknown, max: number): v is string {
  return (
    typeof v === "string" && v.trim().length > 0 && v.trim().length <= max
  );
}

function isValidCustomer(c: unknown): c is CustomerInfo {
  if (typeof c !== "object" || c === null) return false;
  const o = c as Record<string, unknown>;
  const email = o.email;
  const emailOk =
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
    email.trim().length <= 100;
  const country = o.country;
  const countryOk =
    typeof country === "string" && /^[A-Z]{2}$/.test(country.trim());
  return (
    emailOk &&
    isNonEmptyString(o.firstName, 50) &&
    isNonEmptyString(o.lastName, 50) &&
    isNonEmptyString(o.address1, 100) &&
    (o.address2 === undefined || isNonEmptyString(o.address2, 100)) &&
    isNonEmptyString(o.city, 50) &&
    isNonEmptyString(o.state, 50) &&
    isNonEmptyString(o.postcode, 20) &&
    countryOk
  );
}

function toCustomerInfo(c: CustomerInfo): CustomerInfo {
  return {
    email: c.email.trim(),
    firstName: c.firstName.trim(),
    lastName: c.lastName.trim(),
    address1: c.address1.trim(),
    address2: c.address2?.trim() || undefined,
    city: c.city.trim(),
    state: c.state.trim(),
    postcode: c.postcode.trim(),
    country: c.country.trim().toUpperCase(),
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 },
    );
  }

  const items = (body as Record<string, unknown> | null)?.items;
  const customerRaw = (body as Record<string, unknown> | null)?.customer;
  if (!Array.isArray(items) || items.length === 0 || !items.every(isValidItem)) {
    return NextResponse.json(
      { error: "Your cart looks empty or invalid. Please try again." },
      { status: 400 },
    );
  }
  if (!isValidCustomer(customerRaw)) {
    return NextResponse.json(
      { error: "Please complete your shipping details." },
      { status: 400 },
    );
  }
  const customer = toCustomerInfo(customerRaw);

  if (!isWooConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not available right now. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const lines: OrderLine[] = await Promise.all(
      items.map(async (item) => ({
        productId: item.id,
        variationId: await findVariationForSize(
          item.id,
          item.size.trim(),
          item.color?.trim(),
        ),
        size: item.size.trim(),
        color: item.color?.trim(),
        qty: item.qty,
      })),
    );

    // Calculate tax from WooCommerce's configured rates (graceful: order
    // proceeds without tax if rates can't be loaded — logged server-side).
    let taxes: OrderTaxLine[] = [];
    try {
      const prices = await Promise.all(lines.map((l) => getWooPrice(l.productId)));
      const subtotalCents = lines.reduce(
        (sum, l, i) => sum + Math.round(prices[i] * 100) * l.qty,
        0,
      );
      const rates = await getTaxRates();
      const breakdown = calculateWooTax(
        rates,
        subtotalCents,
        customer.country,
        customer.state,
      );
      taxes = breakdown.map((b) => ({
        label: b.label,
        amount: b.amountCents / 100,
      }));
      if (taxes.length === 0) {
        console.warn(
          `No tax rates matched for ${customer.country}/${customer.state}; order will have no tax.`,
        );
      }
    } catch (taxErr) {
      console.error(
        "Tax calculation failed, proceeding without tax:",
        taxErr instanceof Error ? taxErr.message : taxErr,
      );
    }

    const order = await createPendingOrder(
      lines,
      customer,
      taxes,
      await findOrCreateCustomer(customer),
    );
    return NextResponse.json({ payment_url: order.payment_url });
  } catch (err) {
    // Log the detail server-side; the customer only gets a friendly message.
    console.error(
      "Checkout failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      {
        error:
          "We couldn't start your checkout just now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
