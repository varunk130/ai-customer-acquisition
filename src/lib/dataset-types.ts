// Canonical dataset types for Beacon's synthetic acquisition data (Northwind business banking).
// Shared by the seed generator (data/seed.ts) and runtime (src/lib/dataset.ts). No runtime imports.

export type ChannelKey = "paid_search" | "paid_social" | "content_seo" | "lifecycle_email" | "partnerships";
export type SegmentKey = "vc_backed" | "bootstrapped";

export interface ChannelDayRecord {
  date: string;
  dayIndex: number;
  channel: ChannelKey;
  spend: number;
  impressions: number;
  clicks: number;
  signups: number;
  qualified: number; // ICP-fit signups
}

export interface ChannelPerf {
  key: ChannelKey;
  label: string;
  blurb: string;
  color: string; // hex, mirrors the Tailwind channel palette
  // Fitted monthly response curve: signups(s) = cap * s / (s + half)
  cap: number; // monthly signup saturation ceiling
  half: number; // monthly spend (USD) at half of cap
  qualRate: number; // fraction of signups that are ICP-qualified
  ltv: number; // blended lifetime value (USD)
  marginRate: number; // contribution margin fraction
  segmentMix: Record<SegmentKey, number>;
  // Observed 90-day aggregates (for display)
  spend90: number;
  signups90: number;
  qualified90: number;
  clicks90: number;
  impressions90: number;
  cac: number; // spend90 / signups90
  qualifiedCac: number; // spend90 / qualified90
}

export interface Segment {
  key: SegmentKey;
  label: string;
  ltv: number;
  share: number;
  blurb: string;
}

export interface Competitor {
  name: string;
  angle: string;
  weakness: string;
}

export interface Persona {
  key: string;
  label: string;
  role: string;
  jtbd: string;
}

export interface BeaconMeta {
  product: string;
  tagline: string;
  generatedAt: string;
  seed: number;
  days: number;
  startDate: string;
  endDate: string;
  defaultBudget: number;
  defaultTargetCac: number;
  icp: string;
}

export interface BeaconData {
  meta: BeaconMeta;
  channels: ChannelPerf[];
  daily: ChannelDayRecord[];
  segments: Segment[];
  competitors: Competitor[];
  personas: Persona[];
}
