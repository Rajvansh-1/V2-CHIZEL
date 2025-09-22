/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        overlay: "var(--color-overlay)",
        "primary-alpha": "var(--color-primary-alpha)",
        "accent-alpha": "var(--color-accent-alpha)",
        card: "var(--color-card)",
        text: "var(--color-text)",
        "secondary-text": "var(--color-secondary-text)",
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        "badge-bg": "var(--color-badge-bg)",
        "badge-text": "var(--color-badge-text)",
        border: "var(--color-border)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
        display: "var(--font-display)",
        ui: "var(--font-ui)",
      },
      animation: {
        "gradient-animation": "gradient-animation 8s linear infinite",
        "icon-glow": "icon-glow 2.5s infinite ease-in-out",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "scale-up": "scaleUp 0.3s ease-out forwards",
        "parallax-slow": "parallax-slow 25s infinite ease-in-out",
        "parallax-medium": "parallax-medium 20s infinite ease-in-out",
        "parallax-fast": "parallax-fast 15s infinite ease-in-out",
        "flicker-fast": "flicker 1.5s infinite ease-in-out",
        "flicker-slow": "flicker 2s infinite ease-in-out",
        float: "float 6s infinite ease-in-out",
        "rocket-bounce": "rocket-bounce 2.5s infinite ease-in-out",
        "shine-sweep": "shine-sweep 3s infinite linear",
        scanline: "scanline 10s linear infinite",
        flicker: "flicker 0.08s infinite alternate",
        twinkle: "twinkle 2s infinite alternate",
      },
      keyframes: {
        "gradient-animation": {
          "0%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
          "100%": {
            "background-position": "0% 50%",
          },
        },
        "icon-glow": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 3px var(--color-primary))",
            transform: "scale(1)",
          },
          "50%": {
            filter: "drop-shadow(0 0 10px var(--color-primary))",
            transform: "scale(1.1)",
          },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scaleUp: {
          from: { transform: "scale(0.95)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        "parallax-slow": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "50%": { transform: "translate(100px, -150px) rotate(15deg)" },
        },
        "parallax-medium": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "50%": { transform: "translate(-80px, -100px) rotate(-15deg)" },
        },
        "parallax-fast": {
          "0%, 100%": { transform: "translate(-50%, 0) rotate(0deg)" },
          "50%": { transform: "translate(-50%, -80px) rotate(10deg)" },
        },
        flicker: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-5deg)" },
          "50%": { transform: "translateY(-15px) rotate(5deg)" },
        },
        "rocket-bounce": {
          "0%, 100%": { transform: "translateY(0) rotate(-15deg)" },
          "50%": { transform: "translateY(-10px) rotate(5deg)" },
        },
        "shine-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        scanline: {
          "0%": { "background-position": "0 0" },
          "100%": { "background-position": "0 100%" },
        },
        twinkle: {
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};