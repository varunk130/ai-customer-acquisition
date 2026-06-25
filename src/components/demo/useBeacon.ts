"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { runPlan, runSimulation } from "@/agents/orchestrator";
import { allocate } from "@/lib/cac";
import { beaconData } from "@/lib/dataset";
import { num, usd } from "@/lib/format";
import type { PlanResult, SimResult, TraceEvent, AgentId } from "@/agents/types";
import {
  CLOSING_PLAN,
  CLOSING_SIM,
  GUIDED_PROMPT,
  NARRATION,
  PLAN_INTRO,
  SIM_INTRO,
} from "@content/narration";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export type Phase = "idle" | "planning" | "planned" | "simulating" | "simulated";

export function useBeacon() {
  const reduced = useReducedMotion();
  const { defaultBudget, defaultTargetCac } = beaconData.meta;

  const [budget, setBudget] = useState(defaultBudget);
  const [targetCac, setTargetCac] = useState(defaultTargetCac);
  const [phase, setPhase] = useState<Phase>("idle");
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [sim, setSim] = useState<SimResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [caption, setCaption] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);

  const guidedRef = useRef(false);
  const idRef = useRef(0);
  const reducedRef = useRef(false);
  reducedRef.current = !!reduced;

  const allocation = useMemo(() => allocate(budget, targetCac), [budget, targetCac]);

  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, reducedRef.current ? 0 : ms));
  const wait = useCallback((ms: number) => sleep(ms), []);

  const handleEmit = useCallback((e: Omit<TraceEvent, "id" | "ts">) => {
    const ev: TraceEvent = { ...e, id: `ev-${idRef.current++}`, ts: Date.now() };
    setEvents((prev) => [...prev, ev]);
    if (e.status !== "done") setActiveAgent(e.agent);
    if (guidedRef.current && e.status === "thinking" && NARRATION[e.agent]) setCaption(NARRATION[e.agent]);
  }, []);

  const doPlan = useCallback(
    async (goal: string, guided: boolean) => {
      guidedRef.current = guided;
      setPhase("planning");
      setMessages((m) => [...m, { role: "user", text: goal }]);
      if (guided) {
        setCaption(PLAN_INTRO);
        await sleep(1100);
      }
      try {
        const result = await runPlan({ goal, budget, targetCac, emit: handleEmit, wait });
        setPlan(result);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: `Allocated ${usd(result.allocation.deployed)} across 5 channels for ~${num(result.allocation.totals.qualified)} qualified signups/mo at ${usd(result.allocation.totals.qualifiedCac)} CAC. Built ${result.concepts.length} ad concepts and a ${result.sequence.length}-touch lifecycle. Ready to simulate week 1.`,
          },
        ]);
        if (guided) setCaption(CLOSING_PLAN);
        setPhase("planned");
        return result;
      } catch {
        setMessages((m) => [...m, { role: "assistant", text: "Something interrupted the planning run — try again." }]);
        setPhase("idle");
        return null;
      } finally {
        setActiveAgent(null);
      }
    },
    [budget, targetCac, handleEmit, wait],
  );

  const doSimulate = useCallback(
    async (guided: boolean) => {
      guidedRef.current = guided;
      setPhase("simulating");
      setMessages((m) => [...m, { role: "user", text: "Simulate week 1 and reallocate." }]);
      if (guided) {
        setCaption(SIM_INTRO);
        await sleep(1100);
      }
      try {
        const result = await runSimulation({ budget, targetCac, emit: handleEmit, wait });
        setSim(result);
        const before = result.reallocation.before.totals.qualified;
        const after = result.reallocation.after.totals.qualified;
        setMessages((m) => [
          ...m,
          { role: "assistant", text: `Week 1 in: ${result.analystSummary} Projected qualified ${num(before)} → ${num(after)} at the same ${usd(budget)}.` },
        ]);
        if (guided) setCaption(CLOSING_SIM);
        setPhase("simulated");
        return result;
      } catch {
        setMessages((m) => [...m, { role: "assistant", text: "Something interrupted the simulation — try again." }]);
        setPhase("planned");
        return null;
      } finally {
        setActiveAgent(null);
      }
    },
    [budget, targetCac, handleEmit, wait],
  );

  const running = phase === "planning" || phase === "simulating";

  const runPlanAction = useCallback(
    async (goal: string) => {
      if (running) return;
      await doPlan(goal, false);
    },
    [doPlan, running],
  );

  const simulate = useCallback(async () => {
    if (running || !plan) return;
    await doSimulate(false);
  }, [doSimulate, plan, running]);

  const reset = useCallback(() => {
    if (running) return;
    setEvents([]);
    setPlan(null);
    setSim(null);
    setMessages([]);
    setCaption(null);
    setActiveAgent(null);
    setPhase("idle");
  }, [running]);

  const runGuided = useCallback(async () => {
    if (running) return;
    // fresh start at defaults for repeatable storytelling
    setEvents([]);
    setPlan(null);
    setSim(null);
    setMessages([]);
    setBudget(defaultBudget);
    setTargetCac(defaultTargetCac);
    await sleep(60);
    await doPlan(GUIDED_PROMPT, true);
    await sleep(1500);
    await doSimulate(true);
  }, [defaultBudget, defaultTargetCac, doPlan, doSimulate, running]);

  return {
    budget,
    targetCac,
    setBudget,
    setTargetCac,
    allocation,
    phase,
    events,
    plan,
    sim,
    messages,
    caption,
    activeAgent,
    running,
    canSimulate: (phase === "planned" || phase === "simulated") && !running,
    runPlan: runPlanAction,
    simulate,
    runGuided,
    reset,
  };
}
