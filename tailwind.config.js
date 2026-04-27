/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: {
          DEFAULT: '#09090b',
          foreground: '#fafafa',
        },
        popover: {
          DEFAULT: '#09090b',
          foreground: '#fafafa',
        },
        primary: {
          DEFAULT: '#fafafa',
          foreground: '#18181b',
        },
        secondary: {
          DEFAULT: '#27272a',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#fafafa',
        },
        destructive: {
          DEFAULT: '#7f1d1d',
          foreground: '#fafafa',
        },
        border: '#27272a',
        input: '#27272a',
        ring: '#d4d4d8',
        brand: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
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
