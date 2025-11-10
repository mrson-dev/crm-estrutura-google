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
        'primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'accent': 'rgb(var(--color-accent) / <alpha-value>)',
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.3s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-in-out forwards',
      },
      keyframes: {
        'fade-in-scale': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  },
  plugins: [],
}
