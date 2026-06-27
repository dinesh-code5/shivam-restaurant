/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FEFCF7',
        cream: {
          50:  '#FDFAF4',
          100: '#FAF5E8',
          200: '#F4EDD6',
          300: '#EDE1C0',
          400: '#E3D0A0',
        },
        gold: {
          50:  '#FBF3DC',
          100: '#F5E3AB',
          200: '#EDD070',
          300: '#E0BB45',
          400: '#C9A227',
          500: '#A8841E',
          600: '#876718',
          DEFAULT: '#C9A227',
        },
        charcoal: {
          50:  '#F5F5F5',
          100: '#E8E8E8',
          300: '#999999',
          500: '#555555',
          700: '#2A2A2A',
          800: '#1C1C1C',
          900: '#111111',
          950: '#080808',
          DEFAULT: '#111111',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Jost"', 'system-ui', 'sans-serif'],
        body:    ['"Jost"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
        widest: '0.25em',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E0BB45 0%, #C9A227 50%, #A8841E 100%)',
        'dark-overlay':  'linear-gradient(to right, rgba(17,17,17,0.88) 0%, rgba(17,17,17,0.45) 60%, transparent 100%)',
        'dark-fade':     'linear-gradient(180deg, rgba(17,17,17,0) 0%, rgba(17,17,17,0.75) 60%, rgba(17,17,17,1) 100%)',
      },
      boxShadow: {
        gold:    '0 4px 24px -4px rgba(201,162,39,0.35)',
        'gold-lg':'0 12px 48px -8px rgba(201,162,39,0.45)',
        luxury:  '0 24px 64px -12px rgba(0,0,0,0.14)',
      },
      animation: {
        'fade-up':   'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fadeIn 1s ease forwards',
        'line-grow': 'lineGrow 0.6s ease forwards',
      },
      keyframes: {
        fadeUp:   { from:{ opacity:'0', transform:'translateY(28px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from:{ opacity:'0' }, to:{ opacity:'1' } },
        lineGrow: { from:{ width:'0' }, to:{ width:'100%' } },
      },
    },
  },
  plugins: [],
}
