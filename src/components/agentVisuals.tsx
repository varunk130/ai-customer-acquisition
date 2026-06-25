import { RadioTower, PieChart, Palette, Mails, Activity, type LucideIcon } from "lucide-react";
import type { AgentId, Accent } from "@/agents/types";

export const AGENT_ICON: Record<AgentId, LucideIcon> = {
  beacon: RadioTower,
  "channel-strategist": PieChart,
  "creative-studio": Palette,
  "lifecycle-architect": Mails,
  "performance-analyst": Activity,
};

export interface AccentClasses {
  text: string;
  bg: string;
  border: string;
  dot: string;
}

export const ACCENT: Record<Accent, AccentClasses> = {
  beacon: { text: "text-beacon", bg: "bg-beacon/10", border: "border-beacon/40", dot: "bg-beacon" },
  indigo: { text: "text-indigo2", bg: "bg-indigo2/10", border: "border-indigo2/40", dot: "bg-indigo2" },
  violet: { text: "text-violet-300", bg: "bg-violet-400/10", border: "border-violet-400/40", dot: "bg-violet-400" },
  teal: { text: "text-teal-300", bg: "bg-teal-400/10", border: "border-teal-400/40", dot: "bg-teal-400" },
  win: { text: "text-win", bg: "bg-win/10", border: "border-win/40", dot: "bg-win" },
  loss: { text: "text-loss", bg: "bg-loss/10", border: "border-loss/40", dot: "bg-loss" },
};

export const CHIP_TONE: Record<string, string> = {
  default: "border-white/10 bg-white/[0.03] text-slate-300",
  good: "border-win/30 bg-win/10 text-win",
  bad: "border-loss/30 bg-loss/10 text-loss",
  accent: "border-beacon/30 bg-beacon/10 text-beacon",
};
