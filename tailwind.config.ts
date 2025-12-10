import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // UI Component colors (for shadcn/ui components like Slider)
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          // Marketplace colors from Figma design
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main blue (buttons, logo)
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        ring: "var(--ring)",
        accent: {
          red: '#ef4444', // USED badges, sale tags
          yellow: '#f59e0b',
          green: '#10b981',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // Secondary text
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827', // Primary text
        }
      },
      fontFamily: {
        khmer: ["Noto Sans Khmer", "system-ui", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
