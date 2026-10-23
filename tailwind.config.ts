import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D0D0D",
        ocean: "#1A1A1A",
        mist: "#F7F8FA",
        primary: "#7EB3E3",
        "primary-dark": "#5A9AD6",
        "primary-light": "#B8D8F5",
        clay: "#d9785b",
        mint: "#7EB3E3",
        sun: "#F59E0B"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "Inter", "ui-serif", "Georgia"]
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0, 0, 0, 0.06)",
        card: "0 8px 32px rgba(0, 0, 0, 0.08)",
        hover: "0 16px 48px rgba(0, 0, 0, 0.12)"
      },
      borderRadius: {
        'sm': '12px',
        'md': '18px',
        'lg': '24px',
        'xl': '32px'
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(800px circle at 80% 20%, rgba(126, 179, 227, 0.08), transparent 60%)"
      }
    }
  },
  plugins: [forms, containerQueries]
};

export default config;
