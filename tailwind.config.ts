import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Restraint is the brief: 3 brand colors, the rest neutrals.
        ink: {
          DEFAULT: "#0A0A0A",
          50: "#1a1a1a",
          100: "#0e0e0e",
        },
        plum: {
          DEFAULT: "#6C2BD9",
          glow: "#8A4FE8",
          deep: "#3D1873",
        },
        bone: {
          DEFAULT: "#F8F8F6",
          dim: "#B8B8B5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      // One easing curve, used everywhere. Premium feel comes from consistency.
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-up": "fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
