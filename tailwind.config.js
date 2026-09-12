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
        cream: "#F8EADF",
        cream100: "#E9D5C7",
        cream200: "#DEBBA9",
        dark: "#5D494B",
        
        coral: "#F1888A",
        purple: "#7C5BD1",
        purple100: "#5B4453", 
        softCoral: "#F8D2CD",
        softPurple: "#9A7BE0",
        milkTea: "#9F827A",
        milkTeaBrown: "#B97667",
        milkTeaDark: "#7d625a",
        peach: "#EB9C91",
        softPeach: "#F4C2B0",
      }
    },
  },
  plugins: [],
}

