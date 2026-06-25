"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, AlertTriangle } from "lucide-react";
import type { Allocation } from "@/lib/types";
import { num, usd, usdK, months, pct } from "@/lib/format";
import { AnimatedNumber } from "./AnimatedNumber";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-slate-400">{label}</span>
        <span className="font-mono text-sm font-semibold text-beacon">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2 w-full disabled:opacity-50"
      />
    </div>
  );
}

export function AllocationDashboard({
  allocation,
  budget,
  targetCac,
  setBudget,
  setTargetCac,
  disabled,
}: {
  allocation: Allocation;
  budget: number;
  targetCac: number;
  setBudget: (v: number) => void;
  setTargetCac: (v: number) => void;
  disabled?: boolean;
}) {
  const active = allocation.rows.filter((r) => r.spend > 0);

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-beacon" />
          <h3 className="font-display text-sm font-semibold text-white">Budget allocation</h3>
          <span className="rounded-full border border-beacon/30 bg-beacon/10 px-2 py-0.5 text-[10px] font-medium text-beacon">live</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">drag to re-run the Channel Strategist&apos;s math</span>
      </div>

      {/* sliders */}
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <Slider label="Total budget / month" value={budget} min={10000} max={150000} step={5000} onChange={setBudget} format={usdK} disabled={disabled} />
        <Slider label="Target qualified CAC" value={targetCac} min={300} max={1000} step={25} onChange={setTargetCac} format={usd} disabled={disabled} />
      </div>

      {/* totals */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Deployed</div>
          <div className="font-display text-xl font-semibold text-white">
            <AnimatedNumber value={allocation.deployed} format={(n) => usd(n)} />
          </div>
        </div>
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Qualified / mo</div>
          <div className="font-display text-xl font-semibold text-indigo2">
            <AnimatedNumber value={allocation.totals.qualified} />
          </div>
        </div>
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Blended qCAC</div>
          <div className="font-display text-xl font-semibold text-beacon">
            <AnimatedNumber value={allocation.totals.qualifiedCac} format={(n) => usd(n)} />
          </div>
        </div>
        <div className="panel-quiet px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Held back</div>
          <div className={`font-display text-xl font-semibold ${allocation.leftover > 0 ? "text-loss" : "text-slate-500"}`}>
            <AnimatedNumber value={allocation.leftover} format={(n) => usd(n)} />
          </div>
        </div>
      </div>

      {/* stacked allocation bar */}
      <div className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {active.map((r) => (
          <motion.div
            key={r.key}
            className="h-full"
            style={{ backgroundColor: r.color }}
            animate={{ width: `${r.sharePct * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            title={`${r.label}: ${usd(r.spend)}`}
          />
        ))}
      </div>

      {/* table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
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

      {allocation.leftover > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-loss/25 bg-loss/[0.06] px-3 py-2 text-[12px] text-slate-300">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-loss" />
          <span>
            Held back <span className="font-semibold text-loss">{usd(allocation.leftover)}</span> — no channel can absorb more
            under a {usd(targetCac)} qualified-CAC cap. Raise the target or trim the budget to deploy it efficiently.
          </span>
        </div>
      )}
    </div>
  );
}
