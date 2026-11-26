# What Is Your New Name? 🦃

A Thanksgiving name game. **First letter of your name + second digit of your age = your new name.** Spin the reels, get a card, post it to X.

- Slot-machine reveal (reduced-motion aware)
- Every result has its own share URL (`/n/m9?n=Ada`) that unfurls on X as a large image card
- The card PNG is generated on the fly at `/api/card?c=m9&n=Ada` (1200×630, `next/og`)
- **Save card** uses the phone's native share sheet when it can (so the image can go straight into an X post), and downloads the PNG otherwise
- 260 possible names; the full chart is on the page

## Stack

Next.js 16 (App Router) · TypeScript · `next/og` (Satori) · Fraunces + DM Mono via Fontsource. No database: results are worked out from the URL.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (Vercel)

1. Import the repo into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://newname.mojeeb.xyz`). Without it, Vercel's production domain is used.
3. Deploy, then paste a result link into the [X Card Validator](https://cards-dev.x.com/validator) or a draft post to check the preview.

## How sharing to X works

X's post intent can't attach images, so **Post to X** shares the result link and X pulls the card from that page's `og:image` / `twitter:image` tags. To post the image directly instead, tap **Save card** and attach it.

## Files

| Path | What it is |
|---|---|
| `lib/names.ts` | The chart and name logic |
| `app/Game.tsx` | The game UI (form → reels → reveal → share) |
| `app/n/[combo]/page.tsx` | Share landing page and X card meta tags |
| `app/api/card/route.tsx` | PNG card generator |
| `components/Fan.tsx` | Tail-feather fan motif (SVG, used in the UI and on the card) |
