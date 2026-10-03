import { ensureContrast, mix, oklchToHex } from "@/lib/color";

export type ColourId = "pistachio" | "lavender" | "graphite" | "cream";

/** The Fold8's four colourways: the swatch, and the hue its panel is tinted with (graphite: almost no colour). */
export const COLOURWAYS: { id: ColourId; name: string; swatch: string; hue: number | null }[] = [
  { id: "pistachio", name: "Pistachio", swatch: "#A9CBC3", hue: 175 },
  { id: "lavender", name: "Lavender", swatch: "#C4BCDC", hue: 295 },
  { id: "graphite", name: "Graphite", swatch: "#3A3F42", hue: null },
  { id: "cream", name: "Cream", swatch: "#E8E1D1", hue: 75 },
];

/**
 * The panel's colours for a colourway, each one checked for contrast as it's made:
 * labels, Fold button, buy link ≥ 7:1 (AAA) · spec values, hint ≥ 4.5:1 (AA) · selected ring, dot rims ≥ 3:1 (non-text).
 */
export function panelTheme(id: ColourId, dark = false) {
  const c = COLOURWAYS.find((x) => x.id === id)!;
  const H = c.hue ?? 250, chroma = c.hue === null ? 0.12 : 1;
  const tone = (L: number, C: number) => oklchToHex(L, C * chroma, H);
  const toward = dark ? "#FFFFFF" : "#000000";
  const bg = dark ? tone(0.26, 0.03) : tone(0.965, 0.028);
  return {
    "--fs-bg": bg,
    "--fs-grid": mix(bg, tone(dark ? 0.7 : 0.6, 0.12), 0.35),
    "--fs-ink": ensureContrast(tone(dark ? 0.93 : 0.3, 0.07), bg, 7, toward),
    "--fs-muted": ensureContrast(tone(dark ? 0.8 : 0.48, 0.07), bg, 4.5, toward),
    "--fs-ring": ensureContrast(tone(dark ? 0.8 : 0.5, 0.1), bg, 3, toward),
    rims: Object.fromEntries(COLOURWAYS.map((d) => [d.id, ensureContrast(d.swatch, bg, 3, toward, 0.05)])) as Record<ColourId, string>,
  };
}
