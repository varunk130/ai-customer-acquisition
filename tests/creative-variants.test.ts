import { test } from "node:test";
import assert from "node:assert/strict";
import { toPlatformVariants } from "@/skills/creative-variants";
import type { AdConcept } from "@/lib/types";

const LIMITS: Record<string, { headline: number; primaryText: number }> = {
  LinkedIn: { headline: 70, primaryText: 150 },
  "X / Twitter": { headline: 0, primaryText: 270 },
  "Google RSA": { headline: 30, primaryText: 90 },
  Meta: { headline: 40, primaryText: 125 },
};

const concept = (headline: string, body: string): AdConcept =>
  ({ headline, body, cta: "Open an account" }) as AdConcept;

test("one concept yields one variant per supported platform", () => {
  const v = toPlatformVariants(concept("Banking for founders", "Open in minutes. No fees."));
  assert.deepEqual(v.map((x) => x.platform), Object.keys(LIMITS));
});

test("long copy is clipped to each platform's character limits", () => {
  const long = concept("H".repeat(200), `${"Word ".repeat(80)}. Second sentence.`);
  for (const v of toPlatformVariants(long)) {
    const lim = LIMITS[v.platform];
    assert.ok(v.headline.length <= lim.headline, `${v.platform} headline ${v.headline.length}`);
    assert.ok(v.primaryText.length <= lim.primaryText, `${v.platform} text ${v.primaryText.length}`);
  }
});

test("short copy passes through unchanged", () => {
  const v = toPlatformVariants(concept("Bank smarter", "Zero fees."));
  const li = v.find((x) => x.platform === "LinkedIn")!;
  assert.equal(li.headline, "Bank smarter");
  assert.equal(li.primaryText, "Zero fees.");
});

test("CTA carries through to every variant", () => {
  for (const v of toPlatformVariants(concept("A", "B."))) assert.equal(v.cta, "Open an account");
});
