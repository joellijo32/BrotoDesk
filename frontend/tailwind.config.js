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
        // Brototype Red as Primary
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main Brototype Red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Dark theme colors
        dark: {
          bg: '#000000',        // Pure black
          card: '#0f0f0f',      // Very dark gray for cards
          border: '#1f1f1f',    // Subtle border
          text: '#ffffff',      // Pure white text
          muted: '#a3a3a3',     // Muted gray text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-dark': 'linear-gradient(180deg, #000000 0%, #0f0f0f 100%)',
      },
      boxShadow: {
        'red-glow': '0 4px 20px rgba(239, 68, 68, 0.3)',
        'red-glow-lg': '0 8px 30px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
