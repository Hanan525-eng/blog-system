
/** @type {import('tailwindcss').Config} */
import lineClamp from '@tailwindcss/line-clamp';

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d8b4fe", // بنفسجي فاتح
        dark: "#1f2937", // لمسة سوداء
      },
    },
  },
  plugins: [
    lineClamp,
  ],
};

export default config;
