import type { LifecycleEmail } from "@/lib/types";

// Curated 4-touch onboarding → activation sequence for Northwind. Real, usable copy.
export const LIFECYCLE_SEQUENCE: LifecycleEmail[] = [
  {
    step: 1,
    trigger: "Immediately after signup",
    subject: "Welcome to Northwind — your account is 3 steps from live",
    preheader: "Verify, fund, and you can move money today.",
    goal: "Verify identity & start funding",
    body: `Hi {{first_name}},

Welcome to Northwind — banking built for founders, not branches. You're three quick steps from a live business account:

1. Verify your business (2 minutes, EIN + a doc)
2. Fund it (link an account or wire — instant either way)
3. Issue your first card

Most founders finish before their coffee's cold.

→ Finish setup: {{setup_url}}

Questions? Reply — a human on our team answers.
— The Northwind team`,
  },
  {
    step: 2,
    trigger: "Day 1 · verified but not funded",
    subject: "2 minutes to fund and you're live",
    preheader: "Your account is verified — let's get money moving.",
    goal: "Fund the account",
    body: `Hi {{first_name}},

You're verified — nice. The last step to a working account is funding it, and it takes about two minutes:

• Link an existing account (instant), or
• Send a wire (we'll show you exactly where)

The moment it lands, you can pay vendors, issue cards, and watch your runway update in real time.

→ Fund your account: {{fund_url}}

— The Northwind team`,
  },
  {
    step: 3,
    trigger: "Funded · no card issued in 48h",
    subject: "Issue your first card (and set a limit) in 30 seconds",
    preheader: "Virtual or physical — with a spend limit baked in.",
    goal: "Issue first card (core activation)",
    body: `Hi {{first_name}},

Your account is funded — now make it useful. Issuing a card takes 30 seconds:

• Virtual card instantly for subscriptions and ads
• Physical cards for the team, shipped in days
• Per-card limits, so spend never surprises you

Every swipe shows up in real time and auto-matches its receipt.

→ Issue a card: {{card_url}}

— The Northwind team`,
  },
  {
    step: 4,
    trigger: "Active · finance lead not invited",
    subject: "Add your finance lead — close the books five days faster",
    preheader: "Approvals, AP automation, and GL sync are better with two.",
    goal: "Invite team & enable AP automation",
    body: `Hi {{first_name}},

You're up and running. The teams that get the most from Northwind do one more thing early: bring in whoever owns the money.

Invite your finance lead and they can:
• Set approval rules and card limits
• Auto-reconcile receipts and sync to QuickBooks or NetSuite
• Close month-end in days, not weeks

→ Invite your finance lead: {{invite_url}}

— The Northwind team`,
  },
];
