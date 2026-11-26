// The chart: first letter of your name → adjective, second digit of your age → title.
// Kept faithful to the original chart (yes, H & Y are both "Lucky", 1 & 7 are both "Turkey Legs").

export const FIRSTS: Record<string, string> = {
  A: "Sassy", B: "Grumpy", C: "Creepy", D: "Jolly",
  E: "Magical", F: "Fickle", G: "Kooky", H: "Lucky",
  I: "Salty", J: "Sweet", K: "Looney", L: "Silly",
  M: "Stinky", N: "Snazzy", O: "Curious", P: "Picky", Q: "Quiet",
  R: "Rowdy", S: "Jumpy", T: "Sour", U: "Unusual",
  V: "Vibrant", W: "Wistful", X: "Wild", Y: "Lucky", Z: "Bald",
};

export const LASTS: Record<string, string> = {
  "0": "Ice Ice Gravy",
  "1": "Turkey Legs",
  "2": "McStuffins",
  "3": "Egg Noggins",
  "4": "Featherbottom",
  "5": "Bird Brain",
  "6": "Turducken",
  "7": "Turkey Legs",
  "8": "McGobblers",
  "9": "Sir-Squeaks-A-Lot",
};

export const LETTERS = Object.keys(FIRSTS);
export const DIGITS = Object.keys(LASTS);

export type Result = {
  letter: string;
  digit: string;
  first: string;
  last: string;
  full: string;
  combo: string; // e.g. "m9" — used in share URLs
};

/** First A–Z letter of a name, accents stripped (É → E, Ö → O). */
export function firstLetter(name: string): string | null {
  const plain = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
  const m = plain.match(/[A-Z]/);
  return m ? m[0] : null;
}

/** "Second number in your age". Single-digit ages use their only digit. */
export function secondDigit(age: number): string | null {
  if (!Number.isInteger(age) || age < 1 || age > 120) return null;
  const s = String(age);
  return s.length >= 2 ? s[1] : s[0];
}

export function fromParts(letter: string, digit: string): Result | null {
  const L = letter.toUpperCase();
  const first = FIRSTS[L];
  const last = LASTS[digit];
  if (!first || !last) return null;
  return { letter: L, digit, first, last, full: `${first} ${last}`, combo: `${L.toLowerCase()}${digit}` };
}

export function fromCombo(combo: string): Result | null {
  const m = /^([a-zA-Z])(\d)$/.exec(combo ?? "");
  return m ? fromParts(m[1], m[2]) : null;
}

/** Display name shown on the card: trimmed, no control chars, max 24 chars. */
export function cleanName(raw: string | null | undefined): string {
  return (raw ?? "").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}
