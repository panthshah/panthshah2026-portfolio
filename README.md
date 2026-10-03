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
| Corners | 4 · 8 · 12 · 24 · pill | `rounded-sm` · `rounded-md` · `rounded-lg` · `rounded-xl` · `rounded-full` |
| Colour | page, ink, muted, faint, rule, hover, slot, accent, on-accent | `text-ink`, `bg-slot`, `border-rule` … |
| Fonts | Bricolage Grotesque (titles), Geist, Geist Mono | `font-title`, `font-sans`, `font-mono` |

A class that isn't on the scale (`gap-11`, `text-xl`) generates nothing, and arbitrary values (`gap-[13px]`) fail `npm run check:tokens`.
To add a step, add it to `globals.css` and this table, not to one component.

## Quality bar

- Every page is pre-rendered as static HTML.
- Lighthouse 95+ on mobile and desktop, no layout shift.
- Checked at 375, 768, 1024, 1440 and 1920px, on a real iPhone and Android phone.
- Keyboard navigation, visible focus, AA contrast or better, and reduced motion respected.
- Every old URL keeps working (see `redirects` in `next.config.ts`).
