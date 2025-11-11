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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          50: '#f8fafc',
          100: '#1e293b',
          200: '#1a202e',
          300: '#151b28',
          400: '#0f1419',
          500: '#0a0e13',
          600: '#06090d',
          700: '#030507',
          800: '#020304',
          900: '#000000',
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          text: '#e2e8f0',
          muted: '#94a3b8',
        },
        accent: {
          purple: '#a78bfa',
          pink: '#f472b6',
          cyan: '#22d3ee',
          gold: '#fbbf24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-light': 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
        'gradient-accent': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      },
      boxShadow: {
        'dark-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
        'glow': '0 0 20px rgba(167, 139, 250, 0.4)',
        'glow-strong': '0 0 30px rgba(167, 139, 250, 0.6)',
      }
    },
  },
  plugins: [],
}
