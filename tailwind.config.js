/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060908',
        surface: {
          DEFAULT: '#101A16',
          elevated: '#15231D',
          hover: '#192922',
        },
        brand: {
          emerald: '#16E6A5',
          teal: '#35D9EA',
          gold: '#D4B16A',
          muted: '#A2B2AA',
        },
      },
    },
  },
  plugins: [],
};
