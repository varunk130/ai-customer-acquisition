import Link from "next/link";
import { ArrowRight, KeyRound, PieChart, Palette, Activity, Play } from "lucide-react";
import { Section, Eyebrow, Stat, TagPill } from "@/components/ui";
import { AgentPipeline } from "@/components/AgentPipeline";
import { SITE } from "@/lib/site";
import { allocate } from "@/lib/cac";
import { beaconData, totals90 } from "@/lib/dataset";
import { num, usd, usdK } from "@/lib/format";

export default function HomePage() {
  const { defaultBudget, defaultTargetCac } = beaconData.meta;
  const plan = allocate(defaultBudget, defaultTargetCac);
  const t90 = totals90();

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <Section className="!py-20 sm:!py-28">
          <div className="flex flex-wrap items-center gap-2">
            <TagPill accent="beacon">
              <span className="h-1.5 w-1.5 rounded-full bg-beacon" /> Agentic acquisition engine
            </TagPill>
            <TagPill accent="indigo">
              <KeyRound className="h-3 w-3" /> Local-first · no API keys
            </TagPill>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.07] tracking-tight text-white sm:text-6xl">
            Give it a budget and a target. Beacon <span className="text-beacon">allocates, creates, and reallocates.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Five agents take {usd(defaultBudget)} and a CAC target, split it across channels with real optimization, produce the
            ad matrix and lifecycle, then reallocate the moment week-1 results land. And it shows its work.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/demo" className="btn-primary text-[15px] !px-6 !py-3.5">
              <Play className="h-4 w-4" /> Run the live demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className="btn-ghost text-[15px] !px-6 !py-3.5">
              See how it works
            </Link>
            <span className="text-sm text-slate-500 sm:ml-2">No sign-up. Nothing to configure.</span>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={usdK(defaultBudget)} label="Example monthly budget" />
            <Stat value={num(plan.totals.qualified)} label="Qualified signups / mo" tone="indigo" />
            <Stat value={usd(plan.totals.qualifiedCac)} label="Blended qualified CAC" tone="beacon" />
            <Stat value={usdK(t90.spend)} label="90 days of channel data" />
          </div>
        </Section>
      </div>

      <Section className="!pt-4">
        <Eyebrow className="mb-4">The engine, made watchable</Eyebrow>
        <AgentPipeline />
      </Section>

      <Section className="!pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: PieChart, title: "Allocate", body: "The Channel Strategist splits the budget by marginal CAC under a payback rule — real water-filling optimization, not a guess.", accent: "indigo" as const },
            { icon: Palette, title: "Create", body: "Creative Studio assembles a 14-concept testing matrix with real headlines and body copy, then expands the winner into platform variants.", accent: "violet" as const },
            { icon: Activity, title: "Reallocate", body: "When week-1 results land, the Performance Analyst recomputes CAC and moves budget to the winners — at the same spend.", accent: "beacon" as const },
          ].map((c) => (
            <div key={c.title} className="panel p-6">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${c.accent === "indigo" ? "border-indigo2/30 bg-indigo2/10 text-indigo2" : c.accent === "violet" ? "border-violet-400/30 bg-violet-400/10 text-violet-300" : "border-beacon/30 bg-beacon/10 text-beacon"}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-4">
        <div className="panel relative overflow-hidden p-8 sm:p-12">
          <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
          <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Watch five agents turn a budget into a defensible plan and real ad creative — in under 90 seconds.
          </h2>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="btn-primary !px-6 !py-3.5">
              <Play className="h-4 w-4" /> Run the guided demo
            </Link>
            <Link href="/problem" className="btn-ghost !px-6 !py-3.5">
              Why it matters
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
