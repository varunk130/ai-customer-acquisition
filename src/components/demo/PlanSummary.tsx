import { Map as MapIcon } from "lucide-react";

export function PlanSummary({ summary }: { summary: string[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <MapIcon className="h-4 w-4 text-beacon" />
        <h3 className="font-display text-sm font-semibold text-white">First-90-days plan</h3>
        <span className="ml-auto font-mono text-[11px] text-slate-500">by Beacon</span>
      </div>
      <ol className="space-y-2.5 p-5">
        {summary.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-beacon/30 bg-beacon/10 font-mono text-[11px] text-beacon">
              {i + 1}
            </span>
            <p className="text-[13.5px] leading-relaxed text-slate-300">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
