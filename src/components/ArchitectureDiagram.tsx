import { ArrowDown, Database, FileText, RefreshCw, Wallet } from "lucide-react";
import { AGENTS, AGENT_ORDER } from "@/agents/types";
import { AGENT_ICON, ACCENT } from "@/components/agentVisuals";
import { SKILLS } from "@/skills";

function Layer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{title}</div>
      {children}
    </div>
  );
}
function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="h-4 w-4 text-slate-600" />
    </div>
  );
}

export function ArchitectureDiagram() {
  const subAgents = AGENT_ORDER.filter((id) => id !== "beacon");

  return (
    <div className="panel relative overflow-hidden p-5 sm:p-7">
      <div className="grid-bg absolute inset-0 -z-10 opacity-50" aria-hidden />

      <Layer title="Brief">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-xl border border-beacon/30 bg-beacon/[0.06] px-4 py-2.5">
          <Wallet className="h-4 w-4 text-beacon" />
          <span className="text-sm text-white">“$50k this month to win tech-startup accounts.”</span>
        </div>
      </Layer>
      <Arrow />
      <Layer title="Orchestrator">
        <div className="mx-auto flex w-fit items-center gap-2.5 rounded-xl border border-beacon/40 bg-beacon/10 px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-beacon/40 bg-beacon/10">
            <RefreshCw className="h-4 w-4 text-beacon" />
          </span>
          <div>
            <div className="text-sm font-semibold text-white">{AGENTS.beacon.name}</div>
            <div className="text-[11px] text-slate-400">{AGENTS.beacon.tagline}</div>
          </div>
        </div>
      </Layer>
      <Arrow />
      <Layer title="Sub-agents">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {subAgents.map((id) => {
            const a = AGENTS[id];
            const Icon = AGENT_ICON[id];
            const accent = ACCENT[a.accent];
            return (
              <div key={id} className={`flex items-center gap-2 rounded-lg border ${accent.border} ${accent.bg} px-2.5 py-2`}>
                <Icon className={`h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                <span className="truncate text-[12px] font-medium text-white">{a.name}</span>
              </div>
            );
          })}
        </div>
      </Layer>
      <Arrow />
      <Layer title="Skills (invoked by name)">
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <div key={s.name} className="rounded-lg border border-indigo2/25 bg-indigo2/[0.05] px-2.5 py-2">
              <div className="font-mono text-[11px] text-indigo2">{s.name}</div>
            </div>
          ))}
        </div>
      </Layer>
      <Arrow />
      <Layer title="Data & content (local, no network)">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
            <Database className="h-4 w-4 text-slate-400" />
            <span className="text-[12px] text-slate-300">90-day channel performance · CAC · LTV by segment</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="text-[12px] text-slate-300">Curated /content · ad concepts + lifecycle copy</span>
          </div>
        </div>
      </Layer>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-beacon/20 bg-beacon/[0.05] px-3 py-2.5">
        <RefreshCw className="h-4 w-4 shrink-0 text-beacon" />
        <span className="text-[12px] text-slate-300">
          Week-1 actuals flow back through the <span className="font-semibold text-beacon">cac-model</span> into a reallocation —
          the budget keeps moving toward what performs.
        </span>
      </div>
    </div>
  );
}
