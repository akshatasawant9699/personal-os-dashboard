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
        'hub-tech': '#3b82f6',
        'hub-career': '#8b5cf6',
        'hub-travel': '#10b981',
      },
    },
  },
  plugins: [],
}
