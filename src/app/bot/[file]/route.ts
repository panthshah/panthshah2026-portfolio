// The character's first frame as an SVG file (/bot/idle-nav.svg, /bot/idle-full.svg), built once at deploy time.
// The page shows it as a plain image until the animation engine takes over, so the drawing isn't repeated in every
// page's HTML and hydration data. The URL carries a hash of the rig, so it can be cached for good.
import { idleBotSvg } from "@/lib/bot/idle";

export const dynamic = "force-static";

const FILES = { "idle-nav.svg": "nav", "idle-full.svg": "full" } as const;

export function generateStaticParams() {
  return Object.keys(FILES).map((file) => ({ file }));
}

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const view = FILES[file as keyof typeof FILES];
  if (!view) return new Response("Not found", { status: 404 });
  return new Response(idleBotSvg(view), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
