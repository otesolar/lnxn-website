import raw from "@/data/catalog.json";

export interface RawProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  on_sale: boolean;
  categories: string[];
  images?: string[];
  image_count: number;
  permalink: string;
  /**
   * Per-product description from WooCommerce (plain text). Takes precedence
   * over lib/product-descriptions.ts when present.
   */
  description?: string;
}

export type Audience = "Men" | "Women" | "Kids";
export type Line = "Core" | "Heritage";
export type Garment = "Tee" | "Hoodie" | "Crew" | "Cropped Hoodie";

export interface Product extends RawProduct {
  audience: Audience;
  line: Line;
  garment: Garment;
}

function parseName(p: RawProduct): Pick<Product, "audience" | "line" | "garment"> {
  const n = p.name;
  const audience: Audience = p.categories.includes("WOMEN")
    ? "Women"
    : p.categories.includes("KIDS")
      ? "Kids"
      : /women/i.test(n)
        ? "Women"
        : /kid/i.test(n)
          ? "Kids"
          : "Men";
  const line: Line = /heritage/i.test(n) ? "Heritage" : "Core";
  const garment: Garment = /cropped hoodie/i.test(n)
    ? "Cropped Hoodie"
    : /hoodie/i.test(n)
      ? "Hoodie"
      : /crew/i.test(n)
        ? "Crew"
        : "Tee";
  return { audience, line, garment };
}

export function augmentProducts(rawList: RawProduct[]): Product[] {
  return rawList.map((p) => ({
    ...p,
    ...parseName(p),
  }));
}

export const products: Product[] = augmentProducts(raw as RawProduct[]);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productImages(p: Product): string[] {
  if (p.images && p.images.length > 0) return p.images;
  return [];
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

/**
 * Size surcharges in CAD, matching WooCommerce variation prices.
 * Base price (S–XL) lives in data/catalog.json.
 */
const SIZE_SURCHARGES: Record<Garment, Record<string, number>> = {
  Tee: { "2XL": 1, "3XL": 2 },
  Crew: { "2XL": 2, "3XL": 3 },
  Hoodie: { "2XL": 2, "3XL": 3 },
  "Cropped Hoodie": {},
};

/** Price for a product in a given size, including any size surcharge. */
export function getPriceForSize(product: Product, size: string): number {
  const surcharge = SIZE_SURCHARGES[product.garment]?.[size] ?? 0;
  return Math.round((product.price + surcharge) * 100) / 100;
}

/** True when any size of this product carries a surcharge (for "From $X" display). */
export function hasSizeSurcharges(product: Product): boolean {
  return Object.keys(SIZE_SURCHARGES[product.garment] ?? {}).length > 0;
}

export function relatedProducts(p: Product, count = 4): Product[] {
  const sameLine = products.filter((x) => x.slug !== p.slug && x.line === p.line);
  const rest = products.filter((x) => x.slug !== p.slug && x.line !== p.line);
  return [...sameLine, ...rest].slice(0, count);
}

export const SIZES = ["S", "M", "L", "XL", "2XL"] as const;
