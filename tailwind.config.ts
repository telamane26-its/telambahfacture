import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        
        // Minimalist monochrome palette (Black, Slate, Gray, White)
        brand: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#0F172A", // Primary slate-900 / black
          600: "#1E293B", // Slate-800
          700: "#334155", // Slate-700
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617", // Deepest black
        },

        // Status colors specified in prompt:
        // Vert pour payée, orange pour envoyée, gris pour brouillon, rouge pour en retard
        status: {
          paid: {
            bg: "#ECFDF3",
            text: "#027A48",
            border: "#A6F4C5",
            dot: "#12B76A",
          },
          sent: {
            bg: "#FFFAEB",
            text: "#B54708",
            border: "#FEDF89",
            dot: "#F79009",
          },
          draft: {
            bg: "#F2F4F7",
            text: "#344054",
            border: "#EAECF0",
            dot: "#667085",
          },
          overdue: {
            bg: "#FEF3F2",
            text: "#B42318",
            border: "#FECDCA",
            dot: "#F04438",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(16, 24, 40, 0.04)",
        card: "0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)",
        dropdown: "0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.04)",
        brand: "0 4px 14px 0 rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
