"use client";

import { Eyebrow } from "@/components/ui";
import { useBeacon } from "@/components/demo/useBeacon";
import { ChatSurface } from "@/components/demo/ChatSurface";
import { GuidedCaption } from "@/components/demo/GuidedCaption";
import { AgentTrace } from "@/components/demo/AgentTrace";
import { Conversation } from "@/components/demo/Conversation";
import { AllocationDashboard } from "@/components/demo/AllocationDashboard";
import { CreativeMatrix } from "@/components/demo/CreativeMatrix";
import { LifecycleSequence } from "@/components/demo/LifecycleSequence";
import { ReallocationView } from "@/components/demo/ReallocationView";
import { PlanSummary } from "@/components/demo/PlanSummary";

export default function DemoPage() {
  const b = useBeacon();

  return (
    <div className="container-px py-10 sm:py-12">
      <header className="mb-6">
        <Eyebrow className="mb-2">Live demo · the centerpiece</Eyebrow>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hand Beacon a budget.</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-400">
          Type a budget and goal or hit <span className="text-beacon">Run guided demo</span>. Five agents allocate, create, and
          reallocate — every number is real and computed locally. Drag the sliders any time to re-run the math.
        </p>
      </header>

      <div className="space-y-4">
        <ChatSurface
          onRun={b.runPlan}
          onGuided={b.runGuided}
          onSimulate={b.simulate}
          onReset={b.reset}
          running={b.running}
          canSimulate={b.canSimulate}
          hasPlan={b.plan !== null}
        />

        <GuidedCaption caption={b.caption} />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <Conversation messages={b.messages} running={b.running} />
            {b.plan && <PlanSummary summary={b.plan.planSummary} />}
          </div>
          <div className="lg:col-span-7">
            <div className="h-[60vh] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
              <AgentTrace events={b.events} activeAgent={b.activeAgent} running={b.running} />
            </div>
          </div>
        </div>

        <AllocationDashboard
          allocation={b.allocation}
          budget={b.budget}
          targetCac={b.targetCac}
          setBudget={b.setBudget}
          setTargetCac={b.setTargetCac}
          disabled={b.running}
        />

        {b.sim && <ReallocationView sim={b.sim} />}

        {b.plan && (
          <>
            <CreativeMatrix concepts={b.plan.concepts} />
            <LifecycleSequence sequence={b.plan.sequence} />
          </>
        )}
      </div>
    </div>
  );
}
