/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'study-theme':"Frontend/public/study-bg.jpg"
      }
    },
  },
  plugins: [],
}

