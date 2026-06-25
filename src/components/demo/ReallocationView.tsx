import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SimResult } from "@/agents/types";
import { num, usd } from "@/lib/format";

const STATUS = {
  winner: { label: "winner", cls: "border-win/30 bg-win/10 text-win", Icon: TrendingUp },
  loser: { label: "underperformed", cls: "border-loss/30 bg-loss/10 text-loss", Icon: TrendingDown },
  "on-track": { label: "on track", cls: "border-white/10 bg-white/[0.03] text-slate-400", Icon: Minus },
} as const;

export function ReallocationView({ sim }: { sim: SimResult }) {
  const { before, after } = sim.reallocation;
  const maxSpend = Math.max(...before.rows.map((r) => r.spend), ...after.rows.map((r) => r.spend), 1);
  const qBefore = before.totals.qualified;
  const qAfter = after.totals.qualified;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-win/15">
            <TrendingUp className="h-3 w-3 text-win" />
          </span>
          <h3 className="font-display text-sm font-semibold text-white">Week-1 results → reallocation</h3>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-[12px]">
          <span className="text-slate-400">{num(qBefore)} qual</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="font-semibold text-win">{num(qAfter)} qual</span>
          <span className="text-slate-500">· same spend</span>
        </span>
      </div>

      <div className="p-5">
        <div className="space-y-3.5">
          {before.rows.map((b) => {
            const a = after.rows.find((r) => r.key === b.key)!;
            const wk = sim.week1.rows.find((r) => r.key === b.key);
            const st = wk ? STATUS[wk.status] : STATUS["on-track"];
            const delta = a.spend - b.spend;
            return (
              <div key={b.key}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: b.color }} />
                    <span className="text-[13px] font-medium text-white">{b.label}</span>
                    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${st.cls}`}>
                      <st.Icon className="h-2.5 w-2.5" /> {st.label}
                    </span>
                  </span>
                  <span className={`font-mono text-[12px] ${delta > 0 ? "text-win" : delta < 0 ? "text-loss" : "text-slate-500"}`}>
                    {delta > 0 ? "+" : delta < 0 ? "−" : "±"}
                    {usd(Math.abs(delta))}
                  </span>
                </div>
                {/* before/after mini bars */}
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-10 shrink-0 text-right font-mono text-[10px] text-slate-500">plan</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <span className="block h-full rounded-full opacity-50" style={{ width: `${(b.spend / maxSpend) * 100}%`, backgroundColor: b.color }} />
                    </span>
                    <span className="w-14 shrink-0 font-mono text-[10px] text-slate-500">{usd(b.spend)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 shrink-0 text-right font-mono text-[10px] text-slate-400">wk 2</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <span className="block h-full rounded-full" style={{ width: `${(a.spend / maxSpend) * 100}%`, backgroundColor: b.color }} />
                    </span>
                    <span className="w-14 shrink-0 font-mono text-[10px] text-slate-300">{usd(a.spend)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 border-t border-white/[0.06] pt-3 text-[13px] leading-relaxed text-slate-400">{sim.analystSummary}</p>
      </div>
    </div>
  );
}
