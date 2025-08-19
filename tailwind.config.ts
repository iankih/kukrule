import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-main': '#2D5F3F',
        'primary-hover': '#36503F',
        'primary-active': '#1A3323',
        'primary-light': '#83A58F',
        'primary-lighter': '#73FAA4',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'ui-sans-serif', 'system-ui', '-apple-system', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config