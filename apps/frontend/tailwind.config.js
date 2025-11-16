/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#90EE90', // Light green
          light: '#B4F4B4',
          dark: '#6BCB6B',
          50: '#F0FDF0',
          100: '#DCFCDC',
          200: '#B4F4B4',
          300: '#90EE90',
          400: '#6BCB6B',
          500: '#4CAF4C',
          600: '#3D8F3D',
          700: '#2E6F2E',
          800: '#1F4F1F',
          900: '#102F10',
        },
        secondary: {
          DEFAULT: '#4A9EFF', // More saturated blue
          light: '#6BB3FF',
          dark: '#3A7ECC',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B1FF',
          400: '#4A9EFF',
          500: '#3A7ECC',
          600: '#2D5F99',
          700: '#1F3F66',
          800: '#122033',
          900: '#0A1019',
        },
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
        background: {
          light: '#F8FAFC',
          dark: '#0A0A0A',
        },
        surface: {
          light: '#FAFBFC',
          dark: '#141414',
        },
        text: {
          primary: {
            light: '#0F172A',
            dark: '#F1F5F9',
          },
          secondary: {
            light: '#475569',
            dark: '#94A3B8',
          },
        },
      },
    },
  },
  plugins: [],
}

