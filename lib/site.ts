// Absolute base URL — X needs absolute og:image URLs.
// NEXT_PUBLIC_SITE_URL can override this at build/runtime; the production
// hostname is the safe default so previews never fall back to localhost/Vercel.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://newname.mojeeb.xyz"
).replace(/\/$/, "");

export const SITE_NAME = "What Is Your New Name?";
export const X_HANDLE = "@MojeebMotion";

export function resultPath(combo: string, name?: string) {
  const q = name ? `?n=${encodeURIComponent(name)}` : "";
  return `/n/${combo}${q}`;
}

export function cardPath(combo?: string, name?: string) {
  const p = new URLSearchParams();
  if (combo) p.set("c", combo);
  if (name) p.set("n", name);
  const q = p.toString();
  return `/api/card${q ? `?${q}` : ""}`;
}

export function xIntent(text: string, url: string) {
  const p = new URLSearchParams({ text, url });
  return `https://x.com/intent/post?${p.toString()}`;
}
