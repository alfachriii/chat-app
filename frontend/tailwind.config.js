/** @type {import('tailwindcss').Config} */
import daisyUi from "daisyui"
import tailwindcssAnimated from "tailwindcss-animated"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {

      },
      keyframes: {
        toTop: {
          "0%": { }
        }
      }
    },
  },
  plugins: [
    daisyUi,
    tailwindcssAnimated
  ],
}