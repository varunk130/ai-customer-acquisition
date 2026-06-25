import Link from "next/link";
import type { ReactNode } from "react";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="14" cy="14" r="3" fill="#FFC24B" />
        <path d="M14 7.5a6.5 6.5 0 0 1 6.5 6.5M14 4a10 10 0 0 1 10 10" stroke="#FFC24B" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 20.5A6.5 6.5 0 0 1 7.5 14M14 24A10 10 0 0 1 4 14" stroke="#7AA2FF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      </svg>
      {showText && <span className="font-display text-[17px] font-semibold tracking-tight text-white">Beacon</span>}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`container-px py-16 sm:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function Stat({ value, label, tone = "default" }: { value: ReactNode; label: ReactNode; tone?: "default" | "beacon" | "indigo" }) {
  const toneClass = tone === "beacon" ? "text-beacon" : tone === "indigo" ? "text-indigo2" : "text-white";
  return (
    <div className="panel-quiet px-4 py-3.5">
      <div className={`font-display text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

export function CTA({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Link href={href} className={variant === "primary" ? "btn-primary" : "btn-ghost"}>
      {children}
    </Link>
  );
}

export function TagPill({ children, accent = "beacon" }: { children: ReactNode; accent?: "beacon" | "indigo" | "violet" }) {
  const map = {
    beacon: "border-beacon/30 bg-beacon/10 text-beacon",
    indigo: "border-indigo2/30 bg-indigo2/10 text-indigo2",
    violet: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${map[accent]}`}>
      {children}
    </span>
  );
}
