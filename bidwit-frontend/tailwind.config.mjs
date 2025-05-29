/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
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
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 