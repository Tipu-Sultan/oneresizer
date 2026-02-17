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
        bg: "#0a0a0f",
        surface: "#111118",
        panel: "#16161f",
        border: "#22222e",
        accent: "#7c6fff",
        accent2: "#ff6f91",
        muted: "#5a5a72",
        success: "#4fffb0",
        warn: "#ffcc44",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        panel: "16px",
      },
      animation: {
        popIn: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
      keyframes: {
        popIn: {
          from: { opacity: "0", transform: "scale(0.96) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
