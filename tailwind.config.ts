import { type Config } from "tailwindcss";

export default {
  content: [
    "./routes/**/*.{ts,tsx,js,jsx}",
    "./islands/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#232136",
        surface: "#2a273f",
        overlay: "#393552",
        muted: "#6e6a86",
        accent: "#eb6f92",
        iris: "#c4a7e7",
        pine: "#3e8fb0",
        text: "#e0def4",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
