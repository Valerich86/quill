import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8C6F65",
        light: "#F2F2F2",
        dark: "#1B1026",
        accent_1: "#555931",
        accent_2: "#D98C5F",
      },
      spacing: {
        offsetY: "100px",
        offsetX: "10%",
      },
    },
  },
  plugins: [],
};

export default config;