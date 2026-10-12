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
 * For variable products, find the variation id matching Size and (when given)
 * Color, case-insensitive. Tries an exact color match first, then a
 * Gray/Grey-normalized match (the catalog uses both spellings). Falls back to
 * a size-only match with a warning if the color matches nothing, so checkout
 * never breaks on a color-name mismatch. Returns null for simple products or
 * when no size matches.
 */
export async function findVariationForSize(
  productId: number,
  size: string,
  color?: string,
): Promise<number | null> {
  const product = await getWooProduct(productId);
  if (product.type !== "variable") return null;
  const variations = (await wooFetch(
    `/products/${productId}/variations?per_page=100`,
  )) as WooVariation[];
  const wantSize = size.trim().toLowerCase();
  const sizeMatches = variations.filter((v) =>
    (v.attributes ?? []).some(
      (a) =>
        /size/i.test(a.name ?? "") &&
        (a.option ?? "").trim().toLowerCase() === wantSize,
    ),
  );
  if (sizeMatches.length === 0) return null;

  const wantColor = color?.trim().toLowerCase();
  if (!wantColor) return sizeMatches[0].id;

  const isColorAttr = (a: { name?: string }) =>
    /colou?r/i.test(a.name ?? "");
  const normGray = (s: string) => s.replace(/grey/g, "gray");
  const colorMatch =
    sizeMatches.find((v) =>
      (v.attributes ?? []).some(
        (a) =>
          isColorAttr(a) &&
          (a.option ?? "").trim().toLowerCase() === wantColor,
      ),
    ) ??
    sizeMatches.find((v) =>
      (v.attributes ?? []).some(
        (a) =>
          isColorAttr(a) &&
          normGray((a.option ?? "").trim().toLowerCase()) ===
            normGray(wantColor),
      ),
    );

  if (!colorMatch) {
    console.warn(
      `WooCommerce: no "${color}" variation for product ${productId} size ${size}; using size-only match.`,
    );
  }
  return (colorMatch ?? sizeMatches[0]).id;
}

export interface OrderLine {
  productId: number;
  variationId: number | null;
  size: string;
  color?: string;
  qty: number;
}

/** Customer address collected on the storefront before order creation. */
export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

/**
 * Create a pending (unpaid) WooCommerce order and return the order-pay URL
 * the customer completes payment on.
 *
 * NOTE: the payment URL comes from WooCommerce's own API response
 * (`payment_url`), never hardcoded. The checkout page slug varies per store
 * (e.g. /checkout-2/ when /checkout/ was taken) — only Woo knows the real
 * URL, so we use theirs.
 */
export async function createPendingOrder(
  lines: OrderLine[],
  customer: CustomerInfo,
): Promise<{
  id: number;
  order_key: string;
  payment_url: string;
}> {
  const address = {
    first_name: customer.firstName,
    last_name: customer.lastName,
    address_1: customer.address1,
    address_2: customer.address2 ?? "",
    city: customer.city,
    state: customer.state,
    postcode: customer.postcode,
    country: customer.country,
  };
  const body = {
    status: "pending",
    set_paid: false,
    billing: { ...address, email: customer.email },
    shipping: address,
    line_items: lines.map((l) => ({
      product_id: l.productId,
      variation_id: l.variationId ?? 0,
      quantity: l.qty,
      meta_data: [
        { key: "Size", value: l.size },
        ...(l.color ? [{ key: "Color", value: l.color }] : []),
      ],
    })),
  };
  const order = (await wooFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  })) as { id: number; order_key: string; payment_url: string };
  if (!order.payment_url) {
    throw new Error("WooCommerce did not return a payment URL for the order.");
  }
  return {
    id: order.id,
    order_key: order.order_key,
    payment_url: order.payment_url,
  };
}
