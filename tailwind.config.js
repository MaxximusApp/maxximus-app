/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          masculine: '#DC2626',
          feminine: '#EC4899'
        },
        secondary: {
          masculine: '#7C3AED',
          feminine: '#8B5CF6'
        }
      }
    },
  },
  plugins: [],
}