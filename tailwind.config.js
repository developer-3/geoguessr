/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
        transitionProperty: {
            'map': 'width, height, opacity'
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '100' }
            }
        },
        animation: {
            'fade-in': 'fadeIn 1s linear 1'
        }
    },
  },
  plugins: [],
}
