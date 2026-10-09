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

export const products: Product[] = (raw as RawProduct[]).map((p) => ({
  ...p,
  ...parseName(p),
}));

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

export function relatedProducts(p: Product, count = 4): Product[] {
  const sameLine = products.filter((x) => x.slug !== p.slug && x.line === p.line);
  const rest = products.filter((x) => x.slug !== p.slug && x.line !== p.line);
  return [...sameLine, ...rest].slice(0, count);
}

export const SIZES = ["S", "M", "L", "XL", "2XL"] as const;
