import { runPlan, runSimulation } from "@/agents/orchestrator";
import { beaconData } from "@/lib/dataset";
import type { PlanResult, SimResult } from "@/agents/types";

// Runs the agent loop headlessly (no trace, instant) to produce real, deterministic
// artifacts for the static Results page. Same runtime the live demo uses.
export async function precompute(): Promise<{ plan: PlanResult; sim: SimResult }> {
  const { defaultBudget, defaultTargetCac } = beaconData.meta;
  const plan = await runPlan({
    goal: "Win tech-startup accounts",
    budget: defaultBudget,
    targetCac: defaultTargetCac,
    emit: () => {},
    wait: async () => {},
  });
  const sim = await runSimulation({
    budget: defaultBudget,
    targetCac: defaultTargetCac,
    emit: () => {},
    wait: async () => {},
  });
  return { plan, sim };
}
