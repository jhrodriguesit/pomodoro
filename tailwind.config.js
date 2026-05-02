/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#F5F0E8',
          text: '#2C1810',
          'dark-bg': '#1C1714',
          'dark-text': '#E8E0D0',
          accent: '#C4622D',
          'accent-muted': '#E8956B',
          muted: '#8B7355',
          'dark-muted': '#9E8E78',
          surface: '#EDE7D9',
          'dark-surface': '#26211E',
          border: '#C8B99A',
          'dark-border': '#3D3530',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
