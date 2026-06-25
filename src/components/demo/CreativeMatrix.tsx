"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Sparkles, Megaphone } from "lucide-react";
import { CONCEPTS, ANGLES, FORMAT_LABELS, AUDIENCE_LABELS, FEATURED_CONCEPT_ID, conceptById } from "@content/concepts";
import { toPlatformVariants } from "@/skills/creative-variants";
import type { AdConcept } from "@/lib/types";

function FlipCard({ concept }: { concept: AdConcept }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="[perspective:1200px]">
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-56 w-full rounded-xl text-left [transform-style:preserve-3d] focusable"
        aria-label={`Ad concept: ${concept.headline}. Click to flip.`}
      >
        {/* front */}
        <div className="absolute inset-0 flex flex-col rounded-xl border border-white/[0.08] bg-navy-700/60 p-4 [backface-visibility:hidden]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[10px] text-violet-300">{concept.angleLabel}</span>
            <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-slate-400">{FORMAT_LABELS[concept.format]}</span>
          </div>
          <h4 className="mt-2.5 font-display text-[15px] font-semibold leading-snug text-white">{concept.headline}</h4>
          <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-slate-400">{concept.body}</p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="rounded-md bg-beacon/15 px-2 py-1 text-[11px] font-medium text-beacon">{concept.cta}</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <RotateCw className="h-3 w-3" /> {AUDIENCE_LABELS[concept.audience]}
            </span>
          </div>
        </div>
        {/* back */}
        <div className="absolute inset-0 flex flex-col rounded-xl border border-white/[0.08] bg-navy-800 p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Image / concept brief</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300">{concept.imageBrief}</p>
          <div className="mt-auto flex items-center gap-1 pt-2 text-[10px] text-slate-500">
            <RotateCw className="h-3 w-3" /> flip back
          </div>
        </div>
      </motion.button>
    </div>
  );
}

export function CreativeMatrix({ concepts = CONCEPTS }: { concepts?: AdConcept[] }) {
  const [angle, setAngle] = useState<string>("all");
  const filtered = useMemo(() => (angle === "all" ? concepts : concepts.filter((c) => c.angleId === angle)), [angle, concepts]);
  const featured = conceptById(FEATURED_CONCEPT_ID);
  const variants = useMemo(() => toPlatformVariants(featured), [featured]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-violet-300" />
          <h3 className="font-display text-sm font-semibold text-white">Creative testing matrix</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{concepts.length} concepts · click a card to flip</span>
      </div>

      <div className="p-5">
        {/* angle filter */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setAngle("all")}
            className={`focusable rounded-full border px-2.5 py-1 text-[11px] ${angle === "all" ? "border-beacon/40 bg-beacon/10 text-beacon" : "border-white/10 text-slate-400 hover:text-white"}`}
          >
            All angles
          </button>
          {ANGLES.map((a) => (
            <button
              key={a.id}
              onClick={() => setAngle(a.id)}
              className={`focusable rounded-full border px-2.5 py-1 text-[11px] ${angle === a.id ? "border-beacon/40 bg-beacon/10 text-beacon" : "border-white/10 text-slate-400 hover:text-white"}`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <FlipCard key={c.id} concept={c} />
          ))}
        </div>

        {/* featured → platform variants */}
        <div className="mt-6 rounded-xl border border-white/[0.07] bg-navy-700/40 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-beacon" />
            <h4 className="font-display text-[13px] font-semibold text-white">
              Hero concept → platform variants <span className="font-normal text-slate-500">· via creative-variants</span>
            </h4>
          </div>
          <p className="mt-1 text-[12px] text-slate-400">“{featured.headline}” expanded for each platform&apos;s native spec.</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {variants.map((v) => (
              <div key={v.platform} className="rounded-lg border border-white/[0.07] bg-navy-800/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-white">{v.platform}</span>
                  <span className="rounded bg-beacon/15 px-1.5 py-0.5 text-[10px] text-beacon">{v.cta}</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500">{v.spec}</div>
                {v.headline && <div className="mt-2 text-[12px] font-medium text-slate-200">{v.headline}</div>}
                <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{v.primaryText}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
