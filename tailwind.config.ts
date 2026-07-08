import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Pure black & white system — accent is white-on-black (or the
        // inverse), no hue anywhere. Status colors in the admin dashboard
        // are the one intentional exception (internal tool, not brand-facing).
        accent: {
          DEFAULT: "#ffffff",
          dim: "#d4d4d8",
        },
        bg: {
          DEFAULT: "#000000",
          soft: "#0a0a0a",
          card: "#111111",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.06), transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
