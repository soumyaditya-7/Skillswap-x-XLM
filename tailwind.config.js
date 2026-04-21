/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        surface: {
          900: '#0d0f1a',
          800: '#131625',
          700: '#1a1d30',
          600: '#222540',
        },
        accent: '#a78bfa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease forwards',
        'slide-up':  'slideUp 0.7s ease forwards',
        'pulse-slow':'pulse 4s ease-in-out infinite',
        'float':     'float 6s ease-in-out infinite',
        'glow':      'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        glow:    { '0%': { boxShadow: '0 0 20px #6366f140' }, '100%': { boxShadow: '0 0 40px #6366f180' } },
      },
    },
  },
  plugins: [],
}
