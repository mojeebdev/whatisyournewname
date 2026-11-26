import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fromCombo, cleanName } from "@/lib/names";
import { SITE_NAME, X_HANDLE, cardPath } from "@/lib/site";
import { Fan } from "@/components/Fan";

type Props = {
  params: Promise<{ combo: string }>;
  searchParams: Promise<{ n?: string | string[] }>;
};

async function resolve({ params, searchParams }: Props) {
  const { combo } = await params;
  const sp = await searchParams;
  const result = fromCombo(combo);
  const who = cleanName(Array.isArray(sp.n) ? sp.n[0] : sp.n);
  return { result, who };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { result, who } = await resolve(props);
  if (!result) return { title: SITE_NAME };
  const title = who ? `${who} is now ${result.full}` : `My new name is ${result.full}`;
  const description = "First letter of your name + second digit of your age. What's yours?";
  const image = { url: cardPath(result.combo, who || undefined), width: 1200, height: 630, alt: title };
  return {
    title: `${title} · ${SITE_NAME}`,
    description,
    openGraph: { title, description, images: [image], type: "website" },
    twitter: { card: "summary_large_image", title, description, creator: X_HANDLE, images: [image] },
  };
}

export default async function ResultPage(props: Props) {
  const { result, who } = await resolve(props);
  if (!result) notFound();

  return (
    <main className="shell shell--result">
      <header className="hero hero--small">
        <Fan size={160} />
        <p className="eyebrow">{who ? `${who} is now` : "Someone is now"}</p>
        <h1 className="reveal__name">
          <span>{result.first}</span> {result.last}
        </h1>
      </header>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="reveal__card" src={cardPath(result.combo, who || undefined)} width={1200} height={630}
        alt={`${who ? `${who} is now ` : ""}${result.full}`} />
      <div className="actions actions--center">
        <Link className="btn btn--primary" href="/">Find your new name</Link>
      </div>
    </main>
  );
}
