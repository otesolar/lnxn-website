import Image from "next/image";
import Link from "next/link";
import { formatPrice, productImages, type Product } from "@/lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  const imgs = productImages(product);
  const primary = imgs[0];
  const secondary = imgs[1] ?? imgs[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={product.name}
    >
      <div className="relative aspect-square overflow-hidden bg-coal">
        {primary ? (
          <>
            <Image
              src={primary}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            {secondary && secondary !== primary && (
              <Image
                src={secondary}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/brand/lnxn-mark.png"
              alt="LNXN"
              width={72}
              height={72}
              className="opacity-40"
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gold py-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-black transition-transform duration-300 group-hover:translate-y-0">
          View Product
        </div>
      </div>
      <div className="pt-4">
        <p className="eyebrow !text-[0.62rem]">
          {product.line} · {product.audience}
        </p>
        <h3 className="mt-1.5 font-semibold text-white leading-snug group-hover:text-gold-light transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-smoke">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
