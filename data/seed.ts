/**
 * Beacon — synthetic acquisition data seed for "Northwind", a fictional business-banking
 * product for startups. Deterministic (fixed seed) so `npm run seed` reproduces data/channels.json.
 *
 * Generates 90 days of daily performance across 5 channels, each with a fitted monthly
 * response curve signups(s) = cap * s / (s + half) — the real model the cac-model skill uses.
 */
import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BeaconData, ChannelDayRecord, ChannelKey, ChannelPerf, Competitor, Persona, Segment, SegmentKey } from "../src/lib/dataset-types";

const SEED = 71777;
const DAYS = 90;
const END_DATE = new Date("2026-06-15T00:00:00Z");
faker.seed(SEED);

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const jit = (spread: number) => 1 + (rand() - 0.5) * spread;
const round = (x: number) => Math.round(x);

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}
const START_DATE = addDays(END_DATE, -(DAYS - 1));

interface ChannelDef {
  key: ChannelKey;
  label: string;
  blurb: string;
  color: string;
  cap: number;
  half: number;
  qualRate: number;
  ltv: number;
  marginRate: number;
  segmentMix: Record<SegmentKey, number>;
  monthlySpend: number; // historical baseline
  cpc: number;
  ctr: number;
}

const CHANNELS: ChannelDef[] = [
  {
    key: "paid_search", label: "Paid search", blurb: "Google high-intent keywords (business banking, startup account)",
    color: "#7AA2FF", cap: 260, half: 40000, qualRate: 0.5, ltv: 6500, marginRate: 0.7,
    segmentMix: { vc_backed: 0.45, bootstrapped: 0.55 }, monthlySpend: 18000, cpc: 4.5, ctr: 0.045,
  },
  {
    key: "paid_social", label: "Paid social", blurb: "LinkedIn + X — founder & finance-lead targeting",
    color: "#B49CFF", cap: 520, half: 70000, qualRate: 0.42, ltv: 5200, marginRate: 0.68,
    segmentMix: { vc_backed: 0.5, bootstrapped: 0.5 }, monthlySpend: 22000, cpc: 6.0, ctr: 0.012,
  },
  {
    key: "content_seo", label: "Content / SEO", blurb: "Founder finance guides, runway calculators, comparison pages",
    color: "#5EEAD4", cap: 120, half: 8000, qualRate: 0.6, ltv: 7000, marginRate: 0.72,
    segmentMix: { vc_backed: 0.35, bootstrapped: 0.65 }, monthlySpend: 6000, cpc: 1.2, ctr: 0.08,
  },
  {
    key: "lifecycle_email", label: "Lifecycle email", blurb: "Nurture of existing leads & waitlist to activation",
    color: "#FFC24B", cap: 70, half: 2500, qualRate: 0.7, ltv: 5800, marginRate: 0.7,
    segmentMix: { vc_backed: 0.4, bootstrapped: 0.6 }, monthlySpend: 2000, cpc: 0.3, ctr: 0.22,
  },
  {
    key: "partnerships", label: "Partnerships", blurb: "Accelerators, VC platform teams, founder communities",
    color: "#F58E8E", cap: 180, half: 60000, qualRate: 0.66, ltv: 9500, marginRate: 0.74,
    segmentMix: { vc_backed: 0.7, bootstrapped: 0.3 }, monthlySpend: 9000, cpc: 12, ctr: 0.03,
  },
];

// Monthly response curve.
const signupsAt = (cap: number, half: number, s: number) => (cap * s) / (s + half);

const daily: ChannelDayRecord[] = [];

for (const ch of CHANNELS) {
  const dailySpendBase = ch.monthlySpend / 30;
  const monthlySignups = signupsAt(ch.cap, ch.half, ch.monthlySpend);
  const dailySignupsBase = monthlySignups / 30;
  // gentle upward trend over the quarter (channel maturing)
  for (let d = 0; d < DAYS; d++) {
    const date = addDays(START_DATE, d);
    const dow = date.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const trend = 1 + 0.12 * (d / (DAYS - 1));
    const seasonal = weekend ? (ch.key === "paid_social" ? 0.7 : 0.82) : 1.07;
    const spend = round(dailySpendBase * trend * seasonal * jit(0.16));
    const signups = Math.max(0, round(dailySignupsBase * trend * seasonal * jit(0.22)));
    const qualified = Math.max(0, round(signups * ch.qualRate * jit(0.12)));
    const clicks = Math.max(signups, round((spend / ch.cpc) * jit(0.1)));
    const impressions = round((clicks / ch.ctr) * jit(0.1));
    daily.push({ date: isoDate(date), dayIndex: d, channel: ch.key, spend, impressions, clicks, signups, qualified });
  }
}

