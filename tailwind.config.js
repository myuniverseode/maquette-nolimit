/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandOrange: {
          50:  "#FFF5EB", // très clair, presque beige orangé
          100: "#FFE4C7",
          200: "#FFC68C",
          300: "#FFA851",
          400: "#FF8C1F",
          500: "#E07C20", // couleur principale plus douce que D27C04
          600: "#C36B1D",
          700: "#A95A1A",
          800: "#8C4916",
          900: "#6B3611",
          DEFAULT: "#E07C20", // valeur principale
        },
      },
    },
  },
  plugins: [],
}