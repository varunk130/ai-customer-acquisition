import { channels as allChannels } from "./dataset";
import type { ChannelPerf } from "./dataset-types";
import type { Allocation, AllocationRow, Reallocation, Week1Result, Week1Row } from "./types";

const LIFETIME_MONTHS = 36;

// --- Channel response curve: signups(s) = cap * s / (s + half) -----------------
export const signupsAt = (ch: ChannelPerf, s: number): number => (s <= 0 ? 0 : (ch.cap * s) / (s + ch.half));
export const qualSignupsAt = (ch: ChannelPerf, s: number): number => signupsAt(ch, s) * ch.qualRate;
export const cacAt = (ch: ChannelPerf, s: number): number => (s <= 0 ? ch.half / ch.cap : s / signupsAt(ch, s));
export const qualCacAt = (ch: ChannelPerf, s: number): number => (s <= 0 ? ch.half / (ch.cap * ch.qualRate) : s / qualSignupsAt(ch, s));

// Marginal qualified signups per incremental dollar (decreasing → enables water-filling).
export const marginalQualPerDollar = (ch: ChannelPerf, s: number): number =>
  (ch.qualRate * ch.cap * ch.half) / Math.pow(s + ch.half, 2);

// CAC payback in months against monthly contribution (LTV × margin spread over lifetime).
export const paybackMonths = (ch: ChannelPerf, qualCac: number): number =>
  qualCac / ((ch.ltv * ch.marginRate) / LIFETIME_MONTHS);

/**
 * Allocate `budget` across channels to maximize qualified signups, subject to a payback
 * rule: a channel's blended qualified CAC must stay at or below `targetQualCac`.
 * Greedy water-filling on marginal qualified-signups-per-dollar — optimal for a concave,
 * separable objective.
 */
export function allocateBudget(
  channels: ChannelPerf[],
  budget: number,
  targetQualCac: number,
  step = 250,
): Allocation {
  const spend: Record<string, number> = {};
  const maxSpend: Record<string, number> = {};
  for (const c of channels) {
    spend[c.key] = 0;
    // qualCacAt(s) = (s + half)/(cap*qual) <= target  ⇒  s <= target*cap*qual - half
    maxSpend[c.key] = Math.max(0, targetQualCac * c.cap * c.qualRate - c.half);
  }

  let remaining = budget;
  while (remaining >= step) {
    let best: ChannelPerf | null = null;
    let bestMarginal = -1;
    for (const c of channels) {
      if (spend[c.key] + step <= maxSpend[c.key] + 1e-6) {
        const m = marginalQualPerDollar(c, spend[c.key]);
        if (m > bestMarginal) {
          bestMarginal = m;
          best = c;
        }
      }
    }
    if (!best) break; // no channel can absorb more spend under the target CAC
    spend[best.key] += step;
    remaining -= step;
  }

  const rows: AllocationRow[] = channels.map((c) => {
    const s = spend[c.key];
    const su = signupsAt(c, s);
    const q = qualSignupsAt(c, s);
    const qcac = s > 0 && q > 0 ? s / q : 0;
    return {
      key: c.key,
      label: c.label,
      color: c.color,
      spend: s,
      signups: Math.round(su),
      qualified: Math.round(q),
      cac: s > 0 && su > 0 ? s / su : 0,
      qualifiedCac: qcac,
      payback: s > 0 ? paybackMonths(c, qcac) : 0,
      sharePct: 0,
    };
  });

  const deployed = budget - remaining;
  for (const r of rows) r.sharePct = deployed > 0 ? r.spend / deployed : 0;
  const signups = rows.reduce((s, r) => s + r.signups, 0);
  const qualified = rows.reduce((s, r) => s + r.qualified, 0);

  return {
    rows,
    budget,
    targetCac: targetQualCac,
    deployed,
    leftover: remaining,
    totals: {
      spend: deployed,
      signups,
      qualified,
      cac: signups > 0 ? deployed / signups : 0,
      qualifiedCac: qualified > 0 ? deployed / qualified : 0,
      leftover: remaining,
    },
  };
}

export const allocate = (budget: number, targetQualCac: number): Allocation =>
  allocateBudget(allChannels, budget, targetQualCac);

// Deterministic week-1 performance multipliers (the "what actually happened").
export const WEEK1_MULT: Record<string, number> = {
  content_seo: 1.3,
  lifecycle_email: 1.15,
  paid_search: 1.04,
  partnerships: 0.93,
  paid_social: 0.8,
};

export function simulateWeek1(channels: ChannelPerf[], allocation: Allocation): Week1Result {
  const WEEKS_PER_MONTH = 4.345;
  const rows: Week1Row[] = allocation.rows
    .filter((r) => r.spend > 0)
    .map((r) => {
      const ch = channels.find((c) => c.key === r.key)!;
      const weekSpend = r.spend / WEEKS_PER_MONTH;
      const expectedWeekSignups = signupsAt(ch, r.spend) / WEEKS_PER_MONTH;
      const mult = WEEK1_MULT[r.key] ?? 1;
      const actualSignups = Math.max(0, Math.round(expectedWeekSignups * mult));
      const actualQualified = Math.round(actualSignups * ch.qualRate);
      const status: Week1Row["status"] = mult >= 1.1 ? "winner" : mult <= 0.92 ? "loser" : "on-track";
      return {
        key: r.key,
        label: r.label,
        color: r.color,
        planSpend: r.spend,
        weekSpend: Math.round(weekSpend),
        expectedSignups: Math.round(expectedWeekSignups),
        actualSignups,
        actualQualified,
        expectedCac: r.cac,
        actualCac: actualSignups > 0 ? weekSpend / actualSignups : 0,
        actualQualCac: actualQualified > 0 ? weekSpend / actualQualified : 0,
        mult,
        status,
      };
    });
  return { rows };
}

// Re-run the allocation after folding week-1 results into each channel's effective ceiling.
export function reallocate(
  channels: ChannelPerf[],
  budget: number,
  targetQualCac: number,
  mults: Record<string, number>,
): Reallocation {
  const before = allocateBudget(channels, budget, targetQualCac);
  const adjusted = channels.map((c) => ({ ...c, cap: c.cap * (mults[c.key] ?? 1) }));
  const after = allocateBudget(adjusted, budget, targetQualCac);
  return { before, after };
}
