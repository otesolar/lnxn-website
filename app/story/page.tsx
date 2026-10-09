import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const PILLARS = [
  {
    word: "Timeless",
    copy: "Trends expire. A perfect tee doesn't. We design silhouettes that looked right ten years ago and will look right ten years from now.",
  },
  {
    word: "Bold",
    copy: "Bold isn't loud — it's certain. Clean lines, confident cuts, and the quiet mark of people who know exactly who they are.",
  },
  {
    word: "You",
    copy: "The best thing you can wear is yourself. LNXN is the canvas: premium essentials that let the wearer be the statement.",
  },
];

export default function StoryPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-24 text-center md:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 38%, rgba(178,128,39,0.12), transparent 70%)",
          }}
          aria-hidden
        />
        <Reveal>
          <Image
            src="/brand/lnxn-lockup.png"
            alt="LNXN"
            width={300}
            height={300}
            className="mx-auto h-40 w-auto object-contain"
          />
          <p className="eyebrow mt-10">Our story</p>
          <h1 className="display mx-auto mt-4 max-w-3xl text-4xl md:text-6xl">
            Wear who you are
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/65">
            LNXN started with a simple frustration: clothing that asked you to
            choose between quality and identity. We refused the trade-off. Every
            LNXN piece carries the same promise — premium fabric, honest
            construction, and a design language that never shouts, because it
            never has to.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-line bg-coal">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow">What we stand for</p>
            <h2 className="display mt-3 text-3xl md:text-5xl">
              Three words. One standard.
            </h2>
            <div className="gold-rule mx-auto mt-6" />
          </Reveal>
          <div className="grid gap-px bg-line md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.word} delay={i * 120} className="h-full">
                <div className="flex h-full flex-col bg-coal p-10">
                  <span className="display text-5xl text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-6 text-2xl">{p.word}</h3>
                  <p className="mt-4 leading-relaxed text-white/60">{p.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center md:px-8 md:py-28">
        <Reveal>
          <Image
            src="/brand/lnxn-mark-gold.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto"
          />
          <h2 className="display mx-auto mt-8 max-w-3xl text-3xl md:text-5xl">
            The mark
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/65">
            The triangle is the strongest shape in geometry — three points, no
            weak side. Ours carries the LNXN eye at its center: a reminder to
            move through the world on your own terms, and to be seen doing it.
            You&apos;ll find it on the chest of every piece we make. Small,
            deliberate, unmistakable.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn btn-gold">
              Shop the Collection
            </Link>
            <Link href="/lookbook" className="btn btn-outline">
              View Lookbook
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
