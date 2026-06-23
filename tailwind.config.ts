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
        ev: {
          primary: '#10b981', // Green for EV theme
          secondary: '#3b82f6', // Blue
          accent: '#06b6d4', // Cyan
          dark: '#1e293b',
          light: '#f1f5f9',
        },
        // --- Design system tokens (editorial palette) ---
        // Warm ink-on-paper foundation with an emerald "energy" accent.
        ink: {
          DEFAULT: '#11150F',
          900: '#11150F',
          800: '#1D231C',
          700: '#2F372E',
          600: '#454E44',
          500: '#5E675C',
          400: '#828B80',
          300: '#A7AFA4',
        },
        paper: {
          DEFAULT: '#FBF7EE',
          100: '#FFFDF8',
          200: '#F4EEE0',
          300: '#E9E1CF',
        },
        brand: {
          DEFAULT: '#0E9F6E',
          50: '#E9FBF3',
          100: '#C8F4E0',
          200: '#97E9C6',
          300: '#5DD9A6',
          400: '#23C088',
          500: '#0E9F6E',
          600: '#0B7F58',
          700: '#0B6648',
          800: '#0B5039',
        },
        gold: {
          DEFAULT: '#E0A33C',
          light: '#F4D18A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Newsreader', 'Georgia', 'serif'],
      },
      borderRadius: {
        pill: '999px',
        card: '16px',
        panel: '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,21,15,0.04), 0 14px 32px -18px rgba(17,21,15,0.18)',
        raised: '0 2px 10px rgba(17,21,15,0.06), 0 28px 60px -28px rgba(17,21,15,0.28)',
      },
    },
  },
  plugins: [],
}
export default config

