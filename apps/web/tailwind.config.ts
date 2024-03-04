import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      inherit: "inherit",
      transparent: "transparent",
      modal: "rgba(0, 0, 0, 0.2)",
      avatar: "rgba(0, 0, 0, 0.08)",
      blue: "#0000FF",
      danger: "#DE1B1B",
      green: "#20a820",
      disabledDark: "rgba(0, 0, 0, 0.7)",
      "grey-100": "#161C1D",
      "grey-200": "#2B373B",
      "grey-300": "#415358",
      "grey-400": "#576E75",
      "grey-500": "#6C8A93",
      "grey-600": "#8AA1A8",
      "grey-700": "#A8B9BE",
      "grey-800": "#C4D0D4",
      "grey-900": "#E2E8EA",
    },
    fontSize: {
      // px: rem
      "8px": "0.5rem",
      "12px": "0.75rem",
      "14px": "0.875rem",
      "15px": "0.938rem",
      "16px": "1rem",
      "18px": "1.125rem",
      "20px": "1.25rem",
      "24px": "1.5rem",
      "30px": "1.875rem",
      "32px": "2rem",
      "34px": "2.125rem",
      "36px": "2.25rem",
      "40px": "2.5rem",
      "48px": "3rem",
      "64px": "4rem",
      "72px": "4.5rem",
      "108px": "6.75rem",
    },
    fontWeight: {
      100: "100",
      200: "200",
      300: "300",
      400: "400",
      500: "500",
      600: "600",
      700: "700",
      800: "800",
      900: "900",
    },
    spacing: {
      "0px": "0px",
      "2px": "2px",
      "4px": "4px",
      "8px": "8px",
      "12px": "12px",
      "14px": "14px",
      "16px": "16px",
      "18px": "18px",
      "20px": "20px",
      "24px": "24px",
      "30px": "30px",
      "32px": "32px",
      "36px": "36px",
      "40px": "40px",
      "48px": "48px",
      "56px": "56px",
      "64px": "64px",
      "72px": "72px",
      "80px": "80px",
      "96px": "96px",
      "112px": "112px",
      "128px": "128px",
    },
    borderRadius: {
      circle: "50%",
      "0px": "0px",
      "4px": "4px",
      "6px": "6px",
      "7px": "7px",
      "8px": "8px",
      "10px": "10px",
      "12px": "12px",
      "14px": "14px",
      "20px": "20px",
      "30px": "30px",
      "36px": "36px",
      "50px": "50px",
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      landingPage1200: { max: "1200px" },
      // => @media (max-width: 1200px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      landingPage873: { max: "873px" },
      // => @media (max-width: 873px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xsm: { max: "400px" },
      // => @media (max-width: 400px) { ... }
    },
  },
  plugins: [],
};
export default config;
