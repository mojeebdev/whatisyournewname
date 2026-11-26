import Link from "next/link";
import { Fan } from "@/components/Fan";

export default function NotFound() {
  return (
    <main className="shell shell--result">
      <header className="hero hero--small">
        <Fan size={160} />
        <p className="eyebrow">404</p>
        <h1>That turkey flew off.</h1>
      </header>
      <div className="actions actions--center">
        <Link className="btn btn--primary" href="/">Find your new name</Link>
      </div>
    </main>
  );
}
