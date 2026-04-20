import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          navy: "#0B1F3B",
          green: "#22C55E",
          surface: "#f3f5f9",
        },
        surface: {
          DEFAULT: "#fafafa",
          card: "#ffffff",
        },
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        card: "0 4px 24px -4px rgb(0 0 0 / 0.08)",
        /** Hafif, üst segment SaaS kartları */
        premium:
          "0 1px 2px rgba(11, 31, 59, 0.04), 0 8px 28px -6px rgba(11, 31, 59, 0.07)",
        "premium-lg":
          "0 2px 4px rgba(11, 31, 59, 0.03), 0 12px 40px -10px rgba(11, 31, 59, 0.09)",
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
