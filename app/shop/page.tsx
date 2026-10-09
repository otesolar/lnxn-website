"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  products,
  type Audience,
  type Garment,
  type Line,
} from "@/lib/catalog";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const AUDIENCES: ("All" | Audience)[] = ["All", "Men", "Women", "Kids"];
const LINES: ("All" | Line)[] = ["All", "Core", "Heritage"];
const GARMENTS: ("All" | Garment)[] = ["All", "Tee", "Hoodie", "Crew", "Cropped Hoodie"];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-colors ${
        active
          ? "bg-gold text-black"
          : "border border-line text-white/70 hover:border-gold hover:text-gold-light"
      }`}
    >
      {children}
    </button>
  );
}

function ShopGrid() {
  const params = useSearchParams();
  const [audience, setAudience] = useState<"All" | Audience>(
    (params.get("audience") as Audience) || "All",
  );
  const [line, setLine] = useState<"All" | Line>(
    (params.get("line") as Line) || "All",
  );
  const [garment, setGarment] = useState<"All" | Garment>("All");
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (audience === "All" || p.audience === audience) &&
        (line === "All" || p.line === line) &&
        (garment === "All" || p.garment === garment),
    );
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [audience, line, garment, sort]);

  return (
    <>
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-smoke">
            Who
          </p>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <Pill key={a} active={audience === a} onClick={() => setAudience(a)}>
                {a}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-smoke">
            Collection
          </p>
          <div className="flex flex-wrap gap-2">
            {LINES.map((l) => (
              <Pill key={l} active={line === l} onClick={() => setLine(l)}>
                {l}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-smoke">
            Style
          </p>
          <div className="flex flex-wrap gap-2">
            {GARMENTS.map((g) => (
              <Pill key={g} active={garment === g} onClick={() => setGarment(g)}>
                {g}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-y border-line py-4">
        <p className="text-sm text-smoke">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        <label className="flex items-center gap-3 text-sm text-smoke">
          <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.3em] sm:inline">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-line bg-coal px-3 py-2 text-sm text-white outline-none focus:border-gold"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-smoke">
          Nothing matches those filters — try widening your selection.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 8) * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <p className="eyebrow">The full range</p>
      <h1 className="display mt-3 text-4xl md:text-6xl">Shop LNXN</h1>
      <div className="gold-rule mt-6" />
      <div className="mt-10">
        <Suspense fallback={<p className="text-smoke">Loading…</p>}>
          <ShopGrid />
        </Suspense>
      </div>
    </div>
  );
}
