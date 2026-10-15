import type { Audience, Garment } from "./catalog";

/** Garment measurements in inches, taken flat. Source: thelnxn.com size tables. */
export interface SizeChart {
  title: string;
  sizes: string[];
  /** width = armpit to armpit, length = top to hem, sleeve = from center back */
  rows: { size: string; width: number; length: number; sleeve: number }[];
}

const adultHoodie: SizeChart = {
  title: "Adult Hoodie",
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  rows: [
    { size: "S", width: 20.08, length: 27.17, sleeve: 33.5 },
    { size: "M", width: 22.05, length: 27.95, sleeve: 34.5 },
    { size: "L", width: 24.02, length: 29.13, sleeve: 35.5 },
    { size: "XL", width: 25.98, length: 29.92, sleeve: 36.5 },
    { size: "2XL", width: 27.99, length: 31.1, sleeve: 37.5 },
    { size: "3XL", width: 29.92, length: 31.89, sleeve: 38.5 },
  ],
};

const kidsHoodie: SizeChart = {
  title: "Kids' Hoodie",
  sizes: ["S", "M", "L", "XL"],
  rows: [
    { size: "S", width: 16.93, length: 21.26, sleeve: 26.5 },
    { size: "M", width: 18.11, length: 22.44, sleeve: 27.76 },
    { size: "L", width: 18.9, length: 24.02, sleeve: 30.24 },
    { size: "XL", width: 20.08, length: 25.59, sleeve: 32.99 },
  ],
};

const adultCrew: SizeChart = {
  title: "Adult Crewneck",
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  rows: [
    { size: "S", width: 20.0, length: 27.0, sleeve: 33.5 },
    { size: "M", width: 22.01, length: 28.0, sleeve: 34.5 },
    { size: "L", width: 24.0, length: 29.0, sleeve: 35.5 },
    { size: "XL", width: 26.0, length: 30.0, sleeve: 36.5 },
    { size: "2XL", width: 28.0, length: 31.0, sleeve: 37.5 },
    { size: "3XL", width: 30.0, length: 32.0, sleeve: 38.5 },
  ],
};

const kidsCrew: SizeChart = {
  title: "Kids' Crewneck",
  sizes: ["XS", "S", "M", "L", "XL"],
  rows: [
    { size: "XS", width: 16.0, length: 19.75, sleeve: 23.5 },
    { size: "S", width: 17.0, length: 21.25, sleeve: 26.5 },
    { size: "M", width: 18.0, length: 22.5, sleeve: 27.75 },
    { size: "L", width: 19.0, length: 24.0, sleeve: 30.25 },
    { size: "XL", width: 20.0, length: 25.5, sleeve: 33.0 },
  ],
};

const adultTee: SizeChart = {
  title: "Adult Tee",
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  rows: [
    { size: "S", width: 18.0, length: 28.0, sleeve: 15.1 },
    { size: "M", width: 20.0, length: 29.0, sleeve: 16.5 },
    { size: "L", width: 22.0, length: 30.0, sleeve: 18.0 },
    { size: "XL", width: 24.0, length: 31.0, sleeve: 19.5 },
    { size: "2XL", width: 26.0, length: 32.0, sleeve: 21.0 },
    { size: "3XL", width: 28.0, length: 33.0, sleeve: 22.4 },
  ],
};

const kidsTee: SizeChart = {
  title: "Kids' Tee",
  sizes: ["XS", "S", "M", "L", "XL"],
  rows: [
    { size: "XS", width: 16.14, length: 20.47, sleeve: 13.39 },
    { size: "S", width: 16.93, length: 22.05, sleeve: 14.17 },
    { size: "M", width: 18.11, length: 23.62, sleeve: 15.35 },
    { size: "L", width: 18.9, length: 25.2, sleeve: 16.14 },
    { size: "XL", width: 20.08, length: 26.38, sleeve: 17.32 },
  ],
};

const croppedHoodieChart: SizeChart = {
  title: "Cropped Hoodie",
  sizes: ["XS", "S", "M", "L"],
  rows: [
    { size: "XS", width: 20.0, length: 17.5, sleeve: 20.5 },
    { size: "S", width: 22.0, length: 18.5, sleeve: 21.0 },
    { size: "M", width: 24.0, length: 19.25, sleeve: 21.5 },
    { size: "L", width: 26.0, length: 20.25, sleeve: 22.0 },
  ],
};

/** Returns the measurement chart for a product, or null when none is published. */
export function getSizeChart(
  garment: Garment,
  audience: Audience,
): SizeChart | null {
  if (garment === "Cropped Hoodie") return croppedHoodieChart;
  if (audience === "Kids") {
    if (garment === "Hoodie") return kidsHoodie;
    if (garment === "Crew") return kidsCrew;
    return kidsTee;
  }
  if (garment === "Hoodie") return adultHoodie;
  if (garment === "Crew") return adultCrew;
  return adultTee;
}

/** Orderable sizes for a product, matching what the chart covers. */
export function getSizes(garment: Garment, audience: Audience): string[] {
  if (garment === "Cropped Hoodie") return ["XS", "S", "M", "L"];
  const chart = getSizeChart(garment, audience);
  return chart ? chart.sizes : ["S", "M", "L", "XL", "2XL"];
}
