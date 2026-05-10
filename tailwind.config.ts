import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand
        brand: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BEDBFF",
          300: "#8EC5FF",
          500: "#3B82F6",
          600: "#155DFC",
          700: "#1447E6",
          900: "#1C398E",
        },
        ink: {
          DEFAULT: "#0A0A0A",
          muted:   "#4A5565",
          subtle:  "#717182",
          deep:    "#1C398E",
          slate:   "#364153",
        },
        danger: "#FB2C36",
        warning: {
          50:  "#FFF7ED",
          500: "#F59E0B",
          600: "#F54900",
          900: "#7E2A0C",
        },
        success: {
          50:  "#F0FDF4",
          200: "#B9F8CF",
          500: "#10B981",
          600: "#16A34A",
        },
        accent: {
          50:  "#F5F3FF",
          200: "#E9D4FF",
          500: "#9333EA",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted:   "#F3F3F5",
          line:    "#E5E7EB",
        },
      },
      backgroundImage: {
        "page": "linear-gradient(to bottom, #EFF6FF 0%, #FFFFFF 50%, #EFF6FF 100%)",
      },
      boxShadow: {
        card: "0 4px 6px -4px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1)",
        soft: "0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)",
        btn:  "0 2px 4px -2px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
