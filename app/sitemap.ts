import type { MetadataRoute } from "next";
import raw from "@/data/catalog.json";
import type { RawProduct } from "@/lib/catalog";

const BASE = "https://thelnxn.com";

const products: RawProduct[] = Array.isArray(raw)
  ? (raw as RawProduct[])
  : (((raw as { products?: RawProduct[] }).products ?? []) as RawProduct[]);

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    { url: BASE, lastModified: today, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/shop`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/story`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/lookbook`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/contact`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/shipping`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...products.map((p) => ({
      url: `${BASE}/product/${p.slug}`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
