import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4DD0E1',
          'blue-dark': '#00BCD4',
          'blue-light': '#E0F7FA',
          pink: '#FF7EB3',
          orange: '#FF758C',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F7',
            200: '#E5E5E7',
            300: '#D1D1D6',
            400: '#C7C7CC',
            500: '#AEAEB2',
            600: '#8E8E93',
            700: '#636366',
            800: '#48484A',
            900: '#1C1C1E',
          },
        },
        // Legacy colors for backward compatibility
        whatsapp: {
          green: '#25D366',
          'green-dark': '#128C7E',
          'green-light': '#DCF8C6',
          'gray-light': '#ECE5DD',
          'gray-dark': '#D9D9D9',
        },
      },
      fontFamily: {
        'brand': ['Outfit', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        'brand-display': ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'brand': '12px',
        'brand-large': '16px',
        'brand-xl': '20px',
      },
      boxShadow: {
        'brand': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'brand-hover': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'brand-lg': '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'brand-bounce': 'brand-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'brand-bounce': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config

