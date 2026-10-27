/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FBF8F5",
        ink: "#372129",
        // Figma surfaces
        card: "#F5F3F1",
        placeholder: "#FFD6F0",
        "pill-pink": "#FFE7F6",
        "pill-teal": "#DEF5F3",
        "pill-yellow": "#FFF5BE",
        // Hero letter colours
        "hero-pink": "#F383CA",
        "hero-teal": "#27BCB2",
        muted: "#7A616A",
        // Solid pink used for hero + work card surfaces
        blush: "#F6AFD7",
        // Light-pink pill / chip background
        petal: "#FEEDED",
        accent: {
          DEFAULT: "#F6AFD7",
          soft: "#FEEDED",
          glow: "#FCDCEC",
        },
        // Tag palette
        "tag-green":        "#B8EEB1",
        "tag-green-light":  "#D8F6D4",
        "tag-yellow":       "#FEEF99",
        "tag-yellow-light": "#FFF5BE",
        "tag-purple":       "#E2DDFC",
        "tag-purple-light": "#F0EDFF",
        "tag-pink":         "#FFD6F0",
        "tag-pink-light":   "#FFE7F6",
      },
      fontFamily: {
        sans: ["Figtree", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        card: "32px",
      },
      boxShadow: {
        glass: "0 8px 15px rgba(55, 33, 41, 0.04)",
        "glass-lg": "0 20px 30px rgba(55, 33, 41, 0.07)",
        glow: "0 0 0 0.5px rgba(246, 175, 215, 0.2), 0 16px 25px rgba(246, 175, 215, 0.25)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
