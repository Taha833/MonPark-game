/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient': 'linear-gradient( #492188, #000)',
        'ft-gradient': 'linear-gradient(#090410,#020104 )'
      }
    },
  },
  plugins: [],
}