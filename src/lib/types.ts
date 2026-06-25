import type { ChannelKey } from "./dataset-types";

export interface AllocationRow {
  key: ChannelKey;
  label: string;
  color: string;
  spend: number;
  signups: number;
  qualified: number;
  cac: number;
  qualifiedCac: number;
  payback: number; // months
  sharePct: number;
}

export interface AllocationTotals {
  spend: number;
  signups: number;
  qualified: number;
  cac: number;
  qualifiedCac: number;
  leftover: number;
}

export interface Allocation {
  rows: AllocationRow[];
  totals: AllocationTotals;
  budget: number;
  targetCac: number;
  deployed: number;
  leftover: number;
}

export type Week1Status = "winner" | "loser" | "on-track";

export interface Week1Row {
  key: ChannelKey;
  label: string;
  color: string;
  planSpend: number;
  weekSpend: number;
  expectedSignups: number;
  actualSignups: number;
  actualQualified: number;
  expectedCac: number;
  actualCac: number;
  actualQualCac: number;
  mult: number;
  status: Week1Status;
}

export interface Week1Result {
  rows: Week1Row[];
}

export interface Reallocation {
  before: Allocation;
  after: Allocation;
}

// ---- creative & lifecycle (authored in /content) ----
export type AdFormat = "linkedin_single" | "x_post" | "search_rsa" | "display";
export type AdAudience = "founder" | "finance_lead";

export interface AdConcept {
  id: string;
  angleId: string;
  angleLabel: string;
  format: AdFormat;
  audience: AdAudience;
  headline: string;
  body: string;
  cta: string;
  imageBrief: string;
}

export interface PlatformVariant {
  platform: string;
  spec: string;
  headline: string;
  primaryText: string;
  cta: string;
}

export interface LifecycleEmail {
  step: number;
  trigger: string;
  subject: string;
  preheader: string;
  body: string;
  goal: string;
}
