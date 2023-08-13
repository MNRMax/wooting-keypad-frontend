/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
            "background": "#1f2937",
          },
        },
      },
    plugins: [],
}

