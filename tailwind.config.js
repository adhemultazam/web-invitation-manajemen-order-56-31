
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        wedding: {
          primary: "#9A84FF",
          secondary: "#C4B5FD", 
          light: "#F3F0FF",
          accent: "#7A5AF8",
          muted: "#EDE9FE",
        },
        sidebar: {
          dark: "#1E1E2F",
          text: "#F4F4F5",
          secondary: "#A0A0B0",
          accent: "#6366F1",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'card': '0 8px 20px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "hover-scale": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.03)" }
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "rotate-in": {
          "0%": { transform: "rotate(-10deg) scale(0.95)", opacity: "0" },
          "100%": { transform: "rotate(0) scale(1)", opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "hover-scale": "hover-scale 0.3s ease-out forwards",
        "count-up": "count-up 0.8s ease-out forwards",
        "rotate-in": "rotate-in 0.5s ease-out forwards"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
