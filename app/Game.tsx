"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FIRSTS, LASTS, LETTERS, DIGITS, type Result,
  firstLetter, secondDigit, fromParts, cleanName,
} from "@/lib/names";
import { resultPath, cardPath, xIntent } from "@/lib/site";
import { Fan } from "@/components/Fan";

const FIRST_POOL = Array.from(new Set(Object.values(FIRSTS)));
const LAST_POOL = Array.from(new Set(Object.values(LASTS)));
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Phase = "form" | "spinning" | "done";

/* ---------- Reel ---------- */
function Reel({
  label, pool, target, spinKey, duration, onStop, tone,
}: {
  label: string; pool: string[]; target: string | null; spinKey: number;
  duration: number; onStop: () => void; tone: "cranberry" | "ink";
}) {
  const [strip, setStrip] = useState<string[]>(["? ? ?"]);
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(false);
  const last = useRef("? ? ?");
  const stopRef = useRef(onStop);
  stopRef.current = onStop;

  useEffect(() => {
    if (!spinKey || !target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const filler = Array.from({ length: 22 }, () => pick(pool));
    const next = [last.current, ...filler, target];
    last.current = target;
    setAnimate(false);
    setStrip(next);
    setPos(0);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        setAnimate(!reduce);
        setPos(next.length - 1);
      });
    });
    const t = setTimeout(() => stopRef.current(), reduce ? 50 : duration);
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="reel">
      <span className="reel__label">{label}</span>
      <div className={`reel__window reel__window--${tone}`} aria-live="polite">
        <div
          className="reel__strip"
          style={{
            transform: `translateY(calc(${-pos} * var(--reel-h)))`,
            transition: animate ? `transform ${duration}ms cubic-bezier(.15,.85,.2,1.02)` : "none",
          }}
        >
          {strip.map((w, i) => (
            <div className="reel__item" key={i} aria-hidden={i !== pos}>{w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Game ---------- */
export function Game() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [putName, setPutName] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<Result | null>(null);
  const [who, setWho] = useState("");
  const [spinKey, setSpinKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const stops = useRef(0);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const spin = useCallback((r: Result, displayName: string) => {
    setResult(r);
    setWho(displayName);
    setError(null);
    stops.current = 0;
    setPhase("spinning");
    setSpinKey((k) => k + 1);
    // Warm the card so it's ready the moment the reels land.
    const img = new Image();
    img.src = cardPath(r.combo, displayName || undefined);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const L = firstLetter(name);
    if (!L) return setError("Your name needs at least one letter from A to Z.");
    const D = secondDigit(Number(age));
    if (!D) return setError("Enter an age between 1 and 120.");
    const r = fromParts(L, D)!;
    spin(r, putName ? cleanName(name) : "");
  };

  const onRandom = () => spin(fromParts(pick(LETTERS), pick(DIGITS))!, "");

  const onStop = () => {
    stops.current += 1;
    if (stops.current >= 2) setPhase("done");
  };

  const shareUrl = () =>
    result ? `${window.location.origin}${resultPath(result.combo, who || undefined)}` : "";
  const shareText = () =>
    result ? `My Thanksgiving name is ${result.full} 🦃\n\nWhat's yours?` : "";
  const card = result ? cardPath(result.combo, who || undefined) : "";

  const onSaveCard = async () => {
    if (!result) return;
    try {
      const blob = await (await fetch(card)).blob();
      const file = new File([blob], `${result.full.replace(/\W+/g, "-").toLowerCase()}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${shareText()} ${shareUrl()}` });
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      flash("Card saved");
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") flash("Couldn't save the card — try again");
    }
  };

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(shareUrl()); flash("Link copied"); }
    catch { flash("Copy failed"); }
  };

  const reset = () => { setPhase("form"); };

  const number = result ? LETTERS.indexOf(result.letter) * 10 + Number(result.digit) + 1 : 0;

  return (
    <main className="shell">
      <header className="hero">
        <Fan size={240} spin={phase === "spinning"} />
        <p className="eyebrow">A Thanksgiving name game</p>
        <h1>
          <span>What is your</span> new name?
        </h1>
        <p className="lede">First letter of your name + the second digit of your age. Spin it, then post your card.</p>
      </header>

      <section className="machine" aria-label="Name reels">
        <Reel label="First letter" pool={FIRST_POOL} target={result?.first ?? null} spinKey={spinKey}
          duration={1700} onStop={onStop} tone="cranberry" />
        <Reel label="Age digit" pool={LAST_POOL} target={result?.last ?? null} spinKey={spinKey}
          duration={2600} onStop={onStop} tone="ink" />
      </section>

      {phase === "form" && (
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="fields">
            <label className="field">
              <span>First name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada"
                autoComplete="given-name" maxLength={40} required />
            </label>
            <label className="field field--age">
              <span>Age</span>
              <input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="34" inputMode="numeric" required />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" checked={putName} onChange={(e) => setPutName(e.target.checked)} />
            <span>Put my name on the card</span>
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary" type="submit">Spin my name</button>
          <button className="btn btn--ghost" type="button" onClick={onRandom}>Just spin a random one</button>
        </form>
      )}

      {phase === "spinning" && <p className="status">Gobbling…</p>}

      {phase === "done" && result && (
        <section className="reveal">
          <p className="reveal__meta">
            {who ? <><strong>{who}</strong>, you are now</> : "You got"} · name #{number} of 260
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="reveal__card" src={card} width={1200} height={630}
            alt={`Card: ${who ? `${who} is now ` : ""}${result.full}`} />
          <div className="actions">
            <a className="btn btn--x" href={xIntent(shareText(), shareUrl())} target="_blank" rel="noopener noreferrer">
              <XLogo /> Post to X
            </a>
            <button className="btn btn--primary" onClick={onSaveCard}>Save card</button>
            <button className="btn btn--ghost" onClick={onCopy}>Copy link</button>
            <button className="btn btn--ghost btn--wide" onClick={reset}>Play again</button>
          </div>
          <p className="hint">The link unfurls into your card on X. Want the image itself in the post? Save the card and attach it.</p>
        </section>
      )}

      <details className="chart">
        <summary>See the full chart</summary>
        <div className="chart__grid">
          <div>
            <h3>First letter of your name</h3>
            <ul className="chart__list chart__list--letters">
              {LETTERS.map((l) => <li key={l}><b>{l}</b>{FIRSTS[l]}</li>)}
            </ul>
          </div>
          <div>
            <h3>Second digit of your age</h3>
            <ul className="chart__list">
              {DIGITS.map((d) => <li key={d}><b>{d}</b>{LASTS[d]}</li>)}
            </ul>
          </div>
        </div>
      </details>

      <footer className="foot">
        Built by <a href="https://x.com/MojeebMotion" target="_blank" rel="noopener noreferrer">@MojeebMotion</a> ·{" "}
        <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer">BlindspotLab</a>
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function XLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
