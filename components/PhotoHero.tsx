"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Point this at "/brand/hero.mp4" once a hero video is provided.
// Until then the hero uses the campaign photograph.
const HERO_VIDEO_SRC: string | null = null;

function Rise({  mounted,
  delay,
  children,
  className = "",
}: {
  mounted: boolean;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function PhotoHero() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    setMounted(true);
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const bgShift = Math.min(scrollY * 0.22, 260);
  const contentShift = Math.min(scrollY * 0.1, 140);
  const fade = Math.max(0, 1 - scrollY / 700);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Background: video when available, photograph otherwise */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${bgShift}px) scale(1.06)` }}
        aria-hidden
      >
        {HERO_VIDEO_SRC && !reducedMotion ? (
          <video
            className="h-full w-full object-cover object-[30%_50%] md:object-center"
            src={HERO_VIDEO_SRC}
            poster="/brand/hero-bg.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <div style={{ animation: "slow-zoom 30s ease-in-out infinite alternate" }} className="h-full w-full">
            <Image
              src="/brand/hero-bg.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[30%_50%] md:object-center"
            />
          </div>
        )}
      </div>

      {/* Legibility gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.36) 30%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0) 80%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: "rgba(0,0,0,0.30)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink via-ink/40 to-transparent"
        aria-hidden
      />

      {/* Film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Copy */}
      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-10"
        style={{ transform: `translateY(${contentShift}px)`, opacity: fade }}
      >
        <div className="max-w-2xl">
          <Rise mounted={mounted} delay={350}>
            <p className="eyebrow">Limitless Next Generation</p>
          </Rise>
          <Rise mounted={mounted} delay={550}>
            <h1 className="display mt-4 text-[clamp(2.6rem,11vw,6rem)] leading-[0.95]">
              Limitless
              <br />
              Next
              <br />
              Generation<span className="text-gold">.</span>
            </h1>
          </Rise>
          <Rise mounted={mounted} delay={750} className="hidden md:block">
            <p className="mt-5 max-w-md leading-relaxed text-white/70">
              Not everyone is built for what comes next. LNXN is clothing for
              those who are.
            </p>
          </Rise>
          <Rise mounted={mounted} delay={950}>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/shop?audience=Men" className="btn btn-gold">
                Shop Men
              </Link>
              <Link href="/shop?audience=Women" className="btn btn-outline">
                Shop Women
              </Link>
            </div>
          </Rise>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className={`absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-opacity delay-1500 duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
