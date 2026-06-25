import type { AdConcept, AdAudience, AdFormat } from "@/lib/types";

export const ANGLES: { id: string; label: string; thesis: string }[] = [
  { id: "speed", label: "Founder speed", thesis: "Open and move money in minutes, not weeks." },
  { id: "runway", label: "Runway in real time", thesis: "See cash, burn, and runway live." },
  { id: "control", label: "Spend control", thesis: "Cards, limits, and AP automation without the spreadsheet." },
  { id: "built", label: "Built for startups", thesis: "Designed for how startups actually run — unlike incumbents." },
  { id: "switch", label: "Easy switch", thesis: "Migrate in an afternoon, guided." },
  { id: "trust", label: "Safe & clear", thesis: "FDIC coverage, clear fees, real controls." },
];

export const FORMAT_LABELS: Record<AdFormat, string> = {
  linkedin_single: "LinkedIn",
  x_post: "X / Twitter",
  search_rsa: "Google RSA",
  display: "Display",
};

export const AUDIENCE_LABELS: Record<AdAudience, string> = {
  founder: "Founder / CEO",
  finance_lead: "Finance lead",
};

export const CONCEPTS: AdConcept[] = [
  {
    id: "c01", angleId: "speed", angleLabel: "Founder speed", format: "linkedin_single", audience: "founder",
    headline: "Open a business account before your coffee's cold",
    body: "Northwind gets founders a real business account in minutes — no branch visit, no faxed forms. Wire, pay, and issue cards on day one.",
    cta: "Open an account",
    imageBrief: "Espresso cup beside a laptop showing an 'Account ready ✓' toast; a thin gold progress ring at 100%. Dark UI, warm gold accent.",
  },
  {
    id: "c02", angleId: "speed", angleLabel: "Founder speed", format: "search_rsa", audience: "founder",
    headline: "Business banking in minutes",
    body: "Open online, move money instantly, issue cards today. Built for startups, not branches.",
    cta: "Start now",
    imageBrief: "Responsive search ad — pair with sitelinks: Pricing · Switch · Cards · Runway.",
  },
  {
    id: "c03", angleId: "runway", angleLabel: "Runway in real time", format: "linkedin_single", audience: "founder",
    headline: "Know your runway to the day",
    body: "Northwind shows live cash, burn, and runway right in your dashboard — so you walk into the board meeting with the number already in your head.",
    cta: "See live runway",
    imageBrief: "Dashboard hero: a descending runway line with a 'months left' figure; indigo line, gold marker at 'today'. Calm, dark.",
  },
  {
    id: "c04", angleId: "runway", angleLabel: "Runway in real time", format: "x_post", audience: "founder",
    headline: "Your runway shouldn't live in a spreadsheet.",
    body: "Northwind puts live cash, burn, and runway on one screen. Founders stop guessing and start deciding.",
    cta: "See it live",
    imageBrief: "Looping concept: a messy spreadsheet dissolving into a clean runway chart.",
  },
  {
    id: "c05", angleId: "control", angleLabel: "Spend control", format: "linkedin_single", audience: "finance_lead",
    headline: "Close the books five days faster",
    body: "Issue cards with built-in limits, auto-match receipts, and sync to your GL. Northwind turns month-end from a slog into a click.",
    cta: "Automate AP",
    imageBrief: "Before/after calendar: 'Day 8' struck through, 'Day 3' highlighted gold; receipts snapping into matched rows.",
  },
  {
    id: "c06", angleId: "control", angleLabel: "Spend control", format: "search_rsa", audience: "finance_lead",
    headline: "Spend control for startups",
    body: "Cards with limits and approvals, auto-reconciliation, and sync to QuickBooks & NetSuite.",
    cta: "See how",
    imageBrief: "Responsive search ad — callout extensions: Auto-reconcile · Approvals · GL sync.",
  },
  {
    id: "c07", angleId: "built", angleLabel: "Built for startups", format: "linkedin_single", audience: "founder",
    headline: "Your bank still treats you like a 1998 small business",
    body: "Incumbents bolt startups onto SMB products. Northwind is built for how startups actually run — runway, cards, AP, and investor-ready statements.",
    cta: "Switch to Northwind",
    imageBrief: "A dusty paper ledger beside a sleek dark dashboard; a gold 'built for startups' stamp across the corner.",
  },
  {
    id: "c08", angleId: "built", angleLabel: "Built for startups", format: "display", audience: "founder",
    headline: "Banking that gets startups",
    body: "Runway, cards, and AP in one account. Open in minutes.",
    cta: "Open account",
    imageBrief: "Display 300×250: bold wordmark, a runway sparkline, a single gold CTA button on near-black.",
  },
  {
    id: "c09", angleId: "switch", angleLabel: "Easy switch", format: "linkedin_single", audience: "finance_lead",
    headline: "Switch banks in an afternoon",
    body: "Guided migration moves your payees, cards, and recurring payments. White-glove help if you want it — most teams are live the same day.",
    cta: "Start the switch",
    imageBrief: "A migration progress bar at 92% with a checklist auto-ticking; calm, reassuring, indigo + gold.",
  },
  {
    id: "c10", angleId: "switch", angleLabel: "Easy switch", format: "x_post", audience: "finance_lead",
    headline: "Dreading a bank switch?",
    body: "Northwind's guided migration moves payees, cards, and recurring payments in an afternoon. We'll do it with you.",
    cta: "Switch now",
    imageBrief: "Short loop: a checklist ticking from 0 to 100%.",
  },
  {
    id: "c11", angleId: "trust", angleLabel: "Safe & clear", format: "linkedin_single", audience: "founder",
    headline: "Move fast — your money still sits still",
    body: "Up to $3M FDIC insurance through partner banks, transparent fees, and SOC 2 controls. Startup speed, grown-up safeguards.",
    cta: "See the safeguards",
    imageBrief: "A vault with subtle speed lines; a shield badge reading '$3M FDIC' and 'SOC 2' in gold/indigo.",
  },
  {
    id: "c12", angleId: "trust", angleLabel: "Safe & clear", format: "display", audience: "finance_lead",
    headline: "$3M FDIC. Zero surprises.",
    body: "Clear pricing, real controls, and books that reconcile themselves.",
    cta: "Learn more",
    imageBrief: "Display 728×90 leaderboard: shield icon, '$3M FDIC' headline, gold CTA on dark navy.",
  },
  {
    id: "c13", angleId: "control", angleLabel: "Spend control", format: "linkedin_single", audience: "founder",
    headline: "Give the team cards. Keep the control.",
    body: "Issue virtual and physical cards with per-card limits in seconds — and see every dollar in real time. No more 'who expensed this?'",
    cta: "Issue a card",
    imageBrief: "A grid of virtual cards lighting up; a per-card limit slider; a live transaction feed on the right.",
  },
  {
    id: "c14", angleId: "runway", angleLabel: "Runway in real time", format: "search_rsa", audience: "finance_lead",
    headline: "Live runway & burn",
    body: "Cash, burn, and runway in one dashboard. Export a board-ready view in a click.",
    cta: "Try Northwind",
    imageBrief: "Responsive search ad — sitelinks: Runway · AP automation · Cards · Pricing.",
  },
];

// The concept the Creative Studio features and the creative-variants skill expands.
export const FEATURED_CONCEPT_ID = "c03";

export function conceptById(id: string): AdConcept {
  return CONCEPTS.find((c) => c.id === id) ?? CONCEPTS[0];
}
