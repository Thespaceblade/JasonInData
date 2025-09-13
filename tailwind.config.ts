import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        dark: "var(--dark)",
        primary: "var(--primary)",
        paper: "var(--paper)",
        border: "var(--border)",
      },
      boxShadow: {
        note: "0 8px 24px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        lg: "12px",
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "var(--font-figtree)", "system-ui"],
      },
      transitionTimingFunction: {
        "in-out-soft": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

