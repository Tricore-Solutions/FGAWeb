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
          'gulf-stream-dark': '#6fa0a1', // Hover state for gulf-stream
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
        transitionTimingFunction: {
          'slow': 'cubic-bezier(.405, 0, .025, 1)',
          'minor-spring': 'cubic-bezier(0.18,0.89,0.82,1.04)',
        },
        spacing: {
          'xs': '0.25rem',   // 4px
          'sm': '0.5rem',    // 8px
          'md': '0.75rem',   // 12px
          'base': '1rem',    // 16px
          'lg': '1.5rem',    // 24px
          'xl': '2rem',      // 32px
          '2xl': '3rem',     // 48px
          '3xl': '4rem',     // 64px
          '4xl': '5rem',     // 80px
        },
        fontWeight: {
          'regular': 400,
          'medium': 500,
          'semibold': 600,
          'bold': 700,
        },
        letterSpacing: {
          'sm': '0.05em',
        },
      },
    },
  }