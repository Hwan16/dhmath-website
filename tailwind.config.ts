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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 메인 핑크 컬러
        primary: {
          50: '#FFF0F3',
          100: '#FFE0E6',
          200: '#FFC1CD',
          300: '#FF8FAB',  // 메인 핑크
          400: '#FF6B8A',
          500: '#FF4D6D',
          600: '#E63956',
          700: '#C02A44',
          800: '#9A2238',
          900: '#7D1D2F',
        },
        // 살구/피치 컬러
        peach: {
          50: '#FFF8F0',
          100: '#FFECD9',
          200: '#FFD4A3',  // 메인 살구색
          300: '#FFBC6D',
          400: '#FFA537',
          500: '#FF8E01',
        },
        // 민트 (포인트)
        accent: {
          100: '#D4F5E9',
          200: '#A8E6CF',
          300: '#7DD3B5',
          400: '#52C09B',
          500: '#2EAD82',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
