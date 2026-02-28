import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: '#f8f4ed', bg2: '#f2ece0', bg3: '#ede5d4',
        border: '#e8dfc8', border2: '#d4c8a8',
        gold: '#b8922a', goldMid: '#c9a84c', goldPale: '#f5e9c4',
        ink: '#1a1410', ink2: '#4a3f30', ink3: '#8a7a60', ink4: '#b5a88a',
      },
      boxShadow: {
        'ios': '0 2px 20px rgba(100,80,40,0.07), 0 1px 4px rgba(100,80,40,0.05)',
        'ios-lg': '0 8px 48px rgba(100,80,40,0.12), 0 2px 8px rgba(100,80,40,0.08)',
      }
    },
  },
  plugins: [],
};
export default config;