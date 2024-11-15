/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      color: {
        'custom-beige': '#1E40AF', // Add your custom color
      },
    },
  },
  plugins: [],
};