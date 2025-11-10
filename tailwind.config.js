/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        primary: '#007bff',
        secondary: '#28a745',
        danger: '#dc3545',
        text: '#343a40',
        background: '#FFFFFF',
        'background-light': '#f8f9fa',
      },
    },
  },
  plugins: [],
}

