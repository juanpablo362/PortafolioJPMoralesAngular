/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#5B8FD9',
          soft: 'rgba(91, 143, 217, 0.12)',
          muted: 'rgba(91, 143, 217, 0.35)',
        },
        surface: {
          DEFAULT: '#18181b',
          elevated: '#27272a',
        },
      },
    },
  },
  plugins: [],
}
