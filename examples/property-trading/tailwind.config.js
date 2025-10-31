/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#6d6eff',
        'accent-hover': '#5456ff',
        success: '#2bc37b',
        error: '#ef5350',
        warning: '#f3b13b',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'lg': '1.35rem',
        'md': '1.05rem',
      },
      backdropBlur: {
        'glass': '18px',
      },
    },
  },
  plugins: [],
}
