/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1ed760",
          "green-hover": "#1fdf64",
          "green-dark": "#169c46",
          black: "#121212",
          dark: "#181818",
          darker: "#000000",
          card: "#181818",
          "card-hover": "#282828",
          subtext: "#b3b3b3",
          light: "#282828",
        }
      },
      fontFamily: {
        sans: ['"Circular Std"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
