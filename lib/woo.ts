// SERVER-ONLY — this module holds the WooCommerce API secrets.
// Never import it from a client component ("use client") or from any module
// that a client component imports. The `server-only` import below makes the
// build fail loudly if that ever happens.
import "server-only";

import { cacheLife } from "next/cache";
import type { RawProduct } from "./catalog";

const WOO_URL = (process.env.WOO_URL ?? "").replace(/\/+$/, "");
const WOO_KEY = process.env.WOO_CONSUMER_KEY ?? "";
const WOO_SECRET = process.env.WOO_CONSUMER_SECRET ?? "";

/** True when all three WooCommerce env vars are set. */
export function isWooConfigured(): boolean {
  return Boolean(WOO_URL && WOO_KEY && WOO_SECRET);
}

function authHeader(): string {
  const token = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`, "utf8").toString(
    "base64",
  );
  return `Basic ${token}`;
}

async function wooFetch(path: string, init: RequestInit = {}): Promise<unknown> {
  if (!isWooConfigured()) {
    throw new Error(
      "WooCommerce is not configured (WOO_URL / WOO_CONSUMER_KEY / WOO_CONSUMER_SECRET).",
    );
  }
  const res = await fetch(`${WOO_URL}/wp-json/wc/v3${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    // Keep the message useful but never include auth material or full bodies.
    const snippet = (await res.text()).slice(0, 300);
    throw new Error(
      `WooCommerce request failed (${res.status} ${res.statusText}) for ${path}: ${snippet}`,
    );
  }
  return res.json();
}

interface WooCategory {
  name: string;
}

interface WooImage {
  src: string;
}

interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  description: string;
  categories: WooCategory[];
  images: WooImage[];
  permalink: string;
  type: string;
}

interface WooVariation {
  id: number;
  attributes: { name: string; option: string }[];
}

/** Strip HTML tags from a WooCommerce description into plain text. */
function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fetch all published products and map them onto the site's RawProduct shape.
 *
 * NOTE: "use cache" is required, not just an optimization. Product pages
 * statically prerender at build time (generateStaticParams), and with Cache
 * Components an uncached data access during prerendering fails the build
 * ("encountered uncached or runtime data"). Marking this function cached
 * makes it prerender-safe.
 *
 * The fetch failure is caught INSIDE the cached function (returning []) so a
 * throw can never escape during prerendering. getCatalog() treats an empty
 * result as "Woo unavailable" and falls back to the baked-in catalog. The
 * empty result is cached for the same 'minutes' lifetime, so a Woo outage
 * doesn't hammer the API — the next revalidation window retries.
 */
export async function getLiveProducts(): Promise<RawProduct[]> {
  "use cache";
  cacheLife("minutes");

  try {
    const list = (await wooFetch(
      "/products?per_page=100&status=publish",
    )) as WooProduct[];
    return list.map((p) => {
      const price = parseFloat(p.price) || 0;
      const images = (p.images ?? []).map((i) => i.src).filter(Boolean);
      const description = plainText(p.description ?? "");
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price,
        regular_price: parseFloat(p.regular_price) || price,
        on_sale: Boolean(p.on_sale),
        categories: (p.categories ?? []).map((c) => c.name),
        images,
        image_count: images.length,
        permalink: p.permalink ?? "",
        // Only set when the merchant wrote one — the site falls back to its
        // own per-product copy when this is empty.
        ...(description ? { description } : {}),
      };
    });
  } catch (err) {
    console.warn(
      "WooCommerce live catalog failed, using baked-in catalog:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

/** Fetch a single product's id and type ("simple" | "variable" | ...). */
export async function getWooProduct(
  id: number,
): Promise<{ id: number; type: string }> {
  const p = (await wooFetch(`/products/${id}`)) as {
    id: number;
    type: string;
  };
  return { id: p.id, type: p.type };
}

/**
 * For variable products, find the variation id whose Size attribute matches
 * `size` (case-insensitive). Returns null for simple products or no match.
 */
export async function findVariationForSize(
  productId: number,
  size: string,
): Promise<number | null> {
  const product = await getWooProduct(productId);
  if (product.type !== "variable") return null;
  const variations = (await wooFetch(
    `/products/${productId}/variations?per_page=100`,
  )) as WooVariation[];
  const want = size.trim().toLowerCase();
  const match = variations.find((v) =>
    (v.attributes ?? []).some(
      (a) =>
        /size/i.test(a.name ?? "") &&
        (a.option ?? "").trim().toLowerCase() === want,
    ),
  );
  return match ? match.id : null;
}

export interface OrderLine {
  productId: number;
  variationId: number | null;
  size: string;
  qty: number;
}

/**
 * Create a pending (unpaid) WooCommerce order and return the order-pay URL
 * the customer completes payment on.
 */
export async function createPendingOrder(lines: OrderLine[]): Promise<{
  id: number;
  order_key: string;
  payment_url: string;
}> {
  const body = {
    status: "pending",
    set_paid: false,
    line_items: lines.map((l) => ({
      product_id: l.productId,
      variation_id: l.variationId ?? 0,
      quantity: l.qty,
      meta_data: [{ key: "Size", value: l.size }],
    })),
  };
  const order = (await wooFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  })) as { id: number; order_key: string };
  return {
    id: order.id,
    order_key: order.order_key,
    payment_url: `${WOO_URL}/checkout/order-pay/${order.id}/?key=${order.order_key}`,
  };
}
