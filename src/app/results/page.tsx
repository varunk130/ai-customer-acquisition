import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import { Section, Eyebrow, Stat } from "@/components/ui";
import { precompute } from "@/lib/precompute";
import { AllocationStatic } from "@/components/demo/AllocationStatic";
import { PlanSummary } from "@/components/demo/PlanSummary";
import { ReallocationView } from "@/components/demo/ReallocationView";
import { CreativeMatrix } from "@/components/demo/CreativeMatrix";
import { LifecycleSequence } from "@/components/demo/LifecycleSequence";
import { num, usd } from "@/lib/format";

export const metadata: Metadata = {
  title: "Results",
  description: "The real artifacts Beacon produced: a budget allocation with CAC/payback, a 14-concept creative matrix, a lifecycle sequence, and a week-1 reallocation.",
};

export default async function ResultsPage() {
  const { plan, sim } = await precompute();
  const qBefore = sim.reallocation.before.totals.qualified;
  const qAfter = sim.reallocation.after.totals.qualified;

  return (
    <>
      <Section className="!pb-8">
        <Eyebrow className="mb-3">Output / Results</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          A deployable plan, real creative, and a <span className="text-beacon">live reallocation.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          Everything below was produced by the same runtime the live demo uses — computed deterministically at {usd(plan.budget)}/$
          {plan.targetCac} CAC, with no API keys. The math is real; the copy is real.
        </p>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={usd(plan.allocation.deployed)} label="Budget deployed / mo" />
          <Stat value={num(plan.allocation.totals.qualified)} label="Qualified signups / mo" tone="indigo" />
          <Stat value={usd(plan.allocation.totals.qualifiedCac)} label="Blended qualified CAC" tone="beacon" />
          <Stat value={`${num(qBefore)} → ${num(qAfter)}`} label="Qualified after reallocation" />
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <PlanSummary summary={plan.planSummary} />
          <AllocationStatic allocation={plan.allocation} />
        </div>
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">Week-1 results → reallocation</Eyebrow>
        <ReallocationView sim={sim} />
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">The creative it produced</Eyebrow>
        <CreativeMatrix concepts={plan.concepts} />
      </Section>

      <Section className="!pt-0">
        <Eyebrow className="mb-5">The lifecycle it drafted</Eyebrow>
        <LifecycleSequence sequence={plan.sequence} />

        <div className="mt-8">
          <Link href="/demo" className="btn-primary !px-6 !py-3.5">
            <Play className="h-4 w-4" /> Watch it happen live
          </Link>
        </div>
      </Section>
    </>
  );
}
