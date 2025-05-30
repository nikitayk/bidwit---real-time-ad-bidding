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
        'neon-blue': '#00f3ff',
        'neon-darkblue': '#0066ff',
        'soft-blue': '#99f3ff',
        'soft-darkblue': '#99bbff',
        'cyber-blue': '#00a3ff',
        'cyber-darkblue': '#0033ff',
      },
      keyframes: {
        shimmer: {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': {
            'box-shadow': '0 0 5px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 102, 255, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 10px rgba(0, 243, 255, 0.8), 0 0 30px rgba(0, 102, 255, 0.5)',
          },
        },
        sparkle: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        blink: {
          '0%, 100%': {
            'border-color': 'transparent',
          },
          '50%': {
            'border-color': 'currentColor',
          },
        }
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        sparkle: 'sparkle 3s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
      backgroundImage: {
        'gradient-sparkle': 'linear-gradient(90deg, #00f3ff, #0066ff, #99f3ff, #99bbff, #00f3ff)',
        'gradient-sparkle-alt': 'linear-gradient(90deg, #99bbff, #0066ff, #99f3ff, #00f3ff, #99bbff)',
      },
      backgroundSize: {
        'sparkle': '300% 100%',
      },
    },
  },
  plugins: [],
} 