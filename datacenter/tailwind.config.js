/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Pretendard', 'sans-serif'],
            },
        },
    },
    safelist: [
        {
            pattern:
                /^(bg|border|hover:border|hover:bg)-(emerald|blue|rose|teal|yellow|green|red)-(50|100|200|300|400|500|600|700)$/,
            variants: ['hover'],
        },
    ],
    plugins: [],
};
