/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'kanji-primary': '#4f46e5', // Indigo
                'kanji-canvas': '#ffffff',
            }
        },
    },
    plugins: [],
}