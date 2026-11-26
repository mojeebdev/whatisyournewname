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

## Deploy to Cloudflare Workers

This app uses the OpenNext Cloudflare adapter. It must run as a Worker because the result pages and PNG card endpoint are dynamic. Do not configure it as a static Pages export.

### Local production preview

```bash
npm install
npm run preview
```

This builds the Next.js app for the Workers runtime and starts a local Wrangler preview.

### Deploy from your terminal

Authenticate Wrangler first, then run:

```bash
npx wrangler login
npm run deploy
```

The Worker name is `what-is-your-new-name`. Cloudflare will provide a `workers.dev` URL after the first deployment.

### Connect GitHub to Cloudflare

In Cloudflare, open **Workers & Pages → Create application → Workers → Import a repository**, select this repository, and configure the production branch as `main`. Use the repository's normal dependency installation and the `npm run deploy` build/deploy script. Keep the app on Workers Builds, not a static Pages project.

### Custom domain

After the first successful Worker deployment:

1. Open the Worker **what-is-your-new-name** in Cloudflare.
2. Open **Settings → Domains & Routes → Add → Custom Domain**.
3. Add `newname.mojeeb.xyz`. Cloudflare will provision the required DNS record and certificate because the domain is managed by Cloudflare.
4. Set `NEXT_PUBLIC_SITE_URL=https://newname.mojeeb.xyz` as a production build/runtime variable if you later change the hostname. The app already defaults to this hostname.

### X card verification

After deployment, test a result URL such as `https://newname.mojeeb.xyz/n/m9?n=Ada`. Its Open Graph and Twitter metadata should point to the dynamic `/api/card` PNG endpoint. Verify the preview with the [X Card Validator](https://cards-dev.x.com/validator) or a draft post.

## Files

| Path | What it is |
|---|---|
| `lib/names.ts` | The chart and name logic |
| `app/Game.tsx` | The game UI (form → reels → reveal → share) |
| `app/n/[combo]/page.tsx` | Share landing page and X card meta tags |
| `app/api/card/route.tsx` | PNG card generator |
| `components/Fan.tsx` | Tail-feather fan motif (SVG, used in the UI and on the card) |
| `wrangler.jsonc` | Cloudflare Worker configuration |
| `open-next.config.ts` | OpenNext Cloudflare adapter configuration |
