import { ImageResponse } from "next/og";
import { fromCombo, cleanName } from "@/lib/names";
import { SITE_URL } from "@/lib/site";
import { Fan } from "@/components/Fan";

export const runtime = "edge";

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

function fitSize(text: string, max: number, widthPx: number) {
  // Keep long generated names inside the card on every viewport.
  return Math.min(max, Math.max(48, Math.floor(widthPx / (text.length * 0.58))));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = fromCombo(searchParams.get("c") ?? "");
  const who = cleanName(searchParams.get("n"));
  const host = new URL(SITE_URL).host;

  const frame = (children: React.ReactNode) => (
    <div
      style={{
        width: W, height: H, display: "flex", background: C.paper, padding: 28,
        color: C.ink, fontFamily: "sans-serif",
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
    <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: C.muted, textTransform: "uppercase" }}>
      {text}
    </div>
  );

  const footer = (left: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", fontSize: 22, color: C.ink }}>
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
          <div style={{ display: "flex", fontSize: 42, color: C.pumpkin, marginTop: 40 }}>
            {who ? `${who} is now` : "My new name is"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
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
          <div style={{ display: "flex", fontSize: 34, color: C.pumpkin, marginTop: 24 }}>
            First letter of your name + second digit of your age.
          </div>
          {footer("Spin the reels. Post your card.")}
        </div>
      );

  return new ImageResponse(body, {
    width: W,
    height: H,
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
  });
}
