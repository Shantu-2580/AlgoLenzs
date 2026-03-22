/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0a0a0f',
        surface: '#111118',
        panel: '#0d0d16',
        editor: '#0b0b12',
        'neon-border': '#1e1e2e',
        'neon-mint': '#00f5c4',
        'neon-purple': '#7c6af7',
        'text-main': '#e8e8f0',
        'text-muted': '#5a5a7a',
        danger: '#ff4f6d',
      },
      fontFamily: {
        display: ['Space Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(0,245,196,0.35), 0 0 18px rgba(0,245,196,0.2)',
      },
      animation: {
        'logo-shift': 'logo-shift 6s linear infinite',
        shake: 'shake 0.35s ease-in-out',
      },
    },
  },
  plugins: [],
}

