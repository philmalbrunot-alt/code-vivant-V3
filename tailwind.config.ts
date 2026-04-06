import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cv: {
          bg: "#070512",
          panel: "#0d0a1f",
          panelAlt: "#120f28",
          line: "#2a2244",
          gold: "#d8a35d",
          goldSoft: "#d8a35d33",
          text: "#f4efe7",
          muted: "#c7c0d3",
          faint: "#8b819f"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(216,163,93,0.18), 0 22px 60px rgba(0,0,0,0.35)"
      },
      fontFamily: {
        serif: ['Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
