import { agentLLM } from "@/lib/llm";
import { toPlatformVariants } from "@/skills/creative-variants";
import { CONCEPTS, FORMAT_LABELS, FEATURED_CONCEPT_ID, conceptById } from "@content/concepts";
import type { AdConcept } from "@/lib/types";
import type { AgentContext } from "./types";
import { unique } from "./util";

// Creative Studio — assembles the ad testing matrix from the curated library, and
// expands the hero concept into platform variants via the creative-variants skill.
export async function runCreativeStudio(
  ctx: AgentContext,
): Promise<{ concepts: AdConcept[]; matrixNote: string; source: string }> {
  ctx.emit({
    phase: ctx.phase,
    agent: "creative-studio",
    status: "thinking",
    headline: "Assembling the ad testing matrix — angle × format × audience…",
  });
  await ctx.wait(800);

  const concepts = CONCEPTS;
  const angles = unique(concepts.map((c) => c.angleLabel));
  const formats = unique(concepts.map((c) => FORMAT_LABELS[c.format]));
  const featured = conceptById(FEATURED_CONCEPT_ID);

  const hero = await agentLLM.generate({
    task: "hero-ad",
    context: { angle: featured.angleId },
    candidates: concepts.filter((c) => c.angleId === featured.angleId).map((c) => c.headline),
    seed: ctx.seed,
  });
  const variants = toPlatformVariants(featured);

  ctx.emit({
    phase: ctx.phase,
    agent: "creative-studio",
    status: "done",
    headline: `Built a ${concepts.length}-concept testing matrix with real copy.`,
    detail: `${angles.length} angles × ${formats.length} formats × 2 audiences. Hero concept “${hero.text}” expanded into ${variants.length} platform variants.`,
    toolCalls: [
      { tool: "library.select()", skill: "content:concepts", input: `${concepts.length} concepts`, output: `${angles.length} angles` },
      { tool: "agentLLM.generate()", skill: "llm-seam", input: "task = hero-ad", output: `source = ${hero.source}` },
      { tool: "toPlatformVariants()", skill: "creative-variants", input: featured.id, output: `${variants.length} variants` },
    ],
    chips: [
      { label: "Concepts", value: String(concepts.length), tone: "accent" },
      { label: "Angles", value: String(angles.length) },
      { label: "Formats", value: String(formats.length) },
      { label: "Variants", value: String(variants.length), tone: "good" },
    ],
    handoffTo: "lifecycle-architect",
  });

  return { concepts, matrixNote: hero.text, source: hero.source };
}
