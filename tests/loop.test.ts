import { test } from "node:test";
import assert from "node:assert/strict";
import { precompute } from "@/lib/precompute";
import { beaconData } from "@/lib/dataset";

test("plan respects the budget and target CAC it was given", async () => {
  const { plan } = await precompute();
  assert.equal(plan.budget, beaconData.meta.defaultBudget);
  assert.equal(plan.targetCac, beaconData.meta.defaultTargetCac);
  assert.ok(plan.allocation.deployed <= plan.budget);
});

test("plan ships creative concepts and a lifecycle sequence", async () => {
  const { plan } = await precompute();
  assert.ok(plan.concepts.length > 0);
  assert.ok(plan.sequence);
});

test("week-1 simulation reports every funded channel", async () => {
  const { plan, sim } = await precompute();
  const funded = plan.allocation.rows.filter((r) => r.spend > 0).map((r) => r.key).sort();
  const reported = sim.week1.rows.map((r) => r.key).sort();
  assert.deepEqual(reported, funded);
});

test("the agent run is deterministic", async () => {
  const a = await precompute();
  const b = await precompute();
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});
