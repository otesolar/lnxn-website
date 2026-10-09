import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { products, productImages } from "@/lib/catalog";

// Editorial mix: pull varied imagery across lines & audiences
const SHOTS = (() => {
  const picks: { src: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const imgs = productImages(p);
    for (let i = 0; i < Math.min(imgs.length, 3); i += 2) {
      const src = imgs[i];
      if (src && !seen.has(src)) {
        seen.add(src);
        picks.push({ src, label: `${p.line} · ${p.audience}` });
      }
      if (picks.length >= 12) break;
    }
    if (picks.length >= 12) break;
  }
  return picks;
})();

export default function LookbookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal className="mb-12 text-center">
        <p className="eyebrow">Worn, not styled</p>
        <h1 className="display mt-3 text-4xl md:text-6xl">Lookbook</h1>
        <div className="gold-rule mx-auto mt-6" />
        <p className="mx-auto mt-6 max-w-xl text-white/60">
          LNXN in the wild — real pieces on real people. Timeless cuts, bold
          simplicity.
        </p>
      </Reveal>

      <div className="columns-2 gap-5 md:columns-3 [&>*]:mb-5">
        {SHOTS.map((s, i) => (
          <Reveal key={s.src} delay={(i % 6) * 70} className="break-inside-avoid">
            <figure className="group relative overflow-hidden bg-coal">
              <Image
                src={s.src}
                alt={`LNXN ${s.label}`}
                width={800}
                height={1000}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold-light">
                  {s.label}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center">
        <Link href="/shop" className="btn btn-gold">
          Shop the Looks
        </Link>
      </Reveal>
    </div>
  );
}
