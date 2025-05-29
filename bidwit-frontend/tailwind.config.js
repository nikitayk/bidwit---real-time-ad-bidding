/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
        },
        dark: {
          'bg-primary': 'var(--color-dark-bg-primary)',
          'bg-secondary': 'var(--color-dark-bg-secondary)',
          'bg-tertiary': 'var(--color-dark-bg-tertiary)',
          'text-primary': 'var(--color-dark-text-primary)',
          'text-secondary': 'var(--color-dark-text-secondary)',
          'border': 'var(--color-dark-border)',
        },
      },
    },
  },
  plugins: [],
} 