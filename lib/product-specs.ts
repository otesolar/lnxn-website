import type { Audience, Garment } from "./catalog";

export interface ProductSpec {
  /** Internal reference only — never displayed (premium branding). */
  blank: string;
  fabric: string;
  composition: string;
  fit: string;
  print: string;
  care: string[];
}

const DTG = "DTG direct-to-garment print";

const adultHoodie: ProductSpec = {
  blank: "Gildan 18500",
  fabric: "8 oz/yd² heavyweight fleece",
  composition: "50% cotton / 50% polyester",
  fit: "Classic fit — true to size",
  print: DTG,
  care: [
    "Machine wash cold (max 30°C / 90°F)",
    "Tumble dry medium",
    "Cool iron if needed",
    "Do not dry clean",
    "Non-chlorine bleach as needed",
  ],
};

const kidsHoodie: ProductSpec = {
  ...adultHoodie,
  blank: "Gildan 18500B",
  fit: "Youth fit — true to size",
  care: [
    "Machine wash warm (max 40°C / 105°F)",
    "Tumble dry medium",
    "Do not dry clean",
    "Do not iron",
  ],
};

const adultCrew: ProductSpec = {
  blank: "Gildan 18000",
  fabric: "8 oz/yd² heavyweight fleece",
  composition: "50% cotton / 50% polyester",
  fit: "Classic fit — true to size",
  print: DTG,
  care: [
    "Machine wash cold (max 30°C / 90°F)",
    "Tumble dry low",
    "Do not iron",
    "Do not dry clean",
    "Non-chlorine bleach as needed",
  ],
};

const kidsCrew: ProductSpec = {
  ...adultCrew,
  blank: "Gildan 18000B",
  fit: "Youth fit — true to size",
  care: [
    "Machine wash cold (max 30°C / 90°F)",
    "Do not tumble dry",
    "Do not dry clean",
    "Do not iron",
    "Non-chlorine bleach as needed",
  ],
};

const adultTee: ProductSpec = {
  blank: "Gildan 5000",
  fabric: "5.3 oz/yd² midweight cotton",
  composition: "100% cotton (heather colorways are cotton/poly blends)",
  fit: "Classic fit — true to size",
  print: DTG,
  care: [
    "Machine wash cold",
    "Tumble dry low",
    "Do not bleach",
    "Do not iron directly on print",
  ],
};

const kidsTee: ProductSpec = {
  ...adultTee,
  blank: "Gildan 5000B",
  fit: "Youth fit — true to size",
  care: [
    "Machine wash warm (max 40°C / 105°F)",
    "Tumble dry medium",
    "Cool iron if needed",
    "Do not dry clean",
    "Non-chlorine bleach as needed",
  ],
};

const croppedHoodie: ProductSpec = {
  blank: "Lane Seven LS12000",
  fabric: "7.1 oz/yd² fleece",
  composition: "85% cotton / 15% polyester",
  fit: "Cropped, modern fit — size up for a relaxed feel",
  print: DTG,
  care: [
    "Machine wash cold (max 30°C / 90°F)",
    "Tumble dry low",
    "Do not bleach",
    "Do not iron",
    "Do not dry clean",
  ],
};

/** Factual manufacturing specs for a product. */
export function getProductSpec(
  garment: Garment,
  audience: Audience,
): ProductSpec {
  if (garment === "Cropped Hoodie") return croppedHoodie;
  if (audience === "Kids") {
    if (garment === "Hoodie") return kidsHoodie;
    if (garment === "Crew") return kidsCrew;
    return kidsTee;
  }
  if (garment === "Hoodie") return adultHoodie;
  if (garment === "Crew") return adultCrew;
  return adultTee;
}
