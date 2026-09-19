import { test } from "node:test";
import assert from "node:assert/strict";
import { allocate, allocateBudget, cacAt, marginalQualPerDollar, qualCacAt, reallocate, signupsAt, WEEK1_MULT } from "@/lib/cac";
import { beaconData, channels } from "@/lib/dataset";

const { defaultBudget, defaultTargetCac } = beaconData.meta;

test("response curve has diminishing returns", () => {
  for (const ch of channels) {
    assert.equal(signupsAt(ch, 0), 0);
    assert.ok(signupsAt(ch, 20000) > signupsAt(ch, 10000));
    assert.ok(cacAt(ch, 20000) > cacAt(ch, 10000), `${ch.key}: CAC should rise with spend`);
    assert.ok(marginalQualPerDollar(ch, 20000) < marginalQualPerDollar(ch, 10000));
  }
});

test("allocation never deploys more than the budget", () => {
  for (const budget of [5000, defaultBudget, 250000]) {
    const a = allocate(budget, defaultTargetCac);
    assert.ok(a.deployed <= budget);
    assert.equal(a.deployed + a.leftover, budget);
    const sum = a.rows.reduce((s, r) => s + r.spend, 0);
    assert.equal(sum, a.deployed);
  }
});

test("every funded channel stays within the qualified-CAC target", () => {
  const a = allocate(defaultBudget, defaultTargetCac);
  for (const r of a.rows) {
    if (r.spend === 0) continue;
    const ch = channels.find((c) => c.key === r.key)!;
    assert.ok(qualCacAt(ch, r.spend) <= defaultTargetCac + 1e-6, `${r.key} over target`);
  }
});

test("channel shares of deployed spend sum to 1", () => {
  const a = allocate(defaultBudget, defaultTargetCac);
  const total = a.rows.reduce((s, r) => s + r.sharePct, 0);
  assert.ok(Math.abs(total - 1) < 1e-9);
});

test("a stricter CAC target deploys less budget", () => {
  const loose = allocate(defaultBudget, defaultTargetCac);
  const strict = allocate(defaultBudget, defaultTargetCac / 2);
  assert.ok(strict.deployed <= loose.deployed);
});

test("zero budget allocates nothing", () => {
  const a = allocateBudget(channels, 0, defaultTargetCac);
  assert.equal(a.deployed, 0);
  assert.equal(a.totals.signups, 0);
});

test("reallocation moves spend toward week-1 winners and away from losers", () => {
  const { before, after } = reallocate(channels, defaultBudget, defaultTargetCac, WEEK1_MULT);
  const spend = (a: typeof before, k: string) => a.rows.find((r) => r.key === k)!.spend;
  assert.ok(spend(after, "content_seo") >= spend(before, "content_seo"));
  assert.ok(spend(after, "paid_social") <= spend(before, "paid_social"));
});
