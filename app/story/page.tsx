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
            src="/brand/lnxn-mark.png"
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
            weak side. Ours carries gold at its center — a reminder of the
            value within, and the courage to live it. You&apos;ll find it on
            every piece we make.{" "}
            <strong className="text-white">
              Worn small as a reminder to yourself. Worn large as a
              declaration.
            </strong>
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

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
          <Reveal className="text-center">
            <p className="eyebrow">The story behind the emblem</p>
            <h2 className="display mt-3 text-3xl md:text-5xl">
              Limitless Next Generation
            </h2>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
              Timeless. Bold. You.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 space-y-5 leading-relaxed text-white/65">
              <p>
                Every symbol has a story. Every generation has a choice. And
                every individual has the potential to become more than their
                circumstances might suggest.
              </p>
              <p>
                LNXN was born from a simple but powerful belief:{" "}
                <strong className="text-white">
                  your beginning does not have to define your destination.
                </strong>
              </p>
              <p>
                LNXN stands for Limitless Next Generation — a philosophy that
                challenges us to look beyond limitations, embrace our
                individuality, and become intentional about the future we
                create.
              </p>
              <p>Our emblem represents this philosophy.</p>
            </div>
          </Reveal>

          {[
            {
              title: "The Triangle — A Foundation for Greatness",
              body: [
                "The triangle is a symbol of structure, strength, and direction. It reminds us that meaningful growth begins with a foundation. Before we rise, we must know what we stand on. Before we move forward, we must understand what guides us.",
                "At LNXN, we believe that true progress is not about losing yourself in the pursuit of success. It is about building upon your identity, standing firmly in your values, and moving with purpose.",
              ],
            },
            {
              title: "The Swirls — The Journey of Becoming",
              body: [
                "Within the triangle, the flowing black forms evoke movement, complexity, and transformation. They represent the journey of becoming — the experiences that shape us, the challenges that test us, and the decisions that move us forward.",
                "Life rarely follows a perfect path. We grow through change, discover strength through adversity, and find new possibilities in unexpected places.",
                "The journey is not always straightforward, but every experience can contribute to who we become.",
              ],
              strong: "You are a work in progress, not a finished product.",
            },
            {
              title: "The Gold Centre — The Value Within",
              body: [
                "At the heart of the emblem lies gold.",
                "Gold represents value, distinction, and the potential that exists within every individual. It reminds us that our worth is not determined solely by external recognition, trends, or the expectations of others.",
                "There is something uniquely yours to develop, express, and contribute to the world.",
                "The challenge is not to become a copy of someone else's success. It is to discover your own identity and have the courage to live it.",
              ],
            },
            {
              title: "Limitless Next Generation — Beyond What Was",
              body: [
                "Limitless is a mindset: the courage to question boundaries, explore possibilities, and refuse to let present circumstances dictate future potential.",
                "Next Generation is a responsibility: to learn from what came before, build upon it, and create something better for those who follow.",
                "Together, they represent a commitment to continuous evolution — not simply to be different for the sake of difference, but to move forward with intention, originality, and purpose.",
              ],
            },
            {
              title: "More Than What You Wear",
              body: [
                "LNXN is a fashion and lifestyle brand, but the philosophy extends beyond clothing.",
                "What you wear can express something about what you believe. It can communicate confidence without demanding attention, individuality without seeking permission, and ambition without losing authenticity.",
                "We create for those who choose their own path, value their individuality, and understand that becoming is a lifelong journey.",
                "You do not have to fit every mould. You do not have to follow every trend. And you do not have to remain who you were yesterday.",
              ],
              strong: "You can grow. You can build. You can become.",
            },
          ].map((s) => (
            <Reveal key={s.title} className="mt-12">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-gold-light">
                {s.title}
              </h3>
              <div className="mt-4 space-y-5 leading-relaxed text-white/65">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {s.strong && (
                  <p>
                    <strong className="text-white">{s.strong}</strong>
                  </p>
                )}
              </div>
            </Reveal>
          ))}

          <Reveal className="mt-16 border-t border-line pt-12 text-center">
            <p className="display text-xl md:text-2xl">
              LNXN — Limitless Next Generation.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-gold-light">
              Timeless. Bold. You.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
