import { num, pct, usd, months } from "@/lib/format";
import { FORMAT_LABELS } from "@content/concepts";
import type { AdConcept, Allocation, LifecycleEmail } from "@/lib/types";
import type { AgentContext, PlanResult, SimResult, TraceEvent } from "./types";
import { runChannelStrategist } from "./channelStrategist";
import { runCreativeStudio } from "./creativeStudio";
import { runLifecycleArchitect } from "./lifecycleArchitect";
import { runPerformanceAnalyst } from "./performanceAnalyst";
import { unique } from "./util";

export interface RunPlanOptions {
  goal: string;
  budget: number;
  targetCac: number;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
}

export interface RunSimOptions {
  budget: number;
  targetCac: number;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
}

function buildPlanSummary(allocation: Allocation, concepts: AdConcept[], sequence: LifecycleEmail[]): string[] {
  const active = allocation.rows.filter((r) => r.spend > 0);
  const top = [...active].sort((a, b) => b.spend - a.spend)[0];
  const angles = unique(concepts.map((c) => c.angleLabel)).length;
  const formats = unique(concepts.map((c) => FORMAT_LABELS[c.format])).length;
  const wPayback = active.reduce((s, r) => s + r.payback * r.spend, 0) / Math.max(1, allocation.deployed);
  return [
    `Deploy ${usd(allocation.deployed)} across ${active.length} channels — lead with ${top.label} at ${pct(top.sharePct)} of budget.`,
    `Target ~${num(allocation.totals.qualified)} qualified signups/mo at ~${usd(allocation.totals.qualifiedCac)} CAC, ~${months(wPayback)} payback.`,
    `Launch ${concepts.length} ad concepts across ${angles} angles and ${formats} formats; scale winners into platform variants.`,
    `Run the ${sequence.length}-touch lifecycle to convert signups into funded, card-issued accounts.`,
    `Read week-1 performance, then reallocate budget to the channels beating CAC.`,
  ];
}

// Orchestrator "Beacon" — Phase 1: build the plan (allocation + creative + lifecycle).
export async function runPlan(opts: RunPlanOptions): Promise<PlanResult> {
  const ctx: AgentContext = { phase: 1, seed: 1, emit: opts.emit, wait: opts.wait };

  ctx.emit({
    phase: 1,
    agent: "beacon",
    status: "thinking",
    headline: `New brief: ${usd(opts.budget)} this month to win tech-startup accounts. Framing the program…`,
    detail: "Goal: maximize qualified signups while keeping CAC under the payback target.",
  });
  await ctx.wait(650);

  ctx.emit({
    phase: 1,
    agent: "beacon",
    status: "handoff",
    headline: "Plan: allocate the budget, build the creative, draft the lifecycle. Dispatching specialists.",
    chips: [
      { label: "Budget", value: usd(opts.budget), tone: "accent" },
      { label: "Target qCAC", value: usd(opts.targetCac) },
      { label: "Goal", value: "Qualified signups" },
    ],
    handoffTo: "channel-strategist",
  });
  await ctx.wait(300);

  const { allocation } = await runChannelStrategist(ctx, { budget: opts.budget, targetCac: opts.targetCac });
  await ctx.wait(280);
  const { concepts, matrixNote } = await runCreativeStudio(ctx);
  await ctx.wait(280);
  const { sequence } = await runLifecycleArchitect(ctx);
  await ctx.wait(280);

  const planSummary = buildPlanSummary(allocation, concepts, sequence);

  ctx.emit({
    phase: 1,
    agent: "beacon",
    status: "done",
    headline: "First-90-days plan is ready.",
    detail: "A deployable budget, a creative testing matrix, and a behavioral lifecycle sequence — all defensible.",
    chips: [
      { label: "Deployed", value: usd(allocation.deployed), tone: "accent" },
      { label: "Qualified/mo", value: num(allocation.totals.qualified), tone: "good" },
      { label: "Blended qCAC", value: usd(allocation.totals.qualifiedCac) },
      { label: "Concepts", value: String(concepts.length) },
      { label: "Lifecycle", value: `${sequence.length} touches` },
    ],
  });

  return {
    goal: opts.goal,
    budget: opts.budget,
    targetCac: opts.targetCac,
    allocation,
    concepts,
    matrixNote,
    sequence,
    planSummary,
  };
}

// Orchestrator "Beacon" — Phase 2: fold in week-1 results and reallocate.
export async function runSimulation(opts: RunSimOptions): Promise<SimResult> {
  const ctx: AgentContext = { phase: 2, seed: 2, emit: opts.emit, wait: opts.wait };

  ctx.emit({
    phase: 2,
    agent: "beacon",
    status: "thinking",
    headline: "Week-1 results are in. Folding actuals into the model…",
    detail: "Same budget, same target — now informed by what actually performed.",
  });
  await ctx.wait(650);

  ctx.emit({
    phase: 2,
    agent: "beacon",
    status: "handoff",
    headline: "Handing the actuals to the Performance Analyst to recompute and reallocate.",
    handoffTo: "performance-analyst",
  });
  await ctx.wait(300);

  const { week1, reallocation, analystSummary } = await runPerformanceAnalyst(ctx, {
    budget: opts.budget,
    targetCac: opts.targetCac,
  });
  await ctx.wait(280);

  const qBefore = reallocation.before.totals.qualified;
  const qAfter = reallocation.after.totals.qualified;

  ctx.emit({
    phase: 2,
    agent: "beacon",
    status: "done",
    headline: `Reallocated for week 2 — same ${usd(opts.budget)}, projected qualified ${num(qBefore)} → ${num(qAfter)}.`,
    detail: "Budget moves off the underperformer and onto the channels beating CAC. That's the loop.",
    chips: [
      { label: "Qualified", value: `${num(qBefore)} → ${num(qAfter)}`, tone: "good" },
      { label: "Spend", value: usd(opts.budget) },
      { label: "Δ qualified", value: `+${num(qAfter - qBefore)}`, tone: "accent" },
    ],
  });

  return { week1, reallocation, analystSummary };
}
