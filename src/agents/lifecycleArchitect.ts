import { LIFECYCLE_SEQUENCE } from "@content/lifecycle";
import type { LifecycleEmail } from "@/lib/types";
import type { AgentContext } from "./types";

// Lifecycle Architect — assembles the onboarding → activation email sequence.
export async function runLifecycleArchitect(ctx: AgentContext): Promise<{ sequence: LifecycleEmail[] }> {
  ctx.emit({
    phase: ctx.phase,
    agent: "lifecycle-architect",
    status: "thinking",
    headline: "Drafting the onboarding → activation email sequence…",
  });
  await ctx.wait(750);

  const sequence = LIFECYCLE_SEQUENCE;

  ctx.emit({
    phase: ctx.phase,
    agent: "lifecycle-architect",
    status: "done",
    headline: `Drafted a ${sequence.length}-touch lifecycle from signup to a funded, card-issued account.`,
    detail: `Each email is triggered by behavior: ${sequence.map((s) => s.goal.toLowerCase()).join(" → ")}.`,
    toolCalls: [
      { tool: "library.select()", skill: "content:lifecycle", input: "sequence", output: `${sequence.length} emails` },
    ],
    chips: [
      { label: "Touches", value: String(sequence.length), tone: "accent" },
      { label: "Trigger", value: "behavioral" },
      { label: "North-star", value: "funded + card issued", tone: "good" },
    ],
    handoffTo: "beacon",
  });

  return { sequence };
}
