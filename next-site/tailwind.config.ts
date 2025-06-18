import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4166f5',
        secondary: '#fca311',
      },
    },
  },
  plugins: [],
}

export default config

