import { allocate } from "@/skills/cac-model";
import { num, usd } from "@/lib/format";
import type { Allocation } from "@/lib/types";
import type { AgentContext, Chip } from "./types";

// Channel Strategist — allocates budget across channels with real CAC math (water-filling
// on marginal qualified-signups-per-dollar) under a target-CAC payback rule.
export async function runChannelStrategist(
  ctx: AgentContext,
  input: { budget: number; targetCac: number },
): Promise<{ allocation: Allocation }> {
  ctx.emit({
    phase: ctx.phase,
    agent: "channel-strategist",
    status: "thinking",
    headline: `Allocating ${usd(input.budget)} across 5 channels by marginal CAC…`,
  });
  await ctx.wait(750);

  const allocation = allocate(input.budget, input.targetCac);
  const top = [...allocation.rows].sort((a, b) => b.spend - a.spend)[0];
  const leftover = allocation.leftover;

  const chips: Chip[] = [
    { label: "Deployed", value: usd(allocation.deployed) },
    { label: "Qualified", value: `${num(allocation.totals.qualified)}/mo`, tone: "good" },
    { label: "Blended qCAC", value: usd(allocation.totals.qualifiedCac), tone: "accent" },
    { label: "Lead channel", value: top.label },
  ];
  if (leftover > 0) chips.push({ label: "Held back", value: usd(leftover), tone: "bad" });

  ctx.emit({
    phase: ctx.phase,
    agent: "channel-strategist",
    status: "done",
    headline: `Allocated ${usd(allocation.deployed)} for ~${num(allocation.totals.qualified)} qualified signups at ${usd(allocation.totals.qualifiedCac)} CAC.`,
    detail:
      leftover > 0
        ? `Held back ${usd(leftover)} — no channel can absorb more under a ${usd(input.targetCac)} CAC cap. Lead with ${top.label}.`
        : `Lead with ${top.label} (${Math.round(top.sharePct * 100)}% of budget); every channel stays under the ${usd(input.targetCac)} CAC cap.`,
    toolCalls: [
      {
        tool: "allocate()",
        skill: "cac-model",
        input: `budget ${usd(input.budget)}, target qCAC ${usd(input.targetCac)}`,
        output: `${num(allocation.totals.qualified)} qualified @ ${usd(allocation.totals.qualifiedCac)}`,
      },
    ],
    chips,
    handoffTo: "creative-studio",
  });

  return { allocation };
}
