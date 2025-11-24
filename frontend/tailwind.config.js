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
      },
    },
  }