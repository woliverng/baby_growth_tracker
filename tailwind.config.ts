import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF0EE',
          100: '#FFD9D4',
          200: '#FFB3A8',
          300: '#FF8A80',
          400: '#FF6B5C',
          500: '#F44336',
          600: '#D32F2F',
        },
        softyellow: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFEE58',
          300: '#FFD54F',
          400: '#FFC107',
        },
        warmbg: '#FFF8F6',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
