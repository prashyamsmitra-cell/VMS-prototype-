/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#dc2626',
        secondary: '#1d4ed8',
        accent: '#8b5cf6',
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm-light': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg-light': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
};
