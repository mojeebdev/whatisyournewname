import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fromCombo, cleanName } from "@/lib/names";
import { SITE_URL } from "@/lib/site";
import { Fan } from "@/components/Fan";

export const runtime = "nodejs";

const W = 1200;
const H = 630;
const C = {
  paper: "#F4EBDD",
  ink: "#2A1810",
  cranberry: "#7A1E2C",
  pumpkin: "#C2471F",
  gold: "#E8B04A",
  muted: "#7B6A5C",
};

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 500 | 700 | 900; style: "normal" | "italic" }[]> | null = null;
function loadFonts() {
  fontsPromise ??= (async () => {
    const dir = join(process.cwd(), "assets/fonts");
    const [f900, f700i, mono] = await Promise.all([
      readFile(join(dir, "fraunces-latin-900-normal.woff")),
      readFile(join(dir, "fraunces-latin-700-italic.woff")),
      readFile(join(dir, "dm-mono-latin-500-normal.woff")),
    ]);
    return [
      { name: "Fraunces", data: f900, weight: 900 as const, style: "normal" as const },
      { name: "Fraunces", data: f700i, weight: 700 as const, style: "italic" as const },
      { name: "DM Mono", data: mono, weight: 500 as const, style: "normal" as const },
    ];
  })();
  return fontsPromise;
}

function fitSize(text: string, max: number, widthPx: number) {
  // Fraunces Black averages ~0.58em per glyph.
  return Math.min(max, Math.floor(widthPx / (text.length * 0.58)));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = fromCombo(searchParams.get("c") ?? "");
  const who = cleanName(searchParams.get("n"));
  const host = SITE_URL.replace(/^https?:\/\//, "");
  const fonts = await loadFonts();

  const frame = (children: React.ReactNode) => (
    <div
      style={{
        width: W, height: H, display: "flex", background: C.paper, padding: 28,
        fontFamily: "Fraunces", color: C.ink,
      }}
    >
      <div
        style={{
          flex: 1, display: "flex", flexDirection: "column", position: "relative",
          border: `3px solid ${C.ink}`, borderRadius: 28, padding: "44px 56px", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -70, top: -18, display: "flex", opacity: 0.95 }}>
          <Fan size={420} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      </div>
    </div>
  );

  const label = (text: string) => (
    <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 24, letterSpacing: 3, color: C.muted, textTransform: "uppercase" }}>
      {text}
    </div>
  );

  const footer = (left: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", fontFamily: "DM Mono", fontSize: 24, color: C.ink }}>
      <div style={{ display: "flex" }}>{left}</div>
      <div style={{ display: "flex", background: C.ink, color: C.paper, padding: "10px 18px", borderRadius: 999 }}>
        {host}
      </div>
    </div>
  );

  const body = result
    ? frame(
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {label("What is your new name?")}
          <div style={{ display: "flex", fontStyle: "italic", fontWeight: 700, fontSize: 44, color: C.pumpkin, marginTop: 40 }}>
            {who ? `${who} is now` : "My new name is"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
            <div style={{ display: "flex", fontWeight: 900, fontSize: fitSize(result.first, 132, 680), lineHeight: 1, color: C.cranberry }}>
              {result.first}
            </div>
            <div style={{ display: "flex", fontWeight: 900, fontSize: fitSize(result.last, 132, 1040), lineHeight: 1.05, color: C.ink }}>
              {result.last}
            </div>
          </div>
          {footer(`${result.letter} = ${result.first} · ${result.digit} = ${result.last}`)}
        </div>
      )
    : frame(
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {label("A Thanksgiving name game")}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 56, fontWeight: 900, fontSize: 116, lineHeight: 0.98 }}>
            <div style={{ display: "flex", color: C.cranberry }}>What is your</div>
            <div style={{ display: "flex" }}>new name?</div>
          </div>
          <div style={{ display: "flex", fontStyle: "italic", fontWeight: 700, fontSize: 38, color: C.pumpkin, marginTop: 24 }}>
            First letter of your name + second digit of your age.
          </div>
          {footer("Spin the reels. Post your card.")}
        </div>
      );

  return new ImageResponse(body, {
    width: W,
    height: H,
    fonts,
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
  });
}
