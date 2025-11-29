/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          heading: ['Poppins', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
        },
        colors: {
          'gulf-stream': '#80b3b4',
          'river-bed': '#454f59',
          'oslo-gray': '#7f858c',
          'geyser': '#d5e0e1',
        },
        boxShadow: {
          'none': 'none',
          'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
          'none': '0',
          'sm': '0.125rem', // 2px
          'base': '0.25rem', // 4px
          'md': '0.375rem', // 6px
          'lg': '0.5rem', // 8px
          'full': '9999px', // Fully rounded
        },
        transitionDuration: {
          'fast': '150ms',
          'base': '200ms',
          'slow': '300ms',
        },
      },
    },
  }