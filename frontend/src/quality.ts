import { finite } from "./discovery";
import type { Capability } from "./types";
export type Band = "good" | "fair" | "poor" | "very_poor";
export const bandLabel: Record<Band, string> = { good: "Good", fair: "Fair", poor: "Poor", very_poor: "Very poor" };
export const bandSummary: Record<Band, string> = {
  good: "The air quality is looking good at this moment.",
  fair: "The air quality is fair. Your purifier is working on it.",
  poor: "The air quality is poor. Keep the purifier running.",
  very_poor: "The air quality is very poor. Consider a higher fan speed.",
};
const order: Band[] = ["good", "fair", "poor", "very_poor"];
interface Metric {
  label: string;
  hint: string;
  // Upper bound of the level bar and the upper limit of good, fair and poor.
  max?: number;
  limits?: [number, number, number];
  prefix?: string;
  suffix?: string;
}
export const PM25_GOOD_LIMIT = 12;
// PM2.5 uses US EPA breakpoints in µg/m³ (some Philips regions use 35/75/115);
// IAI 1–12 and gas L1–L4 follow the Philips device scales.
const metrics: Record<string, Metric> = {
  pm25: { label: "PM2.5", hint: "Fine particles", max: 100, limits: [PM25_GOOD_LIMIT, 35, 55] },
  indoor_allergen_index: {
    label: "Allergens",
    hint: "Indoor allergen index",
    max: 12,
    limits: [3, 6, 9],
    suffix: "/12",
  },
  gas_level: { label: "Gas", hint: "Gas index", max: 4, limits: [1, 2, 3], prefix: "L" },
  total_volatile_organic_compounds: { label: "TVOC", hint: "TVOC index" },
};
const display = ["pm25", "gas_level", "indoor_allergen_index", "total_volatile_organic_compounds"];
// Discovered readings follow the Philips app order; explicit lists keep theirs.
// Indoor comfort guidance commonly cited for relative humidity.
export function humidityComfort(c: Capability): string | undefined {
  const n = c.availability === "available" ? finite(c.state?.state) : undefined;
  if (n === undefined) return undefined;
  return n < 30 ? "Dry" : n > 60 ? "Humid" : "Comfortable";
}
export function byDisplayOrder(a: Capability, b: Capability): number {
  const rank = (c: Capability) => {
    const i = display.indexOf(c.key ?? "");
    return i === -1 ? display.length : i;
  };
  return rank(a) - rank(b);
}
export function metric(c: Capability): Metric | undefined {
  return metrics[c.key ?? ""] ?? (c.state?.attributes.device_class === "pm25" ? metrics.pm25 : undefined);
}
export function band(c: Capability): Band | undefined {
  const limits = metric(c)?.limits;
  const n = c.availability === "available" ? finite(c.state?.state) : undefined;
  if (!limits || n === undefined) return undefined;
  const index = limits.findIndex((limit) => n <= limit);
  return order[index === -1 ? 3 : index];
}
export function worst(bands: (Band | undefined)[]): Band | undefined {
  return bands.reduce<Band | undefined>(
    (a, b) => (b && (!a || order.indexOf(b) > order.indexOf(a)) ? b : a),
    undefined
  );
}
export function fraction(c: Capability): number | undefined {
  const max = metric(c)?.max;
  const n = c.availability === "available" ? finite(c.state?.state) : undefined;
  if (!max || n === undefined) return undefined;
  // Keep a visible sliver for the lowest level, as the Philips app does.
  return Math.max(0.06, Math.min(1, n / max));
}
