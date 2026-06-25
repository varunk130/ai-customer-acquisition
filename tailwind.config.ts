import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A0E1A",
          950: "#070A12",
          900: "#0A0E1A",
          800: "#0F1424",
          700: "#151B30",
          600: "#1C2440",
          500: "#283154",
        },
        beacon: {
          DEFAULT: "#FFC24B",
          soft: "#FFD888",
          dim: "#E0A53A",
        },
        indigo2: {
          DEFAULT: "#7AA2FF",
          soft: "#A9C2FF",
          dim: "#5A7FE0",
        },
        win: "#34D399",
        loss: "#FB7185",
        // channel palette
        ch1: "#7AA2FF", // paid search - indigo
        ch2: "#B49CFF", // paid social - violet
        ch3: "#5EEAD4", // content/seo - teal
        ch4: "#FFC24B", // lifecycle email - gold
        ch5: "#F58E8E", // partnerships - rose
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        beacon: "0 0 0 1px rgba(255,194,75,0.25), 0 0 28px -4px rgba(255,194,75,0.4)",
        indigo: "0 0 0 1px rgba(122,162,255,0.22), 0 0 24px -6px rgba(122,162,255,0.35)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 14px 44px -16px rgba(0,0,0,0.7)",
      },
      keyframes: {
        "pulse-node": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,194,75,0.45)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255,194,75,0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-node": "pulse-node 1.6s ease-out infinite",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