const channels: ChannelPerf[] = CHANNELS.map((ch) => {
  const recs = daily.filter((r) => r.channel === ch.key);
  const spend90 = recs.reduce((s, r) => s + r.spend, 0);
  const signups90 = recs.reduce((s, r) => s + r.signups, 0);
  const qualified90 = Math.round(signups90 * ch.qualRate);
  const clicks90 = recs.reduce((s, r) => s + r.clicks, 0);
  const impressions90 = recs.reduce((s, r) => s + r.impressions, 0);
  return {
    key: ch.key, label: ch.label, blurb: ch.blurb, color: ch.color,
    cap: ch.cap, half: ch.half, qualRate: ch.qualRate, ltv: ch.ltv, marginRate: ch.marginRate,
    segmentMix: ch.segmentMix,
    spend90, signups90, qualified90, clicks90, impressions90,
    cac: Number((spend90 / signups90).toFixed(2)),
    qualifiedCac: Number((spend90 / qualified90).toFixed(2)),
  };
});

const segments: Segment[] = [
  { key: "vc_backed", label: "VC-backed", ltv: 8500, share: 0.45, blurb: "Raised institutional capital; spend faster, higher balances, team seats." },
  { key: "bootstrapped", label: "Bootstrapped", ltv: 4200, share: 0.55, blurb: "Revenue-funded; price-sensitive, sticky, lower but durable balances." },
];

const competitors: Competitor[] = [
  { name: "Contoso Bank", angle: "Incumbent small-business bank", weakness: "Slow onboarding, branch-era UX, nothing startup-specific." },
  { name: "Fabrikam Financial", angle: "Neobank for SMBs", weakness: "No runway view or cap-table-aware features; generic SMB positioning." },
  { name: "Zava Capital", angle: "VC-adjacent fintech", weakness: "High fees and gated behind a VC introduction." },
];

const personas: Persona[] = [
  { key: "founder", label: "Founder / CEO", role: "Economic buyer", jtbd: "Open an account in minutes, see runway in real time, move money without friction." },
  { key: "finance_lead", label: "Finance lead / Ops", role: "Champion & daily operator", jtbd: "Control spend, automate AP, and close the books faster." },
];

const data: BeaconData = {
  meta: {
    product: "Northwind",
    tagline: "The business bank built for founders.",
    generatedAt: new Date("2026-06-16T09:00:00Z").toISOString(),
    seed: SEED,
    days: DAYS,
    startDate: daily[0].date,
    endDate: daily[daily.length - 1].date,
    defaultBudget: 50000,
    defaultTargetCac: 650,
    icp: "Venture-backed and bootstrapped startups, 2–50 employees, United States.",
  },
  channels,
  daily,
  segments,
  competitors,
  personas,
};

const outPath = join(process.cwd(), "data", "channels.json");
writeFileSync(outPath, JSON.stringify(data, null, 2));

const tot = (k: "spend90" | "signups90" | "qualified90") => channels.reduce((s, c) => s + c[k], 0);
console.log(`✓ Generated ${outPath}`);
console.log(`  ${DAYS} days · ${channels.length} channels · 90d spend $${tot("spend90").toLocaleString()} · ${tot("signups90").toLocaleString()} signups (${tot("qualified90").toLocaleString()} qualified)`);
channels.forEach((c) => console.log(`  ${c.label.padEnd(16)} CAC $${c.cac}  qualCAC $${c.qualifiedCac}  cap ${c.cap}  half $${(c.half / 1000).toFixed(0)}k  q ${(c.qualRate * 100).toFixed(0)}%  LTV $${c.ltv}`));
