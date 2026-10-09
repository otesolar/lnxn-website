"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/lnxn-mark-gold.png"
                alt=""
                width={34}
                height={34}
                className="h-8 w-8 object-contain"
              />
              <span className="display text-2xl">LNXN</span>
            </div>
            <p className="eyebrow mt-4">Timeless. Bold. You.</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">
              Premium essentials designed to outlast trends — tees, hoodies and
              crews for men, women and kids.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Shop
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li><Link href="/shop" className="hover:text-gold-light">Shop All</Link></li>
              <li><Link href="/shop?audience=Men" className="hover:text-gold-light">Men</Link></li>
              <li><Link href="/shop?audience=Women" className="hover:text-gold-light">Women</Link></li>
              <li><Link href="/shop?audience=Kids" className="hover:text-gold-light">Kids</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Brand
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li><Link href="/story" className="hover:text-gold-light">Our Story</Link></li>
              <li><Link href="/lookbook" className="hover:text-gold-light">Lookbook</Link></li>
              <li><Link href="/shop?line=Core" className="hover:text-gold-light">Core Collection</Link></li>
              <li><Link href="/shop?line=Heritage" className="hover:text-gold-light">Heritage Collection</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Stay in the loop
            </h3>
            {done ? (
              <p className="mt-5 text-sm text-gold-light">
                You&apos;re on the list. Welcome to LNXN.
              </p>
            ) : (
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setDone(true);
                }}
              >
                <div className="flex border border-line focus-within:border-gold">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-smoke"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-gold px-5 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-gold-light"
                  >
                    Join
                  </button>
                </div>
                <p className="mt-3 text-xs text-smoke">
                  Drops, restocks and stories. No spam.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 select-none overflow-hidden" aria-hidden>
          <p className="display text-center text-[18vw] leading-none text-white/[0.045] md:text-[11rem]">
            LNXN
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-smoke md:flex-row">
          <p>© {year} LNXN. All rights reserved.</p>
          <p className="uppercase tracking-[0.25em]">Timeless · Bold · You</p>
        </div>
      </div>
    </footer>
  );
}
