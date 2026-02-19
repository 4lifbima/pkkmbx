/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7B5AE6',
        'primary-dark': '#6344d0',
      },
      boxShadow: {
        soft: '0 10px 35px rgba(123, 90, 230, 0.25)',
      },
    },
  },
  plugins: [],
}
