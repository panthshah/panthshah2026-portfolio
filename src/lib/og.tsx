import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { idleBotSvg } from "@/lib/bot/idle";

/**
 * The picture a link to the site shows when it is pasted somewhere (LinkedIn, X, Messages): 1200 × 630, built at
 * deploy time. The page's own title in the site's title face, who it is by, and the character.
 * The fonts are files here because the picture is drawn outside the browser (Bricolage is the same cut the site uses,
 * as a .ttf; Geist is the regular and medium weights).
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#111213", MUTED = "#6b6e73", PAGE = "#ffffff", RULE = "#e7e7e4", AVATAR = "#fff5d6";
const font = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

export async function shareImage({ title, label, accent = INK }: { title: string; label?: string; accent?: string }) {
  const [bricolage, geist, geistMedium] = await Promise.all([font("bricolage-500-display.ttf"), font("geist-400.ttf"), font("geist-500.ttf")]);
  const bot = `data:image/svg+xml;base64,${Buffer.from(idleBotSvg("nav")).toString("base64")}`;
  const long = title.length > 70;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: PAGE, color: INK, fontFamily: "Geist" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 72, height: 72, borderRadius: 36, background: AVATAR, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- drawn into a picture, not a page */}
            <img src={bot} width={72} height={72} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 28, fontWeight: 500 }}>Panth Shah</div>
            <div style={{ fontSize: 24, color: MUTED }}>Designer at Samsung</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {label && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, fontWeight: 500, color: MUTED }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: accent }} />
              {label}
            </div>
          )}
          <div style={{ fontFamily: "Bricolage", fontSize: long ? 48 : 68, lineHeight: 1.15, letterSpacing: "-0.025em", maxWidth: 1000 }}>{title}</div>
          <div style={{ display: "flex", borderTop: `2px solid ${RULE}`, paddingTop: 24, fontSize: 24, color: MUTED }}>panthshah.work</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 500, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
        { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
