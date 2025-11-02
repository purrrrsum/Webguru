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
        whatsapp: {
          green: '#25D366',
          'green-dark': '#128C7E',
          'green-light': '#DCF8C6',
          'gray-light': '#ECE5DD',
          'gray-dark': '#D9D9D9',
        },
      },
    },
  },
  plugins: [],
}
export default config

