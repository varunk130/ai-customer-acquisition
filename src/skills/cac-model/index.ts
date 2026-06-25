import { allocate, allocateBudget, reallocate, simulateWeek1, paybackMonths, WEEK1_MULT } from "@/lib/cac";

export const descriptor = {
  name: "cac-model",
  description: "Reusable budget → CAC → payback calculator: allocates spend across channels by marginal CAC, and powers week-1 reallocation.",
};

export { allocate, allocateBudget, reallocate, simulateWeek1, paybackMonths, WEEK1_MULT };
