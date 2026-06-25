import { SlidersHorizontal } from "lucide-react";
import type { Allocation } from "@/lib/types";
import { num, usd, pct, months } from "@/lib/format";

// Static (non-interactive) allocation view for server-rendered pages like Results.
export function AllocationStatic({ allocation }: { allocation: Allocation }) {
  const active = allocation.rows.filter((r) => r.spend > 0);

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-beacon" />
          <h3 className="font-display text-sm font-semibold text-white">Budget allocation</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{usd(allocation.budget)} · target {usd(allocation.targetCac)} CAC</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Deployed</div>
          <div className="font-display text-xl font-semibold text-white">{usd(allocation.deployed)}</div>
        </div>
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Qualified / mo</div>
          <div className="font-display text-xl font-semibold text-indigo2">{num(allocation.totals.qualified)}</div>
        </div>
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Blended qCAC</div>
          <div className="font-display text-xl font-semibold text-beacon">{usd(allocation.totals.qualifiedCac)}</div>
        </div>
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Signups / mo</div>
          <div className="font-display text-xl font-semibold text-white">{num(allocation.totals.signups)}</div>
        </div>
      </div>

      <div className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {active.map((r) => (
          <span key={r.key} className="h-full" style={{ width: `${r.sharePct * 100}%`, backgroundColor: r.color }} title={`${r.label}: ${usd(r.spend)}`} />
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-2 pr-2 font-medium">Channel</th>
              <th className="px-2 py-2 text-right font-medium">Spend</th>
              <th className="px-2 py-2 text-right font-medium">Share</th>
              <th className="px-2 py-2 text-right font-medium">Qualified</th>
              <th className="px-2 py-2 text-right font-medium">Qual CAC</th>
              <th className="py-2 pl-2 text-right font-medium">Payback</th>
            </tr>
          </thead>
          <tbody>
            {allocation.rows.map((r) => {
              const off = r.spend === 0;
              return (
                <tr key={r.key} className={`border-t border-white/[0.05] ${off ? "opacity-45" : ""}`}>
                  <td className="py-2.5 pr-2">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                      <span className="text-[13px] text-white">{r.label}</span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-mono text-slate-200">{off ? "—" : usd(r.spend)}</td>
                  <td className="px-2 py-2.5 text-right font-mono text-slate-400">{off ? "—" : pct(r.sharePct)}</td>
                  <td className="px-2 py-2.5 text-right font-mono text-slate-300">{off ? "—" : num(r.qualified)}</td>
                  <td className="px-2 py-2.5 text-right font-mono text-beacon">{off ? "—" : usd(r.qualifiedCac)}</td>
                  <td className="py-2.5 pl-2 text-right font-mono text-slate-400">{off ? "—" : months(r.payback)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
