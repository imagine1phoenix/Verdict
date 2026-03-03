import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        borderRadius: {
            none: "0",
            DEFAULT: "0",
            sm: "0",
            md: "0",
            lg: "0",
            xl: "0",
            "2xl": "0",
            "3xl": "0",
            full: "0",
        },
        extend: {
            colors: {
                newsprint: "#F9F9F7",
                ink: "#111111",
                neutral: "#737373",
                accent: "#CC0000",
            },
            fontFamily: {
                serif: ["'Times New Roman'", "Georgia", "serif"],
                sans: ["'Inter'", "'Helvetica Neue'", "sans-serif"],
                mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
            },
        },
    },
    plugins: [],
};
export default config;
