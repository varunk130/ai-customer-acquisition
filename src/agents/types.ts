import type { AdConcept, Allocation, LifecycleEmail, Reallocation, Week1Result } from "@/lib/types";

export type AgentId = "beacon" | "channel-strategist" | "creative-studio" | "lifecycle-architect" | "performance-analyst";

export type Accent = "beacon" | "indigo" | "violet" | "teal" | "win" | "loss";

export interface AgentMeta {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  accent: Accent;
  kind: "orchestrator" | "analysis" | "generative";
}

export const AGENTS: Record<AgentId, AgentMeta> = {
  beacon: {
    id: "beacon",
    name: "Beacon",
    role: "Orchestrator",
    tagline: "Owns the budget and goal, plans the program, reallocates as results land.",
    accent: "beacon",
    kind: "orchestrator",
  },
  "channel-strategist": {
    id: "channel-strategist",
    name: "Channel Strategist",
    role: "Analysis sub-agent",
    tagline: "Allocates budget across channels by marginal CAC under a payback rule.",
    accent: "indigo",
    kind: "analysis",
  },
  "creative-studio": {
    id: "creative-studio",
    name: "Creative Studio",
    role: "Generative sub-agent",
    tagline: "Builds the ad testing matrix — angle × format × audience.",
    accent: "violet",
    kind: "generative",
  },
  "lifecycle-architect": {
    id: "lifecycle-architect",
    name: "Lifecycle Architect",
    role: "Generative sub-agent",
    tagline: "Drafts the onboarding → activation email sequence.",
    accent: "teal",
    kind: "generative",
  },
  "performance-analyst": {
    id: "performance-analyst",
    name: "Performance Analyst",
    role: "Analysis sub-agent",
    tagline: "Recomputes CAC on week-1 results and recommends a reallocation.",
    accent: "win",
    kind: "analysis",
  },
};

export const AGENT_ORDER: AgentId[] = [
  "beacon",
  "channel-strategist",
  "creative-studio",
  "lifecycle-architect",
  "performance-analyst",
];

export type TraceStatus = "thinking" | "tool" | "done" | "handoff";

export interface ToolCall {
  tool: string;
  skill: string;
  input: string;
  output: string;
}

export type ChipTone = "default" | "good" | "bad" | "accent";

export interface Chip {
  label: string;
  value: string;
  tone?: ChipTone;
}

export interface TraceEvent {
  id: string;
  phase: number; // 1 = plan, 2 = simulate
  agent: AgentId;
  status: TraceStatus;
  headline: string;
  detail?: string;
  toolCalls?: ToolCall[];
  chips?: Chip[];
  handoffTo?: AgentId;
  ts: number;
}

export interface PlanResult {
  goal: string;
  budget: number;
  targetCac: number;
  allocation: Allocation;
  concepts: AdConcept[];
  matrixNote: string;
  sequence: LifecycleEmail[];
  planSummary: string[];
}

export interface SimResult {
  week1: Week1Result;
  reallocation: Reallocation;
  analystSummary: string;
}

export interface AgentContext {
  phase: number;
  seed: number;
  emit: (e: Omit<TraceEvent, "id" | "ts">) => void;
  wait: (ms: number) => Promise<void>;
}
