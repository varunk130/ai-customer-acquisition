import { channels } from "@/lib/dataset";
import { reallocate, simulateWeek1, WEEK1_MULT } from "@/skills/cac-model";
import { num, usd } from "@/lib/format";
import type { Reallocation, Week1Result } from "@/lib/types";
import type { AgentContext } from "./types";

// Performance Analyst — recomputes CAC on simulated week-1 results, flags winners/losers,
// and recommends a reallocation (real math, before/after budget).
export async function runPerformanceAnalyst(
  ctx: AgentContext,
  input: { budget: number; targetCac: number },
): Promise<{ week1: Week1Result; reallocation: Reallocation; analystSummary: string }> {
  ctx.emit({
    phase: ctx.phase,
    agent: "performance-analyst",
    status: "thinking",
    headline: "Reading week-1 results and recomputing CAC by channel…",
  });
  await ctx.wait(800);

  const re = reallocate(channels, input.budget, input.targetCac, WEEK1_MULT);
  const week1 = simulateWeek1(channels, re.before);

  const winners = week1.rows.filter((r) => r.status === "winner").map((r) => r.label);
  const losers = week1.rows.filter((r) => r.status === "loser").map((r) => r.label);

  let biggest = { label: "", delta: 0 };
  re.before.rows.forEach((b, i) => {
    const a = re.after.rows[i];
    const d = a.spend - b.spend;
    if (Math.abs(d) > Math.abs(biggest.delta)) biggest = { label: b.label, delta: d };
  });

  const qBefore = re.before.totals.qualified;
  const qAfter = re.after.totals.qualified;
  const analystSummary = `${losers.length ? `${losers.join(", ")} underperformed` : "All channels held"}; ${winners.length ? `${winners.join(", ")} beat plan` : "no standout winners"}. Reallocating lifts projected qualified signups from ${qBefore} to ${qAfter} at the same spend.`;

  ctx.emit({
    phase: ctx.phase,
    agent: "performance-analyst",
    status: "done",
    headline: `Reallocated for week 2 — projected qualified ${num(qBefore)} → ${num(qAfter)}.`,
    detail: analystSummary,
    toolCalls: [
      { tool: "simulateWeek1()", skill: "cac-model", input: `${week1.rows.length} channels`, output: `${winners.length} winners, ${losers.length} losers` },
      { tool: "reallocate()", skill: "cac-model", input: `budget ${usd(input.budget)}`, output: `${num(qBefore)} → ${num(qAfter)} qualified` },
    ],
    chips: [
      { label: "Winners", value: winners.join(", ") || "—", tone: "good" },
      { label: "Losers", value: losers.join(", ") || "—", tone: "bad" },
      { label: "Qualified", value: `${num(qBefore)} → ${num(qAfter)}`, tone: "accent" },
      { label: "Biggest move", value: `${biggest.delta >= 0 ? "+" : "−"}${usd(Math.abs(biggest.delta))} ${biggest.label}` },
    ],
    handoffTo: "beacon",
  });

  return { week1, reallocation: re, analystSummary };
}
