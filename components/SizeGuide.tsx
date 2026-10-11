"use client";

import { useEffect, useState } from "react";
import type { SizeChart } from "@/lib/size-charts";

function ChartTable({ chart }: { chart: SizeChart }) {
  const measures: { label: string; key: "width" | "length" | "sleeve" }[] = [
    { label: "Width (in)", key: "width" },
    { label: "Length (in)", key: "length" },
    { label: "Sleeve (in)", key: "sleeve" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-coal p-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-smoke" />
            {chart.sizes.map((s) => (
              <th
                key={s}
                className="border-b border-line p-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-gold-light"
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measures.map((m) => (
            <tr key={m.key} className="border-b border-line/50 last:border-0">
              <td className="sticky left-0 bg-coal p-3 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                {m.label}
              </td>
              {chart.rows.map((r) => (
                <td key={r.size} className="p-3 text-center text-white/85">
                  {r[m.key].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuide({
  chart,
  garmentLabel,
}: {
  chart: SizeChart | null;
  garmentLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gold-light underline underline-offset-4 hover:text-gold"
      >
        Size guide
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-line bg-coal p-6 md:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Size guide</p>
                <h2 className="display mt-2 text-xl md:text-2xl">
                  {chart ? chart.title : garmentLabel}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close size guide"
                className="border border-line px-3 py-2 text-sm text-white/70 hover:border-gold hover:text-gold-light"
              >
                ✕
              </button>
            </div>

            {chart ? (
              <>
                <ChartTable chart={chart} />
                <p className="mt-5 text-xs leading-relaxed text-white/50">
                  Garments measured flat in inches. Width is armpit to armpit,
                  length is top to hem, sleeve is measured from center back.
                  Allow ±1–1.5 in tolerance. When between sizes, size down for
                  a classic fit or up for an oversized look.
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-white/65">
                The {garmentLabel} is a cropped, modern fit. It runs true to
                size with a shorter body — size up if you prefer a relaxed,
                less cropped feel.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
