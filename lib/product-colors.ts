import raw from "@/data/product-colors.json";

export interface Colorway {
  name: string;
  hex: string;
  images: string[];
}

const map = raw as Record<string, Colorway[]>;

/** Colorways for a product, in the official color order. Empty when unknown. */
export function getColorways(slug: string): Colorway[] {
  return map[slug] ?? [];
}

/** The colorway containing the product's lead image (so the page opens on it). */
export function defaultColorway(
  slug: string,
  leadImage: string,
): Colorway | undefined {
  const cws = getColorways(slug);
  return cws.find((c) => c.images.includes(leadImage)) ?? cws[0];
}
