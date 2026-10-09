"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  productImages,
  relatedProducts,
  SIZES,
  type Product,
} from "@/lib/catalog";
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

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden bg-coal">
            {imgs[active] ? (
              <Image
                src={imgs[active]}
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
          {imgs.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {imgs.slice(0, 10).map((src, i) => (
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

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Size</p>
              <span className="text-xs text-smoke">True to size</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
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
                    image: imgs[0] ?? "",
                    size,
                  },
                  qty,
                )
              }
              className="btn btn-gold flex-1"
            >
              Add to Cart — {formatPrice(product.price * qty)}
            </button>
          </div>

          <div className="mt-8 border-t border-line">
            <Accordion title="Details">
              Premium midweight fabric with a clean, structured drape. Signature
              LNXN chest mark. Reinforced stitching at stress points. Machine
              washable — designed to look better with wear.
            </Accordion>
            <Accordion title="Fit">
              Cut true to size with a modern, slightly relaxed fit. Model sizing
              shown across product imagery. Between sizes? Size down for a
              classic fit, up for an oversized look.
            </Accordion>
            <Accordion title="Shipping & Returns">
              Orders are processed quickly and shipped with tracking. If
              something isn&apos;t right, easy returns are available — full
              details at checkout.
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
