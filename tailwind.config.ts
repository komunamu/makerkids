import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: { color: '#2563EB' },
            'h1,h2,h3,h4': { color: '#111827', fontWeight: '600' },
            code: { color: '#1d4ed8', backgroundColor: '#dbeafe', borderRadius: '4px', padding: '2px 6px' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: { backgroundColor: '#1e293b', color: '#e2e8f0' },
            table: { width: '100%' },
            'th': { backgroundColor: '#f1f5f9', color: '#1e3a5f', fontWeight: '600' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
