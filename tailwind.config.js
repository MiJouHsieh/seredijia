/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#fffbf7",
        dark: "#232323",
        coral: "#F1888A",
        purple: "#7C5BD1",
        softCoral: "#F8D2CD",
        softPurple: "#9A7BE0",
      }
    },
  },
  plugins: [],
}

