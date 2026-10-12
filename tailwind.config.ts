import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4942B",
          hover: "#B87F22",
          light: "#FDF8EE",
        },
        secondary: {
          DEFAULT: "#111111",
          hover: "#222222",
          light: "#333333",
        },
        accent: {
          DEFAULT: "#F3C973",
          light: "#FBF0D9",
        },
        background: "#FAF8F5",
        gold: {
          DEFAULT: "#D4942B",
          primary: "#D4942B",
          accent: "#F3C973",
          light: "#FDF8EE",
          dark: "#A36F1C",
        },
        noir: {
          DEFAULT: "#111111",
          secondary: "#1A1A1A",
          muted: "#4A4A4A",
          light: "#2B2B2B",
        },
        surface: {
          DEFAULT: "#fbf9f6",
          soft: "#FAF8F5",
          paper: "#FFFFFF",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 148, 43, 0.25)",
        "gold-lg": "0 10px 25px -3px rgba(212, 148, 43, 0.35)",
        luxe: "0 10px 30px -5px rgba(17, 17, 17, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
