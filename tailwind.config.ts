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
        border: "hsl(var(--shadcn-lit-border))",
        input: "hsl(var(--shadcn-lit-input))",
        ring: "hsl(var(--shadcn-lit-ring))",
        background: "hsl(var(--shadcn-lit-background))",
        foreground: "hsl(var(--shadcn-lit-foreground))",
        primary: {
          DEFAULT: "hsl(var(--shadcn-lit-primary))",
          foreground: "hsl(var(--shadcn-lit-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--shadcn-lit-secondary))",
          foreground: "hsl(var(--shadcn-lit-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--shadcn-lit-destructive))",
          foreground: "hsl(var(--shadcn-lit-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--shadcn-lit-muted))",
          foreground: "hsl(var(--shadcn-lit-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--shadcn-lit-accent))",
          foreground: "hsl(var(--shadcn-lit-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--shadcn-lit-popover))",
          foreground: "hsl(var(--shadcn-lit-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--shadcn-lit-card))",
          foreground: "hsl(var(--shadcn-lit-card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--shadcn-lit-radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--shadcn-lit-radix-accordion-content-height)" },
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
