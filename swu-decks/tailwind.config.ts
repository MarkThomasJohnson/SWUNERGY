import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f6ff',
          100: '#e6efff',
          200: '#cfe0ff',
          300: '#a9c7ff',
          400: '#7ea6ff',
          500: '#567fff',
          600: '#3d5ff2',
          700: '#2f48d0',
          800: '#263aa6',
          900: '#223487',
        },
      },
    },
  },
  plugins: [],
} satisfies Config