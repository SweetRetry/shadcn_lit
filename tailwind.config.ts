import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
      },
    },
    extend: {
      transitionProperty: {
        height: "height",
      },
      colors: {
        border: "hsl(var(--ex-border))",
        input: "hsl(var(--ex-input))",
        ring: "hsl(var(--ex-ring))",
        background: "hsl(var(--ex-background))",
        foreground: "hsl(var(--ex-foreground))",
        primary: {
          DEFAULT: "hsl(var(--ex-primary))",
          foreground: "hsl(var(--ex-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--ex-secondary))",
          foreground: "hsl(var(--ex-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--ex-destructive))",
          foreground: "hsl(var(--ex-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--ex-muted))",
          foreground: "hsl(var(--ex-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--ex-accent))",
          foreground: "hsl(var(--ex-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--ex-popover))",
          foreground: "hsl(var(--ex-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--ex-card))",
          foreground: "hsl(var(--ex-card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--ex-radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--ex-radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        mobile: { max: "768px" },
        tablet: { min: "768px", max: "1023px" },
        pc: "1024px",
      },
    },
  },

  plugins: [require("tailwindcss-animate"), "prettier-plugin-tailwindcss"],
};
export default config;
