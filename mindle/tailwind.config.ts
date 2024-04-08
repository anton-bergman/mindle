import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary_background: "#171717",
        secondary_menubar: "#282828",
        text_color: "#FFFFFF",
        google_text: "#858585",
        github_btn: "#333333",
        keyboard: "#818384",
      },
      animation: {
        vflip: "flipVertical 1s",
        headShake: "headShake 0.7s",
      },
      keyframes: {
        flipVertical: {
          "50%": { transform: "rotateX(180deg)" },
        },
        headShake: {
          "0%": {
            transform: "translateX(0)",
          },
          "6.5%": {
            transform: "translateX(-6px) rotateY(-9deg)",
          },

          "18.5%": {
            transform: "translateX(5px) rotateY(7deg)",
          },

          "31.5%": {
            transform: "translateX(-3px) rotateY(-5deg)",
          },

          "43.5%": {
            transform: "translateX(2px) rotateY(3deg)",
          },
          "50%": {
            transform: "translateX(0)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {},
  },
  spacing: {
    "128": "32rem",
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
