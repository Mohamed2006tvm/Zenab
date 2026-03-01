/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                zenab: {
                    light: '#e6f4ea',
                    DEFAULT: '#34a853',
                    dark: '#1e8e3e',
                }
            }
        },
    },
    plugins: [],
}
