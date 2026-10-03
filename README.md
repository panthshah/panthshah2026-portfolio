# panthshah2026-portfolio

Panth Shah's portfolio, rebuilt in Next.js (App Router) + Tailwind CSS v4 and deployed on Vercel.
It replaces [panth-2025-portfolio](https://github.com/panthshah/panth-2025-portfolio), which stays live until this site is approved.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Before every commit

```bash
npm run check
```

This runs lint, the TypeScript check, the token check and a production build. All of them must pass.

## Design tokens

Every size comes from `src/app/globals.css`. Tailwind's default scales are switched off, so only these steps exist:

| Token | Steps | Classes |
|---|---|---|
| Spacing | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 | `p-1` … `p-10`, `gap-3`, `mt-5` … |
| Type | 36 · 24 · 18 · 16 · 14 · 12 | `text-36` … `text-12` |
| Corners | by role, see below | `rounded-tag` · `rounded-control` · `rounded-surface` · `rounded-sheet` · `rounded-full` |
| Colour | page, ink, muted, faint, rule, hover, slot, accent, on-accent | `text-ink`, `bg-slot`, `border-rule` … |
| Fonts | Bricolage Grotesque (titles), Geist, Geist Mono | `font-title`, `font-sans`, `font-mono` |

### Corners

The same kind of element always gets the same corner:

| Role | Radius | Used for |
|---|---|---|
| `rounded-tag` | 4px | small labels, keys, chips inside a control |
| `rounded-control` | 8px | anything you click: nav links, sidebar rows, Try it, Done, Fold |
| `rounded-surface` | 12px | containers: the Fold stage, work tiles, footer tiles, panels |
| `rounded-sheet` | 24px | large overlays (none yet) |
| `rounded-full` | pill / circle | avatar, colour dots, live dot, pill buttons |

The mini interfaces drawn inside the work thumbnails are illustrations, not site controls, but they use the same scale.

A class that isn't on the scale (`gap-11`, `text-xl`) generates nothing, and arbitrary values (`gap-[13px]`) fail `npm run check:tokens`.
To add a step, add it to `globals.css` and this table, not to one component.

## Quality bar

- Every page is pre-rendered as static HTML.
- Lighthouse 95+ on mobile and desktop, no layout shift.
- Checked at 375, 768, 1024, 1440 and 1920px, on a real iPhone and Android phone.
- Keyboard navigation, visible focus, AA contrast or better, and reduced motion respected.
- Every old URL keeps working (see `redirects` in `next.config.ts`).

## The Galaxy Z Fold8

The phone is a self-contained three.js page in `public/fold/` (from the prototype's `fold-embed.html`), shown in a
same-origin frame by `src/components/fold/FoldStage.tsx`. It loads `three.min.js` (three 0.160.0) and Onest
(fontsource 5.3.1, OFL) from the same folder, so it makes no third-party requests.

- Desktop: the frame loads once the page is idle; phones and tablets show `poster-<colour>.webp` until **Try it**.
- The stills are renders of the live phone (open, `fold8.view(0.22, 0.16, 1.05)`), made with the page's
  `fold8.snapshot()` hook. If the phone changes, render them again the same way so the still and the live phone match.
