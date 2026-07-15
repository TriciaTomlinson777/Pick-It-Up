/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'seattle-green': '#2d5016',
        'seattle-blue': '#0066cc',
        'seattle-accent': '#00a651',
      },
    },
  },
  plugins: [],
};
