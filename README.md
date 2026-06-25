# Beacon — an agentic acquisition engine

![Next.js 14](https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![No API keys](https://img.shields.io/badge/API_keys-none-22c55e) ![Runs offline](https://img.shields.io/badge/runs-offline-8b5cf6) ![Deploy: Vercel](https://img.shields.io/badge/deploy-Vercel-000?logo=vercel&logoColor=white)

**Part of the [AI PM Agent Showcase](https://github.com/varunk130/ai-pm-portfolio)** — five standalone agentic apps · App 2 of 5.

> Give an operator a budget and a target. Beacon allocates it across channels, produces the creative, and projects CAC — then reallocates as results come in. And it shows its work.

A standalone, production-quality demo of a **real in-app multi-agent runtime** for paid acquisition. Five named agents take a budget and a CAC target, split it across channels with real optimization, generate a full creative testing matrix and a lifecycle sequence, then reallocate the moment week-1 results land. It runs **completely offline**: no API keys, no external LLM calls, nothing to configure.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · framer-motion · recharts · lucide-react · @faker-js/faker (seed only)

The scenario brands a fictional fintech, **Northwind** (business banking for startups), using synthetic data only.

---

## What this demonstrates

Beacon shows an agentic system running a real acquisition workflow with **genuine computation, not theater**: the budget is allocated by water-filling on marginal CAC under a payback rule, week-1 CAC is recomputed from simulated actuals, and the reallocation is real math. The signature **Agent Trace** makes the multi-agent execution watchable on two levels — a plain-language layer and a technical layer (agent, tool calls, structured results). The **budget/target-CAC sliders re-run the Channel Strategist's optimization live**, and a one-week simulation moves money off the underperformer and onto the winners at the same spend.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Open **/demo** and hit **Run guided demo**, then drag the sliders. To regenerate the dataset:

```bash
npm run seed     # rewrites data/channels.json deterministically
```

Build for production (Vercel-ready, **zero environment variables**):

```bash
npm run build && npm start
```

---

## 60–90s spoken walkthrough script

> "This is **Beacon** — an agentic acquisition engine. Give it a budget and a target, and it builds the plan, the creative, and reallocates as results come in. No API keys — it runs right here.
>
> I'll type the brief: *'I have $50k this month to bring in tech-startup accounts. Build the plan and the creative.'* Watch the **Agent Trace**.
>
> **Beacon** frames the program and dispatches. The **Channel Strategist** water-fills the $50k across five channels by marginal CAC under a payback rule — real optimization — and lands ~156 qualified signups at a $321 blended CAC, leading with paid social. **Creative Studio** assembles a 14-concept testing matrix — angles × formats × audiences — with real headlines and body copy, and expands the hero into platform-native variants. The **Lifecycle Architect** drafts a four-touch onboarding-to-activation sequence. Beacon hands back a first-90-days plan.
>
> Now drag the **budget slider** — the allocation re-runs the real math instantly; tighten the **CAC target** and watch Beacon hold back budget it can't deploy efficiently.
>
> Then I hit **Simulate week 1**. The **Performance Analyst** reads the actuals, recomputes CAC, flags paid social as the underperformer and content + email as winners, and reallocates — same $50k, projected qualified signups rise from 156 to 168.
>
> Real budget math, real ad creative, a live reallocation — all offline. That's Beacon."

---

## Architecture summary

A budget and goal enter the **Orchestrator (Beacon)**, which plans the program and dispatches four typed sub-agents over an observable message bus. Sub-agents call **named skills** that compute over 90 days of local channel data and a **curated content library**. Two kinds of output, both key-free:

- **Analytical** (allocation, CAC, payback, week-1 recompute, reallocation) = genuine computation in `src/lib/cac.ts`.
- **Generative** (ad concepts, lifecycle copy) = assembled from `content/`, routed through one LLM seam (`src/lib/llm.ts`).

The backwards edge — week-1 actuals fed back through `cac-model` — is the reallocation loop.

```
Brief (budget + goal) → Beacon (orchestrator)
        ├─ Channel Strategist  → cac-model            (allocate by marginal CAC)
        ├─ Creative Studio     → content + creative-variants + llm-seam
        ├─ Lifecycle Architect → content:lifecycle
        └─ Performance Analyst → cac-model            (simulate week 1 → reallocate)
   ↑________________ reallocation loop ________________↓
```

### Project structure

| Path | What's there |
| --- | --- |
| `data/seed.ts` → `data/channels.json` | Deterministic seed: 90 days, 5 channels, response-curve params, LTV by segment, competitors, personas |
| `src/lib/cac.ts` | The real model: response curves, CAC/payback, water-filling allocation, week-1 sim, reallocation |
| `src/lib/` | `dataset`, `types`, `llm` (the seam), `format`, `precompute` |
| `src/skills/` | `cac-model`, `creative-variants` — reusable, invoked by name |
| `src/agents/` | `orchestrator` (Beacon) + four typed sub-agent modules + trace types |
| `content/` | Curated ad concepts, lifecycle sequence, narration |
| `src/components/demo/` | Agent Trace, allocation dashboard + sliders, creative matrix, lifecycle, reallocation view |
| `src/app/` | Home · Problem→Solution · How it works · Live demo · Results |

---

## Agents & skills

### Agents
| Agent | Role | What it does |
| --- | --- | --- |
| **Beacon** | Orchestrator | Owns the budget and goal, plans the program, reallocates as results land. |
| **Channel Strategist** | Analysis | Allocates budget across channels by marginal CAC under a payback rule. |
| **Creative Studio** | Generative | Builds the ad testing matrix (angle × format × audience) and platform variants. |
| **Lifecycle Architect** | Generative | Drafts the onboarding → activation email sequence. |
| **Performance Analyst** | Analysis | Recomputes CAC on week-1 results and recommends a reallocation. |

### Skills (reusable, invoked by name)
| Skill | One-liner |
| --- | --- |
| `cac-model` | Budget → CAC → payback calculator: water-fills spend by marginal CAC; powers week-1 reallocation. |
| `creative-variants` | Turns one winning concept into N platform-specific variants (LinkedIn, X, Google RSA, Meta). |

---

## The allocation math (real, and slider-driven)

Each channel has a fitted monthly response curve `signups(s) = cap · s / (s + half)`, so blended CAC rises with spend (diminishing returns). The Channel Strategist greedily allocates each increment of budget to the channel with the highest **marginal qualified-signups-per-dollar**, capped where a channel's blended qualified CAC would exceed the target — i.e. water-filling, which is optimal for a concave, separable objective. The budget and target-CAC sliders call exactly this function, so the dashboard re-derives the optimal mix in real time. Tighten the target and Beacon will hold budget back rather than overspend.

---

## Optional LLM adapter (how to enable a real model later)

The app is fully functional with **zero** model calls. Generative agents call one seam, `agentLLM.generate()` (`src/lib/llm.ts`), which by default selects deterministically from the curated `content/` library. To route generation through a real model (e.g. **Claude Opus 4.8**) later, register an adapter once at startup — no other code changes:

```ts
import { configureModelAdapter } from "@/lib/llm";

configureModelAdapter(async (req) => {
  const res = await fetch(process.env.MODEL_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.MODEL_KEY}` },
    body: JSON.stringify({ prompt: buildPrompt(req) }),
  });
  return (await res.json()).text;
});
```

The seam reports a `source` (`curated-library` | `model`) that surfaces in the trace. **The app never requires this** and ships without it.

---

## Swap synthetic data for a real source

The runtime depends only on the typed shape in `src/lib/dataset-types.ts` (`BeaconData`). To use real data:

1. Produce a `BeaconData` object from your ad platforms / warehouse (per-channel spend, impressions, clicks, signups, qualified, plus a fitted `cap`/`half`/`qualRate`/`ltv` per channel) — for example an ETL that writes `data/channels.json`.
2. Point `src/lib/dataset.ts` at it (replace the JSON import).
3. Fit each channel's response curve from history (`cap`, `half`) and set segment LTVs.

Everything downstream — allocation, CAC/payback, the agents, the sliders — is data-source-agnostic and keeps working.

---

## Notes

- **Offline by design:** no API keys, no runtime network calls. Deploys to Vercel with no env vars.
- **Accessibility:** keyboard navigable, visible focus, AA contrast, `prefers-reduced-motion` respected.
- **Determinism:** the dataset, allocation, and week-1 simulation are seeded, so the demo reproduces exactly.

Built by **Varun Kulkarni** · synthetic data · for an internal AI-upskilling showcase.

