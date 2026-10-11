"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products, productImages, formatPrice } from "@/lib/catalog";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQ("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const term = q.trim().toLowerCase();
  const results = term
    ? products
        .filter((p) =>
          [p.name, p.garment, p.audience, p.line]
            .join(" ")
            .toLowerCase()
            .includes(term),
        )
        .slice(0, 6)
    : [];

  function close() {
    setOpen(false);
    setQ("");
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close search" : "Search products"}
        className="p-2 text-white/80 transition-colors hover:text-gold-light"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={close}
            aria-hidden
          />
          <div className="absolute inset-x-0 top-full z-50 border-b border-line bg-ink shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tees, hoodies, crews…"
                aria-label="Search products"
                className="w-full border border-line bg-coal px-4 py-3 text-sm outline-none placeholder:text-smoke focus:border-gold"
              />
              {term && (
                <div className="mt-2">
                  {results.length === 0 ? (
                    <p className="px-1 py-4 text-sm text-smoke">
                      No products match &ldquo;{q.trim()}&rdquo;.
                    </p>
                  ) : (
                    <ul>
                      {results.map((p) => {
                        const img = productImages(p)[0];
                        return (
                          <li key={p.slug}>
                            <Link
                              href={`/product/${p.slug}`}
                              onClick={close}
                              className="flex items-center gap-4 px-1 py-3 transition-colors hover:bg-coal"
                            >
                              {img && (
                                <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-coal">
                                  <Image
                                    src={img}
                                    alt=""
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold">
                                  {p.name}
                                </span>
                                <span className="block text-xs uppercase tracking-[0.18em] text-smoke">
                                  {p.audience} · {p.garment}
                                </span>
                              </span>
                              <span className="text-sm font-bold text-gold-light">
                                {formatPrice(p.price)}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
