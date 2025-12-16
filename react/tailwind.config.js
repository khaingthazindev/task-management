/** @type {import('tailwindcss').Config} */
export default {
    prefix: 'tw-',
    content: ["./src/**/*.{html,js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                arizonia: ['Arizonia', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

