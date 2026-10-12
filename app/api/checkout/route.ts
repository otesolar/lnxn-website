import { NextResponse } from "next/server";
import {
  isWooConfigured,
  findVariationForSize,
  createPendingOrder,
  type OrderLine,
} from "@/lib/woo";

interface CheckoutItem {
  id: number;
  size: string;
  qty: number;
}

function isValidItem(item: unknown): item is CheckoutItem {
  if (typeof item !== "object" || item === null) return false;
  const { id, size, qty } = item as Record<string, unknown>;
  return (
    typeof id === "number" &&
    Number.isInteger(id) &&
    id > 0 &&
    typeof size === "string" &&
    size.trim().length > 0 &&
    size.trim().length <= 10 &&
    typeof qty === "number" &&
    Number.isInteger(qty) &&
    qty > 0 &&
    qty <= 99
  );
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
  if (!Array.isArray(items) || items.length === 0 || !items.every(isValidItem)) {
    return NextResponse.json(
      { error: "Your cart looks empty or invalid. Please try again." },
      { status: 400 },
    );
  }

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
        variationId: await findVariationForSize(item.id, item.size.trim()),
        size: item.size.trim(),
        qty: item.qty,
      })),
    );
    const order = await createPendingOrder(lines);
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
