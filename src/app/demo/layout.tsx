import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo",
  description: "Watch five agents allocate a budget, build the ad matrix and lifecycle, then reallocate on week-1 results — live, no API keys.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
