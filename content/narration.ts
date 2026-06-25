import type { AgentId } from "@/agents/types";

export const GUIDED_PROMPT = "I have $50k this month to bring in tech-startup accounts. Build the plan and the creative.";

export const PLAN_INTRO = "Phase 1 — Beacon builds the plan: budget allocation, the creative matrix, and the lifecycle sequence.";
export const SIM_INTRO = "Phase 2 — one week of (simulated) results lands. Watch the Performance Analyst recompute CAC and reallocate.";
export const CLOSING_PLAN = "Plan ready: a deployable budget, a creative testing matrix, and a 4-touch lifecycle sequence.";
export const CLOSING_SIM = "Reallocated — budget moves from the underperformer to the winners, and projected qualified signups go up.";

export const NARRATION: Record<AgentId, string> = {
  beacon: "Beacon takes the budget and goal, frames the program, and dispatches its specialists.",
  "channel-strategist": "The Channel Strategist allocates the budget across channels using real CAC math under a payback rule.",
  "creative-studio": "Creative Studio builds a full ad testing matrix — angles × formats × audiences — with real copy.",
  "lifecycle-architect": "The Lifecycle Architect drafts the onboarding-to-activation email sequence.",
  "performance-analyst": "The Performance Analyst reads week-1 results, recomputes CAC, and reallocates to the winners.",
};

export const SUGGESTIONS = [
  GUIDED_PROMPT,
  "We have $30k and need qualified signups under $400 CAC. Plan it.",
  "Maximize tech-startup accounts on a $75k budget this month.",
];
