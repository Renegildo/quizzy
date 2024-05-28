/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#14121D",
        backgroundDarker: "#0F0D15",
        mutedText: "#AFAFAF",
        secondary: "#1A1A24",

        purpleAccent: "#816CBF"
      }
    },
  },
  plugins: [],
}

