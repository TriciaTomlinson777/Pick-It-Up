/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'seattle-green': '#69BE28',
        'seattle-blue': '#002B49',
        'seattle-accent': '#2EC4C7',
      },
    },
  },
  plugins: [],
};
