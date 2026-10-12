import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { products } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalog-server";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <ProductView product={product} />
    </div>
  );
}
