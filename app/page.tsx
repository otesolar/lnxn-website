import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { products, productImages } from "@/lib/catalog";

function firstImageOf(predicate: (p: (typeof products)[number]) => boolean) {
  const p = products.find(predicate);
  return p ? productImages(p)[0] : "/brand/lnxn-lockup.png";
}

export default function Home() {
  const bestsellers = products
    .filter((p) => p.garment === "Hoodie" || p.garment === "Cropped Hoodie")
    .slice(0, 4);
  const coreImg = firstImageOf((p) => p.line === "Core" && p.audience === "Men");
  const heritageImg = firstImageOf(
    (p) => p.line === "Heritage" && p.audience === "Women",
  );
  const kidsImg = firstImageOf((p) => p.audience === "Kids");

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 42%, rgba(178,128,39,0.14), transparent 70%)",
          }}
          aria-hidden
        />
        <Reveal>
          <Image
            src="/brand/lnxn-lockup.png"
            alt="LNXN"
            width={520}
            height={520}
            priority
            className="mx-auto h-[38vh] w-auto object-contain md:h-[46vh]"
          />
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow mt-8">Timeless. Bold. You.</p>
          <h1 className="display mx-auto mt-4 max-w-3xl text-4xl md:text-6xl">
            Essentials that outlast trends
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            Premium tees, hoodies and crews — cut clean, built to last, designed
            for men, women and kids who dress like themselves.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/shop" className="btn btn-gold">
              Shop the Collection
            </Link>
            <Link href="/story" className="btn btn-outline">
              Our Story
            </Link>
          </div>
        </Reveal>
        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40" aria-hidden>
          <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      <Marquee />

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Two lines. One standard.</p>
          <h2 className="display mt-3 text-3xl md:text-5xl">The Collections</h2>
          <div className="gold-rule mx-auto mt-6" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              line: "Core",
              href: "/shop?line=Core",
              img: coreImg,
              copy: "The everyday uniform. Clean cuts, heavyweight feel, the pieces you reach for daily.",
            },
            {
              line: "Heritage",
              href: "/shop?line=Heritage",
              img: heritageImg,
              copy: "A nod to the classics. Timeless silhouettes with the LNXN mark of quality.",
            },
          ].map((c, i) => (
            <Reveal key={c.line} delay={i * 120}>
              <Link
                href={c.href}
                className="group relative block overflow-hidden"
              >
                <div className="relative aspect-[4/5] md:aspect-[3/3.4]">
                  <Image
                    src={c.img}
                    alt={`${c.line} collection`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="eyebrow">Collection</p>
                  <h3 className="display mt-2 text-4xl md:text-5xl">{c.line}</h3>
                  <p className="mt-3 max-w-sm text-sm text-white/70">{c.copy}</p>
                  <span className="btn btn-gold mt-6">Shop {c.line}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="border-y border-line bg-coal">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Most wanted</p>
              <h2 className="display mt-3 text-3xl md:text-5xl">Bestsellers</h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-[0.25em] text-gold-light hover:text-gold"
            >
              View all →
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STORY BAND */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <Image
              src="/brand/lnxn-mark-gold.png"
              alt=""
              width={72}
              height={72}
              className="mx-auto opacity-90"
            />
            <h2 className="display mx-auto mt-8 max-w-3xl text-3xl leading-tight md:text-5xl">
              Timeless <span className="text-gold">.</span> Bold{" "}
              <span className="text-gold">.</span> You{" "}
              <span className="text-gold">.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/65">
              LNXN isn&apos;t fast fashion. Every piece is designed to be worn
              hard, washed often, and still look right years from now — because
              the boldest thing you can wear is yourself.
            </p>
            <Link href="/story" className="btn btn-outline mt-9">
              Read Our Story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* KIDS BAND */}
      <section className="border-t border-line bg-coal">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <Reveal>
            <div className="relative aspect-square overflow-hidden">
              {kidsImg !== "/brand/lnxn-lockup.png" && (
                <Image
                  src={kidsImg}
                  alt="LNXN Kids collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">For the next generation</p>
            <h2 className="display mt-3 text-3xl md:text-5xl">
              LNXN Kids
            </h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 max-w-md leading-relaxed text-white/65">
              The same premium quality, sized down. Tees, hoodies and crews
              built for playgrounds, classrooms and everything in between.
            </p>
            <Link href="/shop?audience=Kids" className="btn btn-gold mt-8">
              Shop Kids
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
