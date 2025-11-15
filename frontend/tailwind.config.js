/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,html}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [require("@tailwindcss/line-clamp")],
};
