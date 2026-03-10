import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F2EBD9",
        ink: "#111108",
        faded: "#6B6252",
        rule: "#C8BCA8",
        brick: "#7A2515",
        link: "#00008B",
        "link-visited": "#551A8B",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        courier: ["var(--font-courier)", "monospace"],
      },
      maxWidth: {
        board: "680px",
      },
    },
  },
  plugins: [],
};

export default config;
