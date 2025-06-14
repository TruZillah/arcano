/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#00BFFF',
        'shiny-silver': '#E8E8E8',
        'silver-grey': '#C0C0C0',
        'charcoal': '#36454F',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 