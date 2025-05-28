/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg-primary': '#1a1a1a',
        'dark-bg-secondary': '#242424',
        'dark-bg-tertiary': '#2a2a2a',
        'dark-text-primary': '#ffffff',
        'dark-text-secondary': '#9ca3af',
        'dark-border': '#404040',
        'primary-500': '#3b82f6',
        'primary-600': '#2563eb',
        'primary-700': '#1d4ed8',
      },
    },
  },
  plugins: [],
} 