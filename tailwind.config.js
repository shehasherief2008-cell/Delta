/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#153E35',
          dark: '#0D2923',
          light: '#1D5247',
        },
        primary: {
          DEFAULT: '#27835D',
          hover: '#1F6A4B',
          light: '#359E72',
          subtle: '#E8F5EE',
        },
        mint: {
          DEFAULT: '#C8F0B8',
          light: '#E2F7DA',
          dark: '#A8DB93',
        },
        sand: {
          DEFAULT: '#FAF9F4',
          subtle: '#F4F2EA',
          border: '#E8E5D9',
        },
        charcoal: {
          DEFAULT: '#202A27',
          muted: '#52605B',
          light: '#7F8E89',
        },
        coral: {
          DEFAULT: '#F28B75',
          light: '#FDECE8',
          dark: '#DC6750',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(21, 62, 53, 0.06), 0 2px 6px -1px rgba(21, 62, 53, 0.04)',
        'card': '0 8px 30px rgba(21, 62, 53, 0.08)',
        'lifted': '0 20px 40px -15px rgba(21, 62, 53, 0.12)',
      },
    },
  },
  plugins: [],
}

