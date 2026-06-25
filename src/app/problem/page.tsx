import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Clapperboard, Timer, ArrowRight, Play } from "lucide-react";
import { Section, Eyebrow, Stat } from "@/components/ui";
import { allocate } from "@/lib/cac";
import { beaconData, channels } from "@/lib/dataset";
import { usd, usdK, num } from "@/lib/format";

export const metadata: Metadata = {
  title: "Problem → Solution",
  description: "Acquisition budgets are set by gut, creative is a bottleneck, and reallocation is late. Beacon fixes all three.",
};

const PAINS = [
  {
    icon: Calculator,
    title: "Budget by gut, not math",
    body: "Operators split spend across channels on intuition. Nobody re-derives the optimal mix as CAC curves bend, so money quietly pools in the wrong places.",
  },
  {
    icon: Clapperboard,
    title: "Creative is the bottleneck",
    body: "You need a dozen concepts to find a winner, but producing real headlines, body, and briefs is slow — so tests stay thin and learnings stall.",
  },
  {
    icon: Timer,
    title: "Reallocation comes late",
    body: "Week-1 data shows the winners and losers, but moving budget is a manual, end-of-month chore. The underperformer keeps burning spend.",
  },
];

export default function ProblemPage() {
  const { defaultBudget, defaultTargetCac } = beaconData.meta;
  const plan = allocate(defaultBudget, defaultTargetCac);
  const sorted = [...channels].sort((a, b) => a.qualifiedCac - b.qualifiedCac);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">Problem → Solution</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Operators don&apos;t lack budget. They lack a <span className="text-beacon">system to deploy it.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          Give a growth operator $50k and a target, and the hard part isn&apos;t spending it — it&apos;s splitting it across
          channels by real economics, producing enough creative to learn, and moving money the moment results come in.
        </p>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {PAINS.map((p) => (
            <div key={p.title} className="panel p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-loss/25 bg-loss/10 text-loss">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="panel p-6 sm:p-8">
          <Eyebrow className="mb-4">The proof is in the channels · Northwind</Eyebrow>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={usd(best.qualifiedCac)} label={`${best.label} (best qCAC)`} tone="indigo" />
            <Stat value={usd(worst.qualifiedCac)} label={`${worst.label} (worst qCAC)`} tone="beacon" />
            <Stat value={`${(worst.qualifiedCac / best.qualifiedCac).toFixed(1)}×`} label="Spread, best vs worst" />
            <Stat value={usdK(channels.reduce((s, c) => s + c.spend90, 0))} label="90 days of spend" />
          </div>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-400">
            Same dollar, wildly different return. A {(worst.qualifiedCac / best.qualifiedCac).toFixed(1)}× CAC spread across
            channels means the allocation decision is the highest-leverage move an operator makes each month — and the one most
            often made by feel.
          </p>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow className="mb-3">The solution</Eyebrow>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              An engine that allocates, creates, and reallocates.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Beacon is a real multi-agent runtime. Hand it a budget and a CAC target: the Channel Strategist water-fills spend
              by marginal CAC, Creative Studio assembles a full testing matrix, the Lifecycle Architect drafts the activation
              sequence, and the Performance Analyst reallocates on week-1 results — all computed locally, no API keys. At {usd(defaultBudget)}/$
              {defaultTargetCac} CAC it deploys for ~{num(plan.totals.qualified)} qualified signups at {usd(plan.totals.qualifiedCac)}.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className="btn-primary !px-6 !py-3.5">
                <Play className="h-4 w-4" /> Watch it run
              </Link>
              <Link href="/how-it-works" className="btn-ghost !px-6 !py-3.5">
                See the architecture <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="panel p-6">
            <div className="space-y-3">
              {[
                ["Allocate", "Channel Strategist water-fills budget by marginal CAC under a payback rule."],
                ["Create", "Creative Studio builds a 14-concept matrix; creative-variants scales the winner."],
                ["Activate", "Lifecycle Architect drafts the onboarding → activation sequence."],
                ["Reallocate", "Performance Analyst recomputes CAC on week-1 and moves the money."],
              ].map(([k, v], i) => (
                <div key={k} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-beacon/30 bg-beacon/10 font-mono text-[11px] text-beacon">
                    {i + 1}
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-slate-300">
                    <span className="font-semibold text-white">{k}.</span> {v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
