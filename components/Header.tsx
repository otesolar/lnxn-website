"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import SocialLinks from "./SocialLinks";

const NAV = [
  { label: "Shop All", href: "/shop" },
  { label: "Men", href: "/shop?audience=Men" },
  { label: "Women", href: "/shop?audience=Women" },
  { label: "Kids", href: "/shop?audience=Kids" },
  { label: "Our Story", href: "/story" },
  { label: "Lookbook", href: "/lookbook" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-gold py-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.3em] text-black">
        Timeless. Bold. You.
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="LNXN home">
            <Image
              src="/brand/lnxn-mark.png"
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 object-contain"
            />
            <span className="display text-xl tracking-wide">LNXN</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/80 transition-colors hover:text-gold-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/80 transition-colors hover:text-gold-light"
              aria-label={`Open cart, ${count} items`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 7h15l-1.5 9h-12z" />
                <path d="M6 7l-1-4H2" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.65rem] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
            <button
              className="p-2 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-line bg-ink px-4 py-4 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/85 hover:text-gold-light"
              >
                {item.label}
              </Link>
            ))}
            <SocialLinks className="mt-4 pb-2" />
          </nav>
        )}
      </header>
    </>
  );
}
