"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  productImages,
  relatedProducts,
  type Product,
} from "@/lib/catalog";
import { getSizeChart, getSizes } from "@/lib/size-charts";
import { getColorways, defaultColorway } from "@/lib/product-colors";
import { getProductSpec } from "@/lib/product-specs";
import SizeGuide from "@/components/SizeGuide";
import ProductCard from "@/components/ProductCard";

const LINE_COPY: Record<string, string> = {
  Core: "The everyday uniform. A heavyweight, clean-cut essential designed for daily wear — soft from day one, built to hold its shape for years.",
  Heritage:
    "A nod to the classics. Timeless silhouettes, considered details, and the LNXN mark — pieces that feel familiar from the first wear.",
};

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-xs font-bold uppercase tracking-[0.22em] hover:text-gold-light"
      >
        {title}
        <span className="text-gold">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-white/65">{children}</div>}
    </div>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const { addItem } = useCart();
  const imgs = productImages(product);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string>("M");
  const [qty, setQty] = useState(1);
  const related = relatedProducts(product);
  const spec = getProductSpec(product.garment, product.audience);
  const chart = getSizeChart(product.garment, product.audience);
  const sizes = getSizes(product.garment, product.audience);
  const colorways = getColorways(product.slug);
  const [colorName, setColorName] = useState<string>(
    () => defaultColorway(product.slug, imgs[0] ?? "")?.name ?? "",
  );
  const activeColorway = colorways.find((c) => c.name === colorName);
  const gallery =
    activeColorway && activeColorway.images.length > 0
      ? activeColorway.images
      : imgs;

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden bg-coal">
            {gallery[active] ? (
              <Image
                src={gallery[active]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Image src="/brand/lnxn-mark.png" alt="LNXN" width={96} height={96} className="opacity-40" />
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {gallery.slice(0, 10).map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden bg-coal transition-all ${
                    i === active ? "ring-2 ring-gold" : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div>
          <p className="text-xs text-smoke">
            <Link href="/shop" className="hover:text-gold-light">Shop</Link>
            {" / "}
            <Link href={`/shop?line=${product.line}`} className="hover:text-gold-light">
              {product.line}
            </Link>
          </p>
          <p className="eyebrow mt-4">
            {product.line} · {product.audience} · {product.garment}
          </p>
          <h1 className="display mt-3 text-3xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-gold-light">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 leading-relaxed text-white/65">
            {LINE_COPY[product.line]}
          </p>

          {colorways.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.22em]">
                  Color
                </p>
                <span className="text-xs text-smoke">{activeColorway?.name}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colorways.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setColorName(c.name);
                      setActive(0);
                    }}
                    title={c.name}
                    aria-label={`Select color ${c.name}`}
                    aria-pressed={colorName === c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`h-10 w-10 rounded-full border transition-all ${
                      colorName === c.name
                        ? "scale-110 border-gold ring-2 ring-gold ring-offset-2 ring-offset-ink"
                        : "border-line hover:scale-105 hover:border-gold"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Size</p>
              <SizeGuide chart={chart} garmentLabel={product.garment} />
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-14 px-4 py-3 text-sm font-bold transition-colors ${
                    size === s
                      ? "bg-gold text-black"
                      : "border border-line text-white/75 hover:border-gold hover:text-gold-light"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-3 hover:text-gold-light"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                className="px-4 py-3 hover:text-gold-light"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() =>
                addItem(
                  {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: gallery[0] ?? imgs[0] ?? "",
                    size,
                    color: colorName,
                  },
                  qty,
                )
              }
              className="btn btn-gold flex-1"
            >
              Add to Cart — {formatPrice(product.price * qty)}
            </button>
          </div>
          <p className="mt-3 text-xs text-smoke">
            Dispatched in 2–3 business days · Tracked shipping
          </p>

          <div className="mt-8 border-t border-line">
            <Accordion title="Details">
              <dl className="space-y-2.5">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
                    Fabric
                  </dt>
                  <dd>
                    {spec.fabric} — {spec.composition}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
                    Fit
                  </dt>
                  <dd>{spec.fit}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
                    Print
                  </dt>
                  <dd>{spec.print}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
                    Care
                  </dt>
                  <dd>{spec.care.join(" · ")}</dd>
                </div>
              </dl>
            </Accordion>
            <Accordion title="Fit">
              Cut true to size with a modern, slightly relaxed fit. Model sizing
              shown across product imagery. Between sizes? Size down for a
              classic fit, up for an oversized look.
            </Accordion>
            <Accordion title="Shipping & Returns">
              Standard processing time is 2–3 business days. Orders ship in
              approximately 3 business days with tracking. Shipping costs are
              calculated at checkout.{" "}
              <Link href="/shipping" className="text-gold-light underline underline-offset-4 hover:text-gold">
                Read our full shipping policy
              </Link>
              . If something isn&apos;t right, easy returns are available —
              full details at checkout.
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Complete the fit</p>
            <h2 className="display mt-3 text-2xl md:text-4xl">You may also like</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-[0.25em] text-gold-light hover:text-gold"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}
