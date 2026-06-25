"use client";

import { useState } from "react";
import { ChevronDown, Mailbox } from "lucide-react";
import { MarkdownLite } from "./MarkdownLite";
import type { LifecycleEmail } from "@/lib/types";

export function LifecycleSequence({ sequence }: { sequence: LifecycleEmail[] }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Mailbox className="h-4 w-4 text-teal-300" />
          <h3 className="font-display text-sm font-semibold text-white">Lifecycle sequence</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">onboarding → activation · {sequence.length} touches</span>
      </div>

      <ol className="p-5">
        {sequence.map((em, i) => {
          const isOpen = open === em.step;
          return (
            <li key={em.step} className="relative flex gap-3.5 pb-3 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 font-mono text-[12px] font-semibold text-teal-300">
                  {em.step}
                </span>
                {i < sequence.length - 1 && <span className="mt-1 w-px flex-1 bg-white/[0.08]" />}
              </div>
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => setOpen(isOpen ? null : em.step)}
                  className="focusable group w-full rounded-lg text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{em.trigger}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                  <div className="mt-0.5 text-[14px] font-semibold text-white">{em.subject}</div>
                  <div className="text-[12px] text-slate-400">{em.preheader}</div>
                </button>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-teal-400/25 bg-teal-400/[0.07] px-2 py-0.5 text-[10px] text-teal-300">
                  Goal: {em.goal}
                </div>
                {isOpen && (
                  <div className="mt-2 rounded-lg border border-white/[0.06] bg-navy-950/40 p-3.5">
                    <MarkdownLite text={em.body} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
