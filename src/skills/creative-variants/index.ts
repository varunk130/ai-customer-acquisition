import type { AdConcept, PlatformVariant } from "@/lib/types";

export const descriptor = {
  name: "creative-variants",
  description: "Turns one winning ad concept into N platform-specific variants (LinkedIn, X, Google RSA, Meta) with the right specs.",
};

const clip = (s: string, n: number): string => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);

// Deterministic transform: one concept → platform-native variants.
export function toPlatformVariants(concept: AdConcept): PlatformVariant[] {
  const firstSentence = concept.body.split(/(?<=[.!?])\s/)[0] ?? concept.body;
  return [
    {
      platform: "LinkedIn",
      spec: "Single image · 1200×627 · ≤150-char primary text",
      headline: clip(concept.headline, 70),
      primaryText: clip(concept.body, 150),
      cta: concept.cta,
    },
    {
      platform: "X / Twitter",
      spec: "Promoted post · ≤280 chars",
      headline: "",
      primaryText: clip(`${concept.headline} — ${firstSentence}`, 270),
      cta: concept.cta,
    },
    {
      platform: "Google RSA",
      spec: "Responsive search · 30-char headlines, 90-char description",
      headline: clip(concept.headline, 30),
      primaryText: clip(firstSentence, 90),
      cta: concept.cta,
    },
    {
      platform: "Meta",
      spec: "Feed · 1080×1080 · ≤125-char primary text",
      headline: clip(concept.headline, 40),
      primaryText: clip(concept.body, 125),
      cta: concept.cta,
    },
  ];
}
